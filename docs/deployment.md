# Celestia Deployment Documentation

Celestia is a personal horoscope application built with TanStack Start, React, Vite, and Tailwind v4. It integrates real astronomical calculations, geocoding, and map utilities.

## Vercel Deployment & Environment Variables

When deploying to Vercel (or any other hosting provider supporting serverless functions), the following environment variables must be configured in your environment settings:

| Variable Name        | Required                 | Scope       | Description                                                                                               | Example                             |
| -------------------- | ------------------------ | ----------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `RESEND_API_KEY`     | Yes (for email)          | Server-only | Your API Key from [Resend](https://resend.com) to allow emailing reports.                                 | `re_123456789...`                   |
| `RESEND_FROM_EMAIL`  | No                       | Server-only | The sender email address verified in your Resend account. Defaults to `onboarding@resend.dev` if omitted. | `Celestia <noreply@yourdomain.com>` |
| `FREE_ASTRO_API_KEY` | Yes (for advanced chart) | Server-only | API key from [FreeAstroAPI](https://freeastroapi.com/) for advanced natal houses and ascendant data.      | `free-astro-key-...`                |

### Local Development

For local development, you can create a `.env` file in the root directory:

```env
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=your_verified_from_email_here
FREE_ASTRO_API_KEY=your_free_astro_api_key_here
```

> [!IMPORTANT]
> **Security Boundaries**: Do NOT use the `VITE_` prefix for `FREE_ASTRO_API_KEY` or `RESEND_API_KEY`. These keys must only be used server-side to prevent exposing secrets to the frontend. The client communicates with backend API routes (`/api/astro-report` and `/api/email-horoscope`) which interact with these external services.

---

## Services & APIs Map (No Keys Needed)

The following components operate without external API keys or configurations:

1. **Astronomy Engine (`astronomy-engine` npm package)**:
   - Calculates precise planetary longitudes (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto) and Moon phases locally on the server or client.
   - Runs deterministically without making any network requests.

2. **Open-Meteo Geocoding**:
   - Resolves search queries for birth cities/places directly from the client using Open-Meteo's public geocoding API.
   - No API key or env var is needed.

3. **Leaflet & OpenStreetMap Map Preview**:
   - Displays map tiles and marker placement client-side.
   - No API key is required.
   - **Crucial**: Visible attribution ("© OpenStreetMap contributors") must be displayed on the map at all times.
