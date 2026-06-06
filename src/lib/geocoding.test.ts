import { test, describe } from "node:test";
import assert from "node:assert";
import { searchBirthLocations } from "./geocoding.ts";

describe("geocoding", () => {
  test("searchBirthLocations maps Open-Meteo response correctly", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      return {
        ok: true,
        json: async () => ({
          results: [
            {
              name: "Paris",
              country: "France",
              admin1: "Île-de-France",
              latitude: 48.8534,
              longitude: 2.3488,
              timezone: "Europe/Paris",
            },
          ],
        }),
      } as unknown as Response;
    };

    try {
      const results = await searchBirthLocations("Paris");
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0].name, "Paris");
      assert.strictEqual(results[0].country, "France");
      assert.strictEqual(results[0].admin1, "Île-de-France");
      assert.strictEqual(results[0].latitude, 48.8534);
      assert.strictEqual(results[0].longitude, 2.3488);
      assert.strictEqual(results[0].timezone, "Europe/Paris");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  test("searchBirthLocations returns empty array for queries < 2 chars", async () => {
    const results = await searchBirthLocations("P");
    assert.strictEqual(results.length, 0);
  });

  test("searchBirthLocations returns empty array on network failure", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      throw new Error("Network error");
    };

    try {
      const results = await searchBirthLocations("London");
      assert.strictEqual(results.length, 0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
