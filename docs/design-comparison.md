# AnomInsight — design direction comparison

Four runnable versions of the same site. Same product, same content, same business goal (a free
data audit request). They differ in visual language, composition, typography, hierarchy, interaction
and motion philosophy.

**No version is recommended here.** This document exists so the choice can be made on evidence
rather than first impression.

## Where to view them

| | Version | Open |
|---|---|---|
| — | Original | `src/frontend/versions/original/index.html` (identical to the live `src/frontend/index01.html`) |
| **A** | Reimagined Original | `src/frontend/versions/a/index.html` |
| **B** | The Audit Dossier | `src/frontend/versions/b/index.html` |
| **C** | The Control Room | `src/frontend/versions/c/index.html` |
| — | Launcher linking all four | `src/frontend/versions/index.html` |

All four are static files with no build step. A, B and C load ES modules, so opening them straight
from disk via `file://` is blocked by the browser's module security rules — serve the repo over HTTP
instead. Any static server rooted at the repo works:

```
npx serve .
# then open http://localhost:3000/src/frontend/versions/
```

The Original copy opens fine either way (it has no module imports).

---

## Original — immutable reference

**Status: exact copy, kept unchanged forever.** `src/frontend/versions/original/` contains
`index.html`, `style.css` and `js/{main,i18n,portfolio,contactForm,closingRotor}.js` — a byte-for-byte
copy of the current `src/frontend/index01.html`, `style01.css` and `src/frontend/js/*.js`, with the
**only** changes being the relative asset paths that had to change because the copy lives one
directory deeper (`../../images/...` → `../../../../images/...`, and `style01.css` → `style.css`).
Every line of markup, every CSS rule, every script is otherwise identical — verified with a raw
`diff` against the live files, not just eyeballed.

The live `src/frontend/index01.html` (and its CSS/JS) were **never touched** at any point in this
work. This copy exists purely so Original has its own stable URL to sit next to A, B and C for
side-by-side comparison; the actual site file it mirrors continues to exist at its current path,
unmodified.

**Design concept, as shipped today.** A warm, premium dark marketing page. Amber and tan accents on a
near-black warm ground, generous rounded cards, pill buttons, soft shadows. Content is presented as a
sequence of marketing sections, each introducing itself with a heading and a row of icon cards. The
portfolio is a 3D auto-rotating card deck with filters and a detail modal; the page closes with a
scroll-driven "rotor" that pins three panels (roadmap, audit contents, contact) in a 190vh shell and
rotates them in 3D as you scroll.

**Verification.** Loaded fresh, walked through every section, and diffed screenshots against the live
`index01.html`: zero console errors, zero broken images (three images use `loading="lazy"` and only
resolve once scrolled near — confirmed, not a defect), identical 6,515px document height, and a pixel
diff of ~0.003% after eliminating two unrelated capture-timing artifacts (see *Testing notes* below).
`git status` confirms no baseline file was modified.

This version exists as the fixed point everything else is judged against — see **Version A** below
for what changed and why.

---

## Version A — Reimagined Original

**Design concept.** The same product, told through the same information architecture, with its visual
design and UX rebuilt from the ground up. Nothing about *what* the site says changed; a great deal
about *how* it says it did. Same warm dark ground, same amber/gold accent pair, same Manrope +
Source Sans 3 pairing (DESIGN.md marks color and typography "controlled" — improved, not replaced) —
executed with a real spacing and type scale, fixed compositional problems the Original carries, and
two new sections that were agreed additions rather than redesign scope-creep (a proof band, a founder
section).

**What changed and why, concretely:**
- **Problem + Solution merged.** The Original renders these as two back-to-back four-icon grids that
  read as the same component repeated. A now presents them as one two-column composition — problems
  on the left, capabilities on the right, connected by an arrow — using the exact same copy, just
  structured as the contrast it actually is.
- **A "Measured results" band pulled up near the top**, right under the hero, surfacing the same four
  real figures (96% failure-catch rate, 99.27% best-model accuracy, 4+ years, 3 published case
  studies) that the Original doesn't state until the portfolio section, deep in the page.
- **A founder/About section**, matching the agreed principle that AnomInsight is one identifiable
  person. Text-led by design (see *Known issues*).
- **The closing scroll-rotor is gone.** Roadmap, audit contents and contact are three ordinary
  sections in normal document flow instead of a 190vh scroll-jacked 3D stack — a real UX and
  performance improvement (less dead scroll distance, no scroll-hijacking, works identically under
  reduced motion), not a content cut. Every roadmap item, every audit-contents bullet, the entire
  contact form: unchanged.
- **The portfolio section is the Original's, restored.** DESIGN.md marks it protected. A first
  restyled it to A's own tokens; that was reverted on review, and the section's stylesheet is now
  lifted verbatim from the Original — same sidebar card, same filter chips, same 3D deck geometry,
  same stats, nav and modal. The only deviations are the dropped "Portfolio" eyebrow (the craft
  floor bans kickers above headings) and the shared content module's copy, which is A/B/C's
  first-person rewrite rather than the Original's. The deck's JS is re-implemented against that
  shared module so its data stays in sync with B and C; the interaction is unchanged.
- **The Original's white icons are kept.** The circular accent badges with white-filtered PNG art
  (`brightness(0) invert(1)`) carry the Problem/Solution rows, the service cards and the advanced
  cards, as they do in the Original, rather than the line-SVG set A briefly used.
- **Nav gains a fifth link** ("About") for the new section; otherwise the same fixed-top-bar +
  hamburger pattern.

**Target impression.** The same brand, executed at a materially higher level of craft: "this is
obviously the same company, and it obviously got better."

**Visual characteristics.** Same tokens as the Original (`--bg #090806`, `--accent #d9a36b` →
`--accent-2 #f0c882`, Manrope/Source Sans 3), but a real 4px-based spacing scale used consistently,
a genuine type-scale jump between chapter headings and body (the Original's own detector-flagged flat
step is not present here), refined card hover states (transform + border + shadow, not just one),
themed focus rings, selection color and scrollbar.

**UX characteristics.** Fixed top nav, five links. Hero: heading/copy/CTAs plus the same credentials
card the Original ships (unchanged content, restyled). Proof band. Merged Problem+Solution. Services
and Advanced Analytics as card grids. Portfolio deck (protected, unchanged mechanic). Founder section.
How It Works, Who This Is For, What You Gain — same structure, refined styling. Roadmap, Final CTA,
Contact — plain sections, no rotor.

**Animation approach.** One motion system in two registers rather than one identical entrance
everywhere (the craft-floor's own warning against that): text sections fade up as a single block;
grid sections (cards, steps, the value list) additionally stagger their own children by a short, fixed
increment. Both skip entirely under reduced motion. No scroll-jacking anywhere.

**Strengths.** Directly fixes the two most concrete, previously-documented weaknesses of the
Original (icon-grid repetition, proof buried below the fold) without inventing a new visual world —
lowest risk of the three redesign directions for a stakeholder who wants "better," not "different."
Reuses the protected portfolio component verbatim in mechanic. Removes the Original's heaviest,
least-accessible interaction (the scroll-jacked rotor) for a net UX gain.

**Trade-offs.** The least differentiated of the three alternatives, by design — it is deliberately an
evolution, not a departure. A stakeholder looking for a bold new identity should look at B or C
instead. Still uses three Google-Fonts weights of two families plus the original's own icon
treatment, so it inherits rather than solves the CDN-webfont dependency noted for B/C.

**Suitability.** The safest of the three alternatives to ship without further internal debate about
brand identity, since it is legibly "the same site," just better. Best fit if the goal is incremental
credibility improvement rather than repositioning.

**Implementation complexity.** Low-moderate. Reuses the shared content module (`src/frontend/shared/`)
like B and C; the portfolio carousel is a faithful adaptation of the Original's own `portfolio.js`
rather than a rewrite, so its logic carries over almost mechanically. The removed rotor simplifies
runtime complexity relative to the Original.

---

## Version B — The Audit Dossier

**Design concept.** The site *is* the artefact the practice sells: a bound technical audit report.
Cool office paper, graphite ink, ruled tables, numbered chapters, lettered exhibits, a title block, a
signature page, an ink back cover. It refuses the marketing card grid entirely — structure and rules
do the work a border and a shadow would otherwise be asked to do.

**Target impression.** Rigorous, evidential, unhurried. "This person documents their work and will
document mine."

**Visual characteristics.**
- Paper `#eeeff0` (deliberately cool, not cream), ink `#15171a`, one marker yellow `#f3e04b`.
  Effectively monochrome plus a single highlighter.
- Archivo (display), Spectral (body — a face commissioned for on-screen document reading), Spline
  Sans Mono, used strictly for references, codes and figures.
- No cards, no shadows, no gradients, near-zero icons. Hairline rules, wide margins, a large type
  scale jump between chapter headings and body.
- Closes on a full ink back cover, which is the only tonal break in the document besides the proof band.

**UX characteristics.** A sticky contents rail across the top numbers six chapters and tracks the
current one; on mobile it becomes a horizontally scrolling strip with a fade mask rather than a
hamburger. The problems become a three-column findings table (ref / finding / what it costs). Services
become a numbered scope-of-work list. The case studies become Exhibits A–C: a left metadata column
(industry, status, repository) against the write-up, its three real metrics, and an inline disclosure
that expands the full overview in place — no modal. Tables reflow into labelled blocks below 48rem.

**Animation approach.** One authored moment, and nothing else moves on scroll: a marker sweep wipes
across each of the four measured figures as they enter the viewport — the gesture of a reader
highlighting the finding that matters, which is the service itself in one movement. The same marker
is reused as the active-filter state, so selection and emphasis share a vocabulary. Exhibit expansion
animates via `grid-template-rows`, so it reaches natural height without a measured max-height guess.
Under reduced motion the marker still marks; it simply arrives instead of sweeping.

**Strengths.** Strongly differentiated from anything in the category — it cannot be mistaken for a
template or for an AI-startup page. Evidence is structural, not decorative: figures carry their source
on the same row. Reads well printed or shared as a PDF-like artefact. Light theme suits daytime desk
reading and email-forwarding. Lowest runtime complexity of the four.

**Trade-offs.** Deliberately quiet — it will read as conservative next to C, and a visitor expecting a
modern "tech" look may read it as plain. It is by some margin the longest page of the four at desktop
width (9,154px against the Original's 6,515px), because the document grammar spends vertical space on
rules and margins. A serif body face at 17px is excellent for reading and less "software" in feel. One
tonal break carries the whole page's pacing.

**Suitability.** Strong for an ops or plant manager who buys on evidence, and for anyone who will
forward the page to a colleague. Its register matches how industrial procurement actually reads.
Weaker if the goal is to look like a software product.

**Implementation complexity.** Low. 1,623 lines of CSS, 362 lines of JS, three webfont families, no
dependencies. The only non-trivial mechanics are the scroll-spy and the disclosure animation.

---

## Version C — The Control Room

**Design concept.** The site adopts the screen this audience already reads all day: a plant
SCADA/HMI console. Bordered modules with title bars, status LEDs, coded rows, monospaced readings, a
persistent nav rail. Everything is rectilinear and flat because an instrument panel has no shadows,
gradients or glows.

**Target impression.** Operational, precise, in-service. "This was built by someone who has stood in
front of a machine."

**Visual characteristics.**
- Cool graphite `#0d1012` ground, `#12161a` module fills, hairline `#242c33` borders, 2px radii.
  Deliberately cool where the other three are warm.
- Barlow Semi Condensed (display/labels — signage lineage), Barlow (body), Azeret Mono used *only*
  for values, codes and measurements, never for prose.
- Status colour is functional, never decorative: green = available, amber = in development or on
  request, red = fault condition. The primary action is a solid industrial green, not an accent glow.
- Authored 20px line icons at a single stroke weight for the four disciplines; LEDs are the only
  round shape in the system, because that is what an indicator lamp is.

**UX characteristics.** A persistent left rail (≥64rem) carries navigation, language and practice
status, and tracks the current section; below that it collapses into a top bar with a disclosed panel.
Content is a grid of modules rather than a scroll of sections, so density is high and scanning is fast.
The case studies become a project log: coded records (R-01…R-03) with status, tags and metric readouts
in tabular figures, filterable by status and type, each opening a focus-trapped detail drawer that
slides in from the right (Escape closes it, focus returns to the trigger). The register of current vs
in-development capability is a natural fit for the LED vocabulary.

**Animation approach.** One authored moment: instrument initialisation. An accent line sweeps the top
edge of the two data modules as they enter view and then fades. The measured figures deliberately do
**not** animate — counting 96% up from zero would render values that were never measured, directly
under a line reading "Nothing here is a projection", and an instrument latches a reading rather than
ramping to it. Only genuinely in-development status dots pulse. Everything else — hover, filters,
drawer — is immediate or a short transform. Under reduced motion the sweep is removed and the pulse
stops.

**Strengths.** The most immediately distinctive of the four, and the one whose form argues the
product: it looks like monitoring because the practice sells monitoring. Highest information density —
a visitor sees far more real content per screen. The status vocabulary lets the roadmap and the
"on request" tier state themselves without extra copy. Dark UI suits a night-shift/control-room scene.

**Trade-offs.** The strongest commitment, therefore the strongest opinion — a visitor who wanted a
reassuring consultancy brochure may find it cold or intimidating. Density leaves less breathing room
for persuasion, and the hero is the only place the page raises its voice. Its `<h2>`s are small
uppercase title-bar labels while visual weight sits in a larger paragraph, so heading elements do not
carry the size hierarchy (see Known issues). Mono numerals open a visible gap around decimal
separators, which is honest to the idiom but unusual in marketing typography.

**Suitability.** Strong for technical leads and plant/ops managers who live in exactly this kind of
interface. Also the clearest expression of the "consulting practice becoming a platform" ambition,
since it already looks like a product surface. Riskier with a non-technical owner or a first-time
buyer who reads density as complexity.

**Implementation complexity.** Moderate — the most JS of the four, though still small: 1,681 lines of
CSS, 477 lines of JS. The drawer (focus trap, Escape, focus restoration, state sync when filters or
language change under it) is the most intricate component in any of the versions.

---

## Comparison table

| | Original | A — Reimagined Original | B — Audit Dossier | C — Control Room |
|---|---|---|---|---|
| **Visual direction** | Warm dark marketing page, established brand as shipped | Same brand, rebuilt composition and hierarchy | Bound technical audit report | Plant SCADA/HMI console |
| **Typography** | Manrope + Source Sans 3 | Manrope + Source Sans 3 (real type scale) | Archivo + Spectral + Spline Sans Mono | Barlow Semi Condensed + Barlow + Azeret Mono |
| **Layout** | 12 stacked sections, repeating icon-grid formula, scroll-jacked closing rotor; fixed 1600px container | Merged Problem+Solution, proof band added, founder section added, rotor removed for plain flow; portfolio section restored to the Original; container steps 1240→1380→1560→1720px with growing gutters | Numbered chapters, ruled tables, lettered exhibits, sticky contents rail | Bordered modules in a grid, persistent nav rail, coded project log |
| **Color system** | Near-black `#090806` + amber/gold gradient accent | Same tokens, same accent, more disciplined use | Cool paper `#eeeff0` + graphite ink + one marker yellow | Cool graphite `#0d1012` + functional green/amber/red status |
| **UX** | Fixed top nav, 3D auto-rotating portfolio deck + modal, scroll-driven rotor | Fixed top nav (+About), the Original's deck restored in full (presentation as well as mechanic), no rotor | Sticky numbered rail, inline exhibit disclosure, no modal | Persistent rail, filterable log, focus-trapped side drawer |
| **Animations** | Several systems: per-section reveal, deck stagger, scroll-lerped 3D rotor, hover lifts | Two-register reveal (block fade / staggered grid), no scroll-jacking | One: marker sweep across measured figures | One: instrument initialisation sweep, no false-precision counters |
| **Perceived brand positioning** | Contemporary, polished, approachable — "a capable modern studio" | The same positioning, delivered with materially higher craft | Rigorous, evidential — "documents the work" | Operational, in-service — "built by someone who runs the machine" |
| **Strengths** | Already shipped, established, warm/personable | Fixes documented weaknesses without changing identity; lowest-risk alternative | Most differentiated; structural evidence; printable/forwardable | Most distinctive; highest density; argues the product through form |
| **Weaknesses** | Icon-grid repetition; proof buried; heaviest/least-accessible interaction (rotor); mixed "we"/"I" voice | Least differentiated of the three alternatives — an evolution, not a departure | Longest page (9,154px); reads conservative next to C | Coldest/most opinionated; density can read as complexity to a non-technical buyer |
| **Implementation complexity** | As shipped (highest runtime complexity: lerped rotor + 3D deck + timers) | Low–moderate; reuses Original's portfolio mechanic verbatim | Low; 1,623 CSS / 362 JS lines, no dependencies | Moderate; 1,681 CSS / 477 JS lines; focus-trapped drawer is the most intricate component of the four |

---

## What is identical across all four

Deliberately, so the comparison is about design and not content:

- The same three real case studies, with the same metrics (96% failure catch rate, 99.27% best-model
  accuracy, five model families compared, LightGBM/CNN/Groq) and the same public repository links.
- The same services, advanced tier, four-step method, five sectors, five outcomes, and roadmap split.
- The same conversion path: free data audit as primary CTA, Google Calendar booking as secondary,
  Formspree contact form (with honeypot) and direct email as the fallback.
- Full English/Hungarian parity, with browser-language detection and a stored preference.
- No testimonials, no client logos, no pricing, no invented figures.

**One deliberate exception:** the hero's opening two lines. Original keeps its shipped marketing
line verbatim. A, B and C each state the same offer in their own register instead of repeating a line
that puts the industrial focus in a metadata field rather than the first sentence — A stays closest
(same structure, same credentials card), B titles itself like a report, C names the failure it catches.
Nothing below the hero differs in substance between any of the four.

A, B and C share one content layer — `src/frontend/shared/content.js` holds every string and all
case-study data for all three, so copy is edited once rather than three times. The Original keeps its
own copied, untouched `js/i18n.js` and `js/portfolio.js`; nothing about it depends on the shared
module.

## Architecture

```
src/frontend/
  index01.html, style01.css, js/      ← the live site file, untouched throughout this work
  shared/
    content.js       EN/HU copy + the three case studies (single source of truth for A, B and C)
    i18n.js          language controller: detection, storage, subscribers
    motion.js        reduced-motion helpers, one-shot observer
    contactForm.js   Formspree submit + inline status
  versions/
    index.html        launcher linking Original, A, B and C
    original/          exact copy of index01.html / style01.css / js/*, paths adjusted only
      index.html style.css js/main.js js/i18n.js js/portfolio.js js/contactForm.js js/closingRotor.js
    a/  index.html style.css main.js portfolio.js
    b/  index.html style.css main.js labels.js
    c/  index.html style.css main.js labels.js
```

Each direction owns its markup, visual system and interaction code; only content and the shared
behaviour helpers are reused. `labels.js` (B, C) holds the chrome words that layout invents (chapter
names, module titles), so shared content stays free of direction-specific vocabulary. A needed no
separate labels file — its IA maps directly onto keys already in the shared content module.

## Verification performed

**Original**, checked against the live `index01.html` it mirrors:
- Line-by-line `diff` of every HTML/CSS/JS file: the only differences are the relative asset-path
  depth adjustments the relocation requires (documented above) — confirmed with a raw text diff, not
  a visual comparison alone.
- Loaded fresh: zero console errors, zero broken images, identical 6,515px document height.
- `git status` confirms the live baseline files were never modified.

**Version A**, Playwright driving real Chrome, three rounds:
- Zero console errors, zero page errors, zero failed requests, zero broken images, at 1440/834/390.
- No horizontal overflow at any of those widths, in English and Hungarian.
- Portfolio filter narrows 3→1 and clear-all restores 3; the detail modal opens and closes; the
  founder section renders real content; the mobile menu opens.
- **A real layout bug was found and fixed:** the hero heading initially rendered clipped behind the
  fixed nav bar (the nav's height wasn't compensated for at the body level). Fixed by adding
  `body { padding-top }` sized to the nav's measured height and correcting the hero's own padding,
  which had been sized to do that job itself before the fix; verified clear via a direct DOM
  measurement (`h1.top >= header.bottom`), not just a screenshot.
- **Contrast:** an automated check that makes each candidate text element's own color transparent and
  reads the true rendered pixel behind it (more reliable than walking ancestor `background-color`,
  which doesn't resolve this page's gradient background) found two real issues — a nav-link color at
  4.11:1 against the translucent blurred nav, and a false alarm on the skip-link that mathematically
  resolves to 11.32:1 in its real focused state. Both nav-related values were adjusted; re-verified at
  11 scroll depths with zero real failures remaining.
- **Design detector:** `impeccable detect` flagged gradient text on the proof figures (a real finding,
  fixed — solid color now, weight carries the emphasis) plus the same `low-contrast` and
  `cramped-padding` false-positive classes already documented for `index01.html` and for B/C in this
  session (gradient-background misresolution; hairline dividers misread as container boundaries).
  Verified with real measurement before suppressing; two advisory-only findings (thin border + wide
  shadow blur) were left as-is because they match the Original's own already-shipped shadow language.

**B and C**, unchanged from the prior round, re-verified clean after this round's work touched only
`shared/content.js` (two additive keys) and `versions/a/`, `versions/index.html`: zero console errors,
no overflow, filters/disclosure/drawer/mobile-nav all still behave correctly in both languages.

**Testing notes** (methodology, not page defects — recorded so the numbers above are legible): this
session's full-page screenshot captures of any page using `position: fixed` proved unreliable after a
rapid synthetic scroll — the fixed element occasionally composited at the wrong position or went blank
in the *stitched* image, on the byte-identical Original as well as on new work, while the same content
always rendered correctly in real per-scroll-position viewport captures and in direct DOM measurement.
Version A's contrast automation separately needed a fix for measuring effective element opacity
through ancestors (a portfolio card hidden via an ancestor's `opacity: 0` still reports its own
computed opacity as 1). Both are noted here in case they resurface in future verification work on this
project, not because either affected what ships.

Screenshots are in `.impeccable/review/`.

## Known issues and open items

1. **No founder photograph**, in A, B and C alike. The founder/About sections are text-led by design —
   a portrait was not invented. Supplying a real photo would strengthen all three; the layouts have
   room for one.
2. **Contact email is unresolved.** Every version shows `hello@anominsight.com`, while `PRODUCT.md`
   records `info@anominsight.com` as the brand commitment. Left as-is deliberately; needs a decision
   before anything goes live, in whichever version is chosen (including Original/A, which still show
   the shipped `hello@` address).
3. **A, B and C carry `noindex` and minimal social metadata.** They are comparison builds. Whichever
   direction is chosen needs the Open Graph / Twitter / JSON-LD block that the root `index.html`
   already has, plus canonical URL and sitemap entries, before promotion.
4. **Version C's `<h2>`s do not carry the visual hierarchy.** They are small uppercase module
   title-bar labels (13px) while a 24px paragraph carries the weight — the console idiom, chosen over
   stacking a label above a heading, which the craft floor bans. Document structure for screen readers
   is correct. Worth confirming if C is chosen.
5. **Detector false positives, disclosed rather than hidden.** `cramped-padding` and `low-contrast`
   findings across A, B and C were verified as false positives (hairline dividers misread as container
   edges; gradient backgrounds the static analyzer can't resolve, the same class already documented for
   `index01.html`) and suppressed with narrowly-scoped, evidence-backed ignores in
   `.impeccable/config.json` rather than silently ignored — each entry states what was measured and how.
6. **The Original's two case-study repo links are swapped; A, B and C are fixed.** `01_Portfolio_Project`
   is the MNIST/handwritten-digit repo and `02_Portfolio_Project` is the ai4i2020 predictive-maintenance
   (CNC) one — verified against each repository's own description via the GitHub API. The Original pairs
   them the other way round, so its CNC card links to the MNIST repo and vice versa. That is the
   Original's shipped state and was deliberately left intact, since it is the immutable reference; the
   correction was made once in `shared/content.js`, which fixes A, B and C together. If the Original is
   ever promoted rather than one of the alternatives, this must be fixed there first.
7. **Original's copy still mixes voice.** Its HTML fallback text says "we" while its translation layer
   says "I" (a pre-existing, in-progress fix visible in `git diff` before this work began). This is
   the Original's shipped state and was deliberately not touched. A, B and C are consistently
   first-person throughout.
8. **Webfonts are CDN-loaded** in A, B and C. If a direction ships, self-hosting and subsetting would
   remove a render-blocking third-party request.
9. **Each alternative direction has headroom left, if it is the one chosen:**
   - **A** could still address the CDN-webfont dependency it inherited from the Original, and its
     founder section is the plainest of the three (a monogram tile) rather than a bespoke treatment —
     acceptable given it deliberately avoids introducing a new visual device late in an "evolution, not
     departure" direction.
   - **B** has the look of a report but not yet its full apparatus — no issue date on the title block,
     no running head or folio, evidence sources set as inline prose rather than a numbered note system.
   - **C** never keys its own LED semantics — a real HMI ships a legend saying what amber means, and
     its readings carry units and tolerances; here green/amber/red are only inferable from context.
