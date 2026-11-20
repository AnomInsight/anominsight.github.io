# AnomInsight – motion specification (Version D)

Status: **implemented** in `src/frontend/versions/d/` (2026-11-17; approved by the user the same day, with the
inspection lens removed and a simplified, non-pinned phone layout). Code: `signal-story.js` (renderer +
controllers), `signal-data.js` (illustrative data), `style.css`. Concept: `creative-direction.md`.
Tokens: `design-system.md`. Performance targets: `implementation-plan.md` §7.

---

## 1. Principles

1. **One coordinated system.** All authored motion is the signal story: one canvas renderer and one
   scroll controller drive the hero field and the four story steps. Everything else is still apart
   from hover, press, focus, the mobile menu, the protected portfolio deck and the dialog.
2. **Native scroll, never steered.** The story is a section that holds its stage with
   `position: sticky` while the page scrolls normally. No scroll-jacking, snapping or smooth-scroll
   library.
3. **Scrubbed, reversible, finished at both ends.** Positions follow the scrollbar and run backwards on
   the way up. Discrete events (the flag, panels appearing) are short time-based transitions toggled
   at thresholds, so scrubbing never leaves them half drawn.
4. **Content first.** Text is static and visible from the first paint; motion only adds. The page is
   complete without script, under reduced motion and with the stage frozen at any point.
5. **Only one continuous motion.** The hero field drifts while it is on screen; it has a pause
   control, stops off screen and in a hidden tab, and goes still once the story has found the signal.
6. **Transform, opacity and canvas draws only.** No animated layout properties; no CSS filters on
   large areas; no per-frame layout reads.

## 2. Motion tokens

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entrances, UI appearing |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | State changes that both leave and arrive |
| `--dur-press` | 90ms | Button press |
| `--dur-hover` | 160ms | Colour, border, underline |
| `--dur-ui` | 280ms | Panels, tiles, labels appearing |
| `--dur-flag` | 420ms | Ring contracting onto the anomaly |
| `--dur-scan` | 800ms | One-time scan (services page header) |
| Scrub smoothing | exponential, τ ≈ 90ms | Story progress follows the scrollbar without wheel-step jitter |
| Canvas per-point easing | ease-in-out cubic on a staggered local progress | Ingest and focus transitions |

## 3. The scroll model

- The homepage wraps the hero and the "How it works" story in one `.signal-story` grid. The stage is a
  grid item that spans every row and is `position: sticky; top: <header height>`; it is the same
  element from the first viewport to the end of step 4.
- **Anchors.** Each block in the text column carries a state number: hero `0`, chapter intro `0`,
  step 1 `1`, step 2 `2`, step 3 `3`, step 4 `4`, outro `4`. The controller caches each anchor's
  document offset on load and on resize (ResizeObserver), never during scroll.
- **Story state `s` (0 → 4), wide screens only.** A passive scroll listener reads `scrollY` and
  `innerHeight` (no layout reads), finds where the reading line (50% of the viewport) sits between two
  cached anchor centres and interpolates `s` linearly between their states; it then requests one
  animation frame. The displayed `s` follows with exponential smoothing (τ ≈ 90ms) and the frame
  loop stops when it settles. Narrow screens have no scroll-linked state (§7).
- **Outputs.** `s` drives the canvas positions directly. Thresholds on `s` (with ±0.05 hysteresis)
  toggle `data-stage` classes on the stage for the time-based UI transitions. The active step marker
  in the text column follows the nearest anchor.

## 4. Storyboard

Keyframes of the stage, by story state:

| `s` | Act | Stage content |
|---|---|---|
| 0 | 1 – Noise | Field: torque stream (52 readings, the same data as Version A's hero figure), two other streams (temperature, power draw) and loose noise points, scattered across the stage with a faint pull toward their lanes. Each stream's true shape is there only as a barely visible trace (6% alpha) where its readings will land – the hidden pattern. Slow drift. Full-width, faint behind the headline; no label, grid at 20% (both come up from s ≈ 0.55). |
| 1 | 2 – Discovery (ingest) | Every stream point has travelled to its lane on a shared time axis (three lanes, labelled). Noise points thinned to 20% and resting in the gaps. Drift at 25%. |
| 2 | 2 – Discovery (flag) | Expected-range bands drawn on each lane; noise gone; in-range readings dimmed and smaller; the torque lane expanded, the other two compressed to thin strips at about 12% opacity. One torque reading outside its band: gold, ringed, leader to the axis. Still. |
| 3 | 3 – Insight | The torque readings flow into the chart slot of a compact interface panel: chart, three status tiles ("52 readings checked", "1 outside expected range", "Status: Review needed" – the counts are computed from the drawn data), one alert row with the flag glyph. Other lanes gone. |
| 4 | 4 – Action | A decision card under the panel: Anomaly → Insight ("Likely cause: early tool wear.") → Next step ("Inspect the tool and plan a change before the next shift."), and a line for ongoing monitoring. The chapter closes below with the call to action. |

Stage wording (EN + HU) lives in `shared/content.js` (`stage.*`); see `implementation-plan.md` §6.

## 5. Component specifications

Each component lists: purpose · trigger · start → end · duration or scroll range · easing ·
dependencies · performance cost · mobile · reduced motion. "Reduced motion" always means
`prefers-reduced-motion: reduce`; no-script behaviour is in §7.

### M-01 Field arrival (the hero's entrance)
- **Purpose:** the hero's one entrance; the data arrives while the text is already readable.
- **Trigger:** first frame after the renderer initialises (idle callback after first paint, ≤ 1.2s
  after `load`).
- **Start → end:** all points at alpha 0 → their field alpha; each point's fade is delayed by its
  x position, so the field streams in left to right.
- **Duration:** 600ms per point, delays 0–500ms, ≤ 1.1s in total. **Easing:** `--ease-out`.
- **Dependencies:** renderer initialised; stage in view (otherwise skipped and drawn at rest).
- **Cost:** low; ~420 points, one draw per frame for ~1s.
- **Mobile:** same, fewer points.
- **Reduced motion:** no fade; the field is drawn at rest in one frame.
- Hero text has no entrance animation (it is the LCP element and must paint immediately).

### M-02 Field drift (Act 1)
- **Purpose:** "data is alive and complex", without competing with the headline.
- **Trigger:** runs while the stage is ≥ 1% visible, the tab is visible, the user has not paused it
  and drift amplitude `A(s) > 0`.
- **Start → end:** each point wanders on a smooth, low-frequency noise path (±6px desktop, ±4px
  phone) with a slow left-to-right flow along the time axis (≈ 6px/s, wrapping). `A(s)` = 1 at
  `s = 0`, 0.25 at `s = 1`, 0 at `s ≥ 2` (noise recedes, the stage becomes still).
- **Duration:** continuous while conditions hold. **Easing:** none (time-based noise).
- **Dependencies:** IntersectionObserver on the stage, `visibilitychange`, pause control.
- **Cost:** low–medium: target ≤ 2ms script + draw per frame on desktop, ≤ 6ms on a 4× CPU-throttled
  phone profile. Loop stops entirely when `A = 0` or off screen.
- **Mobile:** amplitude 4px, ~190 points; same loop rules.
- **Reduced motion:** never runs.

### M-03 Inspection lens – not built
- Removed from the first release by the user (2026-11-17): the scroll story comes first. Can be
  reconsidered after the finished design has been evaluated.

### M-04 Pause control
- **Purpose:** WCAG 2.2.2 for the only motion that lasts longer than 5 seconds.
- **Trigger:** click / Enter / Space on a `<button aria-pressed>` in the stage corner, labelled
  "Pause animation" / "Resume animation" (translated).
- **Start → end:** the drift stops in place / resumes from where it stopped (its clock freezes, so
  nothing jumps).
- **Duration:** immediate; icon swap with a 160ms opacity fade. **Dependencies:** M-02.
- **Cost:** none. **Mobile:** 44px hit area. **Reduced motion:** hidden (nothing moves).
- Hidden once `s ≥ 2` (drift has stopped on its own), shown again when scrolling back up.

### M-05 Ingest: field → streams (step 1)
- **Purpose:** raw data becomes structured: three sensor streams on one time axis.
- **Trigger:** scroll; `s` from 0 to 1 (between the chapter intro and step 1).
- **Start → end:** scattered positions → lane positions (x = time, y = value within the lane). Each
  point's local progress is staggered by its time index (stagger window 35%), so the field sorts
  itself left to right like data being read in. Noise points thin to 20% alpha.
- **Duration:** scroll range `s` 0 → 1. **Easing:** ease-in-out cubic per point.
- **Dependencies:** anchor offsets; lane layout from the stage size.
- **Cost:** low: one interpolation per point per rendered frame; renders only when `s` changes.
- **Narrow screens:** step 1's own frame plays 0 → 1 once (1.6s, time-based) when 55% of it is visible.
- **Reduced motion:** no interpolation; the stage switches to the `s = 1` frame when step 1 becomes
  the block nearest the reading line (canvas swap; labels fade 140ms).

### M-06 Stream labels
- **Purpose:** name what the lanes are (illustrative sensor names).
- **Trigger:** `s ≥ 0.75` (hysteresis 0.05).
- **Start → end:** opacity 0 → 1, `translateY(4px)` → 0. **Duration:** `--dur-ui`.
- **Easing:** `--ease-out`. **Dependencies:** M-05 layout. **Cost:** negligible (3 DOM labels).
- **Narrow screens:** shown in step 1's frame once it has played. **Reduced motion:** opacity only, 140ms.

### M-07 Expected range and recession (step 2)
- **Purpose:** the model's "normal" appears; what is normal stops shouting.
- **Trigger:** scroll; `s` from 1 to 2.
- **Start → end:** bands draw left to right (clip of the band path from 0 → 100% width, mapped to
  `s` 1.0 → 1.5); in-band readings dim to 40% and scale to 0.8; noise points fade to 0; the torque
  lane grows to ~60% of the stage height while the other two compress and fade to 25% (`s` 1.4 → 2).
- **Duration:** scroll range `s` 1 → 2. **Easing:** ease-in-out cubic.
- **Dependencies:** band geometry per lane (rolling mean ± tolerance, precomputed once).
- **Cost:** low. **Narrow screens:** step 2's frame plays 1 → 2 once (1.4s). **Reduced motion:** `s = 2`
  frame on activation, no scrub.

### M-08 The flag (step 2) – signature event
- **Purpose:** the discovery: one reading is outside the expected range.
- **Trigger:** `s ≥ 1.6` (reverses below 1.5).
- **Start → end:** the reading turns gold (`--gold-hi`) and grows from 3px to 5px; a ring contracts
  from scale 1.6 to 1 onto it while fading in; 80ms later a dotted leader drops from the ring to the
  time axis (`scaleY` 0 → 1); the label "Outside expected range" fades in beside it.
- **Duration:** one 700ms progress value drives it: colour 0–35%, ring 0–60%, leader 30–80%
  (≈ 245 / 420 / 350ms); label 280ms. **Easing:** ease-out cubic.
- **Dependencies:** M-07 (flag sits on the expanded torque lane).
- **Cost:** a ~0.5s burst of frames, then still. (Drawn on the canvas with a time-based tween; the
  label is DOM.)
- **Narrow screens:** inside step 2's frame the flag follows the frame's own progress (s 1.55 → 1.95).
  **Reduced motion:** gold point, ring and leader appear at once; label fades 140ms.
- On the way back up the flag runs out in 250ms.

### M-09 Interface assembly (step 3)
- **Purpose:** the insight becomes something readable in seconds.
- **Trigger:** scroll `s` 2 → 3 moves the torque readings into the chart slot; `s ≥ 2.55` toggles
  the panel UI.
- **Start → end:** canvas: torque points and band travel from the expanded lane into the chart rect of
  the panel (measured from the DOM slot on resize); the other lanes fade to 0. DOM: panel edge and
  header fade in (opacity 0 → 1, `translateY(8px)` → 0), then the three status tiles stagger 60ms,
  then the alert row (its small flag glyph contracts like M-08 at reduced scale).
- **Duration:** points scrubbed over `s` 2 → 3; panel 280ms, tiles 280ms each with 60ms stagger,
  alert row 280ms at +180ms. **Easing:** ease-in-out (points), `--ease-out` (UI).
- **Dependencies:** panel slot rect; M-08 state.
- **Cost:** low; DOM opacity/transform only, ~6 elements.
- **Mobile:** panel fills the band; tiles become a single row of three compact cells (two lines each,
  Hungarian checked at 320px).
- **Reduced motion:** final frame on activation; UI fades in 140ms with no movement or stagger.

### M-10 Decision card (step 4)
- **Purpose:** analysis ends in an action.
- **Trigger:** `s ≥ 3.55` (reverses below 3.45).
- **Start → end:** card opacity 0 → 1, `translateY(10px)` → 0; its three lines (Anomaly → Insight →
  Next step) follow at 80ms intervals; the arrows nudge 5px along their direction (Version A's
  readout keyframes, reused).
- **Duration:** card 320ms; lines 280ms each. **Easing:** `--ease-out`.
- **Dependencies:** M-09. **Cost:** negligible.
- **Mobile:** card replaces the tiles row (the band has no room for both). **Reduced motion:** fades
  only.

### M-11 Active step marker
- **Purpose:** wayfinding inside the story without dimming text.
- **Trigger:** nearest anchor changes.
- **Start → end:** the step's index (`01`–`04`) turns from `--ivory-faint` to `--gold`; the previous
  one returns.
- **Duration:** `--dur-hover` (160ms colour transition). **Cost:** negligible.
- **Mobile:** same. **Reduced motion:** same (colour only).
- Step text stays at full contrast in every state.

### M-12 Hover, press and focus (site-wide)
- **Purpose:** controls answer the pointer and keyboard.
- **Trigger:** `:hover` under `(hover: hover) and (pointer: fine)`, `:active`, `:focus-visible`.
- **Specs:** buttons lift 1px on hover and press to 0.98 (`--dur-press`); link underlines draw left to
  right in `--dur-hover`; nav underline as Version A; service-map rows show the flag glyph at their
  start and step their ground to `--surface` (160ms); focus ring appears at once.
- **Cost:** negligible. **Mobile:** press feedback only. **Reduced motion:** colour, border and
  opacity changes kept (140ms); lifts and scales become instant.

### M-13 Carried over unchanged from Version A
- **Mobile menu** (scale 0.97 + fade, 220ms; Esc closes), **portfolio deck** rotation, fan-out and
  pause control (**protected**), **project detail dialog** (fade, focus trap, focus return). Same
  reduced-motion behaviour as in Version A.

### M-14 Services page header scan
- **Purpose:** the services page's entrance, in the same language without a second canvas.
- **Trigger:** page load (header is above the fold).
- **Start → end:** a static SVG trace across the page intro (hairline grid, expected band, one flagged
  reading) is revealed by a left-to-right `clip-path` scan, then the ring contracts onto the flag
  (Version A's hero-figure sequence, reused and re-coloured).
- **Duration:** scan `--dur-scan`, ring `--dur-flag` at +500ms; ≈ 1.2s in total, then static.
- **Easing:** `cubic-bezier(0.33, 1, 0.68, 1)` (scan), `--ease-out` (ring).
- **Cost:** low; one SVG, compositor-friendly clip. **Mobile:** same, shorter trace.
- **Reduced motion / no script:** drawn complete.

### Removed from Version A
- The fade-up reveal on every section and the staggered list entrances (`initReveal`): nothing in
  Version D fades in on scroll outside the story.
- The hero figure's in-view sequence (the story replaces it on the homepage; the sequence moves to the
  services page, M-14).

## 6. Motion intensity by section

| Section | Intensity | What moves |
|---|---|---|
| Hero | 2 – ambient | Field arrival, drift (pausable) |
| Same data, different questions | 1 – on request | The same points move to the chosen view (700ms, eased, ≤160ms stagger); layers cross-fade (450ms). Only on a click; nothing auto-rotates. Reduced motion: points jump, layers fade. |
| How it works (story) | 3 – signature | Wide: scrubbed stage, flag, interface, decision card. Narrow: one short play per step frame |
| Measured results | 0 | Nothing |
| Service map | 1 | Hover only |
| Portfolio | 2 (protected) | Deck rotation as Version A, pausable |
| About, audience, roadmap | 0 | Nothing |
| Final CTA + contact | 1 | Hover, form states |
| Services page | 1 | Header scan once, hover |

## 7. Responsive, reduced motion and no-script

| Condition | Stage | Text |
|---|---|---|
| Condition | Stage | Text |
|---|---|---|
| Wide, ≥ 60em (960px; landscape tablets and up) | Sticky stage beside the text (7/12, or 6/12 between 60em and 75em), bleeds to the right edge, ≈ 370 points at 1440×900 (156 readings + noise scaled by area, 110–300), DPR ≤ 1.5 | Text column; blocks `min-height: 72svh` (closing block 84svh) |
| Narrow, < 60em (phones, portrait tablets) – the simplified alternative | **No pinned section.** The hero shows the noise as a full-bleed 4:3 band (drift + pause). Each step then has its own frame: step 1 a canvas that plays 0 → 1, step 2 a canvas that plays 1 → 2 (with the flag), step 3 a copy of the panel whose chart canvas plays 2 → 3, step 4 a copy of the decision card. Each plays once (1.4–1.6s) when 55% of it is visible and stays finished; scrolling back up shows finished frames. Nothing is scroll-scrubbed, so nothing can trap content or fight the phone's own scrolling. | Normal flow; every step reads alone |
| Reduced motion | Wide: no drift or scrub; the stage shows the discrete state of the block nearest the reading line; overlay changes are 140ms fades; pause hidden. Narrow: frames are drawn finished, no plays | Unchanged |
| Low power (`saveData`, ≤ 2 cores, ≤ 2 GB memory, or the drift averaging > 26ms per frame) | DPR 1 and half the noise; if still slow, the drift stops for good (still field) and the pause button hides | Unchanged |
| No script | The stage shows a static SVG poster (Version A's figure geometry: band, reading, flag) on every width; the illustrative label is present; step frames are not created | Unchanged; every step is readable on its own |
| Print | Poster only, no sticky stage, no canvas | Unchanged |

iOS viewport resizing: on wide screens the stage height uses `svh` (unaffected by the toolbar). On
narrow screens no element depends on the viewport height (the band and frames size from their width
by aspect ratio) and resize handling ignores height-only changes, so the toolbar showing or hiding
causes no re-layout.

## 8. Rendering approach

- **Canvas 2D**: one context on wide screens; on narrow screens one for the band and one per step
  frame (each drawn only while its own transition plays). Sized to the box × `min(devicePixelRatio,
  1.5)` (1 on low power). Points are small arcs with per-point alpha; lines, bands and the flag are
  single paths. No shadows, `filter`, glow or gradients on the canvas.
- **DOM overlay** for everything with words (stream labels, interface panel, decision card,
  illustrative label): readable, translatable, selectable, and swapped by `data-i18n` like the rest.
- **No WebGL, Three.js or GSAP.** The point count (≤ 460) and the effects (interpolation, alpha,
  one ring) sit well inside Canvas 2D; the scroll controller is a few dozen lines of vanilla JS.
  Either library would add tens to hundreds of KB for nothing the visitor would see.
- **No CSS scroll-driven animations** for the story (Firefox support is incomplete); the controller
  covers all browsers with one code path.
- **Data:** the torque stream reuses Version A's hero-figure polyline and band, so the homepage, the
  no-script poster and the services header all show the same illustrative reading.

## 9. Performance budgets for motion

| Budget | Target |
|---|---|
| Story module size | target ≤ 10 KB gzipped; shipped 12.1 KB (`signal-story.js` 10.0 + `signal-data.js` 2.1; about a quarter is explanatory comments, kept because the site has no build step) |
| Initialisation | after first paint, in an idle callback (timeout 1.2s); data prepared in one pass |
| Frame cost while drifting | ≤ 2ms desktop; ≤ 6ms at 4× CPU throttle (lab). Drift-only frames run at 30 fps; dots are drawn in 16 opacity batches (one fill each); a governor drops to pixel ratio 1 and half the noise if a drift frame averages over 8ms to draw, then to a still field |
| Canvas pixels | ≤ 1.6 MP at 1440 wide; ≤ 0.4 MP on a 390 phone |
| Continuous loops | 1 (hero drift), only while visible, not paused, and `s < 2` |
| Layout reads during scroll | 0 (offsets cached on resize) |
| Layout shift caused by motion | 0 (stage box reserved in CSS; overlays absolutely positioned) |
| INP contribution | pause handler only flips a flag; the scroll handler reads `scrollY` and requests a frame |
