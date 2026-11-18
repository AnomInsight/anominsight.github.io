# AnomInsight – design system (Version D)

Status: **implemented** in `src/frontend/versions/d/` (approved and built 2026-11-17). The tokens at
the top of `versions/d/style.css` are the source of truth; this file describes them and was updated
to the shipped values. `DESIGN.md` (project-wide brand rules, protected components) still describes
the main site (Version A) and has not been rewritten for D; refresh it when D is promoted. Version A
keeps its own tokens (`CLAUDE.md` §5).

Contrast ratios below were computed with the WCAG 2.x relative-luminance formula for these exact
hex values; they still need to be re-checked in the rendered page (anti-aliasing, overlays).

---

## 1. Rules that hold the system together

- Every colour is a `:root` token; no raw hex or rgba outside `:root` (carried over from Version A).
  Alpha use goes through `*-rgb` triplets.
- **Gold is signal.** Gold tokens are used only for: the flagged anomaly and its ring, the primary
  button, measured-result figures, the active story step marker, focus rings and link underlines on
  hover. Not for headings, body text, borders at rest, or decoration.
- One button pair (primary, secondary), one panel style, one radius scale, one link style.

## 2. Colour tokens

Derived from the logo (sampled: highlight `#F1D5A2`, body `#CFB588`, shade `#A99470`, deep
`#645640`, ground `#010101`) and Version A's warm dark identity. **Change from Version A:** the accent
moves from amber `#D9A36B` (more orange than the logo) to the logo's champagne gold, and secondary
text moves from saturated sand `#E3D2B3` to a neutral warm grey, so gold stops being the page's
default tint and becomes a signal.

### Grounds and lines

| Token | HEX | Use |
|---|---|---|
| `--ground` | `#0B0A09` | Page background (flat) |
| `--ground-band` | `#121110` | Chapter bands (alternating grounds, as in Version A) |
| `--surface` | `#181715` | Panels: stage interface, form, dialog, package rows |
| `--surface-2` | `#201F1C` | Raised / hovered panel, input background |
| `--line` | `#2B2925` | Hairline rules and panel edges (decorative, 1px) |
| `--line-strong` | `#3D3A34` | Dividers that must read at a glance |
| `--field-border` | `#75716A` | Input and checkbox borders (≥3:1 for UI components, see §8) |
| `--grid-rgb` | `243, 238, 226` | Technical grid lines at 4–5% alpha (stage and page openers only) |

### Text

| Token | HEX | On `--ground` | On `--surface` | Use |
|---|---|---|---|---|
| `--ivory` | `#F3EEE2` | 17.1:1 | 15.5:1 | Headings, body text |
| `--ivory-muted` | `#B9B2A4` | 9.4:1 | 8.5:1 | Secondary text, leads |
| `--ivory-faint` | `#8D877B` | 5.5:1 | 5.0:1 | Captions, sources, illustrative label (AA for small text) |

### Signal (gold)

| Token | HEX | On `--ground` | Use |
|---|---|---|---|
| `--gold-hi` | `#F1D5A2` | 13.9:1 | Flag point, focus ring, figures, gold text |
| `--gold` | `#CFB588` | 10.0:1 | Primary button body, active step marker, link underline |
| `--gold-lo` | `#A99470` | 6.7:1 | Flag ring at rest, gold strokes |
| `--gold-deep-rgb` | `100, 86, 64` | – | Low-alpha gold tints (flag halo at ≤12%) |
| `--on-gold` | `#15120C` | 9.5:1 on `--gold` | Text on gold fills |
| `--gold-sheen` | `#E9CF9E` | – | Highlight stop of the brushed gradient |
| `--gold-brushed` | `linear-gradient(100deg, gold-lo 0%, gold-sheen 42%, gold 68%, gold-lo 100%)` | – | Primary button fill only (the logo's brushed metal); the sheen shifts on hover |

### Data (muted secondary)

| Token | HEX | On `--ground` | Use |
|---|---|---|---|
| `--data-noise` | `#5E5A52` | 2.9:1 | Raw data points (decorative; drawn at 35–90% alpha) |
| `--data-series` | `#9C968A` | 6.7:1 | Normal readings, series lines |
| `--data-steel` | `#7F8C95` | 5.7:1 | Expected range, model output, stream labels |
| `--data-steel-rgb` | `127, 140, 149` | – | Expected-range band fill at 10–14% alpha |

### Status

| Token | HEX | On `--ground` | Use |
|---|---|---|---|
| `--error` | `#E08585` | 7.4:1 | Form errors only |

Form success text uses `--gold-hi`. `--mask-solid` (`#000`) is the opaque stop of the stage grid's
fade mask. Version A token names (`--accent`, `--accent-rgb`, `--muted`, `--surface-rgb`,
`--radius-md` and so on) are kept as aliases of these values, because the protected portfolio block is
copied from A verbatim and reads them.

## 3. Typography

**Faces (unchanged from Version A):** Manrope (display, variable 600–800) and Source Sans 3 (body,
variable 400–700), self-hosted, latin + latin-ext, `font-display: swap`, latin files preloaded.
Four font files in total. Recommendation: no third family. Distinctiveness comes from scale, weight
contrast and tight display tracking, and a data face would push the font budget past four files
(Taste perf budget) for one section. Alternative, if the user wants a more distinctive display face:
evaluate one in the build and keep it only if it holds Hungarian accents and stays within budget.

Numerals: `font-variant-numeric: tabular-nums` on every figure, count and data label.

### Responsive type scale

| Role | Size (clamp) | Face / weight | Tracking | Line height | Measure |
|---|---|---|---|---|---|
| Display XL – hero h1 | `clamp(2.75rem, 1.5rem + 3.6vw, 4.75rem)`; 5.25rem from 1760px, 5.75rem from 2200px | Manrope 800 | −0.035em | 1.0 | 13ch, balanced |
| Display L – every h2 | `clamp(2rem, 1.35rem + 2.2vw, 3.25rem)` | Manrope 760 | −0.025em | 1.06 | 17ch |
| Heading L – story step and close h3, service-map h3 | `clamp(1.625rem, 1.25rem + 1.1vw, 2.25rem)` | Manrope 760 | −0.025em | 1.1 | 18ch |
| Heading S – small h3 (roadmap, form) | `1.25rem` | Manrope 700 | −0.02em | 1.1 | – |
| h4 (service names) | `1.0625rem` | Manrope 700 | −0.01em | 1.1 | – |
| Figure – measured results | `clamp(2.25rem, 1.6rem + 2vw, 3.25rem)` | Manrope 800, tabular | −0.03em | 1.0 | – |
| Lead | `clamp(1.0625rem, 0.98rem + 0.35vw, 1.25rem)` | Source Sans 3 400 | 0 | 1.55 | 56ch |
| Body | `1rem` (never below 16px) | Source Sans 3 400 | 0 | 1.6 | 66ch |
| Small | `0.875rem` | Source Sans 3 400/600 | 0 | 1.45 | – |
| Label (data, meta) | `0.75rem` | Source Sans 3 600, uppercase | +0.08em | 1.3 | – |

Labels are used inside the stage interface and under proof figures only; they are not a decorative
kicker above every heading. Wide-desktop steps (1760, 2200) raise the h1 by one step, as in
Version A. Hungarian long compounds may need a soft hyphen to fit 320–360px phones.

## 4. Grid and spacing

- **Shell:** Version A's content measure, kept: `--shell` 1240px → 1380px (≥1440) → 1560px (≥1760)
  → 1720px (≥2200); `--gutter` 1.25rem → 2rem → 3rem → 4rem.
- **Columns:** 12 columns inside the shell, column gap `clamp(1rem, 2vw, 2rem)`. Split layouts use
  5/7 or 4/8, never 6/6 for text + visual.
- **Story layout:** from 60em (960px) the text column spans 5 of 12 and the sticky stage 7, bleeding
  to the right viewport edge (6/6 between 60em and 75em, so the Hungarian headline stays on three
  lines). Below 60em there is no pinned stage: the hero field is a full-bleed band (4:3) and each step
  has its own small frame (see `motion-spec.md` §7).
- **Other splits:** proof, founder, roadmap and contact use 4/8; the discovery-call section and the
  audience band use 6/6; the service-map rows use 3.5/5.5/3.
- **Spacing scale (4px base):** `--space-1` 0.25rem · `-2` 0.5 · `-3` 0.75 · `-4` 1 · `-5` 1.5 ·
  `-6` 2 · `-7` 3 · `-8` 4.5 · `-9` 6.5 · `-10` 9rem (new: chapter breaks).
- **Section rhythm:** `padding-block: clamp(4.5rem, 8vw, 8rem)`; more space above a heading than
  below it; story blocks are `min-height: 72svh` on wide screens (the closing block 84svh) and size to
  their content on narrow screens.
- **Breakpoints:** 900px (grids collapse), 840px (single column), text-driven ones in `em`
  (`52.5em` mobile nav, `68.75em` split layouts), wide steps at 1440/1760/2200 (all from Version A).
- **Grid tracks that hold cards or long words** use `minmax(0, 1fr)` (prevents 320px overflow in
  Hungarian), carried over from Version A.

## 5. Radii, lines, depth

| Token | Value | Use |
|---|---|---|
| `--r-1` | 2px | Tags, chips, status pills inside the stage |
| `--r-2` | 4px | Buttons, inputs, language toggle |
| `--r-3` | 8px | Panels, dialog, stage interface |
| `--r-round` | 50% | Avatar, flag point and ring only |

Depth comes from ground steps (`--ground` → `--surface` → `--surface-2`) and 1px edges. One shadow
token for the dialog and the open mobile menu: `0 24px 48px -24px rgba(0,0,0,0.6)`. No glass blur:
the fixed header is a solid `--ground` at 96% with a hairline bottom edge.

## 6. Components

| Component | Spec |
|---|---|
| Header | Fixed, 64px, fully solid ground (a 96% bar let scrolled text ghost through), hairline bottom. Logo mark 32px + wordmark. Nav order follows the page: How it works · Services · Projects · About · Contact; language toggle as a 4px-radius text button. Mobile menu at `52.5em`, full-width sheet under the header. |
| Hero | One composition: copy (h1 up to 5.5rem, lead, primary + secondary action, founder byline; max 42rem) over a full-width field that is faint behind the text and full strength toward the right. Phones: copy first, the field as a soft-edged band below it (no border, no label). |
| Signal stage | Wide screens: a sticky, full-width layer behind the hero and story text (`pointer-events: none`). Plot area starts at `--plot-left` (the grid's own column arithmetic, so it works without script): lanes, panel, decision card, the illustrative label (from the first story step) and the grid (20% in the hero, full from step 1, 45% behind the panel). Quiet 32px pause control bottom-right. Canvas pixel budget ~2.2 MP. A static SVG poster replaces the canvas without script. |
| Same data, different questions | Opens the service map: 4/8 split – h3, lead and four question buttons (`aria-pressed`; the active one has a gold name, an ivory question and a 2px gold underline, so the state is not colour alone) on the left; a 600×340 SVG chart (hairline grid, steel ranges, grey/ivory/steel points, the one gold reading), the active view's text, methods line and a body-small caption on the right (illustrative, synthetic data; trend, range, groups and boundary are sketches, not a trained, validated model). Phones: one column, questions in a 2×2 grid. Without script: the four texts as a list. |
| Story step | Index (`01`–`04`, the sequence) above the h3; under the h3 the discipline in plain small text (Data engineering / Machine learning / Visualisation / Predictive analytics) – no eyebrow labels above headings; then the text. Active step (wide screens): index turns gold. Text never dims. On narrow screens a frame (canvas, or a copy of the panel / decision card) follows the text, with the illustrative label under it. |
| Interface panel (illustrative) | The only edged box: header (stream name + legend), chart slot drawn by the canvas (its baseline is the one rule above the tiles), three status tiles as one row split by hairlines (no tile borders or fills; a short list on narrow screens), and the alert as a plain line with the gold flag glyph. `--r-3`. |
| Decision card | Three lines: Anomaly → Insight → Next step; gold flag glyph; sits over the interface at step 4. |
| Proof ledger | Ruled rows, no boxes: figure (gold), what it measures (ivory), source (linked to the case study's GitHub repository where one exists). |
| Service map | Four rows (Clean the noise · Find the signal · Show the insight · Keep watching – or run it yourself); each row: 32px stroke glyph (gold only in "Find the signal"), stage h3, the services in it (h4 + text), and the package(s) that deliver it, linked to `services.html#pkg-…`. |
| Portfolio | **Protected.** Structure and interaction exactly as Version A; only token remapping (colours, radius) is applied. |
| Founder | Portrait (WebP + PNG), name, role, two paragraphs, LinkedIn / GitHub links. |
| Audience + value | One band, two columns: "Who this is for" list and "What you gain" list, typographic, no pills. |
| Roadmap | Two columns: Currently available / In development; the "available" marker is a gold dot, "in development" a steel ring. |
| Final CTA + contact | Two band sections split by a hairline: discovery-call statement with the primary button beside a numbered list; ruled contact meta list, the secondary calendar button ("Book a free discovery call", one wording site-wide) and the form panel. |
| Package row (services) | Title, meta line, the story stage in plain small text under the meta (map wording; never an eyebrow), text, action. Featured row: `--surface` ground + the list's only primary button. Most complete: `--gold-lo` edge only. A row whose heading is the URL target gets a gold-lo outline. |

## 7. Buttons and interaction states

| | Rest | Hover (fine pointer) | Press | Focus-visible | Disabled |
|---|---|---|---|---|---|
| Primary | `--gold-brushed` over `--gold`, `--on-gold` text, 700 weight, `--r-2`, min-height 48px (one size only) | `translateY(-1px)`, `brightness(1.04)`, the sheen shifts | `scale(0.98)`, 90ms | 2px `--gold-hi` outline, 3px offset | 45% opacity, no hover |
| Secondary | transparent, 1px `--line-strong` border, `--ivory` text | border `--gold-lo`, ground `--surface-2`, `translateY(-1px)` | `scale(0.98)` | same ring | same |
| Text link | `--ivory`, 600 weight, `text-decoration` underline 1px `--line-strong`, offset 0.32em | underline turns `--gold` (160ms) | – | same ring | – |
| Nav link | `--ivory-muted` | `--ivory` + 2px gold underline draws | – | same ring | – |
| Icon button (pause, portfolio arrows) | 40px visual, 44px hit area via `::before` on coarse pointers | ground `--surface-2` | `scale(0.96)` | same ring | – |
| Input | `--surface-2` ground, 1px `--field-border` | – | – | border `--gold`, 2px ring | – |

Rules: one primary button per group; at most two hero actions; hover effects only under
`(hover: hover) and (pointer: fine)`; under `(pointer: coarse)` every control reaches 44px.

## 8. Accessibility considerations

- **Contrast:** body and secondary text ≥ 7:1, captions ≥ 4.5:1, input borders ≥ 3:1 (`--field-border`
  3.4–4.1:1 across grounds). `--data-noise` is decorative and never carries meaning.
- **Not colour alone:** the anomaly is gold *and* larger *and* ringed *and* labelled
  ("Outside expected range"); gold vs steel alone is only 1.7:1, so shape and text carry the meaning.
- **Canvas is decorative:** `aria-hidden="true"`; the story's meaning is in the step text. The stage
  gets a visually hidden summary of what the illustration shows at each step.
- **Motion:** one continuous motion (hero drift) with a visible pause control (WCAG 2.2.2); nothing
  flashes; full reduced-motion and no-script fallbacks (`motion-spec.md` §7).
- **Keyboard:** skip link first (it moves focus to the page's h1), visible focus ring everywhere,
  the sticky stage holds no focusable content except the pause control, which is a real
  `<button aria-pressed>` (Enter and Space verified); dialog focus trap and return (from Version A).
- **Text resizing:** text-driven breakpoints in `em`; layouts hold at 200% text size; no fixed
  heights on text containers (story steps use `min-height`).
- **Language:** `lang` switches on `<html>`; translated `aria-label`s via `data-i18n-aria`;
  new-tab hints on `target="_blank"` links.
- **Targets:** 44px on coarse pointers, 8px minimum spacing between targets.
