import { getZodiacSign } from "./zodiac.ts";
import { getDailyHoroscope } from "./horoscope.ts";
import { getLuckyPair } from "./lucky.ts";
import { getBirthstone } from "./birthstones.ts";
import { parseBirthDateInput } from "./birth-date.ts";

export type CelestiaProfile = {
  name: string;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
};

export type CelestiaReport = {
  id: string;
  generatedAt: string;
  reportDate: string;
  profile: CelestiaProfile;
  zodiac: {
    name: string;
    symbol: string;
    dateRange: string;
    element: string;
    modality: string;
    rulingPlanet: string;
    traits: string[];
    description: string;
  };
  dailyHoroscope: string;
  luckyColor: string;
  luckyNumber: number;
  birthstone: {
    name: string;
    meaning: string;
    benefits: string;
  };
  compatibility?: {
    secondBirthDate: string;
    secondSign: string;
    lovePercent: number;
    friendshipPercent: number;
    advice: string;
  };
};

export type CompatibilityReport = {
  id: string;
  generatedAt: string;
  firstBirthDate: string;
  secondBirthDate: string;
  firstSign: string;
  secondSign: string;
  lovePercent: number;
  friendshipPercent: number;
  advice: string;
};

export function generateReport(profile: CelestiaProfile, date: Date = new Date()): CelestiaReport {
  const validation = parseBirthDateInput(profile.birthDate);
  if (!validation.ok) {
    throw new Error("Invalid birth date in profile");
  }

  const sign = getZodiacSign(validation.month, validation.day);
  const horoscope = getDailyHoroscope(sign.name, date);
  const lucky = getLuckyPair(sign.name, date);
  const birthstone = getBirthstone(validation.month);

  return {
    id: `${profile.name.replace(/\s+/g, "-").toLowerCase()}-${profile.birthDate}-${date.toISOString().split("T")[0]}`,
    generatedAt: new Date().toISOString(),
    reportDate: date.toISOString(),
    profile,
    zodiac: {
      name: sign.name,
      symbol: sign.symbol,
      dateRange: sign.dateRange,
      element: sign.element,
      modality: sign.modality,
      rulingPlanet: sign.rulingPlanet,
      traits: sign.traits,
      description: sign.description,
    },
    dailyHoroscope: horoscope,
    luckyColor: lucky.luckyColor,
    luckyNumber: lucky.luckyNumber,
    birthstone: {
      name: birthstone.name,
      meaning: birthstone.meaning,
      benefits: birthstone.benefits,
    },
  };
}
