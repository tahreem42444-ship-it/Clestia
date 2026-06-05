const LUCKY_COLORS = [
  "Gold",
  "Indigo",
  "Pearl White",
  "Rose",
  "Emerald",
  "Sapphire",
  "Amber",
  "Silver",
  "Crimson",
  "Lavender",
  "Turquoise",
  "Copper",
];

function getSeed(str: string, date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  const inputStr = `${str.toLowerCase()}-${y}-${m}-${d}`;
  let hash = 0;
  for (let i = 0; i < inputStr.length; i++) {
    hash = (hash << 5) - hash + inputStr.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function getLuckyPair(
  signName: string,
  date: Date = new Date(),
): { luckyColor: string; luckyNumber: number } {
  const seed = getSeed(signName, date);
  // Deterministic number between 1 and 99
  const luckyNumber = (seed % 99) + 1;
  // Deterministic color from the theme-fitting list
  const luckyColor = LUCKY_COLORS[seed % LUCKY_COLORS.length];
  return { luckyColor, luckyNumber };
}
