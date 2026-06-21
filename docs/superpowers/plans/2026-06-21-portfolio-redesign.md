# Redesign do Portfólio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir o portfólio como um site estático data-driven, com tema claro/escuro e conteúdo fácil de atualizar.

**Architecture:** HTML semântico + CSS com variáveis de tema + ES modules. Projetos e experiências moram em arquivos de dados (`data/*.js`); funções puras em `render.js` transformam esses dados em HTML; `main.js` injeta no DOM e liga o toggle de tema. Sem framework e sem build step.

**Tech Stack:** HTML5, CSS3 (custom properties), JavaScript ES modules. Fontes Google (Sora + Poppins). Testes com `node --test` (nativo, sem dependências).

## Global Constraints

- Sem framework, sem bundler, sem dependências de runtime. O site abre num servidor estático qualquer.
- JavaScript em **ES modules** (`<script type="module">`). Decisão fechada (resolve o ponto em aberto da spec).
- **Node ≥ 18** é necessário apenas para rodar os testes (`node --test`); o site em si não precisa de Node.
- Servir localmente com `python3 -m http.server 8000` a partir de `src/` (ES modules exigem `http://`, não funcionam via `file://`).
- Idioma da interface: **pt-BR**. Código, nomes e comentários em **inglês** (CLAUDE.md).
- Commits no formato `<emoji><type>: <descrição imperativa, <50 chars>`, com trailer `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- Paleta e fontes: valores exatos da spec §4 (copiados verbatim no Task 5).
- Branch de trabalho: `redesign-portfolio` (já criada).

---

## Estrutura de arquivos

```
src/
├── index.html              # estrutura semântica + footer com SVGs + meta/OG
├── css/
│   └── style.css           # variáveis de tema + estilos + responsivo
├── js/
│   ├── data/
│   │   ├── projects.js     # ⭐ lista de projetos (Ariana edita aqui)
│   │   └── experience.js   # itens da timeline
│   ├── render.js           # funções puras: projectsHTML / experienceHTML
│   ├── theme.js            # nextTheme / applyTheme / initTheme / toggleTheme
│   └── main.js             # importa tudo, injeta no DOM, liga eventos
└── imagens/
    └── perfil.jpg          # avatar (imagem do GitHub)
tests/
├── data.test.js
├── render.test.js
└── theme.test.js
```

Arquivos antigos a remover no Task 7: o `index.html`/`style.css` antigos são sobrescritos; os PNGs `logoinsta.png`, `logolinkedin.png`, `logogit.png` saem (viram SVG inline).

---

### Task 1: Módulos de dados (projects + experience)

**Files:**
- Create: `src/js/data/projects.js`
- Create: `src/js/data/experience.js`
- Test: `tests/data.test.js`

**Interfaces:**
- Produces: `export const projects` — array de `{ title:string, description:string, icon:string, tags:string[], repo:string, demo:string }`.
- Produces: `export const experience` — array de `{ icon:string, period:string, role:string, org:string, description:string, accent:'coral'|'teal'|'lilac' }`.

- [ ] **Step 1: Escrever o teste que falha**

```js
// tests/data.test.js
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
```

- [ ] **Step 2: Rodar o teste e confirmar que falha**

Run: `node --test tests/data.test.js`
Expected: FAIL — `Cannot find module '../src/js/data/projects.js'`

- [ ] **Step 3: Criar `src/js/data/projects.js`**

```js
// Project list — edit this file to add or update a project.
export const projects = [
  {
    title: "staart-api-users",
    description:
      "API REST com CRUD completo de usuários, validação e persistência em banco relacional.",
    icon: "🔌",
    tags: ["Node.js", "Express", "Knex", "MySQL", "JOI"],
    repo: "https://github.com/arianaacarvalh0/staart-api-users",
    demo: "",
  },
  {
    title: "Criador de Roadmap com IA",
    description:
      "Gera roadmaps de aprendizado personalizados usando a API do Gemini. Projeto da imersão de IA da Alura.",
    icon: "🤖",
    tags: ["Python", "Gemini API", "Jupyter"],
    repo: "https://github.com/arianaacarvalh0/alura-imersao-ia-avaliacao",
    demo: "",
  },
];
```

- [ ] **Step 4: Criar `src/js/data/experience.js`**

```js
// Experience timeline — most recent first.
export const experience = [
  {
    icon: "💼",
    period: "Jan 2025 — Atual",
    role: "Engenheira de Software",
    org: "Cloud Humans · Remoto",
    description:
      "Desenvolvimento de APIs e sistemas em produção, com integração de IA/LLMs.",
    accent: "coral",
  },
  {
    icon: "🎓",
    period: "2022 — 2024",
    role: "Análise e Desenvolvimento de Sistemas",
    org: "Unifatecie",
    description:
      "Formação em tecnologia, com base em programação, banco de dados e engenharia de software.",
    accent: "teal",
  },
  {
    icon: "🚀",
    period: "2019",
    role: "Meu primeiro projeto",
    org: "Curso técnico",
    description:
      "Um PDV (sistema de ponto de venda) em Java — onde tudo começou.",
    accent: "lilac",
  },
];
```

- [ ] **Step 5: Rodar o teste e confirmar que passa**

Run: `node --test tests/data.test.js`
Expected: PASS — 2 testes ok.

- [ ] **Step 6: Commit**

```bash
git add src/js/data/projects.js src/js/data/experience.js tests/data.test.js
git commit -m "✨feature: add portfolio data modules" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Funções de renderização (HTML a partir dos dados)

**Files:**
- Create: `src/js/render.js`
- Test: `tests/render.test.js`

**Interfaces:**
- Consumes: shapes de `projects` e `experience` do Task 1.
- Produces: `projectsHTML(projects)` e `experienceHTML(experience)` → string HTML. Também exporta `projectCard(project)` e `experienceItem(item)` (unitários). Funções **puras**, sem acesso ao DOM (testáveis em Node).

- [ ] **Step 1: Escrever o teste que falha**

```js
// tests/render.test.js
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
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `node --test tests/render.test.js`
Expected: FAIL — `Cannot find module '../src/js/render.js'`

- [ ] **Step 3: Implementar `src/js/render.js`**

```js
// Pure functions: turn data objects into HTML strings. No DOM access.

export function projectCard(project) {
  const { title, description, icon, tags, repo, demo } = project;
  const chips = tags.map((t) => `<span class="chip">${t}</span>`).join("");
  const links = [
    repo ? `<a href="${repo}">Código ↗</a>` : "",
    demo ? `<a href="${demo}">Demo ↗</a>` : "",
  ].join("");
  return `
    <article class="card">
      <div class="card-img">${icon}</div>
      <div class="card-body">
        <h3>${title}</h3>
        <p>${description}</p>
        <div class="chips">${chips}</div>
        <div class="card-links">${links}</div>
      </div>
    </article>`;
}

export function projectsHTML(projects) {
  return projects.map(projectCard).join("");
}

export function experienceItem(item) {
  const { icon, period, role, org, description, accent } = item;
  return `
    <div class="tl-item">
      <div class="tl-dot" style="border-color: var(--${accent});">${icon}</div>
      <div class="tl-period">${period}</div>
      <div class="tl-role">${role}</div>
      <div class="tl-org">${org}</div>
      <p class="tl-desc">${description}</p>
    </div>`;
}

export function experienceHTML(items) {
  return items.map(experienceItem).join("");
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `node --test tests/render.test.js`
Expected: PASS — 4 testes ok.

- [ ] **Step 5: Commit**

```bash
git add src/js/render.js tests/render.test.js
git commit -m "✨feature: add data-to-html render functions" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Módulo de tema (toggle claro/escuro)

**Files:**
- Create: `src/js/theme.js`
- Test: `tests/theme.test.js`

**Interfaces:**
- Produces: `nextTheme(current)` (pura, testável), `applyTheme(theme)`, `initTheme()`, `toggleTheme()`. As três últimas tocam `document`/`localStorage` e só rodam no browser; o teste cobre só `nextTheme`.

- [ ] **Step 1: Escrever o teste que falha**

```js
// tests/theme.test.js
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
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `node --test tests/theme.test.js`
Expected: FAIL — `Cannot find module '../src/js/theme.js'`

- [ ] **Step 3: Implementar `src/js/theme.js`**

```js
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
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `node --test tests/theme.test.js`
Expected: PASS — 2 testes ok.

- [ ] **Step 5: Commit**

```bash
git add src/js/theme.js tests/theme.test.js
git commit -m "✨feature: add light/dark theme module" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Estrutura HTML (index.html) + assets

**Files:**
- Create/overwrite: `src/index.html`
- Asset: copiar avatar para `src/imagens/perfil.jpg`

**Interfaces:**
- Consumes: `src/js/main.js` (Task 6) via `<script type="module" src="js/main.js">`. Containers `#projects-grid` e `#timeline` ficam vazios aqui; o JS os preenche.
- Produces: ids `themeBtn`, `projects-grid`, `timeline`; classes consumidas pelo CSS (Task 5).

- [ ] **Step 1: Copiar o avatar para os assets**

```bash
cp ".superpowers/brainstorm/54458-1782056658/content/avatar.jpeg" "src/imagens/perfil.jpg"
```

Expected: arquivo `src/imagens/perfil.jpg` criado (~58 KB).

- [ ] **Step 2: Escrever `src/index.html`**

```html
<!DOCTYPE html>
<html lang="pt-br" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ariana Carvalho · Engenheira de Software</title>
  <meta name="description" content="Portfólio de Ariana Carvalho, Engenheira de Software. Projetos, experiência e contato.">
  <meta property="og:title" content="Ariana Carvalho · Engenheira de Software">
  <meta property="og:description" content="Portfólio de Ariana Carvalho — projetos, experiência e contato.">
  <meta property="og:type" content="website">
  <meta property="og:image" content="imagens/perfil.jpg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <nav>
    <div class="nav-inner">
      <div class="brand">Ariana<span>.</span>dev</div>
      <div class="nav-links">
        <a class="menu-link" href="#sobre">Sobre</a>
        <a class="menu-link" href="#experiencia">Experiência</a>
        <a class="menu-link" href="#projetos">Projetos</a>
        <button class="toggle" id="themeBtn" title="Alternar tema" aria-label="Alternar tema">🌙</button>
      </div>
    </div>
  </nav>

  <div class="wrap">
    <section class="hero">
      <div>
        <div class="eyebrow c-lilac">Engenheira de Software</div>
        <h1>Oi, eu sou <span class="accent">Ariana Carvalho</span></h1>
        <div class="hero-loc">📍 Cabo Frio-RJ · Brasil</div>
        <p>A tecnologia é a minha maneira de mudar o mundo. Construo APIs e sistemas em produção e estou sempre explorando novas tecnologias.</p>
        <div class="cta">
          <a class="btn btn-primary" href="imagens/curriculo.pdf">⭳ Baixar currículo</a>
          <a class="btn btn-ghost" href="#projetos">Ver projetos →</a>
        </div>
      </div>
      <div class="avatar-wrap">
        <img class="avatar" src="imagens/perfil.jpg" alt="Ariana Carvalho">
        <div class="avatar-badge">👩‍💻</div>
      </div>
    </section>
  </div>

  <section class="about" id="sobre">
    <div class="wrap about-grid">
      <div>
        <div class="eyebrow c-coral">Sobre mim</div>
        <h2>Curiosa, resolvedora de problemas e apaixonada por pessoas.</h2>
      </div>
      <div>
        <p>Sou uma pessoa curiosa e que gosta de aprender. Quando tenho um problema, exploro todas as soluções possíveis para resolvê-lo. Gosto de me relacionar com outras pessoas e de ajudá-las.</p>
      </div>
    </div>
  </section>

  <section class="experience" id="experiencia">
    <div class="wrap">
      <div class="eyebrow c-teal">Trajetória</div>
      <h2>Experiência</h2>
      <p class="lead">Onde estou e por onde passei.</p>
      <div class="timeline" id="timeline"></div>
    </div>
  </section>

  <section class="projects" id="projetos">
    <div class="wrap">
      <div class="eyebrow c-lilac">Portfólio</div>
      <h2>Projetos</h2>
      <p class="lead">Uma seleção do que venho construindo e aprendendo.</p>
      <div class="grid" id="projects-grid"></div>
    </div>
  </section>

  <footer>
    <div class="social">
      <a href="https://www.instagram.com/arianaacarvalho/" title="Instagram" aria-label="Instagram">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38C1.35 2.67.94 3.34.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.8.72 1.47 1.38 2.13.66.66 1.33 1.07 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.12A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-10.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z"/></svg>
      </a>
      <a href="https://www.linkedin.com/in/arianaacarvalho/" title="LinkedIn" aria-label="LinkedIn">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>
      </a>
      <a href="https://github.com/arianaacarvalh0" title="GitHub" aria-label="GitHub">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58l-.01-2.04c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22l-.01 3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3Z"/></svg>
      </a>
    </div>
    <p>Feito com ❤️ por Ariana Carvalho</p>
  </footer>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Subir um servidor estático e verificar a estrutura**

Run: `cd src && python3 -m http.server 8000` (deixe rodando; abra `http://localhost:8000`)
Expected (sem CSS ainda, layout cru): aparecem nav, hero com **a foto da Ariana carregada** (não ícone quebrado), seção Sobre, "Experiência" (lista vazia por enquanto), "Projetos" (vazio), e os 3 ícones sociais no rodapé. No console do navegador: erro 404 esperado só para `js/main.js` e `css/style.css` (ainda não existem) — nenhum outro erro.

- [ ] **Step 4: Commit**

```bash
git add src/index.html src/imagens/perfil.jpg
git commit -m "✨feature: add portfolio html structure and avatar" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: Folha de estilo (style.css) com temas

**Files:**
- Create: `src/css/style.css`

**Interfaces:**
- Consumes: classes/ids definidos no `index.html` (Task 4) e o atributo `data-theme` no `<html>` (Task 3).

- [ ] **Step 1: Escrever `src/css/style.css`**

> Valores de paleta/fontes copiados verbatim da spec §4. Removidas as regras de `.stats`,
> `.skill-*` e `.card.dashed` (fora de escopo — não existem no HTML final).

```css
:root {
  --bg: #f4effb;
  --bg-soft: #e7dcf6;
  --surface: #ffffff;
  --text: #322a40;
  --text-soft: #6f6480;
  --lilac: #7a4ba8;
  --lilac-strong: #683f93;
  --lilac-tint: #efe4f8;
  --coral: #c05636;
  --coral-strong: #a8432a;
  --coral-tint: #f8e6dd;
  --teal: #4d6e92;
  --teal-strong: #3d5a7a;
  --teal-tint: #dde6f1;
  --border: #e0d2f3;
  --shadow: 0 14px 36px -14px rgba(122, 75, 168, .42);
  --tag-bg: #efe4f8;
  --tag-text: #7a4ba8;
}
[data-theme="dark"] {
  --bg: #1a1426;
  --bg-soft: #241a36;
  --surface: #271d3a;
  --text: #f1eafb;
  --text-soft: #b9abce;
  --lilac: #c9b8e8;
  --lilac-strong: #d7c9f0;
  --lilac-tint: #342748;
  --coral: #e8916f;
  --coral-strong: #f0a784;
  --coral-tint: #3a2820;
  --teal: #8ba6c4;
  --teal-strong: #a3bad4;
  --teal-tint: #22303f;
  --border: #3a2d52;
  --shadow: 0 16px 40px -16px rgba(0, 0, 0, .7);
  --tag-bg: #342748;
  --tag-text: #c9b8e8;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  font-family: 'Poppins', sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  transition: background .35s ease, color .35s ease;
}
h1, h2, h3 { font-family: 'Sora', sans-serif; line-height: 1.15; }
.wrap { max-width: 1080px; margin: auto; padding: 0 28px; }
section { padding: 90px 0; }
.eyebrow {
  text-transform: uppercase; letter-spacing: .18em; font-size: 12px;
  font-weight: 600; margin-bottom: 12px;
}
.eyebrow.c-lilac { color: var(--lilac); }
.eyebrow.c-coral { color: var(--coral-strong); }
.eyebrow.c-teal  { color: var(--teal-strong); }

nav {
  position: sticky; top: 0; z-index: 50;
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}
.nav-inner { display: flex; align-items: center; justify-content: space-between; padding: 16px 28px; max-width: 1080px; margin: auto; }
.brand { font-family: 'Sora'; font-weight: 800; font-size: 18px; }
.brand span { color: var(--coral); }
.nav-links { display: flex; gap: 28px; align-items: center; }
.nav-links a { color: var(--text-soft); text-decoration: none; font-size: 15px; font-weight: 500; transition: color .2s; }
.nav-links a:hover { color: var(--coral); }
.toggle {
  width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--border);
  background: var(--surface); cursor: pointer; font-size: 18px; display: grid; place-items: center;
  transition: transform .2s, border-color .2s;
}
.toggle:hover { transform: scale(1.08); border-color: var(--coral); }

.hero { display: grid; grid-template-columns: 1fr 300px; gap: 56px; align-items: center; padding-top: 80px; }
.hero h1 { font-size: 46px; font-weight: 800; letter-spacing: -.02em; }
.hero h1 .accent { color: var(--coral); }
.hero-loc { color: var(--text-soft); font-size: 14px; font-weight: 500; margin-top: 12px; display: inline-flex; align-items: center; gap: 5px; }
.hero p { color: var(--text-soft); font-size: 18px; margin: 16px 0 32px; max-width: 520px; }
.cta { display: flex; gap: 14px; flex-wrap: wrap; }
.btn {
  padding: 14px 26px; border-radius: 12px; font-weight: 600; font-size: 15px;
  text-decoration: none; transition: transform .15s, box-shadow .2s, background .2s; display: inline-block;
}
.btn-primary { background: var(--coral); color: #fff; box-shadow: var(--shadow); }
.btn-primary:hover { transform: translateY(-2px); background: var(--coral-strong); }
.btn-ghost { border: 1.5px solid var(--teal); color: var(--teal-strong); }
.btn-ghost:hover { background: var(--teal); color: #fff; }

.avatar-wrap { justify-self: center; position: relative; }
.avatar {
  width: 280px; height: 280px; border-radius: 32px; object-fit: cover; display: block;
  border: 4px solid var(--surface);
  box-shadow: var(--shadow);
  background: var(--bg-soft);
}
.avatar-wrap::before {
  content: ""; position: absolute; inset: -14px; border-radius: 40px; z-index: -1;
  background: linear-gradient(135deg, var(--lilac), var(--coral));
  opacity: .28;
}
.avatar-badge {
  position: absolute; bottom: -12px; right: -12px; font-size: 30px;
  background: var(--surface); border-radius: 50%; width: 58px; height: 58px; display: grid; place-items: center;
  border: 1px solid var(--border); box-shadow: var(--shadow);
}

.about { background: var(--bg-soft); }
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
.about p { color: var(--text-soft); font-size: 17px; }
.about h2 { font-size: 34px; }

.experience h2 { font-size: 34px; margin-bottom: 8px; }
.experience .lead { color: var(--text-soft); margin-bottom: 44px; }
.timeline { max-width: 720px; }
.tl-item { position: relative; padding: 0 0 38px 42px; border-left: 2px solid var(--border); }
.tl-item:last-child { padding-bottom: 0; border-left-color: transparent; }
.tl-dot {
  position: absolute; left: -13px; top: -2px; width: 26px; height: 26px; border-radius: 50%;
  background: var(--surface); border: 3px solid var(--coral); display: grid; place-items: center; font-size: 12px;
}
.tl-period { font-size: 13px; font-weight: 600; color: var(--lilac); letter-spacing: .04em; }
.tl-role { font-family: 'Sora', sans-serif; font-size: 19px; font-weight: 700; margin: 4px 0 2px; }
.tl-org { color: var(--text-soft); font-size: 15px; margin-bottom: 8px; }
.tl-desc { color: var(--text-soft); font-size: 14px; }

.projects { background: var(--bg-soft); }
.projects h2 { font-size: 34px; margin-bottom: 8px; }
.projects .lead { color: var(--text-soft); margin-bottom: 34px; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.card {
  background: var(--surface); border: 1px solid var(--border); border-radius: 18px; overflow: hidden;
  transition: transform .2s, box-shadow .25s; display: flex; flex-direction: column;
}
.card:hover { transform: translateY(-6px); box-shadow: var(--shadow); }
.card-img { height: 150px; display: grid; place-items: center; font-size: 44px; }
.card:nth-child(1) .card-img { background: linear-gradient(135deg, var(--teal), var(--lilac)); }
.card:nth-child(2) .card-img { background: linear-gradient(135deg, var(--coral), var(--lilac)); }
.card-body { padding: 22px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
.card-body h3 { font-size: 19px; }
.card-body p { color: var(--text-soft); font-size: 14px; flex: 1; }
.chips { display: flex; flex-wrap: wrap; gap: 9px; margin-top: auto; }
.chip { font-size: 13px; font-weight: 500; padding: 7px 13px; border-radius: 9px; }
.card .chips { margin: 4px 0 6px; }
.card .chip { background: var(--tag-bg); color: var(--tag-text); }
.card-links { display: flex; gap: 16px; font-size: 14px; font-weight: 600; }
.card-links a { color: var(--coral); text-decoration: none; }
.card-links a:hover { text-decoration: underline; }

footer { padding: 56px 0; text-align: center; }
.social { display: flex; gap: 18px; justify-content: center; margin-bottom: 18px; }
.social a {
  width: 46px; height: 46px; border-radius: 12px; border: 1px solid var(--border);
  display: grid; place-items: center; color: var(--text); text-decoration: none; font-size: 18px;
  transition: all .2s;
}
.social a:nth-child(1):hover { background: var(--coral); color: #fff; border-color: var(--coral); transform: translateY(-3px); }
.social a:nth-child(2):hover { background: var(--teal); color: #fff; border-color: var(--teal); transform: translateY(-3px); }
.social a:nth-child(3):hover { background: var(--lilac); color: #fff; border-color: var(--lilac); transform: translateY(-3px); }
footer p { color: var(--text-soft); font-size: 14px; }

@media (max-width: 880px) {
  .hero { grid-template-columns: 1fr; text-align: center; }
  .avatar-wrap { order: -1; }
  .cta { justify-content: center; }
  .hero p { margin-left: auto; margin-right: auto; }
  .about-grid { grid-template-columns: 1fr; }
  .grid { grid-template-columns: 1fr; }
  .nav-links .menu-link { display: none; }
  .hero h1 { font-size: 34px; }
}
```

- [ ] **Step 2: Verificar no navegador (tema claro)**

Run: com o servidor do Task 4 rodando, recarregue `http://localhost:8000`.
Expected: layout estilizado — navbar lilás com blur, hero com foto emoldurada, botão de currículo terracota, "Ver projetos" com borda azul jeans, seções Sobre/Experiência/Projetos com faixas alternadas. (Grid e timeline ainda vazios — serão preenchidos no Task 6.)

- [ ] **Step 3: Verificar o tema escuro manualmente**

No DevTools (aba Elements), edite a tag `<html>` para `data-theme="dark"`.
Expected: fundo vira ameixa/lavanda escuro, textos claros, cores de destaque ajustadas. Reverta para `light` depois.

- [ ] **Step 4: Commit**

```bash
git add src/css/style.css
git commit -m "✨feature: add themed stylesheet" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: Wiring (main.js) — render + tema

**Files:**
- Create: `src/js/main.js`

**Interfaces:**
- Consumes: `projects`/`experience` (Task 1), `projectsHTML`/`experienceHTML` (Task 2), `initTheme`/`toggleTheme` (Task 3), ids `#projects-grid`/`#timeline`/`#themeBtn` (Task 4).

- [ ] **Step 1: Implementar `src/js/main.js`**

```js
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
```

- [ ] **Step 2: Verificar a renderização no navegador**

Run: com o servidor rodando, recarregue `http://localhost:8000`.
Expected:
- **Projetos**: 2 cards — `staart-api-users` e `Criador de Roadmap com IA` — com tags e link "Código ↗" (sem "Demo", pois `demo` é vazio).
- **Experiência**: 3 itens na timeline (Cloud Humans → Unifatecie → 2019), bolinhas nas cores coral/teal/lilac.
- Console sem erros.

- [ ] **Step 3: Verificar o toggle de tema e a persistência**

No navegador: clique no botão 🌙 da navbar.
Expected: o site alterna para escuro e o ícone vira ☀️. **Recarregue a página** (F5): o tema escuro permanece (salvo em `localStorage`). Clique de novo para voltar ao claro e recarregue: permanece claro.

- [ ] **Step 4: Commit**

```bash
git add src/js/main.js
git commit -m "✨feature: wire rendering and theme toggle" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 7: Limpeza, currículo, verificação final (responsivo / a11y / SEO)

**Files:**
- Delete: `src/imagens/logoinsta.png`, `src/imagens/logolinkedin.png`, `src/imagens/logogit.png`, `src/imagens/portifolio.png`, `src/imagens/CRUD.jpg`
- Rename/garantir: currículo em `src/imagens/curriculo.pdf`
- Suite: rodar todos os testes

- [ ] **Step 1: Resolver o PDF do currículo**

O hero linka `imagens/curriculo.pdf`. Renomeie o PDF existente para esse caminho:

```bash
git mv "src/imagens/ARIANA CARVALHO BACK END.pdf" "src/imagens/curriculo.pdf"
```

Se a Ariana tiver um currículo atualizado, substitua o arquivo depois (mesmo nome). Confirme com ela.

- [ ] **Step 2: Remover assets antigos não usados**

```bash
git rm src/imagens/logoinsta.png src/imagens/logolinkedin.png src/imagens/logogit.png src/imagens/portifolio.png src/imagens/CRUD.jpg
```

Expected: nenhum desses arquivos é referenciado pelo `index.html`/`style.css` novos (ícones agora são SVG inline; imagens de projeto viraram emojis nos cards).

- [ ] **Step 3: Rodar a suíte de testes completa**

Run: `node --test tests/*.test.js`
Expected: PASS — 8 testes (data, render, theme) verdes. (Use o glob `tests/*.test.js`; `node --test tests/` sem glob tenta carregar a pasta como módulo no Node 22 e falha.)

- [ ] **Step 4: Verificação responsiva**

No navegador (DevTools → modo dispositivo, largura ~375px):
Expected: hero empilha com o avatar acima; grid de projetos vira 1 coluna; links do menu somem; nada estoura horizontalmente.

- [ ] **Step 5: Verificação de acessibilidade/SEO (rápida)**

- View source: confirmar `<title>`, `<meta name="description">` e tags `og:*` presentes.
- Avatar tem `alt="Ariana Carvalho"`; cada link social tem `aria-label`.
- Navegar com Tab: foco visível percorre nav → botões → links sociais.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "🔧maintenance: clean old assets and finalize cv link" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review (preenchido)

**1. Cobertura da spec:**
- §3 estrutura de arquivos → Tasks 1–6. ✓
- §4 paleta/fontes/ritmo → Task 5 (verbatim). ✓
- §5 seções (nav/hero/sobre/experiência/projetos/footer) → Task 4. ✓
- §6 conteúdo real (timeline, projetos, links, localização) → Tasks 1 e 4. ✓
- §7 comportamentos (toggle+localStorage, scroll suave) → Task 3/6 (toggle), CSS `scroll-behavior` Task 5. ✓
- §8 responsividade → Task 5 (media query) + Task 7 (verificação). ✓
- §9 a11y/SEO → Task 4 (meta/OG/alt/aria) + Task 7 (verificação). ✓
- §10 assets (avatar, SVG, currículo) → Tasks 4 e 7. ✓
- §11 fora de escopo (skills, X/Twitter, "Próximo projeto") → não implementados, CSS órfão removido. ✓

**2. Placeholders:** nenhum "TBD/TODO". Os dois itens "em aberto" da spec (descrição do projeto de IA; PDF do currículo) viram passos concretos com decisão (Task 7 Step 1) ou ficam a critério da Ariana — explicitados, não vagos.

**3. Consistência de tipos:** `projectsHTML`/`experienceHTML`/`projectCard`/`experienceItem` (Task 2) batem com o uso no `main.js` (Task 6); ids `#projects-grid`/`#timeline`/`#themeBtn` consistentes entre Tasks 4 e 6; `accent` ∈ {coral,teal,lilac} consistente entre Task 1 (dados) e Task 2 (`var(--${accent})`).
