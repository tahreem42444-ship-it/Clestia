import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { getBirthstone } from "./birthstones.ts";
import { calculateCompatibility, getCompatibilityForBirthDates } from "./compatibility.ts";
import { getDailyHoroscope } from "./horoscope.ts";
import { getLuckyPair } from "./lucky.ts";
import { ZODIAC } from "./zodiac.ts";

describe("getDailyHoroscope", () => {
  test("returns stable text for the same sign and date", () => {
    const date = new Date(2026, 5, 5);
    assert.equal(getDailyHoroscope("Aries", date), getDailyHoroscope("Aries", date));
  });

  test("changes the horoscope as the date seed changes", () => {
    assert.notEqual(
      getDailyHoroscope("Libra", new Date(2026, 5, 5)),
      getDailyHoroscope("Libra", new Date(2026, 5, 6)),
    );
  });

  test("returns non-empty output", () => {
    const output = getDailyHoroscope("Taurus", new Date(2026, 5, 5));
    assert.ok(output);
    assert.ok(output.trim().length > 20);
  });

  test("does not contain banned overclaiming words", () => {
    const banned = [
      "perfect",
      "accurate",
      "real astrology",
      "daily email",
      "admin",
      "login",
      "AI horoscope",
      "guaranteed",
      "prediction",
      "health",
      "financial",
      "fate",
      "future",
    ];
    // Check across multiple signs and dates to ensure coverage
    const signs = [
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
    const dates = [new Date(2026, 5, 5), new Date(2026, 11, 25)];
    for (const sign of signs) {
      for (const date of dates) {
        const text = getDailyHoroscope(sign, date).toLowerCase();
        for (const word of banned) {
          assert.equal(
            text.includes(word),
            false,
            `Horoscope for ${sign} on ${date.toISOString()} contains banned word: "${word}"`,
          );
        }
      }
    }
  });
});

describe("calculateCompatibility", () => {
  test("gives Fire and Air a strong but stable compatibility result", () => {
    const result = calculateCompatibility(ZODIAC.aries, ZODIAC.gemini, new Date(2026, 5, 5));

    assert.equal(result.firstSign, "Aries");
    assert.equal(result.secondSign, "Gemini");
    // Under revised system: Air + Fire is base 86/84. No modality clash (+3/+2). Result = 89/86.
    assert.equal(result.lovePercent, 89);
    assert.equal(result.friendshipPercent, 86);
    assert.match(result.advice, /conceptual discussions/);
  });

  test("scores stay within valid range (20 to 99)", () => {
    const signs = Object.values(ZODIAC);
    for (const s1 of signs) {
      for (const s2 of signs) {
        const result = calculateCompatibility(s1, s2);
        assert.ok(result.lovePercent >= 20 && result.lovePercent <= 99);
        assert.ok(result.friendshipPercent >= 20 && result.friendshipPercent <= 99);
      }
    }
  });

  test("same inputs are deterministic", () => {
    const r1 = calculateCompatibility(ZODIAC.leo, ZODIAC.scorpio);
    const r2 = calculateCompatibility(ZODIAC.leo, ZODIAC.scorpio);
    assert.deepEqual(r1, r2);
  });

  test("same sign compatibility is handled", () => {
    const result = calculateCompatibility(ZODIAC.virgo, ZODIAC.virgo);
    assert.equal(result.lovePercent, 72);
    assert.equal(result.friendshipPercent, 78);
    assert.match(result.strength, /Shared core identity/);
    assert.match(result.friction, /ego standoffs/);
    assert.match(result.advice, /Give each other space/);
  });

  test("different signs produce meaningful text", () => {
    const result = calculateCompatibility(ZODIAC.taurus, ZODIAC.scorpio);
    assert.ok(result.strength);
    assert.ok(result.friction);
    assert.ok(result.advice);
  });

  test("validates birth dates before creating a compatibility report", () => {
    const result = getCompatibilityForBirthDates("2026-02-31", "1992-03-19");

    assert.deepEqual(result, {
      ok: false,
      errors: {
        firstBirthDate: "Please enter a valid date.",
      },
    });
  });
});

describe("getBirthstone", () => {
  test("maps birth months to common Western birthstones", () => {
    assert.equal(getBirthstone(1).name, "Garnet");
    assert.equal(getBirthstone(6).name, "Pearl");
    assert.equal(getBirthstone(12).name, "Turquoise");
  });

  test("rejects invalid month numbers", () => {
    assert.throws(() => getBirthstone(13), /valid month/);
  });
});

describe("getLuckyPair", () => {
  test("returns a deterministic lucky color and number in range", () => {
    const first = getLuckyPair("Pisces", new Date(2026, 5, 5));
    const second = getLuckyPair("Pisces", new Date(2026, 5, 5));

    assert.deepEqual(first, second);
    assert.ok(first.luckyNumber >= 1);
    assert.ok(first.luckyNumber <= 99);
    assert.equal(typeof first.luckyColor, "string");
  });
});
