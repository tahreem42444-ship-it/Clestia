import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { getBirthstone } from "./birthstones.ts";
import {
  calculateCompatibility,
  getCompatibilityForBirthDates,
} from "./compatibility.ts";
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
});

describe("calculateCompatibility", () => {
  test("gives Fire and Air a strong but stable compatibility result", () => {
    const result = calculateCompatibility(ZODIAC.aries, ZODIAC.gemini, new Date(2026, 5, 5));

    assert.equal(result.firstSign, "Aries");
    assert.equal(result.secondSign, "Gemini");
    assert.equal(result.lovePercent, 91);
    assert.equal(result.friendshipPercent, 87);
    assert.match(result.advice, /Fire and Air/);
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
