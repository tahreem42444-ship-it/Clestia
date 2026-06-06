import { useState, type FormEvent, useEffect } from "react";
import {
  INVALID_DATE_ERROR,
  MIN_BIRTH_DATE,
  parseBirthDateInput,
  toDateInputValue,
} from "@/lib/birth-date";
import { getProfile, saveProfile } from "@/lib/storage";
import { type CelestiaProfile } from "@/lib/report";
import { ConstellationRing } from "./ConstellationRing";
import { CustomDateTimePicker } from "./CustomDateTimePicker";
import { BirthLocationPicker } from "./BirthLocationPicker";
import { BirthLocationMap } from "./BirthLocationMap";
import type { BirthLocation } from "@/lib/astro-types";

type ProfileFormProps = {
  onSubmitSuccess: (profile: CelestiaProfile) => void;
};

export function ProfileForm({ onSubmitSuccess }: ProfileFormProps) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [birthTime, setBirthTime] = useState<string | undefined>(undefined);
  const [birthLocation, setBirthLocation] = useState<BirthLocation | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [maxBirthDate, setMaxBirthDate] = useState("");

  useEffect(() => {
    setMaxBirthDate(toDateInputValue(new Date()));
    const existing = getProfile();
    if (existing) {
      setName(existing.name);
      setDob(existing.birthDate);
      setBirthTime(existing.birthTime);
      setBirthLocation(existing.birthLocation);
    }
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required.");
      return;
    }
    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (!dob) {
      setError(INVALID_DATE_ERROR);
      return;
    }

    const validation = parseBirthDateInput(dob);
    if (!validation.ok) {
      setError(validation.error);
      return;
    }

    const newProfile: CelestiaProfile = {
      name: trimmedName,
      birthDate: validation.value,
      birthTime,
      birthLocation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProfile(newProfile);
    onSubmitSuccess(newProfile);
  }

  return (
    <div className="flex flex-1 flex-col justify-center py-6 sm:py-8 animate-fade-in">
      <section className="flex flex-col items-center text-center">
        <div className="relative h-44 w-44 sm:h-56 sm:w-56 md:h-60 md:w-60">
          <ConstellationRing className="absolute inset-0" />
        </div>
        <h1 className="mt-5 font-display text-4xl leading-[1.1] gold-gradient sm:text-5xl">
          Discover Your Celestia Profile
        </h1>
        <p className="mt-2.5 max-w-md text-sm sm:text-base text-foreground/75">
          Enter your name and date of birth to reveal your personalized daily horoscope and
          astrological alignments.
        </p>
      </section>

      <section className="mt-6 mx-auto w-full max-w-md">
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-5 sm:p-6 space-y-4" noValidate>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="profile-name"
                className="block text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                Your Name
              </label>
              <input
                id="profile-name"
                name="name"
                type="text"
                value={name}
                required
                minLength={2}
                aria-required="true"
                onChange={(event) => {
                  setName(event.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter your name"
                className="mt-1.5 w-full rounded-xl border border-border bg-[oklch(1_0_0/0.04)] px-3 py-2.5 text-sm text-ivory outline-none transition-colors hover:bg-[oklch(1_0_0/0.06)] focus:border-[var(--gold)]/60 focus-visible:ring-2 focus-visible:ring-[var(--gold)]/30"
              />
            </div>

            <CustomDateTimePicker
              id="dob"
              dateValue={dob}
              onChangeDate={(value) => {
                setDob(value);
                if (error) setError(null);
              }}
              timeValue={birthTime}
              onChangeTime={(value) => {
                setBirthTime(value);
                if (error) setError(null);
              }}
              minDate={MIN_BIRTH_DATE}
              maxDate={maxBirthDate || undefined}
            />

            <BirthLocationPicker
              value={birthLocation}
              onChange={(loc) => {
                setBirthLocation(loc);
                if (error) setError(null);
              }}
            />

            <BirthLocationMap location={birthLocation} />

            {!birthLocation && (
              <p className="text-[10px] text-muted-foreground italic bg-gold/5 border border-gold/10 rounded-lg p-2">
                ℹ️ Birth location improves chart accuracy, but your report can still be generated
                without it.
              </p>
            )}
          </div>

          {error && (
            <div
              id="dob-error"
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs text-destructive-foreground"
            >
              <span aria-hidden="true">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="glow-gold mt-5 w-full rounded-full bg-gradient-to-r from-[oklch(0.88_0.1_85)] to-[oklch(0.78_0.14_75)] px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99] cursor-pointer"
          >
            Generate My Report
          </button>

          <p id="dob-help" className="mt-3 text-center text-[10px] text-muted-foreground">
            Your information is stored locally in your browser and never shared.
          </p>
        </form>
      </section>
    </div>
  );
}
