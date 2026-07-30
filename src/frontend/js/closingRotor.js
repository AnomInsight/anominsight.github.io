// Scroll-driven sticky 3D "closing rotor" for the roadmap/final-cta/contact panels.
// Split out of script01.js for maintainability.

export function initClosingRotor(isReload) {
  const shell = document.getElementById('closingRotorShell');
  const panels = Array.from(document.querySelectorAll('.closing-panel'));

  if (!shell || panels.length !== 3) {
    return;
  }

  let targetProgress = 0;
  let currentProgress = 0;
  let animatorId = null;

  const applyStaticLayout = () => {
    panels.forEach((panel) => {
      panel.style.transform = 'none';
      panel.style.zIndex = '1';
      panel.style.pointerEvents = 'auto';
      panel.removeAttribute('aria-hidden');
    });
  };

  const render = (progress) => {
    const activeFloat = progress * (panels.length - 1);

    panels.forEach((panel, index) => {
      const delta = index - activeFloat;
      const absDelta = Math.abs(delta);

      const translateY = Math.round(delta * 128);
      const rotateX = (delta * 14).toFixed(2);
      const scale = Math.max(0.84, 1 - absDelta * 0.1).toFixed(3);

      panel.style.transform = `translateY(${translateY}px) rotateX(${rotateX}deg) scale(${scale})`;
      panel.style.zIndex = String(60 - Math.round(absDelta * 10));
      panel.style.pointerEvents = absDelta < 0.5 ? 'auto' : 'none';

      if (absDelta < 0.5) {
        panel.removeAttribute('aria-hidden');
      } else {
        panel.setAttribute('aria-hidden', 'true');
      }
    });
  };

  const readTargetFromScroll = () => {
    const rect = shell.getBoundingClientRect();
    const maxTravel = Math.max(1, shell.offsetHeight - window.innerHeight);
    const progressRaw = (-rect.top) / maxTravel;
    targetProgress = Math.max(0, Math.min(1, progressRaw));
  };

  const animateToTarget = () => {
    const compactMode = window.matchMedia('(max-width: 840px)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (compactMode || reducedMotion) {
      currentProgress = targetProgress;
      render(currentProgress);
      animatorId = null;
      return;
    }

    const diff = targetProgress - currentProgress;
    currentProgress += diff * 0.2;

    if (Math.abs(diff) < 0.0015) {
      currentProgress = targetProgress;
    }

    render(currentProgress);

    if (Math.abs(targetProgress - currentProgress) > 0.0009) {
      animatorId = window.requestAnimationFrame(animateToTarget);
    } else {
      animatorId = null;
    }
  };

  const update = () => {
    readTargetFromScroll();

    const compactMode = window.matchMedia('(max-width: 840px)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (compactMode || reducedMotion) {
      applyStaticLayout();
      return;
    }

    if (animatorId === null) {
      animatorId = window.requestAnimationFrame(animateToTarget);
    }
  };

  const requestUpdate = () => {
    update();
  };

  const scrollToRotorPanel = (index) => {
    const compactMode = window.matchMedia('(max-width: 840px)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (compactMode || reducedMotion) {
      return;
    }

    const maxTravel = Math.max(1, shell.offsetHeight - window.innerHeight);
    const normalized = Math.max(0, Math.min(1, index / (panels.length - 1)));
    const targetY = Math.round(window.scrollY + shell.getBoundingClientRect().top + normalized * maxTravel);
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const handleHashNavigation = () => {
    const hash = window.location.hash;
    if (hash === '#final-cta') {
      scrollToRotorPanel(1);
    } else if (hash === '#contact') {
      scrollToRotorPanel(2);
    } else if (hash === '#roadmap') {
      scrollToRotorPanel(0);
    }
  };

  update();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  window.addEventListener('hashchange', handleHashNavigation);

  if (window.location.hash && !isReload) {
    window.setTimeout(handleHashNavigation, 80);
  }
}
