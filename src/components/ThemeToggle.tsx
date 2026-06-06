import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { getThemePreference, saveThemePreference } from "@/lib/storage";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const initialTheme = getThemePreference();
    setTheme(initialTheme);
    const root = document.documentElement;
    if (initialTheme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    saveThemePreference(newTheme);
    const root = document.documentElement;
    if (newTheme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="rounded-full border border-border bg-[oklch(1_0_0/0.05)] p-2 text-gold transition-colors hover:bg-[oklch(1_0_0/0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/40 cursor-pointer"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
