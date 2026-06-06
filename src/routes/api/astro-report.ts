import { createFileRoute } from "@tanstack/react-router";
import type { BirthChartReport, PlanetPosition } from "@/lib/astro-types";
import { getPlanetPositions, getMoonPhaseInfo } from "@/lib/astronomy-engine";

// Helper to calculate timezone offset from string name (e.g. "Europe/London")
function getTimezoneOffset(
  tzString: string,
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number,
): number {
  try {
    const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone: tzString }));
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    return (tzDate.getTime() - utcDate.getTime()) / 3600000;
  } catch {
    return 0;
  }
}

export const Route = createFileRoute("/api/astro-report")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { name, birthDate, birthTime, birthLocation } = body;

          // 1. Validate inputs
          if (!name || typeof name !== "string") {
            return new Response(
              JSON.stringify({ ok: false, code: "VALIDATION_FAILED", error: "Name is required." }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          if (
            !birthDate ||
            typeof birthDate !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)
          ) {
            return new Response(
              JSON.stringify({
                ok: false,
                code: "VALIDATION_FAILED",
                error: "Valid birth date (YYYY-MM-DD) is required.",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          if (!birthLocation) {
            return new Response(
              JSON.stringify({
                ok: false,
                code: "BIRTH_LOCATION_REQUIRED",
                error: "Birth location is required for advanced chart calculations.",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const { latitude, longitude, timezone } = birthLocation;
          if (latitude === undefined || longitude === undefined) {
            return new Response(
              JSON.stringify({
                ok: false,
                code: "VALIDATION_FAILED",
                error: "Birth location must contain latitude and longitude.",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          // 2. Check API key configuration
          const apiKey = process.env.FREE_ASTRO_API_KEY;

          let dateObj = new Date(birthDate + "T12:00:00");
          if (birthTime) {
            const match = String(birthTime).match(/(\d+):(\d+)\s*(AM|PM)?/i);
            if (match) {
              let h = parseInt(match[1], 10);
              const m = parseInt(match[2], 10);
              const ampm = match[3];
              if (ampm) {
                if (ampm.toUpperCase() === "PM" && h < 12) h += 12;
                if (ampm.toUpperCase() === "AM" && h === 12) h = 0;
              }
              dateObj = new Date(
                birthDate + `T${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:00`,
              );
            }
          }

          const generateFallbackChart = (): BirthChartReport => {
            const planets = getPlanetPositions(dateObj);
            const moonPhase = getMoonPhaseInfo(dateObj);
            const sunSign = planets.find((p) => p.planet === "Sun")?.sign;
            const moonSign = planets.find((p) => p.planet === "Moon")?.sign;
            return {
              source: "astronomy-engine-lite",
              planets,
              sunSign,
              moonSign,
              moonPhase,
            };
          };

          if (!apiKey) {
            return new Response(
              JSON.stringify({
                ok: true,
                birthChart: generateFallbackChart(),
                warning: {
                  code: "FREE_ASTRO_NOT_CONFIGURED_USING_FALLBACK",
                  message: "Advanced provider not configured. Fallback chart generated locally.",
                },
              }),
              { status: 200, headers: { "Content-Type": "application/json" } },
            );
          }

          // 3. Parse birth time
          let hours = 12;
          let minutes = 0;
          if (birthTime) {
            const match = String(birthTime).match(/(\d+):(\d+)\s*(AM|PM)?/i);
            if (match) {
              hours = parseInt(match[1], 10);
              minutes = parseInt(match[2], 10);
              const ampm = match[3];
              if (ampm) {
                if (ampm.toUpperCase() === "PM" && hours < 12) hours += 12;
                if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
              }
            }
          }

          const [yearStr, monthStr, dayStr] = birthDate.split("-");
          const year = parseInt(yearStr, 10);
          const month = parseInt(monthStr, 10);
          const date = parseInt(dayStr, 10);

          const tzOffset = timezone
            ? getTimezoneOffset(timezone, year, month, date, hours, minutes)
            : 0;

          // 4. Call FreeAstroAPI (json.freeastrologyapi.com)
          const payload = {
            year,
            month,
            date,
            hours,
            minutes,
            seconds: 0,
            latitude: Number(latitude),
            longitude: Number(longitude),
            timezone: tzOffset,
          };

          const apiResponse = await fetch("https://json.freeastrologyapi.com/planets", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
            },
            body: JSON.stringify(payload),
          });

          if (!apiResponse.ok) {
            console.error(`FreeAstroAPI request failed with status: ${apiResponse.status}`);
            return new Response(
              JSON.stringify({
                ok: true,
                birthChart: generateFallbackChart(),
                warning: {
                  code: "FREE_ASTRO_FAILED_USING_FALLBACK",
                  message: "Advanced provider unavailable. Fallback chart generated locally.",
                },
              }),
              { status: 200, headers: { "Content-Type": "application/json" } },
            );
          }

          const data = await apiResponse.json();

          // Standard response shape validation
          if (!data || typeof data !== "object") {
            return new Response(
              JSON.stringify({
                ok: true,
                birthChart: generateFallbackChart(),
                warning: {
                  code: "FREE_ASTRO_FAILED_USING_FALLBACK",
                  message: "Advanced provider unavailable. Fallback chart generated locally.",
                },
              }),
              { status: 200, headers: { "Content-Type": "application/json" } },
            );
          }

          // Extract planetary positions and ascendant from FreeAstroAPI
          const planets: PlanetPosition[] = [];
          let ascendantSign = "";
          let moonSign = "";
          let sunSign = "";

          // The Free Astrology API typically returns a list of planets or an object
          // Let's inspect/parse standard structure:
          // e.g. data = [ { name: "Sun", longitude: 123.4, ... } ] or data = { output: [...] } or data.planets
          const rawList = Array.isArray(data) ? data : data.planets || data.output || [];

          if (Array.isArray(rawList)) {
            for (const item of rawList) {
              const nameLower = String(item.name || "").toLowerCase();
              if (nameLower === "ascendant" || nameLower === "lagna") {
                ascendantSign = item.sign || "";
                continue;
              }

              const sign = item.sign || "";
              const longitude = Number(item.longitude || 0);
              const isRetro = !!item.isRetrograde || !!item.retrograde;

              if (nameLower === "sun") sunSign = sign;
              if (nameLower === "moon") moonSign = sign;

              planets.push({
                planet: item.name || "Unknown",
                sign,
                longitude: Math.round(longitude * 1000) / 1000,
                degreeInSign: Math.round((longitude % 30) * 1000) / 1000,
                retrograde: isRetro,
              });
            }
          }

          const birthChart: BirthChartReport = {
            source: "freeastroapi",
            ascendant: ascendantSign || undefined,
            moonSign: moonSign || undefined,
            sunSign: sunSign || undefined,
            planets: planets.length > 0 ? planets : undefined,
            raw: undefined, // trimmed/removed raw response for security
          };

          return new Response(
            JSON.stringify({
              ok: true,
              birthChart,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error: unknown) {
          console.error("Failed to generate advanced astrology report:", error);

          try {
            // Attempt to recover with fallback if FreeAstroAPI failed exceptionally
            const { getPlanetPositions, getMoonPhaseInfo } = await import("@/lib/astronomy-engine");
            let fallbackDateObj = new Date(); // Using current time as absolute fallback fallback
            // Trying to use provided date again
            const body = await request
              .clone()
              .json()
              .catch(() => ({}));
            if (body.birthDate) {
              fallbackDateObj = new Date(body.birthDate + "T12:00:00");
              if (body.birthTime) {
                const [h, m] = body.birthTime.split(":");
                fallbackDateObj = new Date(
                  body.birthDate +
                    `T${(h || "12").padStart(2, "0")}:${(m || "00").padStart(2, "0")}:00`,
                );
              }
            }
            const planets = getPlanetPositions(fallbackDateObj);
            const moonPhase = getMoonPhaseInfo(fallbackDateObj);

            return new Response(
              JSON.stringify({
                ok: true,
                birthChart: {
                  source: "astronomy-engine-lite",
                  planets,
                  sunSign: planets.find((p) => p.planet === "Sun")?.sign,
                  moonSign: planets.find((p) => p.planet === "Moon")?.sign,
                  moonPhase,
                },
                warning: {
                  code: "FREE_ASTRO_FAILED_USING_FALLBACK",
                  message: "Advanced provider unavailable. Fallback chart generated locally.",
                },
              }),
              { status: 200, headers: { "Content-Type": "application/json" } },
            );
          } catch (fallbackError) {
            console.error("Fallback generation also failed:", fallbackError);
            return new Response(
              JSON.stringify({
                ok: false,
                code: "ALL_SOURCES_FAILED",
                error:
                  "Advanced chart details are unavailable right now. Your daily report is still saved.",
              }),
              { status: 500, headers: { "Content-Type": "application/json" } },
            );
          }
        }
      },
    },
  },
});
