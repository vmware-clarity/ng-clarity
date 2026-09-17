/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, Page, Request, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

import { websiteScreenshotOptions } from './screenshot-options';
import { ScreenshotOptions } from '../helpers/screenshot-options.interface';
import { browser, density, matrixKey, screenshotExpectOptions, screenshotPathFor, theme } from '../helpers/vrt';

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
//
// The version select is hidden entirely: its button label is the environment's version
// ("Version 18" on main, "Version next" on next), so the branding row would render at a
// different width on each branch and every snapshot would differ between them, which makes
// backporting the baselines impossible. Hiding it (rather than masking it) keeps the layout
// itself identical across branches.
//
// The login demos' min-height is pinned to the original viewport height: the .login form is
// min-height: 100vh, so it would otherwise grow along with the viewport resizes below and
// re-center its content nondeterministically mid-capture.
//
// On the datagrid page the clr-mt-* margin utilities are re-asserted with !important: they
// compete at equal specificity with cds-text margin rules in the lazily injected demo styles,
// and with the datagrid page's many parallel demo chunks the injection order (and therefore
// the winning rule) varies between loads — a real website bug, visible to users as
// load-dependent margins. Remove the pins (they mirror the utilities in
// projects/website/src/styles/components.scss) once the specificity conflict is fixed in the
// website's styles.
function growPageWithContentStyles(minHeightPx: number) {
  return `
    html, body { height: auto !important; overflow-x: clip !important; }
    app-root > .main-container { height: auto !important; min-height: ${minHeightPx}px; overflow-x: clip !important; }
    app-root > .main-container > .content-container { height: auto !important; }
    app-root > .main-container > .content-container > .content-area { overflow-y: visible !important; overflow-x: clip !important; min-width: 0 !important; }
    app-table-of-contents { display: none !important; }
    app-version-select { display: none !important; }
    .clr-example .login-wrapper .login { min-height: ${minHeightPx}px !important; }
    clr-datagrid-demo .clr-mt-0px { margin-top: 0 !important; }
    clr-datagrid-demo .clr-mt-8px { margin-top: var(--cds-global-layout-space-xs) !important; }
    clr-datagrid-demo .clr-mt-16px { margin-top: var(--cds-global-layout-space-md) !important; }
    clr-datagrid-demo .clr-mt-24px { margin-top: var(--cds-global-space-9) !important; }
    clr-datagrid-demo .clr-mt-32px { margin-top: var(--cds-global-layout-space-xl) !important; }
    clr-datagrid-demo .clr-mt-48px { margin-top: var(--cds-global-space-12) !important; }
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
// The file is keyed by TEST_WORKER_INDEX, which is unique per worker process: when Playwright
// replaces a worker after a failed test, the replacement gets a fresh index and file, so the
// paths the previous worker already recorded for its passed (not re-run) tests survive.
const workerId = process.env['TEST_WORKER_INDEX'] ?? 'main';
const usedScreenshotsFilePath = path.join(
  '.',
  'tests',
  'snapshots',
  `used-screenshot-paths-website-${matrixKey}-worker${workerId}.txt`
);
fs.writeFileSync(usedScreenshotsFilePath, '');

// The requests currently in flight on the page under test, tracked for waitForQuietNetwork().
const inFlightRequests = new Set<Request>();

test.beforeEach(async ({ page, context }) => {
  inFlightRequests.clear();
  page.on('request', request => inFlightRequests.add(request));
  page.on('requestfinished', request => inFlightRequests.delete(request));
  page.on('requestfailed', request => inFlightRequests.delete(request));

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

      // An excluded tab is never navigated to, so its section subpages (discovered from the
      // tab's own landing page below) are skipped along with it.
      const tab = tabRoute.split('/').pop();
      if (!(await capturePage(page, sitePage.name, tab, tabRoute))) {
        continue;
      }

      // Some tabs split their examples into section subpages linked from the tab's landing
      // page (for example /documentation/datagrid/code/pagination). Capture each link that
      // sits exactly one level below the tab; deeper links are an embedded demo's own
      // navigation states (for example vertical-nav's example pages), not documentation.
      for (const sectionRoute of await discoverSectionRoutes(page, tabRoute)) {
        await capturePage(page, sitePage.name, `${tab}-${sectionRoute.split('/').pop()}`, sectionRoute);
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

/** Captures one view of a page; returns false without navigating when the view is excluded. */
async function capturePage(page: Page, pageName: string, view: string, route: string) {
  const options: ScreenshotOptions[string] =
    websiteScreenshotOptions[view === 'overview' ? pageName : `${pageName}-${view}`] ?? {};

  if (options.exclude) {
    return false;
  }

  // Screenshots are grouped in one directory per page, mirroring the Storybook suite's
  // one directory per component.
  const screenshotPath = screenshotPathFor(path.join('website', pageName), view);
  fs.appendFileSync(usedScreenshotsFilePath, screenshotPath + '\n');

  const viewport = options.viewport ?? defaultViewport;
  await page.setViewportSize(viewport);
  await page.goto(`${baseUrl}${route}`);
  // The documentation demos are lazy-loaded modules; wait until all chunks have loaded so the
  // page has its final content (and therefore its final height) before capturing.
  await waitForQuietNetwork();

  // A route that redirects to another page would be captured under the requested page's
  // name, silently duplicating the target page's screenshots; fail loudly so the route gets
  // an explicit exclude entry instead (see 'accessibility-docs' in the screenshot options).
  // Redirects within the route are fine — a tab with section subpages redirects to its first
  // section (for example vertical-nav's code tab), and that is what the tab displays.
  const landedPath = new URL(page.url()).pathname;
  if (landedPath !== route && !landedPath.startsWith(`${route}/`)) {
    throw new Error(`${route} redirected to ${landedPath}; exclude it or capture it under its own name`);
  }

  await page.addStyleTag({ content: growPageWithContentStyles(viewport.height) });
  await page.evaluate(() => document.fonts.ready);

  for (const selector of options.waitForSelectors ?? []) {
    await page.locator(selector).waitFor();
  }

  if (options.fullPageScreenshot ?? true) {
    await fitViewportToContent(page, viewport.width);
  }

  await expect(page).toHaveScreenshot(screenshotPath.split(path.sep), {
    ...screenshotExpectOptions,
    mask: [...defaultMaskSelectors, ...(options.maskSelectors ?? [])].map(selector => page.locator(selector)),
  });

  return true;
}

// How long the network must stay free of in-flight requests to count as quiet (the same
// 500ms Playwright's networkidle load state uses), and how long to wait for that at most.
const networkQuietMs = 500;
const networkQuietTimeoutMs = 30 * 1000;
const networkQuietCheckIntervalMs = 50;

/**
 * Resolves once no request has been in flight for half a second. This is the semantics of
 * page.waitForLoadState('networkidle'), reimplemented on the public request events because
 * the networkidle lifecycle event is unreliable in Firefox: on request-heavy pages (the
 * datagrid documentation) it can fire before 'load' and never fire again, hanging the wait
 * even though the network has long gone quiet.
 */
async function waitForQuietNetwork() {
  const deadline = Date.now() + networkQuietTimeoutMs;
  let quietForMs = 0;

  while (quietForMs < networkQuietMs) {
    if (Date.now() > deadline) {
      throw new Error(`network requests still in flight after ${networkQuietTimeoutMs}ms: ${inFlightRequests.size}`);
    }

    // A plain timer, not page.waitForTimeout: the in-flight set lives in this process, so
    // there is no reason to make a browser round trip on every check.
    await new Promise(resolve => setTimeout(resolve, networkQuietCheckIntervalMs));
    quietForMs = inFlightRequests.size > 0 ? 0 : quietForMs + networkQuietCheckIntervalMs;
  }
}

// Upper bound for the viewport height a page can grow to. Some demos react to the viewport
// size, so a page's content height can keep increasing on every resize (a resize feedback
// loop); the bound keeps such a page finite instead of letting it grow without limit.
const maxViewportHeightPx = 20000;
// How long reflowing content (lazy-loaded demos, virtual-scroll datagrids) may keep changing
// the content height before the current height is accepted, re-measured at this interval.
const resizeSettleTimeoutMs = 2000;
const resizeSettleCheckIntervalMs = 250;

/**
 * Resizes the viewport to the full content height so a regular viewport screenshot captures the
 * whole page. Playwright's fullPage screenshots expand the render surface mid-capture, which
 * reflows demos that render based on available space (virtual-scroll datagrids) and produces
 * flaky captures; resizing up front lets such content settle first. The loop exits once a
 * measurement taken one check interval after the last resize still matches the viewport height,
 * or when the settle timeout elapses.
 */
async function fitViewportToContent(page: Page, viewportWidth: number) {
  const measureContentHeight = () =>
    page.evaluate(
      maxHeightPx => Math.min(Math.max(document.body.scrollHeight, document.documentElement.scrollHeight), maxHeightPx),
      maxViewportHeightPx
    );

  const deadline = Date.now() + resizeSettleTimeoutMs;
  let viewportHeight = await measureContentHeight();

  do {
    await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
    await page.waitForTimeout(resizeSettleCheckIntervalMs);

    const contentHeight = await measureContentHeight();

    if (contentHeight === viewportHeight) {
      return;
    }

    viewportHeight = contentHeight;
  } while (Date.now() < deadline);

  // The settle timeout elapsed with the content height still changing (a resize feedback
  // loop); apply the last measurement so the screenshot at least matches it.
  await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
}
