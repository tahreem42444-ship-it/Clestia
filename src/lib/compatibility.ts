import { parseBirthDateInput } from "./birth-date.ts";
import { getZodiacSign, type ZodiacSign } from "./zodiac.ts";

const ZODIAC_ORDER = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

export type CompatibilityResult = {
  firstSign: string;
  secondSign: string;
  lovePercent: number;
  friendshipPercent: number;
  strength: string;
  friction: string;
  advice: string;
};

export function calculateCompatibility(
  signA: ZodiacSign,
  signB: ZodiacSign,
  _date: Date = new Date(),
): CompatibilityResult {
  const nameA = signA.name.toLowerCase();
  const nameB = signB.name.toLowerCase();
  const elA = signA.element;
  const elB = signB.element;
  const modA = signA.modality;
  const modB = signB.modality;

  const idxA = ZODIAC_ORDER.indexOf(nameA);
  const idxB = ZODIAC_ORDER.indexOf(nameB);
  const diff = Math.abs(idxA - idxB);

  const isSame = nameA === nameB;
  const isOpposite = diff === 6;

  let baseLove = 70;
  let baseFriendship = 70;
  let strength = "";
  let friction = "";
  let advice = "";

  const elPair = [elA, elB].sort().join(" + ");

  if (isSame) {
    baseLove = 72;
    baseFriendship = 78;
    strength = `Shared core identity under the sign of ${signA.name}, creating instant familiarity.`;
    friction = "Potential ego standoffs as you both reflect each other's exact behaviors.";
    advice = "Give each other space to lead and step back when identical reactions cause friction.";
  } else if (isOpposite) {
    baseLove = 88;
    baseFriendship = 82;
    strength = `Complementary polarities (${signA.name} and ${signB.name}) create powerful attraction and mutual balance.`;
    friction =
      "A risk of misunderstandings when one acts too independently and the other seeks joint focus.";
    advice = "Value the differences in your approach as strengths that complete the partnership.";
  } else {
    // Determine elemental compatibility
    switch (elPair) {
      case "Air + Fire":
        baseLove = 86;
        baseFriendship = 84;
        strength =
          "Dynamic communication and high inspiration; Air fuels and spreads Fire's passions.";
        friction =
          "Air can feel overwhelmed by Fire's intensity, while Fire may find Air overly analytical.";
        advice = "Balance grand conceptual discussions with real-world shared projects.";
        break;
      case "Earth + Water":
        baseLove = 84;
        baseFriendship = 82;
        strength = "Deep emotional containment and grounding; Earth shapes Water's fluid feelings.";
        friction =
          "Earth can become too rigid or stubborn, while Water can feel emotionally insecure.";
        advice = "Provide quiet reassurance while respecting each other's pace in daily routines.";
        break;
      case "Air + Air":
      case "Earth + Earth":
      case "Fire + Fire":
      case "Water + Water":
        baseLove = 76;
        baseFriendship = 80;
        strength = `Instant harmony in the element of ${elA}, bringing comfort and alignment of temperament.`;
        friction = "The partnership can become stagnant or intense without external perspectives.";
        advice = "Engage in separate hobbies to bring fresh insights back to your shared space.";
        break;
      case "Fire + Water":
        baseLove = 58;
        baseFriendship = 56;
        strength = "A blend of high emotional depth (Water) and action-oriented initiative (Fire).";
        friction =
          "Fire's directness can steamroll Water's feelings, while Water can dampen Fire's motivation.";
        advice = "Patience is key; learn to recognize when to soothe and when to encourage.";
        break;
      case "Air + Earth":
        baseLove = 62;
        baseFriendship = 60;
        strength = "Practical logic meets intellectual exploration; useful for joint planning.";
        friction = "Earth values tangible outcomes, while Air can get distracted by pure theory.";
        advice = "Focus on turning discussions into real-world, incremental achievements.";
        break;
      case "Earth + Fire":
        baseLove = 66;
        baseFriendship = 64;
        strength = "Fire brings active energy to build, while Earth offers structure and patience.";
        friction =
          "Fire seeks immediate results and progress, while Earth requires slower building blocks.";
        advice = "Acknowledge the value of steady structure alongside active initiative.";
        break;
      case "Air + Water":
        baseLove = 52;
        baseFriendship = 50;
        strength = "Blends logical objectivity (Air) with intuitive depth (Water).";
        friction = "Air communicates via concepts, while Water processes through direct feeling.";
        advice = "Allow space for emotional expression without immediately trying to analyze it.";
        break;
    }
  }

  // Modality adjustment
  let loveAdj = 0;
  let friendshipAdj = 0;

  if (modA === modB && !isSame) {
    loveAdj = -4;
    friendshipAdj = -2;
    friction += ` Sharing the ${modA} modality can also trigger stubborness or control clashes.`;
  } else if (!isSame) {
    loveAdj = 3;
    friendshipAdj = 2;
  }

  const lovePercent = Math.min(99, Math.max(20, baseLove + loveAdj));
  const friendshipPercent = Math.min(99, Math.max(20, baseFriendship + friendshipAdj));

  return {
    firstSign: signA.name,
    secondSign: signB.name,
    lovePercent,
    friendshipPercent,
    strength,
    friction,
    advice,
  };
}

export function getCompatibilityForBirthDates(dateStr1: string, dateStr2: string) {
  const v1 = parseBirthDateInput(dateStr1);
  const v2 = parseBirthDateInput(dateStr2);

  if (!v1.ok || !v2.ok) {
    const errors: Record<string, string> = {};
    if (!v1.ok) errors.firstBirthDate = v1.error;
    if (!v2.ok) errors.secondBirthDate = v2.error;
    return { ok: false, errors };
  }

  const signA = getZodiacSign(v1.month, v1.day);
  const signB = getZodiacSign(v2.month, v2.day);

  const report = calculateCompatibility(signA, signB);

  return {
    ok: true,
    report: {
      id: `${dateStr1}-${dateStr2}-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      firstBirthDate: dateStr1,
      secondBirthDate: dateStr2,
      firstSign: signA.name,
      secondSign: signB.name,
      lovePercent: report.lovePercent,
      friendshipPercent: report.friendshipPercent,
      strength: report.strength,
      friction: report.friction,
      advice: report.advice,
    },
  };
}
