import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { parseBirthDateInput } from "./birth-date.ts";
import { getZodiacSign } from "./zodiac.ts";

describe("getZodiacSign", () => {
  const cases = [
    ["2020-02-29", "Pisces"],
    ["2026-03-20", "Pisces"],
    ["2026-03-21", "Aries"],
    ["2026-04-19", "Aries"],
    ["2026-04-20", "Taurus"],
    ["2026-12-21", "Sagittarius"],
    ["2026-12-22", "Capricorn"],
    ["2026-01-01", "Capricorn"],
    ["2026-01-19", "Capricorn"],
    ["2026-01-20", "Aquarius"],
  ] as const;

  for (const [input, expected] of cases) {
    test(`${input} maps to ${expected}`, () => {
      const parsed = parseBirthDateInput(input, new Date(2026, 11, 31));

      if (!parsed.ok) assert.fail(parsed.error);
      assert.equal(getZodiacSign(parsed.month, parsed.day).name, expected);
    });
  }
});

describe("parseBirthDateInput", () => {
  const today = new Date(2026, 5, 4);

  test("rejects an empty date", () => {
    assert.deepEqual(parseBirthDateInput("", today), {
      ok: false,
      error: "Please enter your date of birth.",
    });
  });

  test("rejects malformed dates", () => {
    assert.deepEqual(parseBirthDateInput("2026-2-03", today), {
      ok: false,
      error: "Please enter a valid date.",
    });
  });

  test("rejects impossible dates", () => {
    assert.deepEqual(parseBirthDateInput("2026-02-31", today), {
      ok: false,
      error: "Please enter a valid date.",
    });
  });

  test("rejects dates before the minimum supported birth date", () => {
    assert.deepEqual(parseBirthDateInput("1899-12-31", today), {
      ok: false,
      error: "Please enter a valid date.",
    });
  });

  test("rejects tomorrow as a future date", () => {
    assert.deepEqual(parseBirthDateInput("2026-06-05", today), {
      ok: false,
      error: "Date of birth cannot be in the future.",
    });
  });

  test("accepts today and returns local date parts", () => {
    assert.deepEqual(parseBirthDateInput("2026-06-04", today), {
      ok: true,
      year: 2026,
      month: 6,
      day: 4,
      value: "2026-06-04",
    });
  });
});
