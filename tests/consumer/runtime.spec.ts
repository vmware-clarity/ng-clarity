/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, Page, test } from '@playwright/test';

function external(page: Page, action: string) {
  return page.evaluate(source => new Function('app', source)((window as any).runtimeAcceptance), action);
}

for (const mode of ['zone', 'zoneless']) {
  test.describe(`${mode} final runtime integration`, () => {
    let errors: string[];
    test.beforeEach(async ({ page }) => {
      errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => {
        if (message.type() === 'error') {
          errors.push(message.text());
        }
      });
      await page.goto(`/${mode}/?mode=${mode}&suite=runtime`);
      await expect(page.getByTestId('mode')).toHaveText(mode);
      expect(await page.evaluate(() => typeof (globalThis as { Zone?: unknown }).Zone !== 'undefined')).toBe(
        mode === 'zone'
      );
    });
    test.afterEach(() => expect(errors).toEqual([]));

    test('an initially open child action menu retains focus after modal initialization and recreation', async ({
      page,
    }) => {
      const edit = page.getByRole('button', { name: 'Runtime edit', exact: true });
      await external(page, 'app.actionModal.set(true)');
      await expect(edit).toBeVisible();
      await page.locator('.runtime-action-modal .modal-dialog').evaluate(async element => {
        await Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished));
      });
      await expect(edit).toBeFocused();
      await external(page, 'app.actionModal.set(false)');
      await expect(edit).toHaveCount(0);
      await external(page, 'app.actionModal.set(true)');
      await expect(edit).toBeVisible();
      await page.locator('.runtime-action-modal .modal-dialog').evaluate(async element => {
        await Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished));
      });
      await expect(edit).toBeFocused();
    });

    test('column action labels follow changed, blank and restored projected titles', async ({ page }) => {
      const toggle = page.locator('.runtime-columns .datagrid-column-actions-toggle').first();
      await expect(toggle).toHaveAttribute('aria-label', 'First runtime column actions');
      await external(page, 'app.rename("Updated runtime")');
      await expect(toggle).toHaveAttribute('aria-label', 'Updated runtime column actions');
      await external(page, 'app.rename("   ")');
      await expect(toggle).toHaveAttribute('aria-label', 'Column actions');
      await external(page, 'app.rename("Restored runtime")');
      await expect(toggle).toHaveAttribute('aria-label', 'Restored runtime column actions');
    });

    test('pinning and unpinning update the last scrollable separator and column placement', async ({ page }) => {
      const third = page.locator('.runtime-columns clr-dg-column').filter({ hasText: 'Third runtime' });
      const second = page.locator('.runtime-columns clr-dg-column').filter({ hasText: 'Second runtime' });
      await external(page, 'app.pinThird(true)');
      await expect(third.locator('clr-dg-column-separator')).toHaveCount(1);
      await expect(second.locator('clr-dg-column-separator')).toHaveCount(0);
      await expect(
        page.locator('.runtime-columns .datagrid-header .datagrid-pinned-cells > clr-dg-column')
      ).toContainText('Third runtime');
      await external(page, 'app.pinThird(false)');
      await expect(third.locator('clr-dg-column-separator')).toHaveCount(0);
      await expect(second.locator('clr-dg-column-separator')).toHaveCount(1);
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

    test('column picker backdrop and destruction remove the overlay', async ({ page }) => {
      const trigger = page.locator('#runtime-acceptance appfx-dg-column-toggle .column-toggle-action');
      await trigger.click();
      await page.locator('.cdk-overlay-backdrop').click({ position: { x: 2, y: 2 } });
      await expect(trigger).not.toHaveAttribute('aria-controls');
      await trigger.click();
      await expect(page.locator('.column-switch')).toBeVisible();
      await external(page, 'app.addonMounted.set(false)');
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
      await external(page, 'app.themeMounted.set(false)');
      await expect(theme).toHaveCount(0);
    });

    for (const kind of ['observable', 'promise']) {
      test(`recursive tree renders ${kind} children after an external completion`, async ({ page }) => {
        await external(page, `app.kind = "${kind}"`);
        const tree = page.locator('#runtime-acceptance > clr-tree');
        await tree.locator('.clr-treenode-caret').click();
        await expect(tree.locator('.clr-treenode-spinner')).toBeVisible();
        await external(page, 'app.completeRequest()');
        await expect(tree.getByText('Runtime child', { exact: true })).toBeVisible();
        await expect(tree.locator('.clr-treenode-spinner')).toHaveCount(0);
      });
    }

    for (const kind of ['observable', 'promise']) {
      test(`recursive tree ignores ${kind} completion after destruction`, async ({ page }) => {
        await external(page, `app.kind = "${kind}"`);
        const tree = page.locator('#runtime-acceptance > clr-tree');
        await tree.locator('.clr-treenode-caret').click();
        await expect(tree.locator('.clr-treenode-spinner')).toBeVisible();
        await external(page, 'app.destroyTreeRetainingModel()');
        await expect(tree).toHaveCount(0);
        expect(await external(page, 'return app.cancellations')).toBe(kind === 'observable' ? 1 : 0);
        const before = await external(page, 'return app.loadingEmissions');
        await external(page, 'app.completeRequest()');
        expect(await external(page, 'return app.retainedTreeModel.children.length')).toBe(0);
        expect(await external(page, 'return app.loadingEmissions')).toBe(before);
        await expect(tree).toHaveCount(0);
      });
    }
  });
}
