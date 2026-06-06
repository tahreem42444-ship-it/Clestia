import { test, describe } from "node:test";
import assert from "node:assert";
import {
  zodiacSignFromLongitude,
  degreeInSign,
  getMoonPhaseInfo,
  getPlanetPositions,
  getCurrentTransitReport,
  normalizeLongitude,
} from "./astronomy-engine.ts";

describe("astronomy-engine", () => {
  test("normalizeLongitude bounds degrees to [0, 360)", () => {
    assert.strictEqual(normalizeLongitude(360), 0);
    assert.strictEqual(normalizeLongitude(-10), 350);
    assert.strictEqual(normalizeLongitude(720), 0);
    assert.strictEqual(normalizeLongitude(180.5), 180.5);
  });

  test("zodiacSignFromLongitude maps longitude to correct zodiac sign", () => {
    assert.strictEqual(zodiacSignFromLongitude(0), "Aries");
    assert.strictEqual(zodiacSignFromLongitude(15), "Aries");
    assert.strictEqual(zodiacSignFromLongitude(30), "Taurus");
    assert.strictEqual(zodiacSignFromLongitude(45), "Taurus");
    assert.strictEqual(zodiacSignFromLongitude(359.9), "Pisces");
  });

  test("degreeInSign returns a value in the [0, 30) range", () => {
    assert.strictEqual(degreeInSign(0), 0);
    assert.strictEqual(degreeInSign(15), 15);
    assert.strictEqual(degreeInSign(30), 0);
    assert.strictEqual(degreeInSign(45.5), 15.5);
    assert.ok(degreeInSign(359.9) >= 0 && degreeInSign(359.9) < 30);
  });

  test("getMoonPhaseInfo returns non-empty name and values", () => {
    const info = getMoonPhaseInfo(new Date());
    assert.ok(info.name);
    assert.ok(typeof info.name === "string");
    assert.ok(
      info.illumination !== undefined && info.illumination >= 0 && info.illumination <= 100,
    );
    assert.ok(info.ageDays !== undefined && info.ageDays >= 0 && info.ageDays <= 30);
  });

  test("getPlanetPositions includes Sun and Moon", () => {
    const planets = getPlanetPositions(new Date());
    const names = planets.map((p) => p.planet);
    assert.ok(names.includes("Sun"));
    assert.ok(names.includes("Moon"));

    // Check fields on a returned planet
    const sun = planets.find((p) => p.planet === "Sun");
    assert.ok(sun);
    assert.ok(typeof sun.sign === "string");
    assert.ok(typeof sun.longitude === "number");
    assert.ok(sun.degreeInSign >= 0 && sun.degreeInSign < 30);
  });

  test("getCurrentTransitReport returns a non-empty forecast summary", () => {
    const report = getCurrentTransitReport(new Date());
    assert.ok(report.summary);
    assert.ok(report.summary.length > 20);
    assert.strictEqual(report.source, "astronomy-engine");
    assert.ok(Array.isArray(report.planets));
    assert.ok(report.moonPhase.name);
  });
});
