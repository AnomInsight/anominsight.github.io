document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const year = document.getElementById('year');

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

  const translations = window.ANOM_TRANSLATIONS;
  if (!translations || !translations.en || !translations.hu) {
    console.error('Translations are missing. Make sure translations01.js is loaded before script01.js.');
    return;
  }

  const portfolioProjects = [
    {
      kind: { en: 'Manufacturing', hu: 'Gyártás' },
      stage: { en: 'Live', hu: 'Aktív' },
      title: { en: 'Machine Downtime Early Warning', hu: 'Gépleállás korai figyelmeztetés' },
      description: {
        en: 'Streaming telemetry was used to detect anomalies before stoppages, reducing unplanned downtime windows.',
        hu: 'Folyamatos telemetriai adatokkal azonosítottam az anomáliákat leállás előtt, csökkentve a nem tervezett kiesést.',
      },
      categories: ['anomalyDetection', 'timeSeries', 'operations'],
    },
    {
      kind: { en: 'Energy', hu: 'Energia' },
      stage: { en: 'Pilot', hu: 'Pilot' },
      title: { en: 'Utility Demand Forecast Stack', hu: 'Közmű kereslet-előrejelző rendszer' },
      description: {
        en: 'Built a forecasting layer that compares model bands with actual usage to support staffing and procurement decisions.',
        hu: 'Előrejelző réteget építettem, amely a modell sávjait valós fogyasztással veti össze a tervezés támogatására.',
      },
      categories: ['forecasting', 'planning', 'kpiDashboard'],
    },
    {
      kind: { en: 'Logistics', hu: 'Logisztika' },
      stage: { en: 'Live', hu: 'Aktív' },
      title: { en: 'Delivery Risk Monitoring Board', hu: 'Szállítási kockázatfigyelő dashboard' },
      description: {
        en: 'Unified shipment events and alerts into one board so teams can react to route exceptions in minutes.',
        hu: 'A szállítási eseményeket és riasztásokat egy nézetbe rendeztem, így az eltérésekre percek alatt lehet reagálni.',
      },
      categories: ['alerts', 'visualization', 'supplyChain'],
    },
    {
      kind: { en: 'E-commerce', hu: 'E-kereskedelem' },
      stage: { en: 'Prototype', hu: 'Prototípus' },
      title: { en: 'Revenue Outlier Insight Feed', hu: 'Bevételi kiugrásokat vizsgáló feed' },
      description: {
        en: 'Daily outlier feed highlights unusual product and region behavior, making action planning significantly faster.',
        hu: 'Napi kiugrási feed emeli ki a szokatlan termék- és régióviselkedést, gyorsítva az üzleti reakciót.',
      },
      categories: ['revenue', 'outliers', 'decisionSupport'],
    },
  ];

  const portfolioCategoryLabels = {
    anomalyDetection: { en: 'Anomaly Detection', hu: 'Anomáliafelismerés' },
    timeSeries: { en: 'Time Series', hu: 'Idősorok' },
    operations: { en: 'Operations', hu: 'Operáció' },
    forecasting: { en: 'Forecasting', hu: 'Előrejelzés' },
    planning: { en: 'Planning', hu: 'Tervezés' },
    kpiDashboard: { en: 'KPI Dashboard', hu: 'KPI Dashboard' },
    alerts: { en: 'Alerts', hu: 'Riasztások' },
    visualization: { en: 'Visualization', hu: 'Vizualizáció' },
    supplyChain: { en: 'Supply Chain', hu: 'Ellátási lánc' },
    revenue: { en: 'Revenue', hu: 'Bevétel' },
    outliers: { en: 'Outliers', hu: 'Kiugró értékek' },
    decisionSupport: { en: 'Decision Support', hu: 'Döntéstámogatás' },
  };

  let activePortfolioIndex = 0;
  let portfolioAutoRotateTimer = null;
  let activePortfolioFilter = 'all';
  let currentLang = 'en';
  let portfolioFilterTransitionToken = 0;

  const syncPortfolioDeckTarget = () => {
    const track = document.getElementById('portfolioTrack');
    const sticky = document.querySelector('.portfolio-sticky');
    if (!track || !sticky || window.matchMedia('(max-width: 840px)').matches) {
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const stickyRect = sticky.getBoundingClientRect();

    const trackCenterX = trackRect.left + trackRect.width / 2;
    const stickyCenterX = stickyRect.left + stickyRect.width / 2;

    // Match the virtual card center (top transform + approx. half card height).
    const virtualCardCenterY = trackRect.top + 56 + 135;
    const stickyCenterY = stickyRect.top + stickyRect.height * 0.5;

    const shiftX = Math.round(stickyCenterX - trackCenterX);
    const shiftY = Math.round(stickyCenterY - virtualCardCenterY);

    track.style.setProperty('--deck-shift-x', `${shiftX}px`);
    track.style.setProperty('--deck-shift-y', `${shiftY}px`);
  };

  const getFilteredProjects = () => {
    if (activePortfolioFilter === 'all') {
      return portfolioProjects;
    }

    return portfolioProjects.filter((project) => project.categories.includes(activePortfolioFilter));
  };

  const getCategoryLabel = (categoryId, lang) => {
    const labels = portfolioCategoryLabels[categoryId];
    if (!labels) {
      return categoryId;
    }
    return labels[lang] || labels.en;
  };

  const renderPortfolioFilters = (lang) => {
    const filtersHost = document.getElementById('portfolioFilters');
    if (!filtersHost) {
      return;
    }

    const categoryIds = [...new Set(portfolioProjects.flatMap((project) => project.categories))];
    filtersHost.innerHTML = '';

    const allButton = document.createElement('button');
    allButton.type = 'button';
    allButton.className = `portfolio-filter-chip${activePortfolioFilter === 'all' ? ' is-active' : ''}`;
    allButton.textContent = translations[lang]['portfolio.filterAll'];
    allButton.addEventListener('click', () => {
      setPortfolioFilter('all');
    });
    filtersHost.appendChild(allButton);

    categoryIds.forEach((categoryId) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `portfolio-filter-chip${activePortfolioFilter === categoryId ? ' is-active' : ''}`;
      chip.textContent = getCategoryLabel(categoryId, lang);
      chip.addEventListener('click', () => {
        setPortfolioFilter(categoryId);
      });
      filtersHost.appendChild(chip);
    });
  };

  const setPortfolioFilter = (filterId) => {
    if (filterId === activePortfolioFilter) {
      return;
    }

    const token = ++portfolioFilterTransitionToken;
    const track = document.getElementById('portfolioTrack');
    if (!track) {
      activePortfolioFilter = filterId;
      renderPortfolio(currentLang);
      return;
    }

    syncPortfolioDeckTarget();

    clearInterval(portfolioAutoRotateTimer);
    activePortfolioFilter = filterId;
    renderPortfolioFilters(currentLang);

    const cards = Array.from(track.querySelectorAll('.portfolio-card'));
    if (!cards.length || window.matchMedia('(max-width: 840px)').matches) {
      renderPortfolio(currentLang);
      return;
    }

    cards.forEach((card, index) => {
      card.style.setProperty('--stack-delay', `${index * 45}ms`);
      card.classList.add('is-to-deck');
    });

    const totalOutTime = 360 + (cards.length - 1) * 45;
    window.setTimeout(() => {
      if (token !== portfolioFilterTransitionToken) {
        return;
      }
      renderPortfolio(currentLang, { animateIn: true });
    }, totalOutTime);
  };

  const renderPortfolio = (lang, options = {}) => {
    const { animateIn = false } = options;
    const track = document.getElementById('portfolioTrack');
    if (!track) {
      return;
    }

    syncPortfolioDeckTarget();

    renderPortfolioFilters(lang);
    track.innerHTML = '';
    const projectsToRender = getFilteredProjects();

    if (!projectsToRender.length) {
      const empty = document.createElement('p');
      empty.className = 'portfolio-empty';
      empty.textContent = translations[lang]['portfolio.empty'];
      if (animateIn) {
        empty.classList.add('is-from-deck');
      }
      track.appendChild(empty);
      clearInterval(portfolioAutoRotateTimer);

      if (animateIn) {
        window.requestAnimationFrame(() => {
          empty.classList.remove('is-from-deck');
        });
      }
      return;
    }

    projectsToRender.forEach((project, index) => {
      const card = document.createElement('article');
      card.className = 'card portfolio-card';
      card.setAttribute('tabindex', '0');
      if (animateIn && !window.matchMedia('(max-width: 840px)').matches) {
        card.classList.add('is-from-deck');
        card.style.setProperty('--deal-delay', `${index * 55}ms`);
      }

      const kind = project.kind[lang] || project.kind.en;
      const stage = project.stage[lang] || project.stage.en;
      const title = project.title[lang] || project.title.en;
      const description = project.description[lang] || project.description.en;
      const categoryLabels = project.categories.map((categoryId) => getCategoryLabel(categoryId, lang));
      const categories = categoryLabels.join(' • ');

      card.innerHTML = `
        <div>
          <div class="portfolio-top">
            <p class="portfolio-kind">${kind}</p>
            <span class="portfolio-stage">${stage}</span>
          </div>
          <h3>${title}</h3>
          <p>${description}</p>
        </div>
        <div class="portfolio-meta" aria-label="${translations[lang]['portfolio.metaPrefix']}: ${categories}">
          ${categoryLabels.map((category) => `<span>${category}</span>`).join('')}
        </div>
      `;

      track.appendChild(card);

      card.addEventListener('click', () => {
        setPortfolioFocus(index);
      });

      card.addEventListener('focus', () => {
        setPortfolioFocus(index);
      });

      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setPortfolioFocus(index);
        }
      });
    });

    activePortfolioIndex = 0;
    updatePortfolioClasses();

    if (animateIn && !window.matchMedia('(max-width: 840px)').matches) {
      window.requestAnimationFrame(() => {
        const cards = track.querySelectorAll('.portfolio-card');
        cards.forEach((card) => {
          card.classList.remove('is-from-deck');
        });
      });
    }

    startPortfolioAutoRotate();
  };

  const updatePortfolioClasses = () => {
    const track = document.getElementById('portfolioTrack');
    if (!track) {
      return;
    }

    const cards = Array.from(track.querySelectorAll('.portfolio-card'));
    const total = cards.length;
    if (!total) {
      return;
    }

    cards.forEach((card, index) => {
      card.classList.remove('is-active', 'is-left', 'is-right', 'is-back');

      if (index === activePortfolioIndex) {
        card.classList.add('is-active');
        card.setAttribute('aria-current', 'true');
        return;
      }

      card.removeAttribute('aria-current');

      const rightDistance = (index - activePortfolioIndex + total) % total;
      const leftDistance = (activePortfolioIndex - index + total) % total;

      if (rightDistance === 1) {
        card.classList.add('is-right');
      } else if (leftDistance === 1) {
        card.classList.add('is-left');
      } else {
        card.classList.add('is-back');
      }
    });
  };

  const setPortfolioFocus = (index) => {
    const track = document.getElementById('portfolioTrack');
    if (!track) {
      return;
    }

    const cards = track.querySelectorAll('.portfolio-card');
    if (!cards.length) {
      return;
    }

    activePortfolioIndex = ((index % cards.length) + cards.length) % cards.length;
    updatePortfolioClasses();
    startPortfolioAutoRotate();
  };

  const startPortfolioAutoRotate = () => {
    clearInterval(portfolioAutoRotateTimer);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const track = document.getElementById('portfolioTrack');
    if (!track) {
      return;
    }

    const cards = track.querySelectorAll('.portfolio-card');
    if (cards.length < 3) {
      return;
    }

    portfolioAutoRotateTimer = setInterval(() => {
      setPortfolioFocus(activePortfolioIndex + 1);
    }, 4600);
  };

  const initPortfolioInteraction = () => {
    const track = document.getElementById('portfolioTrack');
    if (!track) {
      return;
    }

    track.addEventListener('mouseenter', () => {
      clearInterval(portfolioAutoRotateTimer);
    });

    track.addEventListener('mouseleave', () => {
      startPortfolioAutoRotate();
    });
  };

  const langToggle = document.querySelector('.lang-toggle');

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

  const translatePage = (lang) => {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      if (key && translations[lang][key]) {
        el.setAttribute('aria-label', translations[lang][key]);
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key && translations[lang][key]) {
        el.setAttribute('placeholder', translations[lang][key]);
      }
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (key && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });
    document.querySelectorAll('.price[data-price-usd]').forEach((el) => {
      const usd = Number(el.getAttribute('data-price-usd'));
      if (!Number.isNaN(usd)) {
        if (lang === 'hu') {
          const huf = Math.round(usd * 310);
          el.textContent = `${huf.toLocaleString('hu-HU')} Ft*`;
        } else {
          el.textContent = `$${usd.toLocaleString('en-US')}`;
        }
      }
    });
    renderPortfolio(lang);
    updateYear();
    normalizePanelLayout();
    syncPortfolioDeckTarget();
  };

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'hu' : 'en';
      translatePage(currentLang);
    });
  }

  translatePage(currentLang);
  initPortfolioInteraction();
  window.addEventListener('resize', () => {
    normalizePanelLayout();
    syncPortfolioDeckTarget();
  });
});
