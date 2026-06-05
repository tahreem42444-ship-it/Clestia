import { parseBirthDateInput } from "./birth-date.ts";
import { getZodiacSign, type ZodiacSign } from "./zodiac.ts";

export function calculateCompatibility(
  signA: ZodiacSign,
  signB: ZodiacSign,
  _date: Date = new Date(),
) {
  const elA = signA.element;
  const elB = signB.element;
  const modA = signA.modality;
  const modB = signB.modality;

  let baseLove = 70;
  let baseFriendship = 70;
  let elementSummary = "";

  // Combine elements
  const elPair = [elA, elB].sort().join(" + ");
  switch (elPair) {
    case "Air + Fire":
      baseLove = 88;
      baseFriendship = 85;
      elementSummary =
        "Fire and Air are highly compatible, creating an exciting, dynamic, and inspiring relationship full of creative energy.";
      break;
    case "Earth + Water":
      baseLove = 86;
      baseFriendship = 84;
      elementSummary =
        "Earth and Water form a deeply nurturing bond. Earth provides structure and stability, while Water brings emotional depth and intuition.";
      break;
    case "Air + Air":
    case "Earth + Earth":
    case "Fire + Fire":
    case "Water + Water":
      baseLove = 78;
      baseFriendship = 80;
      elementSummary = `Sharing the same element (${elA}) creates instant understanding, though the dynamic can occasionally become intense or repetitive without balancing traits.`;
      break;
    case "Fire + Water":
      baseLove = 58;
      baseFriendship = 55;
      elementSummary =
        "Fire and Water represent a mixed compatibility. Fire's passion can boil Water, while Water's emotion can extinguish Fire. Balance is key.";
      break;
    case "Air + Earth":
      baseLove = 62;
      baseFriendship = 60;
      elementSummary =
        "Air and Earth offer a mixed connection, blending intellectual ideas with practical execution. Creative effort is required to align your paces.";
      break;
    case "Earth + Fire":
      baseLove = 68;
      baseFriendship = 66;
      elementSummary =
        "Fire and Earth experience practical tension. Fire seeks rapid movement and action, while Earth values steady, grounded structure.";
      break;
    case "Air + Water":
      baseLove = 52;
      baseFriendship = 50;
      elementSummary =
        "Air and Water present an emotional and mental mismatch. Air communicates through logic and ideas, while Water feels and processes through intuition.";
      break;
  }

  // Modality adjustment
  let loveAdj = 0;
  let friendshipAdj = 0;
  let modalitySummary = "";

  if (modA === modB) {
    loveAdj = -5;
    friendshipAdj = -3;
    modalitySummary = `Both signs share the ${modA} modality, which can lead to identity clashes as you both seek to process and lead in similar ways.`;
  } else {
    loveAdj = 3;
    friendshipAdj = 2;
    modalitySummary = `Your differing modalities (${modA} and ${modB}) provide a balanced dynamic, helping you complement each other's strengths.`;
  }

  const lovePercent = Math.min(100, Math.max(1, baseLove + loveAdj));
  const friendshipPercent = Math.min(100, Math.max(1, baseFriendship + friendshipAdj));

  const advice = `${elementSummary} ${modalitySummary} To thrive, focus on mutual respect and active communication, appreciating the unique qualities each of you brings to the relationship.`;

  return {
    firstSign: signA.name,
    secondSign: signB.name,
    lovePercent,
    friendshipPercent,
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

  // We know v1 and v2 are ok
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
      advice: report.advice,
    },
  };
}
