import test from "node:test";
import assert from "node:assert/strict";
import { nextTheme } from "../src/js/theme.js";

test("nextTheme alterna entre light e dark", () => {
  assert.equal(nextTheme("light"), "dark");
  assert.equal(nextTheme("dark"), "light");
});

test("nextTheme trata valor ausente como light → dark", () => {
  assert.equal(nextTheme(undefined), "dark");
});
