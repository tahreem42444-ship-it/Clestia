import { type CelestiaReport } from "@/lib/report.ts";
import type { TransitReport } from "@/lib/astro-types.ts";

type PrintableReportProps = {
  report: CelestiaReport;
  transitReport: TransitReport | null;
};

export function PrintableReport({ report, transitReport }: PrintableReportProps) {
  const formattedDob = (() => {
    const parts = report.profile.birthDate.split("-").map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return report.profile.birthDate;
    const [y, m, d] = parts;
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  })();

  const formattedGeneratedDate = new Date(report.generatedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getPlanetSign = (name: string) => {
    if (!transitReport) return "Unknown";
    return transitReport.planets.find((p) => p.planet === name)?.sign || "Unknown";
  };

  const birthLocStr = report.profile.birthLocation
    ? `${report.profile.birthLocation.name}${
        report.profile.birthLocation.admin1 ? ", " + report.profile.birthLocation.admin1 : ""
      }${report.profile.birthLocation.country ? ", " + report.profile.birthLocation.country : ""}`
    : null;

  return (
    <div className="print-report-container">
      {/* 1. Header */}
      <header className="print-header">
        <div className="print-brand">✦ CELESTIA ✦</div>
        <h1 className="print-title">Personalized Horoscope & Astrology Report</h1>
        <div className="print-meta-date">Generated on {formattedGeneratedDate}</div>
        <div className="print-divider"></div>
      </header>

      {/* 2. Profile Summary */}
      <section className="print-section">
        <h2 className="print-section-title">Cosmic Profile</h2>
        <div className="print-profile-grid">
          <div className="print-profile-item">
            <span className="print-label">Name</span>
            <span className="print-value">{report.profile.name}</span>
          </div>
          <div className="print-profile-item">
            <span className="print-label">Sun Sign</span>
            <span className="print-value">
              {report.zodiac.name} {report.zodiac.symbol}
            </span>
          </div>
          <div className="print-profile-item">
            <span className="print-label">Birth Date</span>
            <span className="print-value">{formattedDob}</span>
          </div>
          {report.profile.birthTime && (
            <div className="print-profile-item">
              <span className="print-label">Birth Time</span>
              <span className="print-value">{report.profile.birthTime}</span>
            </div>
          )}
          {birthLocStr && (
            <div className="print-profile-item print-span-all">
              <span className="print-label">Birth Location</span>
              <span className="print-value">{birthLocStr}</span>
            </div>
          )}
        </div>
      </section>

      {/* 3. Daily Forecast */}
      <section className="print-section">
        <h2 className="print-section-title">Daily Forecast</h2>
        <p className="print-forecast-text">{report.dailyHoroscope}</p>
      </section>

      {/* 4. Today's Sky & Transits */}
      {transitReport && (
        <section className="print-section">
          <div className="print-section-header">
            <h2 className="print-section-title">Today's Sky & Transits</h2>
            <span className="print-source-label">
              Source:{" "}
              {transitReport.source === "fallback"
                ? "Local Fallback Engine"
                : "Real-time Ephemeris"}
            </span>
          </div>
          <div className="print-transits-grid">
            <div className="print-transit-cell">
              <span className="print-label">Moon Phase</span>
              <span className="print-value">{transitReport.moonPhase.name}</span>
              {transitReport.moonPhase.illumination !== undefined && (
                <span className="print-sub-value">
                  {transitReport.moonPhase.illumination}% illuminated
                </span>
              )}
            </div>
            <div className="print-transit-cell">
              <span className="print-label">Sun Position</span>
              <span className="print-value">{getPlanetSign("Sun")}</span>
            </div>
            <div className="print-transit-cell">
              <span className="print-label">Moon Position</span>
              <span className="print-value">{getPlanetSign("Moon")}</span>
            </div>
            <div className="print-transit-cell">
              <span className="print-label">Inner Planets</span>
              <span className="print-value font-sans text-xs mt-1">
                {[
                  getPlanetSign("Mercury") !== "Unknown"
                    ? `Mercury: ${getPlanetSign("Mercury")}`
                    : null,
                  getPlanetSign("Venus") !== "Unknown" ? `Venus: ${getPlanetSign("Venus")}` : null,
                  getPlanetSign("Mars") !== "Unknown" ? `Mars: ${getPlanetSign("Mars")}` : null,
                ]
                  .filter(Boolean)
                  .join(" | ")}
              </span>
            </div>
          </div>
          <p className="print-transit-summary">{transitReport.summary}</p>
        </section>
      )}

      {/* 5. Advanced Natal Alignment */}
      {report.birthChartReport && (
        <section className="print-section page-break-before">
          <div className="print-section-header">
            <h2 className="print-section-title">Advanced Natal Alignment</h2>
            <span className="print-source-label">
              Source:{" "}
              {report.birthChartReport.source === "astronomy-engine-lite"
                ? "Offline local engine fallback"
                : "Precise Ephemeris"}
            </span>
          </div>

          <div className="print-natal-meta">
            {report.birthChartReport.ascendant && (
              <div>
                <strong>Ascendant (Rising Sign):</strong> {report.birthChartReport.ascendant}
              </div>
            )}
          </div>

          {report.birthChartReport.planets && report.birthChartReport.planets.length > 0 && (
            <div className="print-natal-planets">
              <div className="print-label mb-2">Natal Planetary Placements</div>
              <div className="print-natal-grid">
                {report.birthChartReport.planets.map((p, idx) => (
                  <div key={`${p.planet}-${idx}`} className="print-natal-item">
                    <span className="print-planet-name">
                      {p.planet}
                      {p.retrograde && <span className="print-retrograde"> ℞</span>}
                    </span>
                    <span className="print-planet-position">
                      {p.sign} {p.degreeInSign.toFixed(1)}°
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.birthChartReport.source === "astronomy-engine-lite" && (
            <div className="print-fallback-note">
              <strong>Note:</strong> Ascendant and houses require precise geographical adjustments.
              This fallback chart computes exact astronomical planet offsets locally but omits
              houses.
            </div>
          )}
        </section>
      )}

      {/* 6 & 7. Lucky Metrics & Birthstone */}
      <div className="print-columns-grid">
        <section className="print-section">
          <h2 className="print-section-title">Lucky Metrics</h2>
          <div className="print-lucky-box">
            <div className="print-lucky-item">
              <span className="print-label">Lucky Number</span>
              <span className="print-lucky-val font-display">{report.luckyNumber}</span>
            </div>
            <div className="print-lucky-item">
              <span className="print-label">Lucky Color</span>
              <span className="print-lucky-color-name">{report.luckyColor}</span>
            </div>
          </div>
        </section>

        <section className="print-section">
          <h2 className="print-section-title">Birthstone: {report.birthstone.name}</h2>
          <div className="print-stone-box">
            <p className="print-stone-meaning">
              <strong>Meaning:</strong> {report.birthstone.meaning}
            </p>
            <p className="print-stone-benefits">
              <strong>Symbolic Benefits:</strong> {report.birthstone.benefits}
            </p>
          </div>
        </section>
      </div>

      {/* 8. Zodiac Alignments & Traits */}
      <section className="print-section">
        <h2 className="print-section-title">Zodiac Profile</h2>
        <div className="print-zodiac-properties">
          <div className="print-zodiac-prop">
            <span className="print-label">Element</span>
            <span className="print-value">{report.zodiac.element}</span>
          </div>
          <div className="print-zodiac-prop">
            <span className="print-label">Modality</span>
            <span className="print-value">{report.zodiac.modality}</span>
          </div>
          <div className="print-zodiac-prop">
            <span className="print-label">Ruling Planet</span>
            <span className="print-value">{report.zodiac.rulingPlanet}</span>
          </div>
        </div>
        <div className="print-traits-box">
          <span className="print-label block mb-2">Zodiac Key Traits</span>
          <div className="print-traits-list">
            {report.zodiac.traits.map((trait) => (
              <span key={trait} className="print-trait-tag">
                {trait}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Compatibility Result */}
      {report.compatibility && (
        <section className="print-section page-break-inside-avoid">
          <h2 className="print-section-title">Zodiac Harmony Compatibility</h2>
          <div className="print-compatibility-meta">
            <span>
              <strong>Partner's DOB:</strong> {report.compatibility.secondBirthDate}
            </span>
            <span>
              <strong>Partner's Sun Sign:</strong> {report.compatibility.secondSign}
            </span>
          </div>
          <div className="print-harmony-scores">
            <div className="print-harmony-score">
              <span className="print-label">Love Match</span>
              <span className="print-harmony-percent love">
                {report.compatibility.lovePercent}%
              </span>
            </div>
            <div className="print-harmony-score">
              <span className="print-label">Friendship Harmony</span>
              <span className="print-harmony-percent friendship">
                {report.compatibility.friendshipPercent}%
              </span>
            </div>
          </div>
          <div className="print-compatibility-details">
            {report.compatibility.strength && (
              <div className="print-comp-detail-item">
                <span className="print-comp-label text-gold">Mutual Strength</span>
                <p>{report.compatibility.strength}</p>
              </div>
            )}
            {report.compatibility.friction && (
              <div className="print-comp-detail-item border-top">
                <span className="print-comp-label text-rose">Potential Friction</span>
                <p>{report.compatibility.friction}</p>
              </div>
            )}
            <div className="print-comp-detail-item border-top">
              <span className="print-comp-label text-sky">Relationship Advice</span>
              <p>{report.compatibility.advice}</p>
            </div>
          </div>
        </section>
      )}

      {/* 10. Saved/Report Note */}
      <footer className="print-footer">
        <p className="print-disclaimer">
          This report is for reflection and entertainment, not professional, medical, financial, or
          legal advice.
        </p>
        <p className="print-brand-sub">✦ Thank you for using Celestia ✦</p>
      </footer>
    </div>
  );
}
