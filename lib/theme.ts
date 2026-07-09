const KEY = "peptibrain_theme";

export type Theme = "light" | "dark";
export type ThemePref = "system" | "light" | "dark";

export function getStoredPref(): ThemePref {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(KEY);
  return stored === "dark" || stored === "light" || stored === "system" ? stored : "system";
}

function systemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolvePref(pref: ThemePref): Theme {
  return pref === "system" ? systemTheme() : pref;
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function setThemePref(pref: ThemePref) {
  window.localStorage.setItem(KEY, pref);
  applyTheme(resolvePref(pref));
}

export function getCurrentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

// Compat con los helpers antiguos que usa ThemeToggle
export function getStoredTheme(): Theme | null {
  const p = getStoredPref();
  return p === "system" ? null : p;
}
export function setTheme(theme: Theme) {
  setThemePref(theme);
}
