/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, Page, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

import { websiteScreenshotOptions } from './screenshot-options';
import { ScreenshotOptions } from '../helpers/screenshot-options.interface';
import { browser, density, matrixKey, screenshotExpectOptions, theme } from '../helpers/vrt';

const baseUrl = 'http://localhost:8081';
const defaultViewport = { width: 1280, height: 720 };

// The website reads these keys on startup (see the theme-toggle and density-toggle components).
// An empty string is the default density.
const densityLocalStorageValue = density === 'compact' ? 'compact' : '';

// Regions that can never render deterministically, masked on every page: animated GIFs and
// native indeterminate <progress> bars keep animating regardless of animations: 'disabled',
// and app-animated-example wraps demos (spinners, progress bars) that animate via JavaScript.
const defaultMaskSelectors = ['img[src*=".gif"]', 'progress:not([value])', 'app-animated-example'];

// The website scrolls inside Clarity's content area rather than the document, so without these
// overrides nothing beyond the first viewport height is capturable. They let the app shell grow
// vertically with its content while keeping horizontal overflow clipped (as users see it). The
// direct-child scoping matters: some demos (app-layout, navigation, ...) embed their own
// .main-container/.content-area shells that must keep their production rendering.
//
// The table of contents is hidden entirely: TableOfContentsComponent races the lazy-loaded
// content and renders its CONTENT box on only some page loads (issue #2678), which would make
// any documentation page's screenshot nondeterministic. Remove the rule once #2678 is fixed to
// restore visual coverage of the table of contents.
function growPageWithContentStyles(minHeightPx: number) {
  return `
    html, body { height: auto !important; overflow-x: clip !important; }
    app-root > .main-container { height: auto !important; min-height: ${minHeightPx}px; overflow-x: clip !important; }
    app-root > .main-container > .content-container { height: auto !important; }
    app-root > .main-container > .content-container > .content-area { overflow-y: visible !important; overflow-x: clip !important; min-width: 0 !important; }
    app-table-of-contents { display: none !important; }
  `;
}

// The page inventory: every page in componentlist.json plus the routes outside the component
// list (home, the theme builder tool, and the markdown content pages).
const contentPagesDirPath = path.join('.', 'projects', 'website', 'content', 'pages');
const componentListFilePath = path.join('.', 'projects', 'website', 'src', 'settings', 'componentlist.json');
const componentList: { list: { url: string }[] } = JSON.parse(fs.readFileSync(componentListFilePath).toString());

const staticPages = [
  { name: 'home', route: '/' },
  { name: 'theme-builder', route: '/theme-builder' },
  ...fs
    .readdirSync(contentPagesDirPath)
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''))
    .map(slug => ({ name: slug, route: `/pages/${slug}` })),
];

const staticPageNames = new Set(staticPages.map(staticPage => staticPage.name));

const pages = [
  ...staticPages,
  ...componentList.list.map(component => ({
    // A documentation page whose slug collides with a static page's name (the theme-builder
    // tool, the accessibility content page) gets a -docs suffix so page names stay unique.
    name: staticPageNames.has(component.url) ? `${component.url}-docs` : component.url,
    route: `/documentation/${component.url}`,
  })),
];

// The screenshots taken per test are discovered at runtime (the documentation tabs), so each
// worker process appends the paths it captured to its own used-screenshot-paths file as it goes.
const workerId = process.env['TEST_PARALLEL_INDEX'] ?? 'main';
const usedScreenshotsFilePath = path.join(
  '.',
  'tests',
  'snapshots',
  `used-screenshot-paths-website-${matrixKey}-worker${workerId}.txt`
);
fs.writeFileSync(usedScreenshotsFilePath, '');

test.beforeEach(async ({ page, context }) => {
  // The website makes a few requests to external services (Google Tag Manager, the version
  // switcher's versions.json). Block everything that isn't served locally so the screenshots
  // are deterministic and unaffected by network conditions.
  await context.route(
    url => url.hostname !== 'localhost' && url.hostname !== '127.0.0.1',
    route => route.abort()
  );

  // Theme and density are read from localStorage on startup; seed them before any page script
  // runs. Without a stored theme the website falls back to prefers-color-scheme.
  await page.addInitScript(
    ([themeValue, densityValue]) => {
      localStorage.setItem('theme', themeValue);
      localStorage.setItem('density', densityValue);
    },
    [theme, densityLocalStorageValue]
  );
});

for (const sitePage of pages) {
  if (websiteScreenshotOptions[sitePage.name]?.exclude) {
    continue;
  }

  test(path.join(browser, 'website', sitePage.name), async ({ page }) => {
    await capturePage(page, sitePage.name, 'overview', sitePage.route);

    // Documentation pages have additional tabs (code, api, accessibility, ...) next to the
    // default overview tab captured above. The available tabs vary per page, so discover them
    // from the rendered tab bar and capture each under its own name.
    const tabRoutes: string[] = await page
      .locator('app-doc-tabs clr-tabs a[href]')
      .evaluateAll(anchors => anchors.map(anchor => anchor.getAttribute('href')));

    for (const tabRoute of tabRoutes) {
      if (!tabRoute || tabRoute === sitePage.route) {
        continue; // the overview tab links to the base route and is already captured
      }

      const tab = tabRoute.split('/').pop();
      await captureView(page, sitePage.name, tab, tabRoute);

      // Some tabs split their examples into section subpages linked from the tab's landing
      // page (for example /documentation/datagrid/code/pagination). Capture each link that
      // sits exactly one level below the tab; deeper links are an embedded demo's own
      // navigation states (for example vertical-nav's example pages), not documentation.
      for (const sectionRoute of await discoverSectionRoutes(page, tabRoute)) {
        await captureView(page, sitePage.name, `${tab}-${sectionRoute.split('/').pop()}`, sectionRoute);
      }
    }
  });
}

async function discoverSectionRoutes(page: Page, tabRoute: string) {
  const hrefs: (string | null)[] = await page
    .locator('a[href]')
    .evaluateAll(anchors => anchors.map(anchor => anchor.getAttribute('href')));

  return [...new Set(hrefs)].filter(
    href => href?.startsWith(`${tabRoute}/`) && !href.slice(tabRoute.length + 1).match(/[/#?]/)
  );
}

async function captureView(page: Page, pageName: string, view: string, route: string) {
  if (!websiteScreenshotOptions[`${pageName}-${view}`]?.exclude) {
    await capturePage(page, pageName, view, route);
  }
}

async function capturePage(page: Page, pageName: string, view: string, route: string) {
  // Screenshots are grouped in one directory per page, mirroring the Storybook suite's
  // one directory per component.
  const options: ScreenshotOptions[string] =
    websiteScreenshotOptions[view === 'overview' ? pageName : `${pageName}-${view}`] ?? {};
  const screenshotPath = path.join(browser, 'website', pageName, `${view}-${theme}-${density}.png`);
  fs.appendFileSync(usedScreenshotsFilePath, screenshotPath + '\n');

  const viewport = options.viewport ?? defaultViewport;
  await page.setViewportSize(viewport);
  await page.goto(`${baseUrl}${route}`);
  // The documentation demos are lazy-loaded modules; wait until all chunks have loaded so the
  // page has its final content (and therefore its final height) before capturing.
  await page.waitForLoadState('networkidle');
  await page.addStyleTag({ content: growPageWithContentStyles(viewport.height) });
  await page.evaluate(() => document.fonts.ready);

  if (options.fullPageScreenshot ?? true) {
    await fitViewportToContent(page, viewport.width);
  }

  await expect(page).toHaveScreenshot(screenshotPath.split(path.sep), {
    ...screenshotExpectOptions,
    mask: [...defaultMaskSelectors, ...(options.maskSelectors ?? [])].map(selector => page.locator(selector)),
  });
}

/**
 * Resizes the viewport to the full content height so a regular viewport screenshot captures the
 * whole page. Playwright's fullPage screenshots expand the render surface mid-capture, which
 * reflows demos that render based on available space (virtual-scroll datagrids) and produces
 * flaky captures; resizing up front lets such content settle first. The loop exits once a
 * measurement taken 250ms after the last resize still matches the viewport height.
 */
async function fitViewportToContent(page: Page, viewportWidth: number) {
  const measureContentHeight = () =>
    page.evaluate(() => Math.min(Math.max(document.body.scrollHeight, document.documentElement.scrollHeight), 20000));

  let viewportHeight = await measureContentHeight();

  for (let attempt = 0; attempt < 8; attempt++) {
    await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
    await page.waitForTimeout(250);

    const contentHeight = await measureContentHeight();

    if (contentHeight === viewportHeight) {
      return;
    }

    viewportHeight = contentHeight;
  }
}
