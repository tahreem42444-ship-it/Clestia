import { useState, useEffect } from "react";
import type { CelestiaReport } from "@/lib/report";
import type { BirthChartReport } from "@/lib/astro-types";
import { addOrUpdateHistoryEntry } from "@/lib/storage";
import { Compass, AlertCircle, MapPin } from "lucide-react";

type AdvancedAstrologyCardProps = {
  report: CelestiaReport;
  onUpdateReport: (report: CelestiaReport) => void;
};

export function AdvancedAstrologyCard({ report, onUpdateReport }: AdvancedAstrologyCardProps) {
  const profile = report.profile;
  const [loading, setLoading] = useState(false);
  const [chart, setChart] = useState<BirthChartReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMode, setStatusMode] = useState<
    "idle" | "loading" | "success" | "not_configured" | "location_required" | "failed"
  >("idle");

  useEffect(() => {
    if (report.birthChartReport) {
      setChart(report.birthChartReport);
      setStatusMode("success");
    } else {
      setChart(null);
      setError(null);
      setStatusMode("idle");
    }
  }, [report]);

  const saveChartToReport = (chartData: BirthChartReport) => {
    const updated = { ...report, birthChartReport: chartData };
    onUpdateReport(updated);
    addOrUpdateHistoryEntry(updated);
  };

  const generateChart = async () => {
    if (!profile.birthLocation) {
      setStatusMode("location_required");
      return;
    }

    setLoading(true);
    setError(null);
    setStatusMode("loading");

    try {
      const response = await fetch("/api/astro-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          birthDate: profile.birthDate,
          birthTime: profile.birthTime || "12:00",
          birthLocation: profile.birthLocation,
        }),
      });

      if (!response.ok) {
        throw new Error("Server error generating chart.");
      }

      const data = await response.json();
      if (data.ok && data.birthChart) {
        setChart(data.birthChart);
        setStatusMode("success");
        saveChartToReport(data.birthChart);
      } else {
        if (data.code === "FREE_ASTRO_NOT_CONFIGURED") {
          setStatusMode("not_configured");
        } else if (data.code === "BIRTH_LOCATION_REQUIRED") {
          setStatusMode("location_required");
        } else {
          setError(data.error || "Failed to generate advanced astrology data.");
          setStatusMode("failed");
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      setStatusMode("failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLocalCalculation = () => {
    setLoading(true);
    setStatusMode("loading");

    setTimeout(async () => {
      try {
        const { getPlanetPositions } = await import("@/lib/astronomy-engine");

        let dateObj = new Date(profile.birthDate + "T12:00:00");
        if (profile.birthTime) {
          const [h, m] = profile.birthTime.split(":");
          dateObj = new Date(profile.birthDate + `T${h.padStart(2, "0")}:${m.padStart(2, "0")}:00`);
        }

        const planets = getPlanetPositions(dateObj);
        const sunSign = planets.find((p) => p.planet === "Sun")?.sign;
        const moonSign = planets.find((p) => p.planet === "Moon")?.sign;

        const fallbackChart: BirthChartReport = {
          source: "astronomy-engine-lite",
          planets,
          sunSign,
          moonSign,
        };

        setChart(fallbackChart);
        setStatusMode("success");
        saveChartToReport(fallbackChart);
      } catch (err) {
        setError("Local calculations failed.");
        setStatusMode("failed");
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 space-y-4 animate-reveal-up border border-border/40">
      <div className="flex items-center gap-2">
        <Compass size={18} className="text-gold" />
        <h3 className="font-display text-xl text-gold">Advanced Natal Alignment</h3>
      </div>

      {statusMode === "idle" && (
        <div className="space-y-3">
          <p className="text-xs text-foreground/80 leading-relaxed">
            Generate your advanced birth chart including planet positions computed for your precise
            time and location of birth.
          </p>
          {profile.birthLocation ? (
            <button
              onClick={generateChart}
              disabled={loading}
              className="glow-gold w-full text-xs font-semibold py-2 px-4 rounded-full bg-gradient-to-r from-[oklch(0.88_0.1_85)] to-[oklch(0.78_0.14_75)] text-primary-foreground hover:scale-[1.01] transition-transform cursor-pointer"
            >
              Generate Advanced Chart
            </button>
          ) : (
            <div className="rounded-xl border border-border bg-[oklch(1_0_0/0.02)] p-3 space-y-2">
              <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                <MapPin size={14} className="text-gold mt-0.5 shrink-0" />
                <span>
                  Birth location is required to calculate houses, ascendant and precise planet
                  offsets.
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {statusMode === "loading" && (
        <div className="flex flex-col items-center justify-center py-6 space-y-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--gold)] border-t-transparent" />
          <p className="text-xs text-muted-foreground">Calculating birth chart alignments...</p>
        </div>
      )}

      {statusMode === "location_required" && (
        <div className="rounded-xl border border-warning/40 bg-warning/5 p-3.5 space-y-2 text-xs text-warning-foreground">
          <p className="font-semibold flex items-center gap-1.5 text-gold">
            <AlertCircle size={14} />
            <span>Birth Location Needed</span>
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Please edit your profile and provide a birth city to map your coordinates and calculate
            the advanced chart.
          </p>
        </div>
      )}

      {statusMode === "not_configured" && (
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-[oklch(1_0_0/0.02)] p-3.5 text-xs text-muted-foreground">
            <p className="mb-1 text-gold font-semibold">API Key Not Active</p>
            <p className="leading-relaxed">
              Advanced chart calculation is not enabled on this deployment yet. Your basic report
              still works.
            </p>
          </div>
          <button
            onClick={handleLocalCalculation}
            className="w-full text-xs font-semibold py-2 px-4 rounded-full border border-border text-gold hover:bg-[oklch(1_0_0/0.04)] transition-colors cursor-pointer"
          >
            Calculate Locally with Astronomy Engine
          </button>
        </div>
      )}

      {statusMode === "failed" && (
        <div className="space-y-3">
          <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-3.5 text-xs text-destructive-foreground">
            <p className="mb-1 font-semibold flex items-center gap-1">
              <AlertCircle size={14} />
              <span>Calculation Failed</span>
            </p>
            <p className="text-muted-foreground">
              {error || "Advanced astrology data is temporarily unavailable."}
            </p>
          </div>
          <button
            onClick={handleLocalCalculation}
            className="w-full text-xs font-semibold py-2 px-4 rounded-full border border-border text-gold hover:bg-[oklch(1_0_0/0.04)] transition-colors cursor-pointer"
          >
            Run Offline Fallback Engine
          </button>
        </div>
      )}

      {statusMode === "success" && chart && (
        <div className="space-y-4 animate-reveal-up text-xs">
          <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            <div>
              Source: <span className="font-semibold text-gold uppercase">{chart.source}</span>
            </div>
            {chart.ascendant && (
              <div className="text-right">
                Ascendant: <span className="font-semibold text-ivory">{chart.ascendant}</span>
              </div>
            )}
          </div>

          {chart.planets && chart.planets.length > 0 && (
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                Natal Planetary Positions
              </span>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {chart.planets.map((p, idx) => (
                  <div
                    key={`${p.planet}-${idx}`}
                    className="flex justify-between items-center rounded-lg border border-border/60 bg-[oklch(1_0_0/0.02)] p-2 hover:bg-[oklch(1_0_0/0.04)] transition-colors"
                  >
                    <span className="font-medium text-ivory flex items-center gap-1">
                      {p.planet}
                      {p.retrograde && (
                        <span className="text-[9px] text-orange-400 font-bold" title="Retrograde">
                          ℞
                        </span>
                      )}
                    </span>
                    <span className="text-muted-foreground font-mono text-[10px]">
                      {p.sign} {p.degreeInSign.toFixed(1)}°
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {chart.source === "astronomy-engine-lite" && (
            <p className="text-[10px] text-muted-foreground italic leading-normal border-t border-border/20 pt-2">
              Note: Houses and Ascendant data are omitted when calculated via the local offline
              engine.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
