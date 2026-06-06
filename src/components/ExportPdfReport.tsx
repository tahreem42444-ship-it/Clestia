import { type CelestiaReport } from "@/lib/report.ts";

type ExportPdfReportProps = {
  report: CelestiaReport;
};

export function ExportPdfReport({ report }: ExportPdfReportProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 space-y-4">
      <div>
        <h3 className="font-display text-xl text-gold">Export Report</h3>
        <p className="text-xs text-muted-foreground">
          Save a polished copy of your Celestia reading as a PDF.
        </p>
      </div>

      <button
        onClick={handlePrint}
        className="w-full rounded-full bg-gradient-to-r from-[oklch(0.88_0.1_85)] to-[oklch(0.78_0.14_75)] py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/50 active:scale-[0.99] cursor-pointer"
      >
        Export PDF
      </button>
    </div>
  );
}
