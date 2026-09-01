/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

import { websiteScreenshotOptions } from './screenshot-options';

const browser = process.env['CLARITY_VRT_BROWSER'];
const theme = process.env['CLARITY_VRT_THEME'];
const density = process.env['CLARITY_VRT_DENSITY'];
const shard = process.env['CLARITY_VRT_SHARD'];
// The used-screenshot-paths file only needs to be unique per CI job; shard is appended so
// parallel shards of the same browser/theme/density combo don't write the same filename.
const matrixKey = shard ? `${browser}-${theme}-${density}-${shard}` : `${browser}-${theme}-${density}`;

// The website reads these keys on startup (see the theme-toggle and density-toggle components).
// An empty string is the default density.
const densityLocalStorageValue = density === 'compact' ? 'compact' : '';

const baseUrl = 'http://localhost:8081';

/**
 * Restricts the generated tests to a subset of pages, e.g. while stabilizing newly added
 * pages. Null covers the full page inventory (every page in componentlist.json plus the
 * static pages below).
 */
const pilotPages: string[] | null = null;

// Routes that exist outside the component list.
const staticPages = [
  { name: 'home', route: '/' },
  { name: 'theme-builder', route: '/theme-builder' },
  ...fs
    .readdirSync(path.join('.', 'projects', 'website', 'content', 'pages'))
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''))
    .map(slug => ({ name: `pages-${slug}`, route: `/pages/${slug}` })),
];

const componentListFilePath = path.join('.', 'projects', 'website', 'src', 'settings', 'componentlist.json');
const componentList: { list: { url: string; text: string; type: string }[] } = JSON.parse(
  fs.readFileSync(componentListFilePath).toString()
);

// The overview tab (the default tab) of each documentation page hosts the live component
// demos, which is where visual regressions appear. The code/api/accessibility tabs are
// mostly prose and are intentionally not captured.
const documentationPages = componentList.list.map(component => ({
  name: `documentation-${component.url}`,
  route: `/documentation/${component.url}`,
}));

const pages = [...staticPages, ...documentationPages].filter(
  sitePage => !pilotPages || pilotPages.includes(sitePage.name)
);

// Regions that can never render deterministically, masked on every page: animated GIFs and
// native indeterminate <progress> bars keep animating regardless of animations: 'disabled',
// and app-animated-example wraps demos (spinners, progress bars) that animate via JavaScript.
const defaultMaskSelectors = ['img[src*=".gif"]', 'progress:not([value])', 'app-animated-example'];

const usedScreenshotPaths: string[] = [];

for (const sitePage of pages) {
  const options = websiteScreenshotOptions[sitePage.name];

  if (options?.exclude) {
    continue;
  }

  const screenshotPath = path.join(browser, 'website', `${sitePage.name}-${theme}-${density}.png`);
  usedScreenshotPaths.push(screenshotPath);

  test(screenshotPath, async ({ page, context }) => {
    // The website makes a few requests to external services (Google Tag Manager, the
    // version switcher's versions.json). Block everything that isn't served locally so the
    // screenshots are deterministic and unaffected by network conditions.
    await context.route(
      url => url.hostname !== 'localhost' && url.hostname !== '127.0.0.1',
      route => route.abort()
    );

    // Theme and density are read from localStorage on startup; seed them before any page
    // script runs. Without a stored theme the website falls back to prefers-color-scheme.
    await page.addInitScript(
      ([themeValue, densityValue]) => {
        localStorage.setItem('theme', themeValue);
        localStorage.setItem('density', densityValue);
      },
      [theme, densityLocalStorageValue]
    );

    if (options?.viewport) {
      await page.setViewportSize(options.viewport);
    }

    await page.goto(`${baseUrl}${sitePage.route}`);

    // The documentation demos are lazy-loaded modules; wait until all chunks have loaded so
    // the page has its final content (and therefore its final height) before capturing.
    await page.waitForLoadState('networkidle');

    // The website scrolls inside Clarity's content area (clr-main-container is 100vh with an
    // overflow-y: auto content area), so the document itself never grows beyond the viewport
    // and a fullPage screenshot would only capture the first 720px. Let the containers grow
    // vertically with their content instead, so the full page is captured. Horizontal
    // overflow stays clipped to the viewport width, which is what a user sees (wide content
    // scrolls horizontally inside the content area rather than widening the page).
    await page.addStyleTag({
      content: `
        html, body { height: auto !important; overflow-x: clip !important; }
        .main-container { height: auto !important; min-height: 100vh; overflow-x: clip !important; }
        .content-container { height: auto !important; }
        /* min-width: 0 preserves the flex sizing the content area has as a scroll container,
           so wide content overflows (and is clipped) instead of widening the page. */
        .content-area { overflow-y: visible !important; overflow-x: clip !important; min-width: 0 !important; }
        /* The floating scroll-to-top button is driven by an IntersectionObserver that flaps
           once the viewport is resized to the full content height; hide it. */
        app-table-of-contents .scroll-to-top { display: none !important; }
      `,
    });

    await page.evaluate(() => document.fonts.ready);

    // Playwright's fullPage screenshots (captureBeyondViewport) expand the render surface
    // during the capture, which makes demos that render based on available space (for example
    // virtual-scroll datagrids) reflow mid-capture and produce flaky screenshot heights.
    // Instead, resize the viewport to the content height before capturing and take a regular
    // viewport screenshot, re-measuring until the height settles.
    if (options?.fullPageScreenshot ?? true) {
      const viewportWidth = page.viewportSize()?.width ?? 1280;
      let viewportHeight = 0;

      for (let attempt = 0; attempt < 8; attempt++) {
        // Give content that renders late (for example the table of contents) or reacts to the
        // previous resize a moment to settle before measuring; the loop only exits once a
        // measurement taken after such a pause still matches the viewport height.
        await page.waitForTimeout(250);

        const contentHeight = Math.min(
          await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)),
          20000
        );

        if (contentHeight === viewportHeight) {
          break;
        }

        viewportHeight = contentHeight;
        await page.setViewportSize({ width: viewportWidth, height: viewportHeight });
      }
    }

    await expect(page).toHaveScreenshot(screenshotPath.split(path.sep), {
      animations: 'disabled',
      caret: 'hide',
      threshold: 0.01,
      mask: [...defaultMaskSelectors, ...(options?.maskSelectors ?? [])].map(selector => page.locator(selector)),
    });
  });
}

const usedScreenshotsFilePath = path.join('.', 'tests', 'snapshots', `used-screenshot-paths-website-${matrixKey}.txt`);
fs.writeFileSync(usedScreenshotsFilePath, usedScreenshotPaths.join('\n'));
