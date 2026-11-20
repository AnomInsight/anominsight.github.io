# AnomInsight – client brief

Status: brief for **Version D ("Signal in Noise")**, written 2026-11-17 before implementation and
kept current; Version D is now built (`src/frontend/versions/d/`). It summarises what is true about
the business so the design does not drift from it.

Sources of truth, in order: the user's latest instruction > current code > `CLAUDE.md` >
`PRODUCT.md` > this file. `PRODUCT.md` stays the durable record of product facts; this brief does not
replace it. `docs/product-understanding.md` is an older analysis snapshot (it still describes a free
data audit as the entry offer, which is no longer true; whether to update it is an open question in
`CLAUDE.md`).

---

## 1. Business identity

- **Name:** AnomInsight (from *anomaly* + *insight*).
- **What it is:** a founder-led AI and data analytics practice. One person, Bence Csomor (founder and
  data scientist), builds and delivers every audit, model and dashboard.
- **Positioning:** deliberately dual. A solo consulting practice today, and the on-ramp to a reusable
  analytics and anomaly-detection platform later. The site must not force a choice between "just a
  freelancer" and "just a SaaS company".
- **Voice:** first person singular ("I"), never the corporate "we". Calm, candid, specific.
- **Languages:** English and Hungarian, with full parity (Hungarian is a first-class audience).
- **Stage:** pre-launch. The domain root shows a Coming Soon placeholder; Version A
  (`src/frontend/versions/a/`) is the current main site candidate, built but not yet promoted.

## 2. Actual services (the complete portfolio)

AnomInsight is **not only anomaly detection**. The site must present the whole range:

**Free entry offer**
- **Discovery Call** – 30 minutes, free, no obligation, booked through Google Calendar. Covers the
  problem, the data sources, what a useful result looks like, whether data analysis or ML is the right
  tool, and a recommended next step (with a custom quote if it fits).

**Paid packages** (all quoted individually; no prices are published anywhere)

| Package | What the client receives |
|---|---|
| Data Audit | Exploratory data analysis, data quality assessment, recommendations; delivered as a PDF/PPT report. |
| One-off Project Delivery (Featured) | A custom ML model, anomaly detection or automation solution for one problem; dashboard walkthrough + written report. Code and pipeline are not handed over. |
| Integrated Implementation (Full Handover) (Most complete) | A deployment-ready solution integrated into the client's systems, with integration support. The client gets the rights to use the project-specific solution; general reusable components and methods stay reusable by the provider. Never worded as exclusive or full ownership of all code; the contract sets IP terms. |
| Ongoing Monitoring & Reporting | Weekly or monthly data refresh, updated dashboard view, PDF report and a 30-minute review meeting each cycle. |

**Capabilities named on the site**
- Core: data audit and quality assessment · interactive dashboards · automated reporting.
- Advanced, built on request: anomaly detection · forecasting models · predictive maintenance.
- Disciplines: data engineering · machine learning · visualisation · predictive analytics.

**Method (as published):** data input (Excel, SQL, API) → analysis (cleaning, analytics, ML) →
insights (dashboards, reports, recommendations) → optional continuous improvement (monitoring, model
updates).

**Roadmap (as published):** available now – data audit, dashboards, automated reporting; in
development – real-time anomaly detection, predictive analytics, API integrations (SQL, ERP, IoT).

## 3. Target audience

- Decision-makers at data-driven SMEs and industrial companies: owners, operations and plant
  managers, technical leads.
- Sectors named on the site: manufacturing; logistics and supply chain; e-commerce; energy and
  utilities; any data-driven organisation. The published evidence is strongest in manufacturing.
- Their situation: they already have data (spreadsheets, SQL databases, APIs, sensors) but no
  in-house capacity to turn it into decisions. Their pains, in the site's words: unexpected downtime,
  revenue lost to inefficiency, poor forecasting, slow decision-making.
- Their state of mind on arrival: sceptical of generic "AI" marketing, short on time, looking for
  someone who can be checked.

## 4. Value proposition

> Turning complex data into meaningful insights and better business decisions – by one accountable
> specialist who shows the work.

Supporting truths that a generic vendor cannot copy:
1. **Evidence on hand:** three published case studies with public GitHub repositories and disclosed
   results (96% of real CNC failures caught in testing; 99.27% best-model accuracy on handwritten
   digits; a restaurant chatbot demo, explicitly a demo).
2. **Founder-led:** the person on the discovery call is the person doing the work.
3. **From signal to decision:** deliverables end in a decision or next step, not just a chart.

## 5. Conversion goals

| Priority | Goal | Where it happens today |
|---|---|---|
| Primary | Book the free discovery call | Calendar link (hero, final CTA, services page) |
| Secondary | Send an enquiry or request a quote | Formspree contact form; package "Get a custom quote" links prefill it |
| Secondary | Explore the service packages | `services.html` |
| Supporting | Inspect the work | Portfolio cards → GitHub repositories |
| Supporting | Email directly | `hello@anominsight.com` |

## 6. Existing content and brand assets

- **Logo:** an eye whose pupil is a rising bar chart, in brushed champagne gold on black
  (`images/Logo_small_2.png`, circular crops `logo-circle-96/184.png`, favicon set). Sampled gold:
  highlight `#F1D5A2`, body `#CFB588`, shade `#A99470`, deep `#645640`.
- **Current site palette (Version A):** warm near-black `#0c0a08`, amber `#d9a36b`, gold `#f0c882`,
  ivory text `#f7f2de`, sand muted text `#e3d2b3`. The amber is warmer and more orange than the logo.
- **Type:** Manrope (display, 600–800) + Source Sans 3 (body, 400–700), self-hosted variable woff2,
  latin + latin-ext (needed for Hungarian ő/ű).
- **Imagery:** founder portrait (`founder-bence-csomor.png`, 256px WebP); twelve 64px icon PNGs
  (recoloured by CSS filter); no photography of client sites or products exists.
- **Copy:** all EN + HU strings in `src/frontend/shared/content.js`; case-study data in
  `shared/portfolio-data.js`. Approved user wording: hero headline (EN "See what your data is
  hiding." / HU "Lásd meg, amit az adataid elrejtenek."), the HU package titles, the HU terminology
  table in `CLAUDE.md` §6.
- **Signature seed already built:** Version A's hero figure (`.signal`), an illustrative torque trace
  with an expected-range band and one flagged reading, read as Anomaly → Insight. Version D grows its
  whole concept from this figure.
- **Contact endpoints:** Formspree `xjykwlyk`, Google Calendar booking link, LinkedIn, GitHub org.

## 7. Constraints carried into Version D

- Static HTML/CSS/vanilla JS, ES modules, no build step, no package manager; GitHub Pages.
- Portfolio section structure and interaction are protected (`DESIGN.md`).
- No fabricated clients, logos, testimonials, metrics or results. Illustrative visuals must be
  labelled as illustrative and must not look like real client data.
- No prices anywhere. The free offer is the discovery call, not a data audit.
- Every visible string in EN and HU; HU follows the terminology table.
- `versions/original` is frozen; Version A is not edited by the Version D work.

## 8. Unknowns that need the client's answer

Existing open questions (from `CLAUDE.md` §12, still open):
- HU package titles "Adat Audit" / "Rendszeres Monitoring & Reporting" vs. the terminology standard.
- Hero call note and figure readout copy (drafted, not yet confirmed).
- Whether the roadmap wording ("real-time anomaly detection … in development") is clear next to
  anomaly detection already being offered as project work.
- Whether to update or leave `docs/product-understanding.md`.

Settled for Version D (2026-11-17): the logo-gold palette, typography and restrained motion are
approved; the illustration shows counts and states only; the cursor lens is out of the first
release; phones get a simplified, non-pinned story.

Still open for Version D:
- A native read of the new Hungarian copy (`implementation-plan.md` §6), especially the technical
  terms, and of the English stage wording.
- Whether Version D replaces Version A as the candidate for promotion to the domain root.
- Post-launch measurement: no analytics or RUM is installed, so field Core Web Vitals will not exist
  until the site is live and indexed (CrUX) or a RUM snippet is added.
