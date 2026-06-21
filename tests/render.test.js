import test from "node:test";
import assert from "node:assert/strict";
import { projectCard, experienceItem, projectsHTML, experienceHTML } from "../src/js/render.js";

test("projectCard inclui título, descrição, tags e link de código", () => {
  const html = projectCard({
    title: "Demo", description: "Desc", icon: "🔌",
    tags: ["A", "B"], repo: "https://repo", demo: "",
  });
  assert.match(html, /Demo/);
  assert.match(html, /Desc/);
  assert.match(html, /<span class="chip">A<\/span>/);
  assert.match(html, /href="https:\/\/repo"/);
  assert.match(html, /Código/);
  assert.doesNotMatch(html, /Demo ↗/); // demo vazio não gera link de demo
});

test("projectCard mostra link de demo quando presente", () => {
  const html = projectCard({
    title: "X", description: "Y", icon: "🔌",
    tags: ["A"], repo: "https://r", demo: "https://demo",
  });
  assert.match(html, /Demo ↗/);
  assert.match(html, /href="https:\/\/demo"/);
});

test("experienceItem usa a cor de accent na bolinha", () => {
  const html = experienceItem({
    icon: "💼", period: "2025", role: "Eng", org: "Org", description: "D", accent: "coral",
  });
  assert.match(html, /var\(--coral\)/);
  assert.match(html, /2025/);
  assert.match(html, /Eng/);
});

test("projectsHTML e experienceHTML concatenam todos os itens", () => {
  const p = projectsHTML([
    { title: "P1", description: "d", icon: "x", tags: ["t"], repo: "", demo: "" },
    { title: "P2", description: "d", icon: "x", tags: ["t"], repo: "", demo: "" },
  ]);
  assert.match(p, /P1/);
  assert.match(p, /P2/);

  const e = experienceHTML([
    { icon: "a", period: "p1", role: "r", org: "o", description: "d", accent: "teal" },
    { icon: "b", period: "p2", role: "r", org: "o", description: "d", accent: "lilac" },
  ]);
  assert.match(e, /p1/);
  assert.match(e, /p2/);
});
