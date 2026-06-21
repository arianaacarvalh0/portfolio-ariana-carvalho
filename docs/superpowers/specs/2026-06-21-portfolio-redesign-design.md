# Redesign do Portfólio — Ariana Carvalho

**Data:** 2026-06-21
**Status:** Aprovado (visual validado via mockup) — pronto para o plano de implementação

---

## 1. Objetivo

Modernizar o portfólio pessoal (hoje um site estático simples em HTML/CSS) deixando-o mais
profissional e, principalmente, **fácil de manter** — adicionar um projeto novo deve ser
trivial, sem mexer em layout. O posicionamento também é atualizado: de "Desenvolvedora
Node.js / Back End" para **Engenheira de Software**, refletindo a trajetória atual.

## 2. Decisões principais

| Tema | Decisão |
|---|---|
| Stack | HTML + CSS + JavaScript leve (sem framework, sem build) |
| Dados | Projetos e experiências vêm de arquivos de dados (`projects.js`, `experience.js`) renderizados por JS |
| Tema visual | Claro **e** escuro, com toggle e persistência em `localStorage` |
| Idioma | Português (pt-BR) |
| Layout de projetos | Grid de cards |
| Paleta | Lilás (fundos) + terracota e azul jeans (destaques), derivada do avatar |
| Fontes | Sora (títulos) + Poppins (corpo) |

**Princípio de manutenção:** conteúdo separado de apresentação. Para adicionar um projeto,
edita-se apenas uma entrada em `projects.js`; o `main.js` gera o card automaticamente.

## 3. Arquitetura de arquivos

```
src/
├── index.html            # estrutura semântica das seções
├── css/
│   └── style.css         # variáveis de tema (claro/escuro) + estilos + responsivo
├── js/
│   ├── projects.js       # ⭐ lista de projetos (a Ariana edita aqui)
│   ├── experience.js     # itens da timeline de experiência
│   └── main.js           # renderiza cards/timeline + toggle de tema
└── imagens/
    └── perfil.jpg        # avatar (imagem do GitHub)
```

### Formato dos dados

`projects.js` — cada projeto é um objeto:

```js
export const projects = [
  {
    title: "staart-api-users",
    description: "API REST com CRUD completo de usuários, validação e persistência em banco relacional.",
    icon: "🔌",                 // emoji exibido no topo do card
    tags: ["Node.js", "Express", "Knex", "MySQL", "JOI"],
    repo: "https://github.com/arianaacarvalh0/staart-api-users",
    demo: ""                    // opcional; se vazio, o link "Demo" não aparece
  },
  // ...
];
```

`experience.js` — cada item da timeline:

```js
export const experience = [
  {
    icon: "💼",
    period: "Jan 2025 — Atual",
    role: "Engenheira de Software",
    org: "Cloud Humans · Remoto",
    description: "Desenvolvimento de APIs e sistemas em produção, com integração de IA/LLMs.",
    accent: "coral"             // coral | teal | lilac — cor da bolinha na timeline
  },
  // ...
];
```

> Decisão de implementação: usar ES modules (`type="module"`) ou um objeto global simples,
> a ser definida no plano. O importante é que os dados fiquem isolados em seus arquivos.

## 4. Sistema visual

### Tipografia
- **Títulos (h1–h3):** Sora (600/700/800)
- **Corpo:** Poppins (300–700)
- Carregadas via Google Fonts com `preconnect`.

### Paleta — variáveis CSS

**Tema claro**
```
--bg: #f4effb          --surface: #ffffff      --text: #322a40
--bg-soft: #e7dcf6     --border: #e0d2f3       --text-soft: #6f6480
--lilac: #7a4ba8       --lilac-strong: #683f93 --lilac-tint: #efe4f8
--coral: #c05636       --coral-strong: #a8432a --coral-tint: #f8e6dd
--teal: #4d6e92        --teal-strong: #3d5a7a  --teal-tint: #dde6f1
--tag-bg: #efe4f8      --tag-text: #7a4ba8
```

**Tema escuro** (`[data-theme="dark"]`)
```
--bg: #1a1426          --surface: #271d3a      --text: #f1eafb
--bg-soft: #241a36     --border: #3a2d52       --text-soft: #b9abce
--lilac: #c9b8e8       --lilac-strong: #d7c9f0 --lilac-tint: #342748
--coral: #e8916f       --coral-strong: #f0a784 --coral-tint: #3a2820
--teal: #8ba6c4        --teal-strong: #a3bad4  --teal-tint: #22303f
--tag-bg: #342748      --tag-text: #c9b8e8
```

### Uso das cores (distribuição dos destaques)
- **Lilás:** fundos (`--bg` claro e faixa `--bg-soft`), eyebrow do hero, links de projeto.
- **Terracota:** botão primário, nome no hero, ícone do grupo back-end, hover.
- **Azul jeans:** botão secundário, palavra de ênfase, detalhes de cards.
- As três cores também aparecem nas bolinhas da timeline (coral → teal → lilac).

### Ritmo das seções
Faixas alternadas para criar ritmo visual: cada `<section>` é full-width com um `.wrap`
interno (`max-width: 1080px`) e **90px** de padding vertical.
- Hero → `--bg`
- Sobre → faixa `--bg-soft`
- Experiência → `--bg`
- Projetos → faixa `--bg-soft`

## 5. Seções (ordem na página)

1. **Navbar** (sticky, com blur): marca "Ariana.dev", links âncora (Sobre, Experiência,
   Projetos) e botão de tema (🌙/☀️).
2. **Hero:** eyebrow "Engenheira de Software", nome em destaque, linha de localização
   "📍 Cabo Frio-RJ · Brasil", parágrafo de apresentação, dois botões (Baixar currículo /
   Ver projetos), e o avatar com moldura em degradê e badge 👩‍💻.
3. **Sobre mim:** título à esquerda + texto pessoal à direita (sem números/métricas).
4. **Experiência:** timeline vertical com bolinhas coloridas (ver conteúdo abaixo).
5. **Projetos:** grid de cards gerados de `projects.js`, com ícone, descrição, tags e
   links (Código / Demo).
6. **Footer:** ícones sociais em SVG (Instagram, LinkedIn, GitHub) + assinatura.

## 6. Conteúdo real (fonte de verdade inicial)

**Posicionamento:** Engenheira de Software · 📍 Cabo Frio-RJ · Brasil
**Apresentação (hero):** "A tecnologia é a minha maneira de mudar o mundo. Construo APIs e
sistemas em produção e estou sempre explorando novas tecnologias."

**Timeline (Experiência):**
1. 💼 **Jan 2025 — Atual** · Engenheira de Software · Cloud Humans · Remoto —
   "Desenvolvimento de APIs e sistemas em produção, com integração de IA/LLMs."
2. 🎓 **2022 — 2024** · Análise e Desenvolvimento de Sistemas · Unifatecie —
   "Formação em tecnologia, com base em programação, banco de dados e engenharia de software."
3. 🚀 **2019** · Meu primeiro projeto · Curso técnico —
   "Um PDV (sistema de ponto de venda) em Java — onde tudo começou."

**Projetos:**
1. `staart-api-users` — API REST com CRUD de usuários, validação e persistência —
   Node.js, Express, Knex, MySQL, JOI — repo: github.com/arianaacarvalh0/staart-api-users
2. "Criador de Roadmap com IA" — roadmaps de aprendizado com a API do Gemini (imersão Alura) —
   Python, Gemini API, Jupyter — repo: github.com/arianaacarvalh0/alura-imersao-ia-avaliacao

**Links sociais:**
- Instagram: instagram.com/arianaacarvalho
- LinkedIn: linkedin.com/in/arianaacarvalho
- GitHub: github.com/arianaacarvalh0  *(conta atual; a antiga `arianaacarvalho` não tem mais acesso de edição)*

## 7. Comportamentos

- **Toggle de tema:** alterna `data-theme` no `<html>`, troca o ícone (🌙/☀️) e salva a
  preferência em `localStorage`. Na carga, respeita a preferência salva (e idealmente
  `prefers-color-scheme` na primeira visita).
- **Scroll suave** nas âncoras da navbar.
- **Animações sutis** de entrada nas seções (fade/translate) — nice-to-have, sem exagero.
- **Renderização dos cards/timeline:** `main.js` lê os arrays e injeta o HTML nos containers.

## 8. Responsividade

- Grid de projetos: 3 colunas → 1 coluna no mobile.
- Hero: 2 colunas (texto + avatar) → empilha, avatar acima, conteúdo centralizado.
- Timeline: mantém a linha vertical à esquerda em todas as larguras.
- Links do menu podem recolher no mobile (decisão de implementação: esconder ou menu simples).

## 9. Acessibilidade & SEO

- `alt` descritivo na imagem do avatar; `aria-label` nos ícones sociais.
- Contraste adequado nos dois temas.
- Navegação por teclado funcional.
- Meta tags: `title`, `description` e Open Graph (para compartilhar bonito no LinkedIn).
- HTML semântico (`nav`, `section`, `footer`, headings em ordem).

## 10. Assets

- **Avatar:** imagem do GitHub da Ariana (a ruiva acenando) — substitui o `perfil.jpg` atual.
- **Ícones sociais:** SVG inline (substituem os PNGs `logoinsta.png`, `logolinkedin.png`,
  `logogit.png` do projeto antigo).
- **Currículo:** PDF para download (manter/atualizar o arquivo existente).

## 11. Fora de escopo (por enquanto)

- Internacionalização (PT/EN).
- Seção de Habilidades separada (foi substituída pela timeline de Experiência; tecnologias
  aparecem como tags nos projetos).
- Ícone de X/Twitter no footer.
- Formulário de contato funcional.
- CMS / framework / pipeline de build.

## 12. Decisões fechadas e pontos em aberto

**Fechadas (aprovadas pela Ariana):**
- O card "Próximo projeto" (placeholder pontilhado do mockup) **não** entra no site final —
  era só ilustrativo.
- O nome **"Cloud Humans" permanece** na timeline de experiência.

**Em aberto (resolver na implementação):**
- Confirmar/refinar a descrição do projeto `Criador de Roadmap com IA` (texto livre).
- Decidir ES modules vs. objeto global para os arquivos de dados.
- Verificar/atualizar o PDF do currículo.
