import { useState, useEffect } from "react";
import type { TransitReport } from "@/lib/astro-types";
import { getCurrentTransitReport } from "@/lib/astronomy-engine";
import { Sparkles, Moon, Sun, Clock } from "lucide-react";

type TransitCardProps = {
  onTransitLoaded?: (transitReport: TransitReport) => void;
};

export function TransitCard({ onTransitLoaded }: TransitCardProps = {}) {
  const [transits, setTransits] = useState<TransitReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let active = true;

    async function fetchTransits() {
      try {
        const response = await fetch("/api/transits");
        if (!response.ok) {
          throw new Error("Failed to load current transits.");
        }
        const data = await response.json();
        if (data.ok && active) {
          setTransits(data.transits);
          if (onTransitLoaded) {
            onTransitLoaded(data.transits);
          }
        } else {
          throw new Error("API returned ok: false");
        }
      } catch (err) {
        console.error(err);
        if (active) {
          try {
            // Client-side fallback
            const fallbackReport = getCurrentTransitReport();

            const hasSun = fallbackReport.planets.some((p) => p.planet === "Sun");
            const hasMoon = fallbackReport.planets.some((p) => p.planet === "Moon");

            if (!hasSun || !hasMoon) throw new Error("Fallback missing required planets");

            fallbackReport.source = "fallback";
            setTransits(fallbackReport);
            if (onTransitLoaded) {
              onTransitLoaded(fallbackReport);
            }
          } catch (fallbackErr) {
            console.error("Fallback failed:", fallbackErr);
            setError(true);
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchTransits();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="glass rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center space-y-2 py-8 border border-border/40">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--gold)] border-t-transparent" />
        <span className="text-xs text-muted-foreground">Reading today's alignments...</span>
      </div>
    );
  }

  if (error || !transits) {
    return (
      <div className="glass rounded-2xl p-5 sm:p-6 text-center border border-border/40">
        <p className="text-xs text-muted-foreground">
          Today's sky data could not be loaded. Your personal horoscope is still available.
        </p>
      </div>
    );
  }

  const { moonPhase, planets, summary, generatedAt } = transits;

  // Extract quick signs for Sun, Moon, and personal planets
  const getPlanetSign = (name: string) => {
    return planets.find((p) => p.planet === name)?.sign || "Unknown";
  };

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 space-y-4 animate-reveal-up border border-border/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Moon size={18} className="text-gold" />
          <h3 className="font-display text-xl text-gold">Today's Sky & Transits</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground uppercase tracking-widest font-mono">
          <Clock size={10} />
          <span>
            {transits.source === "fallback" ? "Source: Local astronomy fallback" : "Real-time"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {/* Moon Phase Item */}
        <div className="rounded-xl border border-border/60 bg-[oklch(1_0_0/0.02)] p-3 text-center flex flex-col justify-center items-center">
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
            Moon Phase
          </span>
          <span className="mt-1.5 text-xs font-semibold text-ivory">{moonPhase.name}</span>
          {moonPhase.illumination !== undefined && (
            <span className="text-[9px] text-muted-foreground mt-0.5">
              {moonPhase.illumination}% lit
            </span>
          )}
        </div>

        {/* Sun Sign */}
        <div className="rounded-xl border border-border/60 bg-[oklch(1_0_0/0.02)] p-3 text-center flex flex-col justify-center items-center">
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
            Sun Sign
          </span>
          <span className="mt-1.5 text-xs font-semibold text-ivory">{getPlanetSign("Sun")}</span>
        </div>

        {/* Moon Sign */}
        <div className="rounded-xl border border-border/60 bg-[oklch(1_0_0/0.02)] p-3 text-center flex flex-col justify-center items-center">
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
            Moon Sign
          </span>
          <span className="mt-1.5 text-xs font-semibold text-ivory">{getPlanetSign("Moon")}</span>
        </div>

        {/* Inner Planets */}
        <div className="rounded-xl border border-border/60 bg-[oklch(1_0_0/0.02)] p-3 text-center flex flex-col justify-center items-center">
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
            Inner Planets
          </span>
          <div className="mt-1 flex flex-col gap-0.5 text-[10px] font-semibold text-ivory">
            {getPlanetSign("Mercury") !== "Unknown" && (
              <span>Mercury in {getPlanetSign("Mercury")}</span>
            )}
            {getPlanetSign("Venus") !== "Unknown" && <span>Venus in {getPlanetSign("Venus")}</span>}
            {getPlanetSign("Mars") !== "Unknown" && <span>Mars in {getPlanetSign("Mars")}</span>}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-[oklch(1_0_0/0.01)] p-3 space-y-2">
        <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">
          Astronomical Forecast Summary
        </span>
        <p className="text-xs leading-relaxed text-foreground/90">{summary}</p>
      </div>

      {/* Details accordion/dropdown */}
      <div className="pt-2 border-t border-border/20">
        <details className="group">
          <summary className="text-[10px] text-gold/80 hover:text-gold cursor-pointer list-none flex items-center justify-between font-semibold">
            <span>Show All Planetary Longitudes</span>
            <span className="transition-transform group-open:rotate-180">▼</span>
          </summary>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground max-h-40 overflow-y-auto pr-1">
            {planets.map((p, idx) => (
              <div
                key={`${p.planet}-${idx}`}
                className="flex justify-between items-center rounded-lg border border-border/40 bg-[oklch(1_0_0/0.01)] p-2"
              >
                <span className="font-medium text-ivory">{p.planet}</span>
                <span className="font-mono text-[10px]">
                  {p.sign} {p.degreeInSign.toFixed(1)}°
                </span>
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}
