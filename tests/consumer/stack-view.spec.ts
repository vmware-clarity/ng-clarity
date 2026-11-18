/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, test } from '@playwright/test';

import { modes, openConsumerForEachTest } from './helpers';

for (const mode of modes) {
  test.describe(`${mode} stack view`, () => {
    openConsumerForEachTest(mode, '&suite=stack-view');

    test('expands and collapses on clicks and writes back the two-way binding', async ({ page }) => {
      const parent = page.getByRole('button', { name: 'Consumer parent' });
      await expect(parent).toHaveAttribute('aria-expanded', 'false');
      await parent.click();
      await expect(parent).toHaveAttribute('aria-expanded', 'true');
      await expect(page.getByText('Consumer first child content')).toBeVisible();
      await expect(page.getByTestId('stack-view-expanded')).toHaveText('true');
      await parent.click();
      await expect(parent).toHaveAttribute('aria-expanded', 'false');
      await expect(page.getByText('Consumer first child content')).toBeHidden();
      await expect(page.getByTestId('stack-view-expanded')).toHaveText('false');
    });

    test('renders plain fields that a Zone.js consumer changes after a timer', async ({ page }) => {
      test.skip(mode === 'zoneless', 'Plain field changes after a timer only render with Zone.js.');

      const parent = page.getByRole('button', { name: 'Consumer parent' });
      await page.getByRole('button', { name: 'Load stack view changes' }).click();
      await expect(parent).toHaveAttribute('aria-expanded', 'true');
      await expect(page.getByText('Consumer late child content')).toBeVisible();
      await expect(page.getByText('Updated consumer content')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Consumer stack view', level: 2 })).toBeVisible();

      await page.getByRole('button', { name: 'Change stack view child' }).click();
      await expect(parent).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator('.consumer-parent')).toHaveClass(/stack-block-changed/);
      await expect(parent).toContainText('Value changed.');
    });

    test('renders state that the consumer sets on a block instance after a timer', async ({ page }) => {
      await page.getByRole('button', { name: 'Expand direct stack block' }).click();
      const direct = page.getByRole('button', { name: 'Direct block' });
      await expect(direct).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('.consumer-direct')).toHaveClass(/stack-block-expanded/);
      await expect(direct.locator('.stack-block-caret')).toHaveAttribute('direction', 'down');
    });
  });
}
