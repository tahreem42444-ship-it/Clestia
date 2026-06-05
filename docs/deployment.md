# Celestia Deployment Documentation

Celestia is a frontend-first MVP personal horoscope application built with TanStack Start, React, Vite, and Tailwind v4. The only backend server endpoint is for sending reports via email.

## Vercel Deployment & Environment Variables

When deploying to Vercel (or any other hosting provider supporting serverless functions), the following environment variables must be configured in your environment settings:

| Variable Name       | Required        | Description                                                                                               | Example                             |
| ------------------- | --------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `RESEND_API_KEY`    | Yes (for email) | Your API Key from [Resend](https://resend.com) to allow emailing reports.                                 | `re_123456789...`                   |
| `RESEND_FROM_EMAIL` | No              | The sender email address verified in your Resend account. Defaults to `onboarding@resend.dev` if omitted. | `Celestia <noreply@yourdomain.com>` |

### Local Development

For local development, you can create a `.env` file in the root directory:

```env
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=your_verified_from_email_here
```

> [!NOTE]
> If `RESEND_API_KEY` is not configured in local development, the email feature will gracefully degrade and return a descriptive `503 Service Unavailable` JSON response without crashing the application.
