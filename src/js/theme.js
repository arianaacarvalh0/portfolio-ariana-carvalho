// Theme handling: persist choice in localStorage, default to light.
const STORAGE_KEY = "theme";
const DEFAULT_THEME = "light";

export function nextTheme(current) {
  return current === "dark" ? "light" : "dark";
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const btn = document.getElementById("themeBtn");
  if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
}

export function initTheme() {
  applyTheme(localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME);
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const value = nextTheme(current);
  localStorage.setItem(STORAGE_KEY, value);
  applyTheme(value);
}
