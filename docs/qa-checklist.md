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
- [ ] Portfolio (protected): filters, clear-all, stats, rotation, pause, arrows, dots, card focus,
      detail dialog (open, focus trap, Esc, focus return), GitHub links – identical behaviour to A.
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
- **Copy to confirm with the user:** the new stage, map and proof lines (EN + HU,
  `implementation-plan.md` §6); the "4+ years" figure's source ("Practice to date"); the footer
  tagline ("AI-powered data analytics for modern businesses."), which the finish review flags as
  generic but is approved copy shared with Version A.
- **Long phone page:** 17.2 screens at 390px (A: 14.7), mostly the four step frames.
- **Language switch** still costs one long task (~240 ms at 4× CPU) right after the click has painted;
  shared `i18n.js` was not changed for D, because A uses it too.
- **`DESIGN.md`** still describes Version A; refresh it if D is promoted.
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
