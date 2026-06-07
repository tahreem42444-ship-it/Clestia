import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StarField } from "@/components/StarField";
import { ProfileForm } from "@/components/ProfileForm";
import { ReportDashboard } from "@/components/ReportDashboard";
import { getProfile, addOrUpdateHistoryEntry } from "@/lib/storage";
import { generateReport, type CelestiaReport, type CelestiaProfile } from "@/lib/report";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Celestia — Personal Horoscope Report" },
      {
        name: "description",
        content:
          "Generate your personal sun sign report. Discover daily horoscopes, lucky metrics, birthstone meanings, compatibility checkers, and export your report as a PDF.",
      },
      { property: "og:title", content: "Celestia — Personal Horoscope Report" },
      {
        property: "og:description",
        content:
          "Discover your Western zodiac alignments, daily forecast, birthstone meanings, compatibility checkers, and more.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [profile, setProfile] = useState<CelestiaProfile | null>(null);
  const [report, setReport] = useState<CelestiaReport | null>(null);

  useEffect(() => {
    // Check if there is an existing profile
    const existingProfile = getProfile();
    if (existingProfile) {
      setProfile(existingProfile);
      try {
        const generated = generateReport(existingProfile);
        setReport(generated);
        addOrUpdateHistoryEntry(generated);
      } catch (e) {
        console.error("Failed to auto-generate report for existing profile", e);
      }
    }
  }, []);

  const handleProfileSuccess = (newProfile: CelestiaProfile) => {
    setProfile(newProfile);
    const generated = generateReport(newProfile);
    setReport(generated);
    addOrUpdateHistoryEntry(generated);
  };

  const handleBack = () => {
    // Keep profile state, but reset dashboard view to form for editing
    setReport(null);
  };

  const handleUpdateReport = (updatedReport: CelestiaReport) => {
    setReport(updatedReport);
  };

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-background">
      <StarField count={30} />
      {/* Soft constellation lines */}
      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-30 no-print"
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

      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-4 py-4 sm:px-6 sm:py-6">
        {/* Header */}
        <header className="flex items-center justify-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-6 no-print">
          <span aria-hidden="true">✦</span>
          <span>Celestia</span>
          <span aria-hidden="true">✦</span>
        </header>

        {!report ? (
          <ProfileForm onSubmitSuccess={handleProfileSuccess} />
        ) : (
          <ReportDashboard
            report={report}
            onBack={handleBack}
            onUpdateReport={handleUpdateReport}
          />
        )}

        <footer className="mt-auto pb-2 pt-8 no-print">
          <p className="mx-auto max-w-md text-center text-[10px] leading-relaxed text-muted-foreground/60">
            © {new Date().getFullYear()} Celestia. Readings are for entertainment and
            self-reflection only.
          </p>
        </footer>
      </main>
    </div>
  );
}
