// Version A's portfolio: the SAME deck-carousel mechanic as the original build
// (DESIGN.md marks this component's structure protected — filters, 3D card
// deck, auto-rotate, detail modal), adapted only to pull its data and labels
// from the shared content module instead of a locally embedded copy, and to
// subscribe to the shared language controller instead of exporting its own
// setPortfolioLanguage(). No layout, interaction or visual-structure change.

import {
  portfolioProjects,
  portfolioCategoryLabels,
  portfolioStatusLabels,
  getLabel,
} from '../../shared/content.js';

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

  const kind = project.kind[lang] || project.kind.en;
  const stage = getLabel(portfolioStatusLabels, project.status, lang);
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

  const categoryLabels = project.categories.map((categoryId) => getLabel(portfolioCategoryLabels, categoryId, lang));
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
  const industryCount = new Set(portfolioProjects.map((project) => project.kind.en)).size;
  const repoCount = portfolioProjects.filter((project) => project.githubUrl).length;

  const stats = [
    { value: projectCount, label: t('portfolio.statLabelProjects') },
    { value: industryCount, label: t('portfolio.statLabelIndustries') },
    { value: repoCount, label: t('portfolio.statLabelRepos') },
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

const updatePortfolioClearAllButton = (t) => {
  const btn = document.getElementById('portfolioClearFilters');
  if (!btn) {
    return;
  }
  const hasActiveFilters = activePortfolioStatusFilters.size > 0 || activePortfolioCategoryFilters.size > 0;
  btn.textContent = t('portfolio.clearAllFilters');
  btn.disabled = !hasActiveFilters;
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
  dotsHost.innerHTML = '';

  const labelTemplate = t('portfolio.navDotLabel') || 'Go to project {n}';
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

let lastT = (key) => key;

const renderPortfolio = (lang, t, options = {}) => {
  lastT = t;
  const { animateIn = false } = options;
  const track = document.getElementById('portfolioTrack');
  if (!track) {
    return;
  }

  syncPortfolioDeckTarget();

  renderPortfolioStats(lang, t);
  renderPortfolioFilters(lang, t);
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

    const kind = project.kind[lang] || project.kind.en;
    const stage = getLabel(portfolioStatusLabels, project.status, lang);
    const title = project.title[lang] || project.title.en;
    const description = project.description[lang] || project.description.en;
    const categoryLabels = project.categories.map((categoryId) => getLabel(portfolioCategoryLabels, categoryId, lang));
    const categories = categoryLabels.join(' • ');
    const expandLabel = t('portfolio.expand');
    const githubLabel = t('portfolio.githubLabel');
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
      <div class="portfolio-meta" aria-label="${t('portfolio.metaPrefix')}: ${categories}">
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

  cards.forEach((card, index) => {
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
