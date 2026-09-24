// Version A - "Reimagined Original"
//
// Same product, same content, same information architecture and the same
// protected portfolio mechanic as the original build; this file wires up
// navigation, the language controller, the portfolio module, the contact
// form, and one deliberately restrained motion system (see initReveal below).

import { translations } from '../../shared/content.js';
import { createLanguageController } from '../../shared/i18n.js';
import { initContactForm } from '../../shared/contactForm.js';
import { observeOnce, prefersReducedMotion } from '../../shared/motion.js';

const lang = createLanguageController(translations);

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
        const firstLink = navLinks.querySelector('a');
        if (firstLink) {
          firstLink.focus();
        }
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

  // Same fix as the original build: "#top" sits inside the fixed nav's own
  // containing element, so the native anchor jump lands behind the fixed
  // bar rather than below it. The skip link is excluded: it must move focus.
  document.querySelectorAll('a[href="#top"]:not(.skip-link)').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  const skipLink = document.querySelector('.skip-link');
  const mainEl = document.getElementById('top');
  if (skipLink && mainEl) {
    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      mainEl.focus({ preventScroll: true });
      window.scrollTo({ top: 0 });
    });
  }

  const langToggle = document.querySelector('[data-lang-toggle]');
  if (langToggle) {
    langToggle.addEventListener('click', () => lang.toggle());
  }

  lang.start();

  // Only pages with a portfolio (the homepage) load its ~21 KB module.
  if (document.getElementById('portfolioTrack')) {
    import('./portfolio.js').then(({ setPortfolioLanguage, initPortfolioInteraction }) => {
      const t = (key) => lang.t(key);
      lang.subscribe((current) => setPortfolioLanguage(current, t));
      setPortfolioLanguage(lang.lang, t);
      initPortfolioInteraction();
    });
  }

  initContactForm(document.getElementById('contactForm'), {
    t: (key) => lang.t(key),
    statusEl: document.getElementById('formStatus'),
  });

  initQuoteLinks();
  initReveal();
});

// Services page: a package's "Get a custom quote" link carries that package
// into the contact form (hidden field + a starter message), so the enquiry
// arrives already saying which package it is about. A message the visitor has
// typed themselves is never overwritten.
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
        message.value = lang.t('packages.quoteMessage').replace('{package}', title);
        message.dataset.prefilled = 'true';
      }
    });
  });

  message.addEventListener('input', () => {
    delete message.dataset.prefilled;
  });
}

// One motion system, two registers rather than one identical entrance
// everywhere: text sections fade up as a single block; grid sections (cards,
// steps, the value list) additionally stagger their own children by a short,
// fixed increment. Both read from the same duration/easing tokens in
// style.css, and both are skipped outright under reduced motion - the page
// is fully visible by default either way, this only adds motion on top.
function initReveal() {
  if (prefersReducedMotion()) {
    return;
  }

  const blocks = document.querySelectorAll(
    '.hero, .page-intro, .proof, .approach, .section, .founder',
  );
  blocks.forEach((el) => el.classList.add('reveal', 'reveal--pending'));

  observeOnce(blocks, (el) => {
    el.classList.remove('reveal--pending');

    const staggerHost = el.querySelector('.steps, .value-list, .roadmap, .usecases, .packages');
    if (staggerHost) {
      Array.from(staggerHost.children).forEach((child, index) => {
        child.style.transitionDelay = `${Math.min(index, 5) * 60}ms`;
      });
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  // The hero figure's entrance sequence (style.css, "Hero figure entrance")
  // waits for the figure itself rather than the hero: on phones it sits below
  // the fold, and a sequence nobody sees is just a delay.
  const figure = document.querySelector('.signal');
  if (figure) {
    figure.classList.add('signal--pending');
    observeOnce([figure], (el) => {
      el.classList.replace('signal--pending', 'signal--play');
    }, { threshold: 0.4, rootMargin: '0px' });
  }
}
