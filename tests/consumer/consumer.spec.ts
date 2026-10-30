/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, test } from '@playwright/test';

for (const mode of ['zone', 'zoneless']) {
  test.describe(`${mode} built package consumer`, () => {
    let errors: string[];

    test.beforeEach(async ({ page }) => {
      errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => {
        if (message.type() === 'error') {
          errors.push(message.text());
        }
      });
      await page.goto(`/?mode=${mode}`);
      await expect(page.getByTestId('mode')).toHaveText(mode);
      expect(await page.evaluate(() => typeof (globalThis as { Zone?: unknown }).Zone !== 'undefined')).toBe(
        mode === 'zone'
      );
    });

    test.afterEach(() => expect(errors).toEqual([]));

    test('tabs and accordion react to consumer clicks', async ({ page }) => {
      await page.getByRole('tab', { name: 'Details', exact: true }).click();
      await expect(page.getByText('Details content', { exact: true })).toBeVisible();
      await expect(page.getByText('Overview content', { exact: true })).toBeHidden();
      await page.getByRole('button', { name: 'Consumer accordion', exact: true }).click();
      await expect(page.getByText('Expanded consumer content', { exact: true })).toBeVisible();
      await page.getByRole('button', { name: 'Consumer accordion', exact: true }).click();
      await expect(page.getByText('Expanded consumer content', { exact: true })).toBeHidden();
    });

    test('datagrid sorts and renders an asynchronous signal update', async ({ page }) => {
      const cells = page.locator('clr-dg-cell');
      await expect(cells).toHaveText(['Beta', 'Alpha']);
      await page.getByRole('button', { name: 'Name', exact: true }).click();
      await expect(cells).toHaveText(['Alpha', 'Beta']);
      await page.getByRole('button', { name: 'Load another item' }).click();
      await expect(cells).toHaveText(['Alpha', 'Beta', 'Gamma']);
    });

    test('forms report values and required validation', async ({ page }) => {
      const input = page.getByRole('textbox', { name: 'Consumer name' });
      await input.fill('Ada');
      await page.getByRole('checkbox', { name: 'Enable consumer' }).check();
      await expect(page.getByTestId('form-value')).toHaveText('Ada / true');
      await input.fill('');
      await input.blur();
      await expect(page.getByText('Name is required', { exact: true })).toBeVisible();
    });

    test('modal and dropdown close through their normal actions', async ({ page }) => {
      await page.getByRole('button', { name: 'Open consumer modal' }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByRole('button', { name: 'Close consumer modal' }).click();
      await expect(page.getByRole('dialog')).toBeHidden();
      await page.getByRole('button', { name: 'Consumer actions' }).click();
      await page.getByRole('menuitem', { name: 'Choose action' }).click();
      await expect(page.getByTestId('action')).toHaveText('Selected');
      await expect(page.getByRole('menuitem', { name: 'Choose action' })).toBeHidden();
    });

    test('property-view addon renders and collapses a section', async ({ page }) => {
      const addon = page.locator('appfx-property-view');
      await expect(addon.getByText('Ready', { exact: true })).toBeVisible();
      const toggle = addon.locator('.pv-section-title-expand-button');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(addon.getByText('Ready', { exact: true })).toBeHidden();
      await toggle.click();
      await expect(addon.getByText('Ready', { exact: true })).toBeVisible();
    });
  });
}
