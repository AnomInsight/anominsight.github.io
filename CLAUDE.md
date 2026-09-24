# AnomInsight website

> **Memory protocol.** This file is the project's source of truth for durable context.
> Before non-trivial work: read the relevant sections and verify them against the code you touch.
> After meaningful work: update affected sections in place, delete obsolete lines, add one changelog line.
> Record results, not reasoning. Never state an assumption as fact — tag it.
> Current State = what the code does now; decided-but-unbuilt work goes in Priorities.
> Unresolved doc/code mismatches → `[open]` in Open questions; never resolve them by guessing.
> Priority on conflict: latest user instruction > current code > this file > other docs.
> (Maintained with the `project-memory` skill.)

## 1. Project overview
- **What:** Marketing site for AnomInsight, a founder-led AI data-analytics practice (founder: Bence Csomor).
- **Users:** Decision-makers at data-driven SMEs / industrial companies. Full product context: `PRODUCT.md`.
- **Business purpose:** Lead generation for consulting engagements; entry offer is a free 30-min discovery call.
- **Status:** Pre-launch. Root is a Coming Soon placeholder; the real site (Version A) is built but not yet promoted to root. (2026-09-24)

## 2. Product & business context
- Free entry offer = **Discovery Call** (30 min, no obligation), booked via Google Calendar.
- Paid packages, in page order, all **quoted individually, no published prices**: Data Audit · One-off Project Delivery (featured) · Integrated Implementation (Full Handover) (highest tier) · Ongoing Monitoring & Reporting (weekly or monthly cadence, agreed per client).
- Most packages deliver reports and dashboard views; code, pipeline and methodology are **not** handed over.
- Exception: Integrated Implementation — deployment-ready solution + integration support; client gets rights to the project-specific solution, general reusable components/methods stay reusable by the provider. Never word it as exclusive/full ownership of all code; the contract defines IP terms. [pref]
- Contact paths: Formspree form (`https://formspree.io/f/xjykwlyk`), calendar link, email.

## 3. Current state
- **Root `/`** (`index.html`, `style.css`, `script.js`): temporary Coming Soon placeholder. Has its own tiny i18n dict in `script.js`. Don't build features here. [temp — until Version A is promoted]
- **Main site = Version A**, `src/frontend/versions/a/`:
  - `index.html` — homepage: hero (h1 `hero.heading`, lead, CTAs, founder byline + call note, `.signal` anomaly → insight figure), proof band, problem/solution, "What I deliver" capabilities index (#services: core + advanced services as one typographic list, links to services.html), portfolio (protected), founder, method, use cases, value, roadmap, discovery-call CTA, contact.
  - `services.html` — service packages page (5 package rows + contact section; no visible numbering, order only). Package "Get a custom quote" links prefill the contact form (`data-quote-package` → hidden `package` field + starter message; never overwrites typed text).
  - Portfolio stat tiles (a/portfolio.js): case studies · industries · solution types (distinct category tags, = the "Refine by type" chips). The repository count was dropped (every card links its repo); Version B still uses `portfolio.statLabelRepos`.
  - `main.js` — single entry for both pages (nav + mobile menu, skip link, language, contact form, quote links, reveal). `portfolio.js` is dynamically imported only when `#portfolioTrack` exists (homepage has a `modulepreload` for it).
  - Portfolio rotation runs whenever 2+ cards are showing (a single type filter leaves 1 card: nothing to rotate). It pauses on hover, on keyboard focus inside the deck, and via the `#portfolioNavPause` toggle (hidden under reduced motion); the detail dialog traps Tab and returns focus to its opener.
  - `style.css` — all Version A styles; Services-page block sits just before the Responsive section.
- **Shared modules** `src/frontend/shared/`: `content.js` (all EN/HU UI copy), `portfolio-data.js` (case studies + category/status labels + `getLabel`; imported by a/portfolio.js and b/c main.js), `i18n.js` (language controller; `data-i18n`, `-aria`, `-placeholder`, `-title`), `contactForm.js`, `motion.js`.
- **Language persistence:** priority `?lang=` URL param > localStorage (`anominsight:lang`) > browser language. The controller writes `?lang=xx` into the current URL and into every same-site page link, so the choice survives navigation even where storage is blocked or not shared (preview panes, other host/port). External, mailto and `#hash` links are untouched.
- **Nav order** matches page order: Services › Projects › About › How it works › Contact.
- **Other directions:** `versions/original` (frozen baseline copy of the old index01 build), `versions/b`, `versions/c` (gitignored local experiments). `versions/index.html` is the comparison index.
- `src/frontend/index01.html` / `style01.css` are deleted in the working tree (uncommitted, user's change); `versions/original` holds the same build.
- `src/frontend/js/` (index01's old scripts) was deleted 2026-09-24 (user OK); `versions/original/js/` keeps the frozen copy.

## 4. Architecture
- Static HTML/CSS/vanilla JS, ES modules, no build step, no package manager. GitHub Pages with `CNAME` + `.nojekyll`.
- Version A references root assets as `../../../../images/...` and `../../../../fonts/...` (correct: a › versions › frontend › src › root).
- Version A pages carry `noindex` until promoted.

## 5. Design system
- Source: `DESIGN.md` (brand rules, protected Portfolio) + tokens at top of `versions/a/style.css`.
- Warm near-black ground, amber/gold accents (`--accent #d9a36b`, `--accent-2 #f0c882`), text `#f7f2de`, muted `#e3d2b3`.
- Every colour in `versions/a/style.css` is a `:root` token (hex tokens such as `--ground`, `--on-accent`, `--error`, plus `*-rgb` triplets for alpha, e.g. `rgba(var(--surface-rgb), 0.6)`). No raw hex/rgba outside `:root`; add a token instead.
- Type: Manrope (display) + Source Sans 3 (body). 4px spacing scale `--space-1..9`.
- Buttons: `.btn` + `.btn--primary` (gradient, neutral dark shadow — no amber glow) / `.btn--ghost`. One primary per group.
- Touch: under `(pointer: coarse)` small controls reach 44px – chips and `.btn` grow for real (min-height/min-width 2.75rem); round icon buttons, the logo link and underlined text links (`.founder__links`) get an invisible `::before` hit extension instead, like the nav dots.
- Phones: grid tracks that hold cards use `minmax(0, 1fr)` (portfolio rotator and the card itself), never bare `auto`/`1fr`, or long HU words push the page sideways at 320px. Proof band uses `auto-fit` columns so enlarged text wraps instead of overflowing.
- Fonts are self-hosted in `/fonts` (variable woff2, latin + latin-ext only; SIL OFL licences alongside), declared via @font-face at the top of `versions/a/style.css`, latin files preloaded. No Google Fonts requests. Weights in use: Manrope 600–800, Source Sans 3 400–700.
- Icons: Version A uses 64px copies in `images/icons/` (originals in `images/` are 512px, kept for other versions). Still recoloured white via CSS filter.
- Panels/dialogs are edge-defined (1px accent border, no wide drop shadow).
- Hero figure `.signal`: inline-SVG schematic (hairline grid, dashed expected-range band, one trace, one flagged reading + ring) with an HTML "Anomaly → Insight" readout; labels are HTML so they stay legible when scaled; readout stacks via container query under 26rem. Captioned "Illustrative example" – it must never show real-looking numbers or imply client data. Its one-time entrance sequence is the page's single authored motion moment: left-to-right `clip-path` scan of the plot → ring contracts onto the flagged point → marker drops → readout Anomaly → arrow → Insight (~1.25s, then fully static; `backwards` fill so nothing lingers). `main.js` arms it with `.signal--pending` and swaps to `.signal--play` when the figure itself is 40% in view (phones: below the fold). No loops, pulses or count-ups; never runs without JS or under reduced motion; the "Illustrative example" caption is never hidden.
- Links with `target="_blank"` carry `aria-describedby="newTabHint"` (hidden, translated span on each page). Carousel dots are plain buttons with `aria-current`, not tabs.
- Breakpoints: 900px (grids collapse), 840px (single column); wide-desktop shell steps at 1440/1760/2200. Text-driven breakpoints are in `em` so they follow the browser's text-size setting: mobile nav at `52.5em` (= 840px), capabilities stack at `68.75em` (= 1100px). Layout breakpoints stay px.
- Motion: content visible by default; `initReveal` adds fade-up + child stagger; skipped under reduced motion. Reduced motion = movement off, fades kept: only colour/border/shadow/opacity/filter/visibility may transition (140ms, no delay); transforms change instantly; keyframe sequences end at once.
- Design skill in use: Impeccable (`.claude/skills/impeccable`).

## 6. Content & terminology
- Voice: first person singular ("I"), never corporate "we".
- Dashes: user-visible copy uses the spaced en dash " – " (both languages, page titles too). Never em dashes (—); never a spaced hyphen " - " as a dash. Code comments use " - ". (2026-09-24)
- HU package titles and descriptions are the user's wording, kept verbatim: "Ingyenes Discovery Call", "Adat Audit", "Egyszeri Projektmegvalósítás", "Integrált Megvalósítás (teljes átadással)", "Rendszeres Monitoring & Reporting" (was "Havi …"; user switched it to weekly-or-monthly 2026-09-24). [pref]
- Badges: One-off Project = "Kiemelt / Featured" (warm ground + the only primary button); Integrated = "Legteljesebb / Most complete" (`.package--premium`, brighter border only). Never "Most popular" (no client data).
- No fabricated testimonials, logos or metrics (see `PRODUCT.md` Evidence on Hand).
- `content.js` is the source of truth for copy; the text inside `data-i18n` elements in the HTML is only the EN fallback (no-JS, crawlers, first paint). A key missing from `content.js` fails silently – the fallback stays in both languages – so renaming a key means changing the HTML attribute too, and keeping the HTML fallback equal to the EN value.
- Every visible string needs EN + HU keys in `shared/content.js`. HU long compounds may need a soft hyphen (`­`) to fit 360px phones.
- **HU terminology standard** [pref] (2026-09-24). Use these in all HU copy (UI, services, portfolio, translations); inflect normally, but never swap in a more literal translation. When writing or reviewing HU copy, check for and correct inconsistent terms. For a term not listed, use what Hungarian data/AI/industrial professionals actually say; don't invent one, and flag real ambiguity for the user.

  | English | Approved Hungarian |
  | --- | --- |
  | data analytics | adatelemzés / adatanalitika |
  | data science | data science / adattudomány |
  | data scientist | data scientist / adattudós |
  | dashboard | dashboard (never "irányítópult"; plural "dashboardok") |
  | visualization | vizualizáció |
  | machine learning | gépi tanulás |
  | predictive analytics | prediktív analitika |
  | anomaly detection | anomáliafelismerés |
  | forecasting | előrejelzés |
  | data audit | adataudit |
  | reporting | riportálás |
  | case study | esettanulmány |
  | repository | GitHub-repó / repository |
  | insights | meglátások / üzleti információk |
  | actionable insights | döntést támogató / hasznosítható információk |
  | monitoring | monitorozás |
  | API integration | API-integráció |
  | data integration | adatintegráció |

  Roadmap wording, fixed: "Jelenleg elérhető" – Adataudit · Dashboardok · Automatizált riportálás; "Fejlesztés alatt" – Valós idejű anomáliafelismerés · Prediktív analitika · API-integrációk (SQL, ERP, IoT).

## 7. Decisions
- **Main site** — Version A (`src/frontend/versions/a`) is the main site; root Coming Soon is only a placeholder. (2026-09-24)
- **Free offer** — the free entry offer is the Discovery Call, not a data audit; Data Audit is a quoted package. Version A homepage CTAs and the final CTA section use the `offer.*` keys accordingly. (2026-09-24)
- **Discovery Call CTA** — books via the calendar link ("Book a free discovery call"), not "Get a custom quote". Other packages → contact form. (2026-09-24)
- **Services nav** — nav "Services" points to `services.html` on both pages; the homepage keeps its Core services section as a teaser with a "See all service packages" link. (2026-09-24)
- **No prices** — no price figures anywhere on the site. (2026-09-24)
- **Hero** — headline is the user's wording [pref] – EN "See what your data is hiding.", HU "Lásd meg, amit az adataid elrejtenek." (single key, balanced wrap) – not generic "AI-powered analytics"; the right column is the anomaly → insight figure. The old 4-item credentials card was removed: 2 of its 4 facts duplicated the proof band directly below, the rest live in the figure (industrial example) and the roadmap. Founder byline sits under the CTAs so the lead's "I" has a face. (2026-09-24)
- **Contact email** — `hello@anominsight.com` is the canonical site contact and call-booking address; `info@` is legacy (still on the temporary root placeholder and its JSON-LD). (2026-09-24)

## 8. Constraints / do not change
- Portfolio section structure/interaction is protected (`DESIGN.md`).
- `versions/original` is a frozen baseline — never edit.
- Don't edit root `index.html` for new features until Version A is promoted.

## 9. Known issues
- None open from the 2026-09-24 audits.

## 10. Current priorities
1. Promote Version A to root (move/merge files, fix asset paths, drop `noindex`, update canonical/OG tags and `sitemap.xml` incl. services page). Canonical URLs should omit `?lang=`; consider `hreflang` alternates for `?lang=en` / `?lang=hu`.

## 11. Alternatives / experiments
- **Versions B ("Audit Dossier") and C ("Control Room")** — alternative design directions, not chosen; gitignored, still use the old free-audit keys in `shared/content.js`. Write-up: `docs/design-comparison.md`.

## 12. Open questions
- [open] HU package titles "Adat Audit" and "Rendszeres Monitoring & Reporting" are recorded as verbatim user wording, but the HU terminology standard says "adataudit", "monitorozás", "riportálás". Keep the titles as proper names, or align them? Left unchanged. (found 2026-09-24)
- [open] Hero copy drafted by Claude and not yet confirmed: call note and figure readout (EN + HU). The headline is now the user's own wording. (found 2026-09-24)
- [open] Roadmap lists "real-time anomaly detection" and "predictive analytics" as in development, while "Advanced analytics — available on request" and the One-off Project package already offer anomaly detection. Is the roadmap wording (real-time/platform vs. project work) clear enough? (found 2026-09-24)
- [open] `docs/product-understanding.md` still describes a free data audit as the entry offer; it's a historical analysis snapshot — update or leave? (found 2026-09-24)

## 13. Changelog
- 2026-09-24 — Portfolio: auto-rotation now also runs with 2 filtered cards (minimum was 3, so most type filters froze the deck).
- 2026-09-24 — P3 audit items: all colours tokenised, nav + capabilities breakpoints in em (no overflow at 1.25–2× browser text), gentler reduced motion; portfolio third stat → solution types. Default rendering verified pixel-identical.
- 2026-09-24 — Monitoring package is no longer monthly-only: now "Ongoing / Rendszeres Monitoring & Reporting", weekly or monthly, review meeting each cycle.
- 2026-09-24 — Audit fixes: no horizontal scroll at 320/360 (portfolio card grid + wrapping top row), proof band wraps at 200% text, 44px touch targets for .btn/logo/About links/short chips, hero founder photo 56px (picture no longer shrinks), role on its own line under 480px.
- 2026-09-24 — Fixed hero h1 pointing at removed keys `hero.headingA/B` (user's new `hero.heading` never showed); h1 now uses `hero.heading`.
- 2026-09-24 — Deleted unused `src/frontend/js/` (legacy index01 scripts); all pages verified loading with no errors/404s.
- 2026-09-24 — Hero figure: replaced the ring-zoom with a one-time, in-view entrance sequence (scan → flag → marker → readout stagger).
- 2026-09-24 — Added HU terminology standard (§6); replaced "Irányítópult(ok)" with "Dashboardok" in HU roadmap and method step 3.
- 2026-09-24 — Hero refined: two-clause brand headline, anomaly → insight figure replaces credentials card, founder byline + call note, hero glow removed, headline steps up at 1760/2200.
- 2026-09-24 — Translated homepage title; dashes unified to " – "; Core + Advanced card grids merged into one "What I deliver" index; fonts self-hosted (no third-party requests).
- 2026-09-24 — Audit #2 fixes: 64px icons (155→22 KB), portfolio data split to `portfolio-data.js`, dots → buttons, new-tab hints, border+shadow advisories removed. Homepage ~306→177 KB; detector fully clean.
- 2026-09-24 — Language now carried in `?lang=` across pages (was lost where storage isn't shared); header nav reordered to match page (About before How it works).
- 2026-09-24 — Audit fixes (harden/polish/adapt/optimize): skip link, carousel pause, dialog focus, mobile menu Esc, translated aria labels, placeholder contrast, form font, 44px touch targets, founder WebP (330→9 KB), lazy portfolio module, unused font weights dropped, neutral primary-button shadow.
- 2026-09-24 — Added 5th package "Integrated Implementation (Full Handover)" between One-off Project and Monthly Monitoring; reworded services intro so it no longer says code is never handed over.
- 2026-09-24 — Added Version A `services.html` (4 quoted packages, no prices); free offer switched from data audit to discovery call; bootstrapped CLAUDE.md.
