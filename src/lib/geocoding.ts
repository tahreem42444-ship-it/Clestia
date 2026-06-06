import type { BirthLocation } from "./astro-types.ts";

interface OpenMeteoResult {
  name?: string;
  country?: string;
  admin1?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export async function searchBirthLocations(query: string): Promise<BirthLocation[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=8&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Geocoding API failed: ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: OpenMeteoResult) => ({
      name: item.name || "Unknown",
      country: item.country,
      admin1: item.admin1,
      latitude: Number(item.latitude || 0),
      longitude: Number(item.longitude || 0),
      timezone: item.timezone,
    }));
  } catch (error) {
    console.error("Error fetching birth locations:", error);
    return [];
  }
}
