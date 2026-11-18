/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, test } from '@playwright/test';

import { openConsumerForEachTest } from './helpers';

// Only the Zone.js build refreshes an Eager consumer after a timer, so this suite runs in that build.
test.describe('zone Eager consumer wizard', () => {
  openConsumerForEachTest('zone', '&suite=wizard');

  test('renders consumer changes made after a timer', async ({ page }) => {
    const wizard = page.locator('#wizard-acceptance clr-wizard');
    const steps = wizard.locator('.clr-wizard-stepnav-item');
    const next = wizard.getByRole('button', { name: 'Next', exact: true });

    await expect(next).toBeDisabled();
    await page.getByRole('button', { name: 'Validate later' }).click();
    await expect(next).toBeEnabled();

    await page.getByRole('button', { name: 'Complete later' }).click();
    await expect(steps.first()).toHaveClass(/complete/);

    await page.getByRole('button', { name: 'Rename later' }).click();
    await expect(wizard.locator('.clr-wizard-page-title')).toHaveText('One renamed');

    await page.getByRole('button', { name: 'Add page later' }).click();
    await expect(steps).toHaveCount(4);

    await page.getByRole('button', { name: 'Jump later' }).click();
    await expect(steps.last()).toHaveClass(/active/);
    await expect(wizard.locator('clr-wizard-page.active')).toHaveText('Four content');
    await expect(wizard.locator('clr-wizard-button[type="finish"]')).toHaveAttribute('aria-hidden', 'false');
  });
});
