/*
 * Theme toggle script for FMArslan Jekyll site.
 *
 * Detects the user's preferred color scheme (light/dark) and stores
 * selections in localStorage. Toggling the button updates the `data-theme`
 * attribute on the <html> element, which triggers CSS variables defined in
 * `theme-custom.css`. Icons inside the toggle button are swapped based on
 * the active theme.
 */

(() => {
  function applyTheme(theme) {
    const htmlEl = document.documentElement;
    const toggleBtn = document.getElementById('theme-toggle');

    if (theme === 'dark') {
      htmlEl.setAttribute('data-theme', 'dark');
      if (toggleBtn) {
        toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      }
    } else {
      htmlEl.removeAttribute('data-theme');
      if (toggleBtn) {
        toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      }
    }
  }

  const stored = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  let currentTheme = stored || (systemPrefersDark ? 'dark' : 'light');

  const notifyThemeChange = (theme) => {
    window.dispatchEvent(new CustomEvent('theme:change', { detail: { theme } }));
  };

  applyTheme(currentTheme);

  const closeNav = (toggleBtn, navEl) => {
    if (toggleBtn && navEl) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navEl.classList.remove('is-open');
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    applyTheme(currentTheme);
    notifyThemeChange(currentTheme);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        currentTheme = (document.documentElement.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        applyTheme(currentTheme);
        notifyThemeChange(currentTheme);
      });
    }

    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.getElementById('site-navigation');
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        navLinks.classList.toggle('is-open', !expanded);
      });

      document.addEventListener('click', (event) => {
        if (!navLinks.contains(event.target) && event.target !== navToggle) {
          closeNav(navToggle, navLinks);
        }
      });
    }
  });
})();
