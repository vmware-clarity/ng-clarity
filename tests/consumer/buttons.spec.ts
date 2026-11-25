/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, Page, test } from '@playwright/test';

import { modes, openConsumerForEachTest } from './helpers';

// The consumer is an Eager component with plain fields (`app/button-acceptance.ts`).
async function expectChanged(page: Page) {
  const group = page.locator('#button-acceptance clr-button-group');
  await expect(group.locator(':scope > button.btn')).toHaveText(['First action', 'Third action']);
  await expect(group.getByRole('button', { name: 'Third action' }).locator('.spinner')).toHaveCount(1);
  await expect(page.locator('.save-button .spinner')).toHaveCount(1);
  await expect(page.locator('.save-button')).toBeDisabled();

  await group.locator('.dropdown-toggle').click();
  const menu = page.locator('.clr-button-group-menu');
  await expect(menu.getByRole('menuitem')).toHaveText(['Second action', 'Late action']);
  await expect(menu.getByRole('menuitem', { name: 'Second action' })).toBeDisabled();
}

for (const mode of modes) {
  test.describe(`${mode} Eager consumer of buttons`, () => {
    openConsumerForEachTest(mode, '&suite=buttons');

    test('renders the changes of a click handler', async ({ page }) => {
      await page.getByRole('button', { name: 'Change now' }).click();
      await expectChanged(page);
    });

    test('renders the changes made after a timeout', async ({ page }) => {
      test.skip(mode === 'zoneless', 'Only Zone.js refreshes an Eager consumer after a timeout');
      await page.getByRole('button', { name: 'Change later' }).click();
      await expectChanged(page);
    });

    test('reports the default state back after a success set after a timeout', async ({ page }) => {
      test.skip(mode === 'zoneless', 'Only Zone.js refreshes an Eager consumer after a timeout');
      await page.getByRole('button', { name: 'Succeed later' }).click();
      await expect(page.locator('.save-button .spinner-check')).toHaveCount(1);
      await expect(page.getByTestId('save-state')).toHaveText('0');
      await expect(page.locator('.save-button .clr-loading-btn-content')).toHaveText('Save');
    });
  });
}
