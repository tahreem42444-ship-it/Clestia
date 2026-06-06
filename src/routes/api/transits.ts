import { createFileRoute } from "@tanstack/react-router";
import { getCurrentTransitReport } from "@/lib/astronomy-engine";

export const Route = createFileRoute("/api/transits")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const report = getCurrentTransitReport();
          return new Response(
            JSON.stringify({
              ok: true,
              transits: report,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Unknown error";
          console.error("Failed to calculate transits:", error);
          return new Response(
            JSON.stringify({
              ok: false,
              code: "TRANSIT_CALCULATION_FAILED",
              error: "Unable to calculate current sky data. Details: " + message,
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});
