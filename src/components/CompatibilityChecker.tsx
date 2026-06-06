import { useState, useEffect } from "react";
import { calculateCompatibility } from "@/lib/compatibility";
import { parseBirthDateInput, MIN_BIRTH_DATE, toDateInputValue } from "@/lib/birth-date";
import { getZodiacSign } from "@/lib/zodiac";
import { addOrUpdateHistoryEntry } from "@/lib/storage";
import { type CelestiaReport } from "@/lib/report";
import { CustomDatePicker } from "./CustomDatePicker";

type CompatibilityCheckerProps = {
  currentReport: CelestiaReport;
  onUpdateHistory: () => void;
};

export function CompatibilityChecker({
  currentReport,
  onUpdateHistory,
}: CompatibilityCheckerProps) {
  const [partnerDob, setPartnerDob] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [maxBirthDate, setMaxBirthDate] = useState("");
  const [result, setResult] = useState<{
    lovePercent: number;
    friendshipPercent: number;
    strength: string;
    friction: string;
    advice: string;
    partnerSign: string;
    partnerSymbol: string;
  } | null>(null);

  useEffect(() => {
    setMaxBirthDate(toDateInputValue(new Date()));
  }, []);

  useEffect(() => {
    if (currentReport.compatibility) {
      setPartnerDob(currentReport.compatibility.secondBirthDate);
      const validation = parseBirthDateInput(currentReport.compatibility.secondBirthDate);
      const vCurrent = parseBirthDateInput(currentReport.profile.birthDate);
      if (validation.ok && vCurrent.ok) {
        const partnerSign = getZodiacSign(validation.month, validation.day);
        const userSignObj = getZodiacSign(vCurrent.month, vCurrent.day);
        const compatibility = calculateCompatibility(userSignObj, partnerSign);
        setResult({
          lovePercent: compatibility.lovePercent,
          friendshipPercent: compatibility.friendshipPercent,
          strength: compatibility.strength,
          friction: compatibility.friction,
          advice: compatibility.advice,
          partnerSign: partnerSign.name,
          partnerSymbol: partnerSign.symbol,
        });
      }
    } else {
      setPartnerDob("");
      setResult(null);
    }
  }, [currentReport]);

  function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const validation = parseBirthDateInput(partnerDob);
    if (!validation.ok) {
      setError(validation.error);
      setResult(null);
      return;
    }

    const vCurrent = parseBirthDateInput(currentReport.profile.birthDate);
    if (!vCurrent.ok) return;

    const partnerSign = getZodiacSign(validation.month, validation.day);
    const userSignObj = getZodiacSign(vCurrent.month, vCurrent.day);

    const compatibility = calculateCompatibility(userSignObj, partnerSign);

    const matchResult = {
      lovePercent: compatibility.lovePercent,
      friendshipPercent: compatibility.friendshipPercent,
      strength: compatibility.strength,
      friction: compatibility.friction,
      advice: compatibility.advice,
      partnerSign: partnerSign.name,
      partnerSymbol: partnerSign.symbol,
    };

    setResult(matchResult);

    // Save compatibility info into the current report in history
    const updatedReport: CelestiaReport = {
      ...currentReport,
      compatibility: {
        secondBirthDate: validation.value,
        secondSign: partnerSign.name,
        lovePercent: compatibility.lovePercent,
        friendshipPercent: compatibility.friendshipPercent,
        strength: compatibility.strength,
        friction: compatibility.friction,
        advice: compatibility.advice,
      },
    };

    addOrUpdateHistoryEntry(updatedReport);
    onUpdateHistory();
  }

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 space-y-4 border border-border/40">
      <div>
        <h3 className="font-display text-xl text-gold">Zodiac Compatibility</h3>
        <p className="text-xs text-muted-foreground">
          See how your alignments harmonize in love and friendship.
        </p>
      </div>

      <form onSubmit={handleCheck} className="space-y-3" noValidate>
        <div>
          <label
            htmlFor="partner-dob"
            className="block text-[10px] uppercase tracking-widest text-muted-foreground"
          >
            Their Date of Birth
          </label>
          <CustomDatePicker
            id="partner-dob"
            value={partnerDob}
            min={MIN_BIRTH_DATE}
            max={maxBirthDate || undefined}
            onChange={(val) => {
              setPartnerDob(val);
              if (error) setError(null);
            }}
          />
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-1 text-xs text-destructive-foreground"
          >
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-full border border-[var(--gold)]/40 py-2 text-xs font-medium text-gold hover:bg-[var(--gold)]/10 transition-colors focus-visible:ring-2 focus-visible:ring-[var(--gold)]/30 cursor-pointer"
        >
          Check Harmony
        </button>
      </form>

      {result && (
        <div
          className="mt-4 border-t border-border pt-4 space-y-3 animate-reveal-up"
          aria-live="polite"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-ivory">Their Sign:</span>
            <span className="text-sm font-display text-gold flex items-center gap-1">
              {result.partnerSign} <span aria-hidden="true">{result.partnerSymbol}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-[oklch(1_0_0/0.02)] p-2.5 text-center">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Love Match
              </div>
              <div className="mt-1 text-2xl font-display text-rose-400 font-bold">
                {result.lovePercent}%
              </div>
            </div>
            <div className="rounded-xl border border-border bg-[oklch(1_0_0/0.02)] p-2.5 text-center">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Friendship
              </div>
              <div className="mt-1 text-2xl font-display text-sky-400 font-bold">
                {result.friendshipPercent}%
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[oklch(1_0_0/0.03)] p-3 text-xs leading-relaxed text-foreground/90 border border-border space-y-2.5">
            <div>
              <div className="font-semibold text-gold mb-0.5 text-[9px] uppercase tracking-wider">
                Mutual Strength
              </div>
              <div>{result.strength}</div>
            </div>
            <div className="border-t border-border/40 pt-2">
              <div className="font-semibold text-rose-400 mb-0.5 text-[9px] uppercase tracking-wider">
                Potential Friction
              </div>
              <div>{result.friction}</div>
            </div>
            <div className="border-t border-border/40 pt-2">
              <div className="font-semibold text-sky-400 mb-0.5 text-[9px] uppercase tracking-wider">
                Relationship Advice
              </div>
              <div>{result.advice}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
