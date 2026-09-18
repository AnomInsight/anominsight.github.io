# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are decision-makers (owners, ops/plant managers, technical leads) at data-driven businesses — manufacturing, logistics/supply chain, e-commerce, energy/utilities, and similar operations — who have data (Excel, SQL, APIs, sensors) but lack the in-house capacity to turn it into decisions. Their job: get a data audit, catch anomalies or failures early, forecast trends, and see clear dashboards instead of guessing.

## Product Purpose

AnomInsight is a founder-led AI data-analytics practice (founder: Bence Csomor) that turns a client's raw operational or business data into anomaly detection, predictive maintenance, forecasting, dashboards, and automated reporting. Success is a client engagement that starts from a free data audit and ends in a working, decision-useful analytics deliverable.

## Positioning

Confirmed as deliberately dual: this is a solo consulting practice today, and the engagements are also the on-ramp to an eventual reusable analytics/anomaly-detection platform — the two framings are not in tension and future work should not force a choice between "just a freelancer" and "just a SaaS company." What a generic analytics vendor can't truthfully copy: a single identifiable founder backing every claim with a real, published, GitHub-linked case study and concrete measured results (e.g., 96% failure-catch rate on a CNC predictive-maintenance model, 99.27% accuracy comparing five models on a digit-classification task), rather than generic platform marketing.

## Operating Context

- Bilingual audience: site content ships in English and Hungarian (`data-i18n` attributes + a translation dictionary in `src/frontend/js/i18n.js`); Hungarian is a first-class audience, not an afterthought.
- Client contact happens through a Formspree-backed contact form, a Google Calendar booking link, and direct email (info@anominsight.com).
- Case studies link out to public GitHub repos under the `AnomInsight` org for anyone who wants to inspect the actual work.
- Hosted on GitHub Pages (custom domain via `CNAME`, `.nojekyll`), as fully static HTML/CSS/JS with no build step or package manager.

## Capabilities and Constraints

- Two front-end surfaces currently coexist: the live homepage (`index.html`, root) is a "Coming Soon" placeholder; the fuller marketing/portfolio build (`src/frontend/index01.html`, with `style01.css` and the `src/frontend/js/*` modules: `main.js`, `i18n.js`, `portfolio.js`, `contactForm.js`, `closingRotor.js`) is more complete and is confirmed to be the intended near-term homepage replacement — future work should treat promoting/merging it to root as live, not as a hypothetical.
- Portfolio content is data-driven from a single collection (`portfolioProjects` in `portfolio.js`), tagged with status (e.g., case study, live, pilot, prototype) and category, so new projects or filters can be added without a redesign.
- No framework, bundler, or CMS is in use; any new capability should default to staying static/vanilla unless there's a concrete reason to introduce tooling.

## Brand Commitments

- Name: AnomInsight. Founder: Bence Csomor (linked from the site to his LinkedIn).
- Existing logo (`images/Logo_small_2.png`), favicon set, and GitHub org (`github.com/AnomInsight`) are established assets to reuse, not replace casually.
- Contact email: info@anominsight.com.

## Evidence on Hand

Three real case studies with concrete, disclosed results, each linked to a public GitHub repo:
1. Predictive maintenance for CNC operations — LightGBM model, 96% real-failure catch rate in testing.
2. Handwritten digit classifier for mail sorting — compared 5 model types, best (CNN) reached 99.27% accuracy.
3. AI chatbot for restaurant ordering/support — a demo pizzeria site with an LLM-powered (Groq) chat widget grounded in real menu/hours data; explicitly a demo project, not a live paying client.

No client testimonials, press mentions, paying-customer logos, or third-party case studies exist yet — future work must not fabricate these.

## Product Principles

1. Lead every claim with real, verifiable evidence (working case studies, linked source code, concrete measured metrics) instead of generic platform marketing.
2. Stay founder-led and personal in voice — the brand is one identifiable person, not an anonymous company.
3. Consulting work and platform ambition reinforce each other; don't design as if only one is true.
4. Treat Hungarian-language visitors as a first-class audience with full parity, not a secondary translation layer.
5. Keep the stack static and dependency-free unless a real need forces otherwise — simplicity is a deliberate choice, not a limitation to fix.
