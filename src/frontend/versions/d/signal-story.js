// Version D signature: "Finding Signal in Noise".
//
// One Canvas 2D renderer draws the illustration in five states (s = 0..4):
//   0  the noise: readings scattered across the stage, drifting slowly
//   1  ingest: every reading sorted onto its stream's lane (three lanes)
//   2  discovery: expected ranges drawn, normal readings recede, one torque
//      reading outside its range is flagged in gold
//   3  insight: the torque stream becomes the chart of a small panel
//   4  action: the decision card (HTML overlay) resolves the alert
//
// Wide screens (>= 60em): the stage is sticky beside the text and s follows
// the scrollbar, so scrolling back runs the story backwards. Narrow screens
// get no pinned stage: the hero shows the noise as a band, and every step
// gets its own small frame that plays its one transition when it comes into
// view. Reduced motion: discrete states, no drift, no scrub. Without script
// the stage shows its static poster (index.html) and the steps read alone.
//
// Performance: one context per visible frame, pixel ratio capped at 1.5
// (1 on low-power devices), drawing only while something changes; the only
// continuous loop is the hero drift, which stops off screen, in a hidden tab,
// when paused, and by itself once the signal has been found (s >= 1.6).

import { buildStreams, seeded } from './signal-data.js';

const TAU = Math.PI * 2;
const clamp = (v, lo = 0, hi = 1) => (v < lo ? lo : v > hi ? hi : v);
const lerp = (a, b, t) => a + (b - a) * t;
const range = (v, a, b) => clamp((v - a) / (b - a));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2);
const easeOut = (t) => 1 - (1 - t) ** 3;
const lerpRect = (a, b, t) => ({
  x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t),
});

const wideQuery = window.matchMedia('(min-width: 60em)');
const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

// Drift fades as structure appears: full in the hero, a little life left in
// the lanes, none once the signal is found.
const driftAmount = (s) => (s < 1 ? lerp(1, 0.25, s) : 0.25 * (1 - range(s, 1, 1.6)));

// Colours come from the CSS tokens, so the canvas follows the design system.
function readPalette() {
  const css = getComputedStyle(document.documentElement);
  const rgb = (name) => {
    const hex = css.getPropertyValue(name).trim();
    const n = /^#[0-9a-f]{6}$/i.test(hex) ? parseInt(hex.slice(1), 16) : 0x808080;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  return {
    noise: rgb('--data-noise'),
    series: rgb('--data-series'),
    steel: rgb('--data-steel'),
    goldHi: rgb('--gold-hi'),
    goldLo: rgb('--gold-lo'),
    line: rgb('--line-strong'),
  };
}

const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;
const mixColour = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)].map(Math.round);

function initialTier() {
  const conn = navigator.connection;
  if (conn && conn.saveData) return 'low';
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return 'low';
  if (navigator.deviceMemory && navigator.deviceMemory <= 2) return 'low';
  return 'full';
}

// ---------------------------------------------------------------- renderer

class Scene {
  // kind: 'stage' (wide, sticky), 'band' (narrow hero), 'frame' (narrow step
  // frame with lanes) or 'chart' (narrow step 3: the canvas is the chart).
  constructor(canvas, { kind, streams, palette, tier, seed, insets, getChartRect }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.kind = kind;
    this.streams = streams;
    this.palette = palette;
    this.tier = tier;
    this.seed = seed;
    this.insets = insets;
    this.getChartRect = getChartRect || null;
    this.w = 0;
    this.h = 0;
    this.dpr = 1;
    this.clock = 0;
    this.arrivalStart = null;
    this.anomaly = { x: 0, y: 0 };
    this.total = streams.reduce((n, st) => n + st.n, 0);
    this.px = new Float32Array(this.total);
    this.py = new Float32Array(this.total);
  }

  setTier(tier) {
    this.tier = tier;
    this.w = 0;
    this.resize();
  }

  resize() {
    const box = this.canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(box.width));
    const h = Math.max(1, Math.round(box.height));
    // Pixel ratio ≤ 1.5 (1 on low power), and the full-width stage stays near
    // 2.2 megapixels so a large screen does not draw five times the pixels.
    let dpr = Math.min(window.devicePixelRatio || 1, this.tier === 'low' ? 1 : 1.5);
    if (this.kind === 'stage') dpr = Math.max(Math.min(1, dpr), Math.min(dpr, Math.sqrt(2.2e6 / (w * h))));
    const sizeChanged = w !== this.w || h !== this.h || dpr !== this.dpr;
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    if (sizeChanged) {
      this.canvas.width = Math.round(w * dpr);
      this.canvas.height = Math.round(h * dpr);
    }
    this.layout();
    if (sizeChanged || !this.points) this.buildPoints();
  }

  layout() {
    const ins = this.insets(this.w, this.h);
    const plot = { x: ins.left, y: ins.top, w: Math.max(10, this.w - ins.left - ins.right), h: Math.max(10, this.h - ins.top - ins.bottom) };
    this.plot = plot;

    // The noise lives in the field: the whole hero on the wide stage (behind
    // the headline too), the plot itself everywhere else. `fade` is the
    // stretch over which the field rises from faint (behind the text) to full.
    const fx = ins.fieldLeft ?? plot.x;
    const fy = ins.fieldTop ?? plot.y;
    const fb = ins.fieldBottom ?? plot.y + plot.h;
    this.field = { x: fx, y: fy, w: plot.x + plot.w - fx, h: Math.max(10, fb - fy) };
    this.fade = ins.fade || null;

    // State 1: three equal lanes, each with a label row above its data.
    const labelH = this.kind === 'chart' ? 0 : 22;
    const gap = plot.h * 0.05;
    const laneH = (plot.h - gap * 2) / 3;
    this.labelPos = [0, 1, 2].map((i) => ({ x: plot.x, y: plot.y + i * (laneH + gap) }));
    this.k1 = [0, 1, 2].map((i) => ({ x: plot.x, y: plot.y + i * (laneH + gap) + labelH, w: plot.w, h: laneH - labelH }));

    // State 2: torque takes most of the stage; the other two step back.
    this.k2 = [
      { x: plot.x, y: plot.y + labelH, w: plot.w, h: plot.h * 0.66 - labelH },
      { x: plot.x, y: plot.y + plot.h * 0.8, w: plot.w, h: plot.h * 0.05 },
      { x: plot.x, y: plot.y + plot.h * 0.9, w: plot.w, h: plot.h * 0.05 },
    ];

    // State 3: torque is the panel's chart; the others collapse to a line.
    let chart = this.kind === 'chart' ? { ...plot } : null;
    if (!chart && this.getChartRect) {
      const r = this.getChartRect();
      if (r && r.w > 20 && r.h > 20) chart = { x: r.x + 2, y: r.y + 12, w: r.w - 4, h: r.h - 20 };
    }
    const flat = (r) => ({ x: r.x, y: r.y + r.h / 2, w: r.w, h: 0 });
    this.k3 = [chart || this.k2[0], flat(this.k2[1]), flat(this.k2[2])];
  }

  buildPoints() {
    const rand = seeded(this.seed);
    const { plot, field } = this;
    const wide = this.kind === 'stage';
    // On the wide stage the field leans right: dense on the right, thinning
    // out toward the headline (density grows with x).
    const lean = () => (wide ? rand() ** 0.62 : rand());
    this.points = [];
    this.streams.forEach((stream, lane) => {
      for (let i = 0; i < stream.n; i += 1) {
        // Scattered (in field coordinates), with a faint pull toward its own
        // lane and time: the structure is there before it is visible.
        let sx;
        if (wide) {
          const target = (plot.x + stream.t[i] * plot.w - field.x) / field.w;
          sx = clamp(lerp(lean(), target, 0.4) + (rand() - 0.5) * 0.12, 0.01, 0.99);
        } else {
          sx = clamp(stream.t[i] + (rand() + rand() + rand() - 1.5) * 0.36, 0.01, 0.99);
        }
        const sy = clamp(lerp(rand(), (lane + 0.5) / 3, wide ? 0.12 : 0.2), 0.02, 0.98);
        this.points.push({
          lane,
          i,
          sx,
          sy,
          outside: stream.outside.includes(i),
          ph1: rand() * TAU,
          ph2: rand() * TAU,
          f1: 0.22 + rand() * 0.3,
          f2: 0.3 + rand() * 0.35,
          delay: sx * 500,
        });
      }
    });

    const density = this.kind === 'stage' ? 2000 : 2600;
    const limits = this.kind === 'stage' ? [110, 300] : [24, 120];
    let count = Math.round(clamp(field.w * field.h / density, limits[0], limits[1]));
    if (this.tier === 'low') count = Math.round(count / 2);
    if (this.kind === 'chart') count = 0;
    this.noise = Array.from({ length: count }, () => ({
      sx: lean(),
      sy: rand(),
      a: 0.5 + rand() * 0.5,
      r: 1 + rand() * rand() * 1.6,
      ph1: rand() * TAU,
      ph2: rand() * TAU,
      f1: 0.18 + rand() * 0.3,
      f2: 0.25 + rand() * 0.3,
      delay: 0,
    }));
    this.noise.forEach((n) => { n.delay = n.sx * 500; });

    // Scratch buffers for one batch of dots (noise or readings).
    const size = Math.max(this.total, this.noise.length);
    this.dx = new Float32Array(size);
    this.dy = new Float32Array(size);
    this.dr = new Float32Array(size);
    this.da = new Float32Array(size);
    this.level = new Uint8Array(size);
  }

  // Dots are drawn in batches by opacity (16 levels): one path and one fill
  // per level instead of one per dot, a few fills a frame instead of hundreds.
  drawDots(count) {
    const { ctx, dx, dy, dr, da, level } = this;
    for (let i = 0; i < count; i += 1) level[i] = Math.max(1, Math.round(da[i] * 16));
    for (let l = 1; l <= 16; l += 1) {
      let open = false;
      for (let i = 0; i < count; i += 1) {
        if (level[i] !== l) continue;
        if (!open) {
          ctx.beginPath();
          open = true;
        }
        ctx.moveTo(dx[i] + dr[i], dy[i]);
        ctx.arc(dx[i], dy[i], dr[i], 0, TAU);
      }
      if (open) {
        ctx.globalAlpha = l / 16;
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  laneRect(lane, s) {
    if (s <= 1.35) return this.k1[lane];
    if (s <= 2) return lerpRect(this.k1[lane], this.k2[lane], easeInOut(range(s, 1.35, 2)));
    return lerpRect(this.k2[lane], this.k3[lane], easeInOut(range(s, 2, 2.9)));
  }

  arrival(now, delay) {
    if (this.arrivalStart === null) return 1;
    return easeOut(clamp((now - this.arrivalStart - delay) / 600));
  }

  get arriving() {
    return this.arrivalStart !== null && performance.now() - this.arrivalStart < 1150;
  }

  // flag: 0..1 progress of the flag event; drift: amplitude multiplier.
  render(s, now, flag, drift) {
    const { ctx, plot, palette: P, streams } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);

    const amp = (this.kind === 'stage' ? 6 : 4) * drift;
    const t = this.clock;
    const rects = [0, 1, 2].map((lane) => this.laneRect(lane, s));
    const ingest = range(s, 0, 1);
    const { field } = this;

    // Hero atmosphere: in the noise state the field is faint behind the
    // headline and rises to full strength toward the right; the effect hands
    // over to the plain plot as the readings sort themselves (s 0 -> 1).
    const fadeWeight = this.fade ? 1 - ingest : 0;
    const xFade = (x) => {
      if (!fadeWeight) return 1;
      const f = 0.14 + 0.86 * easeInOut(range(x, this.fade[0], this.fade[1]));
      return lerp(1, f, fadeWeight);
    };

    // Lane fade: temperature and power step back to near-hairlines, then leave.
    const laneAlpha = [1, 0, 0].map((v, lane) => (lane === 0
      ? 1
      : (1 - 0.88 * easeInOut(range(s, 1.35, 2))) * (1 - range(s, 2, 2.6))));

    // 1. Positions of every stream reading.
    let k = 0;
    for (let p = 0; p < this.points.length; p += 1) {
      const pt = this.points[p];
      const st = streams[pt.lane];
      const r = rects[pt.lane];
      let x = r.x + st.t[pt.i] * r.w;
      let y = r.y + (1 - st.v[pt.i]) * r.h;
      if (s < 1) {
        const local = easeInOut(clamp((ingest - st.t[pt.i] * 0.4) / 0.6));
        x = lerp(field.x + pt.sx * field.w, x, local);
        y = lerp(field.y + pt.sy * field.h, y, local);
      }
      if (amp) {
        x += amp * Math.sin(t * pt.f1 + pt.ph1);
        y += amp * Math.cos(t * pt.f2 + pt.ph2);
      }
      this.px[k] = x;
      this.py[k] = y;
      k += 1;
    }

    // 2. Expected ranges, drawn left to right.
    const reveal = easeInOut(range(s, 1, 1.45));
    if (reveal > 0) {
      ctx.lineWidth = 1;
      streams.forEach((st, lane) => {
        const a = laneAlpha[lane];
        if (a < 0.01) return;
        const r = rects[lane];
        let last = 0;
        while (last < st.n - 1 && st.t[last + 1] <= reveal) last += 1;
        const yOf = (v) => r.y + (1 - v) * r.h;
        ctx.beginPath();
        for (let i = 0; i <= last; i += 1) {
          const x = r.x + st.t[i] * r.w;
          if (i === 0) ctx.moveTo(x, yOf(st.hi[i])); else ctx.lineTo(x, yOf(st.hi[i]));
        }
        const xEnd = r.x + reveal * r.w;
        ctx.lineTo(xEnd, yOf(st.hi[last]));
        ctx.lineTo(xEnd, yOf(st.lo[last]));
        for (let i = last; i >= 0; i -= 1) ctx.lineTo(r.x + st.t[i] * r.w, yOf(st.lo[i]));
        ctx.closePath();
        ctx.fillStyle = rgba(P.steel, 0.12 * a);
        ctx.fill();
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = rgba(P.steel, 0.5 * a);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    }

    // 3. Time axis under the torque lane (the panel draws its own later).
    const axisA = range(s, 1.1, 1.5) * (1 - range(s, 2.4, 2.9));
    const axisY = rects[0].y + rects[0].h + 6;
    if (axisA > 0) {
      ctx.strokeStyle = rgba(P.line, axisA);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rects[0].x, axisY);
      ctx.lineTo(rects[0].x + rects[0].w, axisY);
      ctx.stroke();
    }

    // 4a. The hidden pattern: in the noise, each stream's true shape is
    // already there as a faint trace where its readings will land.
    const ghostA = 0.09 * (1 - range(s, 0.35, 0.75)) * this.arrival(now, 520);
    if (ghostA > 0.005 && this.kind !== 'chart') {
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = rgba(P.series, ghostA);
      streams.forEach((st, lane) => {
        const r = this.k1[lane];
        const shift = amp ? amp * 0.5 * Math.sin(t * 0.21 + lane * 2.1) : 0;
        ctx.beginPath();
        for (let i = 0; i < st.n; i += 1) {
          const x = r.x + st.t[i] * r.w;
          const y = r.y + (1 - st.v[i]) * r.h + shift;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
    }

    // 4b. Series lines: the pattern emerging between the readings.
    let lineA = range(s, 0.55, 1) * 0.32;
    if (s > 1) lineA = lerp(0.32, 0.22, range(s, 1, 2));
    if (s > 2) lineA = lerp(0.22, 0.6, range(s, 2.2, 3));
    if (lineA > 0) {
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';
      let base = 0;
      streams.forEach((st, lane) => {
        const a = lineA * laneAlpha[lane];
        if (a > 0.01) {
          ctx.strokeStyle = rgba(P.series, a);
          ctx.beginPath();
          for (let i = 0; i < st.n; i += 1) {
            if (i === 0) ctx.moveTo(this.px[base], this.py[base]);
            else ctx.lineTo(this.px[base + i], this.py[base + i]);
          }
          ctx.stroke();
        }
        base += st.n;
      });
    }

    // 5. Loose noise: thins as the streams form, gone before the flag.
    const noiseA = (1 - 0.6 * ingest) * (1 - range(s, 1, 1.6));
    if (noiseA > 0.01 && this.noise.length) {
      const flow = (t * 8) / field.w;
      let count = 0;
      for (const n of this.noise) {
        let nx = (n.sx + flow * drift) % 1;
        // Soft edges on all four sides: the field has no visible boundary.
        const edge = Math.min(1, nx / 0.05, (1 - nx) / 0.05, n.sy / 0.08, (1 - n.sy) / 0.08);
        nx = field.x + nx * field.w + (amp ? amp * Math.sin(t * n.f1 + n.ph1) : 0);
        // Loose noise stays faint behind the text for the whole story, not only in the hero.
        const behind = this.fade ? 0.14 + 0.86 * easeInOut(range(nx, this.fade[0], this.fade[1])) : 1;
        const a = n.a * noiseA * edge * behind * this.arrival(now, n.delay);
        if (a < 0.02) continue;
        this.dx[count] = nx;
        this.dy[count] = field.y + n.sy * field.h + (amp ? amp * Math.cos(t * n.f2 + n.ph2) : 0);
        this.dr[count] = n.r;
        this.da[count] = a;
        count += 1;
      }
      ctx.fillStyle = rgba(P.noise, 1);
      this.drawDots(count);
    }

    // 6. Stream readings.
    const toSeries = range(s, 0.3, 1);
    const colour = mixColour(P.noise, P.series, toSeries);
    const baseR = this.kind === 'stage' ? 2 : 1.7;
    let inBandA = lerp(0.75, 0.9, toSeries);
    let inBandR = baseR;
    if (s > 1) {
      inBandA = lerp(0.9, 0.4, range(s, 1.15, 1.8));
      inBandR = lerp(baseR, baseR * 0.75, range(s, 1.15, 1.8));
    }
    if (s > 2) {
      inBandA = lerp(0.4, 0.8, range(s, 2.2, 3));
      inBandR = lerp(baseR * 0.75, baseR * 0.9, range(s, 2.2, 3));
    }
    let anomalyIndex = -1;
    let count = 0;
    for (let p = 0; p < this.points.length; p += 1) {
      const pt = this.points[p];
      if (pt.outside && pt.lane === 0) {
        anomalyIndex = p;
        continue;
      }
      const a = (pt.outside ? 0.85 : inBandA) * laneAlpha[pt.lane] * xFade(this.px[p]) * this.arrival(now, pt.delay);
      if (a < 0.02) continue;
      this.dx[count] = this.px[p];
      this.dy[count] = this.py[p];
      this.dr[count] = pt.outside ? baseR : inBandR;
      this.da[count] = a;
      count += 1;
    }
    ctx.fillStyle = rgba(colour, 1);
    this.drawDots(count);

    // 7. The finding: excursion, ring, leader, and the reading itself.
    if (anomalyIndex >= 0) {
      const ax = this.px[anomalyIndex];
      const ay = this.py[anomalyIndex];
      this.anomaly = { x: ax, y: ay };
      const pColour = easeOut(range(flag, 0, 0.35));
      const pRing = easeOut(range(flag, 0, 0.6));
      const pLead = easeOut(range(flag, 0.3, 0.8));

      if (pColour > 0) {
        ctx.strokeStyle = rgba(P.goldHi, 0.9 * pColour);
        ctx.lineWidth = 1.75;
        ctx.beginPath();
        ctx.moveTo(this.px[anomalyIndex - 1], this.py[anomalyIndex - 1]);
        ctx.lineTo(ax, ay);
        ctx.lineTo(this.px[anomalyIndex + 1], this.py[anomalyIndex + 1]);
        ctx.stroke();
      }

      const ringR = (this.kind === 'stage' ? 11 : 9) * lerp(1.6, 1, pRing);
      if (pLead > 0) {
        const y0 = ay + ringR + 3;
        const y1 = lerp(y0, Math.max(y0, axisY), pLead);
        ctx.strokeStyle = rgba(P.goldHi, 0.5 * pLead);
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(ax, y0);
        ctx.lineTo(ax, y1);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      if (pRing > 0) {
        ctx.strokeStyle = rgba(P.goldLo, pRing);
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.arc(ax, ay, ringR, 0, TAU);
        ctx.stroke();
      }

      const a = lerp(0.85, 1, pColour) * xFade(ax) * this.arrival(now, this.points[anomalyIndex].delay);
      ctx.globalAlpha = a;
      ctx.fillStyle = rgba(mixColour(colour, P.goldHi, pColour), 1);
      ctx.beginPath();
      ctx.arc(ax, ay, lerp(baseR, baseR * 2.2, pColour), 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
}

// ---------------------------------------------------------- shared helpers

// The pause control for the hero drift (WCAG 2.2.2). A real button with
// aria-pressed; its label key flips so a language switch keeps it right.
function bindPause(button, t, onChange) {
  let paused = false;
  const sync = () => {
    const key = paused ? 'stage.resume' : 'stage.pause';
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('data-i18n-aria', key);
    button.setAttribute('aria-label', t(key));
  };
  const onClick = () => {
    paused = !paused;
    sync();
    onChange(paused);
  };
  button.addEventListener('click', onClick);
  sync();
  return {
    get paused() { return paused; },
    show(visible) {
      if (button.hidden === !visible) return;
      button.hidden = !visible;
    },
    destroy() {
      button.removeEventListener('click', onClick);
      button.hidden = true;
    },
  };
}

// Runs fn after the next paint, so work triggered by a click (a language
// switch re-measuring the stage) never delays the paint that answers it.
const afterPaint = (fn) => requestAnimationFrame(() => setTimeout(fn, 0));

function watchPageVisibility(onChange) {
  const handler = () => onChange(document.visibilityState === 'visible');
  document.addEventListener('visibilitychange', handler);
  return () => document.removeEventListener('visibilitychange', handler);
}

// Watches what one drift frame costs to draw and steps down if the device is
// slow: first to pixel ratio 1 and half the noise, then to a still field.
function createGovernor(scene, onStill) {
  let samples = [];
  let stepped = scene.tier === 'low' ? 1 : 0;
  return (cost) => {
    samples.push(cost);
    if (samples.length < 40) return;
    const avg = samples.slice(5).reduce((a, b) => a + b, 0) / (samples.length - 5);
    samples = [];
    if (avg <= 8) return;
    if (stepped === 0) {
      stepped = 1;
      scene.setTier('low');
    } else if (stepped === 1) {
      stepped = 2;
      onStill();
    }
  };
}

// ------------------------------------------------------- wide: sticky stage

function initWide(root, shared) {
  const stage = root.querySelector('[data-stage]');
  const frame = stage.querySelector('.stage__frame');
  const canvas = stage.querySelector('.stage__canvas');
  const caption = stage.querySelector('.stage__caption');
  const decisionCard = stage.querySelector('[data-decision]');
  const pauseButton = stage.querySelector('.stage__pause');
  const laneLabels = [...stage.querySelectorAll('.stage__lane-label')];
  const flagLabel = stage.querySelector('.stage__flag-label');
  const panel = stage.querySelector('[data-stage-panel]');
  const slot = panel.querySelector('[data-chart-slot]');
  const story = root.querySelector('.story');
  const anchors = [...root.querySelectorAll('[data-state]')].map((el) => ({
    el, state: Number(el.dataset.state), centre: 0, isStep: el.classList.contains('step'),
  }));
  const reduced = reducedQuery.matches;

  const scene = new Scene(canvas, {
    kind: 'stage',
    streams: shared.streams,
    palette: shared.palette,
    tier: shared.tier,
    seed: 7,
    // The stage spans the full width behind the text. The plot (lanes, panel,
    // decision) starts where CSS puts --plot-left, read here from the caption;
    // the right edge matches the decision card's. The noise field covers the
    // whole hero and fades in from behind the headline toward the plot.
    insets: (w) => {
      const left = caption.offsetLeft || Math.round(w * 0.45);
      const right = Math.max(24, w - (decisionCard.offsetLeft + decisionCard.offsetWidth)) || 48;
      return {
        top: 76,
        right,
        bottom: 56,
        left,
        fieldLeft: 24,
        fieldTop: 24,
        fade: [left - w * 0.16, left + (w - left) * 0.38],
      };
    },
    // offsetTop/Left ignore the panel's entrance transform: the final box.
    getChartRect: () => ({
      x: panel.offsetLeft + slot.offsetLeft,
      y: panel.offsetTop + slot.offsetTop,
      w: slot.offsetWidth,
      h: slot.offsetHeight,
    }),
  });

  let sTarget = 0;
  let sDisp = 0;
  let flagP = 0;
  let flagOn = false;
  let visible = true;
  let pageVisible = document.visibilityState === 'visible';
  let still = reduced;
  let live = false;
  let raf = 0;
  let last = 0;
  let flagW = 0;
  let activeStep = null;
  const states = { story: false, lanes: false, flag: false, panel: false, decision: false };

  const pause = bindPause(pauseButton, shared.t, () => request());
  const governor = createGovernor(scene, () => { still = true; pause.show(false); });

  const targetFromScroll = () => {
    const line = window.scrollY + window.innerHeight * 0.5;
    if (reduced) {
      // Discrete: the state of the block nearest the reading line.
      let best = anchors[0];
      anchors.forEach((a) => { if (Math.abs(a.centre - line) < Math.abs(best.centre - line)) best = a; });
      return best.state;
    }
    if (line <= anchors[0].centre) return anchors[0].state;
    for (let i = 1; i < anchors.length; i += 1) {
      if (line < anchors[i].centre) {
        const a = anchors[i - 1];
        const b = anchors[i];
        return lerp(a.state, b.state, (line - a.centre) / (b.centre - a.centre));
      }
    }
    return anchors[anchors.length - 1].state;
  };

  const updateActiveStep = () => {
    const line = window.scrollY + window.innerHeight * 0.5;
    let best = null;
    anchors.forEach((a) => {
      if (!a.isStep) return;
      const top = a.centre - a.el.offsetHeight / 2;
      const bottom = a.centre + a.el.offsetHeight / 2;
      if (line >= top && line < bottom) best = a.el;
    });
    if (best !== activeStep) {
      activeStep?.classList.remove('is-active');
      best?.classList.add('is-active');
      activeStep = best;
    }
  };

  // Overlay states, each with a little hysteresis so they never flicker.
  const setState = (name, on) => {
    if (states[name] === on) return;
    states[name] = on;
    stage.dataset[name] = on ? 'on' : 'off';
  };

  const updateStates = (s) => {
    // "story": the field has started to become an example; the label and
    // grid come up (hidden in the hero, which is atmosphere only).
    setState('story', states.story ? s >= 0.45 : s >= 0.55);
    setState('lanes', states.lanes ? s >= 0.65 && s < 1.5 : s >= 0.7 && s < 1.45);
    flagOn = flagOn ? s >= 1.5 : s >= 1.6;
    setState('flag', flagOn);
    setState('panel', states.panel ? s >= 2.45 : s >= 2.55);
    setState('decision', states.decision ? s >= 3.45 : s >= 3.55);
    if (!reduced && !still) pause.show(s < 1.95);
  };

  const placeFlagLabel = () => {
    if (!states.flag || states.panel) return;
    const { x, y } = scene.anomaly;
    let lx = x + 18;
    if (lx + flagW > scene.w - 12) lx = x - 18 - flagW;
    flagLabel.style.transform = `translate(${Math.round(lx)}px, ${Math.round(y - 10)}px)`;
  };

  const driftOn = () => !reduced && !still && !pause.paused && visible && pageVisible && driftAmount(sDisp) > 0;

  const tick = (now) => {
    raf = 0;
    // When only the drift is moving (no scrolling, no flag, no arrival), 30
    // frames a second is plenty; scrubbing always gets every frame.
    const settled = sDisp === sTarget && flagP === (flagOn ? 1 : 0) && !scene.arriving;
    if (settled && live && last && now - last < 30) {
      request();
      return;
    }
    const dt = last ? Math.min(64, now - last) : 16;
    last = now;

    if (reduced) {
      sDisp = sTarget;
    } else {
      sDisp += (sTarget - sDisp) * (1 - Math.exp(-dt / 90));
      if (Math.abs(sTarget - sDisp) < 0.0005) sDisp = sTarget;
    }
    updateStates(sDisp);

    const flagTarget = flagOn ? 1 : 0;
    if (reduced) flagP = flagTarget;
    else if (flagP < flagTarget) flagP = Math.min(1, flagP + dt / 700);
    else if (flagP > flagTarget) flagP = Math.max(0, flagP - dt / 250);

    const drifting = driftOn();
    if (drifting) scene.clock += dt / 1000;
    const t0 = performance.now();
    scene.render(sDisp, now, flagP, reduced ? 0 : driftAmount(sDisp));
    if (drifting) governor(performance.now() - t0);
    placeFlagLabel();

    if (!live) {
      live = true;
      stage.classList.add('is-live');
    }

    const busy = sDisp !== sTarget || flagP !== flagTarget || scene.arriving || drifting;
    if (busy && pageVisible) request();
    else last = 0;
  };

  function request() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  const onScroll = () => {
    sTarget = targetFromScroll();
    updateActiveStep();
    request();
  };

  const measure = () => {
    scene.resize();
    anchors.forEach((a) => {
      const r = a.el.getBoundingClientRect();
      a.centre = r.top + window.scrollY + r.height / 2;
    });
    scene.labelPos.forEach((p, i) => {
      laneLabels[i].style.transform = `translate(${Math.round(p.x)}px, ${Math.round(p.y)}px)`;
    });
    flagW = flagLabel.offsetWidth;
    onScroll();
    sDisp = live ? sDisp : sTarget;
  };

  let measureRaf = 0;
  const scheduleMeasure = () => {
    cancelAnimationFrame(measureRaf);
    measureRaf = requestAnimationFrame(measure);
  };

  const resizeObserver = new ResizeObserver(scheduleMeasure);
  resizeObserver.observe(frame);
  resizeObserver.observe(story);

  const io = new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible) request();
  });
  io.observe(stage);

  const stopVisibility = watchPageVisibility((v) => {
    pageVisible = v;
    if (v) request();
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  document.fonts?.ready.then(scheduleMeasure);

  measure();
  // The field arrives once (the hero's entrance), unless motion is reduced
  // or the reader has already scrolled past the noise.
  if (!reduced && sTarget < 0.5) scene.arrivalStart = performance.now();
  pause.show(!reduced);
  request();

  return {
    onLanguage: () => afterPaint(scheduleMeasure),
    destroy() {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(measureRaf);
      resizeObserver.disconnect();
      io.disconnect();
      stopVisibility();
      window.removeEventListener('scroll', onScroll);
      pause.destroy();
      activeStep?.classList.remove('is-active');
      stage.classList.remove('is-live');
      ['story', 'lanes', 'flag', 'panel', 'decision'].forEach((k) => { delete stage.dataset[k]; });
    },
  };
}

// ---------------------------------------------- narrow: band + step frames

function initNarrow(root, shared) {
  const stage = root.querySelector('[data-stage]');
  const canvas = stage.querySelector('.stage__canvas');
  const pauseButton = stage.querySelector('.stage__pause');
  const reduced = reducedQuery.matches;
  const cleanups = [];
  const rafs = new Set();

  // The hero band: the noise, drifting, with its pause control.
  const band = new Scene(canvas, {
    kind: 'band',
    streams: shared.streams,
    palette: shared.palette,
    tier: shared.tier,
    seed: 7,
    insets: (w) => ({ top: 44, right: Math.min(20, w * 0.05), bottom: 16, left: Math.min(20, w * 0.05) }),
  });

  let visible = false;
  let pageVisible = document.visibilityState === 'visible';
  let still = reduced;
  let raf = 0;
  let last = 0;
  const pause = bindPause(pauseButton, shared.t, () => request());
  const governor = createGovernor(band, () => { still = true; pause.show(false); });

  const drifting = () => !still && !pause.paused && visible && pageVisible;
  const tick = (now) => {
    raf = 0;
    const on = drifting();
    // The drift is slow: 30 frames a second is plenty and halves its cost.
    if (on && !band.arriving && last && now - last < 30) {
      request();
      return;
    }
    const dt = last ? Math.min(64, now - last) : 16;
    last = now;
    if (on) band.clock += dt / 1000;
    const t0 = performance.now();
    band.render(0, now, 0, reduced ? 0 : 1);
    if (on) governor(performance.now() - t0);
    stage.classList.add('is-live');
    if ((on || band.arriving) && pageVisible) request();
    else last = 0;
  };
  function request() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  band.resize();
  const bandIO = new IntersectionObserver((entries) => {
    const was = visible;
    visible = entries.some((e) => e.isIntersecting);
    if (visible && !was && band.arrivalStart === null && !reduced && !band.played) {
      band.arrivalStart = performance.now();
      band.played = true;
    }
    if (visible) request();
  });
  bandIO.observe(stage);
  cleanups.push(() => bandIO.disconnect());
  cleanups.push(watchPageVisibility((v) => { pageVisible = v; if (v) request(); }));
  pause.show(!reduced);
  request();

  // Step frames. Each shows the state before its step until it is seen,
  // then plays once to its own state; scrolling back leaves it finished.
  const template = {
    labels: [...stage.querySelectorAll('.stage__lane-label')],
    flag: stage.querySelector('.stage__flag-label'),
    panel: stage.querySelector('[data-stage-panel]'),
    decision: stage.querySelector('[data-decision]'),
    caption: stage.querySelector('.stage__caption'),
  };
  const frames = [];

  root.querySelectorAll('.step__frame').forEach((host) => {
    const k = Number(host.dataset.frame);
    host.setAttribute('aria-hidden', 'true');
    let scene = null;
    let flagLabel = null;
    let flagW = 0;

    if (k === 1 || k === 2) {
      const box = document.createElement('div');
      box.className = 'frame-canvas';
      const c = document.createElement('canvas');
      box.appendChild(c);
      if (k === 1) template.labels.forEach((l) => box.appendChild(l.cloneNode(true)));
      if (k === 2) {
        flagLabel = template.flag.cloneNode(true);
        box.appendChild(flagLabel);
      }
      host.appendChild(box);
      scene = new Scene(c, {
        kind: 'frame', streams: shared.streams, palette: shared.palette, tier: shared.tier, seed: 11 + k,
        insets: () => ({ top: 14, right: 14, bottom: 14, left: 14 }),
      });
    } else if (k === 3) {
      const panelClone = template.panel.cloneNode(true);
      panelClone.removeAttribute('data-stage-panel');
      const slot = panelClone.querySelector('[data-chart-slot]');
      const c = document.createElement('canvas');
      c.style.position = 'absolute';
      c.style.inset = '0';
      c.style.width = '100%';
      c.style.height = '100%';
      slot.appendChild(c);
      host.appendChild(panelClone);
      scene = new Scene(c, {
        kind: 'chart', streams: shared.streams, palette: shared.palette, tier: shared.tier, seed: 14,
        insets: () => ({ top: 10, right: 4, bottom: 8, left: 4 }),
      });
    } else if (k === 4) {
      const decisionClone = template.decision.cloneNode(true);
      decisionClone.removeAttribute('data-decision');
      host.appendChild(decisionClone);
    }

    // Every frame carries the illustrative label, not only the hero band.
    const caption = template.caption.cloneNode(true);
    caption.className = 'step__frame-caption';
    host.appendChild(caption);

    const from = k - 1;
    const to = Math.min(k, 3);
    const flagFor = (s) => easeOut(range(s, 1.55, 1.95));
    const draw = (s) => {
      if (!scene) return;
      scene.render(s, performance.now(), flagFor(s), 0);
      if (flagLabel && s >= 1.95) {
        const { x, y } = scene.anomaly;
        let lx = x + 14;
        if (lx + flagW > scene.w - 8) lx = x - 14 - flagW;
        flagLabel.style.transform = `translate(${Math.round(lx)}px, ${Math.round(y - 10)}px)`;
      }
    };

    const entry = {
      host,
      played: false,
      ready: false,
      // The frame's box is in the page from the start (no layout shift);
      // its canvas is only measured and drawn once it comes near the screen.
      prepare() {
        if (this.ready) return;
        this.ready = true;
        this.layout();
      },
      layout() {
        if (!scene || !this.ready) return;
        scene.resize();
        if (k === 1) {
          host.querySelectorAll('.stage__lane-label').forEach((l, i) => {
            const p = scene.labelPos[i];
            l.style.transform = `translate(${Math.round(p.x)}px, ${Math.round(p.y)}px)`;
          });
        }
        if (flagLabel) flagW = flagLabel.offsetWidth;
        draw(this.played ? to : from);
      },
      play() {
        if (this.played) return;
        this.prepare();
        this.played = true;
        const finish = () => { draw(to); host.classList.add('is-played'); host.firstElementChild?.classList.add('is-played'); };
        if (!scene || reduced) {
          finish();
          return;
        }
        const duration = k === 1 ? 1600 : 1400;
        const start = performance.now();
        const step = (now) => {
          rafs.delete(id);
          const p = easeInOut(clamp((now - start) / duration));
          draw(lerp(from, to, p));
          if (p < 1) {
            id = requestAnimationFrame(step);
            rafs.add(id);
          } else {
            finish();
          }
        };
        let id = requestAnimationFrame(step);
        rafs.add(id);
      },
    };
    frames.push(entry);
  });

  const prepareIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      frames.find((x) => x.host === e.target)?.prepare();
      prepareIO.unobserve(e.target);
    });
  }, { rootMargin: '75% 0px' });
  frames.forEach((f) => prepareIO.observe(f.host));
  cleanups.push(() => prepareIO.disconnect());

  const frameIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const f = frames.find((x) => x.host === e.target);
      f?.play();
      frameIO.unobserve(e.target);
    });
  }, { threshold: 0.55 });
  frames.forEach((f) => frameIO.observe(f.host));
  cleanups.push(() => frameIO.disconnect());

  // Width changes only (phone toolbars change the height while scrolling).
  let lastWidth = window.innerWidth;
  let resizeRaf = 0;
  const onResize = () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      band.resize();
      request();
      frames.forEach((f) => f.layout());
    });
  };
  window.addEventListener('resize', onResize, { passive: true });
  cleanups.push(() => window.removeEventListener('resize', onResize));
  document.fonts?.ready.then(() => frames.forEach((f) => f.layout()));

  return {
    onLanguage() {
      afterPaint(() => frames.forEach((f) => f.layout()));
    },
    destroy() {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      rafs.forEach((id) => cancelAnimationFrame(id));
      cleanups.forEach((fn) => fn());
      pause.destroy();
      stage.classList.remove('is-live');
      root.querySelectorAll('.step__frame').forEach((host) => {
        host.textContent = '';
        host.classList.remove('is-played');
      });
    },
  };
}

// ------------------------------------------------------------------- entry

export function initSignalStory({ t, subscribe }) {
  const root = document.querySelector('[data-signal-story]');
  if (!root) return;
  const stage = root.querySelector('[data-stage]');
  const canvas = stage?.querySelector('.stage__canvas');
  if (!canvas || !canvas.getContext || !canvas.getContext('2d') || !('IntersectionObserver' in window) || !('ResizeObserver' in window)) {
    stage?.classList.add('stage--fallback');
    return;
  }

  const shared = { streams: buildStreams(), palette: readPalette(), tier: initialTier(), t };

  // The tiles show counts of the drawn example, read from the data itself.
  const torque = shared.streams[0];
  root.querySelectorAll('[data-reading-count]').forEach((el) => { el.textContent = String(torque.n); });
  root.querySelectorAll('[data-flag-count]').forEach((el) => { el.textContent = String(torque.outside.length); });

  let current = null;
  const start = () => {
    current?.destroy();
    current = (wideQuery.matches ? initWide : initNarrow)(root, shared);
  };
  start();
  wideQuery.addEventListener('change', start);
  reducedQuery.addEventListener('change', start);
  subscribe?.(() => current?.onLanguage?.());
}
