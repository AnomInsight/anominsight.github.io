// Checks the dist/ artifact written by tools/build-site.mjs before it is published:
// only allowlisted public files, correct indexing signals (canonical, hreflang,
// robots meta, sitemap, robots.txt), structured data that parses and stays
// descriptive, every same-site reference resolving, and no retired CNC claims.
// No dependencies. Exits 1 on any failure. Usage: node tools/check-site.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://anominsight.com';
const INDEXABLE = {
  '/': 'hu',
  '/en/': 'en',
  '/szolgaltatasok/': 'hu',
  '/en/services/': 'en',
};
const STUBS = ['/src/frontend/versions/d/index.html', '/src/frontend/versions/d/services.html'];

// Everything the artifact may contain. Anything else fails the check.
const ALLOW = [
  /^index\.html$/,
  /^404\.html$/,
  /^robots\.txt$/,
  /^sitemap\.xml$/,
  /^favicon\.ico$/,
  /^en\/index\.html$/,
  /^en\/services\/index\.html$/,
  /^szolgaltatasok\/index\.html$/,
  /^images\/(icons\/)?[\w.-]+\.(png|webp|jpg|svg|ico)$/,
  /^fonts\/[\w.-]+\.(woff2|txt)$/,
  /^src\/frontend\/versions\/d\/[\w.-]+\.(js|css|html)$/,
  /^src\/frontend\/shared\/[\w.-]+\.js$/,
];
// Belt and braces: internal material that must never ship, even if allowlisted by mistake.
const DENY = [/\.md$/i, /(^|\/)\./, /(^|\/)(docs|tools|\.github|\.claude)\//, /skills-lock/, /versions\/(a|b|c|original)\//, /CNAME$/];
const RETIRED_CLAIMS = [/real (CNC )?failures/i, /real sensor/i, /24\/7/, /valós meghibásod/i, /valós szenzor/i, /folyamatosan üzemelő/i, /~2:1/];
const FORBIDDEN_SCHEMA_KEYS = ['offers', 'price', 'priceRange', 'aggregateRating', 'review', 'address', 'telephone', 'legalName', 'vatID', 'taxID'];

const failures = [];
const check = (ok, msg) => {
  if (!ok) failures.push(msg);
};

if (!fs.existsSync(DIST)) {
  console.error('check-site: dist/ not found - run node tools/build-site.mjs first');
  process.exit(1);
}

const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs);
    else files.push(path.relative(DIST, abs).split(path.sep).join('/'));
  }
};
walk(DIST);
const read = (rel) => fs.readFileSync(path.join(DIST, rel), 'utf8');
const exists = (urlPath) => {
  const rel = decodeURIComponent(urlPath.split(/[?#]/)[0]).replace(/^\//, '');
  return files.includes(rel) || files.includes(`${rel}${rel === '' || rel.endsWith('/') ? '' : '/'}index.html`);
};

// 1. Allowlist
for (const f of files) {
  check(ALLOW.some((re) => re.test(f)), `not allowlisted: ${f}`);
  check(!DENY.some((re) => re.test(f)), `internal file in artifact: ${f}`);
}

// 2. Pages
const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
const tags = (html, re) => [...html.matchAll(re)].map((m) => m[0]);
const pageInfo = {};
const titles = new Set();
const descriptions = new Set();

for (const [urlPath, lang] of Object.entries(INDEXABLE)) {
  const rel = `${urlPath.slice(1)}index.html`;
  const where = urlPath;
  if (!files.includes(rel)) {
    failures.push(`missing page ${urlPath}`);
    continue;
  }
  const html = read(rel);
  const url = SITE + urlPath;
  check(new RegExp(`<html lang="${lang}" data-fixed-lang="${lang}">`).test(html), `${where}: html lang/data-fixed-lang is not ${lang}`);
  check(!/noindex/i.test(html), `${where}: has noindex`);

  const canonicals = tags(html, /<link rel="canonical"[^>]*>/g);
  check(canonicals.length === 1 && attr(canonicals[0], 'href') === url, `${where}: canonical is not ${url}`);

  const alternates = Object.fromEntries(tags(html, /<link rel="alternate" hreflang[^>]*>/g).map((t) => [attr(t, 'hreflang'), attr(t, 'href')]));
  check(alternates[lang] === url, `${where}: hreflang ${lang} does not point to itself`);
  check(['hu', 'en', 'x-default'].every((l) => alternates[l]), `${where}: hreflang set incomplete`);
  check(alternates['x-default'] === alternates.hu, `${where}: x-default is not the Hungarian page`);
  pageInfo[url] = { alternates, lang };

  const title = (html.match(/<title[^>]*>([^<]+)<\/title>/) || [])[1] || '';
  const description = attr(tags(html, /<meta name="description"[^>]*>/g)[0] || '', 'content') || '';
  check(title && !titles.has(title), `${where}: title empty or duplicated`);
  check(description.length >= 50 && description.length <= 170 && !descriptions.has(description), `${where}: description missing, duplicated or ${description.length} chars`);
  titles.add(title);
  descriptions.add(description);
  check(html.includes(`<meta property="og:url" content="${url}" />`), `${where}: og:url is not the canonical`);
  check(html.includes(`<meta property="og:locale" content="${lang === 'hu' ? 'hu_HU' : 'en_US'}" />`), `${where}: og:locale`);

  check(!/data-lang-toggle/.test(html), `${where}: language switch still a script toggle`);
  const otherLang = lang === 'hu' ? 'en' : 'hu';
  const langSwitch = tags(html, /<a class="lang"[^>]*>/g)[0] || '';
  check(SITE + attr(langSwitch, 'href') === alternates[otherLang], `${where}: language switch does not link to the ${otherLang} page`);

  // Structured data parses, describes this page, and makes no offer/review/address claims.
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  check(blocks.length === 1, `${where}: expected one JSON-LD block`);
  for (const [, json] of blocks) {
    let data;
    try {
      data = JSON.parse(json);
    } catch (e) {
      failures.push(`${where}: JSON-LD does not parse (${e.message})`);
      continue;
    }
    const webPage = data['@graph'].find((n) => n['@type'] === 'WebPage');
    check(webPage && webPage.url === url && webPage.inLanguage === lang, `${where}: JSON-LD WebPage url/inLanguage`);
    const keys = JSON.stringify(data).match(/"([A-Za-z]+)":/g).map((k) => k.slice(1, -2));
    for (const k of FORBIDDEN_SCHEMA_KEYS) check(!keys.includes(k), `${where}: JSON-LD has "${k}"`);
  }

  // No links back to the pre-launch structure.
  check(!/href="[^"]*(services\.html|index\.html|[?&]lang=)/.test(html), `${where}: links to old page names or ?lang=`);
}

// hreflang is reciprocal: every page in a set lists the same set.
for (const [url, { alternates }] of Object.entries(pageInfo)) {
  for (const [l, target] of Object.entries(alternates)) {
    const peer = pageInfo[target];
    check(peer, `${url}: hreflang ${l} -> ${target} is not a generated page`);
    if (peer) check(JSON.stringify(peer.alternates) === JSON.stringify(alternates), `${url}: hreflang set differs on ${target}`);
  }
}

// 3. Non-indexable pages
check(/<meta name="robots" content="noindex" \/>/.test(read('404.html')), '404.html: missing noindex');
for (const stub of STUBS) {
  const html = files.includes(stub.slice(1)) ? read(stub.slice(1)) : '';
  check(/http-equiv="refresh"/.test(html) && /<link rel="canonical" href="https:\/\/anominsight\.com\/[^"]*"/.test(html), `${stub}: not a redirect stub`);
}

// 4. sitemap.xml lists exactly the indexable pages, with the same alternates.
const sitemap = read('sitemap.xml');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
check(JSON.stringify(locs) === JSON.stringify(Object.keys(INDEXABLE).map((p) => SITE + p).sort()), `sitemap.xml: <loc> set is ${locs.join(', ')}`);
for (const block of sitemap.split('<url>').slice(1)) {
  const loc = (block.match(/<loc>([^<]+)<\/loc>/) || [])[1];
  const alts = Object.fromEntries([...block.matchAll(/hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]));
  check(pageInfo[loc] && JSON.stringify(alts) === JSON.stringify(pageInfo[loc].alternates), `sitemap.xml: alternates for ${loc} differ from the page`);
}

// 5. robots.txt: everything allowed, OAI-SearchBot explicitly allowed, sitemap listed,
// and GPTBot not singled out (its training preference is a separate decision).
const robots = read('robots.txt');
check(/User-agent: \*\s*\nAllow: \//.test(robots), 'robots.txt: default group does not allow /');
check(/User-agent: OAI-SearchBot\s*\nAllow: \//.test(robots), 'robots.txt: OAI-SearchBot not allowed');
check(!/^Disallow:/m.test(robots), 'robots.txt: has a Disallow rule');
check(!/^User-agent: GPTBot/im.test(robots), 'robots.txt: GPTBot rule added');
check(robots.includes(`Sitemap: ${SITE}/sitemap.xml`), 'robots.txt: sitemap line');

// 6. Every same-site reference resolves (HTML href/src/srcset, CSS url(), JS imports).
for (const f of files) {
  const text = /\.(html|css|js)$/.test(f) ? read(f) : '';
  const refs = [];
  if (f.endsWith('.html')) {
    for (const m of text.matchAll(/\s(?:href|src)="(\/[^"/][^"]*|\/)"/g)) refs.push(m[1]);
    for (const m of text.matchAll(/\ssrcset="([^"]+)"/g)) m[1].split(',').forEach((p) => refs.push(p.trim().split(/\s+/)[0]));
  } else if (f.endsWith('.css')) {
    for (const m of text.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) if (!/^(data:|https?:|#)/.test(m[1])) refs.push(new URL(m[1], `${SITE}/${f}`).pathname);
  } else if (f.endsWith('.js')) {
    for (const m of text.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*)'([^']+)'/g)) refs.push(new URL(m[1], `${SITE}/${f}`).pathname);
    for (const m of text.matchAll(/(?:\.\.\/)+((?:images|fonts)\/[\w./-]+)/g)) refs.push(`/${m[1]}`);
  }
  for (const ref of refs) check(exists(ref), `${f}: reference does not resolve: ${ref}`);
}

// 7. Retired CNC claims stay out of everything published. Known exception:
// content.js is shared with Versions B and C, whose own key (not rendered here) keeps the old label.
const LEGACY_KEYS = ["'proof.recall.label':"];
for (const f of files.filter((x) => /\.(html|js)$/.test(x))) {
  const lines = read(f).split('\n');
  lines.forEach((line, i) => {
    if (f.endsWith('shared/content.js') && LEGACY_KEYS.some((k) => line.trim().startsWith(k))) return;
    for (const re of RETIRED_CLAIMS) check(!re.test(line), `${f}:${i + 1}: retired claim ${re}`);
  });
}
// The digit study is an MNIST benchmark, not a postal deployment. HTML only: portfolio-data.js
// still carries the shared text Versions A, B and C render.
const RETIRED_DIGIT_FRAMING = [/ZIP code/i, /mail sorting/i, /sorting mail/i, /goes live/i, /levélválogat/i, /küldemény/i, /élesben/i];
for (const f of files.filter((x) => x.endsWith('.html'))) {
  for (const re of RETIRED_DIGIT_FRAMING) check(!re.test(read(f)), `${f}: retired digit-study framing ${re}`);
}

if (failures.length) {
  console.error(`check-site: ${failures.length} problem(s)\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`check-site: OK - ${files.length} files, ${Object.keys(INDEXABLE).length} indexable pages, sitemap/robots/hreflang consistent`);
