# AnomInsight – implementation plan (Version D, "Signal in Noise")

Status: **implemented** (2026-11-17). Approved by the user the same day with three refinements: no
inspection lens in the first release, a simplified non-pinned phone layout, and a review of the new
copy for technical accuracy. Version D lives in `src/frontend/versions/d/`; Version A, the frozen
`original`, the root placeholder and the experimental B/C are untouched. Nothing is committed or
deployed. Measurements: §12.

Related: `client-brief.md` (facts) · `creative-direction.md` (concept) · `design-system.md`
(tokens, components) · `motion-spec.md` (storyboard) · `qa-checklist.md` (verification).

---

## 1. Existing architecture (Version A, inspected 2026-11-17)

- **Stack:** static HTML + CSS + vanilla ES modules; no build step, no package manager; GitHub Pages
  (`CNAME`, `.nojekyll`). Pages carry `noindex` until promoted.
- **Version A files** (`src/frontend/versions/a/`): `index.html` (34.6 KB), `services.html`
  (12.3 KB), `style.css` (73.6 KB raw, 17.8 KB gzipped), `main.js` (single entry: nav, skip link,
  language, contact form, quote links, reveal), `portfolio.js` (25 KB, loaded with dynamic `import()`
  only when `#portfolioTrack` exists).
- **Shared modules** (`src/frontend/shared/`): `content.js` (all EN/HU copy, ~420 keys, also used by
  B and C), `portfolio-data.js`, `i18n.js` (`data-i18n*` attributes, `?lang=` URL persistence),
  `contactForm.js` (Formspree via fetch), `motion.js` (`observeOnce`, `prefersReducedMotion`; no
  count-up helper by design).
- **Assets:** root `images/` and `fonts/`, referenced from Version A as `../../../../…`.
- **Homepage sections (A):** hero (+ `.signal` figure) · proof band · problem/solution · "What I
  deliver" · portfolio (protected) · founder · how it works · who this is for · what you gain ·
  platform evolution · discovery-call CTA · contact.

### Lab baseline – Version A homepage
Taste `perf.mjs`, headless Chrome on CPU, median of 3 loads, host busy (timings capped at WARN, and
only comparable with other pages measured the same way, never with field data):

| | 1440 × 900 | 390 × 844 |
|---|---|---|
| Transfer (gzipped) | 220 KiB (fonts 126.5 KiB) | 220 KiB |
| JS parsed | 81 KiB (27.8 KiB gz) | same |
| FCP / LCP (CPU, relative) | 224 / 620 ms (LCP: h1) | 180 / 576 ms (LCP: hero lead) |
| Blocking time / long tasks | 32 ms / 1 | 35 ms / 1 |
| Layout shift | 0.000 | 0.000 |
| Page height | 7.8 screens | 14.7 screens |
| FAIL | 4 below-fold images not lazy (portfolio expand-icon PNGs, header logo flagged) | same |

No Lighthouse run and no field data exist yet (the site is not deployed).

## 2. Inspection findings

**Strengths to keep**
- Evidence-led, honest content: measured results with sources, public repositories, no projections.
- Solid engineering: every colour tokenised, `em` text breakpoints, skip link, focus management,
  44px touch targets, a reduced-motion policy, `?lang=` persistence, self-hosted fonts, light pages.
- A specific, on-brand hero figure (anomaly → insight) – the seed of the new concept.
- Clear conversion paths: calendar link, contact form, package quote prefill.

**Weaknesses to fix**
- Too many sections saying one thing: problem/solution, "What I deliver", "How it works" and "What
  you gain" overlap; the middle of the page is a run of heading + list blocks (14.7 screens on a
  phone).
- The best idea is boxed: the signal figure sits in a card in the hero and the story stops there.
- Template tells: icon tiles (problem/solution), pill chips (use cases), check-mark list (value),
  fade-up on every section, pill buttons and 1–1.5rem radii (`DESIGN.md` asks to avoid rounded
  cards), a blurred translucent header.
- Amber is everywhere (borders, tints, labels, muted text is sand), so the accent no longer signals
  anything, and it has drifted from the logo's champagne gold.

**Technical constraints**
- No bundler: every module is a request; keep Version D to a small number of files.
- `shared/content.js` is imported by A, B and C: Version D may only **add** keys, never rename or
  change existing ones.
- Portfolio structure and interaction are protected.
- Asset paths are relative to the version folder and will change at promotion.
- No analytics or RUM: field Core Web Vitals will not exist before launch.

## 3. Version D page structure

### Homepage (`versions/d/index.html`), 9 sections instead of 12

| # | Section | Act | Content (existing keys unless marked new) | Change from A |
|---|---|---|---|---|
| 1 | Hero | 1 | `hero.heading`, `hero.copy`, `offer.discoveryCta`, `offer.servicesCta`, founder byline + `hero.callNote`; canvas field + pause control | Field replaces the boxed figure; copy unchanged |
| 2 | How it works – the signal story (`#method`) | 2–4 | Opener: `method.title` (eyebrow), `problem.title` (h2), `problem.text`, the four `problem.issue*`; steps 1–4: `method.step*`, tagged with `solution.feature1–4`; closing: `solution.title`, `solution.text`, primary + secondary action; stage labels (new `stage.*`) | Merges A's problem/solution and how-it-works into one story |
| 3 | Measured results | proof | `proof.*` + optional new `proof.bridge` | Moves to directly after the illustration |
| 4 | What I deliver – service map (`#services`) | 4 | `capabilities.*`, `services.card*`, `advanced.card*`, `packages.*.title`; new `map.*` stage names | Capabilities regrouped by story stage, each linked to its package |
| 5 | Selected projects (`#projects`) | proof | Protected portfolio | Token remap only |
| 6 | About (`#about`) | – | `about.*` | Restyled |
| 7 | Who this is for + What you gain | – | `usecases.*`, `value.*` | Two sections merged into one band |
| 8 | Platform evolution | – | `roadmap.*` | Restyled |
| 9 | Discovery call + contact (`#contact`) | 4 | `offer.*`, `finalcta.note`, `contact.*` | Restyled |

Nav order follows the new page order: How it works · Services · Projects · About · Contact
("Services" still opens `services.html`, as decided 2026-09-24).

### Services page (`versions/d/services.html`)
Page intro with the static signal header (M-14), the five package rows (order, badges, quote
prefill and the single primary button unchanged), each row tagged with its story stage, contact
section.

## 4. Files

**New, in `src/frontend/versions/d/`**

| File | Origin | Notes |
|---|---|---|
| `index.html` | from A | Restructured as §3 |
| `services.html` | from A | Restyled, stage tags, header scan |
| `style.css` | from A | New tokens and components; portfolio block kept, token-remapped |
| `main.js` | from A | Same wiring; `initReveal` removed; imports the story module on the homepage |
| `portfolio.js` | copy of A | Unchanged logic (protected); copied rather than imported across versions so Version D stands alone at promotion |
| `signal-story.js` | new | Canvas 2D renderer (`Scene`), wide controller (sticky, scroll-scrubbed), narrow controller (band + step frames), drift + pause, frame-cost governor, reduced-motion paths (10.0 KB gz) |
| `signal-data.js` | new | Illustrative streams: Version A's torque polyline and band + two companion streams from a fixed seed (2.1 KB gz) |

**Changed outside the folder**
- `src/frontend/shared/content.js` – 27 new keys per language, additive only (`stage.*`, `map.*`, `proof.noteD`,
  `story.step4.lead`, `proof.bridge`), EN + HU. No existing key was changed, so A, B and C are
  unaffected.
- `src/frontend/versions/index.html` – a Version D card in the comparison index.
- `docs/` – these six documents; `CLAUDE.md` – state and changelog.
- Local tooling (gitignored): `.claude/launch.json` and `.claude/serve.mjs` (static server with
  gzip, used for previews and measurements).

**Not changed:** `versions/a/*`, `versions/original/*`, root `index.html` / `style.css` /
`script.js`, `versions/b`, `versions/c`, `shared/i18n.js`, `shared/contactForm.js`,
`shared/portfolio-data.js`, images, fonts.

## 5. New components

| Component | Built with | Notes |
|---|---|---|
| `.signal-story` wrapper | CSS grid | Hero + story share one sticky stage (spans every row on desktop; a sticky band after the hero on phones) |
| `.signal-stage` | `<canvas>` + DOM overlay | Canvas `aria-hidden`; overlay holds stream labels, interface panel, decision card, illustrative label, pause button, visually hidden summary |
| `.story-step` | HTML | Index, discipline tag, h3, text; `data-state` anchor |
| `.stage-panel` (illustrative interface) | HTML/CSS | Chart slot (canvas draws into it), 3 status tiles, alert row |
| `.decision` card | HTML/CSS | Anomaly → Insight → Next step |
| `.signal-poster` | inline SVG | No-script / print fallback of the final state, reusing A's figure geometry |
| `.service-map` | HTML list | Four stage rows with services and package links |
| `.audience` band | HTML | Use cases + value, two typographic columns |
| `.page-intro__trace` | inline SVG + CSS | Services page header scan |

## 6. New copy (shipped, EN + HU)

> Superseded in part (2026-11-18, round 3): the `stage.decision.*`, `stage.summary`, `modes.*` and proof-note wording below is the first shipped version. The current text is in `shared/content.js`; see §12.

HU follows the terminology table in `CLAUDE.md` §6, the informal register of the hero ("Lásd meg…")
and the wording A already uses for the same ideas ("várható tartomány" for expected range,
"kezdődő szerszámkopás" for early tool wear, "teljesítményfelvétel" for power draw, as in the
case study).

**Technical review (2026-11-17).** The illustration is a CNC example: tool wear raises cutting forces,
which shows up as spindle torque (load). So "Spindle torque / Főorsónyomaték" is used only for the
torque stream; one-word compound, as the six-syllable rule allows. A single reading outside its range
does not prove wear, so the copy says "Likely cause" and makes the next step an inspection, not a
replacement. The tiles show only counts of the drawn example (computed from the data at runtime:
52 readings, 1 outside its range) and a state, never a result. The three streams (torque,
temperature, power draw) are the sensors named in the published CNC case study, but the values are
illustrative and labelled as such.

| Key | EN | HU |
|---|---|---|
| `stage.caption` | Illustrative example – CNC machine sensor data | Szemléltető példa – CNC-gép szenzoradatai |
| `stage.stream.torque` | Spindle torque | Főorsónyomaték |
| `stage.stream.temperature` | Temperature | Hőmérséklet |
| `stage.stream.power` | Power draw | Teljesítményfelvétel |
| `stage.flag` | Outside expected range | A várható tartományon kívül |
| `stage.legend.reading` / `.flagged` | Readings / Flagged | Mérések / Megjelölt |
| `stage.tile.checkedLabel` | readings checked | ellenőrzött mérés |
| `stage.tile.flaggedLabel` | outside expected range | a várható tartományon kívül |
| `stage.tile.statusLabel` / `.statusValue` | Status / Review needed | Állapot / Ellenőrzés szükséges |
| `stage.decision.insight` | Likely cause: early tool wear. | Valószínű ok: kezdődő szerszámkopás. |
| `stage.decision.nextKey` | Next step | Következő lépés |
| `stage.decision.next` | Inspect the tool and plan a change before the next shift. | Ellenőrizd a szerszámot, és tervezd be a cserét a következő műszak előtt. |
| `stage.decision.monitor` | Ongoing monitoring keeps checking the readings after the change. | A rendszeres monitorozás a csere után is figyeli a méréseket. |
| `stage.pause` / `stage.resume` | Pause animation / Resume animation | Animáció szüneteltetése / Animáció folytatása |
| `stage.summary` (screen readers) | Illustration with example data: three sensor readings from a CNC machine. One spindle torque reading falls outside its expected range and is flagged. The finding becomes an alert, a likely cause (early tool wear) and a next step: inspect the tool before the next shift. | Szemléltetés példaadatokkal: egy CNC-gép három szenzoradatsora. Egy főorsónyomaték-mérés kilép a várható tartományból, és megjelölöm. A megállapításból riasztás, valószínű ok (kezdődő szerszámkopás) és következő lépés lesz: a szerszám ellenőrzése a következő műszak előtt. |
| `story.step4.lead` | Every finding ends in a concrete next step. | Minden megállapítás konkrét következő lépéssel zárul. |
| `map.clean` | Clean the noise | A zaj kiszűrése |
| `map.find` | Find the signal | A jel megtalálása |
| `map.show` | Show the insight | A meglátások megjelenítése |
| `map.keep` | Keep watching – or run it yourself | Folyamatos figyelés – vagy saját üzemeltetés |
| `map.package` / `map.packages` | Package / Packages | Csomag / Csomagok |
| `proof.bridge` | The example above is illustrative. The two results below were measured in published case studies. | A fenti példa szemléltetés. Az alábbi két eredményt publikált esettanulmányokban mértem. |
| `proof.noteD` (D's proof note; A keeps `proof.note`) | Each result links to the public repository behind it. The other two figures describe the practice itself. Nothing here is a projection. | Mindkét eredmény mellett ott a hozzá tartozó nyilvános GitHub-repó. A másik két szám magát a munkámat írja le. Egyik sem becslés. |

Reused as is: hero, problem, solution, method, proof, capabilities, services, advanced, packages,
portfolio, about, usecases, value, roadmap, offer, contact, footer keys; `hero.signal.anomaly`,
`hero.signal.anomalyKey`, `hero.signal.insightKey`, `hero.signal.band` in the stage;
`hero.signal.caption` on the services header (it shows the torque trace only). The contact block's
calendar button now uses `offer.discoveryCta` (one wording for the one action; A used
`contact.bookCallButton`). Proof sources link to the case studies' repositories. The finish review
found that A's `proof.note` ("Every figure below comes from the case study linked beside it") also
covers the "4+ years" and "3 case studies" rows, which are not case-study results; D therefore uses
`proof.noteD`, and `proof.bridge` speaks of the two results only. 26 + 1 = 27 new keys per language.

## 7. Libraries and dependencies

**None added.** Canvas 2D, IntersectionObserver, ResizeObserver, `requestAnimationFrame` and
`requestIdleCallback` (with a `setTimeout` fallback) cover every requirement.

| Considered | Decision | Reason |
|---|---|---|
| GSAP + ScrollTrigger | Not used | Roughly 45 KB gzipped for one scroll-scrubbed section the controller handles in ~60 lines; adds a vendored file and a licence to track on a dependency-free site |
| Three.js / WebGL | Not used | ≤ 420 2D points with alpha and one ring; WebGL adds context cost, shader fallbacks and well over 100 KB gzipped with no visible gain |
| Lenis / smooth-scroll | Rejected | Steers native scroll; hurts accessibility and INP |
| CSS scroll-driven animations | Not used for the story | Incomplete in Firefox; one JS path for all browsers |
| A third font (data mono / new display) | Not used (recommended) | Over the 4-file font budget for one section; see `design-system.md` §3 |

## 8. Implementation order (after approval)

1. **Contract.** Write the Impeccable surface brief and direction contract for
   `versions/d/index.html` (`seed: none (pinned)`); read Impeccable's `craft-floor.md`.
2. **Scaffold.** Create `versions/d/` from A; add the D card to the comparison index; confirm both
   pages load with no console errors or 404s.
3. **System.** Replace tokens, type scale, radii, header, buttons, links, focus; remap portfolio
   tokens; compare the portfolio DOM and interaction with A (structure must be identical).
4. **Static structure.** Build the homepage sections of §3 with no motion: hero split, story layout
   with the no-script poster, proof, service map, audience band, roadmap, CTA, contact. Add the new
   `content.js` keys (EN + HU). Check 1440 / 1024 / 768 / 390 / 320 in both languages.
5. **Signal story.** `signal-data.js`, renderer (states 0–4), controller (anchors, `s`, smoothing),
   drift + pause, thresholds → overlay classes, reduced-motion and low-power paths, no-script poster
   swap.
6. **Overlays.** Interface panel, decision card, stream labels; phone band layout.
7. **Lens** (if approved).
8. **Services page.** Restyle, stage tags, header scan (M-14).
9. **Audit (step D)** and **refine (step E)** per `qa-checklist.md`; then update `CLAUDE.md`,
   `docs/design-system.md` (shipped tokens) and `DESIGN.md` (with the user's refresh/merge choice).

Nothing is committed, pushed or deployed without an explicit request.

## 9. Performance approach

- **Critical path:** HTML → one CSS file → two preloaded latin fonts → h1. The hero text is static
  and is the LCP element; the canvas is not on the critical path.
- **Deferred visual:** `signal-story.js` is a module imported from `main.js` and initialised in an
  idle callback after first paint; the field fades in (M-01). The stage box is reserved in CSS, so
  nothing shifts when the canvas appears.
- **Bounded rendering:** DPR capped at 1.5; points scaled by stage area (≤ 420 / ≤ 300 / ≤ 190);
  batched draws; render on demand; one continuous loop, only while visible, unpaused and `s < 2`;
  paused in hidden tabs; low-power fallback after measuring the first 30 frames.
- **Weight:** homepage transfer target ≤ 260 KiB (A: 220 KiB); JS added ≤ 10 KB gz; CSS ≤ 22 KB gz;
  fonts unchanged (4 files, 126.5 KiB); images unchanged; portfolio module still lazy-imported.
- **Fix A's lab FAIL:** lazy-load the portfolio icon images injected below the fold.
- **Targets:** LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 (field, p75, once live); Lighthouse mobile
  Performance ≥ 90 (lab). Lab and field numbers are reported separately; nothing unmeasured is
  reported as verified.

## 10. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Scroll-scrubbed canvas stutters on low-end phones | Medium | Fewer points, DPR cap, render on demand, measured low-power fallback, reduced-motion path |
| Sticky stage + long chapter feels long on phones | Medium | Steps at 70svh, story ≈ 4 screens; the band shows progress; review at 390 and 320 |
| iOS toolbar resizes cause re-layout jumps | Medium | `svh` units; ignore height-only resizes under 15% |
| Text over the hero field loses contrast | Low | Field kept out of the text column on desktop; masked under text on phones; contrast measured on screenshots |
| Illustration mistaken for client results | Low | Permanent illustrative label, counts and states only, real results directly after |
| Hungarian strings overflow stage tiles at 320px | Medium | Two-line tiles, `minmax(0, 1fr)`, soft hyphens, HU checked at 320 |
| Portfolio altered by token changes | Low | Token remap only; DOM and interaction compared with A |
| Copying A's CSS and portfolio module duplicates code | Certain | Accepted for an isolated version; A is retired when D is promoted |
| New copy not approved | Medium | All new strings listed in §6; reused keys wherever possible |
| Taste gate flags the required illustrative label as a caption | Certain | Waiver with the brief and `CLAUDE.md` as the reason |
| Scope creep into the root placeholder or promotion | Low | Out of scope; promotion stays priority 1 in `CLAUDE.md` as a separate task |

## 11. Acceptance criteria

Results against these criteria (lab measurements, review outcome, open items) are recorded in
`qa-checklist.md` §8.

1. Both Version D pages load with no console errors and no failed requests, in EN and HU.
2. Every business function of A works: calendar links, contact form (sending, success, error), quote
   prefill, language switch with `?lang=` persistence, mobile menu with Esc, skip link, portfolio
   filters / rotation / pause / detail dialog.
3. The homepage tells the four acts in order; every step is readable with no script, with reduced
   motion and at any frozen scroll position; the illustrative label is visible at every step.
4. No fabricated data: the illustration shows only counts and states of the drawn data; every real
   figure keeps its source.
5. Gold appears only on signal, the primary action, measured results, active markers and focus.
6. No horizontal scroll at 320 px; 44px targets on touch; text-size 200% holds.
7. Exactly one continuous motion, with a working pause control; it stops off screen and in hidden
   tabs; nothing else moves on scroll.
8. Lab: LCP ≤ 2.5 s and CLS ≤ 0.1 in Lighthouse mobile, Performance ≥ 90 where achievable; Taste
   perf with no FAIL; no long task over 50 ms from the story module; frame cost within
   `motion-spec.md` §9.
9. Portfolio structure and interaction identical to A.
10. Docs and `CLAUDE.md` describe what was built; open items listed in `qa-checklist.md`.

## 12. Refinements after review (2026-11-18)

- **Hero:** full-width stage behind the text; field fades in from behind the headline
  (`Scene.fade`, right-weighted scatter in `Scene.field`); label and grid gated by a new `story`
  stage state; quieter pause control; headline token raised to `clamp(3rem, 1.6rem + 4.2vw, 5.5rem)`.
- **Scope:** new `versions/d/modes.js` (2.9 KB gz, imported as the services section approaches) +
  the `.modes` block in `index.html` and `style.css`. New D-only keys (EN + HU): `home.pageTitleD`,
  `capabilities.textD`, `map.forecast.title`, `map.ml.title`, `map.ml.text`, `modes.*` (26).
  HU terms: klaszterezés, osztályozás, regresszió, előrejelzés (per the terminology table where
  listed).
- **Measured (lab, same throttled profile as §1/qa-checklist):** phone LCP 1.46 s, CLS 0, worst
  interaction 24 ms; desktop LCP 0.45 s, CLS 0.
- **Final round (same day, after the user approved the direction):** hero field contrast lifted
  slightly; story step 1 rewritten as onboarding (`method.step1.titleD` / `textD`); explorer
  copy made method-accurate, an honesty caption (synthetic data; sketches, not a trained, validated
  model), class label "Needs review" / "Ellenőrzendő", HU heading "Ugyanazok az adatok, más
  kérdések"; active tab gets a gold underline; forecast limit label kept clear of the projection.
  Measured: phone LCP 1.36 s, CLS 0, INP proxy 32 ms; desktop LCP 0.58 s (see qa-checklist).

- **Business copy alignment (2026-11-18, round 3):** the user's HU copy for the free
  consultation, paid audit, SME positioning, CNC example and explorer. Shared keys D renders get
  `<key>D` variants (37, EN + HU) so A, B, C keep the originals; D's HTML names them and
  `t()` in `versions/d/main.js` prefers them for shared modules. D-only keys (`stage.*`,
  `modes.*`, `map.show`, `proof.noteD`, `home.pageTitleD`, `capabilities.textD`) are edited in
  place. EN changed only where needed to say the same thing (13 variants + the D-only keys).

- **Final wording decisions (2026-11-18, round 4):** Integrated text keeps the rights split
  (project solution used on the contract's terms; general components and methods stay reusable)
  plus the offer/contract clause; Monitoring promises a 30-minute review each reporting cycle;
  the final CTA section's h2 is the new `finalcta.titleD` and `offer.titleD` labels the list as
  an h3 (`.final-cta__covers`, one small CSS rule); step 1 tag "Data preparation". D content
  approved for the next milestone.
