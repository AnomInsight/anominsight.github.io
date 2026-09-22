// Motion helpers shared by the alternative design directions.
//
// Two rules hold across both: content is visible by default and motion is
// added on top (a JS failure or an unsupported browser degrades to a static
// page, never a blank one), and every helper here checks reduced-motion at
// call time rather than at load, so a mid-session system change is respected.

const reducedMotionQuery = () => window.matchMedia('(prefers-reduced-motion: reduce)');

export const prefersReducedMotion = () => reducedMotionQuery().matches;

// Fires once per element, the first time it enters the viewport. Without
// IntersectionObserver support the callback runs immediately for every
// element, so whatever state it sets is still reached.
export function observeOnce(elements, onEnter, options = {}) {
  const targets = Array.from(elements);
  if (!targets.length) {
    return () => {};
  }

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => onEnter(el));
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        observer.unobserve(entry.target);
        onEnter(entry.target);
      });
    },
    { threshold: options.threshold ?? 0.15, rootMargin: options.rootMargin ?? '0px 0px -8% 0px' },
  );

  targets.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}

// Note: there is deliberately no count-up helper here. Animating a measured
// result from zero renders figures that were never true, which neither
// direction is willing to do with real audit numbers.
