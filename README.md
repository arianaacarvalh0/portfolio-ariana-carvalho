<h1 align="center">💜 Portfólio · Ariana Carvalho</h1>

<p align="center">
  <strong>Engenheira de Software</strong> · 📍 Cabo Frio-RJ, Brasil<br>
  <em>A tecnologia é a minha maneira de mudar o mundo.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-322a40?style=for-the-badge&logo=html5&logoColor=e8916f" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-322a40?style=for-the-badge&logo=css3&logoColor=8ba6c4" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-322a40?style=for-the-badge&logo=javascript&logoColor=c9b8e8" alt="JavaScript">
  <img src="https://img.shields.io/badge/sem%20framework-7a4ba8?style=for-the-badge" alt="Sem framework">
</p>

---

## ✨ Sobre

Meu portfólio pessoal — um site estático, leve e sem framework, feito para ser **fácil de manter**:
projetos e experiências moram em arquivos de dados, então adicionar algo novo é editar uma lista,
sem mexer no layout.

## 🎨 Funcionalidades

- 🌗 **Tema claro e escuro** com toggle, lembrado entre visitas (`localStorage`) e respeitando a preferência do sistema
- 🧩 **Conteúdo orientado a dados** — projetos e experiência vêm de `projects.js` / `experience.js`
- 📱 **Responsivo** — adapta de desktop a mobile
- ♿ **Acessível** — HTML semântico, `alt`, `aria-label` e navegação por teclado
- 🔎 **SEO** — meta tags e Open Graph para compartilhar bonito nas redes
- 🪶 **Zero dependências** — só HTML, CSS e JavaScript (ES modules)

## 🛠️ Tecnologias

HTML5 · CSS3 (custom properties para os temas) · JavaScript (ES modules) · Node.js (apenas para os testes)

Fontes: [Sora](https://fonts.google.com/specimen/Sora) (títulos) + [Poppins](https://fonts.google.com/specimen/Poppins) (texto).
Paleta inspirada no meu avatar: 🟣 lilás · 🔴 terracota · 🔵 azul jeans.

## 📁 Estrutura

```
src/
├── index.html            # estrutura das seções
├── css/style.css         # estilos + variáveis de tema (claro/escuro)
├── js/
│   ├── data/
│   │   ├── projects.js    # ⭐ lista de projetos
│   │   └── experience.js  # itens da timeline de experiência
│   ├── render.js          # transforma os dados em HTML (funções puras)
│   ├── theme.js           # toggle de tema claro/escuro
│   └── main.js            # liga tudo: renderiza e ativa o tema
└── imagens/               # avatar e currículo
tests/                     # testes em Node (node --test)
```

## 🚀 Rodando localmente

ES modules precisam de um servidor HTTP (não funcionam abrindo o arquivo direto). A partir de `src/`:

```bash
cd src
python3 -m http.server 8000
```

Depois é só abrir <http://localhost:8000>.

## ➕ Adicionando um projeto novo

Não precisa tocar no HTML nem no CSS — basta editar `src/js/data/projects.js`:

```js
{
  title: "Nome do projeto",
  description: "Uma frase sobre o que ele faz.",
  icon: "🚀",                          // emoji exibido no card
  tags: ["Node.js", "Express"],        // tecnologias
  repo: "https://github.com/...",      // link do código
  demo: ""                             // link da demo (opcional)
}
```

O card aparece automaticamente na seção **Projetos**. 🎉

## 🧪 Testes

A lógica de renderização, dados e tema é coberta por testes com o runner nativo do Node:

```bash
node --test tests/*.test.js
```

## 📬 Contato

<p>
  <a href="https://www.linkedin.com/in/arianaacarvalho/">
    <img src="https://img.shields.io/badge/LinkedIn-4d6e92?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>
  <a href="https://github.com/arianaacarvalh0">
    <img src="https://img.shields.io/badge/GitHub-322a40?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="https://www.instagram.com/arianaacarvalho/">
    <img src="https://img.shields.io/badge/Instagram-c05636?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram">
  </a>
</p>

---

<p align="center"><sub>Feito com 💜 por Ariana Carvalho</sub></p>
