// Entry point for the brand/portfolio page. Wires up nav, language toggle,
// hero panel layout, the portfolio carousel, and the closing rotor.

import { applyTranslations } from './i18n.js';
import { setPortfolioLanguage, initPortfolioInteraction } from './portfolio.js';
import { initClosingRotor } from './closingRotor.js';
import { initContactForm } from './contactForm.js';

const LANG_STORAGE_KEY = 'anominsight:lang';
const SUPPORTED_LANGS = ['en', 'hu'];

// Returns a stored choice first, then a browser-language guess, so a
// Hungarian visitor doesn't land on English by default every single time.
const getPreferredLang = () => {
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (SUPPORTED_LANGS.includes(stored)) {
      return stored;
    }
  } catch {
    // Storage blocked (private mode, disabled site data) - fall through.
  }

  const browserLangs = navigator.languages || [navigator.language];
  return browserLangs.some((lang) => lang.toLowerCase().startsWith('hu')) ? 'hu' : 'en';
};

const storeLangPreference = (lang) => {
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Storage blocked - the choice just won't survive a reload this time.
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const navigationEntry = performance.getEntriesByType('navigation')[0];
  const isReload = navigationEntry ? navigationEntry.type === 'reload' : false;

  // Keep refresh behavior predictable: always start from top on reload.
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  if (isReload) {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  const updateYear = () => {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  };

  updateYear();

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // "#top" (brand logo) sits inside the fixed-position nav's own containing
  // element, so the browser's native anchor jump lands with the target's
  // raw box edge at the viewport top - which is *behind* the fixed nav, not
  // below it, clipping the first ~72px of the hero. Scroll to the true top
  // directly instead of relying on the native jump's math.
  document.querySelectorAll('a[href="#top"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  const normalizePanelLayout = () => {
    const panel = document.querySelector('.panel-card');
    const score = document.querySelector('.score');
    if (!panel || !score) {
      return;
    }

    if (window.matchMedia('(max-width: 840px)').matches) {
      panel.style.setProperty('--panel-auto-width', '0px');
      return;
    }

    const panelStyles = window.getComputedStyle(panel);
    const leftPadding = parseFloat(panelStyles.paddingLeft) || 0;
    const rightPadding = parseFloat(panelStyles.paddingRight) || 0;

    // Score line needs space for text width + panel horizontal paddings + border allowance.
    const desiredWidth = Math.ceil(score.scrollWidth + leftPadding + rightPadding + 4);
    panel.style.setProperty('--panel-auto-width', `${desiredWidth}px`);
  };

  let currentLang = getPreferredLang();

  const translatePage = (lang) => {
    applyTranslations(lang);
    setPortfolioLanguage(lang);
    updateYear();
    normalizePanelLayout();
  };

  const langToggle = document.querySelector('.lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'hu' : 'en';
      storeLangPreference(currentLang);
      translatePage(currentLang);
    });
  }

  translatePage(currentLang);
  initPortfolioInteraction();
  initClosingRotor(isReload);
  initContactForm(() => currentLang);
  initScrollReveal();

  window.addEventListener('resize', normalizePanelLayout);
});

// Fades each top-level section up into place the first time it enters the
// viewport - one reveal per section, not per card, so scrolling the page
// doesn't turn into a barrage of individually-staggered items. Every
// section is fully visible by default (`.reveal-pending` is only ever
// added here, never in the stylesheet directly), so a JS error, a browser
// without IntersectionObserver, or reduced-motion all fail safe to "show
// everything, animate nothing" rather than hiding content.
function initScrollReveal() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    return;
  }

  const targets = document.querySelectorAll('.hero, .section:not(.closing-rotor-section)');
  if (!targets.length) {
    return;
  }

  targets.forEach((el) => {
    el.classList.add('reveal-section', 'reveal-pending');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.remove('reveal-pending');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
  );

  targets.forEach((el) => observer.observe(el));
}
