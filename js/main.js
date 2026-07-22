// Entry point for the brand/portfolio page. Wires up nav, language toggle,
// hero panel layout, the portfolio carousel, and the closing rotor.

import { applyTranslations } from './i18n.js';
import { setPortfolioLanguage, initPortfolioInteraction } from './portfolio.js';
import { initClosingRotor } from './closingRotor.js';

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

  let currentLang = 'en';

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
      translatePage(currentLang);
    });
  }

  translatePage(currentLang);
  initPortfolioInteraction();
  initClosingRotor(isReload);

  window.addEventListener('resize', normalizePanelLayout);
});
