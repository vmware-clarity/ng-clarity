/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Page } from '@playwright/test';
import * as path from 'path';

export const browser = process.env['CLARITY_VRT_BROWSER'];
export const theme = process.env['CLARITY_VRT_THEME'];
export const density = process.env['CLARITY_VRT_DENSITY'];

const shard = process.env['CLARITY_VRT_SHARD'];

// The used-screenshot-paths file only needs to be unique per CI job; shard is appended so
// parallel shards of the same browser/theme/density combo don't write the same filename.
export const matrixKey = shard ? `${browser}-${theme}-${density}-${shard}` : `${browser}-${theme}-${density}`;

/** Options passed to every toHaveScreenshot() assertion in the visual regression suites. */
export const screenshotExpectOptions = {
  animations: 'disabled',
  caret: 'hide',
  threshold: 0.01,
} as const;

/**
 * The snapshot naming convention shared by the Storybook and website suites:
 * {browser}/{group}/{name}-{theme}-{density}.png, resolved against the snapshotPathTemplate in playwright.config.ts.
 */
export function screenshotPathFor(group: string, name: string) {
  return path.join(browser, group, `${name}-${theme}-${density}.png`);
}

/**
 * Adds a <style> element to the page. The test server serves the pages with a Content-Security-Policy that blocks
 * page.addStyleTag(), so the element carries the page's nonce, read from one of the page's own nonce'd elements.
 */
export async function addStyleWithNonce(page: Page, content: string) {
  await page.evaluate(css => {
    const style = document.createElement('style');
    style.nonce = document.querySelector<HTMLElement>('[nonce]')?.nonce ?? '';
    style.textContent = css;
    document.head.append(style);
  }, content);
}
