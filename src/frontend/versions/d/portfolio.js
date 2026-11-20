// Version D copy of Version A's portfolio module (copied, not imported across
// versions, so D stands alone at promotion). Changes from A: the expand icon
// image is lazy-loaded (performance fix), and at phone widths (<= 840px) the
// deck shows one card at a time with arrows, a counter and swipe, and the
// filters move into a bottom sheet (user-approved mobile redesign,
// 2026-11-19). Desktop behaviour is A's, unchanged.
//
// Version A's portfolio: the SAME deck-carousel mechanic as the original build
// (DESIGN.md marks this component's structure protected - filters, 3D card
// deck, auto-rotate, detail modal), adapted only to pull its data and labels
// from the shared content module instead of a locally embedded copy, and to
// subscribe to the shared language controller instead of exporting its own
// setPortfolioLanguage(). No layout, interaction or visual-structure change.

import {
  portfolioProjects,
  portfolioCategoryLabels,
  portfolioStatusLabels,
  getLabel,
} from '../../shared/portfolio-data.js';

// D's own case-study wording (kindD, titleD, descriptionD, overviewD) wins over the shared text A, B and C use.
const pickText = (project, field, lang) => {
  const text = project[`${field}D`] || project[field];
  return text && (text[lang] || text.en);
};

const GITHUB_ICON_SVG =
  '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>';

let activePortfolioIndex = 0;
let portfolioAutoRotateTimer = null;
let isPortfolioTrackHovered = false;
let activePortfolioStatusFilters = new Set();
let activePortfolioCategoryFilters = new Set();
let currentLang = 'en';
let portfolioFilterTransitionToken = 0;
let activePortfolioDetailProject = null;
let portfolioDetailCloseTimer = null;
// The element that opened the detail dialog, so focus can return to it.
let portfolioDetailOpener = null;
// Rotation stops while keyboard focus is inside the deck, and for good once
// the visitor presses the pause control (WCAG 2.2.2).
let isPortfolioFocusWithin = false;
let isPortfolioRotationPaused = false;

// Phones (the stylesheet's portfolio breakpoint): one card at a time, a
// finite stack with no wrap-around, no auto-rotation, and the filters in a
// bottom sheet instead of the chip rows. Above it everything is unchanged.
const mobileDeckQuery = window.matchMedia('(max-width: 840px)');
const isMobileDeck = () => mobileDeckQuery.matches;
// The sheet edits a draft copy of the filters; only its Show button applies it,
// every other way out (close, Escape, backdrop) discards it.
const portfolioDraftStatus = new Set();
const portfolioDraftCategories = new Set();
const isSameSet = (a, b) => a.size === b.size && [...a].every((id) => b.has(id));

const fillTemplate = (template, values) =>
  template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));

// The status group only means something once projects differ in status.
const getPortfolioStatusIds = () => [...new Set(portfolioProjects.map((project) => project.status))];

const getActivePortfolioFilterCount = () => activePortfolioCategoryFilters.size
  + (getPortfolioStatusIds().length > 1 ? activePortfolioStatusFilters.size : 0);

const announcePortfolio = (text) => {
  const live = document.getElementById('portfolioLive');
  if (live) {
    live.textContent = text;
  }
};

const closePortfolioDetails = () => {
  const modal = document.getElementById('portfolioDetailModal');
  if (!modal || modal.getAttribute('aria-hidden') === 'true') {
    return;
  }

  if (portfolioDetailOpener && document.contains(portfolioDetailOpener)) {
    portfolioDetailOpener.focus({ preventScroll: true });
  }
  portfolioDetailOpener = null;

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

const openPortfolioDetails = (project, lang, t) => {
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

  const kind = pickText(project, 'kind', lang);
  const stage = getLabel(portfolioStatusLabels, project.status, lang);
  const title = pickText(project, 'title', lang);
  const overview = pickText(project, 'overview', lang) || pickText(project, 'description', lang);

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

  const categoryLabels = project.categories.map((categoryId) => getLabel(portfolioCategoryLabels, categoryId, lang));
  metaNode.innerHTML = '';
  categoryLabels.forEach((category) => {
    const chip = document.createElement('span');
    chip.textContent = category;
    metaNode.appendChild(chip);
  });

  if (modal.getAttribute('aria-hidden') !== 'false' && !modal.contains(document.activeElement)) {
    portfolioDetailOpener = document.activeElement;
  }

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

  const virtualCardCenterY = trackRect.top + 56 + 135;
  const stickyCenterY = stickyRect.top + stickyRect.height * 0.5;

  const shiftX = Math.round(stickyCenterX - trackCenterX);
  const shiftY = Math.round(stickyCenterY - virtualCardCenterY);

  track.style.setProperty('--deck-shift-x', `${shiftX}px`);
  track.style.setProperty('--deck-shift-y', `${shiftY}px`);
};

const renderPortfolioStats = (lang, t) => {
  const host = document.getElementById('portfolioStats');
  if (!host) {
    return;
  }

  const projectCount = portfolioProjects.length;
  // A kindD names a technical field (Computer Vision), not an industry, so it is not counted.
  const industryCount = new Set(portfolioProjects.filter((project) => !project.kindD).map((project) => project.kind.en)).size;
  // Distinct solution types, from the same category tags as the "Refine by
  // type" filter. Replaces a repository count that only repeated the project
  // count (every card already links its repository).
  const typeCount = new Set(portfolioProjects.flatMap((project) => project.categories)).size;

  const stats = [
    { value: projectCount, label: t('portfolio.statLabelProjects') },
    { value: industryCount, label: t('portfolio.statLabelIndustries') },
    { value: typeCount, label: t('portfolio.statLabelTypes') },
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

const getFilteredProjects = (
  statuses = activePortfolioStatusFilters,
  categories = activePortfolioCategoryFilters,
) => portfolioProjects.filter((project) => {
  const matchesStatus = statuses.size === 0 || statuses.has(project.status);
  const matchesCategory = categories.size === 0
    || project.categories.some((categoryId) => categories.has(categoryId));
  return matchesStatus && matchesCategory;
});

const renderPortfolioFilterRow = (host, { activeSet, ids, getLabelFn, lang, onSelect, onClear, allLabel }) => {
  host.innerHTML = '';

  const allButton = document.createElement('button');
  allButton.type = 'button';
  allButton.className = `portfolio-filter-chip${activeSet.size === 0 ? ' is-active' : ''}`;
  allButton.setAttribute('aria-pressed', activeSet.size === 0 ? 'true' : 'false');
  allButton.textContent = allLabel;
  allButton.addEventListener('click', () => onClear());
  host.appendChild(allButton);

  ids.forEach((id) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    const isActive = activeSet.has(id);
    chip.className = `portfolio-filter-chip${isActive ? ' is-active' : ''}`;
    chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    chip.textContent = getLabelFn(id, lang);
    chip.addEventListener('click', () => onSelect(id));
    host.appendChild(chip);
  });
};

const pruneCategoryFilters = (
  statuses = activePortfolioStatusFilters,
  categories = activePortfolioCategoryFilters,
) => {
  const statusScopedProjects = statuses.size === 0
    ? portfolioProjects
    : portfolioProjects.filter((project) => statuses.has(project.status));
  const validCategoryIds = new Set(statusScopedProjects.flatMap((project) => project.categories));
  Array.from(categories).forEach((categoryId) => {
    if (!validCategoryIds.has(categoryId)) {
      categories.delete(categoryId);
    }
  });
};

const updatePortfolioClearAllButton = (t) => {
  const btn = document.getElementById('portfolioClearFilters');
  if (!btn) {
    return;
  }
  const hasActiveFilters = activePortfolioStatusFilters.size > 0 || activePortfolioCategoryFilters.size > 0;
  btn.textContent = t('portfolio.clearAllFilters');
  btn.disabled = !hasActiveFilters;
};

// Phones: result count + the Filter button's selected-count badge.
const renderPortfolioBar = (t) => {
  const count = document.getElementById('portfolioCount');
  const button = document.getElementById('portfolioFilterOpen');
  const badge = document.getElementById('portfolioFilterBadge');
  if (!count || !button || !badge) {
    return;
  }

  const active = getActivePortfolioFilterCount();
  const total = portfolioProjects.length;
  count.textContent = active
    ? fillTemplate(t('portfolio.countFilteredD'), { n: getFilteredProjects().length, total })
    : fillTemplate(t('portfolio.countAllD'), { n: total });
  badge.hidden = !active;
  badge.textContent = String(active);
  button.classList.toggle('is-active', active > 0);
  if (active) {
    button.setAttribute('aria-label', `${t('portfolio.filterButtonD')}, ${fillTemplate(t('portfolio.filterSelectedD'), { n: active })}`);
  } else {
    button.removeAttribute('aria-label');
  }
};

const updatePortfolioSheetActions = (t) => {
  const apply = document.getElementById('portfolioSheetApply');
  const clear = document.getElementById('portfolioSheetClear');
  const matches = getFilteredProjects(portfolioDraftStatus, portfolioDraftCategories).length;
  if (apply) {
    apply.textContent = matches === 1 ? t('portfolio.applyOneD') : fillTemplate(t('portfolio.applyD'), { n: matches });
  }
  if (clear) {
    clear.setAttribute('aria-disabled', String(!portfolioDraftStatus.size && !portfolioDraftCategories.size));
  }
};

// The sheet's checkboxes show the draft. Applied, it lands in the same filter
// sets as the desktop chips, so selections carry over between widths.
const renderPortfolioSheet = (t) => {
  const body = document.getElementById('portfolioSheetBody');
  if (!body) {
    return;
  }

  const statusIds = getPortfolioStatusIds();
  const statusScopedProjects = portfolioDraftStatus.size === 0
    ? portfolioProjects
    : portfolioProjects.filter((project) => portfolioDraftStatus.has(project.status));
  const categoryIds = [...new Set(statusScopedProjects.flatMap((project) => project.categories))];
  const group = (legend, name, ids, activeSet, labels) => `
    <fieldset class="portfolio-sheet-group">
      <legend>${legend}</legend>
      ${ids.map((id) => `
        <label class="portfolio-sheet-option">
          <input type="checkbox" name="${name}" value="${id}"${activeSet.has(id) ? ' checked' : ''}>
          <span class="portfolio-sheet-box" aria-hidden="true"></span>
          <span>${getLabel(labels, id, currentLang)}</span>
        </label>`).join('')}
    </fieldset>`;

  body.innerHTML = (statusIds.length > 1
    ? group(t('portfolio.statusFiltersTitle'), 'status', statusIds, portfolioDraftStatus, portfolioStatusLabels)
    : '')
    + group(t('portfolio.filtersTitle'), 'category', categoryIds, portfolioDraftCategories, portfolioCategoryLabels);
  updatePortfolioSheetActions(t);
};

const renderPortfolioFilters = (lang, t) => {
  const statusHost = document.getElementById('portfolioStatusFilters');
  const categoryHost = document.getElementById('portfolioFilters');
  if (!statusHost || !categoryHost) {
    return;
  }

  const statusIds = [...new Set(portfolioProjects.map((project) => project.status))];
  renderPortfolioFilterRow(statusHost, {
    activeSet: activePortfolioStatusFilters,
    ids: statusIds,
    getLabelFn: (id, l) => getLabel(portfolioStatusLabels, id, l),
    lang,
    allLabel: t('portfolio.filterAll'),
    onSelect: toggleStatusFilter,
    onClear: clearStatusFilters,
  });

  const statusScopedProjects = activePortfolioStatusFilters.size === 0
    ? portfolioProjects
    : portfolioProjects.filter((project) => activePortfolioStatusFilters.has(project.status));
  const categoryIds = [...new Set(statusScopedProjects.flatMap((project) => project.categories))];
  renderPortfolioFilterRow(categoryHost, {
    activeSet: activePortfolioCategoryFilters,
    ids: categoryIds,
    getLabelFn: (id, l) => getLabel(portfolioCategoryLabels, id, l),
    lang,
    allLabel: t('portfolio.filterAll'),
    onSelect: toggleCategoryFilter,
    onClear: clearCategoryFilters,
  });

  updatePortfolioClearAllButton(t);
};

let toggleStatusFilter;
let clearStatusFilters;
let toggleCategoryFilter;
let clearCategoryFilters;
let clearAllPortfolioFilters;

const animatePortfolioFilterChange = (applyChange, t) => {
  const token = ++portfolioFilterTransitionToken;
  const track = document.getElementById('portfolioTrack');
  if (!track) {
    applyChange();
    renderPortfolio(currentLang, t);
    return;
  }

  syncPortfolioDeckTarget();

  clearInterval(portfolioAutoRotateTimer);
  applyChange();
  renderPortfolioFilters(currentLang, t);

  const cards = Array.from(track.querySelectorAll('.portfolio-card'));
  const skipStagger = window.matchMedia('(max-width: 840px)').matches
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!cards.length || skipStagger) {
    renderPortfolio(currentLang, t);
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
    renderPortfolio(currentLang, t, { animateIn: true });
  }, totalOutTime);
};

toggleStatusFilter = (statusId) => {
  animatePortfolioFilterChange(() => {
    if (activePortfolioStatusFilters.has(statusId)) {
      activePortfolioStatusFilters.delete(statusId);
    } else {
      activePortfolioStatusFilters.add(statusId);
    }
    pruneCategoryFilters();
  }, lastT);
};

clearStatusFilters = () => {
  if (!activePortfolioStatusFilters.size) {
    return;
  }
  animatePortfolioFilterChange(() => {
    activePortfolioStatusFilters.clear();
    pruneCategoryFilters();
  }, lastT);
};

toggleCategoryFilter = (categoryId) => {
  animatePortfolioFilterChange(() => {
    if (activePortfolioCategoryFilters.has(categoryId)) {
      activePortfolioCategoryFilters.delete(categoryId);
    } else {
      activePortfolioCategoryFilters.add(categoryId);
    }
  }, lastT);
};

clearCategoryFilters = () => {
  if (!activePortfolioCategoryFilters.size) {
    return;
  }
  animatePortfolioFilterChange(() => {
    activePortfolioCategoryFilters.clear();
  }, lastT);
};

clearAllPortfolioFilters = () => {
  if (!activePortfolioStatusFilters.size && !activePortfolioCategoryFilters.size) {
    return;
  }
  animatePortfolioFilterChange(() => {
    activePortfolioStatusFilters.clear();
    activePortfolioCategoryFilters.clear();
  }, lastT);
};

const renderPortfolioNavDots = (count, t) => {
  const nav = document.getElementById('portfolioNav');
  const dotsHost = document.getElementById('portfolioNavDots');
  if (!nav || !dotsHost) {
    return;
  }

  nav.style.visibility = count > 1 ? '' : 'hidden';
  // Phones drop the row entirely rather than leave an empty band.
  nav.classList.toggle('is-single', count <= 1);
  dotsHost.innerHTML = '';

  const labelTemplate = t('portfolio.navDotLabel') || 'Go to project {n}';
  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'portfolio-nav-dot';
    // Plain buttons, not role="tab": there are no tab panels and no
    // arrow-key behaviour, so tab semantics would promise the wrong thing.
    dot.setAttribute('aria-label', labelTemplate.replace('{n}', String(i + 1)));
    dot.addEventListener('click', () => setPortfolioFocus(i));
    dotsHost.appendChild(dot);
  }
};

let lastT = (key) => key;

const renderPortfolio = (lang, t, options = {}) => {
  lastT = t;
  // dealIn: phones only, after the filter sheet changed the set.
  const { animateIn = false, dealIn = false } = options;
  const track = document.getElementById('portfolioTrack');
  if (!track) {
    return;
  }

  syncPortfolioDeckTarget();

  renderPortfolioStats(lang, t);
  renderPortfolioFilters(lang, t);
  renderPortfolioBar(t);
  track.innerHTML = '';
  const projectsToRender = getFilteredProjects();

  if (!projectsToRender.length) {
    const empty = document.createElement('p');
    empty.className = 'portfolio-empty';
    empty.textContent = t('portfolio.empty');
    if (animateIn) {
      empty.classList.add('is-from-deck');
    }
    track.appendChild(empty);
    // Phones have no chip rows to undo the filters from, so the empty state
    // carries its own way back.
    if (isMobileDeck()) {
      const clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'portfolio-filter-btn portfolio-empty-clear';
      clear.textContent = t('portfolio.clearAllFilters');
      clear.addEventListener('click', () => {
        activePortfolioStatusFilters.clear();
        activePortfolioCategoryFilters.clear();
        renderPortfolio(currentLang, t, { dealIn: true });
        announcePortfolio(document.getElementById('portfolioCount')?.textContent || '');
        const opener = document.getElementById('portfolioFilterOpen');
        if (opener) {
          opener.focus({ preventScroll: true });
        }
      });
      track.appendChild(clear);
    }
    renderPortfolioNavDots(0, t);
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

    const kind = pickText(project, 'kind', lang);
    const stage = getLabel(portfolioStatusLabels, project.status, lang);
    const title = pickText(project, 'title', lang);
    const description = pickText(project, 'description', lang);
    const categoryLabels = project.categories.map((categoryId) => getLabel(portfolioCategoryLabels, categoryId, lang));
    const categories = categoryLabels.join(' • ');
    const expandLabel = t('portfolio.expand');
    const githubLabel = t('portfolio.githubLabel');
    const githubLink = project.githubUrl
      ? `<a class="portfolio-expand-btn portfolio-github-btn" href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" aria-describedby="newTabHint" aria-label="${githubLabel}" title="${githubLabel}">${GITHUB_ICON_SVG}</a>`
      : '';

    card.innerHTML = `
      <div>
        <div class="portfolio-top">
          <p class="portfolio-kind">${kind}</p>
          <div class="portfolio-top-actions">
            <span class="portfolio-stage">${stage}</span>
            ${githubLink}
            <button type="button" class="portfolio-expand-btn" aria-label="${expandLabel}" title="${expandLabel}">
              <img src="../../../../images/icons/expand-arrows.png" alt="" width="64" height="64" loading="lazy" decoding="async" />
            </button>
          </div>
        </div>
        <h3>${title}</h3>
        <p>${description}</p>
      </div>
      <div class="portfolio-meta" role="group" aria-label="${t('portfolio.metaPrefix')}: ${categories}">
        ${categoryLabels.map((category) => `<span>${category}</span>`).join('')}
      </div>
    `;

    track.appendChild(card);

    const expandBtn = card.querySelector('.portfolio-expand-btn:not(.portfolio-github-btn)');
    if (expandBtn) {
      expandBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        openPortfolioDetails(project, lang, t);
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
  renderPortfolioNavDots(projectsToRender.length, t);
  updatePortfolioClasses();

  if (dealIn && isMobileDeck()) {
    const front = track.querySelector('.portfolio-card');
    if (front) {
      front.classList.add('is-dealt');
      front.addEventListener('animationend', () => front.classList.remove('is-dealt'), { once: true });
    }
  }

  if (animateIn && !window.matchMedia('(max-width: 840px)').matches) {
    window.requestAnimationFrame(() => {
      const cards = track.querySelectorAll('.portfolio-card');
      cards.forEach((card) => {
        card.classList.remove('is-from-deck');
      });

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

  const mobile = isMobileDeck();
  cards.forEach((card, index) => {
    let distance = index - activePortfolioIndex;
    if (!mobile && distance > total / 2) {
      distance -= total;
    } else if (!mobile && distance < -total / 2) {
      distance += total;
    }

    const absDistance = Math.abs(distance);
    const isActive = distance === 0;
    const isBeyondDepth = !mobile && absDistance > PORTFOLIO_MAX_VISIBLE_DEPTH;

    card.classList.toggle('is-active', isActive);
    card.classList.toggle('is-beyond-depth', isBeyondDepth);
    card.style.setProperty('--distance', distance);
    card.style.setProperty('--abs-distance', absDistance);

    if (isActive) {
      card.setAttribute('aria-current', 'true');
    } else {
      card.removeAttribute('aria-current');
    }

    if (mobile) {
      // Cards already passed leave to the left; the next two show as edges
      // under the active card. Only the active card can be reached at all.
      card.dataset.deck = distance < 0 ? 'past' : distance === 0 ? 'front' : distance <= 2 ? `layer${distance}` : 'rest';
      card.inert = !isActive;
      card.tabIndex = -1;
    } else {
      delete card.dataset.deck;
      card.inert = false;
      card.tabIndex = isBeyondDepth ? -1 : 0;
    }
  });

  // Phones: "2 / 3" between the arrows, which stop at either end.
  const counter = document.getElementById('portfolioNavCount');
  if (counter) {
    counter.textContent = `${activePortfolioIndex + 1} / ${total}`;
  }
  [['portfolioNavPrev', activePortfolioIndex === 0], ['portfolioNavNext', activePortfolioIndex === total - 1]].forEach(([id, atEnd]) => {
    const arrow = document.getElementById(id);
    if (!arrow) {
      return;
    }
    if (mobile && atEnd) {
      arrow.setAttribute('aria-disabled', 'true');
    } else {
      arrow.removeAttribute('aria-disabled');
    }
  });

  const dots = document.querySelectorAll('#portfolioNavDots .portfolio-nav-dot');
  dots.forEach((dot, index) => {
    const isActive = index === activePortfolioIndex;
    dot.classList.toggle('is-active', isActive);
    if (isActive) {
      dot.setAttribute('aria-current', 'true');
    } else {
      dot.removeAttribute('aria-current');
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

  if (isMobileDeck()) {
    if (index < 0 || index >= cards.length) {
      return;
    }
    activePortfolioIndex = index;
  } else {
    activePortfolioIndex = ((index % cards.length) + cards.length) % cards.length;
  }
  updatePortfolioClasses();
  startPortfolioAutoRotate();
};

// Arrows and swipe. Returns whether the active card changed.
const stepPortfolio = (delta) => {
  const before = activePortfolioIndex;
  setPortfolioFocus(activePortfolioIndex + delta);
  if (activePortfolioIndex === before) {
    return false;
  }
  if (isMobileDeck()) {
    const cards = document.querySelectorAll('#portfolioTrack .portfolio-card');
    const heading = cards[activePortfolioIndex] && cards[activePortfolioIndex].querySelector('h3');
    announcePortfolio(`${fillTemplate(lastT('portfolio.positionD'), { n: activePortfolioIndex + 1, total: cards.length })}: ${heading ? heading.textContent : ''}`);
  }
  return true;
};

// Phones: a horizontal swipe on the active card turns it like the arrows.
// touch-action: pan-y on the track leaves vertical scrolling to the browser,
// which cancels the pointer as soon as a gesture turns out to be a scroll.
const PORTFOLIO_SWIPE_THRESHOLD = 56;

const initPortfolioSwipe = (track) => {
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let front = null;
  let swallowClick = false;

  const release = () => {
    pointerId = null;
    const card = front;
    front = null;
    if (card) {
      card.classList.remove('is-dragging');
    }
    return card;
  };

  track.addEventListener('pointerdown', (event) => {
    swallowClick = false;
    if (!isMobileDeck() || !event.isPrimary || event.button !== 0 || event.target.closest('a, button')
      || track.querySelectorAll('.portfolio-card').length < 2) {
      return;
    }
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    deltaX = 0;
  });

  track.addEventListener('pointermove', (event) => {
    if (event.pointerId !== pointerId) {
      return;
    }
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!front) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        pointerId = null;
        return;
      }
      if (Math.abs(dx) < 10) {
        return;
      }
      front = track.querySelector('.portfolio-card[data-deck="front"]');
      if (!front) {
        pointerId = null;
        return;
      }
      track.setPointerCapture(event.pointerId);
      front.classList.add('is-dragging');
    }
    deltaX = dx;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Resistance where there is no card to turn to.
      const total = track.querySelectorAll('.portfolio-card').length;
      const atEnd = (dx < 0 && activePortfolioIndex === total - 1) || (dx > 0 && activePortfolioIndex === 0);
      front.style.transform = `translateX(${atEnd ? dx * 0.3 : dx}px)`;
    }
  });

  track.addEventListener('pointerup', (event) => {
    if (event.pointerId !== pointerId) {
      return;
    }
    const card = release();
    if (!card) {
      return;
    }
    swallowClick = true;
    const turned = Math.abs(deltaX) >= PORTFOLIO_SWIPE_THRESHOLD && stepPortfolio(deltaX < 0 ? 1 : -1);
    if (!turned) {
      // Springs back through the card's own transition.
      card.style.removeProperty('transform');
      return;
    }
    // The turned card fades out where the finger left it, then drops the offset.
    window.setTimeout(() => card.style.removeProperty('transform'), 320);
  });

  track.addEventListener('pointercancel', (event) => {
    if (event.pointerId !== pointerId) {
      return;
    }
    const card = release();
    if (card) {
      card.style.removeProperty('transform');
    }
  });

  // The click that ends a drag must not also act on the card it began on.
  track.addEventListener('click', (event) => {
    if (swallowClick) {
      swallowClick = false;
      event.stopPropagation();
      event.preventDefault();
    }
  }, true);
};

const initPortfolioSheet = () => {
  const sheet = document.getElementById('portfolioFilterSheet');
  const opener = document.getElementById('portfolioFilterOpen');
  const body = document.getElementById('portfolioSheetBody');
  if (!sheet || !opener || !body) {
    return;
  }
  if (typeof sheet.showModal !== 'function') {
    opener.hidden = true;
    return;
  }

  const copySet = (from, to) => {
    to.clear();
    from.forEach((id) => to.add(id));
  };

  opener.addEventListener('click', () => {
    copySet(activePortfolioStatusFilters, portfolioDraftStatus);
    copySet(activePortfolioCategoryFilters, portfolioDraftCategories);
    renderPortfolioSheet(lastT);
    // Locks page scroll behind the modal sheet.
    document.documentElement.classList.add('portfolio-sheet-open');
    sheet.showModal();
    opener.setAttribute('aria-expanded', 'true');
    const first = body.querySelector('input:checked') || body.querySelector('input');
    if (first) {
      first.focus();
    }
  });

  // Close, Escape and backdrop end here without touching the applied filters,
  // so the deck keeps its card; the draft is rebuilt on the next open.
  sheet.addEventListener('close', () => {
    document.documentElement.classList.remove('portfolio-sheet-open');
    opener.setAttribute('aria-expanded', 'false');
    if (isMobileDeck()) {
      opener.focus({ preventScroll: true });
    }
  });

  sheet.addEventListener('click', (event) => {
    if (event.target !== sheet) {
      return;
    }
    const box = sheet.getBoundingClientRect();
    if (event.clientY < box.top || event.clientY > box.bottom || event.clientX < box.left || event.clientX > box.right) {
      sheet.close();
    }
  });

  body.addEventListener('change', (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }
    const set = input.name === 'status' ? portfolioDraftStatus : portfolioDraftCategories;
    if (input.checked) {
      set.add(input.value);
    } else {
      set.delete(input.value);
    }
    if (input.name === 'status') {
      // The type list depends on the status scope: rebuild it, keep the place.
      pruneCategoryFilters(portfolioDraftStatus, portfolioDraftCategories);
      const scrollTop = body.scrollTop;
      renderPortfolioSheet(lastT);
      body.scrollTop = scrollTop;
      const again = body.querySelector(`input[name="status"][value="${input.value}"]`);
      if (again) {
        again.focus();
      }
    } else {
      updatePortfolioSheetActions(lastT);
    }
  });

  // Clears the draft only; Show applies it.
  document.getElementById('portfolioSheetClear')?.addEventListener('click', () => {
    if (!portfolioDraftStatus.size && !portfolioDraftCategories.size) {
      return;
    }
    portfolioDraftStatus.clear();
    portfolioDraftCategories.clear();
    renderPortfolioSheet(lastT);
  });
  document.getElementById('portfolioSheetClose')?.addEventListener('click', () => sheet.close());
  // The deck re-renders, back at its first card, only if the selection changed.
  document.getElementById('portfolioSheetApply')?.addEventListener('click', () => {
    if (!isSameSet(portfolioDraftStatus, activePortfolioStatusFilters)
      || !isSameSet(portfolioDraftCategories, activePortfolioCategoryFilters)) {
      copySet(portfolioDraftStatus, activePortfolioStatusFilters);
      copySet(portfolioDraftCategories, activePortfolioCategoryFilters);
      renderPortfolio(currentLang, lastT, { dealIn: true });
      announcePortfolio(document.getElementById('portfolioCount')?.textContent || '');
    }
    sheet.close();
  });
};

const startPortfolioAutoRotate = () => {
  clearInterval(portfolioAutoRotateTimer);

  if (
    isPortfolioTrackHovered ||
    isPortfolioFocusWithin ||
    isPortfolioRotationPaused ||
    isMobileDeck() ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  const track = document.getElementById('portfolioTrack');
  if (!track) {
    return;
  }

  // A single card has nothing to rotate to; two already alternate (the
  // arrows swap them), so rotation runs for any filtered set of 2 or more.
  // It used to require 3, which left most type filters sitting still.
  const cards = track.querySelectorAll('.portfolio-card');
  if (cards.length < 2) {
    return;
  }

  portfolioAutoRotateTimer = setInterval(() => {
    setPortfolioFocus(activePortfolioIndex + 1);
  }, 4600);
};

// Public API -----------------------------------------------------------

export function setPortfolioLanguage(lang, t) {
  currentLang = lang;
  renderPortfolio(lang, t);
  if (activePortfolioDetailProject) {
    openPortfolioDetails(activePortfolioDetailProject, lang, t);
  }
}

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
      stepPortfolio(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stepPortfolio(1);
    });
  }

  initPortfolioSheet();
  if (track) {
    initPortfolioSwipe(track);
  }

  // Crossing the breakpoint switches deck behaviour (and rotation) over.
  mobileDeckQuery.addEventListener('change', () => {
    const sheet = document.getElementById('portfolioFilterSheet');
    if (sheet && sheet.open) {
      sheet.close();
    }
    renderPortfolio(currentLang, lastT);
  });

  if (track) {
    track.addEventListener('mouseenter', () => {
      isPortfolioTrackHovered = true;
      clearInterval(portfolioAutoRotateTimer);
    });

    track.addEventListener('mouseleave', () => {
      isPortfolioTrackHovered = false;
      startPortfolioAutoRotate();
    });

    // Keyboard users get the same pause as hover: the deck never moves
    // while focus is on one of its cards.
    track.addEventListener('focusin', () => {
      isPortfolioFocusWithin = true;
      clearInterval(portfolioAutoRotateTimer);
    });

    track.addEventListener('focusout', (event) => {
      if (event.relatedTarget && track.contains(event.relatedTarget)) {
        return;
      }
      isPortfolioFocusWithin = false;
      startPortfolioAutoRotate();
    });
  }

  const pauseBtn = document.getElementById('portfolioNavPause');
  if (pauseBtn) {
    // Nothing rotates under reduced motion, so there is nothing to pause.
    pauseBtn.hidden = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    pauseBtn.addEventListener('click', () => {
      isPortfolioRotationPaused = !isPortfolioRotationPaused;
      pauseBtn.setAttribute('aria-pressed', String(isPortfolioRotationPaused));
      if (isPortfolioRotationPaused) {
        clearInterval(portfolioAutoRotateTimer);
      } else {
        startPortfolioAutoRotate();
      }
    });
  }

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target && event.target.dataset && event.target.dataset.closePortfolioDetail === 'true') {
        closePortfolioDetails();
      }
    });

    // Keep Tab inside the open dialog (it is aria-modal).
    modal.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab' || modal.getAttribute('aria-hidden') !== 'false') {
        return;
      }
      const focusables = Array.from(
        modal.querySelectorAll('a[href]:not([hidden]), button:not([disabled]):not([hidden])'),
      );
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
