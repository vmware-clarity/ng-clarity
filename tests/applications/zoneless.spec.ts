/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, Page, test } from '@playwright/test';

async function openZoneless(page: Page, url: string) {
  await page.goto(url);
  await expect(page.locator('app-root, #storybook-root').first()).not.toBeEmpty();
  expect(await page.evaluate(() => typeof (window as Window & { Zone?: unknown }).Zone)).toBe('undefined');
}

let errors: string[];

test.beforeEach(async ({ page }) => {
  errors = [];
  page.on('console', message => {
    if (message.type() === 'error') {
      // Static Storybook does not ship a favicon; this browser-generated request is unrelated to application errors.
      if (
        message.location().url === 'http://localhost:8085/favicon.ico' &&
        message.text() === 'Failed to load resource: the server responded with a status of 404 (Not Found)'
      ) {
        return;
      }
      errors.push(message.text());
    }
  });
  page.on('pageerror', error => {
    errors.push(error.message);
  });
});

test.afterEach(() => expect(errors).toEqual([]));

test('demo: a timer completes loading without another user event', async ({ page }) => {
  await openZoneless(page, 'http://localhost:8082/demo/buttons/button-loading');
  const button = page.locator('clr-buttons-demo-button-loading button').first();
  await button.click();
  await expect(button.locator('.spinner')).toBeVisible();
  await expect(button).toBeEnabled();
  await expect(button.locator('.clr-loading-btn-content')).toHaveText('Validate');
});

test('demo: progress changes from a model timer', async ({ page }) => {
  await openZoneless(page, 'http://localhost:8082/demo/progress-bars/progress-bar-examples');
  const example = page.locator('.progbar-examples').first();
  await example.getByRole('button', { name: 'Show', exact: true }).click();
  await expect
    .poll(() => example.locator('progress').evaluate((el: HTMLProgressElement) => el.value))
    .toBeGreaterThan(0);
});

test('demo: lazy stack children render after the request completes', async ({ page }) => {
  await openZoneless(page, 'http://localhost:8082/demo/stack-view/angular-lazyload');
  await page.locator('clr-stack-block').first().locator('.stack-block-label').click();
  await expect(page.getByText('Sub-content 1', { exact: true })).toBeVisible();
});

test('website: loading button returns to its normal state', async ({ page }) => {
  await openZoneless(page, 'http://localhost:8083/documentation/button/code');
  const button = page.locator('clr-buttons-demo-button-loading button').first();
  await button.click();
  await expect(button.locator('.spinner')).toBeVisible();
  await expect(button).toBeEnabled();
  await expect(button.locator('.clr-loading-btn-content')).toHaveText('Validate');
});

test('website: a system theme change updates the toggle label', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await openZoneless(page, 'http://localhost:8083/');
  await expect(page.getByRole('button', { name: 'toggle to dark theme', exact: true })).toBeVisible();
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.getByRole('button', { name: 'toggle to light theme', exact: true })).toBeVisible();
});

test('Storybook: tabs work without loading Zone.js', async ({ page }) => {
  await openZoneless(page, 'http://localhost:8085/iframe.html?id=components-navigation-tabs--tabs&viewMode=story');
  const tabs = page.getByRole('tab');
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'false');
});

for (const [route, treeIndex] of [
  ['lazy-declarative', 1],
  ['lazy-recursive', 2],
] as const) {
  test(`demo: ${route} tree renders asynchronous children`, async ({ page }) => {
    await openZoneless(page, `http://localhost:8082/demo/tree-view/${route}`);
    const tree = page.locator('clr-tree').nth(treeIndex);
    await tree.locator('.clr-treenode-caret').first().click();
    await expect(tree.getByRole('treeitem', { name: '1.1 unselected', exact: true })).toBeVisible();
    await expect(tree.locator('.clr-treenode-spinner')).toHaveCount(0);
  });
}

test('demo: server-driven datagrid replaces its loading state with rows', async ({ page }) => {
  await openZoneless(page, 'http://localhost:8082/demo/datagrid/server-driven');
  const grid = page.locator('clr-datagrid');
  await expect(grid.locator('clr-dg-row')).toHaveCount(10);
  await expect(grid.locator('.datagrid-spinner')).toBeHidden();
  await grid.getByRole('button', { name: 'Name', exact: true }).click();
  await expect(grid.locator('.datagrid-spinner')).toBeVisible();
  await expect(grid.locator('.datagrid-spinner')).toBeHidden();
  await expect(grid.locator('clr-dg-row')).toHaveCount(10);
});

test('demo: advanced virtual scroll finishes resetting and refreshing', async ({ page }) => {
  await openZoneless(page, 'http://localhost:8082/demo/datagrid-advanced/virtual-scroll');
  const grid = page.locator('appfx-datagrid');
  await expect(grid).toBeVisible();
  await expect(grid.locator('clr-dg-row').first()).toBeVisible();
  await page.getByRole('button', { name: 'Refresh data', exact: true }).click();
  await expect(grid.locator('.datagrid-spinner')).toBeVisible();
  await expect(grid.locator('.datagrid-spinner')).toBeHidden();
  await expect(grid.locator('clr-dg-row').first()).toBeVisible();
});

test('demo: stepper changes its active step after the timer', async ({ page }) => {
  await openZoneless(page, 'http://localhost:8082/demo/stepper');
  await page.getByRole('button', { name: 'Change step on async response', exact: true }).click();
  const panel = page.locator('form[clrStepper]').last().locator('clr-stepper-panel').nth(1);
  await expect(panel.locator('.clr-stepper-header-button')).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toContainText('Opened');
});

test('demo: wizard async validation reports failure and then advances', async ({ page }) => {
  await openZoneless(page, 'http://localhost:8082/demo/wizard/async-validation');
  await page.getByRole('button', { name: 'Wizard with Async Validation', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(dialog.getByText('Your answer is incorrect.', { exact: true })).toBeVisible();
  await dialog.getByRole('textbox').fill('42');
  await dialog.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(
    dialog.getByText('Congratulations! Now you know the answer to life, the universe and everything!')
  ).toBeVisible();
});

test('demo: tree measurements finish after animation frames', async ({ page }) => {
  await openZoneless(page, 'http://localhost:8082/demo/tree-view/expand-all-performance');
  await expect(page.locator('table tbody tr')).toHaveCount(1);
  const expand = page.getByRole('button', { name: 'Expand all', exact: true });
  await expect(expand).toBeEnabled();
  await expand.click();
  await expect(page.locator('table tbody tr')).toHaveCount(2);
  await expect(expand).toBeEnabled();
});

test('website: resizing changes the table of contents scroll root and lets the title scroll on mobile', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const roots: boolean[] = [];
    Object.assign(window, { tocObserverRoots: roots });
    const NativeObserver = window.IntersectionObserver;
    window.IntersectionObserver = class extends NativeObserver {
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        super(callback, options);
        if (options?.root instanceof Element && options.root !== document.body) {
          roots.push(!!options.root.querySelector('.dox-header'));
        }
      }
    };
  });
  await page.setViewportSize({ width: 1200, height: 800 });
  await openZoneless(page, 'http://localhost:8083/documentation/button/code');
  await expect.poll(() => page.evaluate(() => (window as any).tocObserverRoots.at(-1))).toBe(false);
  await page.setViewportSize({ width: 500, height: 800 });
  // The resize observer must notify Angular before any click can incidentally render its new scrollParent input.
  await expect.poll(() => page.evaluate(() => (window as any).tocObserverRoots.at(-1))).toBe(true);
  const title = page.locator('.dox-header');
  const initialTop = await title.evaluate(element => element.getBoundingClientRect().y);
  await page.locator('app-table-of-contents a').last().click();
  await expect
    .poll(async () => await title.evaluate(element => element.getBoundingClientRect().y))
    .toBeLessThan(initialTop);
  await page.setViewportSize({ width: 1200, height: 800 });
  await expect.poll(() => page.evaluate(() => (window as any).tocObserverRoots.at(-1))).toBe(false);
});

test('website: API renderer code is highlighted without bootstrap timing', async ({ page }) => {
  await openZoneless(page, 'http://localhost:8083/documentation/advanced-datagrid/api');
  const example = page.locator('app-code-snippet').filter({ hasText: 'class DemoTextRendererComponent' });
  await expect(example.locator('.token.keyword').filter({ hasText: 'class' })).toBeVisible();
  await expect(example).toContainText('{{ displayText }} cell custom HTML');
});

for (const inline of [false, true]) {
  test(`demo: addon ${inline ? 'stepper' : 'wizard'} reports changing validation progress`, async ({ page }) => {
    if (inline) {
      await page.clock.install();
    }
    await openZoneless(page, 'http://localhost:8082/demo/wizard-addon');
    if (inline) {
      await page.getByLabel('Inline Wizard (Stepper)', { exact: true }).check();
    }
    await page.getByRole('button', { name: 'Open Workflow', exact: true }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    if (inline) {
      await expect(page.getByRole('button', { name: /2\. Virtual Machine Name/ })).toHaveAttribute(
        'aria-expanded',
        'true'
      );
      // StepperStateService debounces panel activation by 50 ms. Let it activate the page before validating it.
      await page.clock.runFor(50);
    }
    const activeStep = inline ? page.locator('.clr-stepper-panel-open') : page.getByRole('dialog');
    const name = activeStep.getByLabel('Virtual machine name:');
    await name.fill('Zoneless VM');
    await activeStep.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByText('Validating VM name: 0%', { exact: true })).toBeVisible();
    await expect(page.getByText('Validating VM name: 12%', { exact: true })).toBeVisible();
    await expect(page.getByText('Validating VM name: 24%', { exact: true })).toBeVisible();
  });
}
