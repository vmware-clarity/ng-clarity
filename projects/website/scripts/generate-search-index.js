/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Builds search-index.json from source only (compiled markdown content + demo templates) — no
// browser, no build output required — so it can run as part of `prebuild:website` and stay
// available and fresh during local `ng serve`, not just in a CI-built/deployed site. This is a
// deliberately lighter index than a full-render crawl would produce: headings that live in a
// nested sub-template projected into a tab (rather than authored directly in the tab's own
// <app-doc-tab> block) aren't scanned.

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '../../..');
const WEBSITE_ROOT = path.join(REPO_ROOT, 'projects/website');
const OUTPUT_PATH = path.join(WEBSITE_ROOT, 'src/compiled-content/search-index.json');

const HTML_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

main();

function main() {
  const categoryMap = buildCategoryMap();

  const index = [
    { kind: 'page', url: '/', title: 'Home', category: 'Home' },
    { kind: 'page', url: '/theme-builder', title: 'Theme Builder', category: 'Theme Builder' },
    ...buildContentPageEntries(categoryMap),
    ...buildDocumentationEntries(categoryMap),
  ];

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(index, undefined, 2));
  console.log(`Wrote ${index.length} search-index entries to ${OUTPUT_PATH}`);
}

// Lookup of pathname -> {category, title} from the site's own compiled nav data, so entries are
// grouped/labeled the same way the site's own left nav groups them.
function buildCategoryMap() {
  const nav = require(path.join(WEBSITE_ROOT, 'src/compiled-content/nav.json'));
  const map = new Map();

  for (const group of nav['site-nav']) {
    for (const link of group.links ?? []) {
      map.set(link.url, { category: group.label, title: link.label });
    }

    if (group.url && group.url.startsWith('/')) {
      map.set(group.url, { category: group.label, title: group.label });
    }
  }

  return map;
}

function buildContentPageEntries(categoryMap) {
  const pages = require(path.join(WEBSITE_ROOT, 'src/compiled-content/pages.json'));
  const entries = [];

  for (const [slug, page] of Object.entries(pages)) {
    const url = `/pages/${slug}`;
    const navMeta = categoryMap.get(url);
    const category = navMeta?.category ?? 'Pages';
    const title = navMeta?.title ?? page.title;

    entries.push({ kind: 'page', url, title, category });
    entries.push(...buildHeadingEntries(page.html, url, title, category));
  }

  return entries;
}

function buildDocumentationEntries(categoryMap) {
  const components = require(path.join(WEBSITE_ROOT, 'src/settings/componentlist.json'));
  const routeFolders = buildRouteFolderMap();
  const entries = [];

  for (const component of components.list) {
    const url = `/documentation/${component.url}`;
    const navMeta = categoryMap.get(url);
    const category =
      navMeta?.category ??
      (component.type === 'component' ? 'Components' : component.type === 'addons' ? 'Addons' : 'Patterns');
    const title = navMeta?.title ?? component.text;

    entries.push({ kind: 'page', url, title, category });

    const folder = routeFolders.get(component.url);

    if (!folder) {
      continue;
    }

    for (const { tab, html } of readDemoTabs(folder)) {
      const tabUrl = tab === 'overview' ? url : `${url}/${tab}`;
      entries.push(...buildHeadingEntries(html, tabUrl, title, category));
    }

    for (const { routePath, demoName } of readCodeSubPages(folder)) {
      entries.push({ kind: 'heading', url: `${url}/code/${routePath}`, title, category, heading: demoName });
    }
  }

  return entries;
}

// Some components (e.g. Datagrid, Vertical Nav) split their Code tab into separate child-route
// pages, labeled via `data: { demoName }` in the demo module's routes. Returns each such page's
// route path and label.
function readCodeSubPages(folder) {
  const folderPath = path.join(WEBSITE_ROOT, 'src/app/documentation/demos', folder);
  const pages = [];

  let files;

  try {
    files = fs.readdirSync(folderPath).filter(file => file.endsWith('.module.ts'));
  } catch {
    return pages;
  }

  const demoNameRegex = /demoName:\s*'([^']+)'/g;

  for (const file of files) {
    const text = fs.readFileSync(path.join(folderPath, file), 'utf8');
    let match;

    while ((match = demoNameRegex.exec(text))) {
      const routePath = findEnclosingRoutePath(text, match.index);

      if (routePath) {
        pages.push({ routePath, demoName: match[1] });
      }
    }
  }

  return pages;
}

// Walks back from a `demoName` to the start of the route object containing it, then reads that
// object's own `path:` — skipping nested `children` objects, whose paths belong to sub-routes.
function findEnclosingRoutePath(text, index) {
  let depth = 0;
  let start = -1;

  // The first `{` back from demoName opens `data: {`; the one after that opens the route object.
  for (let i = index; i >= 0; i--) {
    if (text[i] === '}') {
      depth++;
    } else if (text[i] === '{') {
      if (depth === 0) {
        if (start === -2) {
          start = i;
          break;
        }
        start = -2;
      } else {
        depth--;
      }
    }
  }

  if (start < 0) {
    return null;
  }

  let ownProperties = '';
  depth = 0;

  for (let i = start + 1; i < text.length && depth >= 0; i++) {
    const char = text[i];

    if (char === '{' || char === '[') {
      depth++;
    } else if (char === '}' || char === ']') {
      depth--;
    } else if (depth === 0) {
      ownProperties += char;
    }
  }

  return /\bpath:\s*'([^']+)'/.exec(ownProperties)?.[1] ?? null;
}

// Maps a component's route (e.g. "checkbox") to its demos folder (e.g. "checkboxes") by reading
// it straight out of documentation-routes.ts, the single source of truth for that mapping — this
// is a plain CommonJS script and can't import that TypeScript file directly.
function buildRouteFolderMap() {
  const routesText = fs.readFileSync(path.join(WEBSITE_ROOT, 'src/app/documentation/documentation-routes.ts'), 'utf8');
  const routeRegex = /routePath:\s*'([^']+)\/:tab\?'\s*},\s*loadChildren:\s*\(\)\s*=>\s*import\('\.\/demos\/([^/']+)/g;
  const map = new Map();
  let match;

  while ((match = routeRegex.exec(routesText))) {
    map.set(match[1], match[2]);
  }

  return map;
}

// Reads every top-level *.demo.html file in a component's demos folder that's organized into
// <app-doc-tab tab="..."> sections, and returns each tab's raw inner HTML.
function readDemoTabs(folder) {
  const folderPath = path.join(WEBSITE_ROOT, 'src/app/documentation/demos', folder);
  const tabs = [];

  let files;

  try {
    files = fs.readdirSync(folderPath).filter(file => file.endsWith('.html'));
  } catch {
    return tabs;
  }

  const tabRegex = /<app-doc-tab\s+tab="([a-z]+)"[^>]*>([\s\S]*?)<\/app-doc-tab>/g;

  for (const file of files) {
    const html = fs.readFileSync(path.join(folderPath, file), 'utf8');
    let match;

    while ((match = tabRegex.exec(html))) {
      tabs.push({ tab: match[1], html: match[2] });
    }
  }

  return tabs;
}

// Same selector as TableOfContentsComponent (table-of-contents.component.ts): h2[id] opens a
// section, h3[id][data-toc-item] nests under the most recent section.
function buildHeadingEntries(html, url, title, category) {
  const headingRegex = /<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/g;
  const entries = [];
  let currentSection;
  let match;

  while ((match = headingRegex.exec(html))) {
    const level = match[1];
    const attrs = match[2];
    const idMatch = /\bid\s*=\s*["']([^"']*)["']/.exec(attrs);

    if (!idMatch) {
      continue;
    }
    if (level === '3' && !/\bdata-toc-item\b/.test(attrs)) {
      continue;
    }

    const label = decodeHtmlEntities(match[3].replace(/<[^>]+>/g, ''))
      .replace(/\s+/g, ' ')
      .trim();

    // Skip empty/unresolved (e.g. still-interpolated) labels and headings that just restate the
    // page title (e.g. a tab repeating the component name).
    if (!label || label.toLowerCase() === title.trim().toLowerCase()) {
      continue;
    }

    if (level === '2') {
      currentSection = label;
      entries.push({ kind: 'heading', url, fragment: idMatch[1], title, category, heading: label });
    } else {
      entries.push({
        kind: 'heading',
        url,
        fragment: idMatch[1],
        title,
        category,
        section: currentSection,
        heading: label,
      });
    }
  }

  return entries;
}

function decodeHtmlEntities(text) {
  return text.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (entity, code) => {
    if (code[0] === '#') {
      const codePoint = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return String.fromCodePoint(codePoint);
    }

    return HTML_ENTITIES[code.toLowerCase()] ?? entity;
  });
}
