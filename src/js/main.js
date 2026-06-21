import { projects } from "./data/projects.js";
import { experience } from "./data/experience.js";
import { projectsHTML, experienceHTML } from "./render.js";
import { initTheme, toggleTheme } from "./theme.js";

// Render data-driven sections.
document.getElementById("projects-grid").innerHTML = projectsHTML(projects);
document.getElementById("timeline").innerHTML = experienceHTML(experience);

// Theme: restore saved preference and wire the toggle button.
initTheme();
document.getElementById("themeBtn").addEventListener("click", toggleTheme);
