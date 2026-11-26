/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, Page, test } from '@playwright/test';

import { modes, openConsumerForEachTest } from './helpers';

function nav(page: Page) {
  return page.locator('#vertical-nav-acceptance clr-vertical-nav');
}

function navTrigger(page: Page) {
  return nav(page).locator('.nav-trigger');
}

function groupTrigger(page: Page) {
  return page.getByRole('button', { name: 'Consumer group' });
}

for (const mode of modes) {
  test.describe(`${mode} vertical nav in an Eager consumer`, () => {
    openConsumerForEachTest(mode, '&suite=vertical-nav');

    test('collapses, expands and opens groups through clicks', async ({ page }) => {
      await expect(nav(page)).toHaveClass(/has-icons/);
      await expect(nav(page)).toHaveClass(/has-nav-groups/);

      await groupTrigger(page).click();
      await expect(groupTrigger(page)).toHaveAttribute('aria-expanded', 'true');
      await expect(page.getByText('Consumer home child')).toBeVisible();
      await expect(page.getByTestId('nav-state')).toHaveText('false / true');

      await navTrigger(page).click();
      await expect(nav(page)).toHaveClass(/is-collapsed/);
      await expect(navTrigger(page)).toHaveAttribute('aria-expanded', 'false');
      await expect(page.getByText('Consumer home child')).toHaveCount(0);
      await expect(page.getByTestId('nav-state')).toHaveText('true / false');

      await navTrigger(page).click();
      await expect(nav(page)).not.toHaveClass(/is-collapsed/);
      await expect(page.getByText('Consumer home child')).toBeVisible();
      await expect(page.getByTestId('nav-state')).toHaveText('false / true');
    });

    test('renders a collapse made later through the component API', async ({ page }) => {
      await page.getByRole('button', { name: 'Toggle nav API later' }).click();
      await expect(nav(page)).toHaveClass(/is-collapsed/);
      await expect(navTrigger(page)).toHaveAttribute('aria-expanded', 'false');

      await page.getByRole('button', { name: 'Toggle nav API later' }).click();
      await expect(nav(page)).not.toHaveClass(/is-collapsed/);
      await expect(navTrigger(page)).toHaveAttribute('aria-expanded', 'true');
    });

    if (mode === 'zone') {
      test('renders plain-field changes made later from timers', async ({ page }) => {
        await page.getByRole('button', { name: 'Rename later' }).click();
        await expect(nav(page).getByText('Renamed', { exact: true })).toBeVisible();

        await page.getByRole('button', { name: 'Toggle group later' }).click();
        await expect(groupTrigger(page)).toHaveAttribute('aria-expanded', 'true');
        await expect(page.getByText('Renamed child')).toBeVisible();

        await page.getByRole('button', { name: 'Toggle collapsed later' }).click();
        await expect(nav(page)).toHaveClass(/is-collapsed/);
        await expect(page.getByText('Renamed child')).toHaveCount(0);

        await page.getByRole('button', { name: 'Toggle collapsed later' }).click();
        await expect(nav(page)).not.toHaveClass(/is-collapsed/);
        await expect(page.getByText('Renamed child')).toBeVisible();
      });
    }
  });
}
