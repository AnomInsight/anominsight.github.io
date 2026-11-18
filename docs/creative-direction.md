# AnomInsight – creative direction: Finding Signal in Noise

Status: **approved and implemented** (2026-11-17) in Version D (`src/frontend/versions/d/`).
User refinements at approval: no inspection lens in the first release; phones get a simplified,
non-pinned alternative; illustrative data clearly labelled, no invented outcomes. Product facts: `client-brief.md`. Tokens and
components: `design-system.md`. Motion: `motion-spec.md`.

---

## 1. Concept

**Finding Signal in Noise.** The site does what the practice does: it starts with a field of raw,
hard-to-read data, finds the one reading that matters, turns it into a readable interface, and ends
on a decision the visitor can act on.

> Complex data → meaningful signals → actionable insights → better decisions.

**Thesis.** The site is the analyst's instrument, not the vendor's dashboard. One continuous
visualisation carries the story from the hero to the first call to action; everything else on the
page is quiet, typographic and evidence-led, so the one moving thing means something.

**What it refuses.** The category default for "AI analytics" sites: a glowing neural-network hero,
neon gradients, floating glass dashboard screenshots full of invented KPIs, and a centred headline
over three equal feature cards.

## 2. Why this concept fits this business

- **The name already says it.** Anom + Insight is the two-step the concept dramatises.
- **The logo already draws it.** An eye whose pupil is a rising bar chart: looking closely at data.
  The concept's flag ring around the anomaly echoes the logo's iris.
- **Version A already seeded it.** The hero figure (expected-range band, one flagged torque reading,
  Anomaly → Insight readout) is the strongest, most specific element of the current site. Version D
  promotes it from a boxed figure to the spine of the homepage.
- **It covers the whole service range, not only anomaly detection.** Cleaning the noise is the data
  audit; finding the signal is anomaly detection, forecasting and predictive maintenance; showing the
  insight is dashboards and reporting; keeping watch is ongoing monitoring; putting it to work inside
  the client's systems is integrated implementation.
- **It is honest by construction.** The demonstration is labelled illustrative and is followed
  directly by the real, measured results from published case studies. The contrast between "this is
  how it works" and "this is what it achieved" is the trust move.

## 3. Brand personality

| Trait | Shows up as | Not |
|---|---|---|
| Precise | hairline grids, exact alignment, tabular figures, small radii | cold or clinical |
| Calm | one moving system, long quiet passages, no loops elsewhere | sleepy or empty |
| Candid | "Illustrative example" labels, sources under figures, no projections | apologetic |
| Expert | specific language (expected range, flagged reading, tool wear) | jargon walls |
| Personal | first person, the founder's face beside the first call to action | casual or chummy |

## 4. Art direction

- **Ground:** deep charcoal, almost black, with the faint warmth of the logo's black. Flat; the only
  atmosphere is the data itself.
- **Gold is signal.** The logo's champagne gold is reserved for what matters: the flagged anomaly,
  the primary action, measured results, focus states. Everything else is charcoal, ivory and muted
  greys. If gold appears, something was found.
- **Steel is the model.** A muted cool grey draws the expected range and model outputs, so "what we
  expect" and "what we found" are never the same colour.
- **Noise is warm grey.** Raw data points are low-contrast warm greys at varied opacity.
- **Composition:** editorial scale (large display type, generous measure, chapters with real breathing
  room) set on a technical substrate (a 12-column grid, hairline rules, data marks). Asymmetric split
  layouts; no rows of equal cards.
- **Surfaces:** edge-defined panels (1px hairline, small radius), no wide drop shadows, no glass blur,
  no gradients except the brushed-gold fill on the primary button and the flag.
- **Imagery:** the data visualisation is the hero image. The founder portrait is the only photograph.
  The 64px icon PNGs from Version A are not used in the new homepage composition.

## 5. Visual storytelling sequence

| Act | Page section | What the visitor sees | What they understand |
|---|---|---|---|
| 1 – The noise | Hero | One composition, not a split screen: the headline leads (about 60% of the visual weight) and a field of data points fills the whole hero behind it – faint behind the text, strongest toward the right, no panel edge, no label, a barely-there grid. On phones the field is a soft-edged band under the copy. | "This is about data most companies cannot read." |
| 2 – The discovery | "How it works" story, steps 1–2 | Scrolling sorts the field into three sensor streams on one time axis; an expected range draws over each; readings inside it dim and recede; one reading stays outside and turns gold, a ring closing onto it. | "He finds the reading that matters." |
| 3 – The insight | Story, step 3 | The flagged stream becomes the chart of a compact, readable interface: one chart, three status tiles, one alert row. Labelled "Illustrative example". | "The result is something I can read in seconds." |
| 4 – The action | Story, step 4 + close | A decision card resolves the alert into a next step ("plan a tool change before the next shift") and the chapter closes with the call to action, then the real measured results and the service map. | "This leads to a decision, and here is how to start." |

The story uses the existing method copy (data input → analysis → insights → continuous improvement)
and the problem / solution copy, so the animation carries real content instead of decorating it.

## 6. Signature visual elements

1. **The field** – canvas data points; the only continuously moving element on the site, and only
   in the hero.
2. **The expected range** – a dashed steel band, drawn left to right; the model's "normal".
3. **The flag** – a gold point, a ring contracting onto it and a dotted leader dropping to the time
   axis. The brand's mark in motion; also used statically (services page header, favicon-scale
   glyph in the service map).
4. **The readout** – Anomaly → Insight → Next step, the three-part sentence the whole site resolves
   to.
5. **The technical grid** – hairline guides in the stage and page openers only, never page-wide
   wallpaper.
6. **The illustrative label** – "Illustrative example – CNC machine torque" sits inside the stage at
   every step and is never animated out.

**Demonstration data rule (applied).** The interface shows only what the illustration itself
contains: counts of drawn readings, computed from the data ("52 readings checked", "1 outside expected
range"), states ("Review needed"), a hedged cause ("Likely cause: early tool wear") and the next step.
No money, percentages, uptime figures or anything that reads as a client result.

## 7. Design principles

1. **One moving system.** All authored motion belongs to the signal story; the rest of the page
   stays still except for hover, press and focus feedback.
2. **Gold means found.** Never decorative; if everything is gold, nothing is signal.
3. **Prove, then claim.** The illustration is labelled; the measured results follow it immediately.
4. **Readable at rest.** Every step of the story reads correctly with no script, with reduced motion,
   and frozen at any scroll position.
5. **Type carries the page.** Hierarchy comes from scale and weight contrast, not boxes.
6. **Fewer, stronger sections.** Merge sections that say the same thing; vary density so a dense
   passage earns a quiet one.
7. **Both languages, first class.** Every composition is checked in Hungarian at 320px.

## 8. Approved and rejected patterns

| Approved | Rejected (and why) |
|---|---|
| Canvas 2D point field, scroll-scrubbed inside one sticky section | WebGL / Three.js particle systems (cost without visible benefit at this point count) |
| Sticky stage with steps beside it (native scroll, no snapping) | Scroll-jacking, smooth-scroll libraries, scroll-snap (Version A's original 190vh rotor was removed for this reason) |
| Gold only for signal, action and measured results | Gold headings, gold-highlighted words in headlines, gold borders everywhere |
| Small radii (2–8px), 1px hairlines | Rounded pill cards, glassmorphism, blurred translucent headers |
| Qualitative, clearly labelled illustrative interface | Dashboard mock-ups with invented KPIs, revenue or uptime numbers |
| Typographic lists and split layouts | Rows of equal icon cards, icon tiles as decoration |
| One pause control for the only continuous motion | Count-up numbers, looping pulses, marquees, blinking cursors |
| Pinned, scrubbed story on wide screens; one short play per step frame on phones | A pinned stage on phones (it squeezes the reading area and fights the phone's own scrolling) |
| – | A cursor "inspection lens" in the hero (removed for the first release; may be revisited) |
| Static content everywhere outside the story | Fade-up reveals on every section (Version A has these; Version D drops them) |
| Founder portrait as the only photograph | Stock photos of people pointing at screens, server rooms, abstract "AI" renders |
| Neutral charcoal ground | Neon accents, glowing edges, purple/blue "AI" gradients |

## 9. Skill and process notes

- **Impeccable** (`.claude/skills/impeccable`): project context loaded with `impeccable context`
  (PRODUCT.md + DESIGN.md); `shape` and `new-work` read. Mode: **Persuade**. The brief pins the visual
  world ("deep charcoal and near-black surfaces … restrained warm metallic-gold accents … soft ivory
  or neutral text … subtle technical grid lines … muted secondary data colors") and the first-viewport
  experience ("a dark, sophisticated canvas containing a controlled field of data points, signals, and
  analytical structures"), so the concept-seed roll was skipped under new-work's pinned-direction
  exception: `seed: none (pinned)`. No image generation is available, so the build is **code-led**;
  the ambition lives in the direction contract (written to the surface brief after approval) and is
  audited in behaviour.
- **Taste** (`design-taste-frontend` 2.5): AnomInsight classifies as kind **service** (people hire
  the founder) with a technical subject (AI and data), which Taste's rule 8 allows one technical
  visual for. Adopted: one moment per long page held with `position: sticky` and scrubbed to the
  scrollbar; nothing else moves on scroll; pause control for motion longer than 5 s; reduced motion
  and no-script show the finished still; one button pair; hover/press feedback; its copy-lint,
  consistency, layout, perf and gate scripts for the audit. Not adopted, by the brief's authority:
  the palette, hero and moment **dealers** (the palette is derived from the logo and the signature
  experience is pinned) and the "no caption under any visual" rule (the illustrative label is
  required by the brief and by `CLAUDE.md`; it will be waived in the gate with that reason).

## 10. Scope beyond anomaly detection (refinement, 2026-11-18)

**Positioning.** AnomInsight turns complex data into meaningful signals and better decisions;
anomaly detection is the opening metaphor, not the whole offer. The scope on the page: anomaly
detection, forecasting and regression, classification, clustering, predictive maintenance,
dashboards and reporting.

**How it is shown without diluting the story.**
- The hero and "How it works" stay one anomaly story (the clearest metaphor).
- "What I deliver" opens with **Same data, different questions**: the story's 52 spindle-torque
  readings, re-arranged by the question asked – *Detect* (expected range + flag), *Forecast*
  (least-squares trend, widening range, the point where it reaches a limit – regression and
  predictive maintenance), *Group* (k-means on torque against temperature – clustering), *Classify*
  (a boundary between "Normal" and "Watch" – classification). The points move between views, the
  flagged reading stays the one gold point in every view, and the dashboard/reporting outcome is
  already the story's panel (step 3). One system, four questions; no separate widgets.
- Copy: D's page title, meta description, services intro and the service map name the full range
  (new D-only keys; Version A's copy is untouched).

**Hero refinement (same date).** The stage is a full-width layer behind the hero; the field is
atmosphere (faint behind the headline, rising toward the right), the "Illustrative example" label
and the grid appear only when the story starts, and the pause control is a quiet corner button.
