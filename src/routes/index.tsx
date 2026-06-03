import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  INVALID_DATE_ERROR,
  MIN_BIRTH_DATE,
  parseBirthDateInput,
  toDateInputValue,
} from "@/lib/birth-date";
import { getZodiacSign, type ZodiacSign } from "@/lib/zodiac";
import { StarField } from "@/components/StarField";
import { ConstellationRing } from "@/components/ConstellationRing";
import { ZodiacResult } from "@/components/ZodiacResult";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Find Your Zodiac Sign — Western Sun Sign Finder" },
      {
        name: "description",
        content:
          "Enter your date of birth and instantly reveal your Western zodiac sun sign with element, modality, ruling planet, and traits.",
      },
      { property: "og:title", content: "Find Your Zodiac Sign" },
      {
        property: "og:description",
        content: "A calm, mystical sun sign finder. Enter your birthday, discover your sign.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sign, setSign] = useState<ZodiacSign | null>(null);
  const [maxBirthDate, setMaxBirthDate] = useState("");

  useEffect(() => {
    setMaxBirthDate(toDateInputValue(new Date()));
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const dateControl = e.currentTarget.elements.namedItem("date-of-birth") as HTMLInputElement;
    if (!date && dateControl.validity.badInput) {
      setSign(null);
      setError(INVALID_DATE_ERROR);
      return;
    }

    const validation = parseBirthDateInput(dateControl.value);
    if (!validation.ok) {
      setSign(null);
      setError(validation.error);
      return;
    }

    setSign(getZodiacSign(validation.month, validation.day));
  }

  function handleReset() {
    setSign(null);
    setDate("");
    setError(null);
  }

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-background">
      <StarField count={30} />
      {/* Soft constellation lines */}
      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
      >
        <defs>
          <linearGradient id="line" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--gold)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points="10,120 80,80 160,140 240,90 330,160"
          fill="none"
          stroke="url(#line)"
          strokeWidth="0.6"
        />
        <polyline
          points="60,500 140,460 220,520 310,470 400,540"
          fill="none"
          stroke="url(#line)"
          strokeWidth="0.6"
        />
      </svg>

      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 py-4 sm:py-6">
        {/* Header */}
        <header className="flex items-center justify-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
          <span aria-hidden="true">✦</span>
          <span>Celestia</span>
          <span aria-hidden="true">✦</span>
        </header>

        {!sign ? (
          <div className="flex flex-1 flex-col justify-center py-6 sm:py-8">
            {/* Hero */}
            <section className="flex flex-col items-center text-center">
              <div className="relative h-44 w-44 sm:h-56 sm:w-56 md:h-60 md:w-60">
                <ConstellationRing className="absolute inset-0" />
              </div>
              <h1 className="mt-5 font-display text-3xl leading-[1.1] gold-gradient sm:text-5xl">
                Find Your Zodiac Sign
              </h1>
              <p className="mt-2.5 max-w-md text-sm sm:text-base text-foreground/75">
                Enter your date of birth and discover your Western zodiac sun sign.
              </p>
            </section>

            {/* Input card */}
            <section className="mt-6">
              <form onSubmit={handleSubmit} className="glass rounded-2xl p-5 sm:p-6" noValidate>
                <label
                  htmlFor="dob"
                  className="block text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  Date of birth
                </label>
                <input
                  id="dob"
                  name="date-of-birth"
                  type="date"
                  value={date}
                  min={MIN_BIRTH_DATE}
                  max={maxBirthDate || undefined}
                  aria-required="true"
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? "dob-help dob-error" : "dob-help"}
                  suppressHydrationWarning
                  onChange={(event) => {
                    setDate(event.target.value);
                    if (error) setError(null);
                  }}
                  style={{ caretColor: "transparent" }}
                  className="mt-1.5 w-full rounded-xl border border-border bg-[oklch(1_0_0/0.04)] px-3 py-2.5 text-sm text-ivory outline-none [color-scheme:dark] transition-colors hover:bg-[oklch(1_0_0/0.06)] focus:border-[var(--gold)]/60 focus-visible:ring-2 focus-visible:ring-[var(--gold)]/30"
                />

                {error && (
                  <div
                    id="dob-error"
                    role="alert"
                    className="mt-2 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs text-destructive-foreground"
                  >
                    <span aria-hidden="true">⚠</span>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="glow-gold mt-4 w-full rounded-full bg-gradient-to-r from-[oklch(0.88_0.1_85)] to-[oklch(0.78_0.14_75)] px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]"
                >
                  Reveal My Sign
                </button>

                <p id="dob-help" className="mt-3 text-center text-[10px] text-muted-foreground">
                  Only your month and day are used. Your date is not stored.
                </p>
              </form>
            </section>
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-center py-6 sm:py-8">
            <section className="mt-3">
              <ZodiacResult sign={sign} selectedDate={date} onReset={handleReset} />
            </section>
          </div>
        )}

        <footer className="mt-auto pb-1 pt-4">
          <p className="mx-auto max-w-md text-center text-[10px] leading-relaxed text-muted-foreground/60">
            This is a simple sun sign finder based on common Western zodiac date ranges. For
            entertainment and self-reflection only.
          </p>
        </footer>
      </main>
    </div>
  );
}
