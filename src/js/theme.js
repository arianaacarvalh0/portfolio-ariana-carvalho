// Theme handling: persist choice in localStorage, default to OS preference.
const STORAGE_KEY = "theme";

export function nextTheme(current) {
  return current === "dark" ? "light" : "dark";
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const btn = document.getElementById("themeBtn");
  if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
}

export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const value = nextTheme(current);
  localStorage.setItem(STORAGE_KEY, value);
  applyTheme(value);
}
