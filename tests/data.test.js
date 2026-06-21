import test from "node:test";
import assert from "node:assert/strict";
import { projects } from "../src/js/data/projects.js";
import { experience } from "../src/js/data/experience.js";

test("projects: 2 entradas com os campos obrigatórios", () => {
  assert.equal(projects.length, 2);
  for (const p of projects) {
    assert.ok(p.title, "title");
    assert.ok(p.description, "description");
    assert.ok(p.icon, "icon");
    assert.ok(Array.isArray(p.tags) && p.tags.length > 0, "tags");
    assert.equal(typeof p.repo, "string");
    assert.equal(typeof p.demo, "string");
  }
});

test("experience: 3 itens em ordem cronológica reversa, accent válido", () => {
  assert.equal(experience.length, 3);
  assert.match(experience[0].period, /2025/);
  assert.match(experience[2].period, /2019/);
  for (const e of experience) {
    assert.ok(["coral", "teal", "lilac"].includes(e.accent), "accent válido");
  }
});
