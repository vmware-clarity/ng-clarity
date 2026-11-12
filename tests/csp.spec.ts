/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, test } from '@playwright/test';

import { addStyleWithNonce } from './helpers/vrt';

// The snapshots only show what breaks under the test server's Content-Security-Policy while the policy is enforced.
test('the test server enforces its Content-Security-Policy', async ({ page }) => {
  const response = await page.goto('http://localhost:8080/iframe.html');
  expect(response?.headers()['content-security-policy']).toMatch(/style-src 'self' 'nonce-[^']+'/);

  // A <style> and a <script> without the nonce do not apply.
  const applied = await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = 'body { --csp-check: style; }';
    document.head.append(style);
    const script = document.createElement('script');
    script.textContent = 'document.body.dataset.cspCheck = "script";';
    document.head.append(script);
    return [getComputedStyle(document.body).getPropertyValue('--csp-check'), document.body.dataset['cspCheck']];
  });
  expect(applied).toEqual(['', undefined]);

  await addStyleWithNonce(page, 'body { --csp-check: nonce; }');
  expect(await page.evaluate(() => getComputedStyle(document.body).getPropertyValue('--csp-check'))).toBe('nonce');
});
