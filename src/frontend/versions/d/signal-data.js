// Example data for the Version D stage ("Illustrative example" on the page).
//
// This is NOT data from a client or a case study. The spindle torque stream is
// the same schematic trace Version A's hero figure draws (one reading leaves
// its expected range); temperature and power draw are generated from a fixed
// seed so every visit shows the same picture. Values are unitless 0..1.

// Version A hero figure, SVG user units (viewBox 0 24 520 172): x along the
// time axis, y downwards. 52 readings; reading 36 is the excursion.
const TORQUE_POINTS = [
  [6, 115], [16, 136.8], [25.9, 126.8], [35.9, 126.9], [45.8, 137.7], [55.8, 133.2], [65.8, 127.7],
  [75.7, 134.3], [85.7, 132.3], [95.6, 126.3], [105.6, 127.8], [115.6, 126.3], [125.5, 130],
  [135.5, 119.1], [145.5, 122.4], [155.4, 129.7], [165.4, 129.4], [175.3, 115.7], [185.3, 126.5],
  [195.3, 119.4], [205.2, 125], [215.2, 118.8], [225.1, 101.2], [235.1, 105.5], [245.1, 111.1],
  [255, 104.7], [265, 103.2], [274.9, 102.4], [284.9, 110.3], [294.9, 111.8], [304.8, 102.7],
  [314.8, 103.2], [324.7, 114], [334.7, 103.9], [344.7, 99.7], [354.6, 85.7], [364.6, 44.7],
  [374.5, 95], [384.5, 112.8], [394.5, 106.1], [404.4, 111.4], [414.4, 117.3], [424.4, 104.5],
  [434.3, 112.8], [444.3, 122.5], [454.2, 125], [464.2, 125.9], [474.2, 122.9], [484.1, 137.9],
  [494.1, 120.4], [504, 125.7], [514, 124],
];

// Expected range of the same figure: upper and lower edge every 8 units.
const BAND_X = [6, 14, 22, 30, 38, 46, 54, 62, 70, 78, 86, 94, 102, 110, 118, 126, 134, 142, 150, 158, 166, 174, 182, 190, 198, 206, 214, 222, 230, 238, 246, 254, 262, 270, 278, 286, 294, 302, 310, 318, 326, 334, 342, 350, 358, 366, 374, 382, 390, 398, 406, 414, 422, 430, 438, 446, 454, 462, 470, 478, 486, 494, 502, 510, 514];
const BAND_UPPER = [103, 105.8, 108.1, 109.8, 110.9, 111.2, 110.8, 109.8, 108.4, 106.8, 105.1, 103.7, 102.5, 101.8, 101.6, 101.7, 102.1, 102.7, 103.3, 103.6, 103.5, 102.8, 101.5, 99.6, 97.2, 94.3, 91.1, 88, 85, 82.4, 80.4, 79.1, 78.4, 78.5, 79.1, 80.2, 81.5, 82.8, 84, 84.8, 85.3, 85.3, 84.9, 84.2, 83.4, 82.6, 82, 81.9, 82.4, 83.5, 85.3, 87.6, 90.5, 93.6, 96.9, 100, 102.7, 104.9, 106.5, 107.4, 107.7, 107.4, 106.6, 105.6, 105.1];
const BAND_LOWER = [147, 149.8, 152.1, 153.8, 154.9, 155.2, 154.8, 153.8, 152.4, 150.8, 149.1, 147.7, 146.5, 145.8, 145.6, 145.7, 146.1, 146.7, 147.3, 147.6, 147.5, 146.8, 145.5, 143.6, 141.2, 138.3, 135.1, 132, 129, 126.4, 124.4, 123.1, 122.4, 122.5, 123.1, 124.2, 125.5, 126.8, 128, 128.8, 129.3, 129.3, 128.9, 128.2, 127.4, 126.6, 126, 125.9, 126.4, 127.5, 129.3, 131.6, 134.5, 137.6, 140.9, 144, 146.7, 148.9, 150.5, 151.4, 151.7, 151.4, 150.6, 149.6, 149.1];

const X0 = 6;
const X1 = 514;
// SVG y -> value (0 bottom, 1 top), leaving headroom above the excursion.
const toValue = (y) => (176 - y) / 140;

const interpolate = (xs, ys, x) => {
  if (x <= xs[0]) return ys[0];
  for (let i = 1; i < xs.length; i += 1) {
    if (x <= xs[i]) {
      const f = (x - xs[i - 1]) / (xs[i] - xs[i - 1]);
      return ys[i - 1] + (ys[i] - ys[i - 1]) * f;
    }
  }
  return ys[ys.length - 1];
};

// Small deterministic PRNG (mulberry32), so the picture never changes.
export function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const makeStream = (key, t, v, lo, hi) => {
  const outside = [];
  v.forEach((value, i) => {
    if (value > hi[i] || value < lo[i]) outside.push(i);
  });
  return { key, n: t.length, t, v, lo, hi, outside };
};

// A companion stream: a slow trend, readings scattered around it, and an
// expected range wide enough that every reading stays inside it.
const companion = (key, t, rand, trend, spread, tolerance) => {
  const base = t.map(trend);
  const v = base.map((b) => b + (rand() * 2 - 1) * spread);
  const lo = base.map((b) => b - tolerance);
  const hi = base.map((b) => b + tolerance);
  return makeStream(key, t, v, lo, hi);
};

// Three streams on one shared time axis: torque first (it carries the
// finding), then temperature and power draw.
export function buildStreams() {
  const t = TORQUE_POINTS.map(([x]) => (x - X0) / (X1 - X0));
  const torque = makeStream(
    'torque',
    t,
    TORQUE_POINTS.map(([, y]) => toValue(y)),
    TORQUE_POINTS.map(([x]) => toValue(interpolate(BAND_X, BAND_LOWER, x))),
    TORQUE_POINTS.map(([x]) => toValue(interpolate(BAND_X, BAND_UPPER, x))),
  );

  const rand = seeded(20261117);
  const temperature = companion(
    'temperature',
    t,
    rand,
    (x) => 0.46 + 0.13 * Math.sin(Math.PI * 2 * (x * 0.85 + 0.08)) + 0.08 * x,
    0.075,
    0.17,
  );
  const power = companion(
    'power',
    t,
    rand,
    (x) => 0.5 + 0.1 * Math.sin(Math.PI * 2 * (x * 1.7 + 0.35)) - 0.04 * x,
    0.08,
    0.18,
  );

  return [torque, temperature, power];
}
