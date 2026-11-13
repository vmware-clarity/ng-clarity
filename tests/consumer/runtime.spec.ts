/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, test } from '@playwright/test';

import { external, modes, openConsumerForEachTest } from './helpers';

for (const mode of modes) {
  test.describe(`${mode} final runtime integration`, () => {
    openConsumerForEachTest(mode, '&suite=runtime');

    test('an initially open child action menu retains focus after modal initialization and recreation', async ({
      page,
    }) => {
      const edit = page.getByRole('button', { name: 'Runtime edit', exact: true });
      await external(page, 'runtimeAcceptance', 'app.actionModal.set(true)');
      await expect(edit).toBeVisible();
      await page.locator('.runtime-action-modal .modal-dialog').evaluate(async element => {
        await Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished));
      });
      await expect(edit).toBeFocused();
      await external(page, 'runtimeAcceptance', 'app.actionModal.set(false)');
      await expect(edit).toHaveCount(0);
      await external(page, 'runtimeAcceptance', 'app.actionModal.set(true)');
      await expect(edit).toBeVisible();
      await page.locator('.runtime-action-modal .modal-dialog').evaluate(async element => {
        await Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished));
      });
      await expect(edit).toBeFocused();
    });

    test('column action labels follow changed, blank and restored projected titles', async ({ page }) => {
      const toggle = page.locator('.runtime-columns .datagrid-column-actions-toggle').first();
      await expect(toggle).toHaveAttribute('aria-label', 'First runtime column actions');
      await external(page, 'runtimeAcceptance', 'app.rename("Updated runtime")');
      await expect(toggle).toHaveAttribute('aria-label', 'Updated runtime column actions');
      await external(page, 'runtimeAcceptance', 'app.rename("   ")');
      await expect(toggle).toHaveAttribute('aria-label', 'Column actions');
      await external(page, 'runtimeAcceptance', 'app.rename("Restored runtime")');
      await expect(toggle).toHaveAttribute('aria-label', 'Restored runtime column actions');
    });

    test('pinning and unpinning update the last scrollable separator and column placement', async ({ page }) => {
      const third = page.locator('.runtime-columns clr-dg-column').filter({ hasText: 'Third runtime' });
      const second = page.locator('.runtime-columns clr-dg-column').filter({ hasText: 'Second runtime' });
      await external(page, 'runtimeAcceptance', 'app.pinThird(true)');
      await expect(third.locator('clr-dg-column-separator')).toHaveCount(1);
      await expect(second.locator('clr-dg-column-separator')).toHaveCount(0);
      await expect(
        page.locator('.runtime-columns .datagrid-header .datagrid-pinned-cells > clr-dg-column')
      ).toContainText('Third runtime');
      await external(page, 'runtimeAcceptance', 'app.pinThird(false)');
      await expect(third.locator('clr-dg-column-separator')).toHaveCount(0);
      await expect(second.locator('clr-dg-column-separator')).toHaveCount(1);
    });

    test('direct component pinning moves the column and row cells without a host signal update', async ({ page }) => {
      await external(page, 'runtimeAcceptance', 'app.pinThirdDirect(true)');
      const pinnedHeader = page.locator('.runtime-columns .datagrid-header .datagrid-pinned-cells > clr-dg-column');
      const pinnedCell = page.locator('.runtime-columns clr-dg-row .datagrid-pinned-cells > clr-dg-cell');
      await expect(pinnedHeader).toContainText('Third runtime');
      await expect(pinnedCell).toHaveText('Third runtime');
      await external(page, 'runtimeAcceptance', 'app.pinThirdDirect(false)');
      await expect(pinnedHeader).toHaveCount(0);
      await expect(pinnedCell).toHaveCount(0);
    });

    test('column picker ARIA points to the attached overlay and clears on close', async ({ page }) => {
      const trigger = page.locator('#runtime-acceptance appfx-dg-column-toggle .column-toggle-action');
      await trigger.click();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await expect(trigger).toHaveAttribute('aria-controls', /.+/);
      const id = await trigger.getAttribute('aria-controls');
      await expect(trigger).toHaveAttribute('aria-owns', id);
      await expect(page.locator(`[id="${id}"] [role="dialog"]`)).toBeVisible();
      await page.locator('.switch-header button').click();
      await expect(trigger).not.toHaveAttribute('aria-controls');
      await expect(trigger).not.toHaveAttribute('aria-owns');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    test('native Escape clears column picker expanded state and ARIA relationships', async ({ page }) => {
      const trigger = page.locator('#runtime-acceptance appfx-dg-column-toggle .column-toggle-action');
      await trigger.click();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Escape');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(trigger).not.toHaveAttribute('aria-controls');
      await expect(trigger).not.toHaveAttribute('aria-owns');
      await expect(page.locator('.column-switch')).toHaveCount(0);
    });

    test('column picker backdrop and destruction remove the overlay', async ({ page }) => {
      const trigger = page.locator('#runtime-acceptance appfx-dg-column-toggle .column-toggle-action');
      await trigger.click();
      await page.locator('.cdk-overlay-backdrop').click({ position: { x: 2, y: 2 } });
      await expect(trigger).not.toHaveAttribute('aria-controls');
      await trigger.click();
      await expect(page.locator('.column-switch')).toBeVisible();
      await external(page, 'runtimeAcceptance', 'app.addonMounted.set(false)');
      await expect(page.locator('.column-switch')).toHaveCount(0);
    });

    test('theme builder initializes controls and output, then updates its preset', async ({ page }) => {
      const theme = page.locator('#runtime-acceptance clr-theme-builder');
      await expect(theme.locator('.tb-control-header').first()).toContainText('PRIMARY');
      await expect(page.getByTestId('theme-css')).toContainText('/* NO changes */');
      const preset = theme.locator('.tb-preset-card').nth(1);
      await preset.click();
      await expect(preset).toHaveClass(/tb-preset-card-active/);
      await expect(page.getByTestId('theme-css')).toContainText('--cds-alias-primary:');
      await external(page, 'runtimeAcceptance', 'app.themeMounted.set(false)');
      await expect(theme).toHaveCount(0);
    });

    test('restores a theme from the host initialization before the preview is ready', async ({ page }) => {
      await page.goto(`/${mode}/?mode=${mode}&suite=runtime&restoreTheme=preset`);
      const theme = page.locator('#runtime-acceptance clr-theme-builder');
      await expect(theme.locator('.tb-preset-card').nth(1)).toHaveClass(/tb-preset-card-active/);
      await expect(page.getByTestId('theme-css')).toContainText('--cds-alias-primary:');
      await expect(theme.locator('.tb-preview-sandbox').first()).toHaveAttribute('style', /--cds-alias-primary:/);
    });

    for (const kind of ['observable', 'promise']) {
      test(`recursive tree renders ${kind} children after an external completion`, async ({ page }) => {
        await external(page, 'runtimeAcceptance', `app.kind = "${kind}"`);
        const tree = page.locator('#runtime-acceptance > clr-tree');
        await tree.locator('.clr-treenode-caret').click();
        await expect(tree.locator('.clr-treenode-spinner')).toBeVisible();
        await external(page, 'runtimeAcceptance', 'app.completeRequest()');
        await expect(tree.getByText('Runtime child', { exact: true })).toBeVisible();
        await expect(tree.locator('.clr-treenode-spinner')).toHaveCount(0);
      });
    }

    for (const kind of ['observable', 'promise']) {
      test(`recursive tree ignores ${kind} completion after destruction`, async ({ page }) => {
        await external(page, 'runtimeAcceptance', `app.kind = "${kind}"`);
        const tree = page.locator('#runtime-acceptance > clr-tree');
        await tree.locator('.clr-treenode-caret').click();
        await expect(tree.locator('.clr-treenode-spinner')).toBeVisible();
        await external(page, 'runtimeAcceptance', 'app.destroyTreeRetainingModel()');
        await expect(tree).toHaveCount(0);
        expect(await external(page, 'runtimeAcceptance', 'return app.cancellations')).toBe(
          kind === 'observable' ? 1 : 0
        );
        const before = await external(page, 'runtimeAcceptance', 'return app.loadingEmissions');
        await external(page, 'runtimeAcceptance', 'app.completeRequest()');
        expect(await external(page, 'runtimeAcceptance', 'return app.retainedTreeModel.children.length')).toBe(0);
        expect(await external(page, 'runtimeAcceptance', 'return app.loadingEmissions')).toBe(before);
        await expect(tree).toHaveCount(0);
      });
    }
  });
}
