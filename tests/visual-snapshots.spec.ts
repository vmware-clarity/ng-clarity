/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

import { excludeTakingScreenshot, getPageViewPort, loadStories, takeFullPageScreenshot } from './helpers/stories';

const browser = process.env['CLARITY_VRT_BROWSER'];
const theme = process.env['CLARITY_VRT_THEME'];
const density = process.env['CLARITY_VRT_DENSITY'];
const matrixKey = `${browser}-${theme}-${density}`;

const usedScreenshotPaths: string[] = [];

const stories: any[] = loadStories();

for (const story of stories) {
  const component = story.kind?.split('/')[0];
  const storyId = story.id;

  if (!component || story.id.endsWith('--docs')) {
    continue;
  }

  const componentParsed = component.replaceAll(' ', '-').replaceAll('/', '-').toLowerCase();
  const storyName = storyId.replace(`${componentParsed}-`, '');

  if (excludeTakingScreenshot(componentParsed, storyName)) {
    continue;
  }

  const screenshotPath = path.join(browser, componentParsed, `${storyName}-${theme}-${density}.png`);
  usedScreenshotPaths.push(screenshotPath);

  test(screenshotPath, async ({ page }) => {
    const storyParams = new URLSearchParams({
      id: storyId,
      args: 'highlight:false',
      globals: `theme:${theme};density:${density}`,
      viewMode: 'story',
    });

    const viewport = getPageViewPort(componentParsed, storyName);
    if (viewport) {
      page.setViewportSize(viewport);
    }

    await page.goto(`http://localhost:8080/iframe.html?${storyParams}`);

    const fullPage = takeFullPageScreenshot(componentParsed, storyName);
    const screenshotTarget = fullPage ? page : page.locator('body');

    await expect(screenshotTarget).toHaveScreenshot(screenshotPath.split(path.sep), {
      fullPage,
      animations: 'disabled',
      caret: 'hide',
      threshold: 0.01,
    });
  });
}

const usedScreenshotsFilePath = path.join('.', 'tests', 'snapshots', `used-screenshot-paths-${matrixKey}.txt`);
fs.writeFileSync(usedScreenshotsFilePath, usedScreenshotPaths.join('\n'));
