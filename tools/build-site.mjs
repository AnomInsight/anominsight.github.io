// Builds the public site into dist/ from Version D (src/frontend/versions/d).
//
// One static page per language: Hungarian at / and /szolgaltatasok/, English at
// /en/ and /en/services/. Each page gets its copy from shared/content.js already
// in the HTML (no JavaScript needed to read it), its own canonical, hreflang
// alternates, Open Graph tags and JSON-LD, and the case studies as plain HTML.
// Also writes robots.txt, sitemap.xml, 404.html and redirect stubs for the old
// Version D URLs. Only files the pages actually use are copied, so internal docs,
// other versions and dev config never reach the artifact.
//
// No dependencies. Usage: node tools/build-site.mjs && node tools/check-site.mjs
// Optional env: GOOGLE_SITE_VERIFICATION, BING_SITE_VERIFICATION (meta tokens).

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'dist');
const SITE = 'https://anominsight.com';
const SRC_DIR = '/src/frontend/versions/d/';
const LANGS = ['hu', 'en'];
const X_DEFAULT = 'hu'; // Hungarian SMEs are the primary audience; / is the default homepage
const OG_LOCALE = { hu: 'hu_HU', en: 'en_US' };
const LOGO = '/images/favicon-circle-512.png';
const EMAIL = 'hello@anominsight.com';
const SAME_AS_ORG = ['https://github.com/AnomInsight'];
const SAME_AS_FOUNDER = ['https://www.linkedin.com/in/bence-csomor-923a8b3b2/'];

const PAGES = [
  { id: 'home', src: 'index.html', paths: { hu: '/', en: '/en/' }, descKey: 'seo.homeDescription' },
  { id: 'services', src: 'services.html', paths: { hu: '/szolgaltatasok/', en: '/en/services/' }, descKey: 'seo.servicesDescription' },
];
const PACKAGES = ['discovery', 'audit', 'project', 'integrated', 'monitoring'];

const { translations } = await import(pathToFileURL(path.join(ROOT, 'src/frontend/shared/content.js')));
const { portfolioProjects, portfolioCategoryLabels, portfolioStatusLabels, getLabel } = await import(
  pathToFileURL(path.join(ROOT, 'src/frontend/shared/portfolio-data.js'))
);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => esc(s).replace(/"/g, '&quot;');
const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const fail = (msg) => {
  throw new Error(`build-site: ${msg}`);
};
// Replaces exactly one match, so a changed source page fails loudly instead of silently.
const replaceOnce = (html, re, fn, what) => {
  let count = 0;
  const out = html.replace(re, (...args) => {
    count += 1;
    return fn(...args);
  });
  if (count !== 1) fail(`${what}: expected 1 match, found ${count}`);
  return out;
};

// Mirrors applyTranslations() in shared/i18n.js: data-i18n sets the text,
// -aria / -placeholder / -title set those attributes. A missing key is an error.
const translate = (html, lang, where) => {
  const dict = translations[lang];
  const value = (key) => dict[key] || fail(`${where} (${lang}): missing key "${key}"`);
  html = html.replace(
    /<([a-z][a-z0-9]*)(\s(?:[^>]*?\s)?data-i18n="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g,
    (m, tag, attrs, key, inner) => {
      if (inner.includes('<')) fail(`${where}: data-i18n="${key}" holds markup; textContent would flatten it`);
      return `<${tag}${attrs}>${esc(value(key))}</${tag}>`;
    },
  );
  for (const [marker, target] of [
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ]) {
    html = html.replace(new RegExp(`<[a-z][a-z0-9-]*\\s[^>]*?${marker}="([^"]+)"[^>]*>`, 'g'), (tag, key) => {
      const v = escAttr(value(key));
      const attr = new RegExp(`(\\s${target}=")[^"]*(")`);
      return attr.test(tag) ? tag.replace(attr, `$1${v}$2`) : tag.replace(/\s*\/?>$/, (end) => ` ${target}="${v}"${end}`);
    });
  }
  return html;
};

// Same-site references become root-absolute; links to the two source pages
// become the page in this language (the #hash is kept, ?query dropped).
const rewriteUrls = (html, page, lang) => {
  const base = new URL(SITE + SRC_DIR + page.src);
  const bySrc = Object.fromEntries(PAGES.map((p) => [SRC_DIR + p.src, p]));
  const map = (val) => {
    if (!val || val.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(val) || val.startsWith('//')) return val;
    const u = new URL(val, base);
    const target = bySrc[u.pathname];
    return target ? target.paths[lang] + u.hash : u.pathname + u.search + u.hash;
  };
  return html
    .replace(/(\s(?:href|src))="([^"]*)"/g, (m, attr, val) => `${attr}="${map(val)}"`)
    .replace(/(\ssrcset)="([^"]*)"/g, (m, attr, val) => {
      const list = val.split(',').map((part) => {
        const [u, ...descriptor] = part.trim().split(/\s+/);
        return [map(u), ...descriptor].join(' ');
      });
      return `${attr}="${list.join(', ')}"`;
    });
};

// The case studies as plain HTML inside #portfolioTrack: what crawlers and
// no-JS visitors read. portfolio.js clears the track and renders the deck.
const staticPortfolio = (lang) => {
  const pick = (o) => o[lang] || o.en;
  // Metric values are stored once ("99.27%", "~2.4:1"); Hungarian uses a decimal comma.
  const number = (v) => (lang === 'hu' ? v.replace(/(\d)\.(\d)/g, '$1,$2') : v);
  const items = portfolioProjects.map((p) => {
    const metrics = (p.metrics || [])
      .map((m) => `<li><strong>${esc(number(m.value))}</strong> ${esc(pick(m.label))}</li>`)
      .join('');
    const categories = p.categories.map((c) => getLabel(portfolioCategoryLabels, c, lang)).join(', ');
    const repo = p.githubUrl
      ? `<a href="${escAttr(p.githubUrl)}" target="_blank" rel="noopener noreferrer" aria-describedby="newTabHint">${esc(translations[lang]['portfolio.githubButton'])}</a>`
      : '';
    return [
      '<li><article>',
      `<p class="portfolio-kind">${esc(pick(p.kindD || p.kind))} ·${esc(getLabel(portfolioStatusLabels, p.status, lang))}</p>`,
      // Version D's own wording (…D fields) wins, as in versions/d/portfolio.js.
      `<h3>${esc(pick(p.titleD || p.title))}</h3>`,
      `<p>${esc(pick(p.descriptionD || p.description))}</p>`,
      (p.overviewD || p.overview) ? `<p>${esc(pick(p.overviewD || p.overview))}</p>` : '',
      metrics ? `<ul>${metrics}</ul>` : '',
      `<p>${esc(categories)}</p>`,
      repo,
      '</article></li>',
    ].join('');
  });
  return `<ol class="portfolio-static">${items.join('')}</ol>`;
};

const verificationMeta = () =>
  [
    ['google-site-verification', process.env.GOOGLE_SITE_VERIFICATION],
    ['msvalidate.01', process.env.BING_SITE_VERIFICATION],
  ]
    .filter(([, token]) => token)
    .map(([name, token]) => {
      if (!/^[A-Za-z0-9_-]{8,128}$/.test(token)) fail(`${name}: unexpected token format`);
      return `<meta name="${name}" content="${token}" />`;
    });

const jsonLd = (page, lang, title, description) => {
  const dict = translations[lang];
  const other = LANGS.find((l) => l !== lang);
  const tD = (key) => dict[`${key}D`] ?? dict[key];
  const url = SITE + page.paths[lang];
  const ids = { org: `${SITE}/#organization`, founder: `${SITE}/#founder`, site: `${SITE}/#website` };
  const graph = [
    {
      '@type': 'Organization',
      '@id': ids.org,
      name: 'AnomInsight',
      url: `${SITE}/`,
      logo: SITE + LOGO,
      email: EMAIL,
      founder: { '@id': ids.founder },
      sameAs: SAME_AS_ORG,
    },
    {
      '@type': 'Person',
      '@id': ids.founder,
      name: dict['about.name'],
      alternateName: translations[other]['about.name'],
      jobTitle: tD('about.role'),
      image: `${SITE}/images/founder-bence-csomor.png`,
      worksFor: { '@id': ids.org },
      sameAs: SAME_AS_FOUNDER,
    },
    { '@type': 'WebSite', '@id': ids.site, url: `${SITE}/`, name: 'AnomInsight', inLanguage: LANGS, publisher: { '@id': ids.org } },
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: lang,
      isPartOf: { '@id': ids.site },
      about: { '@id': ids.org },
    },
  ];
  if (page.id === 'services') {
    // Descriptive only: no prices or offers (all paid packages are quoted individually).
    for (const id of PACKAGES) {
      graph.push({
        '@type': 'Service',
        '@id': `${url}#pkg-${id}`,
        url: `${url}#pkg-${id}`,
        name: tD(`packages.${id}.title`),
        description: tD(`packages.${id}.text`),
        provider: { '@id': ids.org },
      });
    }
  }
  // "<" escaped so the JSON can never close the script element.
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${json}</script>`;
};

const buildPage = (page, lang) => {
  const where = SRC_DIR + page.src;
  const other = LANGS.find((l) => l !== lang);
  const dict = translations[lang];
  let html = fs.readFileSync(path.join(ROOT, where), 'utf8');

  html = replaceOnce(html, /<html lang="en">/, () => `<html lang="${lang}" data-fixed-lang="${lang}">`, 'html lang');
  html = replaceOnce(html, /\s*<meta name="robots" content="noindex" \/>/, () => '', 'robots noindex');
  // The language switch becomes a link to this page in the other language.
  html = replaceOnce(
    html,
    /<button class="lang" type="button" data-lang-toggle ([^>]*)>([\s\S]*?)<\/button>/,
    (m, attrs, inner) => `<a class="lang" href="${page.paths[other]}" hreflang="${other}" ${attrs}>${inner}</a>`,
    'language switch',
  );
  html = translate(html, lang, where);
  html = rewriteUrls(html, page, lang);

  const title = unesc((html.match(/<title[^>]*>([^<]*)<\/title>/) || fail(`${where}: no <title>`))[1]);
  const description = dict[page.descKey] || fail(`missing ${page.descKey}`);
  html = replaceOnce(
    html,
    /<meta name="description" content="[^"]*" \/>/,
    () => `<meta name="description" content="${escAttr(description)}" />`,
    'meta description',
  );

  const canonical = SITE + page.paths[lang];
  const head = [
    `<link rel="canonical" href="${canonical}" />`,
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE + page.paths[l]}" />`),
    `<link rel="alternate" hreflang="x-default" href="${SITE + page.paths[X_DEFAULT]}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="AnomInsight" />',
    `<meta property="og:locale" content="${OG_LOCALE[lang]}" />`,
    `<meta property="og:locale:alternate" content="${OG_LOCALE[other]}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:title" content="${escAttr(title)}" />`,
    `<meta property="og:description" content="${escAttr(description)}" />`,
    `<meta property="og:image" content="${SITE + LOGO}" />`,
    '<meta property="og:image:width" content="512" />',
    '<meta property="og:image:height" content="512" />',
    '<meta property="og:image:alt" content="AnomInsight" />',
    '<meta name="twitter:card" content="summary" />',
    ...verificationMeta(),
    jsonLd(page, lang, title, description),
  ];
  html = replaceOnce(html, /(<\/title>)/, (m) => `${m}\n    ${head.join('\n    ')}`, 'title end');

  if (page.id === 'home') {
    html = replaceOnce(
      html,
      /(<div[^>]*\sid="portfolioTrack"[^>]*>)(<\/div>)/,
      (m, open, close) => `${open}${staticPortfolio(lang)}${close}`,
      'portfolio track',
    );
  }
  return html;
};

const notFoundPage = () => {
  const t = (lang, key) => esc(translations[lang][key]);
  return `<!DOCTYPE html>
<html lang="hu">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <meta name="theme-color" content="#0B0A09" />
    <title>${t('hu', 'notFound.title')} – AnomInsight</title>
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-circle-32.png?v=4" />
    <link rel="stylesheet" href="${SRC_DIR}style.css" />
    <style>
      .not-found > * + * { margin-top: var(--space-4); }
      .not-found > [lang] { margin-top: var(--space-8); }
      .not-found [lang] > * + * { margin-top: var(--space-4); }
    </style>
  </head>
  <body>
    <main class="section" id="top">
      <div class="shell not-found">
        <h1>${t('hu', 'notFound.title')}</h1>
        <p>${t('hu', 'notFound.text')}</p>
        <p><a class="btn btn--primary" href="/">${t('hu', 'notFound.home')}</a></p>
        <div lang="en">
          <h2>${t('en', 'notFound.title')}</h2>
          <p>${t('en', 'notFound.text')}</p>
          <p><a class="btn btn--ghost" href="/en/" hreflang="en">${t('en', 'notFound.home')}</a></p>
        </div>
      </div>
    </main>
  </body>
</html>
`;
};

// The pre-launch Version D URLs (and their ?lang= links) forward to the new pages.
// An instant meta refresh counts as a permanent redirect for search engines.
const redirectStub = (page) => `<!DOCTYPE html>
<html lang="hu">
  <head>
    <meta charset="UTF-8" />
    <title>AnomInsight</title>
    <link rel="canonical" href="${SITE + page.paths.hu}" />
    <script>
      (function () {
        var m = /[?&]lang=(en|hu)(?:&|$)/.exec(location.search);
        var lang = m ? m[1] : (/^hu/i.test(navigator.language || '') ? 'hu' : 'en');
        location.replace((lang === 'en' ? '${page.paths.en}' : '${page.paths.hu}') + location.hash);
      })();
    </script>
    <meta http-equiv="refresh" content="0; url=${page.paths.hu}" />
  </head>
  <body>
    <p><a href="${page.paths.hu}">AnomInsight</a> · <a href="${page.paths.en}" hreflang="en" lang="en">English</a></p>
  </body>
</html>
`;

const lastModified = (files) => {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...files], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) return out;
  } catch {
    // No git (or no history) - fall back to today.
  }
  return new Date().toISOString().slice(0, 10);
};

const sitemap = () => {
  const shared = ['src/frontend/shared/content.js', 'src/frontend/versions/d/style.css'];
  const urls = PAGES.flatMap((page) => {
    const sources = [SRC_DIR.slice(1) + page.src, ...shared];
    if (page.id === 'home') sources.push('src/frontend/shared/portfolio-data.js');
    const lastmod = lastModified(sources);
    const alternates = [...LANGS, 'x-default']
      .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE + page.paths[l === 'x-default' ? X_DEFAULT : l]}" />`)
      .join('\n');
    return LANGS.map((lang) => `  <url>\n    <loc>${SITE + page.paths[lang]}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alternates}\n  </url>`);
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
};

const robots = () => `# AnomInsight - ${SITE}
User-agent: *
Allow: /

# OpenAI's search crawler (ChatGPT search). GPTBot (model training) follows the
# rule for all crawlers above; that preference is unchanged on purpose.
User-agent: OAI-SearchBot
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

// --- Asset collection: only what the generated pages reference --------------

const collectAssets = (pages) => {
  const found = new Set();
  const queue = [];
  const add = (p) => {
    const clean = decodeURIComponent(p.split(/[?#]/)[0]);
    if (!clean.startsWith('/') || clean.endsWith('/') || found.has(clean)) return;
    found.add(clean);
    queue.push(clean);
  };
  for (const html of pages) {
    for (const [, val] of html.matchAll(/\s(?:href|src)="(\/[^"/][^"]*)"/g)) add(val);
    for (const [, val] of html.matchAll(/\ssrcset="([^"]+)"/g)) val.split(',').forEach((part) => add(part.trim().split(/\s+/)[0]));
    for (const [, val] of html.matchAll(/\scontent="https:\/\/anominsight\.com(\/[^"]+\.[a-z0-9]+)"/g)) add(val);
  }
  // Follow ES module imports and CSS url() references.
  while (queue.length) {
    const file = queue.shift();
    const abs = path.join(ROOT, file);
    if (!fs.existsSync(abs)) fail(`referenced file missing: ${file}`);
    if (/\.(m?js)$/.test(file)) {
      const src = fs.readFileSync(abs, 'utf8');
      for (const [, a, b] of src.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)'([^']+)'|(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)"([^"]+)"/g)) {
        add(new URL(a || b, `${SITE}${file}`).pathname);
      }
      // Page-relative asset paths in rendered markup (e.g. "../../../../images/icons/x.png"):
      // every page sits less than four levels deep, so they resolve from the site root.
      for (const [, rel] of src.matchAll(/(?:\.\.\/)+((?:images|fonts)\/[\w./-]+)/g)) add(`/${rel}`);
    } else if (file.endsWith('.css')) {
      const src = fs.readFileSync(abs, 'utf8');
      for (const [, val] of src.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
        if (!/^(data:|https?:|#)/.test(val)) add(new URL(val, `${SITE}${file}`).pathname);
      }
    }
  }
  // Font licences travel with the fonts; /favicon.ico is requested by some clients regardless.
  if ([...found].some((f) => f.startsWith('/fonts/'))) {
    fs.readdirSync(path.join(ROOT, 'fonts'))
      .filter((f) => /^OFL.*\.txt$/.test(f))
      .forEach((f) => found.add(`/fonts/${f}`));
  }
  found.add('/favicon.ico');
  return [...found].sort();
};

// --- Build ---------------------------------------------------------------------

const write = (rel, content) => {
  const abs = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content);
};

const main = () => {
  if (path.basename(OUT) !== 'dist' || path.dirname(OUT) !== ROOT) fail(`refusing to clean ${OUT}`);
  fs.rmSync(OUT, { recursive: true, force: true });

  const outputs = [];
  for (const page of PAGES) {
    for (const lang of LANGS) {
      const html = buildPage(page, lang);
      write(path.join(page.paths[lang], 'index.html'), html);
      outputs.push(html);
    }
    write(SRC_DIR + page.src, redirectStub(page));
  }
  const notFound = notFoundPage();
  write('404.html', notFound);
  outputs.push(notFound);
  write('robots.txt', robots());
  write('sitemap.xml', sitemap());

  const assets = collectAssets(outputs);
  for (const file of assets) {
    const target = path.join(OUT, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(ROOT, file), target);
  }
  console.log(`build-site: ${PAGES.length * LANGS.length} pages, ${assets.length} assets -> dist/`);
};

main();
