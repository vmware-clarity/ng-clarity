/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, test } from '@playwright/test';

import { openConsumerForEachTest } from './helpers';

/*
 * An Eager component with plain fields that change in timers, in the Zone.js build only: the datagrid's views are
 * OnPush and have to follow the state the component gives them.
 */
test.describe('zone built package consumer datagrid', () => {
  openConsumerForEachTest('zone', '&suite=zone-datagrid');

  const servers = (page: import('@playwright/test').Page) => page.locator('.zone-servers clr-dg-row clr-dg-cell');

  test.beforeEach(async ({ page }) => {
    await page.getByRole('button', { name: 'Load servers later' }).click();
    await expect(servers(page)).toHaveText(['alpha', 'beta']);
  });

  test('shows the items, the loading state and the pages that come in later', async ({ page }) => {
    const grid = page.locator('.zone-servers');
    await expect(grid.locator('.datagrid-spinner')).toHaveCount(0);
    await expect(grid.locator('.datagrid-placeholder.datagrid-empty')).toHaveCount(0);
    await expect(grid.locator('.pagination-current')).toHaveValue('1');

    await page.getByRole('button', { name: 'Next page later' }).click();
    await expect(servers(page)).toHaveText(['gamma']);
    await expect(grid.locator('.pagination-current')).toHaveValue('2');
  });

  test('shows a selection changed in place later', async ({ page }) => {
    const grid = page.locator('.zone-servers');
    await page.getByRole('button', { name: 'Select later' }).click();
    await expect(grid.locator('.datagrid-rows .datagrid-select input').nth(1)).toBeChecked();
    await expect(grid.locator('.datagrid-footer-select')).toContainText('1');
  });

  test('shows a custom filter that changes later as active', async ({ page }) => {
    const grid = page.locator('.zone-servers');
    await page.getByRole('button', { name: 'Filter later' }).click();
    await expect(servers(page)).toHaveText(['gamma']);
    await expect(grid.locator('.datagrid-filter-toggle')).toHaveClass(/datagrid-filtered/);
  });

  test('opens the detail pane later', async ({ page }) => {
    const grid = page.locator('.zone-servers');
    await page.getByRole('button', { name: 'Open detail later' }).click();
    await expect(grid.getByRole('dialog')).toContainText('Detail body of alpha');
    await expect(grid.locator('.datagrid')).toHaveAttribute('aria-hidden', 'true');
    await expect(grid.locator('.datagrid-detail-caret-button.is-open')).toHaveCount(1);
  });

  test('shows tree children that a Promise brings later', async ({ page }) => {
    const tree = page.locator('.zone-tree');
    await tree.getByRole('button', { name: /Expand/ }).click();
    // The first cell also holds the toggle, whose label is read with the folder name.
    await expect(tree.locator('clr-dg-cell')).toHaveText([/Documents$/, 'Documents child']);
    await expect(tree.getByRole('button', { name: /Collapse/ })).toHaveCount(1);
    await expect(tree.locator('[role=row][aria-busy]')).toHaveCount(0);
    await expect(tree.locator('[role=row][aria-level="1"]')).toHaveAttribute('aria-expanded', 'true');
  });
});
