import { type CelestiaProfile, type CelestiaReport } from "./report.ts";

const KEYS = {
  PROFILE: "celestia.profile",
  HISTORY: "celestia.history",
  SAVED_REPORTS: "celestia.savedReports",
  THEME: "celestia.theme",
};

function isClient() {
  return typeof window !== "undefined";
}

export function getProfile(): CelestiaProfile | null {
  if (!isClient()) return null;
  try {
    const data = localStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Failed to read profile from localStorage", e);
    return null;
  }
}

export function saveProfile(profile: CelestiaProfile): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save profile to localStorage", e);
  }
}

export function clearProfile(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(KEYS.PROFILE);
  } catch (e) {
    console.error("Failed to clear profile from localStorage", e);
  }
}

export function getHistory(): CelestiaReport[] {
  if (!isClient()) return [];
  try {
    const data = localStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to read history from localStorage", e);
    return [];
  }
}

export function saveHistory(history: CelestiaReport[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error("Failed to save history to localStorage", e);
  }
}

export function addOrUpdateHistoryEntry(report: CelestiaReport): void {
  if (!isClient()) return;
  try {
    const history = getHistory();
    const todayStr = new Date(report.reportDate).toDateString();

    // Check if there is an entry for the same user, zodiac sign, and date (today)
    const existingIndex = history.findIndex((h) => {
      const entryDateStr = new Date(h.reportDate).toDateString();
      return (
        h.profile.name.trim().toLowerCase() === report.profile.name.trim().toLowerCase() &&
        h.zodiac.name === report.zodiac.name &&
        entryDateStr === todayStr
      );
    });

    if (existingIndex !== -1) {
      // Update the existing entry
      history[existingIndex] = {
        ...history[existingIndex],
        ...report,
        compatibility: report.compatibility || history[existingIndex].compatibility,
      };
    } else {
      history.unshift(report); // Add to the beginning
    }

    saveHistory(history);
  } catch (e) {
    console.error("Failed to add or update history entry", e);
  }
}

export function clearHistory(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(KEYS.HISTORY);
  } catch (e) {
    console.error("Failed to clear history from localStorage", e);
  }
}

export function getSavedReports(): CelestiaReport[] {
  if (!isClient()) return [];
  try {
    const data = localStorage.getItem(KEYS.SAVED_REPORTS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to read saved reports from localStorage", e);
    return [];
  }
}

export function saveSavedReports(reports: CelestiaReport[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(KEYS.SAVED_REPORTS, JSON.stringify(reports));
  } catch (e) {
    console.error("Failed to save saved reports to localStorage", e);
  }
}

export function addSavedReport(report: CelestiaReport): void {
  if (!isClient()) return;
  try {
    const reports = getSavedReports();
    // Avoid duplicates
    if (!reports.some((r) => r.id === report.id)) {
      reports.unshift(report);
      saveSavedReports(reports);
    }
  } catch (e) {
    console.error("Failed to add saved report", e);
  }
}

export function deleteSavedReport(id: string): void {
  if (!isClient()) return;
  try {
    const reports = getSavedReports();
    const filtered = reports.filter((r) => r.id !== id);
    saveSavedReports(filtered);
  } catch (e) {
    console.error("Failed to delete saved report", e);
  }
}

export function getThemePreference(): "light" | "dark" {
  if (!isClient()) return "dark";
  try {
    const saved = localStorage.getItem(KEYS.THEME) as "light" | "dark" | null;
    if (saved) return saved;
    // Respect system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  } catch (e) {
    return "dark";
  }
}

export function saveThemePreference(theme: "light" | "dark"): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(KEYS.THEME, theme);
  } catch (e) {
    console.error("Failed to save theme preference", e);
  }
}
