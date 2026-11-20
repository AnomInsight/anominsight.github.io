# Launch deployment – Version D at anominsight.com

Prepared 2026-11-20 on branch `feature/seo-launch`. Nothing here has been run against
production. Every step below is the owner's to take, in order.

## How the site deploys today

- GitHub Pages, legacy "Deploy from a branch": `main`, folder `/` (root). Every push to `main`
  publishes the whole repository root as-is.
- The domain root `/` is the Coming Soon placeholder (`index.html` at the repo root).
- Because the whole root is published, internal files are publicly reachable on the domain
  (checked 2026-11-20, HTTP 200): `CLAUDE.md`, `PRODUCT.md`, `docs/*.md`, `skills-lock.json`,
  and all design versions under `src/frontend/versions/` (A, B, C, D, original, the comparison
  index). The repository itself is public, so this content is public in any case; the new
  deploy stops serving it on the domain, it does not make it private.

## What the launch build produces

`node tools/build-site.mjs` writes `dist/` (gitignored) from Version D; then
`node tools/check-site.mjs` checks it (allowlist, canonical/hreflang/sitemap consistency,
robots rules, structured data, every reference resolving, no retired CNC claims or old
postal framing of the digit study). Both are
plain Node scripts with no dependencies.

| URL | What | Indexable |
|---|---|---|
| `/` | Homepage, Hungarian | yes |
| `/en/` | Homepage, English | yes |
| `/szolgaltatasok/` | Services, Hungarian | yes |
| `/en/services/` | Services, English | yes |
| `/404.html` | Bilingual not-found page (GitHub Pages serves it for unknown paths) | no (`noindex`) |
| `/src/frontend/versions/d/index.html`, `…/services.html` (and `…/d/`) | Redirect stubs for the pre-launch URLs: `?lang=en` → English page, `?lang=hu` → Hungarian page, no parameter → browser language; `#hash` kept | no (instant redirect + canonical) |
| `/robots.txt`, `/sitemap.xml` | Crawler rules and the 4 indexable URLs with hreflang alternates | – |

Each indexable page has: `lang`, its own title and meta description, a self-referencing
canonical, hreflang `hu` / `en` / `x-default` (→ the Hungarian page), Open Graph + Twitter card tags,
JSON-LD (Organization, Person, WebSite, WebPage; plus the five Service packages on the
services pages, with no prices or offers), the page copy already in the HTML, and on the
homepages the three case studies as plain HTML for crawlers and no-JS visitors.

Artifact contents (34 files, about 1.1 MB): the 4 pages, `404.html`, `robots.txt`,
`sitemap.xml`, `favicon.ico`, the 2 redirect stubs, Version D's CSS and 5 JS modules, the 5
shared JS modules D imports, 7 images, 4 woff2 fonts and their 2 OFL licences. No Markdown, no
docs, no other versions, no `tools/`, no dot-files, no `CNAME`.

Old `?lang=` links on the new pages: `/?lang=en` goes to `/en/`, `/en/?lang=hu#contact` to
`/#contact`; a matching or unknown `lang` is dropped from the address bar. The canonical tags
keep `?lang=` variants out of the index.

## Deployment workflow (prepared, inactive)

`.github/workflows/deploy-pages.yml` builds, checks and deploys only `dist/`. It runs only when
started by hand (`workflow_dispatch`); it does not enable or change Pages settings
(`configure-pages` runs without `enablement`). Do not start it before step 3 below. The
`.gitignore` now ignores `.github/*` except `.github/workflows/`, so local agent tooling in
`.github/` stays untracked.

## Production steps

1. **Review and merge.** Review the branch, commit, push, open a PR into `main`, merge.
   On merge the legacy branch deploy publishes the repo root as before: the Coming Soon page
   stays at `/`; the CNC wording corrections become visible on the pre-launch pages under
   `/src/frontend/versions/`; `tools/` and the workflow file become reachable as files.
   Nothing else changes yet.
2. **Switch the Pages source.** Settings → Pages → Build and deployment → Source:
   **GitHub Actions**. Confirm the custom domain still reads `anominsight.com` and
   "Enforce HTTPS" stays on (with an Actions deploy the `CNAME` file is not used; the domain
   lives in this setting). The currently published site stays up until the next deployment.
3. **Deploy.** Actions → "Deploy site" → Run workflow on `main`. The build and check steps must
   pass; the deploy job then publishes `dist/`.
4. **Verify production** (expected result after each):
   - `https://anominsight.com/`, `/en/`, `/szolgaltatasok/`, `/en/services/` → 200, right
     language, view-source shows the copy and the canonical.
   - `https://anominsight.com/CLAUDE.md`, `/PRODUCT.md`, `/docs/qa-checklist.md`,
     `/skills-lock.json`, `/src/frontend/versions/a/index.html` → 404.
   - `/robots.txt` and `/sitemap.xml` → the generated files.
   - `/src/frontend/versions/d/index.html?lang=en` → lands on `/en/`.
   - `https://www.anominsight.com/` → 301 to the apex (unchanged DNS behaviour).
   - Send one real enquiry through the contact form and book a test slot via the calendar
     link (only the owner can confirm delivery).
5. **Search engines** (needs account access):
   - Google Search Console: a Domain property verified by a DNS TXT record at the registrar
     is the most robust option. Alternatively a URL-prefix property with the HTML-tag method:
     put the token in the repository variable `GOOGLE_SITE_VERIFICATION` and rerun the
     workflow (the build adds the meta tag). Then submit `https://anominsight.com/sitemap.xml`.
   - Bing Webmaster Tools: import from Search Console, or use `BING_SITE_VERIFICATION`.
   - OpenAI: no registration; OAI-SearchBot is explicitly allowed in `robots.txt` (OpenAI
     notes that robots.txt changes take about 24 hours to apply).
6. **Optional, later:** deploy on every push by adding `push: { branches: [main] }` to the
   workflow's `on:` block.

## Rollback

Settings → Pages → Source back to "Deploy from a branch" (`main`, `/ (root)`). GitHub then
rebuilds from the branch and the Coming Soon root returns; if no build starts on its own,
re-run the latest "pages build and deployment" run in the Actions tab. To roll back only a bad
content change, re-run an earlier successful "Deploy site" run.

## Local preview

`.claude/launch.json` (gitignored) has `static-site` (repo root, :4173) and `dist-site`
(`dist/`, :4174), both served by `.claude/serve.mjs`. Rebuild `dist/` after any source change.
The local server does not serve `404.html` for unknown paths the way GitHub Pages does.
