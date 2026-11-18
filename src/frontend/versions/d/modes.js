// "Same data, different questions": the story's 52 spindle-torque readings in
// four views. The trend is a least-squares fit and the groups are k-means on
// the synthetic example data; the forecast range width, the limit and the
// class boundary are chosen for illustration (no trained or validated model,
// and the page caption says so). Switching a view moves the same points with
// a CSS transition, so it reads as one analytical system answering four questions.

import { buildStreams } from './signal-data.js';

const SVG = 'http://www.w3.org/2000/svg';
const L = 48;
const R = 584;
const T = 24;
const B = 296;
const X = (u) => L + u * (R - L);
const Y = (u) => B - u * (B - T);
const unit = (v, lo, hi) => Math.min(1, Math.max(0, (v - lo) / (hi - lo)));
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const pts = (list) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L');

export function initModes(root) {
  const [torque, temperature] = buildStreams();
  const n = torque.n;
  const flagged = torque.outside[0];
  const normal = [...Array(n).keys()].filter((i) => i !== flagged);
  const q = (sel) => root.querySelector(sel);
  const attrs = (el, a) => Object.entries(a).forEach(([k, v]) => el.setAttribute(k, typeof v === 'number' ? v.toFixed(1) : v));
  const tv = (v) => unit(v, 0.1, 1);

  // Detect: time against torque, with the expected range.
  const detect = torque.t.map((t, i) => [X(t), Y(tv(torque.v[i]))]);
  const upper = torque.t.map((t, i) => [X(t), Y(tv(torque.hi[i]))]);
  const lower = torque.t.map((t, i) => [X(t), Y(tv(torque.lo[i]))]).reverse();
  attrs(q('.modes__band'), { d: `M${pts(upper)} L${pts(lower)} Z` });

  // Forecast: history on the left 64%, a least-squares trend (the flagged
  // reading left out) carried forward with a widening range, and the point
  // where it reaches an illustrative limit.
  const H = 0.64;
  const tEnd = 1 / H;
  const forecast = torque.t.map((t, i) => [X(t * H), Y(tv(torque.v[i]))]);
  const mt = mean(normal.map((i) => torque.t[i]));
  const mv = mean(normal.map((i) => torque.v[i]));
  const slope = normal.reduce((s, i) => s + (torque.t[i] - mt) * (torque.v[i] - mv), 0)
    / normal.reduce((s, i) => s + (torque.t[i] - mt) ** 2, 0);
  const trend = (t) => mv + slope * (t - mt);
  const sd = Math.sqrt(mean(normal.map((i) => (torque.v[i] - trend(torque.t[i])) ** 2)));
  const at = (t, k = 0) => [X(t * H), Y(tv(trend(t) + k * sd * (1.2 + 2.4 * (t - 1))))];
  attrs(q('.modes__fit'), { x1: X(0), y1: Y(tv(trend(0))), x2: X(H), y2: Y(tv(trend(1))) });
  attrs(q('.modes__fit--ahead'), { x1: X(H), y1: Y(tv(trend(1))), x2: X(1), y2: Y(tv(trend(tEnd))) });
  const steps = Array.from({ length: 13 }, (_, k) => 1 + (k / 12) * (tEnd - 1));
  attrs(q('.modes__cone'), { d: `M${pts(steps.map((t) => at(t, 1)))} L${pts(steps.reverse().map((t) => at(t, -1)))} Z` });
  const tCross = 1 + 0.62 * (tEnd - 1);
  const limitY = Y(tv(trend(tCross)));
  attrs(q('.modes__limit'), { x1: X(0), y1: limitY, x2: X(1), y2: limitY });
  // By the right edge the projection has passed the limit: sit the label above
  // whichever is higher there, so the dashed line never runs through it.
  attrs(q('.modes__label--limit'), { x: X(1), y: Math.min(limitY, Y(tv(trend(tEnd)))) - 8 });
  attrs(q('.modes__cross'), { cx: X(tCross * H), cy: limitY });
  attrs(q('.modes__now'), { x1: X(H), y1: T, x2: X(H), y2: B });
  attrs(q('.modes__label--now'), { x: X(H) + 6, y: B - 6 });

  // Group and classify: torque against temperature. The flagged reading sits
  // far out on its own in this view too.
  const gx = (v) => 0.02 + 0.9 * unit(v, 0.22, 0.7);
  const gy = (v) => 0.07 + 0.86 * unit(v, 0.3, 0.7);
  const ux = torque.v.map(gx);
  const uy = temperature.v.map(gy);
  const scatter = ux.map((u, i) => [X(u), Y(uy[i])]);

  // k-means, k = 3, on the normal readings (deterministic start: spread by x).
  const byX = [...normal].sort((a, b) => scatter[a][0] - scatter[b][0]);
  let centres = [1 / 6, 1 / 2, 5 / 6].map((f) => scatter[byX[Math.floor(f * byX.length)]]);
  const cluster = new Array(n).fill(-1);
  for (let round = 0; round < 12; round += 1) {
    normal.forEach((i) => {
      const [x, y] = scatter[i];
      let best = 0;
      centres.forEach(([cx, cy], k) => {
        if (Math.hypot(x - cx, y - cy) < Math.hypot(x - centres[best][0], y - centres[best][1])) best = k;
      });
      cluster[i] = best;
    });
    centres = centres.map((c, k) => {
      const members = normal.filter((i) => cluster[i] === k);
      return members.length ? [mean(members.map((i) => scatter[i][0])), mean(members.map((i) => scatter[i][1]))] : c;
    });
  }
  const hulls = q('.modes__hulls');
  centres.forEach(([cx, cy], k) => {
    const members = normal.filter((i) => cluster[i] === k);
    const e = document.createElementNS(SVG, 'ellipse');
    // Sized from each group's spread (not its furthest member), so the three
    // outlines read as groups instead of overlapping into one shape.
    const spread = (axis, centre) => Math.sqrt(mean(members.map((i) => (scatter[i][axis] - centre) ** 2)));
    attrs(e, { cx, cy, rx: 1.7 * spread(0, cx) + 10, ry: 1.7 * spread(1, cy) + 10 });
    hulls.appendChild(e);
  });

  // Classify: a straight boundary on the two features; the seven highest
  // scores (the flagged reading among them) fall on the "watch" side.
  const W = 0.35;
  const score = ux.map((u, i) => u + W * uy[i]);
  const ranked = [...score].sort((a, b) => b - a);
  const c = (ranked[6] + ranked[7]) / 2;
  const watch = score.map((s) => s > c);
  attrs(q('.modes__boundary'), { x1: X(c - W * 0), y1: Y(0), x2: X(c - W), y2: Y(1) });
  attrs(q('.modes__watch-side'), { d: `M${X(c)},${Y(0)} L${X(1)},${Y(0)} L${X(1)},${Y(1)} L${X(c - W)},${Y(1)} Z` });
  // Class names sit along the bottom, clear of the axis label at the top.
  attrs(q('.modes__label--normal'), { x: X(0.02), y: Y(0.03) });
  attrs(q('.modes__label--watch'), { x: X(1), y: Y(0.03) });

  // The readings themselves.
  const views = { detect, forecast, group: scatter, classify: scatter };
  const layer = q('.modes__points');
  const dots = torque.t.map((_, i) => {
    const dot = document.createElementNS(SVG, 'circle');
    dot.setAttribute('r', i === flagged ? '5' : '3.5');
    dot.setAttribute('class', i === flagged ? 'modes__pt modes__pt--flag' : 'modes__pt');
    if (cluster[i] >= 0) dot.dataset.cluster = String(cluster[i]);
    dot.dataset.class = watch[i] ? 'watch' : 'normal';
    dot.style.transitionDelay = `${Math.round((i / n) * 160)}ms`;
    layer.appendChild(dot);
    return dot;
  });
  const ring = q('.modes__ring');

  const buttons = [...root.querySelectorAll('.modes__tab')];
  const copies = [...root.querySelectorAll('.modes__copy')];
  const show = (mode) => {
    root.dataset.mode = mode;
    dots.forEach((dot, i) => {
      const [x, y] = views[mode][i];
      dot.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });
    const [fx, fy] = views[mode][flagged];
    ring.style.transform = `translate(${fx.toFixed(1)}px, ${fy.toFixed(1)}px)`;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    copies.forEach((el) => { el.hidden = el.dataset.copy !== mode; });
  };

  buttons.forEach((b) => b.addEventListener('click', () => show(b.dataset.mode)));
  show('detect');
  // Transitions only after the first placement, so nothing flies in on load.
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-ready')));
}
