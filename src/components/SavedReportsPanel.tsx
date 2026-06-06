import { type CelestiaReport } from "@/lib/report.ts";
import { deleteSavedReport } from "@/lib/storage.ts";
import { Trash2, Calendar, Eye } from "lucide-react";

type SavedReportsPanelProps = {
  savedReports: CelestiaReport[];
  onSelectReport: (report: CelestiaReport) => void;
  onDeleteReport: (id: string) => void;
};

export function SavedReportsPanel({
  savedReports,
  onSelectReport,
  onDeleteReport,
}: SavedReportsPanelProps) {
  const handleDelete = (id: string) => {
    deleteSavedReport(id);
    onDeleteReport(id);
  };

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 space-y-4">
      <div>
        <h3 className="font-display text-xl text-gold">Saved Reports</h3>
        <p className="text-xs text-muted-foreground">Access your permanently stored reports.</p>
      </div>

      {savedReports.length === 0 ? (
        <p className="text-xs text-muted-foreground italic text-center py-4">
          No saved reports yet. Click "Save Report" on a reading to store it.
        </p>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {savedReports.map((entry) => (
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
                  <span>Saved on {new Date(entry.generatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onSelectReport(entry)}
                  className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[10px] text-gold hover:bg-[var(--gold)]/10 transition-colors cursor-pointer"
                >
                  <Eye size={10} />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1 cursor-pointer"
                  aria-label="Delete report"
                  title="Delete saved report"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
