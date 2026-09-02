// Direction B — "The Audit Dossier"
//
// Behaviour is deliberately thin: the exhibits list, the contents rail's
// current-chapter state, the marker sweep across the measured figures, and the
// contact form. Everything else is static markup that works before this file
// executes, so a script failure costs polish rather than content.

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
import { observeOnce } from '../../shared/motion.js';

const translations = {
  en: { ...productCopy.en, ...labels.en },
  hu: { ...productCopy.hu, ...labels.hu },
};

const GITHUB_MARK =
  '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>';

const CHEVRON =
  '<svg class="icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 8l5 5 5-5"/></svg>';

const EXHIBIT_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

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

/* --- Exhibits ------------------------------------------------------------ */

const activeStatuses = new Set();
const activeCategories = new Set();
// Which exhibits are expanded, keyed by project id, so a language switch or a
// filter change does not silently collapse what the visitor opened.
const expanded = new Set();

const listEl = document.getElementById('exhibitList');
const statusFiltersEl = document.getElementById('statusFilters');
const typeFiltersEl = document.getElementById('typeFilters');
const clearFiltersEl = document.getElementById('clearFilters');
const tallyEl = document.getElementById('exhibitTally');

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

// Narrowing the status selection can leave a type selected that no longer
// appears in any visible project; drop those so the index never highlights a
// term it is not offering.
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

  const all = el('button', 'term', lang.t('portfolio.filterAll'));
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
    const term = el('button', 'term', getLabel(dict, id, lang.lang));
    term.type = 'button';
    term.setAttribute('aria-pressed', activeSet.has(id) ? 'true' : 'false');
    term.addEventListener('click', () => onToggle(id));
    host.append(term);
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

  const hasFilters = activeStatuses.size > 0 || activeCategories.size > 0;
  clearFiltersEl.disabled = !hasFilters;
};

const buildMetaField = (label, value) => {
  const field = el('div', 'exhibit__field');
  field.append(el('dt', null, label), el('dd', null, value));
  return field;
};

const buildExhibit = (project, letter) => {
  const item = el('li', 'exhibit');

  const meta = el('dl', 'exhibit__meta');
  const no = el('p', 'exhibit__no', `${lang.t('b.exhibit')} ${letter}`);
  meta.append(no);
  meta.append(buildMetaField(lang.t('b.exhibit.industry'), project.kind[lang.lang] || project.kind.en));
  meta.append(
    buildMetaField(lang.t('b.exhibit.status'), getLabel(portfolioStatusLabels, project.status, lang.lang)),
  );

  if (project.githubUrl) {
    const repoField = el('div', 'exhibit__field');
    repoField.append(el('dt', null, lang.t('b.exhibit.repo')));
    const dd = el('dd');
    const link = el('a', 'exhibit__repo');
    link.href = project.githubUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.innerHTML = GITHUB_MARK;
    link.append(el('span', null, lang.t('portfolio.githubButton')));
    dd.append(link);
    repoField.append(dd);
    meta.append(repoField);
  }

  const body = el('div', 'exhibit__body');

  const title = el('h3', 'exhibit__title', project.title[lang.lang] || project.title.en);
  body.append(title);
  body.append(el('p', 'exhibit__summary', project.description[lang.lang] || project.description.en));

  const metrics = el('div', 'exhibit__metrics');
  project.metrics.forEach((metric) => {
    const cell = el('div', 'exhibit__metric');
    cell.append(el('b', null, metric.value));
    cell.append(el('span', null, metric.label[lang.lang] || metric.label.en));
    metrics.append(cell);
  });
  body.append(metrics);

  const tags = el('ul', 'exhibit__tags');
  project.categories.forEach((category) => {
    tags.append(el('li', null, getLabel(portfolioCategoryLabels, category, lang.lang)));
  });
  body.append(tags);

  const isOpen = expanded.has(project.id);
  const detailId = `detail-${project.id}`;

  const toggle = el('button', 'exhibit__toggle');
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  toggle.setAttribute('aria-controls', detailId);
  const toggleLabel = el('span', null, isOpen ? lang.t('portfolio.collapse') : lang.t('portfolio.expand'));
  toggle.append(toggleLabel);
  toggle.insertAdjacentHTML('beforeend', CHEVRON);

  const detail = el('div', 'exhibit__detail');
  detail.id = detailId;
  detail.dataset.open = isOpen ? 'true' : 'false';
  const detailInner = el('div');
  detailInner.append(el('p', null, project.overview[lang.lang] || project.overview.en));
  detail.append(detailInner);

  toggle.addEventListener('click', () => {
    const open = detail.dataset.open !== 'true';
    detail.dataset.open = open ? 'true' : 'false';
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggleLabel.textContent = open ? lang.t('portfolio.collapse') : lang.t('portfolio.expand');
    if (open) {
      expanded.add(project.id);
    } else {
      expanded.delete(project.id);
    }
  });

  body.append(toggle, detail);
  item.append(meta, body);
  return item;
};

const renderTally = (shown) => {
  const industries = new Set(portfolioProjects.map((project) => project.kind.en)).size;
  const repos = portfolioProjects.filter((project) => project.githubUrl).length;
  tallyEl.textContent = [
    `${portfolioProjects.length} ${lang.t('portfolio.statLabelProjects')}`,
    `${industries} ${lang.t('portfolio.statLabelIndustries')}`,
    `${repos} ${lang.t('portfolio.statLabelRepos')}`,
  ].join('  ·  ');
  tallyEl.hidden = shown === 0;
};

const render = () => {
  if (!listEl) {
    return;
  }

  renderFilters();
  listEl.textContent = '';

  const projects = visibleProjects();

  if (!projects.length) {
    const empty = el('li', 'exhibits__empty', lang.t('portfolio.empty'));
    listEl.append(empty);
    renderTally(0);
    return;
  }

  projects.forEach((project) => {
    const letter = EXHIBIT_LETTERS[portfolioProjects.indexOf(project)] || '·';
    listEl.append(buildExhibit(project, letter));
  });

  renderTally(projects.length);
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

/* --- Contents rail ------------------------------------------------------- */

const initContentsRail = () => {
  const links = Array.from(document.querySelectorAll('.toc__list a[href^="#"]'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) {
    return;
  }

  let ticking = false;

  const sync = () => {
    ticking = false;
    const header = document.querySelector('.site-header');
    const offset = (header ? header.offsetHeight : 0) + 24;

    let currentIndex = -1;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= offset) {
        currentIndex = index;
      }
    });

    // Past the end of the document the last chapter stays current, otherwise
    // the rail goes blank on the footer.
    const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
    if (atBottom) {
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

/* --- The marker sweep ---------------------------------------------------- */

const initMarkers = () => {
  observeOnce(document.querySelectorAll('[data-mark]'), (node) => {
    node.dataset.marked = 'true';
  }, { threshold: 0.9 });
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

initContentsRail();
initMarkers();
