/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

type WebsiteScreenshotOptions = {
  [pageName: string]: {
    fullPageScreenshot?: boolean;
    viewport?: { width: number; height: number };
    exclude?: boolean;
    maskSelectors?: string[];
  };
};

/**
 * This config is a rudimentary method of changing how the screenshots are taken for specific
 * website pages, mirroring tests/screenshot-options.ts for the Storybook visual tests.
 *
 * Each key is a page name as generated in tests/website/visual-snapshots.spec.ts:
 * the route with slashes replaced by dashes, e.g.
 *
 * /documentation/button  => documentation-button
 * /pages/introduction    => pages-introduction
 * /                      => home
 *
 * Available options:
 * - fullPageScreenshot: pages are captured full page by default; set to false to capture
 *   only the viewport (useful for very long pages where only the top matters).
 * - viewport: override the browser viewport size for the page.
 * - exclude: skip taking a screenshot of the page.
 * - maskSelectors: CSS selectors for regions that render non-deterministically and should
 *   be masked out of the screenshot.
 */
export const websiteScreenshotOptions: WebsiteScreenshotOptions = {};
