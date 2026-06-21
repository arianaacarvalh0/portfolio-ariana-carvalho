// Pure functions: turn data objects into HTML strings. No DOM access.

export function projectCard(project) {
  const { title, description, icon, tags, repo, demo } = project;
  const chips = tags.map((t) => `<span class="chip">${t}</span>`).join("");
  const links = [
    repo ? `<a href="${repo}" target="_blank" rel="noopener noreferrer">Código ↗</a>` : "",
    demo ? `<a href="${demo}" target="_blank" rel="noopener noreferrer">Demo ↗</a>` : "",
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
