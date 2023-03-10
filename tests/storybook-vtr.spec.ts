/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, test } from '@playwright/test';
import * as fs from 'fs';

const storyIds: string[] = JSON.parse(fs.readFileSync('./dist/docs/stories.json').toString());

for (const storyId of storyIds) {
  if (storyId.endsWith('--page')) {
    continue;
  }

  test(`${storyId}`, async ({ page }) => {
    await page.goto(`http://localhost:8080/iframe.html?args=&id=${storyId}&viewMode=story`);

    await expect(page).toHaveScreenshot({
      fullPage: true,
    });
  });

  break;
}
