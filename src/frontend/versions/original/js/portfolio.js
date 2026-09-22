// Portfolio carousel: data, category filtering, deck rotation animation, and the
// project detail modal. Split out of script01.js for maintainability.

import { translations } from './i18n.js';

const portfolioProjects = [
  {
    kind: { en: 'Manufacturing', hu: 'Gyártás' },
    status: 'caseStudy',
    title: { en: 'Predictive Maintenance for CNC Operations', hu: 'Prediktív karbantartás CNC-üzemekhez' },
    description: {
      en: 'A machine learning model that watches CNC machine sensors and flags the ones likely to break down soon. In testing, it caught 96% of real failures before they happened.',
      hu: 'Egy gépi tanulási modell, amely a CNC gépek szenzoradatait figyeli, és jelzi, melyik gép állhat le hamarosan. A tesztelés során a valós meghibásodások 96%-át időben elkapta.',
    },
    overview: {
      en: 'Unplanned breakdowns are costly on a 24/7 CNC production line, so this project builds an early-warning system for machine failure. It looks at real sensor readings, such as temperature, power draw, and torque, to flag machines likely to fail within the next day or two, before anything actually breaks. After comparing a few different approaches, I settled on a LightGBM model (a fast, tree-based machine learning method) tuned to catch as many real failures as possible: in testing it caught 96% of actual breakdowns, at the cost of roughly two false alarms for every real one it found. The idea isn\'t to replace maintenance engineers. It\'s to hand them a prioritized daily list so they can focus their attention where it matters, with the alert sensitivity adjustable to match how many false alarms the team can realistically handle.',
      hu: 'A váratlan leállások sokba kerülnek egy folyamatosan üzemelő CNC gyártásban, ezért ez a projekt egy korai figyelmeztető rendszert épít a gépleállások előrejelzésére. A modell valós szenzoradatokat figyel, például hőmérsékletet, teljesítményfelvételt és csavarónyomatékot, hogy jelezze, mely gépek állhatnak le a következő egy-két napban, még mielőtt bármi elromlana. Több módszer kipróbálása után egy LightGBM modell mellett döntöttem (ez egy gyors, fákra épülő gépi tanulási módszer), amelyet úgy hangoltam, hogy a lehető legtöbb valós meghibásodást elkapja: a tesztelés során az esetek 96%-ában időben jelzett, cserébe nagyjából két téves riasztás jutott minden valós találatra. A cél nem az, hogy kiváltsa a karbantartó mérnököket, hanem hogy egy priorizált napi listát adjon a kezükbe, amelyre érdemes figyelniük. A riasztási küszöb pedig állítható, hogy illeszkedjen ahhoz, mennyi téves riasztást bír el a csapat.',
    },
    categories: ['predictiveMaintenance', 'anomalyDetection', 'decisionSupport'],
    githubUrl: 'https://github.com/AnomInsight/01_Portfolio_Project',
  },
  {
    kind: { en: 'Logistics', hu: 'Logisztika' },
    status: 'caseStudy',
    title: { en: 'Handwritten Digit Classifier for Mail Sorting', hu: 'Kézzel írt számjegyek osztályozása levélválogatáshoz' },
    description: {
      en: 'Compared five different AI models for reading handwritten ZIP codes automatically. The best one, a neural network, got it right 99.27% of the time.',
      hu: 'Öt különböző AI-modellt hasonlítottam össze kézzel írt irányítószámok automatikus felismerésére. A legjobb, egy neurális háló, az esetek 99,27%-ában helyesen ismerte fel a számjegyeket.',
    },
    overview: {
      en: 'Sorting mail by handwritten ZIP code is slow and error-prone when done by hand at scale, so this project explores whether AI can take over that job reliably. Starting from a simple baseline and working up through logistic regression, random forests, and support vector machines, I landed on a convolutional neural network (a type of model built specifically for recognizing images), which correctly read digits 99.27% of the time. Beyond just accuracy, I checked which digits the model tends to confuse with each other, looked closely at its most confident mistakes, and tested how well it holds up against rotated, noisy, or poorly lit scans. The practical takeaway: send anything the model isn\'t confident about to a human for a second look, and keep monitoring its mistakes after it goes live.',
      hu: 'A kézzel írt irányítószámok kézi feldolgozása lassú és hibalehetőségekkel teli, ha nagy mennyiségben kell csinálni. Ez a projekt azt vizsgálja, hogy egy AI megbízhatóan át tudja-e venni ezt a feladatot. Egy egyszerű alapmodellből kiindulva, logisztikus regresszión, random foreston és szupport vektor gépeken keresztül végül egy konvolúciós neurális hálónál kötöttem ki (ez egy kifejezetten képfelismerésre kitalált modelltípus), amely az esetek 99,27%-ában helyesen ismerte fel a számjegyeket. A pontosságon túl azt is megvizsgáltam, mely számjegyeket keveri össze a modell egymással, alaposan átnéztem a magabiztosan hozott hibáit, és teszteltem, hogyan teljesít elforgatott, zajos vagy rosszul megvilágított képeken. A gyakorlati tanulság: amiben a modell nem elég magabiztos, azt küldjük emberi ellenőrzésre, és élesben is érdemes folyamatosan figyelni a hibáit.',
    },
    categories: ['imageClassification', 'deepLearning', 'computerVision'],
    githubUrl: 'https://github.com/AnomInsight/02_Portfolio_Project',
  },
  {
    kind: { en: 'Hospitality', hu: 'Vendéglátás' },
    status: 'caseStudy',
    title: { en: 'AI Chatbot for Restaurant Ordering & Support', hu: 'AI chatbot éttermi rendeléshez és ügyfélszolgálathoz' },
    description: {
      en: 'Built an AI chat widget for a demo pizzeria website that answers questions about the menu, hours, and orders.</br>It\'s designed to stick to food that\'s actually on the menu.',
      hu: 'Egy AI chat widgetet építettem egy demó pizzéria weboldalhoz, amely válaszol a menüvel, nyitvatartással és rendelésekkel kapcsolatos kérdésekre. </br>Úgy lett kialakítva, hogy csak a menüben ténylegesen szereplő ételekről beszéljen.',
    },
    overview: {
      en: 'Small businesses often lose customers simply because nobody\'s around to answer a quick question like "are you open right now?" or "what\'s your best-selling pizza?". This project shows how a lightweight AI chatbot can fill that gap. I built a demo pizzeria website with a chat widget powered by a fast large language model (via Groq), and kept it honest by only letting it talk about real menu items, prices, and hours pulled straight from the business\'s own data, which keeps it grounded and much less likely to make up a dish that doesn\'t exist. It remembers the conversation while you\'re chatting, keeps track of which items get ordered most, and includes basic safeguards like rate limiting and API key protection. The widget itself is just plain HTML, CSS, and JavaScript, so it can be dropped into almost any existing website.',
      hu: 'A kisvállalkozások gyakran veszítenek el ügyfeleket csak azért, mert senki sincs ott, hogy megválaszoljon egy egyszerű kérdést, mint például „nyitva vannak most?” vagy „melyik a legnépszerűbb pizzájuk?”. Ez a projekt azt mutatja be, hogyan tud egy könnyű AI chatbot pótolni ezt a hiányt. Egy demó pizzéria weboldalt építettem egy chat widgettel, amelyet egy gyors nagy nyelvi modell hajt meg (Groq-on keresztül), és úgy állítottam be, hogy csak a vállalkozás valós adataiból, menüből, árakból és nyitvatartásból, beszéljen, ami sokkal kisebb eséllyel eredményez kitalált, nem létező ételeket. A beszélgetés alatt emlékszik a korábbi üzenetekre, nyomon követi, mely termékeket rendelik a legtöbbször, és alapvető védelmi mechanizmusokat is tartalmaz, mint a kéréskorlátozás és az API-kulcsos védelem. Maga a widget egyszerű HTML, CSS és JavaScript, így szinte bármelyik meglévő weboldalba beilleszthető.',
    },
    categories: ['chatbot', 'llmIntegration', 'customerExperience'],
    githubUrl: 'https://github.com/AnomInsight/03_Portfolio_Project',
  },
];

// Octicon "mark-github" glyph, inlined so it can be recolored with currentColor
// instead of managing a separate image asset per theme state.
const GITHUB_ICON_SVG = '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>';

const portfolioCategoryLabels = {
  predictiveMaintenance: { en: 'Predictive Maintenance', hu: 'Prediktív karbantartás' },
  anomalyDetection: { en: 'Anomaly Detection', hu: 'Anomáliafelismerés' },
  decisionSupport: { en: 'Decision Support', hu: 'Döntéstámogatás' },
  imageClassification: { en: 'Image Classification', hu: 'Képosztályozás' },
  deepLearning: { en: 'Deep Learning', hu: 'Mélytanulás' },
  computerVision: { en: 'Computer Vision', hu: 'Számítógépes látás' },
  chatbot: { en: 'AI Chatbot', hu: 'AI chatbot' },
  llmIntegration: { en: 'LLM Integration', hu: 'LLM integráció' },
  customerExperience: { en: 'Customer Experience', hu: 'Ügyfélélmény' },
};

// Project status: the top-level "main type" filter. Only a subset of these
// is used by the current projects below, but the full vocabulary is here so
// new projects can pick up any of these statuses without touching this dict.
const portfolioStatusLabels = {
  live: { en: 'Live', hu: 'Aktív' },
  pilot: { en: 'Pilot', hu: 'Próbaüzem' },
  caseStudy: { en: 'Case Study', hu: 'Esettanulmány' },
  prototype: { en: 'Prototype', hu: 'Prototípus' },
  workInProgress: { en: 'Work in Progress', hu: 'Fejlesztés alatt' },
  ongoing: { en: 'Ongoing', hu: 'Folyamatban' },
  planned: { en: 'Planned', hu: 'Tervezett' },
  testing: { en: 'Testing', hu: 'Tesztelés alatt' },
};

let activePortfolioIndex = 0;
let portfolioAutoRotateTimer = null;
// Keeps setPortfolioFocus() (called on card click/focus) from restarting the
// timer while the pointer is still resting on the deck.
let isPortfolioTrackHovered = false;
// Empty set means "All" — no filter narrows the results. Both rows support
// selecting multiple chips at once (checkbox-style, not radio-style).
let activePortfolioStatusFilters = new Set();
let activePortfolioCategoryFilters = new Set();
let currentLang = 'en';
let portfolioFilterTransitionToken = 0;
let activePortfolioDetailProject = null;
let portfolioDetailCloseTimer = null;

const closePortfolioDetails = () => {
  const modal = document.getElementById('portfolioDetailModal');
  if (!modal || modal.getAttribute('aria-hidden') === 'true') {
    return;
  }

  modal.classList.add('is-closing');
  if (portfolioDetailCloseTimer) {
    window.clearTimeout(portfolioDetailCloseTimer);
  }

  portfolioDetailCloseTimer = window.setTimeout(() => {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-closing');
    document.body.classList.remove('portfolio-detail-open');
    activePortfolioDetailProject = null;
    portfolioDetailCloseTimer = null;
  }, 240);
};

const openPortfolioDetails = (project, lang) => {
  const modal = document.getElementById('portfolioDetailModal');
  const titleNode = document.getElementById('portfolioDetailTitle');
  const textNode = document.getElementById('portfolioDetailText');
  const kindNode = document.getElementById('portfolioDetailKind');
  const stageNode = document.getElementById('portfolioDetailStage');
  const metaNode = document.getElementById('portfolioDetailMeta');
  const githubNode = document.getElementById('portfolioDetailGithub');
  const closeBtn = document.getElementById('portfolioDetailCloseBtn');

  if (!modal || !titleNode || !textNode || !kindNode || !stageNode || !metaNode || !githubNode || !closeBtn) {
    return;
  }

  if (portfolioDetailCloseTimer) {
    window.clearTimeout(portfolioDetailCloseTimer);
    portfolioDetailCloseTimer = null;
  }

  modal.classList.remove('is-closing');

  const kind = project.kind[lang] || project.kind.en;
  const stage = getStatusLabel(project.status, lang);
  const title = project.title[lang] || project.title.en;
  const overview = (project.overview && (project.overview[lang] || project.overview.en))
    || project.description[lang]
    || project.description.en;

  kindNode.textContent = kind;
  stageNode.textContent = stage;
  titleNode.textContent = title;
  textNode.textContent = overview;

  if (project.githubUrl) {
    githubNode.href = project.githubUrl;
    githubNode.hidden = false;
  } else {
    githubNode.hidden = true;
  }

  const categoryLabels = project.categories.map((categoryId) => getCategoryLabel(categoryId, lang));
  metaNode.innerHTML = '';
  categoryLabels.forEach((category) => {
    const chip = document.createElement('span');
    chip.textContent = category;
    metaNode.appendChild(chip);
  });

  activePortfolioDetailProject = project;
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('portfolio-detail-open');
  closeBtn.focus();
};

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

// Reflects the full collection regardless of active filters, so the strip
// reads as a stable portfolio-wide credibility signal rather than a filter count.
const renderPortfolioStats = (lang) => {
  const host = document.getElementById('portfolioStats');
  if (!host) {
    return;
  }

  const projectCount = portfolioProjects.length;
  const industryCount = new Set(portfolioProjects.map((project) => project.kind.en)).size;
  const liveCount = portfolioProjects.filter((project) => project.status === 'live').length;

  const stats = [
    { value: projectCount, label: translations[lang]['portfolio.statLabelProjects'] },
    { value: industryCount, label: translations[lang]['portfolio.statLabelIndustries'] },
    { value: liveCount, label: translations[lang]['portfolio.statLabelLive'] },
  ];

  host.innerHTML = '';
  stats.forEach((stat) => {
    const tile = document.createElement('div');
    tile.className = 'portfolio-stat';
    tile.innerHTML = `
      <span class="portfolio-stat-value">${stat.value}</span>
      <span class="portfolio-stat-label">${stat.label}</span>
    `;
    host.appendChild(tile);
  });
};

const getFilteredProjects = () => portfolioProjects.filter((project) => {
  const matchesStatus = activePortfolioStatusFilters.size === 0 || activePortfolioStatusFilters.has(project.status);
  const matchesCategory = activePortfolioCategoryFilters.size === 0
    || project.categories.some((categoryId) => activePortfolioCategoryFilters.has(categoryId));
  return matchesStatus && matchesCategory;
});

const getCategoryLabel = (categoryId, lang) => {
  const labels = portfolioCategoryLabels[categoryId];
  if (!labels) {
    return categoryId;
  }
  return labels[lang] || labels.en;
};

const getStatusLabel = (statusId, lang) => {
  const labels = portfolioStatusLabels[statusId];
  if (!labels) {
    return statusId;
  }
  return labels[lang] || labels.en;
};

const renderPortfolioFilterRow = (host, { activeSet, ids, getLabel, lang, onSelect, onClear }) => {
  host.innerHTML = '';

  const allButton = document.createElement('button');
  allButton.type = 'button';
  allButton.className = `portfolio-filter-chip${activeSet.size === 0 ? ' is-active' : ''}`;
  allButton.setAttribute('aria-pressed', activeSet.size === 0 ? 'true' : 'false');
  allButton.textContent = translations[lang]['portfolio.filterAll'];
  allButton.addEventListener('click', () => onClear());
  host.appendChild(allButton);

  ids.forEach((id) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    const isActive = activeSet.has(id);
    chip.className = `portfolio-filter-chip${isActive ? ' is-active' : ''}`;
    chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    chip.textContent = getLabel(id, lang);
    chip.addEventListener('click', () => onSelect(id));
    host.appendChild(chip);
  });
};

// Drops any category selections that no longer belong to a currently
// selected status, so the type row never highlights an option it isn't showing.
const pruneCategoryFilters = () => {
  const statusScopedProjects = activePortfolioStatusFilters.size === 0
    ? portfolioProjects
    : portfolioProjects.filter((project) => activePortfolioStatusFilters.has(project.status));
  const validCategoryIds = new Set(statusScopedProjects.flatMap((project) => project.categories));
  Array.from(activePortfolioCategoryFilters).forEach((categoryId) => {
    if (!validCategoryIds.has(categoryId)) {
      activePortfolioCategoryFilters.delete(categoryId);
    }
  });
};

const updatePortfolioClearAllButton = (lang) => {
  const btn = document.getElementById('portfolioClearFilters');
  if (!btn) {
    return;
  }
  const hasActiveFilters = activePortfolioStatusFilters.size > 0 || activePortfolioCategoryFilters.size > 0;
  btn.textContent = translations[lang]['portfolio.clearAllFilters'];
  btn.disabled = !hasActiveFilters;
};

const renderPortfolioFilters = (lang) => {
  const statusHost = document.getElementById('portfolioStatusFilters');
  const categoryHost = document.getElementById('portfolioFilters');
  if (!statusHost || !categoryHost) {
    return;
  }

  const statusIds = [...new Set(portfolioProjects.map((project) => project.status))];
  renderPortfolioFilterRow(statusHost, {
    activeSet: activePortfolioStatusFilters,
    ids: statusIds,
    getLabel: getStatusLabel,
    lang,
    onSelect: toggleStatusFilter,
    onClear: clearStatusFilters,
  });

  // The type row drills down into whatever the status row narrowed to.
  const statusScopedProjects = activePortfolioStatusFilters.size === 0
    ? portfolioProjects
    : portfolioProjects.filter((project) => activePortfolioStatusFilters.has(project.status));
  const categoryIds = [...new Set(statusScopedProjects.flatMap((project) => project.categories))];
  renderPortfolioFilterRow(categoryHost, {
    activeSet: activePortfolioCategoryFilters,
    ids: categoryIds,
    getLabel: getCategoryLabel,
    lang,
    onSelect: toggleCategoryFilter,
    onClear: clearCategoryFilters,
  });

  updatePortfolioClearAllButton(lang);
};

const animatePortfolioFilterChange = (applyChange) => {
  const token = ++portfolioFilterTransitionToken;
  const track = document.getElementById('portfolioTrack');
  if (!track) {
    applyChange();
    renderPortfolio(currentLang);
    return;
  }

  syncPortfolioDeckTarget();

  clearInterval(portfolioAutoRotateTimer);
  applyChange();
  renderPortfolioFilters(currentLang);

  const cards = Array.from(track.querySelectorAll('.portfolio-card'));
  const skipStagger = window.matchMedia('(max-width: 840px)').matches
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!cards.length || skipStagger) {
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

const toggleStatusFilter = (statusId) => {
  animatePortfolioFilterChange(() => {
    if (activePortfolioStatusFilters.has(statusId)) {
      activePortfolioStatusFilters.delete(statusId);
    } else {
      activePortfolioStatusFilters.add(statusId);
    }
    // Narrowing (or widening) the status selection can invalidate previously
    // picked types, so drop any that no longer belong to the current subset.
    pruneCategoryFilters();
  });
};

const clearStatusFilters = () => {
  if (!activePortfolioStatusFilters.size) {
    return;
  }

  animatePortfolioFilterChange(() => {
    activePortfolioStatusFilters.clear();
    pruneCategoryFilters();
  });
};

const toggleCategoryFilter = (categoryId) => {
  animatePortfolioFilterChange(() => {
    if (activePortfolioCategoryFilters.has(categoryId)) {
      activePortfolioCategoryFilters.delete(categoryId);
    } else {
      activePortfolioCategoryFilters.add(categoryId);
    }
  });
};

const clearCategoryFilters = () => {
  if (!activePortfolioCategoryFilters.size) {
    return;
  }

  animatePortfolioFilterChange(() => {
    activePortfolioCategoryFilters.clear();
  });
};

const clearAllPortfolioFilters = () => {
  if (!activePortfolioStatusFilters.size && !activePortfolioCategoryFilters.size) {
    return;
  }

  animatePortfolioFilterChange(() => {
    activePortfolioStatusFilters.clear();
    activePortfolioCategoryFilters.clear();
  });
};

// Builds one dot per visible project so the deck can be browsed by clicking
// a dot directly, as an alternative to clicking cards or the prev/next arrows.
const renderPortfolioNavDots = (count, lang) => {
  const nav = document.getElementById('portfolioNav');
  const dotsHost = document.getElementById('portfolioNavDots');
  if (!nav || !dotsHost) {
    return;
  }

  // visibility (not display) so the row keeps its height when there's only
  // one result — otherwise the CTA below snaps up into the gap the arrows
  // left behind.
  nav.style.visibility = count > 1 ? '' : 'hidden';
  dotsHost.innerHTML = '';

  const labelTemplate = translations[lang]['portfolio.navDotLabel'] || 'Go to project {n}';
  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'portfolio-nav-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', labelTemplate.replace('{n}', String(i + 1)));
    dot.addEventListener('click', () => setPortfolioFocus(i));
    dotsHost.appendChild(dot);
  }
};

const renderPortfolio = (lang, options = {}) => {
  const { animateIn = false } = options;
  const track = document.getElementById('portfolioTrack');
  if (!track) {
    return;
  }

  syncPortfolioDeckTarget();

  renderPortfolioStats(lang);
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
    renderPortfolioNavDots(0, lang);
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
    const stage = getStatusLabel(project.status, lang);
    const title = project.title[lang] || project.title.en;
    const description = project.description[lang] || project.description.en;
    const categoryLabels = project.categories.map((categoryId) => getCategoryLabel(categoryId, lang));
    const categories = categoryLabels.join(' • ');
    const expandLabel = translations[lang]['portfolio.expand'];
    const githubLabel = translations[lang]['portfolio.githubLabel'];
    const githubLink = project.githubUrl
      ? `<a class="portfolio-expand-btn portfolio-github-btn" href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" aria-label="${githubLabel}" title="${githubLabel}">${GITHUB_ICON_SVG}</a>`
      : '';

    card.innerHTML = `
      <div>
        <div class="portfolio-top">
          <p class="portfolio-kind">${kind}</p>
          <div class="portfolio-top-actions">
            <span class="portfolio-stage">${stage}</span>
            ${githubLink}
            <button type="button" class="portfolio-expand-btn" aria-label="${expandLabel}" title="${expandLabel}">
              <img src="../../../../images/expand-arrows.png" alt="" />
            </button>
          </div>
        </div>
        <h3>${title}</h3>
        <p>${description}</p>
      </div>
      <div class="portfolio-meta" aria-label="${translations[lang]['portfolio.metaPrefix']}: ${categories}">
        ${categoryLabels.map((category) => `<span>${category}</span>`).join('')}
      </div>
    `;

    track.appendChild(card);

    const expandBtn = card.querySelector('.portfolio-expand-btn:not(.portfolio-github-btn)');
    if (expandBtn) {
      expandBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        openPortfolioDetails(project, lang);
      });
    }

    const githubBtn = card.querySelector('.portfolio-github-btn');
    if (githubBtn) {
      githubBtn.addEventListener('click', (event) => {
        event.stopPropagation();
      });
    }

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
  renderPortfolioNavDots(projectsToRender.length, lang);
  updatePortfolioClasses();

  if (animateIn && !window.matchMedia('(max-width: 840px)').matches) {
    window.requestAnimationFrame(() => {
      const cards = track.querySelectorAll('.portfolio-card');
      cards.forEach((card) => {
        card.classList.remove('is-from-deck');
      });

      // Once the staggered entrance has had time to finish, clear the delay
      // so later interactions (hover, click, auto-rotate) aren't delayed too.
      const entranceCards = Array.from(cards);
      const maxDealDelay = (entranceCards.length - 1) * 55;
      window.setTimeout(() => {
        entranceCards.forEach((card) => {
          card.style.setProperty('--deal-delay', '0ms');
        });
      }, maxDealDelay + 360);
    });
  }

  startPortfolioAutoRotate();
};

// Cards further than this many positions from the active card are fully
// hidden (still in the DOM, but opacity 0 and untabbable) so a large "All"
// deck doesn't pile every card into an unreadable stack.
const PORTFOLIO_MAX_VISIBLE_DEPTH = 4;

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
    // Signed distance from the active card, wrapped to the shorter direction
    // around the deck (e.g. with 6 cards, index 5 vs active 0 is -1, not +5).
    let distance = index - activePortfolioIndex;
    if (distance > total / 2) {
      distance -= total;
    } else if (distance < -total / 2) {
      distance += total;
    }

    const absDistance = Math.abs(distance);
    const isActive = distance === 0;
    const isBeyondDepth = absDistance > PORTFOLIO_MAX_VISIBLE_DEPTH;

    card.classList.toggle('is-active', isActive);
    card.classList.toggle('is-beyond-depth', isBeyondDepth);
    card.style.setProperty('--distance', distance);
    card.style.setProperty('--abs-distance', absDistance);

    if (isActive) {
      card.setAttribute('aria-current', 'true');
    } else {
      card.removeAttribute('aria-current');
    }

    // Keep hidden-depth cards out of the tab order so keyboard focus can't
    // land on a card the user can't see.
    card.tabIndex = isBeyondDepth ? -1 : 0;
  });

  const dots = document.querySelectorAll('#portfolioNavDots .portfolio-nav-dot');
  dots.forEach((dot, index) => {
    const isActive = index === activePortfolioIndex;
    dot.classList.toggle('is-active', isActive);
    dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
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

  if (isPortfolioTrackHovered || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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

// Public API -----------------------------------------------------------

// Renders the carousel for the given language. Called on initial load and
// whenever the language toggle changes (also reopens the detail modal, if open,
// in the new language).
export function setPortfolioLanguage(lang) {
  currentLang = lang;
  renderPortfolio(lang);
  if (activePortfolioDetailProject) {
    openPortfolioDetails(activePortfolioDetailProject, lang);
  }
}

// Wires hover-to-pause, detail modal close handlers, and the deck-position
// resize listener. Call once after the first renderPortfolio() has run.
export function initPortfolioInteraction() {
  const track = document.getElementById('portfolioTrack');
  const modal = document.getElementById('portfolioDetailModal');
  const closeBtn = document.getElementById('portfolioDetailCloseBtn');
  const clearFiltersBtn = document.getElementById('portfolioClearFilters');
  const prevBtn = document.getElementById('portfolioNavPrev');
  const nextBtn = document.getElementById('portfolioNavNext');

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      clearAllPortfolioFilters();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      setPortfolioFocus(activePortfolioIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      setPortfolioFocus(activePortfolioIndex + 1);
    });
  }

  if (track) {
    track.addEventListener('mouseenter', () => {
      isPortfolioTrackHovered = true;
      clearInterval(portfolioAutoRotateTimer);
    });

    track.addEventListener('mouseleave', () => {
      isPortfolioTrackHovered = false;
      startPortfolioAutoRotate();
    });
  }

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target && event.target.dataset && event.target.dataset.closePortfolioDetail === 'true') {
        closePortfolioDetails();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closePortfolioDetails();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePortfolioDetails();
    }
  });

  window.addEventListener('resize', syncPortfolioDeckTarget);
}