/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ScreenshotOptions } from '../helpers/screenshot-options.interface';

/**
 * This config is a rudimentary method of changing how the screenshots are taken for specific
 * website pages, mirroring tests/screenshot-options.ts for the Storybook visual tests.
 *
 * Each key is a page name as generated in tests/website/visual-snapshots.spec.ts:
 * the route with slashes replaced by dashes, e.g.
 *
 * /documentation/button                 => documentation-button (the overview tab)
 * /documentation/button/code           => documentation-button-code
 * /documentation/datagrid/code/full    => documentation-datagrid-code-full
 * /pages/introduction                  => pages-introduction
 * /                                    => home
 *
 * Available options:
 * - fullPageScreenshot: pages are captured full page by default; set to false to capture
 *   only the viewport (useful for very long pages where only the top matters).
 * - viewport: override the browser viewport size for the page.
 * - exclude: skip taking a screenshot of the page.
 * - maskSelectors: CSS selectors for regions that render non-deterministically and should
 *   be masked out of the screenshot.
 */
export const websiteScreenshotOptions: ScreenshotOptions = {
  'documentation-accessibility': {
    // /documentation/accessibility redirects to /pages/accessibility, which is already covered
    // by the pages-accessibility screenshot.
    exclude: true,
  },
  'documentation-theme-builder': {
    // The page throws a router NG04005 error on load and intermittently renders as a blank
    // shell, observed consistently on the CI runners (issue #2680). Re-enable once fixed.
    exclude: true,
  },
  'documentation-datagrid-code-virtual-scroll': {
    // The live demo generates random rows (dates, wins) on every load.
    maskSelectors: ['clr-datagrid'],
  },
  'documentation-modal-code': {
    // The animation demo toggles its modal in and out every two seconds.
    maskSelectors: ['clr-modal-animation-demo'],
  },
  'documentation-translate-code': {
    // The interactive demo formats the current time ("Formatted Date: ..."), which changes
    // between runs.
    maskSelectors: ['p:has-text("Formatted Date:")'],
  },
};
