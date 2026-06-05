export interface BirthstoneInfo {
  name: string;
  meaning: string;
  benefits: string;
}

export const BIRTHSTONES: Record<number, BirthstoneInfo> = {
  1: {
    name: "Garnet",
    meaning: "Purity, truth, and friendship",
    benefits:
      "Traditionally associated with safety in travel, energy replenishment, and grounding.",
  },
  2: {
    name: "Amethyst",
    meaning: "Clarity, calm, and protection",
    benefits:
      "Traditionally associated with soothing stress, balancing mood, and enhancing intuition.",
  },
  3: {
    name: "Aquamarine",
    meaning: "Serenity, clarity, and harmony",
    benefits:
      "Traditionally associated with calming energies, reducing fear, and clearing communication.",
  },
  4: {
    name: "Diamond",
    meaning: "Strength, love, and endurance",
    benefits:
      "Traditionally associated with amplification of energies, mental clarity, and inner strength.",
  },
  5: {
    name: "Emerald",
    meaning: "Rebirth, love, and wisdom",
    benefits:
      "Traditionally associated with emotional healing, domestic bliss, and enhancing focus.",
  },
  6: {
    name: "Pearl",
    meaning: "Purity, loyalty, and wisdom",
    benefits: "Traditionally associated with calming properties, loyalty, and promoting integrity.",
  },
  7: {
    name: "Ruby",
    meaning: "Passion, protection, and prosperity",
    benefits:
      "Traditionally associated with vitality, sexual energy, and strengthening heart courage.",
  },
  8: {
    name: "Peridot",
    meaning: "Strength, balance, and growth",
    benefits:
      "Traditionally associated with warding off bad dreams, reducing anger, and welcoming change.",
  },
  9: {
    name: "Sapphire",
    meaning: "Wisdom, loyalty, and nobility",
    benefits:
      "Traditionally associated with attracting abundance, mental clarity, and spiritual devotion.",
  },
  10: {
    name: "Opal",
    meaning: "Hope, purity, and creativity",
    benefits:
      "Traditionally associated with amplifying original thinking, emotional release, and love.",
  },
  11: {
    name: "Citrine",
    meaning: "Abundance, joy, and manifestation",
    benefits:
      "Traditionally associated with self-cleansing properties, wealth attraction, and creativity.",
  },
  12: {
    name: "Turquoise",
    meaning: "Protection, friendship, and peace",
    benefits:
      "Traditionally associated with physical strength, balancing chakras, and bringing good fortune.",
  },
};

export function getBirthstone(monthNumber: number): BirthstoneInfo {
  if (monthNumber < 1 || monthNumber > 12 || Number.isNaN(monthNumber)) {
    throw new Error("Please enter a valid month (1-12).");
  }
  return BIRTHSTONES[monthNumber];
}
