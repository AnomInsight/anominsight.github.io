// Direction C — "The Control Room"
//
// Behaviour: the project log (filters + records + detail drawer), the rail's
// current-section state, instrument initialisation on the two data modules,
// and the contact form. Static markup renders fully before this file runs, so
// a script failure costs the log's interactivity, never the page's content.

import { translations as productCopy } from '../../shared/content.js';
import {
  portfolioProjects,
  portfolioCategoryLabels,
  portfolioStatusLabels,
  getLabel,
} from '../../shared/portfolio-data.js';
import { labels } from './labels.js';
import { createLanguageController } from '../../shared/i18n.js';
import { initContactForm } from '../../shared/contactForm.js';
import { observeOnce, prefersReducedMotion } from '../../shared/motion.js';

const translations = {
  en: { ...productCopy.en, ...labels.en },
  hu: { ...productCopy.hu, ...labels.hu },
};

const GITHUB_MARK =
  '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>';

const DRAWER_TRANSITION = 220;

const lang = createLanguageController(translations);

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
};

const recordCode = (project) => `R-${String(portfolioProjects.indexOf(project) + 1).padStart(2, '0')}`;

/* --- Detail drawer ------------------------------------------------------- */

const drawer = document.getElementById('recordDrawer');
const drawerTitle = document.getElementById('drawerTitle');
const drawerRecord = document.getElementById('drawerRecord');
const drawerMeta = document.getElementById('drawerMeta');
const drawerMetrics = document.getElementById('drawerMetrics');
const drawerOverview = document.getElementById('drawerOverview');
const drawerRepo = document.getElementById('drawerRepo');
const drawerClose = document.getElementById('drawerClose');

let openProject = null;
let lastFocused = null;
let closeTimer = null;

const focusablesIn = (root) =>
  Array.from(
    root.querySelectorAll('a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])'),
  ).filter((node) => node.offsetParent !== null);

const fillDrawer = (project) => {
  drawerRecord.textContent = `${lang.t('c.log.record')} ${recordCode(project)}`;
  drawerTitle.textContent = project.title[lang.lang] || project.title.en;

  drawerMeta.textContent = '';
  const fields = [
    [lang.t('c.log.industry'), project.kind[lang.lang] || project.kind.en],
    [lang.t('c.log.status'), getLabel(portfolioStatusLabels, project.status, lang.lang)],
    [
      lang.t('portfolio.metaPrefix'),
      project.categories.map((category) => getLabel(portfolioCategoryLabels, category, lang.lang)).join(', '),
    ],
  ];
  fields.forEach(([term, value]) => {
    const row = el('div');
    row.append(el('dt', null, term), el('dd', null, value));
    drawerMeta.append(row);
  });

  drawerMetrics.textContent = '';
  project.metrics.forEach((metric) => {
    const item = el('li');
    item.append(el('b', null, metric.value));
    item.append(el('span', null, metric.label[lang.lang] || metric.label.en));
    drawerMetrics.append(item);
  });

  drawerOverview.textContent = project.overview[lang.lang] || project.overview.en;

  if (project.githubUrl) {
    drawerRepo.href = project.githubUrl;
    drawerRepo.hidden = false;
  } else {
    drawerRepo.hidden = true;
  }
};

const openDrawer = (project, trigger) => {
  if (!drawer) {
    return;
  }

  window.clearTimeout(closeTimer);
  openProject = project;
  lastFocused = trigger || document.activeElement;

  fillDrawer(project);
  drawer.hidden = false;
  // Force a frame so the panel transitions in from its off-screen position
  // instead of appearing already open.
  void drawer.offsetHeight;
  drawer.dataset.state = 'open';
  document.body.classList.add('drawer-open');
  drawerClose.focus();
};

const closeDrawer = () => {
  if (!drawer || drawer.hidden) {
    return;
  }

  drawer.dataset.state = '';
  document.body.classList.remove('drawer-open');
  openProject = null;

  const finish = () => {
    drawer.hidden = true;
  };

  if (prefersReducedMotion()) {
    finish();
  } else {
    closeTimer = window.setTimeout(finish, DRAWER_TRANSITION);
  }

  if (lastFocused && document.contains(lastFocused)) {
    lastFocused.focus();
  }
  lastFocused = null;
};

if (drawer) {
  drawer.addEventListener('click', (event) => {
    if (event.target.hasAttribute('data-drawer-close')) {
      closeDrawer();
    }
  });

  drawerClose.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (event) => {
    if (drawer.hidden) {
      return;
    }

    if (event.key === 'Escape') {
      closeDrawer();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const panel = drawer.querySelector('.drawer__panel');
    const focusables = focusablesIn(panel);
    if (!focusables.length) {
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

/* --- Project log --------------------------------------------------------- */

const activeStatuses = new Set();
const activeCategories = new Set();

const listEl = document.getElementById('recordList');
const statusFiltersEl = document.getElementById('statusFilters');
const typeFiltersEl = document.getElementById('typeFilters');
const clearFiltersEl = document.getElementById('clearFilters');
const logCountEl = document.getElementById('logCount');

const statusScopedProjects = () =>
  activeStatuses.size === 0
    ? portfolioProjects
    : portfolioProjects.filter((project) => activeStatuses.has(project.status));

const visibleProjects = () =>
  statusScopedProjects().filter(
    (project) =>
      activeCategories.size === 0 ||
      project.categories.some((category) => activeCategories.has(category)),
  );

const pruneCategories = () => {
  const valid = new Set(statusScopedProjects().flatMap((project) => project.categories));
  Array.from(activeCategories).forEach((category) => {
    if (!valid.has(category)) {
      activeCategories.delete(category);
    }
  });
};

const renderFilterRow = (host, { ids, activeSet, dict, onToggle }) => {
  host.textContent = '';

  const all = el('button', 'toggle', lang.t('portfolio.filterAll'));
  all.type = 'button';
  all.setAttribute('aria-pressed', activeSet.size === 0 ? 'true' : 'false');
  all.addEventListener('click', () => {
    if (activeSet.size === 0) {
      return;
    }
    activeSet.clear();
    pruneCategories();
    render();
  });
  host.append(all);

  ids.forEach((id) => {
    const button = el('button', 'toggle', getLabel(dict, id, lang.lang));
    button.type = 'button';
    button.setAttribute('aria-pressed', activeSet.has(id) ? 'true' : 'false');
    button.addEventListener('click', () => onToggle(id));
    host.append(button);
  });
};

const renderFilters = () => {
  renderFilterRow(statusFiltersEl, {
    ids: [...new Set(portfolioProjects.map((project) => project.status))],
    activeSet: activeStatuses,
    dict: portfolioStatusLabels,
    onToggle: (id) => {
      if (activeStatuses.has(id)) {
        activeStatuses.delete(id);
      } else {
        activeStatuses.add(id);
      }
      pruneCategories();
      render();
    },
  });

  renderFilterRow(typeFiltersEl, {
    ids: [...new Set(statusScopedProjects().flatMap((project) => project.categories))],
    activeSet: activeCategories,
    dict: portfolioCategoryLabels,
    onToggle: (id) => {
      if (activeCategories.has(id)) {
        activeCategories.delete(id);
      } else {
        activeCategories.add(id);
      }
      render();
    },
  });

  clearFiltersEl.disabled = activeStatuses.size === 0 && activeCategories.size === 0;
};

const buildRecord = (project) => {
  const item = el('li', 'record');

  // Identifier, status and industry are all fields of the record, so they sit
  // together in the metadata column. Putting the industry above the title
  // instead would make it a label stacked on a heading.
  const code = el('div', 'record__code');
  code.append(el('span', null, recordCode(project)));
  const status = el('span', 'record__status');
  status.append(el('span', 'dot dot--ok'));
  status.append(el('span', null, getLabel(portfolioStatusLabels, project.status, lang.lang)));
  code.append(status);
  code.append(el('span', 'record__industry', project.kind[lang.lang] || project.kind.en));

  const body = el('div', 'record__main');
  body.append(el('h3', 'record__title', project.title[lang.lang] || project.title.en));
  body.append(el('p', 'record__summary', project.description[lang.lang] || project.description.en));

  const tags = el('ul', 'record__tags');
  project.categories.forEach((category) => {
    tags.append(el('li', null, getLabel(portfolioCategoryLabels, category, lang.lang)));
  });
  body.append(tags);

  const metrics = el('div', 'record__metrics');
  project.metrics.forEach((metric) => {
    const row = el('div', 'record__metric');
    row.append(el('b', null, metric.value));
    row.append(el('span', null, metric.label[lang.lang] || metric.label.en));
    metrics.append(row);
  });

  const actions = el('div', 'record__actions');
  const openButton = el('button', 'btn btn--ghost', lang.t('c.log.open'));
  openButton.type = 'button';
  openButton.addEventListener('click', () => openDrawer(project, openButton));
  actions.append(openButton);

  if (project.githubUrl) {
    const repo = el('a', 'record__repo');
    repo.href = project.githubUrl;
    repo.target = '_blank';
    repo.rel = 'noopener noreferrer';
    repo.innerHTML = GITHUB_MARK;
    repo.append(el('span', null, lang.t('portfolio.githubButton')));
    actions.append(repo);
  }

  item.append(code, body, metrics, actions);
  return item;
};

const render = () => {
  if (!listEl) {
    return;
  }

  renderFilters();
  listEl.textContent = '';

  const projects = visibleProjects();

  if (logCountEl) {
    logCountEl.textContent = `${projects.length}/${portfolioProjects.length}`;
  }

  if (!projects.length) {
    listEl.append(el('li', 'records__empty', lang.t('portfolio.empty')));
    return;
  }

  projects.forEach((project) => listEl.append(buildRecord(project)));

  // The drawer shows a record that may have just been filtered out or
  // re-rendered in another language; keep its contents in step.
  if (openProject) {
    const stillVisible = projects.some((project) => project.id === openProject.id);
    if (stillVisible) {
      fillDrawer(openProject);
    } else {
      closeDrawer();
    }
  }
};

if (clearFiltersEl) {
  clearFiltersEl.addEventListener('click', () => {
    if (!activeStatuses.size && !activeCategories.size) {
      return;
    }
    activeStatuses.clear();
    activeCategories.clear();
    render();
  });
}

/* --- Rail ---------------------------------------------------------------- */

const initRail = () => {
  const menu = document.getElementById('railMenu');
  const nav = document.getElementById('railNav');
  const links = Array.from(nav ? nav.querySelectorAll('a[href^="#"]') : []);

  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = nav.dataset.open !== 'true';
      nav.dataset.open = open ? 'true' : 'false';
      menu.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // On the narrow layout the rail overlays the content, so a jump should
    // close it; on the wide layout the nav is always open and unaffected.
    links.forEach((link) => {
      link.addEventListener('click', () => {
        nav.dataset.open = 'false';
        menu.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (!sections.length) {
    return;
  }

  let ticking = false;

  const sync = () => {
    ticking = false;
    let currentIndex = -1;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= 120) {
        currentIndex = index;
      }
    });

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
      currentIndex = sections.length - 1;
    }

    links.forEach((link, index) => {
      if (index === currentIndex) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const request = () => {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(sync);
  };

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  sync();
};

/* --- Instrument initialisation ------------------------------------------- */

// The measured figures deliberately do not animate. Counting 96% up from zero
// would render values that were never measured, directly under a line that
// says nothing here is a projection — and an instrument latches a reading, it
// does not ramp to it. The sweep carries the initialisation on its own.
const initInstruments = () => {
  observeOnce(
    document.querySelectorAll('[data-sweep]'),
    (module) => {
      module.dataset.swept = 'true';
    },
    { threshold: 0.2 },
  );
};

/* --- Boot ---------------------------------------------------------------- */

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const langToggle = document.querySelector('[data-lang-toggle]');
if (langToggle) {
  langToggle.addEventListener('click', () => lang.toggle());
}

lang.subscribe(render);
lang.start();

initContactForm(document.getElementById('contactForm'), {
  t: (key) => lang.t(key),
  statusEl: document.getElementById('formStatus'),
});

initRail();
initInstruments();
