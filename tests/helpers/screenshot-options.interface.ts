/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Per-screenshot overrides shared by the Storybook and website visual regression suites.
 * The key format differs per suite; see tests/screenshot-options.ts and
 * tests/website/screenshot-options.ts.
 */
export type ScreenshotOptions = {
  [name: string]: {
    /** Storybook stories are captured viewport-only by default; website pages full page. */
    fullPageScreenshot?: boolean;
    viewport?: { width: number; height: number };
    exclude?: boolean;
    /** CSS selectors for regions that render non-deterministically and should be masked. */
    maskSelectors?: string[];
  };
};
