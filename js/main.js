// --- i18n --------------------------------------------------------------
// EN -> PT-BR dictionary for every UI string built in JS (chart titles,
// field labels, empty states, etc). Static HTML text is translated via
// data-pt attributes instead (see applyStaticTranslations below).
const DICT_PT = {
  "Artist": "Artista",
  "Genre": "Gênero",
  "Decade": "Década",
  "Release year": "Ano de lançamento",
  "Country": "País",
  "Continent": "Continente",
  "Date purchased": "Data da compra",
  "Vinyls by Genre": "Vinis por gênero",
  "Vinyls by Artist": "Vinis por artista",
  "Vinyls by Decade": "Vinis por década",
  "Vinyls by Continent": "Vinis por continente",
  "vinyls": "vinis",
  "Electronic": "Eletrônica",
  "Hip Hop": "Hip Hop",
  "Indie Pop": "Indie Pop",
  "Indie Rock": "Indie Rock",
  "Jazz": "Jazz",
  "MPB": "MPB",
  "Pop": "Pop",
  "R&B": "R&B",
  "Reggae": "Reggae",
  "Rock": "Rock",
  "North America": "América do Norte",
  "South America": "América do Sul",
  "Europe": "Europa",
  "Australia": "Oceania",
  "Nothing here yet.": "Nada por aqui ainda.",
  "No vinyls match these filters.": "Nenhum vinil corresponde a esses filtros.",
  "Could not load data. If you're viewing this via file://, try running a local server (e.g. <code>python3 -m http.server</code>) instead.":
    "Não foi possível carregar os dados. Se você está vendo isso via file://, tente rodar um servidor local (ex.: <code>python3 -m http.server</code>).",
  "Vinyl Pantry (a personal project)": "Vinyl Pantry (um projeto pessoal)"
};

function getLang() {
  return localStorage.getItem("lang") === "pt" ? "pt" : "en";
}

// Translates a literal EN string built in JS via DICT_PT. Falls back to
// the original string when there's no PT-BR entry or the site is in EN.
function t(str) {
  if (getLang() !== "pt") return str;
  return DICT_PT[str] || str;
}

// Reads a JSON item's field, preferring the `<field>_pt` sibling when the
// site is in PT-BR and that sibling exists (falls back to the EN value
// otherwise — not every field has a translation, e.g. proper nouns).
function tf(item, field) {
  if (getLang() === "pt" && item[field + "_pt"] !== undefined) {
    return item[field + "_pt"];
  }
  return item[field];
}

// Swaps every element carrying a data-pt attribute between its English
// text (cached into data-en on first run) and its PT-BR text.
function applyStaticTranslations() {
  const lang = getLang();
  document.querySelectorAll("[data-pt]").forEach((el) => {
    if (!el.dataset.en) el.dataset.en = el.innerHTML;
    el.innerHTML = lang === "pt" ? el.dataset.pt : el.dataset.en;
  });
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  document.querySelectorAll(".lang-toggle").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

function setLang(lang) {
  localStorage.setItem("lang", lang);
  applyStaticTranslations();
  document.dispatchEvent(new CustomEvent("langchange"));
}

// Marks the nav link matching the current page as active, wires up the
// mobile hamburger toggle, and wires up the EN / PT-BR language toggle.
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav.site-nav a").forEach((link) => {
    if (link.getAttribute("href") === path) {
      link.classList.add("active");
    }
  });

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("nav.site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  document.querySelectorAll(".lang-toggle").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  applyStaticTranslations();
});

// Fetches a JSON data file and renders each item into a container using templateFn.
// Shows a friendly empty state if there's no data yet, or an error hint if the
// fetch fails (common when opening the site directly via file:// instead of a local server).
function loadAndRender(jsonPath, containerId, templateFn) {
  const container = document.getElementById(containerId);
  const render = () =>
    fetch(jsonPath)
      .then((res) => res.json())
      .then((items) => {
        if (!items.length) {
          container.innerHTML = `<p class="empty-state">${t("Nothing here yet.")}</p>`;
          return;
        }
        container.innerHTML = items.map(templateFn).join("");
      })
      .catch((err) => {
        console.error("Failed to load", jsonPath, err);
        container.innerHTML = `<p class="empty-state">${t("Could not load data. If you're viewing this via file://, try running a local server (e.g. <code>python3 -m http.server</code>) instead.")}</p>`;
      });
  render();
  document.addEventListener("langchange", render);
}
