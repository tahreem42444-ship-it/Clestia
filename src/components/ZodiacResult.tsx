import { useMemo } from "react";
import type { ZodiacSign } from "@/lib/zodiac";

type ElementSymbolProps = {
  element: "Fire" | "Earth" | "Air" | "Water";
  className?: string;
};

export function ElementSymbol({ element, className = "" }: ElementSymbolProps) {
  switch (element) {
    case "Fire":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="fireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.92 0.09 90)" />
              <stop offset="100%" stopColor="oklch(0.78 0.14 75)" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="url(#fireGrad)"
            strokeWidth="0.5"
            strokeOpacity="0.25"
          />
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="url(#fireGrad)"
            strokeWidth="0.5"
            strokeOpacity="0.15"
            strokeDasharray="2 4"
          />
          <polygon
            points="50,22 22,70 78,70"
            fill="none"
            stroke="url(#fireGrad)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="22" r="2.5" fill="url(#fireGrad)" />
          <circle cx="22" cy="70" r="2.5" fill="url(#fireGrad)" />
          <circle cx="78" cy="70" r="2.5" fill="url(#fireGrad)" />
        </svg>
      );
    case "Water":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.92 0.09 90)" />
              <stop offset="100%" stopColor="oklch(0.78 0.14 75)" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="url(#waterGrad)"
            strokeWidth="0.5"
            strokeOpacity="0.25"
          />
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="url(#waterGrad)"
            strokeWidth="0.5"
            strokeOpacity="0.15"
            strokeDasharray="2 4"
          />
          <polygon
            points="50,78 22,30 78,30"
            fill="none"
            stroke="url(#waterGrad)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="78" r="2.5" fill="url(#waterGrad)" />
          <circle cx="22" cy="30" r="2.5" fill="url(#waterGrad)" />
          <circle cx="78" cy="30" r="2.5" fill="url(#waterGrad)" />
        </svg>
      );
    case "Air":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="airGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.92 0.09 90)" />
              <stop offset="100%" stopColor="oklch(0.78 0.14 75)" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="url(#airGrad)"
            strokeWidth="0.5"
            strokeOpacity="0.25"
          />
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="url(#airGrad)"
            strokeWidth="0.5"
            strokeOpacity="0.15"
            strokeDasharray="2 4"
          />
          <polygon
            points="50,22 22,70 78,70"
            fill="none"
            stroke="url(#airGrad)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line
            x1="33"
            y1="40"
            x2="67"
            y2="40"
            stroke="url(#airGrad)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="50" cy="22" r="2.5" fill="url(#airGrad)" />
          <circle cx="22" cy="70" r="2.5" fill="url(#airGrad)" />
          <circle cx="78" cy="70" r="2.5" fill="url(#airGrad)" />
        </svg>
      );
    case "Earth":
      return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="earthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.92 0.09 90)" />
              <stop offset="100%" stopColor="oklch(0.78 0.14 75)" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="url(#earthGrad)"
            strokeWidth="0.5"
            strokeOpacity="0.25"
          />
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="url(#earthGrad)"
            strokeWidth="0.5"
            strokeOpacity="0.15"
            strokeDasharray="2 4"
          />
          <polygon
            points="50,78 22,30 78,30"
            fill="none"
            stroke="url(#earthGrad)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line
            x1="33"
            y1="60"
            x2="67"
            y2="60"
            stroke="url(#earthGrad)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="50" cy="78" r="2.5" fill="url(#earthGrad)" />
          <circle cx="22" cy="30" r="2.5" fill="url(#earthGrad)" />
          <circle cx="78" cy="30" r="2.5" fill="url(#earthGrad)" />
        </svg>
      );
  }
}

export function ZodiacResult({
  sign,
  selectedDate,
  onReset,
}: {
  sign: ZodiacSign;
  selectedDate: string;
  onReset: () => void;
}) {
  const formattedBirthDate = useMemo(() => {
    if (!selectedDate) return "";
    const parts = selectedDate.split("-").map(Number);
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return "";
    const [y, m, d] = parts;
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedDate]);

  return (
    <div
      className="glass relative overflow-hidden rounded-2xl p-5 animate-reveal-up sm:p-6"
      role="region"
      aria-live="polite"
      aria-labelledby="zodiac-result-title"
    >
      <div
        aria-hidden="true"
        className="absolute -right-20 -top-20 h-52 w-52 rounded-full opacity-20 blur-xl"
        style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
      />
      <div className="relative flex flex-col items-center text-center">
        <div className="h-14 w-14 sm:h-16 sm:w-16 mb-1 animate-symbol-pop" aria-hidden>
          <ElementSymbol element={sign.element} className="w-full h-full" />
        </div>
        <h2
          id="zodiac-result-title"
          className="mt-1 flex items-center justify-center gap-2 font-display text-3xl gold-gradient sm:text-4xl"
        >
          <span>{sign.name}</span>
          <span className="font-sans text-xl text-[var(--gold)]/80" aria-hidden>
            {sign.symbol}
          </span>
        </h2>
        <p className="mt-0.5 text-xs tracking-widest uppercase text-muted-foreground">
          {sign.dateRange}
        </p>
        {formattedBirthDate && (
          <p className="mt-1 text-xs text-ivory/80 tracking-wide font-sans">
            Born on {formattedBirthDate}
          </p>
        )}

        <div className="mt-4 grid grid-cols-3 gap-2.5 w-full max-w-sm">
          {[
            { label: "Element", value: sign.element },
            { label: "Modality", value: sign.modality },
            { label: "Ruler", value: sign.rulingPlanet },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-border bg-[oklch(1_0_0/0.03)] py-2 px-1.5"
            >
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground">
                {item.label}
              </div>
              <div className="mt-0.5 text-xs font-medium text-ivory">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 w-full">
          <div className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1.5">
            Traits
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {sign.traits.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/5 px-2.5 py-0.5 text-[11px] text-gold"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/85">
          {sign.description}
        </p>

        <button
          onClick={onReset}
          className="mt-5 inline-flex items-center justify-center rounded-full border border-[var(--gold)]/40 px-5 py-2 text-xs text-gold transition-colors hover:bg-[var(--gold)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Try another date
        </button>
      </div>
    </div>
  );
}
