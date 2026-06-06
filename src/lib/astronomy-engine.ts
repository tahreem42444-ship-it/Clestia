import {
  Body,
  GeoVector,
  Ecliptic,
  EclipticGeoMoon,
  MoonPhase,
  Illumination,
  MakeTime,
  type FlexibleDateTime,
} from "astronomy-engine";
import type { PlanetPosition, MoonPhaseInfo, TransitReport } from "./astro-types.ts";

export function normalizeLongitude(value: number): number {
  return ((value % 360) + 360) % 360;
}

const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

export function zodiacSignFromLongitude(longitude: number): string {
  const norm = normalizeLongitude(longitude);
  const index = Math.floor(norm / 30);
  return ZODIAC_SIGNS[index] || "Aries";
}

export function degreeInSign(longitude: number): number {
  return normalizeLongitude(longitude) % 30;
}

export function getMoonPhaseInfo(date: Date = new Date()): MoonPhaseInfo {
  try {
    const time = MakeTime(date);
    const phaseAngle = MoonPhase(time);
    const normAngle = normalizeLongitude(phaseAngle);

    let name = "New Moon";
    if (normAngle < 6 || normAngle > 354) {
      name = "New Moon";
    } else if (normAngle >= 6 && normAngle < 84) {
      name = "Waxing Crescent";
    } else if (normAngle >= 84 && normAngle < 96) {
      name = "First Quarter";
    } else if (normAngle >= 96 && normAngle < 174) {
      name = "Waxing Gibbous";
    } else if (normAngle >= 174 && normAngle < 186) {
      name = "Full Moon";
    } else if (normAngle >= 186 && normAngle < 264) {
      name = "Waning Gibbous";
    } else if (normAngle >= 264 && normAngle < 276) {
      name = "Third Quarter";
    } else if (normAngle >= 276 && normAngle <= 354) {
      name = "Waning Crescent";
    }

    const ageDays = (normAngle / 360) * 29.53;
    let illumination = 0;
    try {
      const ill = Illumination(Body.Moon, time);
      illumination = ill.phase_fraction * 100;
    } catch {
      // Fallback estimate
      illumination = normAngle <= 180 ? (normAngle / 180) * 100 : ((360 - normAngle) / 180) * 100;
    }

    return {
      name,
      illumination: Math.round(illumination * 10) / 10,
      ageDays: Math.round(ageDays * 10) / 10,
    };
  } catch (error) {
    return {
      name: "Unknown Moon Phase",
      illumination: 0,
      ageDays: 0,
    };
  }
}

export function getPlanetPositions(date: Date = new Date()): PlanetPosition[] {
  const time = MakeTime(date);
  const bodies = [
    { name: "Sun", key: Body.Sun },
    { name: "Moon", key: Body.Moon },
    { name: "Mercury", key: Body.Mercury },
    { name: "Venus", key: Body.Venus },
    { name: "Mars", key: Body.Mars },
    { name: "Jupiter", key: Body.Jupiter },
    { name: "Saturn", key: Body.Saturn },
    { name: "Uranus", key: Body.Uranus },
    { name: "Neptune", key: Body.Neptune },
    { name: "Pluto", key: Body.Pluto },
  ];

  const positions: PlanetPosition[] = [];

  for (const b of bodies) {
    try {
      let lon = 0;
      if (b.key === Body.Moon) {
        lon = EclipticGeoMoon(time).lon;
      } else {
        const vec = GeoVector(b.key, time, true);
        const ecl = Ecliptic(vec);
        lon = ecl.elon;
      }

      positions.push({
        planet: b.name,
        sign: zodiacSignFromLongitude(lon),
        longitude: Math.round(lon * 1000) / 1000,
        degreeInSign: Math.round(degreeInSign(lon) * 1000) / 1000,
      });
    } catch (e) {
      console.warn(`Could not calculate position for ${b.name}:`, e);
    }
  }

  return positions;
}

export function getCurrentTransitReport(date: Date = new Date()): TransitReport {
  const planets = getPlanetPositions(date);
  const moonPhase = getMoonPhaseInfo(date);

  const sunPos = planets.find((p) => p.planet === "Sun");
  const moonPos = planets.find((p) => p.planet === "Moon");

  const sunSign = sunPos ? sunPos.sign : "Aries";
  const moonSign = moonPos ? moonPos.sign : "Aries";

  // Build a safe, symbolic transit summary
  let summary = `Today's sky places the Sun in ${sunSign} and the Moon in ${moonSign} under a ${moonPhase.name.toLowerCase()} phase. `;

  if (moonPhase.name === "Full Moon") {
    summary +=
      "Full Moons bring heightened emotional awareness and peak energy. It is an excellent time to celebrate accomplishments, reflect on what needs release, and proceed mindfully.";
  } else if (moonPhase.name === "New Moon") {
    summary +=
      "New Moons symbolise fresh starts and setting intentions. A good day to plan, rest, and begin subtle adjustments rather than forcing outward changes.";
  } else if (moonPhase.name.includes("Waning")) {
    summary +=
      "As the Moon wanes, energy naturally draws inward. Focus on completing ongoing tasks, organizing, and letting go of unnecessary strain.";
  } else {
    summary +=
      "The waxing Moon encourages steady growth and building momentum. Ideal for taking constructive action on your goals and nurturing new connections.";
  }

  summary +=
    " These patterns offer symbolic reflections for self-inquiry rather than fixed predictions.";

  return {
    generatedAt: new Date().toISOString(),
    source: "astronomy-engine",
    moonPhase,
    planets,
    summary,
  };
}
