/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

import { handleUnusedScreenshots } from './helpers/handle-unused-screenshots';
import { Story } from './helpers/story.interface';

const usedScreenshotPaths: string[] = [];

const stories: Story[] = JSON.parse(fs.readFileSync('./dist/docs/stories.json').toString());

for (const { storyId, component } of stories) {
  if (!storyId.includes('--variants')) {
    continue;
  }

  const storyName = storyId.replace(`${component}-`, '');

  const screenshotPath = path.join(component, `${storyName}.png`);
  usedScreenshotPaths.push(screenshotPath);

  test(screenshotPath, async ({ page }) => {
    const storyParams = new URLSearchParams({
      id: storyId,
      args: 'highlight:false',
      viewMode: 'story',
    });

    await page.goto(`http://localhost:8080/iframe.html?${storyParams}`);

    await expect(page).toHaveScreenshot(screenshotPath.split(path.sep), {
      animations: 'disabled',
      caret: 'hide',
      fullPage: true,
      threshold: 0,
    });
  });
}

handleUnusedScreenshots(usedScreenshotPaths);
