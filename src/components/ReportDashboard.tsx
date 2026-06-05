import { useState, useEffect, useCallback } from "react";
import { type CelestiaReport } from "@/lib/report.ts";
import { getHistory, getSavedReports, addSavedReport, deleteSavedReport } from "@/lib/storage.ts";
import { ElementSymbol } from "./ZodiacResult.tsx";
import { ThemeToggle } from "./ThemeToggle.tsx";
import { CompatibilityChecker } from "./CompatibilityChecker.tsx";
import { HistoryPanel } from "./HistoryPanel.tsx";
import { SavedReportsPanel } from "./SavedReportsPanel.tsx";
import { EmailReportForm } from "./EmailReportForm.tsx";
import { BlogSection } from "./BlogSection.tsx";
import { ArrowLeft, Bookmark, Sparkles } from "lucide-react";

type ReportDashboardProps = {
  report: CelestiaReport;
  onBack: () => void;
  onUpdateReport: (report: CelestiaReport) => void;
};

export function ReportDashboard({ report, onBack, onUpdateReport }: ReportDashboardProps) {
  const [history, setHistory] = useState<CelestiaReport[]>([]);
  const [savedReports, setSavedReports] = useState<CelestiaReport[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const refreshLists = useCallback(() => {
    const hist = getHistory();
    const saved = getSavedReports();
    setHistory(hist);
    setSavedReports(saved);
    setIsSaved(saved.some((r) => r.id === report.id));
  }, [report.id]);

  useEffect(() => {
    refreshLists();
  }, [refreshLists]);

  const handleSaveReport = () => {
    if (isSaved) {
      deleteSavedReport(report.id);
      setIsSaved(false);
      refreshLists();
    } else {
      addSavedReport(report);
      setIsSaved(true);
      refreshLists();
    }
  };

  const handleSelectReportFromLists = (selectedReport: CelestiaReport) => {
    onUpdateReport(selectedReport);
  };

  const handleClearHistory = () => {
    refreshLists();
  };

  const handleDeletedSaved = (_id: string) => {
    refreshLists();
  };

  const formattedDob = new Date(report.profile.birthDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Dashboard Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-gold/80 hover:text-gold transition-colors focus:outline-none cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Edit Profile</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveReport}
            className={`flex items-center gap-1 text-xs rounded-full border border-[var(--gold)]/40 px-3.5 py-1.5 transition-colors focus:outline-none cursor-pointer ${
              isSaved ? "bg-[var(--gold)]/20 text-gold" : "text-gold hover:bg-[var(--gold)]/10"
            }`}
          >
            <Bookmark size={12} fill={isSaved ? "currentColor" : "none"} />
            <span>{isSaved ? "Report Saved" : "Save Report"}</span>
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Hero Greeting Card */}
      <section className="glass rounded-2xl p-5 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 animate-reveal-up">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-xl"
          style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
        />
        <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 flex items-center justify-center animate-symbol-pop">
          <ElementSymbol
            element={report.zodiac.element as "Fire" | "Earth" | "Air" | "Water"}
            className="w-full h-full"
          />
        </div>
        <div className="text-center md:text-left space-y-2 flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h2 className="font-display text-3xl sm:text-4xl gold-gradient leading-tight">
              Hello, {report.profile.name}
            </h2>
            <span className="text-lg text-gold shrink-0" aria-hidden="true">
              {report.zodiac.symbol}
            </span>
          </div>
          <p className="text-sm text-foreground/80 max-w-lg leading-relaxed">
            Your Western sun sign is <strong>{report.zodiac.name}</strong>, ruling the skies from{" "}
            {report.zodiac.dateRange}. Born on {formattedDob}.
          </p>
          <p className="text-xs text-muted-foreground italic leading-relaxed">
            {report.zodiac.description}
          </p>
        </div>
      </section>

      {/* Main Grid Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column: Daily Horoscope and Lucky Card */}
        <div className="space-y-6">
          {/* Daily Horoscope Card */}
          <div className="glass rounded-2xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-gold" />
              <h3 className="font-display text-xl text-gold">Daily Forecast</h3>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">{report.dailyHoroscope}</p>
            <div className="text-[10px] text-muted-foreground pt-2 border-t border-border">
              For today:{" "}
              {new Date(report.reportDate).toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>

          {/* Lucky Color & Number & Traits Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-4 flex flex-col justify-center items-center text-center">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Lucky Number
              </span>
              <span className="text-4xl font-display font-bold gold-gradient mt-1">
                {report.luckyNumber}
              </span>
            </div>
            <div className="glass rounded-2xl p-4 flex flex-col justify-center items-center text-center">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Lucky Color
              </span>
              <span className="text-lg font-semibold text-ivory mt-2">{report.luckyColor}</span>
            </div>
          </div>

          {/* Traits & Planet Metadata Card */}
          <div className="glass rounded-2xl p-5 sm:p-6 space-y-4">
            <div>
              <h3 className="font-display text-lg text-gold">Zodiac Alignments</h3>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl border border-border bg-[oklch(1_0_0/0.02)] p-2">
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground">
                  Element
                </div>
                <div className="mt-0.5 text-xs font-medium text-ivory">{report.zodiac.element}</div>
              </div>
              <div className="rounded-xl border border-border bg-[oklch(1_0_0/0.02)] p-2">
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground">
                  Modality
                </div>
                <div className="mt-0.5 text-xs font-medium text-ivory">
                  {report.zodiac.modality}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-[oklch(1_0_0/0.02)] p-2">
                <div className="text-[9px] uppercase tracking-widest text-muted-foreground">
                  Ruling Planet
                </div>
                <div className="mt-0.5 text-xs font-medium text-ivory">
                  {report.zodiac.rulingPlanet}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                Key Traits
              </span>
              <div className="flex flex-wrap gap-1.5">
                {report.zodiac.traits.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/5 px-2.5 py-0.5 text-[10px] text-gold font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Dashboard Quick Stats Card */}
          <div className="glass rounded-2xl p-5 sm:p-6 space-y-3">
            <h3 className="font-display text-lg text-gold">Dashboard Summary</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="text-muted-foreground text-[10px] uppercase">Profile Name</div>
                <div className="text-ivory font-medium">{report.profile.name}</div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground text-[10px] uppercase">Birth Date</div>
                <div className="text-ivory font-medium">{report.profile.birthDate}</div>
              </div>
              <div className="space-y-1 pt-2 border-t border-border">
                <div className="text-muted-foreground text-[10px] uppercase">Reading History</div>
                <div className="text-ivory font-medium">
                  {history.length} {history.length === 1 ? "entry" : "entries"}
                </div>
              </div>
              <div className="space-y-1 pt-2 border-t border-border">
                <div className="text-muted-foreground text-[10px] uppercase">Saved Reports</div>
                <div className="text-ivory font-medium">
                  {savedReports.length} {savedReports.length === 1 ? "report" : "reports"}
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={onBack}
                className="flex-1 text-center py-1.5 rounded-full border border-border text-[10px] font-semibold text-muted-foreground hover:text-gold hover:border-gold/40 transition-colors cursor-pointer"
              >
                Edit Profile
              </button>
              <button
                onClick={() => {
                  if (
                    confirm(
                      "Start over? This will keep history but reset the active profile views.",
                    )
                  ) {
                    onBack();
                  }
                }}
                className="flex-1 text-center py-1.5 rounded-full border border-border text-[10px] font-semibold text-muted-foreground hover:text-gold hover:border-gold/40 transition-colors cursor-pointer"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Birthstone, Compatibility, History, Email, Saved */}
        <div className="space-y-6">
          {/* Birthstone Card */}
          <div className="glass rounded-2xl p-5 sm:p-6 space-y-3">
            <h3 className="font-display text-xl text-gold">
              Your Birthstone: {report.birthstone.name}
            </h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <p>
                <strong>Traditional Meaning:</strong> {report.birthstone.meaning}
              </p>
              <p className="text-xs text-foreground/80 italic">
                <strong>Benefits:</strong> {report.birthstone.benefits}
              </p>
            </div>
          </div>

          {/* Compatibility Checker Card */}
          <CompatibilityChecker currentReport={report} onUpdateHistory={refreshLists} />

          {/* Email Form Card */}
          <EmailReportForm report={report} />

          {/* Saved Reports Card */}
          <SavedReportsPanel
            savedReports={savedReports}
            onSelectReport={handleSelectReportFromLists}
            onDeleteReport={handleDeletedSaved}
          />

          {/* History Panel Card */}
          <HistoryPanel
            history={history}
            onSelectReport={handleSelectReportFromLists}
            onClearHistory={handleClearHistory}
          />
        </div>
      </div>

      {/* Astrology Blog Section (Stretching across bottom) */}
      <section className="pt-2">
        <BlogSection />
      </section>
    </div>
  );
}
