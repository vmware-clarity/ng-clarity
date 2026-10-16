/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, test } from '@playwright/test';

import { density, theme } from './helpers/vrt';

test('combobox renders initial and keyboard focus', async ({ page }) => {
  const params = new URLSearchParams({
    id: 'components-forms-combobox--opened',
    globals: `theme:${theme};density:${density}`,
    viewMode: 'story',
  });
  await page.goto(`http://localhost:8080/iframe.html?${params}`);

  const input = page.getByRole('combobox');
  const selectedOption = page.getByRole('option', { name: 'Americium Selected', exact: true });
  await expect(selectedOption).toHaveClass(/clr-focus/);
  await expect(input).toHaveAttribute('aria-activedescendant', await selectedOption.getAttribute('id'));

  await input.press('ArrowDown');
  const nextOption = page.getByRole('option', { name: 'Antimony', exact: true });
  await expect(nextOption).toHaveClass(/clr-focus/);
  await expect(selectedOption).not.toHaveClass(/clr-focus/);
  await expect(input).toHaveAttribute('aria-activedescendant', await nextOption.getAttribute('id'));
});
