# AnomInsight — Product Understanding

Compiled from `PRODUCT.md`, `DESIGN.md`, `src/frontend/index01.html`, `src/frontend/style01.css`, and `src/frontend/js/*.js` (the "real site" — see note below on the two front-end surfaces). Every subsection is labeled **Fact** (explicitly stated somewhere in the project), **Inferred** (my conclusion from the code/copy, not stated outright), or **Unclear/Missing** (not answerable from the project as it stands).

This document does not propose any redesign. It only records what the product currently is.

---

## 0. The two front-end surfaces (context for everything below)

**Fact:** Two coexist today:
- `index.html` + `script.js` + `style.css` (repo root) — a "Coming Soon" placeholder, live at the real domain.
- `src/frontend/index01.html` + `style01.css` + `src/frontend/js/*.js` — the fuller marketing/portfolio build. `PRODUCT.md` explicitly confirms this is "the intended near-term homepage replacement" and that "future work should treat promoting/merging it to root as live, not as a hypothetical."

The user's brief calls this fuller build "index01" and it is the subject of this analysis and of the eventual redesign. The coming-soon page is out of scope except as background.

---

## 1. What AnomInsight is

**Fact:** AnomInsight is a founder-led AI data-analytics practice, founded by Bence Csomor. It is explicitly positioned as *dual*: a solo consulting practice today, and simultaneously the on-ramp to an eventual reusable analytics/anomaly-detection platform. `PRODUCT.md` is explicit that future work "should not force a choice between 'just a freelancer' and 'just a SaaS company.'"

**Fact:** The brand is deliberately personal, not corporate-anonymous — "the brand is one identifiable person, not an anonymous company" (`PRODUCT.md`, Product Principles §2).

**Inferred:** The site copy itself is not fully consistent with this founder-led framing yet — see §9 (Tone of Voice) for the "we" vs. "I" inconsistency between the HTML source and the (in-progress) i18n dictionary.

---

## 2. What the product/service does

**Fact** (from `PRODUCT.md` and site content), the practice turns a client's raw operational/business data into:
- Data audit & quality assessment (missing values, inconsistencies, structural issues)
- Interactive dashboards (real-time charts/KPIs)
- Automated reporting (scheduled PDF/email summaries)
- Anomaly detection ("available on request" — positioned as advanced/premium tier)
- Forecasting models
- Predictive maintenance

**Fact:** The engagement model starts with a free, no-obligation data audit and is meant to end in "a working, decision-useful analytics deliverable."

**Fact:** Client data sources handled: Excel files, SQL databases, APIs, sensors (per Users section and "How It Works" step 1).

**Inferred:** "Advanced Analytics" (anomaly detection, forecasting, predictive maintenance) is presented as a distinct, higher tier from the three "Core Services," gated behind "available on request" rather than sold as a standard package — likely because these need custom/bespoke engagement rather than a fixed-scope audit.

---

## 3. Target customers

**Fact** (`PRODUCT.md`, Users section): "decision-makers (owners, ops/plant managers, technical leads) at data-driven businesses" in manufacturing, logistics/supply chain, e-commerce, energy/utilities, "and similar operations."

**Fact** (site's "Who is this for?" section, same list): Manufacturing companies, Logistics & supply chain, E-commerce, Energy & utilities, "Any data-driven organization."

**Fact** (`DESIGN.md`): Target audience framed as "SMEs and industrial companies."

**Fact:** Bilingual audience — English and Hungarian are both first-class, not translation-as-afterthought.

**Inferred:** Despite the broad five-item "who is this for" list, the actual evidence on hand (real case studies) skews toward manufacturing/industrial (CNC predictive maintenance) and, more loosely, logistics (digit classification for mail sorting) — with hospitality/restaurant as an explicit demo, not a real client vertical. So the *proof* is narrower than the *stated* addressable market.

---

## 4. Problems it solves

**Fact** (Problem section, `problem.*` copy): "Most companies have data — but no clarity." Named pain points:
- Unexpected downtime
- Revenue loss from inefficiencies
- Poor forecasting
- Slow decision-making

**Fact** (Users section framing): clients "have data ... but lack the in-house capacity to turn it into decisions."

**Inferred:** The core problem framed is not "lack of data" but "lack of capacity/expertise to convert data into decisions" — this is a capacity/expertise gap, not a tooling gap, which matters for messaging (the pitch is a partner who does the analysis, not merely a self-serve tool).

---

## 5. Value proposition

**Fact** (`PRODUCT.md`, Positioning): what a generic analytics vendor "can't truthfully copy" — a single identifiable founder backing every claim with real, published, GitHub-linked case studies and concrete measured results (96% failure-catch rate on CNC predictive maintenance; 99.27% accuracy on a 5-model comparison for digit classification).

**Fact** (Product Principles §1): "Lead every claim with real, verifiable evidence ... instead of generic platform marketing."

**Fact** (site's "What you gain" section): Better decision-making, reduced operational costs, early detection of problems, clear visibility into business performance, data-driven strategy instead of guesswork.

**Inferred:** The value proposition rests on two legs that reinforce each other: (a) *verifiability* — you can click through to real GitHub repos and inspect the actual code/results, which is unusual for a solo consultancy; (b) *specificity of numbers* — 96%, 99.27% — rather than vague claims. Any redesign should preserve, not dilute, this "show the receipts" mechanic (currently the portfolio detail modal + GitHub links + concrete metrics in card copy).

---

## 6. Main business goals of the website

**Fact** (`PRODUCT.md`, Product Purpose): "Success is a client engagement that starts from a free data audit and ends in a working, decision-useful analytics deliverable."

**Fact:** Two primary calls to action recur throughout the page: "Get a Free Data Audit" (anchors to `#contact`) and "Book a call" (external Google Calendar link). A third path is direct email.

**Inferred:** The website's job is lead generation for consulting engagements, not self-serve product signup — there is no pricing, no signup flow, no account system. The "Free Data Audit" is the low-friction entry offer designed to convert a cold visitor into a conversation.

**Inferred:** A secondary goal is credibility-building for the eventual platform ambition — the "Platform Evolution" / roadmap section signals to visitors (and possibly future investors/partners) that consulting work is building toward a product, not just billable hours.

---

## 7. Desired user journey

**Fact**, reconstructed from section order and anchors: Hero (value prop + primary CTA) → Problem → Solution → Core Services → Advanced Analytics → Portfolio/Projects (proof) → How It Works (process) → Who is this for (self-qualification) → What you gain (value reinforcement) → Platform Evolution (roadmap/credibility) → Final CTA ("What's Included in Your Free Data Audit") → Contact (form + booking + email).

**Inferred:** This is a fairly classic long-form B2B consulting funnel: *problem → solution → proof → process → qualification → reinforcement → low-friction ask*. The portfolio section is structurally mid-funnel (comes right after the service menu, before "how it works"), which suggests proof is meant to close skepticism before the visitor is asked to understand the engagement process.

**Inferred:** The nav only exposes four anchors (Services, Projects, How It Works, Contact) — "Problem," "Advanced Analytics," "Who is this for," "What you gain," and "Platform Evolution" are not directly reachable from the nav, implying the intended journey is scroll-through, not jump-around.

**Unclear/Missing:** No analytics/heatmap data, A/B test results, or stated conversion metrics exist in the repo to confirm this journey actually performs as intended — this is a *design assumption* embedded in the current build, not a validated funnel.

---

## 8. Intended brand positioning

**Fact** (`DESIGN.md`): "premium, minimal, technical, trustworthy, industrial." Explicit instruction: "Avoid generic AI/startup aesthetics."

**Fact** (`PRODUCT.md`): dual positioning as solo practice + platform-in-the-making (see §1).

**Fact:** Name "AnomInsight" (portmanteau of "Anomaly" + "Insight") signals anomaly detection as a conceptual anchor for the brand, even though it's currently sold as a premium/advanced service rather than the flagship offering.

**Inferred:** "Industrial" positioning is reinforced by real content choices, not just a stated intent: the CNC predictive-maintenance case study leads the portfolio order, "Manufacturing process analytics" appears in the hero trust panel, and the Users section explicitly names manufacturing first.

---

## 9. Tone of voice

**Fact:** `contact.copy` in both `index01.html` and `i18n.js` (EN) is first-person singular: "I'm here to help ... I'll get back to you." `contact.email`/`contact.location` and the footer are collectively-voiced.

**Inferred / Unclear — an active inconsistency in the codebase, not a resolved decision:**
- `index01.html`'s inline placeholder copy (e.g. `hero.copy`: "**We** help companies...", `solution.text`: "**Our** system analyzes...") uses first-person plural, functioning only as a fallback/placeholder since `data-i18n` overwrites it at runtime.
- The actual EN dictionary in `src/frontend/js/i18n.js` has already been edited to first-person singular in several places ("**I** help companies...", "**I** analyze your datasets...", "**I** process and clean your data...") — consistent with the founder-led positioning in `PRODUCT.md`.
- The HU dictionary is fully first-person singular ("Segítek...", "Elemezzük" appears only in EN services.card1 — mixed).
- Contact email throughout site copy (HTML and both i18n dictionaries) is `hello@anominsight.com`, but `PRODUCT.md`'s stated Brand Commitment is `info@anominsight.com` (also the email used in the coming-soon page's structured data and the system's own user-email context). **This is a live discrepancy, not a stylistic choice** — it's unclear which address is current/correct.
- There is an uncommitted working-tree change to `i18n.js` (visible in `git status`/`git diff`) that is mid-way through exactly this "we"→"I" and general copy-polish pass, particularly in Hungarian strings, suggesting this voice unification is already recognized as needed and in progress, not finished.

**How to read this:** the *intended* tone of voice, per `PRODUCT.md`'s explicit principle, is founder-led/personal ("I", singular). The *current, shipped* copy is inconsistently split between "we" (in the static HTML fallback text) and "I" (in the JS translation layer that actually renders), plus one unresolved email address discrepancy. A redesign should standardize on first-person singular throughout and resolve the email address question with the user before launch.

**Fact (style, independent of person/voice):** copy is plain, direct, non-jargon-inflated for a technical audience — sentences like "Most companies have data - but no clarity" and case-study descriptions that explain ML terms in parentheses for a lay reader (e.g., "a LightGBM model (a fast, tree-based machine learning method)"). This suggests the copy is written to be readable by a plant manager or ops lead, not just a data scientist.

---

## 10. Existing visual identity

**Fact** (`style01.css` `:root` tokens):
- Palette: near-black warm background (`--bg: #090806`), warm off-white text (`--text: #f7f2de`), warm tan/gold accent pair (`--accent: #d9a36b`, `--accent-2: #f0c882`). This reads as a dark, warm, bronze/amber-on-charcoal system — not the blue/purple "AI startup" gradient palette.
- Typography: display font **Manrope** (600/700/800 weights) for headings, body font **Source Sans 3** for copy — a modern geometric sans paired with a humanist sans, both via Google Fonts.
- Shape scale: four radius tokens (`sm` 0.75rem chips/inputs → `xl` 1.5rem hero/rotor panels), pills/circles at full round.
- Motion tokens: a custom strong ease-out cubic-bezier, three duration tiers (140/220/320ms) — documented in-code as deliberately chosen because default `ease`/`ease-out` "read as weak at these durations."

**Fact:** Logo is a circular mark (`logo-circle-96.png`/`184.png`, `Logo_small_2.png`), reused as a small badge in the nav brand lockup with a gradient-tinted circular frame.

**Inferred:** The "industrial" identity is expressed through warmth + restraint rather than through literal industrial iconography (no gears/factories/hard-hat imagery) — icons used (bolt, chart, brain-circuit, crystal-ball, tools, triangle-warning, etc.) are generic flat monochrome pictograms recolored to white via `filter: brightness(0) invert(1)`, not a custom icon set.

**Inferred:** Card/panel treatment throughout (`.card`, `.problem-item`, `.roadmap-column`, `.portfolio-card`) is consistently: dark translucent fill, thin accent-tinted border, soft shadow, subtle lift-on-hover — a single "material" reused across nearly every content block, which is a deliberate but also somewhat homogenizing choice (see §11).

---

## 11. Existing design principles

**Fact** (`DESIGN.md`, verbatim, this is the closest thing to a governing constitution for the redesign):

- **Protected** — Portfolio section: approved, must NOT be substantially redesigned, project presentation changed, or visual structure replaced. Allowed: responsive/accessibility/perf fixes, bug fixes, minor spacing tweaks only.
- **Controlled** — Typography and color palette: may be improved, but must stay consistent with the existing identity (not free to replace wholesale).
- **Creative/free** — Hero, Services, About (note: there is no distinct "About" section in the current `index01.html` — see Unclear below), Contact, page transitions, micro-interactions, supporting visual elements, general component styling, navigation, buttons.
- **General principles:** avoid unnecessary redesign for novelty's sake; prefer simplicity over visual noise; avoid excessive gradients/glassmorphism/rounded cards/decorative elements; maintain strong typographic/spacing hierarchy; animation must have functional or communicative purpose (not decorative).

**Inferred:** This is a meaningful constraint for Phase 3 — the portfolio carousel/deck-rotation/detail-modal system (all of `portfolio.js` + its CSS) is explicitly off-limits for structural redesign across all three future directions. Visual polish (color/type consistent with palette) is allowed; layout/interaction restructuring is not.

**Unclear/Missing:** `DESIGN.md` lists "About" as a creative area, but no dedicated About/founder-bio section currently exists in `index01.html` — founder presence is currently only implied (via "Why companies trust us" panel content and the LinkedIn-linked name mentioned in `PRODUCT.md`, though no visible LinkedIn link or founder photo/bio was found in the HTML itself). This is a gap between the design doc and the current build worth flagging, not resolving unilaterally.

---

## 12. Current page structure

**Fact** — `index01.html`, in document order:
1. **Nav** (fixed) — brand/logo, Services/Projects/How It Works/Contact links, hamburger on mobile, language toggle (EN/HU)
2. **Hero** (`#top`) — H1 + copy + two CTAs (Get a Free Data Audit / Book a call) + a "Why companies trust us" trust panel (4 checklist items: 4+ Years, Industrial Focus, Proven Results, Continuous Development)
3. **Problem** (`#problem`) — headline + 4-item icon grid (downtime, revenue loss, poor forecasting, slow decisions)
4. **Solution** (`#solution`) — headline + 4-item horizontal divided strip (data engineering, ML, visualization, predictive analytics)
5. **Core Services** (`#services`) — 3 cards (Data Audit, Dashboards, Automated Reporting) + CTA
6. **Advanced Analytics** (`#advanced`, alt background) — 3 cards (Anomaly Detection, Forecasting, Predictive Maintenance), subtitled "Available on request"
7. **Portfolio / Selected Projects** (`#projects`) — sticky filter sidebar (status filters + type filters + clear-all) and a 3D card-deck rotator with stats strip, prev/next + dot navigation, autoplay, and a detail modal (protected component)
8. **How It Works** (`#howitworks`) — 4-step numbered process (Data Input → Analysis → Insights → Continuous Improvement)
9. **Who is this for?** (`#usecases`, alt background) — 5-item flat list of verticals
10. **What you gain** (`#value`) — 5-item checkmark list of outcomes
11. **Closing "rotor"** (scroll-driven sticky 3-panel sequence, `#roadmap` → `#final-cta` → `#contact`):
    - Platform Evolution — "Currently available" vs. "In development" roadmap columns
    - Final CTA — "What's Included in Your Free Data Audit" + itemized list + big CTA
    - Contact — heading/copy, email/location, book-a-call + mailto buttons, and a Formspree-backed contact form
12. **Footer** — copyright line

**Inferred:** The page is long and section-count-heavy (12 distinct sections) for a single-page consultancy site, several of which (Problem/Solution/Services/Advanced Analytics) use variations of the same "icon + short copy" formula (the CSS comments themselves acknowledge this and describe deliberate layout variation — hairline grid, divided strip, bordered cards, numbered sequence — specifically to avoid these adjacent sections reading identically).

---

## 13. Important content and messaging

**Fact — the three real case studies** (all with public GitHub links under `github.com/AnomInsight`):
1. **Predictive Maintenance for CNC Operations** (Manufacturing, case study) — LightGBM model, 96% real-failure catch rate in testing, ~2 false alarms per true positive, adjustable sensitivity.
2. **Handwritten Digit Classifier for Mail Sorting** (Logistics, case study) — compared 5 model families, best (CNN) reached 99.27% accuracy; includes confusion analysis and robustness testing (rotation/noise/lighting).
3. **AI Chatbot for Restaurant Ordering & Support** (Hospitality, case study) — demo pizzeria site, Groq-powered LLM widget grounded in real menu/hours data, explicitly framed in `PRODUCT.md` as "a demo project, not a live paying client."

**Fact:** "No client testimonials, press mentions, paying-customer logos, or third-party case studies exist yet — future work must not fabricate these" (`PRODUCT.md`, Evidence on Hand). This is an explicit, load-bearing constraint for any redesign's content/messaging.

**Fact:** Portfolio cards are data-driven from one array (`portfolioProjects` in `portfolio.js`), each tagged with a `status` (currently only `caseStudy` is used, though the vocabulary also defines `live`, `pilot`, `prototype`, `workInProgress`, `ongoing`, `planned`, `testing`) and free-form `categories` — built to accept new projects/filters without redesign.

**Inferred:** Because all three current projects share `status: caseStudy`, the "Browse by status" filter row currently only ever renders one meaningful chip (plus "All") — the filter UI is built for a future with more status diversity, not fully exercised by today's content.

---

## 14. Existing technical/frontend constraints

**Fact** (`PRODUCT.md`, Capabilities and Constraints):
- No framework, bundler, or CMS — plain static HTML/CSS/JS, ES modules (`type="module"`), no build step, no package manager.
- Hosted on GitHub Pages with a custom domain (`CNAME`) and `.nojekyll`.
- "Any new capability should default to staying static/vanilla unless there's a concrete reason to introduce tooling."
- Contact form posts to Formspree (`https://formspree.io/f/xkjndvpk`) via `fetch`, with a honeypot field for spam mitigation.
- Fonts loaded from Google Fonts CDN (Manrope + Source Sans 3) with `preconnect` hints.

**Inferred:** JS is split into focused ES modules with a clear single entry point (`main.js` imports and wires `i18n.js`, `portfolio.js`, `closingRotor.js`, `contactForm.js`) — a deliberate "split out of script01.js for maintainability" pattern (per comments in `closingRotor.js`/`portfolio.js`), suggesting the codebase evolved from one monolithic script and was refactored once already.

**Fact:** Accessibility/robustness care is already present in the code: `prefers-reduced-motion` is respected both in CSS (collapses all transitions/animations to ~instant) and in JS (skips IntersectionObserver reveal, closing-rotor scroll animation, and portfolio autoplay/stagger entirely under reduced motion); scroll-reveal fails safe to "show everything" if JS errors or `IntersectionObserver` is unsupported; focus-visible states, `aria-hidden`/`aria-current`/`role="tablist"` and similar ARIA wiring exist on the portfolio carousel and detail modal; mobile breakpoint (840px) provides a materially different, simplified layout (static stacked cards instead of the 3D deck, no closing-rotor pinning, hamburger nav).

**Inferred:** Given the "no build step" constraint plus GitHub Pages hosting, any redesign direction that wants to stay easily comparable/deployable side-by-side with the current version should likely also stay dependency-free vanilla JS/CSS, unless the user explicitly signs off on introducing tooling for the redesign work itself.

---

## 15. Existing animations and interactions

**Fact**, cataloged from `style01.css` and the JS modules:

- **Scroll reveal** (`main.js`): each top-level section (not each card) fades up 16px into place once, the first time it enters the viewport, via `IntersectionObserver` at 10% threshold. One-shot, not repeated on scroll-back.
- **Closing rotor** (`closingRotor.js`): a scroll-driven sticky pseudo-3D stack of exactly 3 panels (Platform Evolution → Final CTA → Contact) that rotate/scale/translate based on scroll progress through a tall (`190vh`) shell, lerped toward a target each frame (`currentProgress += diff * 0.2`) via `requestAnimationFrame` for smoothing rather than snapping directly to scroll position. Falls back to normal static stacked layout under reduced motion or at ≤840px. Custom hash-link handling (`#roadmap`/`#final-cta`/`#contact`) drives programmatic smooth-scroll to the right panel since native anchor jumps can't target a scroll-transformed position.
- **Portfolio deck rotator** (`portfolio.js` + CSS custom properties `--distance`/`--abs-distance`): cards arranged in a horizontal pseudo-3D deck (`translateX`/`rotateY`/`scale`/`opacity` all driven by signed distance-from-active-card), autoplay every 4.6s (pauses on hover, needs ≥3 cards), prev/next arrows, clickable nav dots, click-or-focus-to-bring-to-front, keyboard support (Enter/Space), and a "deal/stack" transition when filters change (cards animate off to a deck position, then back in staggered by ~45–55ms per card) — all skipped/collapsed under reduced motion or mobile.
- **Detail modal**: fade + slight translateY/scale entrance and exit (240ms), backdrop blur, Escape-to-close, focus-to-close-button on open.
- **Micro-interactions**: buttons lift 2px + brighten on hover, scale down on press; nav mobile menu scale/opacity/translate open; hamburger-to-X icon morph tied to the same `aria-expanded` attribute driving the menu (can't drift out of sync); filter chips lift/scale on hover/press; nav dots widen into a pill when active.
- **Global motion tokens**: one shared strong ease-out curve and three duration tiers reused everywhere (documented rationale in CSS comments), rather than ad hoc per-component easings.

**Inferred:** Motion is already reasonably disciplined by Emil-Kowalski-style standards — durations are short (140–360ms range), reduced-motion is respected everywhere including JS-driven effects (not just CSS), and the in-code comments show deliberate reasoning for choices (e.g., "one reveal per section, not per card, so scrolling doesn't turn into a barrage"). The closing rotor and portfolio deck are the two most elaborate/bespoke pieces of motion, and the portfolio deck is explicitly protected by `DESIGN.md`.

---

## 16. Other things inferred from the code/docs worth flagging

- **Inferred:** The portfolio is structured as a single JS data array plus generic rendering — a real content-management convenience already built in, meaning content growth (more case studies) is cheap; a redesign shouldn't need to hardcode new markup per project.
- **Inferred:** The `.impeccable/config.json` contains a recorded false-positive override for a contrast-checker rule on `index01.html`, with a note that the tool's static analysis couldn't resolve nested rgba-over-gradient backgrounds but real pixel sampling confirmed 10.48:1 contrast — i.e., contrast on the panel-card text has already been manually verified as compliant despite what an automated tool would flag.
- **Fact:** A skills/tooling lock file (`skills-lock.json`) and `.agents/skills/*` directory show that this project has design/animation-review tooling (Impeccable, animation skills, etc.) already integrated into its workflow — consistent with the user's brief referencing Taste, Emil Kowalski's animation skill, and Impeccable as available tools.
- **Unclear/Missing:** No stated performance budget, analytics/tracking setup, or SEO strategy beyond basic meta tags was found for `index01.html` specifically (the coming-soon `index.html` has fuller Open Graph/Twitter/JSON-LD SEO markup; `index01.html`'s `<head>` is comparatively minimal — one generic meta description, standard favicons, no Open Graph/Twitter/structured data block at all). This is worth confirming before the redesign ships as the new homepage, since promoting it to root implies it needs to carry that SEO weight too.
- **Unclear/Missing:** Pricing is not present anywhere in `index01.html` (unlike the i18n dictionary's leftover `.price[data-price-usd]` handling logic in `applyTranslations()`, which converts USD to HUF — this suggests a pricing section existed at some point, or was planned, but isn't currently rendered anywhere in the page markup). Worth asking about rather than assuming either way.
- **Unclear/Missing:** No founder photo, bio, or direct "About" section currently exists despite `DESIGN.md` listing "About" as a creative area and `PRODUCT.md` emphasizing founder-led personal branding — currently the founder's presence is only implicit (trust-panel copy, PRODUCT.md's mention of a LinkedIn link that isn't actually present in the HTML I read).
- **Fact:** Contact email discrepancy exists between `hello@anominsight.com` (all on-page copy) and `info@anominsight.com` (`PRODUCT.md`'s stated Brand Commitment, and the coming-soon page's structured data/visible email) — flagged in §9, repeated here because it directly affects any Contact-section content in a redesign.

---

## Summary of open threads to resolve before/while redesigning

These are pulled together from the "Unclear/Missing" and inconsistency notes above — not new questions, just a consolidated pointer to Phase 2:
1. First-person voice ("I") vs. "we" — which is final, and is the in-progress `i18n.js` edit the intended direction?
2. `hello@anominsight.com` vs `info@anominsight.com` — which is correct/current?
3. Should a founder/About presence be added, given `DESIGN.md` names it as a creative area but no such section exists today?
4. Is pricing intentionally absent, or was a pricing section removed/deferred (the leftover HUF-conversion code suggests it existed at some point)?
5. `index01.html`'s thin SEO/social-sharing head vs. the coming-soon page's fuller one — does promoting index01 to root need that metadata ported over?
