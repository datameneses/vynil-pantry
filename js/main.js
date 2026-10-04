// English-only helpers (kept so existing call sites stay simple).
function t(str) { return str; }
function tf(item, field) { return item[field]; }

// Marks the nav link matching the current page as active, wires up the
// mobile hamburger toggle.
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
}
