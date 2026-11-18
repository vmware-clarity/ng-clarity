/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, test } from '@playwright/test';

import { external, modes, openConsumerForEachTest } from './helpers';

for (const mode of modes) {
  test.describe(`${mode} responsive header`, () => {
    // Below the large breakpoint, so the header shows its nav triggers.
    test.use({ viewport: { width: 768, height: 800 } });
    openConsumerForEachTest(mode, '&suite=header');

    test('the hamburger trigger opens and a nav link closes the level 1 nav', async ({ page }) => {
      const hamburger = page.locator('.header-hamburger-trigger');
      await expect(hamburger).toHaveAttribute('aria-label', 'Open navigation menu');
      await expect(page.getByTestId('header-actions')).toBeVisible();

      await hamburger.click();
      await expect(hamburger).toHaveAttribute('aria-label', 'Close navigation menu');
      await expect(page.getByTestId('header-actions')).toHaveCount(0);
      await expect(page.locator('clr-main-container')).toHaveClass(/open-hamburger-menu/);

      await page.getByRole('link', { name: 'Header link' }).click();
      await expect(hamburger).toHaveAttribute('aria-label', 'Open navigation menu');
      await expect(page.getByTestId('header-actions')).toBeVisible();
      await expect(page.locator('clr-main-container')).not.toHaveClass(/open-hamburger-menu/);
    });

    test('a nav level added later gets its trigger, opens from a timer and closes from outside Angular', async ({
      page,
    }) => {
      const overflow = page.locator('.header-overflow-trigger');
      await expect(overflow).toHaveCount(0);
      await page.getByRole('button', { name: 'Toggle overflow' }).click();
      await expect(overflow).toHaveAttribute('aria-label', 'Open navigation overflow menu');

      await page.getByRole('button', { name: 'Open overflow later' }).click();
      await expect(overflow).toHaveAttribute('aria-label', 'Close navigation overflow menu');
      await expect(page.getByRole('link', { name: 'Overflow link' })).toBeVisible();

      await external(page, 'headerAcceptance', 'app.closeAllNavs()');
      await expect(overflow).toHaveAttribute('aria-label', 'Open navigation overflow menu');
      await expect(page.locator('clr-main-container')).not.toHaveClass(/open-overflow-menu/);
    });
  });
}
