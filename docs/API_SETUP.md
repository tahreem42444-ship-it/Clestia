# API Setup & Service Map

This document outlines the API configuration and calculations used in the Celestia astrology application to generate real astronomical and astrological reports.

## Environment Variables

The following environment variables are required for full features (such as automated emailing of reports and advanced natal chart details). These must be configured in Vercel or your local environment.

> [!WARNING]
> Do NOT prefix secret keys with `VITE_` or expose them to the frontend. All external API calls containing secrets are performed securely from server-side handlers.

| Variable Name        | Required                 | Scope       | Description                                                                                          |
| -------------------- | ------------------------ | ----------- | ---------------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`     | Yes (for email)          | Server-only | API key from Resend to allow sending email reports.                                                  |
| `RESEND_FROM_EMAIL`  | No (default onboarding)  | Server-only | Verified sender email address. Defaults to `onboarding@resend.dev`.                                  |
| `FREE_ASTRO_API_KEY` | Yes (for advanced chart) | Server-only | API key from [FreeAstroAPI](https://freeastroapi.com/) for advanced natal houses and ascendant data. |

---

## Services and Libraries Map

### 1. Astronomy Engine (`astronomy-engine` npm package)

- **API Key Required**: No.
- **Mechanism**: Runs mathematical calculations locally (or server-side in API routes) to determine precise planetary positions (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto) and Moon phase characteristics based on astronomical equations.
- **Usage**: Provides deterministic, real-time transit positions and fallback chart calculations without hitting network endpoints or consuming third-party API quotas.

### 2. FreeAstroAPI (Advanced Astrology API)

- **API Key Required**: Yes (`FREE_ASTRO_API_KEY`).
- **Mechanism**: Accessed via a secure server route (`POST /api/astro-report`). Never exposed to the client.
- **Usage**: Fetches advanced natal chart structures (ascendant, houses, aspect tables) based on precise latitude, longitude, date, time, and timezone parameters. Falls back to Astronomy Engine calculation if the API is disabled, not configured, or if the user does not supply location details.

### 3. Open-Meteo Geocoding API

- **API Key Required**: No.
- **Mechanism**: Client-side queries to `https://geocoding-api.open-meteo.com/v1/search`.
- **Usage**: Resolves user birth city search queries to geographic coordinates (latitude, longitude, timezone, region, and country name).

### 4. OpenStreetMap & Leaflet

- **API Key Required**: No.
- **Mechanism**: Renders map tile previews using OpenStreetMap contributors tile server via Leaflet CSS/JS components.
- **Attribution Requirement**: The map preview must show the attribution "© OpenStreetMap contributors" clearly at all times.
