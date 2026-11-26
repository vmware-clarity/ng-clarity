/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, Page, test } from '@playwright/test';

/** The consumer is built once with Zone.js and once without. */
export const modes = ['zone', 'zoneless'] as const;

/**
 * Opens the consumer built for `mode` before each test of the enclosing describe block, checks that Zone.js is
 * loaded only in the Zone.js build, and fails each test on a browser error.
 */
export function openConsumerForEachTest(mode: (typeof modes)[number], query = '') {
  let errors: string[];

  test.beforeEach(async ({ page }) => {
    errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });
    await page.goto(`/${mode}/?mode=${mode}${query}`);
    await expect(page.getByTestId('mode')).toHaveText(mode);
    expect(await page.evaluate(() => typeof (globalThis as { Zone?: unknown }).Zone !== 'undefined')).toBe(
      mode === 'zone'
    );
  });

  test.afterEach(() => expect(errors).toEqual([]));
}

/**
 * Runs `source` in the page, outside Angular, the way code outside the application would, with the acceptance
 * component published on `window[handle]` as `app`. `source` may `return` a value.
 */
export function external(
  page: Page,
  handle: 'overlayAcceptance' | 'runtimeAcceptance' | 'headerAcceptance',
  source: string
) {
  // A string runs as a page script. `new Function` would be eval, which the test server's Content-Security-Policy
  // blocks.
  return page.evaluate(`(app => { ${source} })(window.${handle})`);
}
