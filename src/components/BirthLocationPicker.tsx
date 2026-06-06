import { useState, useEffect } from "react";
import { searchBirthLocations } from "@/lib/geocoding";
import type { BirthLocation } from "@/lib/astro-types";

type BirthLocationPickerProps = {
  value?: BirthLocation;
  onChange: (location?: BirthLocation) => void;
};

export function BirthLocationPicker({ value, onChange }: BirthLocationPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BirthLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (value) {
      const locationText = [value.name, value.admin1, value.country].filter(Boolean).join(", ");
      setQuery(locationText);
    } else {
      setQuery("");
    }
  }, [value]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    // If the input matches the currently selected value, don't trigger a new search
    if (value) {
      const currentText = [value.name, value.admin1, value.country].filter(Boolean).join(", ");
      if (query === currentText) {
        return;
      }
    }

    setLoading(true);
    setError(null);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const locations = await searchBirthLocations(query);
        setResults(locations);
      } catch (err) {
        setError("Failed to fetch location data.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query, value]);

  const handleSelect = (loc: BirthLocation) => {
    onChange(loc);
    const locationText = [loc.name, loc.admin1, loc.country].filter(Boolean).join(", ");
    setQuery(locationText);
    setResults([]);
    setFocused(false);
  };

  const handleClear = () => {
    onChange(undefined);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="relative space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="birth-location-search"
          className="block text-[10px] uppercase tracking-widest text-muted-foreground"
        >
          Birth Location (Optional)
        </label>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[10px] text-destructive hover:underline cursor-pointer focus:outline-none"
          >
            Clear Location
          </button>
        )}
      </div>

      <div className="relative">
        <input
          id="birth-location-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Birth city or place (e.g. London, Paris)"
          autoComplete="off"
          className="w-full rounded-xl border border-border bg-[oklch(1_0_0/0.04)] px-3 py-2.5 text-sm text-ivory outline-none transition-colors hover:bg-[oklch(1_0_0/0.06)] focus:border-[var(--gold)]/60 focus-visible:ring-2 focus-visible:ring-[var(--gold)]/30"
        />

        {loading && (
          <div className="absolute right-3 top-3 flex items-center justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--gold)] border-t-transparent" />
          </div>
        )}
      </div>

      {/* Dropdown list of geocoding results */}
      {focused && query.trim().length >= 2 && (results.length > 0 || error || !loading) && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-border bg-background p-1 shadow-lg backdrop-blur-md">
          {error && <div className="px-3 py-2 text-xs text-destructive">{error}</div>}
          {!loading && results.length === 0 && !error && (
            <div className="px-3 py-2 text-xs text-muted-foreground">No places found.</div>
          )}
          {results.map((loc, idx) => (
            <button
              key={`${loc.latitude}-${loc.longitude}-${idx}`}
              type="button"
              onClick={() => handleSelect(loc)}
              className="flex w-full flex-col items-start rounded-lg px-3 py-2 text-left text-sm hover:bg-[oklch(1_0_0/0.06)] transition-colors focus:bg-[oklch(1_0_0/0.06)] focus:outline-none cursor-pointer"
            >
              <span className="font-medium text-ivory">{loc.name}</span>
              <span className="text-xs text-muted-foreground">
                {[loc.admin1, loc.country].filter(Boolean).join(", ")}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Selected location preview details */}
      {value && (
        <div className="rounded-xl border border-border bg-[oklch(1_0_0/0.01)] p-3 space-y-1 text-xs">
          <div className="flex justify-between items-center text-muted-foreground">
            <span>Selected Coordinates:</span>
            <span className="font-mono text-[10px]">
              {Math.abs(value.latitude).toFixed(4)}°{value.latitude >= 0 ? "N" : "S"},{" "}
              {Math.abs(value.longitude).toFixed(4)}°{value.longitude >= 0 ? "E" : "W"}
            </span>
          </div>
          {value.timezone && (
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Timezone:</span>
              <span className="font-mono text-[10px]">{value.timezone}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
