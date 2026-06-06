import { createFileRoute } from "@tanstack/react-router";
import { Resend } from "resend";

/** Escape special HTML characters to prevent injection in email bodies. */
function escHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const Route = createFileRoute("/api/email-horoscope")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { to, name, report } = body;

          // 1. Validate email format
          if (!to || typeof to !== "string" || !to.includes("@")) {
            return new Response(
              JSON.stringify({ code: "INVALID_EMAIL", error: "Invalid email address." }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          // 2. Validate required report fields
          if (!name || typeof name !== "string" || name.trim().length < 2) {
            return new Response(
              JSON.stringify({ code: "INVALID_REPORT", error: "Invalid name." }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          if (
            !report ||
            typeof report !== "object" ||
            !report.zodiacName ||
            !report.dateRange ||
            !report.dailyHoroscope ||
            !report.luckyColor ||
            report.luckyNumber === undefined ||
            !report.birthstone ||
            !report.birthstoneMeaning ||
            !report.birthstoneBenefits
          ) {
            return new Response(
              JSON.stringify({
                code: "INVALID_REPORT",
                error: "Invalid report data. Required fields are missing.",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          // 3. Check for API key
          const apiKey = process.env.RESEND_API_KEY;
          const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

          if (!apiKey) {
            console.warn("RESEND_API_KEY is not configured.");
            return new Response(
              JSON.stringify({
                code: "EMAIL_NOT_CONFIGURED",
                error: "Email service is not configured on the server.",
              }),
              { status: 503, headers: { "Content-Type": "application/json" } },
            );
          }

          // 4. Initialize Resend
          const resend = new Resend(apiKey);

          // 5. Build clean plain text and HTML content
          const subject = `Your Celestia Astrology Report for ${name}`;
          const compatibilityText = report.compatibilitySummary
            ? `\nCompatibility Result:\n${report.compatibilitySummary}\n`
            : "";
          const compatibilityHtml = report.compatibilitySummary
            ? `<h3>Compatibility Result</h3><p>${escHtml(report.compatibilitySummary).replace(/\n/g, "<br />")}</p>`
            : "";

          const textContent = `
Celestia Astrology Report
-------------------------
Hello ${name},

Here is your personalized astrology report generated on ${new Date(report.generatedAt).toLocaleDateString()}:

Zodiac Sign: ${report.zodiacName} (${report.dateRange})
Daily Horoscope: ${report.dailyHoroscope}

Lucky Color: ${report.luckyColor}
Lucky Number: ${report.luckyNumber}

Birthstone: ${report.birthstone}
Meaning: ${report.birthstoneMeaning}
Benefits: ${report.birthstoneBenefits}
${compatibilityText}
This reading is for entertainment and self-reflection only. Thank you for using Celestia!
`;

          const htmlContent = `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; color: #333;">
  <h2 style="color: #6d28d9; text-align: center;">✦ Celestia ✦</h2>
  <hr style="border: 0; border-top: 1px solid #eaeaea;" />
  <p>Hello <strong>${escHtml(name)}</strong>,</p>
  <p>Here is your personalized astrology report generated on <strong>${new Date(report.generatedAt).toLocaleDateString()}</strong>:</p>
  
  <div style="background-color: #f5f3ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
    <h3 style="margin-top: 0; color: #7c3aed;">Your Sign: ${escHtml(report.zodiacName)}</h3>
    <p style="font-style: italic; color: #666;">${escHtml(report.dateRange)}</p>
    <p><strong>Daily Forecast:</strong> ${escHtml(report.dailyHoroscope)}</p>
  </div>

  <div style="margin: 15px 0;">
    <p><strong>Lucky Color:</strong> ${escHtml(report.luckyColor)}</p>
    <p><strong>Lucky Number:</strong> ${escHtml(String(report.luckyNumber))}</p>
  </div>

  <div style="background-color: #fafafa; padding: 15px; border-radius: 8px; border: 1px solid #eaeaea; margin: 15px 0;">
    <h4 style="margin-top: 0;">Traditional Birthstone: ${escHtml(report.birthstone)}</h4>
    <p><strong>Meaning:</strong> ${escHtml(report.birthstoneMeaning)}</p>
    <p><strong>Benefits:</strong> ${escHtml(report.birthstoneBenefits)}</p>
  </div>

  ${compatibilityHtml}

  <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
  <p style="font-size: 11px; color: #999; text-align: center;">
    This reading is for entertainment and self-reflection only. Thank you for using Celestia!
  </p>
</div>
`;

          // 6. Send email
          const data = await resend.emails.send({
            from: fromEmail,
            to,
            subject,
            text: textContent.trim(),
            html: htmlContent,
          });

          if (data.error) {
            console.error("Resend API returned an error:", data.error);
            return new Response(
              JSON.stringify({ code: "EMAIL_SEND_FAILED", error: "Failed to send email." }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          return new Response(JSON.stringify({ success: true, id: data.data?.id }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (e: unknown) {
          console.error("Failed to process email request:", e);
          return new Response(
            JSON.stringify({ code: "EMAIL_SEND_FAILED", error: "Internal server error." }),
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
