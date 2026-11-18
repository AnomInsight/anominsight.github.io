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
- **Users:** Decision-makers at SMEs (KKV-k) across industries – manufacturing, logistics, retail, services. Industrial/production data experience is credibility, not the only audience; the site must not read as industrial-only. (2026-11-18) Full product context: `PRODUCT.md`.
- **Business purpose:** Lead generation for consulting engagements; entry offer is a free 30-min discovery call.
- **Status:** Pre-launch. Root is a Coming Soon placeholder; the real site (Version A) is built but not yet promoted to root. (2026-09-24) Version D, an elevated A ("Signal in Noise"), is built (2026-11-17); its content is approved for the next development milestone (2026-11-18).

## 2. Product & business context
- Free entry offer = **Discovery Call** (30 min, no obligation), booked via Google Calendar. It is the only free service: it covers no auditing, data cleaning, model development, reports or other deliverables. Never advertise a "free data audit". (2026-11-18)
- Paid packages, in page order, all **quoted individually, no published prices**: Data Audit · One-off Project Delivery (featured) · Integrated Implementation (Full Handover) (highest tier) · Ongoing Monitoring & Reporting (weekly or monthly cadence, agreed per client).
- Most packages deliver reports and dashboard views; code, pipeline and methodology are **not** handed over.
- Exception: Integrated Implementation — deployment-ready solution + integration support; client gets rights to the project-specific solution, general reusable components/methods stay reusable by the provider. Never word it as exclusive/full ownership of all code; the contract defines IP terms. [pref] Version D's wording (user's, 2026-11-18): source code and documentation handed over as agreed, integration support where needed; the client uses the project solution on the contract's terms; I may reuse general code components and methods; exact terms in the individual offer and contract. Add no delivery obligations beyond the contract.
- Monitoring & Reporting: one 30-minute review for each agreed weekly or monthly reporting cycle (HU "ciklusonként"). (2026-11-18)
- Contact paths: Formspree form (`https://formspree.io/f/xjykwlyk`), calendar link, email. Reply within 24 hours, weekends included. (2026-11-18)
- "4+ years" = professional experience with production/industrial data, not company age (confirmed 2026-11-18).

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
- **Version D ("Signal in Noise")**, `versions/d/` (built 2026-11-17; committed 2026-11-18 on local branch `feature/anominsight-version-d`, not merged, not pushed): A's content and functions; homepage = hero + "How it works" sharing one Canvas 2D stage (`signal-story.js` + `signal-data.js`): noise → three sensor lanes → expected ranges + one gold-flagged torque reading → illustrative panel → decision card. Wide (≥ 60em): sticky stage, scroll-scrubbed, reverses on scroll up. Narrow: no pinned stage – hero band + one frame per step that plays once in view. Hero is one composition: full-width stage behind the text, field faint behind the headline, label/grid only from step 1. Then proof ledger (sources linked to repos), "Same data, different questions" (`modes.js`: the 52 synthetic readings in Detect / Forecast / Group / Classify views; caption states trend, range, groups and boundary are sketches, not a trained, validated model; active view = gold name + 2px gold underline) opening the service map (4 story stages → packages, incl. forecasting/regression and classification/clustering), portfolio (A's module copied, token-remapped), about, audience + value, roadmap, discovery call, contact. `services.html` restyled with a one-time trace scan. D's own copy: where D's wording differs from a shared key, it uses a `<key>D` variant in `content.js` (39 as of 2026-11-18; A, B, C keep the originals). D's HTML names the D keys directly; `t()` in `versions/d/main.js` prefers the `…D` variant for lookups made by shared modules (contact form, portfolio, story). D's tokens: top of `versions/d/style.css`; specs and measurements in `docs/` (`client-brief`, `creative-direction`, `design-system`, `motion-spec`, `implementation-plan`, `qa-checklist`).
- Local preview: `.claude/launch.json` config `static-site` serves the repo root on :4173 via `.claude/serve.mjs` (no deps; `.claude/` is gitignored).
- `src/frontend/index01.html` / `style01.css` are deleted in the working tree (uncommitted, user's change); `versions/original` holds the same build.
- `src/frontend/js/` (index01's old scripts) was deleted 2026-09-24 (user OK); `versions/original/js/` keeps the frozen copy.

## 4. Architecture
- Static HTML/CSS/vanilla JS, ES modules, no build step, no package manager. GitHub Pages with `CNAME` + `.nojekyll`.
- Version A references root assets as `../../../../images/...` and `../../../../fonts/...` (correct: a › versions › frontend › src › root).
- Version A pages carry `noindex` until promoted.

## 5. Design system
- Source: `DESIGN.md` (brand rules, protected Portfolio) + tokens at top of `versions/a/style.css`.
- Warm near-black ground, amber/gold accents (`--accent #d9a36b`, `--accent-2 #f0c882`), text `#f7f2de`, muted `#e3d2b3`.
- Grounds: body is one flat `--ground`; the warm glow lives only on the page opener (`.hero`, `.page-intro`). Sections are grouped into chapters by thought, alternating flat ground and `.band` (`--ground-band` + hairline edges, painted full-bleed via `border-image` so it works on the width-capped portfolio `.container`). Homepage bands: proof · portfolio · use cases + value · final CTA + contact; services: contact. A change of thought = a change of ground; the faint centred divider only splits sections inside one chapter. Reveal animates a band's/opener's children, never the painted section itself. (2026-09-27)
- Every colour in `versions/a/style.css` is a `:root` token (hex tokens such as `--ground`, `--on-accent`, `--error`, plus `*-rgb` triplets for alpha, e.g. `rgba(var(--surface-rgb), 0.6)`). No raw hex/rgba outside `:root`; add a token instead.
- Type: Manrope (display) + Source Sans 3 (body). 4px spacing scale `--space-1..9`.
- Buttons: `.btn` + `.btn--primary` (gradient, neutral dark shadow — no amber glow) / `.btn--ghost`. One primary per group.
- Touch: under `(pointer: coarse)` small controls reach 44px – chips and `.btn` grow for real (min-height/min-width 2.75rem); round icon buttons, the logo link and underlined text links (`.founder__links`) get an invisible `::before` hit extension instead, like the nav dots.
- Phones: grid tracks that hold cards use `minmax(0, 1fr)` (portfolio rotator and the card itself), never bare `auto`/`1fr`, or long HU words push the page sideways at 320px. Proof band uses `auto-fit` columns so enlarged text wraps instead of overflowing.
- Fonts are self-hosted in `/fonts` (variable woff2, latin + latin-ext only; SIL OFL licences alongside), declared via @font-face at the top of `versions/a/style.css`, latin files preloaded. No Google Fonts requests. Weights in use: Manrope 600–800, Source Sans 3 400–700.
- Icons: Version A uses 64px copies in `images/icons/` (originals in `images/` are 512px, kept for other versions). Still recoloured white via CSS filter.
- Panels/dialogs are edge-defined (1px accent border, no wide drop shadow).
- Hero grid ≥68.75em: copy column `max(36rem, 47%)` (lead measure; holds both HU CTAs on one row), figure takes the rest (~655px at 1440; 42% / ~715px was too wide per user). Below that the old 1.22fr/0.78fr split. (2026-09-27)
- Hero figure `.signal`: inline-SVG schematic (hairline grid, dashed expected-range band, one trace, one flagged reading + ring) with an HTML "Anomaly → Insight" readout; labels are HTML so they stay legible when scaled; readout stacks via container query under 26rem. Captioned "Illustrative example" – it must never show real-looking numbers or imply client data. Its one-time entrance sequence is the page's single authored motion moment: left-to-right `clip-path` scan of the plot → ring contracts onto the flagged point → marker drops → readout Anomaly → arrow → Insight (~1.25s, then fully static; `backwards` fill so nothing lingers). `main.js` arms it with `.signal--pending` and swaps to `.signal--play` when the figure itself is 40% in view (phones: below the fold). No loops, pulses or count-ups; never runs without JS or under reduced motion; the "Illustrative example" caption is never hidden.
- Links with `target="_blank"` carry `aria-describedby="newTabHint"` (hidden, translated span on each page). Carousel dots are plain buttons with `aria-current`, not tabs.
- Breakpoints: 900px (grids collapse), 840px (single column); wide-desktop shell steps at 1440/1760/2200. Text-driven breakpoints are in `em` so they follow the browser's text-size setting: mobile nav at `52.5em` (= 840px), capabilities stack at `68.75em` (= 1100px). Layout breakpoints stay px.
- Motion: content visible by default; `initReveal` adds fade-up + child stagger; skipped under reduced motion. Reduced motion = movement off, fades kept: only colour/border/shadow/opacity/filter/visibility may transition (140ms, no delay); transforms change instantly; keyframe sequences end at once.
- Design skill in use: Impeccable (`.claude/skills/impeccable`).

## 6. Content & terminology
- Voice: first person singular ("I"), never corporate "we".
- Dashes: user-visible copy uses the spaced en dash " – " (both languages, page titles too). Never em dashes (—); never a spaced hyphen " - " as a dash. Code comments use " - ". (2026-09-24)
- HU package titles and descriptions are the user's wording, kept verbatim: "Ingyenes Discovery Call", "Adat Audit", "Egyszeri Projektmegvalósítás", "Integrált Megvalósítás (teljes átadással)", "Rendszeres Monitoring & Reporting" (was "Havi …"; user switched it to weekly-or-monthly 2026-09-24). [pref] Version D uses the user's newer wording (2026-11-18), as `…titleD` keys: "Ingyenes konzultáció", "Adataudit", "Egyedi projektmegvalósítás", "Integrált megvalósítás (forráskódátadással)" / EN "Integrated Implementation (Source Code Handover)" (replaces "Full Handover" in D), "Rendszeres monitorozás és riportálás". EN keeps "discovery call" as the name of the free consultation.
- Badges: One-off Project = "Kiemelt / Featured" (warm ground + the only primary button); Integrated = "Legteljesebb / Most complete" (`.package--premium`, brighter border only). Never "Most popular" (no client data).
- No fabricated testimonials, logos or metrics (see `PRODUCT.md` Evidence on Hand).
- `content.js` is the source of truth for copy; the text inside `data-i18n` elements in the HTML is only the EN fallback (no-JS, crawlers, first paint). A key missing from `content.js` fails silently – the fallback stays in both languages – so renaming a key means changing the HTML attribute too, and keeping the HTML fallback equal to the EN value.
- Every visible string needs EN + HU keys in `shared/content.js`. HU long compounds may need a soft hyphen (`­`) to fit 360px phones.
- Word choice by meaning [pref] (2026-11-18): the brand tagline uses "felismerések" ("Adatokból felismerések. Felismerésekből döntések."); elsewhere pick "eredmények", "következtetések" or "felismerések" by meaning rather than forcing one word. "Data preparation / Adat-előkészítés" = cleaning, transforming, preparing data; "Data engineering / Adatmérnöki megoldások" only where the work includes pipelines, ingestion architecture, integration or other engineering.
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
- **Version D direction** — user approved "Finding Signal in Noise" (Noise → Discovery → Insight → Action), Canvas 2D, no animation libraries, logo-gold palette (`#CFB588`/`#F1D5A2`, gold only for signal/action/measured figures), Manrope + Source Sans 3 kept, restrained motion. No cursor "inspection lens" in the first release; phones get a simplified non-pinned story. Illustrative stage shows counts/states of the drawn example only, labelled as illustrative. (2026-11-17) Refined 2026-11-18: hero must not read as a split screen (text leads, field is atmosphere, explicit labels later); the site must not read as anomaly-detection-only – the anomaly story stays the opening, the broader ML/analytics scope (forecasting, regression, classification, clustering, predictive maintenance, dashboards) is shown in the same visual language after it. Final round (2026-11-18): user approved the direction; no new visual features. Story step 1 describes onboarding (D-only `method.step1.titleD/textD`), never an upload/connect feature the site does not have; synthetic visuals must never imply trained, validated models.
- **Business copy alignment (D)** — user-supplied HU copy for the free consultation, paid audit, SME positioning, CNC example and explorer is applied in D as `…D` variants or edits of D-only keys; EN follows with the minimum change needed to say the same thing. The CNC example never claims a cause: "possible cause: tool wear, needs further checking". The explorer caption names only what `modes.js` computes (linear regression trend, k-means groups); range, forecast band, limit and class boundary are called illustrative. (2026-11-18) Final decisions, same day: the final CTA section's h2 is `finalcta.titleD` ("Kezdjük egy ingyenes konzultációval", the invitation); `offer.titleD` ("Miről szól az ingyenes konzultáció?") stays as the h3 over the list of what the call covers – both headings kept, distinct roles. Story step 1's discipline tag is "Data preparation / Adat-előkészítés".

## 8. Constraints / do not change
- Portfolio section structure/interaction is protected (`DESIGN.md`).
- `versions/original` is a frozen baseline — never edit.
- Don't edit root `index.html` for new features until Version A is promoted.
- Version D never imports from `versions/a/` (it keeps its own copy of `portfolio.js`); `shared/content.js` changes for D are additive only (A, B, C read the same file).

## 9. Known issues
- None open from the 2026-09-24 audits.

## 10. Current priorities
1. Version D (`versions/d/`): content approved 2026-11-18 for the next development milestone and committed on the local branch `feature/anominsight-version-d` (not merged, not pushed). It stays a separate development candidate until the user authorises promotion or deployment.
2. Promote the chosen version (A or D) to root (move/merge files, fix asset paths, drop `noindex`, update canonical/OG tags and `sitemap.xml` incl. services page). Canonical URLs should omit `?lang=`; consider `hreflang` alternates for `?lang=en` / `?lang=hu`.

## 11. Alternatives / experiments
- **Versions B ("Audit Dossier") and C ("Control Room")** — alternative design directions, not chosen; gitignored, still use the old free-audit keys in `shared/content.js`. Write-up: `docs/design-comparison.md`.

## 12. Open questions
- [open] HU package titles "Adat Audit" and "Rendszeres Monitoring & Reporting" are recorded as verbatim user wording, but the HU terminology standard says "adataudit", "monitorozás", "riportálás". Version D now uses "Adataudit" / "Rendszeres monitorozás és riportálás" (user's wording, 2026-11-18); Version A still has the old titles – align A too? (found 2026-09-24)
- [open] Hero copy drafted by Claude and not yet confirmed: call note and figure readout (EN + HU). The headline is now the user's own wording. (found 2026-09-24)
- [open] Roadmap lists "real-time anomaly detection" and "predictive analytics" as in development, while "Advanced analytics — available on request" and the One-off Project package already offer anomaly detection. Is the roadmap wording (real-time/platform vs. project work) clear enough? (found 2026-09-24)
- [open] `docs/product-understanding.md` still describes a free data audit as the entry offer; it's a historical analysis snapshot — update or leave? (found 2026-09-24)
- [open] Version D: `DESIGN.md` still describes A's system – refresh it only if D is promoted. (The "4+ years" figure and the footer tagline were settled 2026-11-18.) (found 2026-11-17)

## 13. Changelog
- 2026-11-18 — Version D Integrated title → "Integrated Implementation (Source Code Handover)" / "Integrált megvalósítás (forráskódátadással)" (`packages.integrated.titleD`); Version D committed on local branch `feature/anominsight-version-d`.
- 2026-11-18 — Version D final wording decisions: Integrated text restores the rights split + contract clause; Monitoring review "ciklusonként" / each reporting cycle; final CTA h2 `finalcta.titleD` with `offer.titleD` as the list's h3; step 1 tag "Data preparation". D content approved for the next milestone.
- 2026-11-18 — Version D business copy alignment: 37 `…D` variants of shared keys + edits to D-only keys (free consultation only, paid audit, SME positioning, 24 h incl. weekends, CNC "possible cause", explorer caption matched to code); `versions/d/main.js` `t()` prefers D variants. A, B, C unchanged.
- 2026-11-18 — Version D final refinement: hero field contrast lifted slightly (`--data-noise` #6B665D, traces 0.09); step 1 rewritten as onboarding; explorer copy made technically precise + honesty caption; HU "Ugyanazok az adatok, más kérdések", "Ellenőrzendő", "monitorozás"; active tab underline.
- 2026-11-18 — Version D refined: unified atmospheric hero; "Same data, different questions" explorer + broader positioning copy (D-only keys).
- 2026-11-17 — Version D "Signal in Noise" built in `versions/d/` (homepage + services) after the user approved the plan; 26 additive EN/HU keys in `content.js`; D card in the comparison index; docs updated to the shipped state.
- 2026-11-17 — Version D "Signal in Noise" planned (steps A–B of the user's brief): six planning docs added to `docs/`.
- 2026-09-27 — Hero figure widened (copy column sized to its measure); sections grouped into chapters with alternating flat/band grounds; page-long body gradient replaced by a hero-only atmosphere; `.section--alt` removed.
- 2026-09-24 — Hero founder photo enlarged 56px → 72px (user request).
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
