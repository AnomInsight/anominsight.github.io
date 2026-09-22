// Version A — "Reimagined Original"
//
// Same product, same content, same information architecture and the same
// protected portfolio mechanic as the original build; this file wires up
// navigation, the language controller, the portfolio module, the contact
// form, and one deliberately restrained motion system (see initReveal below).

import { translations } from '../../shared/content.js';
import { createLanguageController } from '../../shared/i18n.js';
import { initContactForm } from '../../shared/contactForm.js';
import { observeOnce, prefersReducedMotion } from '../../shared/motion.js';
import { setPortfolioLanguage, initPortfolioInteraction } from './portfolio.js';

const lang = createLanguageController(translations);

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Same fix as the original build: "#top" sits inside the fixed nav's own
  // containing element, so the native anchor jump lands behind the fixed
  // bar rather than below it.
  document.querySelectorAll('a[href="#top"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  const langToggle = document.querySelector('[data-lang-toggle]');
  if (langToggle) {
    langToggle.addEventListener('click', () => lang.toggle());
  }

  lang.subscribe((current) => setPortfolioLanguage(current, (key) => lang.t(key)));
  lang.start();

  initPortfolioInteraction();

  initContactForm(document.getElementById('contactForm'), {
    t: (key) => lang.t(key),
    statusEl: document.getElementById('formStatus'),
  });

  initReveal();
});

// One motion system, two registers rather than one identical entrance
// everywhere: text sections fade up as a single block; grid sections (cards,
// steps, the value list) additionally stagger their own children by a short,
// fixed increment. Both read from the same duration/easing tokens in
// style.css, and both are skipped outright under reduced motion — the page
// is fully visible by default either way, this only adds motion on top.
function initReveal() {
  if (prefersReducedMotion()) {
    return;
  }

  const blocks = document.querySelectorAll(
    '.hero, .proof, .approach, .section, .founder',
  );
  blocks.forEach((el) => el.classList.add('reveal', 'reveal--pending'));

  observeOnce(blocks, (el) => {
    el.classList.remove('reveal--pending');

    const staggerHost = el.querySelector('.cards, .steps, .value-list, .roadmap, .usecases');
    if (staggerHost) {
      Array.from(staggerHost.children).forEach((child, index) => {
        child.style.transitionDelay = `${Math.min(index, 5) * 60}ms`;
      });
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
}
