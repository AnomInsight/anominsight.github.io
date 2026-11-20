# AnomInsight – QA checklist (Version D)

Status: **run on the built Version D** (2026-11-17, audit + refine). Results and remaining limitations
are in §8; every number there is a lab measurement (no field data exists yet).

Pages: `src/frontend/versions/d/index.html`, `src/frontend/versions/d/services.html`, served over
HTTP from the repository root (modules do not load from `file://`).

Widths: 1440 × 900, 1024 × 768, 820 × 1180, 768 × 1024, 390 × 844, 320 × 640; plus 1760 and 2200 for
the wide-shell steps. Languages: EN and HU at every width that changes layout.

---

## 1. Functional

- [ ] Both pages load with zero console errors and zero failed requests (EN, HU).
- [ ] Language toggle switches every visible string, `aria-label`, placeholder and title; `?lang=`
      is written to the URL and to same-site links; the choice survives page changes and reloads.
- [ ] Every new key exists in EN and HU (no silent fallback to the EN text in HU).
- [ ] Calendar links open the booking page in a new tab with the new-tab hint.
- [ ] Contact form: required fields enforced; sending, success and error states shown in the current
      language; the honeypot stays hidden; no real enquiry is sent during testing without the user's
      OK (test against an error path or with the user's go-ahead).
- [ ] Services page: each "Get a custom quote" link fills the hidden `package` field and the starter
      message, never overwriting text the visitor typed.
- [ ] Service-map package links land on the right package row of `services.html`.
- [ ] Mobile menu opens and closes, moves focus to the first link, closes on Esc and on link click.
- [ ] Skip link is the first Tab stop and moves focus to `<main>`.
- [ ] Portfolio (protected) above 840 px: filters, clear-all, stats, rotation, pause, arrows, dots,
      card focus, detail dialog (open, focus trap, Esc, focus return), GitHub links – identical
      behaviour to A.
- [ ] Portfolio on phones (≤ 840 px): one card at a time, arrows disabled at the ends (no wrap),
      "n / total" counter, swipe both ways, no auto-rotation; Filter opens the bottom sheet with the
      applied ticks; ticking changes only the sheet's count; only "Show {n} projects" applies
      (deck back at card 1, count and badge updated); X, Escape and a backdrop tap discard
      unapplied ticks and keep the current card and scroll position; "Clear all filters" in the
      sheet clears the draft only; Show with no change keeps the card; the empty state's Clear
      button restores all projects.
- [ ] Footer year is current.

## 2. Responsive

- [ ] No horizontal scroll at any width, including 320 px in Hungarian.
- [ ] Hero: headline, lead and the primary action are inside the first viewport at 1440, 1024, 768
      and 390; the field never sits under the text column on desktop.
- [ ] Story: sticky stage stays fully on screen and never covers step text in the reading area;
      phone band is 42svh (min 260px) and steps remain readable beneath it.
- [ ] Interface panel and decision card fit the band on phones; status tiles wrap to two lines
      without clipping in HU.
- [ ] Split layouts collapse at the documented breakpoints; grid tracks with long words use
      `minmax(0, 1fr)`.
- [ ] Wide desktop (1760, 2200): shell steps, h1 step, stage bleed still balanced.
- [ ] Portfolio on phones (320, 360, 390, 430; EN + HU): order heading › subtitle › count + Filter ›
      deck › nav › stats › note › CTA; no sheet label clipped or wrapped; Show button inside the
      viewport; page does not move when filters are applied; vertical scrolling over a card works.
- [ ] Browser text size 200%: nav switches to the menu, no overlap, no clipped text.
- [ ] iOS Safari (or emulation): toolbar show/hide does not make the stage jump.

## 3. Accessibility

- [ ] Contrast measured on rendered screenshots: body ≥ 4.5:1 (target ≥ 7:1), large text ≥ 3:1,
      input borders and focus ring ≥ 3:1, the illustrative label ≥ 4.5:1 over the grid.
- [ ] The anomaly is identifiable without colour (size, ring, label).
- [ ] Canvas is `aria-hidden`; the stage's visually hidden summary is read once; step text alone tells
      the story.
- [ ] Heading order is one level at a time on both pages; one h1 per page.
- [ ] Every control has an accessible name in both languages; the pause button exposes
      `aria-pressed` and its label changes.
- [ ] Focus is always visible and never hidden under the fixed header or the sticky stage.
- [ ] Touch targets ≥ 44px on coarse pointers, with ≥ 8px between targets.
- [ ] `lang` attribute updates on `<html>`; links opening a new tab announce it.
- [ ] Portfolio filter sheet (phones): Filter exposes `aria-expanded` and, with filters applied,
      "Filter, 2 selected"; opening focuses an option; Tab stays inside the sheet; Space ticks;
      Escape closes; focus returns to Filter; page scroll is locked while open; the live region
      announces the result count after Show and after the empty state's Clear, and the position
      after arrows or swipe; non-front cards are `inert`.
- [ ] Automated pass (axe or Lighthouse accessibility) with no serious or critical issues; manual
      keyboard-only walkthrough of both pages; screen-reader spot check (NVDA or Narrator) of hero,
      story and form.

## 4. Animation

- [ ] Field arrives once (≤ 1.1 s) after the text is already painted; LCP element is text.
- [ ] Drift is slow and does not pull the eye from the headline (judged on a 1440 and a 390 recording).
- [ ] Drift stops off screen, in a hidden tab, when paused, and by itself once the flag is found.
- [ ] Scrolling down and back up runs every transition in reverse with no half-drawn state; fast
      scrolling (scrollbar drag, End/Home keys) lands on correct finished frames.
- [ ] The flag event plays once per crossing and fades out on the way back up.
- [ ] Interface panel and decision card appear at the right steps and never overlap step text.
- [ ] Lens (if built): only with a fine pointer, only in the hero state, releases when the pointer
      leaves.
- [ ] Nothing else on the page moves on scroll (no reveals, no parallax, no scroll-spy).
- [ ] Hover, press and focus feedback on every button, link and service-map row.
- [ ] Services header scan plays once on load, then stays static.

## 5. Reduced motion and no-script

- [ ] With `prefers-reduced-motion: reduce`: no drift, lens, scrub or scan; the stage shows the
      finished frame of the active step; UI changes are fades ≤ 140ms; pause control hidden.
- [ ] With JavaScript disabled: the static poster shows the final composition with the illustrative
      label; every section, link and the form's native POST still work; no content is hidden.
- [ ] Low-power path (emulate 4× CPU throttle and `saveData`): DPR drops, points halve, and the
      reduced-motion behaviour takes over if frames stay slow.
- [ ] Print preview: poster instead of canvas, no sticky stage, readable on white.

## 6. Performance

**Lab** (state tool, device profile and host load with every number):
- [ ] Lighthouse mobile (simulated throttling), 3 runs, median: Performance ≥ 90, LCP ≤ 2.5 s,
      CLS ≤ 0.1, TBT ≤ 200 ms. Lighthouse desktop for reference. (Needs either Chrome DevTools or
      `npx lighthouse`; downloading the npm package is a download and needs the user's OK.)
- [ ] Taste `perf.mjs` on both pages at 1440 and 390: no FAIL; compare with the Version A baseline
      in `implementation-plan.md` §1.
- [ ] Transfer ≤ 260 KiB (homepage), JS added ≤ 10 KB gz, CSS ≤ 22 KB gz, 4 font files.
- [ ] Performance trace of a full scroll through the story at 4× CPU throttle: no long task from the
      story module, frame cost within `motion-spec.md` §9, no layout reads during scroll.
- [ ] Canvas size within budget (≤ 1.6 MP desktop, ≤ 0.4 MP phone); exactly one rAF loop while
      drifting, zero when still.
- [ ] Below-fold images lazy (fixes A's lab FAIL); every `<img>` has width and height.
- [ ] Interaction latency: pause button, language toggle, menu, filters, form submit each respond
      within 200 ms in a throttled trace (INP proxy).

**Field:** not available before launch (no analytics; `noindex`). After promotion: CrUX once the
origin has enough traffic, or an opt-in RUM snippet if the user wants one. Never report lab numbers
as field results.

## 7. Skill-based audits

- [ ] Impeccable `audit` (accessibility, performance, theming, responsive, anti-patterns) and
      `critique` on both pages; `impeccable detect --json` once on the changed files.
- [ ] Impeccable finish reviewer (fresh subagent) with the direction contract, screenshots
      (`.impeccable/review/desktop.png`, `mobile.png`) and the detector findings; act on its
      disposition.
- [ ] Taste: `copy-lint.mjs`, `consistency.mjs`, `assets/layout/check.mjs`, `shoot.mjs`, `perf.mjs`,
      then `gate.mjs`; record waivers with reasons in `.taste-skill/waivers.json` (expected: the
      illustrative label, which the brief requires).

## 8. Results log, known limitations and unresolved issues

### Results (2026-11-17)

| Check | Tool / setting | Result |
|---|---|---|
| Console errors, failed requests | headless Edge (CDP), both pages, EN/HU | none |
| i18n keys and fallbacks | static script over both pages | every `data-i18n*` key exists in EN and HU; every HTML fallback equals its EN value; no duplicate ids |
| Language switch | in-app browser | all strings, `aria-label`s and the pause label switch; `?lang=` written to URL and links |
| Portfolio (protected) | in-app browser | renders 3 cards and 12 filter chips; rotation, filters and dialog code unchanged from A |
| Pause control | in-app browser, keyboard | focusable, Enter and Space toggle it, `aria-pressed` and label flip (EN/HU), ring visible |
| Reverse scrolling | in-app browser, scripted down/up | every stage state (lanes, flag, panel, decision) unwinds in order; active step marker follows |
| Horizontal overflow | 1440, 1024, 820, 390, 360, 320 (HU) | none (`scrollWidth = clientWidth` at every width) |
| Reduced motion | CDP media emulation | no drift, no scrub, discrete state per block; pause hidden |
| No script | CDP script disabled | static poster on desktop and phone; all content readable |
| Copy lint | Taste `copy-lint.mjs` | 0 FAIL, 1 WARN (stat strip: the real, sourced results, kept) |
| Layout | Taste `check.mjs` 1440/1024/820/390 | no overflow, collision or tap-size finding; remaining findings are the kit's "one section per screen" and edge-line conventions (not adopted) |
| Consistency | Taste `consistency.mjs --quick` 1440/390 | fixed: button styles (UA button face), heading sizes per level, skip link off-screen, eyebrow-like note inside an h3, closing sections without padding, one wording for the calendar action, split column starts. Waived: see "Waivers" below |
| Design detector | `impeccable detect` | link contrast hits fixed; remaining: hairline-ruled lists flagged "cramped" (rows are padded) and the technical grid (requested by the brief, limited to the stage and the services trace) |
| Finish review | Impeccable finish reviewer (fresh subagent) | round 1: **fix** (8 material items); 7 applied. Verdict pass: 7 resolved, 1 unresolved (footer tagline – needs the user's wording), 2 small regressions from the batch (double rule in the panel, a rule after the step number) – both fixed afterwards and checked on fresh captures, not re-reviewed |

**Performance (lab only).** Two tools, both headless Edge on this machine, A and D measured
back-to-back under the same conditions.

*Taste `perf.mjs`* (CPU-rendered, median of 3, text gzipped like a static host):

| Homepage | Version A | Version D |
|---|---|---|
| Transfer (1440) | 222.3 KiB | 220.2 KiB |
| Requests | 26 | 20 |
| JS / CSS (gzipped) | 28.8 / 17.8 KiB | 41.9 / 16.1 KiB |
| Images | 31.1 KiB | 14.5 KiB |
| Fonts | 126.5 KiB (4 files) | 126.5 KiB (4 files) |
| LCP element | h1 (1440), lead (390) | h1 (1440 and 390) |
| Layout shift | 0.000 | 0.000–0.018 at 1440 (within 0.1; not reproduced, see below), 0.000 at 390 |
| FAIL rows | 1 (below-fold images not lazy) | 0 |

The services page: 160.7 KiB, 13 requests, layout shift 0.000.

*Throttled Web Vitals* (own CDP script; Lighthouse-like mobile emulation: 412×823, 4× CPU, 150 ms RTT,
1.6 Mbps down; cache off; median of 5; CLS over load and a full scroll down and up; "worst
interaction" is the longest Event Timing duration of a pointer/click interaction on the menu, the
language toggle (twice) and the pause button; it is an INP proxy, not field INP):

| Homepage, mobile profile | Version A | Version D |
|---|---|---|
| FCP = LCP | 1592 ms | 1416 ms |
| CLS | 0 | 0 |
| Worst interaction | 232 ms | 40 ms |
| Blocking time over the whole scripted session (load, scroll, 4 clicks) | 216 ms | 364 ms |
| Transfer / requests | 214 KiB / 25 | 211 KiB / 19 |

| Homepage, desktop profile (1350×940, no CPU throttle, 40 ms RTT) | Version A | Version D |
|---|---|---|
| FCP = LCP | 868 ms | 328 ms |
| CLS | 0 | 0 |
| Worst interaction | 152 ms | 104 ms |

D's numbers are from the final code. The higher session blocking time in D is the language switch
(now run after the click has painted, so it no longer delays the response) and the step frames
playing during the scroll; blocking time at load is 0–29 ms (Taste perf). The 0.018 layout shift
Taste perf reported at 1440 did not reproduce in three attributed runs at 1440×900 (no shift
entries); it stays within the 0.1 budget either way.

What changed D's numbers during the audit: dots drawn in batches by opacity (one fill per level),
drift frames at 30 fps, phone step frames prepared only near the viewport, language switch deferred
until the button's press has painted, `text-wrap: pretty` limited to lead paragraphs. Before these,
D's worst interaction was 384 ms and its blocking time higher than A's.

**Not measured:** a Lighthouse score (the `lighthouse` npm package was not downloaded; Chrome
DevTools > Lighthouse can produce one locally), real devices, and field data (none until launch).

### Waivers (Taste kit conventions this brief does not follow)

- Canvas effect on a "service" page – the brief requires the canvas story.
- Photograph or visual in every section, category noun in the h1 – the client has no photography and
  no fabricated imagery is allowed; the h1 is the user's approved wording.
- "One section per screen", one heading per section, edge-line alignment – Version A's information
  architecture is kept.
- Caption under a visual – the "Illustrative example" label is required.
- Portfolio findings (tilt, spill, card visuals) – the protected deck.
- Phone step frames playing as they enter view – the moment's simplified phone alternative.

### Known limitations and unresolved issues

- **No field data** until the site is live; all numbers above are lab numbers from one machine.
- **No real-device testing** from this environment; iOS behaviour is checked by emulation only.
  Safari and Firefox are not tested; all browser checks ran in Edge (Chromium).
- **Copy to confirm with the user:** the new stage, map and proof lines (EN + HU,
  `implementation-plan.md` §6); the "4+ years" figure's source ("Practice to date"); the footer
  tagline ("AI-powered data analytics for modern businesses."), which the finish review flags as
  generic but is approved copy shared with Version A.
- **Long phone page:** 17.2 screens at 390px (A: 14.7), mostly the four step frames.
- **Language switch** still costs one long task (~240 ms at 4× CPU) right after the click has painted;
  shared `i18n.js` was not changed for D, because A uses it too.
- **`DESIGN.md`** still describes Version A; refresh it if D is promoted.
- **Mobile portfolio, 320×568 HU:** the front card (494 px) is taller than the space under the
  count bar, so the arrows sit ~130 px below the fold (EN 320: ~61 px); from 360 px up the card
  and arrows fit. At 320×568 the sheet's type list scrolls (one option below the fold, scroll
  shadow) and the backdrop strip above the sheet is 24 px tall; X and Escape still close it.
- **Mobile portfolio, untested paths:** the status group and the empty state cannot occur with the
  current data (one status; every type matches a project); both were checked only by changing the
  data in the test page's memory. Browsers without `<dialog>` `showModal` get no Filter button on
  phones (the deck still works). Live-region announcements were checked as DOM text, not with a
  screen reader.
- **Open questions inherited from `CLAUDE.md` §12** remain open.

### Refinement check (2026-11-18)

| Check | Result |
|---|---|
| Hero at 1440 / 1024 (HU) / 390 (HU), reduced motion, no script | field reads as atmosphere, text leads; label and grid appear from step 1; no overflow |
| Explorer: four views at 1440 and 390 (HU) | all render from the data; the flagged reading stays gold in every view; no label collisions after moving class labels to the bottom |
| Explorer without script | the four questions' texts as a list; chart and buttons hidden |
| i18n | all keys present in EN and HU; fallbacks equal EN |
| Throttled lab (phone / desktop) | LCP 1.46 s / 0.45 s, CLS 0 / 0, worst interaction 24 ms / 104 ms |
| Not re-run here | Impeccable finish review and Taste checks – run in the final check below |

### Final refinement check (2026-11-18, round 2)

| Check | Result |
|---|---|
| Hero on laptops (1280×800, 1366×768, 1536×864 @1.25, 1440×900 @2) | dots and stream traces read after a slight lift (`--data-noise` #6B665D, traces 0.09); text side stays calm |
| Story step 1 | describes onboarding (export or read access, then a check of what the data can answer); no upload/connect feature implied |
| Explorer accuracy | trend = least-squares fit, groups = k-means on synthetic data; range width, limit and class boundary chosen for illustration – the caption says so; per-view texts describe the method, not this chart |
| Explorer, phones (360/390 HU+EN, 320 HU) | touch switches all four views; Tab order, Enter and Space work; aria-pressed and the live copy follow; no horizontal overflow; SVG labels ~15px; active view = gold name + 2px gold underline + ivory question |
| Reduced motion / no script | points jump (transform not transitioned), layers fade; without script the four texts show as a list |
| Impeccable detector | clean (one reasoned ignore: the stage's technical grid, pinned by the brief) |
| Impeccable finish review | fix (forecast label crossed by the projection line on phones) → fixed → verdict: resolved, **ship** |
| Taste perf (index / services) | 0 FAIL / 0 FAIL; 230 KiB / 20 requests after a full scroll; one WARN is a false positive (the header logo) |
| Taste copy-lint | 0 FAIL; the explorer lead's staged reveal fixed; proof-ledger stat strip waived as before |
| Taste consistency | FAILs are the waived kit conventions below, the protected portfolio (7:1 AAA body text; it measures 5.6:1, AA pass) and a focus-visible timing artefact: the story CTA is reached by smooth scroll, in view with a visible ring after ~0.5 s (checked with real Tab presses) |
| Taste layout | homepage: section-height findings (waived); services: the checker script crashed (`r.sections is not iterable`), no result |
| Contrast | caption/methods text #8D877B: 5.54:1 on the ground, 5.28:1 on the band |
| Throttled lab (412×823, 4× CPU, 150 ms RTT, 1.6 Mbps; 5 runs) | homepage LCP 1.36 s, CLS 0, INP proxy 32 ms, TBT 308 ms, 220 KiB, 20 requests; desktop LCP 0.58 s, CLS 0; services LCP 1.18 s, CLS 0 |
| Explorer clicks at 4× CPU | 47 of 48 clicks ≤ 72 ms; one at 312 ms with no long task or portfolio rotation behind it (cause not found) |

### Copy alignment check (2026-11-18, round 3)

| Check | Result |
|---|---|
| Keys | 37 `…D` variants added (EN + HU), D-only keys edited in place; no shared key changed (`git diff` of `content.js` vs HEAD: 0 removed lines); EN/HU parity 307/307; every `data-i18n` key resolves, HTML fallbacks equal EN |
| Free-audit sweep | no "free (data) audit" / "ingyenes audit" wording anywhere in `versions/d`; all "Book a free discovery call" buttons go to the calendar link |
| Accuracy | CNC: "possible cause", needs checking; explorer caption names only what `modes.js` computes (least-squares trend, k-means groups) |
| Layout, HU + EN at 320 / 390 / 1440, both pages | no horizontal overflow, no clipped buttons or headings, no raw keys, no JS errors; one fix: "k-means" kept on one line in the caption (word joiner) |
| Explorer at 320 (HU) | tabs "Eltéréskeresés / Előrejelzés / Csoportosítás / Osztályozás" fit the 2×2 grid; labels inside the chart in all four views |
| Language toggle | HU → EN → HU swaps every D key (title, hero, CTA, note, tagline, tabs, portfolio note) and returns identical text |
| Quote links | prefill the form with the D package titles; package anchors `#pkg-*` intact |
| Contact form (endpoint blocked) | error text is the D variant |
| Version A | no file changed; its HU copy renders the original keys; no `…D` key used |

### Final wording decisions (2026-11-18, round 4)

| Check | Result |
|---|---|
| Keys | `finalcta.titleD` added (EN + HU); `packages.integrated.textD`, `packages.monitoring.textD`, `solution.feature1D` (EN) updated; parity 308/308; i18n check 0 problems; no shared key changed |
| Layout, HU + EN at 320 / 390 / 1440, both pages | no horizontal overflow, no clipped buttons or headings, no raw keys, no JS errors |
| Final CTA | h2 = invitation ("Kezdjük egy ingyenes konzultációval"), h3 = "Miről szól az ingyenes konzultáció?" over the list; reads cleanly at 1440 and 320 |
| Package consistency | homepage and services use the same title/meta keys for every package; package texts appear only on services; no homepage copy contradicts them |
| Versions A, B, C | no file changed |

### Post-commit quality gate and pause-button fix (2026-11-19)

| Check | Result |
|---|---|
| Defect (P2, confirmed by hit-testing and a manual real-browser test) | on wide screens (≥ 60em) the hero pause button did not respond to a mouse click while the hero was in view; keyboard worked, and the mouse worked after scrolling ~200 px |
| Root cause | the wide-screen `.hero` spans the stage column (`grid-column: text-start / stage-end`) at `z-index: 1`, above the sticky `.stage` (`z-index: 0`); the button's `z-index: 3` only applies inside the stage's stacking context, so the hero's empty box intercepted pointer events meant for the button |
| Fix | `versions/d/style.css`, inside the existing `@media (min-width: 60em)` block: `.hero { pointer-events: none; }` and `.hero__copy { pointer-events: auto; }` (headline, lead, CTAs and byline all sit in `.hero__copy`); no z-index, layout, visual, animation or JavaScript change |
| Regression (real CDP mouse, wheel and key input, headless Edge; EN + HU) | 10 of 10 runs pass: 1024×768, 1280×800, 1440×900, 768×1024, 390×844 in both languages. Pause hit-test lands on the button at scrollY 0; click pauses (`aria-pressed`, canvas still, no story frames) and resumes; works after scrolling; both CTAs clickable; text selectable by drag and double-click; Tab reaches both CTAs and pause with visible, uncovered 2px rings; Space/Enter toggle pause; Enter on a CTA navigates; story steps 1→4 down and 4→1 up |
| Before the fix (same script, 1440, EN) | 3 failures: hit-test (`SECTION.hero`), mouse pause, pause focus ring covered by the hero |
| Phone and tablet (390, 768) | unchanged: the rule is scoped to ≥ 60em, the hero computes `pointer-events: auto` there |
| Lab re-measure (clean runs, paired with Version A, same profile as round 2) | homepage phone LCP 1.44 s EN / 1.34 s HU (A: 1.46 s), CLS 0, INP proxy 32 ms (A: 216 ms); desktop LCP 0.54 s (A: 0.61 s); no regression; story frame cost ≤ 2.3 ms desktop, ≤ 5.8 ms at 4× CPU; no DOM or listener growth across repeated interaction |
| Status | P2 resolved. Version D is ready for deployment preparation, subject to final real-device checks (Safari, Firefox and real devices not yet tested) |

### Mobile explorer order (2026-11-19)

| Check | Result |
|---|---|
| Change | single-column layout (`max-width: 900px`, phones and portrait tablets): heading, lead, chart, the four questions (2×2), text, caption – the chart stays above the thumb while switching. The chart (`aria-hidden`, not focusable) now sits outside the `<figure>`; `.modes__side` (plain div) gets `display: contents` and the chart is ordered above the questions. Desktop grid places chart and figure in the right column as before. No copy, JS, animation or highlight change |
| Reading and Tab order | Chromium accessibility tree identical to before (heading, lead, question group, text, caption); Tab visits the four questions with visible rings, then the next section |
| Phones 320×568, 360×640, 390×844, 430×932, EN + HU (real touch) | chart above the questions; all four views switch, page does not scroll on tap; chart + questions fit under the sticky header (129–453 px to spare); tabs ≥ 76 px tall; no horizontal overflow; no clipped or overlapping chart labels in any view |
| Desktop 1024, 1280, 1440, EN + HU | section screenshots byte-identical to before; element positions, reading order and Tab order identical |
| Fallbacks | no script: the four texts as a list, same 48 px gap under the lead as before; reduced motion: same order, points jump, fades only; 768: same order, no overflow |
| Not tested | Safari/iOS, Firefox, real phones, a real screen reader |

### Mobile portfolio: card deck and filter sheet (2026-11-19 – 2026-11-20)

All runs: headless Edge (Chromium) over CDP with real touch, mouse and key input, DPR 2;
`versions/d/index.html` served by the local preview server.

| Check | Result |
|---|---|
| Change | ≤ 840 px only: single-card deck (two stacked layers, finite, arrows + "n / total", swipe, no auto-rotation) and a count + Filter bar opening a native `<dialog>` bottom sheet with multi-select types; transactional draft (only "Show {n} projects" applies). Desktop portfolio unchanged |
| Layout, 320×568 / 360×640 / 390×844 / 430×932, EN + HU | order heading › subtitle › bar › deck › nav › stats › note › CTA; desktop-only parts hidden; no horizontal overflow before or after interaction; no clipped or wrapped sheet labels; sheet targets ≥ 44 px; Show button 46 px tall and inside the viewport |
| Deck | arrows step 1 → 3 and stop (no wrap), `aria-disabled` at both ends; swipe left/right turns the card; a vertical drag over the card scrolls the page (145–267 px); front card unchanged after 5 s (no autoplay); non-front cards `inert`; live region reads "Project 2 of 3: …" / "Projekt 2 / 3: …" |
| Transactional sheet, 320 / 360 / 390, EN + HU (122 checks, all pass after one test-expectation fix: the desktop "All" chip label) | X, Escape and backdrop tap each discard two ticked types: count, badge, card (2 / 3) and scroll position unchanged, no announcement, focus on Filter; reopen shows the applied ticks; Show applies (count "2 of 3 projects" / "3 projektből 2", badge 2, "Filter, 2 selected" / "Szűrés, 2 kiválasztva", deck 1 / 2, announced, page does not move); unticking then X keeps the applied pair and card 2 / 2; Clear empties the draft only (Escape afterwards keeps the filters); Clear + Show clears and announces "3 projects" / "3 projekt"; Show with no change keeps the card and stays silent; keyboard: Enter opens with focus on the first option, Space ticks, Escape discards |
| Empty state (forced by removing a type from the data in page memory; cannot occur with current data), 320 / 360 / 390, EN + HU | message + 44 px "Clear all filters" / "Szűrők törlése" button, count "0 of 3 projects" / "3 projektből 0"; tapping Clear restores 3 cards at 1 / 3, the live region announces "3 projects" / "3 projekt", focus moves to Filter |
| Status group (forced: a second status in page memory), 390 HU | sheet shows "Szűrés állapot szerint" above the types; ticking a status narrows the types to that status's projects; X discards it |
| Breakpoint crossing with the sheet open (390 → 1280) | sheet closes, scroll lock released, draft discarded, desktop chips show "All", no `inert` cards left; desktop chips still filter directly |
| Rendered contrast (viewport screenshots; background = darkest/brightest pixel 2–5 px around the text line, text = computed colour, cross-checked with glyph pixels) | Show button (gold `.btn--primary`, ink `--on-gold`): EN 8.49–9.01:1, HU 7.65–8.40:1 at 320–430; Clear all filters active 12.61:1, inactive (muted) 8.5:1; type labels 15.33:1; count 13.27:1; Filter label 14.85:1; counter 16.29:1; arrow icon enabled 11.8:1, disabled 3.4:1 (opacity 0.45) |
| Reduced motion, 390 EN + HU | all 42 transactional, empty-state, status and desktop checks pass; arrows and swipe pass; a swipe turns the card without the card following the finger |
| No script, 390 | no count bar, sheet closed and hidden, no horizontal overflow |
| Desktop 900 / 1024 / 1280 / 1440, EN + HU | portfolio section screenshots pixel-identical to a pre-change baseline (run-to-run noise in the baselines themselves: up to 686 px in the sticky filter column); section tops, heights and document heights identical |
| Fixed during testing | an 11 px page shift after Show at HU 360 (scroll anchoring on the stats, which precede the deck in the DOM: `overflow-anchor: none` on stats and note); disabled arrows raised from 2.9:1 to 3.4:1; the empty state's Clear now announces the count |
| Not tested | Safari/iOS, Firefox, real phones and tablets, a real screen reader (NVDA, Narrator, VoiceOver, TalkBack) |

### SEO launch build (2026-11-20)

Lab only: headless Edge (Chromium) over CDP with real mouse/touch/key input; `dist/` served on
:4174 and the source pages on :4173 by the local preview server. Formspree requests were
intercepted in the browser (a probe confirmed interception first); no enquiry was sent.

| Check | Result |
|---|---|
| `node tools/check-site.mjs` | OK: 34 files, all allowlisted; no Markdown, docs, tools, dot-files, `CNAME` or other versions; 4 indexable pages with self canonicals, reciprocal hreflang hu/en/x-default, unique titles and descriptions; sitemap = those 4 URLs with the same alternates; robots allows all, OAI-SearchBot explicitly, no GPTBot rule, sitemap listed; JSON-LD parses, no offer/price/review/address/legal keys; every reference resolves; no retired CNC claim |
| Checker catches mistakes (mutation test) | planted `CLAUDE.md` + `docs/qa-checklist.md`, a wrong canonical, a broken hreflang and a GPTBot `Disallow`: 12 problems reported, exit 1; clean rebuild passes |
| Copy before JavaScript, 2 pages × HU/EN | every `data-i18n` text and translated aria-label/placeholder/title in the raw HTML equals the source page rendered by JavaScript in that language (and the generated page after JavaScript); `<html lang>` and `<title>` match |
| Language fixed by URL | with the other language in localStorage and as browser language, each page stays in its own language, adds no `?lang`, no link carries `lang=`; the switch is an `<a>` to the counterpart page and a click lands there |
| Old links | `/?lang=en` → `/en/`; `/?lang=hu`, `/?lang=xx` → `/` (parameter dropped); `/en/?lang=hu#contact` → `/#contact`; `/en/?lang=en&utm_source=x` keeps `?utm_source=x`; `/szolgaltatasok/?lang=en#pkg-audit` → `/en/services/#pkg-audit`; old `versions/d/index.html` / `services.html` / `d/` with `?lang` → matching page, without `?lang` → browser language |
| Links and assets | every same-site `href`/`src`/`srcset` on the 4 pages returns 200; nav targets per page and language correct (services → `/#method`, `/#projects`, `/#about` or `/en/#…`); calendar links, `mailto:hello@anominsight.com`, Formspree action unchanged; all `target=_blank` links `noopener` |
| Contact form | `/en/services/`, `/szolgaltatasok/` (after a "Get a custom quote" click: hidden `package` field set, message prefilled) and `/`: POST to `https://formspree.io/f/xjykwlyk` with `Accept: application/json`, success message in the page language |
| No JavaScript | `/` and `/en/` show the three case studies (description, overview, metrics, categories, GitHub link) in the HTML; services pages list all 5 packages; no horizontal overflow at 390 / 1440 |
| Visual parity, 2 pages × HU/EN × 1440 / 390, reduced motion | geometry of header, sections, headings, buttons, forms, stage and packages identical to the source pages, same document height; top-of-page screenshots pixel-identical (0 px) |
| Regression suites on the generated pages | integration (hero pause, explorer, mobile portfolio, interference; 1440 / 390 / 320, EN + HU): 42 / 42; transactional filter sheet (320 / 360 / 390, EN + HU): 122 / 122 |
| Other versions after the shared-file edits | A (home, services), B, C and the source D pages load in EN and HU with no console errors or failed requests; A's portfolio shows the corrected CNC text |
| Fixed during testing | `images/icons/expand-arrows.png` (referenced from `portfolio.js`) was missing from the artifact – the build now follows page-relative image paths in JS; 404 page spacing; no-JS case-study list clipped by the deck's rounded corner |
| Not tested | production (nothing deployed), Safari/iOS, Firefox, real devices, screen readers, Google Rich Results Test / Search Console (need the live URL or account access) |

### Pre-commit adjustments (2026-11-20, user-requested)

| Check | Result |
|---|---|
| Version A proof label | A renders the new A-only key `proof.recall.labelA`: EN "recall on synthetic test data", HU "visszahívási arány szintetikus tesztadatokon" after the "96%" value; tile layout intact (HU screenshot). B and C still render `proof.recall.label` unchanged; D unchanged; A (home, services), B, C, D load in EN and HU with no console errors or failed requests |
| x-default | every generated page and the sitemap point `x-default` to the Hungarian page; `check-site.mjs` now enforces it; canonical, hreflang (hu, en, x-default), `og:locale` and JSON-LD `inLanguage` verified in the browser on all 4 pages (45 / 45 SEO checks pass) |
| Workflow | parsed with js-yaml 3.14.1 (already installed locally inside a VS Code extension; nothing downloaded): valid YAML; only trigger `workflow_dispatch` (no inputs); no other trigger keyword; top-level permission `contents: read`, deploy job `pages: write` + `id-token: write`; build runs exactly build + check; artifact path `dist`; `configure-pages` without `enablement`. Mutation test: an added `push` trigger and a broken indentation are both caught. Not validated against GitHub's own workflow schema or actionlint (not available locally) |
| Content review of the generated pages | every external link and contact detail: calendar link, `mailto:hello@anominsight.com`, Formspree `xjykwlyk`, GitHub org + 3 repos (200), LinkedIn (same URL as before; LinkedIn answers automated requests with 999, not verifiable); no phone numbers, no `info@`. No other-language strings left on any page (404 is bilingual by design, its English part is `lang="en"`). Fixed: HU static case-study list showed "99.27%" / "~2.4:1" – now "99,27%" / "~2,4:1". Claims checked against the repos and confirmed facts; open item: the digit study's mail-sorting framing (see CLAUDE.md Open questions) |
| Visual parity | top-of-page screenshots of the 4 generated pages at 1440 and 390 still pixel-identical to the source pages |

### Digit study wording (2026-11-20, user-approved)

| Check | Result |
|---|---|
| Facts against the repository | `01_Portfolio_Project` README: CNN 99.27% on the 10,000 MNIST test images; mail sorting is a hypothetical context, no postal data or live operation. Matches the approved wording |
| Version D, JS-rendered | card title + description and the detail dialog show the new EN / HU wording on the generated `/` and `/en/` (1440 and 390) and on the source D page; repository link unchanged; metrics unchanged (99.27% / 5 / CNN) |
| No-JS static list | the generated homepages' `#portfolioTrack` list carries the new title, description and overview (HU "99,27%") |
| Old postal framing | none on any generated page, rendered or static; `check-site.mjs` now fails on it (mutation test: the old title put back into `/en/` is caught) |
| Category label (`kindD`) | D card, detail dialog and no-JS list read "Computer Vision" / "Számítógépes látás"; D's "Industries covered" tile shows 2 (Manufacturing, Hospitality) on the generated and source pages, EN / HU, 1440 / 390; A still shows "Logistics" and 3 |
| Versions A, B, C | still render the shared text unchanged ("…for mail sorting" / "…levélválogatáshoz") |
| Regressions | check-site OK; 45 / 45 SEO checks; top screenshots of the 4 pages at 1440 / 390 pixel-identical (0 px); content review: no leftover-language strings (404 bilingual by design); A, B, C, D smoke unchanged; integration 42 / 42; transactional filter sheet 122 / 122; 0 headless browsers left |
