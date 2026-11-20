// Version D - "Signal in Noise"
//
// Same wiring as Version A (nav, skip link, language, portfolio, contact form,
// quote links), with two changes: no section fade-ins (nothing moves on
// scroll outside the signal story), and the story module, loaded after the
// first paint so the canvas never delays the headline.

import { translations } from '../../shared/content.js';
import { createLanguageController } from '../../shared/i18n.js';
import { initContactForm } from '../../shared/contactForm.js';
import { observeOnce, prefersReducedMotion } from '../../shared/motion.js';

const lang = createLanguageController(translations);

// D's own copy lives in "<key>D" variants of shared keys (A, B and C keep the
// originals). The HTML names the D keys directly; shared modules ask for the
// plain key, so every lookup made from here prefers the D variant.
const t = (key) => lang.t(`${key}D` in translations.en ? `${key}D` : key);

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        navLinks.querySelector('a')?.focus();
      }
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  // "#top" is the <main> element; the logo link scrolls up instead of letting
  // the anchor jump land behind the fixed header. The skip link must move
  // focus, so it is handled separately below.
  document.querySelectorAll('a[href="#top"]:not(.skip-link)').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  });

  // The skip link moves focus to the page's h1 (a visible ring on the first
  // heading), not to <main> (a ring around the whole page, or none at all).
  const skipLink = document.querySelector('.skip-link');
  const skipTarget = document.querySelector('main h1') || document.getElementById('top');
  if (skipLink && skipTarget) {
    skipTarget.setAttribute('tabindex', '-1');
    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      skipTarget.focus({ preventScroll: true });
      window.scrollTo({ top: 0 });
    });
  }

  // Swapping the language rewrites a few hundred strings and re-lays out the
  // page. Paint the button's press first, then do the swap, so the click is
  // answered at once even on a slow phone (INP).
  document.querySelector('[data-lang-toggle]')?.addEventListener('click', (event) => {
    const button = event.currentTarget;
    button.setAttribute('aria-busy', 'true');
    requestAnimationFrame(() => {
      setTimeout(() => {
        lang.toggle();
        button.removeAttribute('aria-busy');
      }, 0);
    });
  });

  lang.start();

  // Homepage only: the portfolio deck (protected, Version A's module).
  if (document.getElementById('portfolioTrack')) {
    import('./portfolio.js').then(({ setPortfolioLanguage, initPortfolioInteraction }) => {
      lang.subscribe((current) => setPortfolioLanguage(current, t));
      setPortfolioLanguage(lang.lang, t);
      initPortfolioInteraction();
    });
  }

  initContactForm(document.getElementById('contactForm'), {
    t,
    statusEl: document.getElementById('formStatus'),
  });

  initQuoteLinks();
  initSignal();
  initTrace();

  // "Same data, different questions" (homepage services): loaded as it nears.
  const modes = document.querySelector('[data-modes]');
  if (modes) {
    observeOnce([modes], () => {
      import('./modes.js').then(({ initModes }) => initModes(modes));
    }, { threshold: 0, rootMargin: '400px 0px' });
  }
});

// The signal story starts once the page has painted and the browser is idle:
// the hero text is the page's largest paint, the canvas arrives after it.
function initSignal() {
  const stage = document.querySelector('[data-stage]');
  if (!stage) {
    return;
  }

  const start = () => {
    import('./signal-story.js')
      .then(({ initSignalStory }) => {
        initSignalStory({
          t,
          subscribe: (fn) => lang.subscribe(fn),
        });
      })
      .catch(() => {
        // The module failed: show the static poster instead of an empty stage.
        stage.classList.add('stage--fallback');
      });
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(start, { timeout: 1200 });
  } else {
    window.setTimeout(start, 200);
  }
}

// Services page header: the illustrative trace scans in once, when seen.
function initTrace() {
  const trace = document.querySelector('.trace');
  if (!trace || prefersReducedMotion()) {
    return;
  }
  trace.classList.add('trace--pending');
  observeOnce([trace], (el) => {
    el.classList.replace('trace--pending', 'trace--play');
  }, { threshold: 0.3, rootMargin: '0px' });
}

// Services page: a package's "Get a custom quote" link carries that package
// into the contact form (hidden field + a starter message). A message the
// visitor has typed themselves is never overwritten. (Same as Version A.)
function initQuoteLinks() {
  const form = document.getElementById('contactForm');
  const message = document.getElementById('message');
  const packageField = form ? form.querySelector('input[name="package"]') : null;
  const links = document.querySelectorAll('[data-quote-package]');
  if (!form || !message || !links.length) {
    return;
  }

  links.forEach((link) => {
    link.addEventListener('click', () => {
      const titleEl = document.getElementById(link.dataset.quotePackage);
      const title = titleEl ? titleEl.textContent.trim() : '';
      if (!title) {
        return;
      }
      if (packageField) {
        packageField.value = title;
      }
      if (!message.value.trim() || message.dataset.prefilled === 'true') {
        message.value = t('packages.quoteMessage').replace('{package}', title);
        message.dataset.prefilled = 'true';
      }
    });
  });

  message.addEventListener('input', () => {
    delete message.dataset.prefilled;
  });
}
