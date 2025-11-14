/*
 * Dynamically loads Mermaid diagrams when a page contains blocks with the
 * `.mermaid` class or Markdown code fences annotated as ```mermaid.
 * Diagrams automatically re-render when the site theme toggles between
 * light and dark so visuals remain readable in both modes.
 */

(() => {
  const MERMAID_CDN = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
  const SELECTOR = ".mermaid, pre code.language-mermaid";

  const prefersDarkTheme = () =>
    document.documentElement.getAttribute("data-theme") === "dark";

  const normalizeTheme = () => (prefersDarkTheme() ? "dark" : "default");

  const ensureGraphStore = () => {
    // Convert ```mermaid fenced code blocks into .mermaid containers
    document.querySelectorAll("pre code.language-mermaid").forEach((codeBlock) => {
      const pre = codeBlock.closest("pre");
      if (!pre) return;
      const wrapper = document.createElement("div");
      wrapper.className = "mermaid";
      wrapper.textContent = codeBlock.textContent.trim();
      pre.replaceWith(wrapper);
    });

    document.querySelectorAll(".mermaid").forEach((node) => {
      if (!node.dataset.mermaid) {
        node.dataset.mermaid = node.textContent.trim();
      }
    });
  };

  const renderGraphs = (theme) => {
    if (!window.mermaid) return;
    ensureGraphStore();
    const targets = document.querySelectorAll(".mermaid");
    if (!targets.length) return;

    targets.forEach((node) => {
      const definition = node.dataset.mermaid || node.textContent.trim();
      node.textContent = definition;
      node.removeAttribute("data-processed");
    });

    window.mermaid.initialize({
      startOnLoad: false,
      theme,
    });

    try {
      window.mermaid.run({ nodes: targets });
    } catch (error) {
      console.error("Mermaid render error", error);
    }
  };

  const loadMermaid = () =>
    new Promise((resolve, reject) => {
      if (window.mermaid) {
        resolve(window.mermaid);
        return;
      }

      const script = document.createElement("script");
      script.src = MERMAID_CDN;
      script.async = true;
      script.onload = () => resolve(window.mermaid);
      script.onerror = reject;
      document.head.appendChild(script);
    });

  const initialize = () => {
    const hasDiagram = document.querySelector(SELECTOR);
    if (!hasDiagram) return;

    loadMermaid()
      .then(() => {
        renderGraphs(normalizeTheme());

        window.addEventListener("theme:change", (event) => {
          const theme = event.detail?.theme === "dark" ? "dark" : "default";
          renderGraphs(theme);
        });
      })
      .catch((error) => {
        console.error("Mermaid failed to load", error);
      });
  };

  document.addEventListener("DOMContentLoaded", initialize);
})();
