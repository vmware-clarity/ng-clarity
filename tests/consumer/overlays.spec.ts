/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, Page, test } from '@playwright/test';

function external(page: Page, action: string) {
  return page.evaluate(source => new Function('app', source)((window as any).overlayAcceptance), action);
}

for (const mode of ['zone', 'zoneless']) {
  test.describe(`${mode} combined overlay acceptance`, () => {
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

    test('datepicker focuses its day, follows keyboard navigation, and restores focus after selection', async ({
      page,
    }) => {
      const input = page.getByRole('textbox', { name: 'Acceptance date' });
      await page.locator('#overlay-acceptance .clr-input-group-icon-action').click();
      const day = page.locator('.day-btn[tabindex="0"]');
      await expect(day).toBeFocused();
      await expect(day).toHaveText('15');
      await day.press('ArrowRight');
      await expect(day).toHaveText('16');
      await expect(day).toBeFocused();
      await day.press('Enter');
      await expect(page.locator('.calendar-table')).toBeHidden();
      await expect(input).toBeFocused();
      await expect(input).toHaveValue('10/16/2026');
    });

    test('programmatic modal open and native Escape update state, focus and scroll lock', async ({ page }) => {
      const outside = page.getByTestId('outside-focus');
      await outside.focus();
      await external(page, 'app.modal.set(true)');
      const dialog = page.locator('.acceptance-modal .modal-dialog');
      await expect(dialog).toBeVisible();
      await expect(page.locator('body')).toHaveClass(/no-scrolling/);
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(page.getByTestId('overlay-state')).toHaveText('false / false / false / 0');
      await expect(outside).toBeFocused();
      await expect(page.locator('body')).not.toHaveClass(/no-scrolling/);
    });

    test('Escape closes only the top modal and preserves the lower scroll lock', async ({ page }) => {
      await external(page, 'app.modal.set(true)');
      await expect(page.locator('.acceptance-modal .modal-dialog')).toBeVisible();
      await external(page, 'app.second.set(true)');
      await expect(page.locator('.acceptance-second .modal-dialog')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('.acceptance-second .modal-dialog')).toBeHidden();
      await expect(page.locator('.acceptance-modal .modal-dialog')).toBeVisible();
      await expect(page.locator('body')).toHaveClass(/no-scrolling/);
      await page.keyboard.press('Escape');
      await expect(page.locator('.acceptance-modal .modal-dialog')).toBeHidden();
      await expect(page.locator('body')).not.toHaveClass(/no-scrolling/);
    });

    test('input-open side panel joins the modal stack and Escape closes it first', async ({ page }) => {
      await external(page, 'app.modal.set(true)');
      await expect(page.locator('.acceptance-modal .modal-dialog')).toBeVisible();
      await external(page, 'app.panel.set(true)');
      await expect(page.locator('clr-side-panel .modal-dialog')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('clr-side-panel .modal-dialog')).toBeHidden();
      await expect(page.locator('.acceptance-modal .modal-dialog')).toBeVisible();
      await expect(page.locator('body')).toHaveClass(/no-scrolling/);
      await page.keyboard.press('Escape');
      await expect(page.locator('body')).not.toHaveClass(/no-scrolling/);
    });

    test('closability and alternate-close are honored by the top modal', async ({ page }) => {
      await external(page, 'app.closable.set(false); app.second.set(true)');
      const dialog = page.locator('.acceptance-second .modal-dialog');
      await expect(dialog).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(dialog).toBeVisible();
      await expect(page.getByTestId('overlay-state')).toHaveText('false / true / false / 0');
      await external(page, 'app.closable.set(true); app.prevent.set(true)');
      await expect(page.getByTestId('overlay-state')).toHaveAttribute('data-closable', 'true');
      await expect(page.getByTestId('overlay-state')).toHaveAttribute('data-prevent-close', 'true');
      await page.keyboard.press('Escape');
      await expect(page.getByTestId('overlay-state')).toHaveText('false / true / false / 1');
      await expect(dialog).toBeVisible();
      await external(page, 'app.prevent.set(false)');
      await expect(page.getByTestId('overlay-state')).toHaveAttribute('data-prevent-close', 'false');
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
    });

    test('programmatic dropdown opening and Escape synchronize rendered content and trigger', async ({ page }) => {
      const trigger = page.getByRole('button', { name: 'Acceptance actions' });
      await trigger.focus();
      await external(page, 'app.openPopover("menu")');
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await expect(page.getByRole('menuitem', { name: 'First action', exact: true })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(page.getByRole('menuitem', { name: 'First action', exact: true })).toBeHidden();
      await expect(trigger).toBeFocused();
    });

    test('signpost native outside-click closes and preserves the outside focus', async ({ page }) => {
      const trigger = page.getByRole('button', { name: 'Acceptance info' });
      await external(page, 'app.openPopover("signpost")');
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await expect(page.getByText('Acceptance signpost content', { exact: true })).toBeVisible();
      const outside = page.getByTestId('outside-focus');
      await outside.click();
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(page.getByText('Acceptance signpost content', { exact: true })).toBeHidden();
      await expect(outside).toBeFocused();
    });

    test('combobox keyboard pseudo-focus and blur synchronize options and expanded state', async ({ page }) => {
      const combo = page.locator('#overlay-acceptance [role="combobox"]');
      await combo.focus();
      await combo.press('ArrowDown');
      await expect(combo).toHaveAttribute('aria-expanded', 'true');
      await expect(page.getByRole('option', { name: 'First choice', exact: true })).toBeVisible();
      const activeId = await combo.getAttribute('aria-activedescendant');
      await expect(page.locator(`[id="${activeId}"]`)).toContainText('First choice');
      await page.getByTestId('outside-focus').focus();
      await expect(combo).toHaveAttribute('aria-expanded', 'false');
      await expect(page.getByRole('option', { name: 'First choice', exact: true })).toBeHidden();
    });

    test('rapid popover close cancels deferred focus and visibility work', async ({ page }) => {
      const outside = page.getByTestId('outside-focus');
      await outside.focus();
      await external(
        page,
        'app.openPopover("menu"); app.closePopover("menu"); app.openPopover("combo"); app.closePopover("combo")'
      );
      await expect(page.getByRole('button', { name: 'Acceptance actions' })).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator('#overlay-acceptance [role="combobox"]')).toHaveAttribute('aria-expanded', 'false');
      await expect(page.getByRole('menuitem', { name: 'First action', exact: true })).toBeHidden();
      await expect(outside).toBeFocused();
    });

    test('late modal requests after destruction cannot reacquire the scroll lock', async ({ page }) => {
      await external(page, 'app.modal.set(true)');
      await expect(page.locator('.acceptance-modal .modal-dialog')).toBeVisible();
      await external(page, 'app.destroyRetainingModal()');
      await expect(page.locator('#overlay-acceptance .modal-dialog')).toHaveCount(0);
      await external(page, 'app.requestDestroyedModal()');
      await expect(page.locator('body')).not.toHaveClass(/no-scrolling/);
      await expect(page.locator('#overlay-acceptance .modal-dialog')).toHaveCount(0);
      await page.getByTestId('outside-focus').click();
      await expect(page.getByTestId('outside-focus')).toBeFocused();
    });

    test('destroying open overlays removes panels and releases scroll locks without stale callbacks', async ({
      page,
    }) => {
      await external(page, 'app.modal.set(true); app.panel.set(true)');
      await expect(page.locator('clr-side-panel .modal-dialog')).toBeVisible();
      await expect(page.locator('body')).toHaveClass(/no-scrolling/);
      await external(page, 'app.mounted.set(false)');
      await expect(page.locator('#overlay-acceptance .modal-dialog')).toHaveCount(0);
      await expect(page.locator('body')).not.toHaveClass(/no-scrolling/);
      await page.keyboard.press('Escape');
      await page.getByTestId('outside-focus').click();
      await expect(page.getByTestId('outside-focus')).toBeFocused();
    });
  });
}
