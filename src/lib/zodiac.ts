export type ZodiacSign = {
  name: string;
  symbol: string;
  dateRange: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  modality: "Cardinal" | "Fixed" | "Mutable";
  rulingPlanet: string;
  traits: string[];
  description: string;
};

export const ZODIAC: Record<string, ZodiacSign> = {
  aries: {
    name: "Aries",
    symbol: "♈",
    dateRange: "March 21 – April 19",
    element: "Fire",
    modality: "Cardinal",
    rulingPlanet: "Mars",
    traits: ["Bold", "Driven", "Direct", "Energetic", "Pioneering"],
    description:
      "Aries energy is fast, decisive, and unafraid of new beginnings. People with this sign often lead with instinct, courage, and a desire to move things forward.",
  },
  taurus: {
    name: "Taurus",
    symbol: "♉",
    dateRange: "April 20 – May 20",
    element: "Earth",
    modality: "Fixed",
    rulingPlanet: "Venus",
    traits: ["Grounded", "Patient", "Sensual", "Loyal", "Steady"],
    description:
      "Taurus energy is calm, sensory, and rooted in the physical world. People with this sign tend to value beauty, comfort, and slow, intentional living.",
  },
  gemini: {
    name: "Gemini",
    symbol: "♊",
    dateRange: "May 21 – June 20",
    element: "Air",
    modality: "Mutable",
    rulingPlanet: "Mercury",
    traits: ["Curious", "Quick", "Expressive", "Witty", "Adaptable"],
    description:
      "Gemini energy is light, curious, and quick to connect ideas. People with this sign often thrive on conversation, variety, and learning a little about everything.",
  },
  cancer: {
    name: "Cancer",
    symbol: "♋",
    dateRange: "June 21 – July 22",
    element: "Water",
    modality: "Cardinal",
    rulingPlanet: "Moon",
    traits: ["Sensitive", "Nurturing", "Loyal", "Intuitive", "Protective"],
    description:
      "Cancer energy is emotional, tender, and deeply attuned to home. People with this sign often lead with care, memory, and a strong sense of belonging.",
  },
  leo: {
    name: "Leo",
    symbol: "♌",
    dateRange: "July 23 – August 22",
    element: "Fire",
    modality: "Fixed",
    rulingPlanet: "Sun",
    traits: ["Confident", "Expressive", "Loyal", "Warm", "Dramatic"],
    description:
      "Leo energy is bold, expressive, and naturally visible. People with this sign are often drawn to leadership, creativity, and bringing warmth into the spaces they enter.",
  },
  virgo: {
    name: "Virgo",
    symbol: "♍",
    dateRange: "August 23 – September 22",
    element: "Earth",
    modality: "Mutable",
    rulingPlanet: "Mercury",
    traits: ["Precise", "Thoughtful", "Helpful", "Analytical", "Grounded"],
    description:
      "Virgo energy is observant, refined, and quietly devoted to improvement. People with this sign often find meaning in craft, service, and careful attention to detail.",
  },
  libra: {
    name: "Libra",
    symbol: "♎",
    dateRange: "September 23 – October 22",
    element: "Air",
    modality: "Cardinal",
    rulingPlanet: "Venus",
    traits: ["Balanced", "Charming", "Fair", "Social", "Aesthetic"],
    description:
      "Libra energy is graceful, relational, and tuned to harmony. People with this sign often seek beauty, partnership, and a sense of balance in everything they touch.",
  },
  scorpio: {
    name: "Scorpio",
    symbol: "♏",
    dateRange: "October 23 – November 21",
    element: "Water",
    modality: "Fixed",
    rulingPlanet: "Pluto",
    traits: ["Intense", "Loyal", "Perceptive", "Magnetic", "Private"],
    description:
      "Scorpio energy is deep, focused, and unafraid of what lies beneath the surface. People with this sign often value emotional truth and powerful, lasting bonds.",
  },
  sagittarius: {
    name: "Sagittarius",
    symbol: "♐",
    dateRange: "November 22 – December 21",
    element: "Fire",
    modality: "Mutable",
    rulingPlanet: "Jupiter",
    traits: ["Adventurous", "Optimistic", "Honest", "Free", "Philosophical"],
    description:
      "Sagittarius energy is expansive, restless, and drawn to meaning. People with this sign often chase new horizons, big ideas, and the freedom to grow.",
  },
  capricorn: {
    name: "Capricorn",
    symbol: "♑",
    dateRange: "December 22 – January 19",
    element: "Earth",
    modality: "Cardinal",
    rulingPlanet: "Saturn",
    traits: ["Disciplined", "Ambitious", "Patient", "Responsible", "Wise"],
    description:
      "Capricorn energy is steady, structured, and quietly ambitious. People with this sign tend to build slowly, value mastery, and aim for lasting results.",
  },
  aquarius: {
    name: "Aquarius",
    symbol: "♒",
    dateRange: "January 20 – February 18",
    element: "Air",
    modality: "Fixed",
    rulingPlanet: "Uranus",
    traits: ["Inventive", "Independent", "Open-minded", "Idealistic", "Curious"],
    description:
      "Aquarius energy is original, future-facing, and deeply individual. People with this sign are often drawn to ideas, communities, and reimagining how things could be.",
  },
  pisces: {
    name: "Pisces",
    symbol: "♓",
    dateRange: "February 19 – March 20",
    element: "Water",
    modality: "Mutable",
    rulingPlanet: "Neptune",
    traits: ["Dreamy", "Empathic", "Creative", "Gentle", "Intuitive"],
    description:
      "Pisces energy is soft, imaginative, and emotionally attuned. People with this sign often live close to art, dreams, and the quiet currents of feeling.",
  },
};

export function getZodiacSign(month: number, day: number): ZodiacSign {
  // month is 1-12
  const md = month * 100 + day;
  if (md >= 321 && md <= 419) return ZODIAC.aries;
  if (md >= 420 && md <= 520) return ZODIAC.taurus;
  if (md >= 521 && md <= 620) return ZODIAC.gemini;
  if (md >= 621 && md <= 722) return ZODIAC.cancer;
  if (md >= 723 && md <= 822) return ZODIAC.leo;
  if (md >= 823 && md <= 922) return ZODIAC.virgo;
  if (md >= 923 && md <= 1022) return ZODIAC.libra;
  if (md >= 1023 && md <= 1121) return ZODIAC.scorpio;
  if (md >= 1122 && md <= 1221) return ZODIAC.sagittarius;
  if (md >= 1222 || md <= 119) return ZODIAC.capricorn;
  if (md >= 120 && md <= 218) return ZODIAC.aquarius;
  return ZODIAC.pisces; // Feb 19 - Mar 20 (incl. Feb 29)
}
