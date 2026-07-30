// Portfolio carousel: data, category filtering, deck rotation animation, and the
// project detail modal. Split out of script01.js for maintainability.

import { translations } from './i18n.js';

const portfolioProjects = [
  {
    kind: { en: 'Manufacturing', hu: 'Gyártás' },
    stage: { en: 'Live', hu: 'Aktív' },
    title: { en: 'Machine Downtime Early Warning', hu: 'Gépleállás korai figyelmeztetés' },
    description: {
      en: 'Streaming telemetry was used to detect anomalies before stoppages, reducing unplanned downtime windows.',
      hu: 'Folyamatos telemetriai adatokkal azonosítottam az anomáliákat leállás előtt, csökkentve a nem tervezett kiesést.',
    },
    overview: {
      en: 'This project combines sensor telemetry, event logs, and maintenance history to build an early-warning layer for downtime risk. The pipeline scores anomalies in near real time, highlights likely root-cause machines, and publishes prioritized alerts for operators. The result is faster intervention and shorter unplanned outage windows across shifts.',
      hu: 'Ez a projekt szenzor telemetriát, eseménynaplókat és karbantartási előzményeket kapcsol össze, hogy korai figyelmeztető réteget adjon a leállási kockázatokhoz. A folyamat közel valós időben pontozza az anomáliákat, kiemeli a valószínű gyökérokot adó gépeket, és prioritásos riasztásokat ad az operátoroknak. Ennek eredménye a gyorsabb beavatkozás és a rövidebb, nem tervezett kiesés.',
    },
    categories: ['anomalyDetection', 'timeSeries', 'operations'],
  },
  {
    kind: { en: 'Manufacturing', hu: 'Gyártás' },
    stage: { en: 'Pilot', hu: 'Pilot' },
    title: { en: 'Predictive Maintenance for CNC Operations', hu: 'Prediktív karbantartás CNC-üzemekhez' },
    description: {
      en: 'An interpretable LightGBM decision-support model identified short-term CNC failure risk with 96.1% recall on the holdout set.',
      hu: 'Egy értelmezhető LightGBM döntéstámogató modell 96,1%-os recall értékkel jelezte előre a rövid távú CNC-meghibásodási kockázatot a holdout adathalmazon.',
    },
    overview: {
      en: 'This CRISP-DM case study turns CNC sensor data into a daily, prioritized maintenance-review list for a 24/7 manufacturing operation. The leakage-safe pipeline excludes failure-cause columns and identifiers, engineers temperature, power, and wear-load features, and uses stratified splits to handle the 3.39% failure rate. A tuned LightGBM model, retrained on the full development set, achieved 96.1% recall, 39.8% precision, and 0.936 PR-AUC on the frozen holdout set at its OOF-selected operating threshold. The simulated client decision was a Conditional Go for a pilot: use high-recall alerts as decision support, retain maintenance-engineer authority, and manage false-alert workload with capacity-aware threshold modes and ongoing drift monitoring.',
      hu: 'Ez a CRISP-DM esettanulmány CNC-szenzoradatokból készít napi, priorizált karbantartási felülvizsgálati listát egy folyamatos üzemű gyártási környezethez. Az adatszivárgást kizáró folyamat eltávolítja a meghibásodási okokat és az azonosítókat, hőmérséklet-, teljesítmény- és kopás-terhelési jellemzőket képez, valamint rétegzett felosztással kezeli a 3,39%-os meghibásodási arányt. A teljes fejlesztési adathalmazon újratanított, hangolt LightGBM modell az OOF alapján választott küszöbnél a befagyasztott holdout adathalmazon 96,1%-os recall, 39,8%-os precision és 0,936-os PR-AUC értéket ért el. A szimulált ügyféldöntés feltételes pilotindítás: a magas recall értékű riasztások döntéstámogatásként működnek, a végső döntés a karbantartó mérnököknél marad, a téves riasztások terhelését pedig kapacitásalapú küszöbökkel és folyamatos driftfigyeléssel kell kezelni.',
    },
    categories: ['predictiveMaintenance', 'anomalyDetection', 'decisionSupport'],
  },
  {
    kind: { en: 'Energy', hu: 'Energia' },
    stage: { en: 'Pilot', hu: 'Pilot' },
    title: { en: 'Utility Demand Forecast Stack', hu: 'Közmű kereslet-előrejelző rendszer' },
    description: {
      en: 'Built a forecasting layer that compares model bands with actual usage to support staffing and procurement decisions.',
      hu: 'Előrejelző réteget építettem, amely a modell sávjait valós fogyasztással veti össze a tervezés támogatására.',
    },
    overview: {
      en: 'The forecasting stack models demand at multiple horizons, from next-day planning to weekly capacity outlooks. Teams can compare actual usage against confidence bands and scenario assumptions in one place. This made staffing, procurement, and risk planning more predictable during volatile consumption periods.',
      hu: 'Az előrejelző rendszer több időtávon modellezi a keresletet, a másnapi tervezéstől a heti kapacitás előretekintésig. A csapatok egy helyen vethetik össze a valós fogyasztást a konfidencia sávokkal és a forgatókönyvekkel. Ez kiszámíthatóbbá tette a létszám-, beszerzési és kockázati tervezést ingadozó fogyasztási időszakokban.',
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
    overview: {
      en: 'Shipment tracking signals, ETA drift, and operational alerts are merged into a single monitoring board. Dispatch teams get a prioritized view of route exceptions, including delay severity and likely impact. This reduced the time between issue detection and corrective action from hours to minutes.',
      hu: 'A szállítmánykövetési jelek, az ETA eltérések és az operatív riasztások egyetlen monitorozó felületre kerültek. A diszpécser csapatok prioritás szerint látják az útvonal eltéréseket, a késés súlyosságával és várható hatásával együtt. Ez órákról percekre csökkentette a hibaészlelés és a beavatkozás közti időt.',
    },
    categories: ['alerts', 'visualization', 'supplyChain'],
  },
  {
    kind: { en: 'Logistics', hu: 'Logisztika' },
    stage: { en: 'Case Study', hu: 'Esettanulmány' },
    title: { en: 'Handwritten Digit Classifier for Mail Sorting', hu: 'Kézzel írt számjegyek osztályozása levélválogatáshoz' },
    description: {
      en: 'Built and compared five ML models for automated ZIP-code digit recognition; the selected CNN reached 99.27% test accuracy.',
      hu: 'Öt ML-modellt hasonlítottam össze irányítószámok automatikus felismeréséhez; a kiválasztott CNN 99,27%-os tesztpontosságot ért el.',
    },
    overview: {
      en: 'This CRISP-DM case study examines how a mail-sorting operation could automate handwritten ZIP-code reading. Starting with baseline, logistic-regression, random-forest, and SVM models, the project selected a CNN that achieved 99.27% accuracy on the held-out MNIST test set. Evaluation went beyond accuracy with confusion analysis, high-confidence error review, confidence-gate recommendations, and robustness tests for rotation, noise, and brightness changes. The key operational recommendation is to send lower-confidence predictions to manual review and monitor confusion patterns and high-confidence errors after deployment.',
      hu: 'Ez a CRISP-DM esettanulmány azt vizsgálja, hogyan automatizálható a kézzel írt irányítószámok olvasása egy levélválogató folyamatban. Az alapmodell, a logisztikus regresszió, a random forest és az SVM után egy CNN-t választottam, amely a független MNIST teszthalmazon 99,27%-os pontosságot ért el. Az értékelés a pontosságon túl a tévesztési mintákat, a magas bizalmú hibákat, a bizalmi küszöb alkalmazását és a forgatással, zajjal, illetve fényerő-változással szembeni robusztusságot is vizsgálta. A fő operatív javaslat az alacsonyabb bizalmú előrejelzések manuális ellenőrzésre küldése, valamint a tévesztési minták és a magas bizalmú hibák folyamatos monitorozása.',
    },
    categories: ['imageClassification', 'deepLearning', 'computerVision'],
  },
  {
    kind: { en: 'E-commerce', hu: 'E-kereskedelem' },
    stage: { en: 'Prototype', hu: 'Prototípus' },
    title: { en: 'Revenue Outlier Insight Feed', hu: 'Bevételi kiugrásokat vizsgáló feed' },
    description: {
      en: 'Daily outlier feed highlights unusual product and region behavior, making action planning significantly faster.',
      hu: 'Napi kiugrási feed emeli ki a szokatlan termék- és régióviselkedést, gyorsítva az üzleti reakciót.',
    },
    overview: {
      en: 'A daily insight feed flags unusual conversion, basket size, and regional revenue movements before they become major losses. Each outlier includes context and trend comparison so teams can quickly decide whether to launch a campaign, investigate operations, or adjust pricing. The workflow helps commercial teams move from raw metrics to action with less delay.',
      hu: 'A napi insight feed jelzi a szokatlan konverziós, kosárérték és régiós bevételi mozgásokat, mielőtt komoly veszteséggé válnának. Minden kiugrás kontextust és trend összevetést kap, így gyorsan eldönthető, hogy kampány, operatív vizsgálat vagy árazási módosítás szükséges. A folyamat segít, hogy a kereskedelmi csapat gyorsabban jusson a nyers számoktól konkrét lépésekig.',
    },
    categories: ['revenue', 'outliers', 'decisionSupport'],
  },
];

const portfolioCategoryLabels = {
  predictiveMaintenance: { en: 'Predictive Maintenance', hu: 'Prediktív karbantartás' },
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
  imageClassification: { en: 'Image Classification', hu: 'Képosztályozás' },
  deepLearning: { en: 'Deep Learning', hu: 'Mélytanulás' },
  computerVision: { en: 'Computer Vision', hu: 'Számítógépes látás' },
};

let activePortfolioIndex = 0;
let portfolioAutoRotateTimer = null;
let activePortfolioFilter = 'all';
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
  const closeBtn = document.getElementById('portfolioDetailCloseBtn');

  if (!modal || !titleNode || !textNode || !kindNode || !stageNode || !metaNode || !closeBtn) {
    return;
  }

  if (portfolioDetailCloseTimer) {
    window.clearTimeout(portfolioDetailCloseTimer);
    portfolioDetailCloseTimer = null;
  }

  modal.classList.remove('is-closing');

  const kind = project.kind[lang] || project.kind.en;
  const stage = project.stage[lang] || project.stage.en;
  const title = project.title[lang] || project.title.en;
  const overview = (project.overview && (project.overview[lang] || project.overview.en))
    || project.description[lang]
    || project.description.en;

  kindNode.textContent = kind;
  stageNode.textContent = stage;
  titleNode.textContent = title;
  textNode.textContent = overview;

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
    const expandLabel = translations[lang]['portfolio.expand'];

    card.innerHTML = `
      <div>
        <div class="portfolio-top">
          <p class="portfolio-kind">${kind}</p>
          <div class="portfolio-top-actions">
            <span class="portfolio-stage">${stage}</span>
            <button type="button" class="portfolio-expand-btn" aria-label="${expandLabel}" title="${expandLabel}">
              <img src="../../images/expand-arrows.png" alt="" />
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

    const expandBtn = card.querySelector('.portfolio-expand-btn');
    if (expandBtn) {
      expandBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        openPortfolioDetails(project, lang);
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

  if (track) {
    track.addEventListener('mouseenter', () => {
      clearInterval(portfolioAutoRotateTimer);
    });

    track.addEventListener('mouseleave', () => {
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