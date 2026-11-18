/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, Page, test } from '@playwright/test';

// The highlighting of the static code blocks (see projects/website/src/app/shared/code-snippet/highlight-static-code.ts).
// The screenshot tests open every view with a direct page load, so they don't cover a view reached within the site.

const baseUrl = 'http://localhost:8081';

test.beforeEach(async ({ context }) => {
  await context.route(
    url => url.hostname !== 'localhost' && url.hostname !== '127.0.0.1',
    route => route.abort()
  );
});

test('highlights the code blocks of a tab opened within the site', async ({ page }) => {
  await page.goto(`${baseUrl}/documentation/drag-and-drop`);
  await page.getByRole('tab', { name: 'Code' }).click();

  await expect(page.locator('pre > code.language-typescript .token').first()).toBeVisible();
});

test('keeps the code highlighted at build time', async ({ page }) => {
  await openSettled(page, '/documentation/a11y/ai');

  // The website has no SCSS grammar at runtime, so highlighting the block again would remove its tokens.
  await expect(page.locator('pre > code.language-scss .token').first()).toBeVisible();
});

test('leaves a code block without tokens alone after it was handled', async ({ page }) => {
  await openSettled(page, '/pages/ai');
  const block = page.locator('pre > code.language-text').first();
  await block.evaluate(code => ((code as { handledContent?: Node | null }).handledContent = code.firstChild));

  // Any click on the page renders it again, and rewriting the block there would lose a text selection in it.
  await block.click();
  await openSettled(page);

  expect(
    await block.evaluate(code => code.firstChild === (code as { handledContent?: Node | null }).handledContent)
  ).toBe(true);
});

/** Opens a route (when given) and waits until its code blocks were handled. */
async function openSettled(page: Page, route?: string) {
  if (route) {
    await page.goto(`${baseUrl}${route}`);
  }
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve))));
}
