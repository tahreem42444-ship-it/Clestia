import { type CelestiaReport } from "@/lib/report.ts";
import { clearHistory } from "@/lib/storage.ts";
import { Trash2, Calendar, Eye } from "lucide-react";

type HistoryPanelProps = {
  history: CelestiaReport[];
  onSelectReport: (report: CelestiaReport) => void;
  onClearHistory: () => void;
};

export function HistoryPanel({ history, onSelectReport, onClearHistory }: HistoryPanelProps) {
  const handleClear = () => {
    if (confirm("Are you sure you want to clear your reading history? This cannot be undone.")) {
      clearHistory();
      onClearHistory();
    }
  };

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-display text-xl text-gold">Reading History</h3>
          <p className="text-xs text-muted-foreground">Review your past cosmic calculations.</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="text-muted-foreground hover:text-destructive transition-colors p-1 cursor-pointer"
            title="Clear all history"
            aria-label="Clear history"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-xs text-muted-foreground italic text-center py-4">
          No history entries yet. Generate a report to begin.
        </p>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="flex justify-between items-center rounded-xl border border-border bg-[oklch(1_0_0/0.02)] p-3 hover:bg-[oklch(1_0_0/0.04)] transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-ivory">{entry.profile.name}</span>
                  <span className="text-[10px] text-gold font-display">
                    {entry.zodiac.symbol} {entry.zodiac.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                  <Calendar size={10} />
                  <span>
                    {new Date(entry.reportDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onSelectReport(entry)}
                className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[10px] text-gold hover:bg-[var(--gold)]/10 transition-colors cursor-pointer"
              >
                <Eye size={10} />
                <span>View</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
