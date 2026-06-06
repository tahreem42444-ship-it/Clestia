import { useState } from "react";
import { type CelestiaReport } from "@/lib/report.ts";

type EmailReportFormProps = {
  report: CelestiaReport;
};

export function EmailReportForm({ report }: EmailReportFormProps) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setStatus({ type: "error", message: "Email address is required." });
      return;
    }

    if (!emailTrimmed.includes("@") || emailTrimmed.length < 5) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/email-horoscope", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: emailTrimmed,
          name: report.profile.name,
          report: {
            zodiacName: report.zodiac.name,
            dateRange: report.zodiac.dateRange,
            dailyHoroscope: report.dailyHoroscope,
            luckyColor: report.luckyColor,
            luckyNumber: report.luckyNumber,
            birthstone: report.birthstone.name,
            birthstoneMeaning: report.birthstone.meaning,
            birthstoneBenefits: report.birthstone.benefits,
            compatibilitySummary: report.compatibility
              ? `Love Compatibility: ${report.compatibility.lovePercent}% | Friendship Compatibility: ${report.compatibility.friendshipPercent}% \nAdvice: ${report.compatibility.advice}`
              : null,
            generatedAt: report.generatedAt,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let friendlyMessage = "Failed to send email. Your report remains saved in this browser.";
        if (data.code === "EMAIL_NOT_CONFIGURED") {
          friendlyMessage =
            "Email is not configured for this deployment yet. Your report is still saved locally.";
        } else if (data.code === "INVALID_EMAIL") {
          friendlyMessage = "Please enter a valid email address.";
        } else if (data.code === "INVALID_REPORT") {
          friendlyMessage = "The reading report data is incomplete or invalid. Try refreshing.";
        } else if (data.code === "EMAIL_SEND_FAILED") {
          friendlyMessage =
            "Email delivery failed. Your report is still saved locally in your browser.";
        } else if (data.error) {
          friendlyMessage = data.error;
        }

        setStatus({
          type: "error",
          message: friendlyMessage,
        });
      } else {
        setStatus({ type: "success", message: `Successfully emailed report to ${emailTrimmed}!` });
        setEmail("");
      }
    } catch (e) {
      setStatus({
        type: "error",
        message: "A network error occurred. Your report remains saved in this browser.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 space-y-4">
      <div>
        <h3 className="font-display text-xl text-gold">Email Report</h3>
        <p className="text-xs text-muted-foreground">
          Receive a copy of this cosmic forecast directly in your inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <div>
          <label
            htmlFor="email-input"
            className="block text-[10px] uppercase tracking-widest text-muted-foreground"
          >
            Email Address
          </label>
          <input
            id="email-input"
            type="email"
            value={email}
            required
            disabled={sending}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status) setStatus(null);
            }}
            placeholder="your-email@example.com"
            className="mt-1.5 w-full rounded-xl border border-border bg-[oklch(1_0_0/0.04)] px-3 py-2 text-sm text-ivory outline-none transition-colors hover:bg-[oklch(1_0_0/0.06)] focus:border-[var(--gold)]/60 focus-visible:ring-2 focus-visible:ring-[var(--gold)]/30 disabled:opacity-50"
          />
        </div>

        {status && (
          <div
            role="alert"
            aria-live="polite"
            className={`flex items-start gap-2 rounded-lg border px-3 py-1.5 text-xs ${
              status.type === "success"
                ? "border-green-500/30 bg-[oklch(0.62_0.17_150/0.1)] text-green-600 dark:text-green-400"
                : "border-destructive/40 bg-destructive/10 text-destructive-foreground"
            }`}
          >
            <span>{status.type === "success" ? "✓" : "⚠"}</span>
            <span>{status.message}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="w-full rounded-full bg-gradient-to-r from-[oklch(0.88_0.1_85)] to-[oklch(0.78_0.14_75)] py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/50 disabled:opacity-50 active:scale-[0.99] cursor-pointer"
        >
          {sending ? "Sending..." : "Email My Report"}
        </button>
      </form>
    </div>
  );
}
