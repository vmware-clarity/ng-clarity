/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

import { DENSITY, THEMES } from '../.storybook/helpers/constants';
import { Story } from './helpers/story.interface';
import { ScreenshotOptions } from './screenshot-options';

const browser = process.env['CLARITY_VRT_BROWSER'];
const matrixKey = browser;

const usedScreenshotPaths: string[] = [];
const storiesFilePath = path.join('.', 'dist', 'docs', 'stories.json');

const stories: Story[] = JSON.parse(fs.readFileSync(storiesFilePath).toString());

for (const { storyId, component } of stories) {
  if (storyId.endsWith('--docs') || !component) {
    continue;
  }

  const storyName = storyId.replace(`${component}-`, '');

  for (const density of Object.values(DENSITY)) {
    for (const [themeKey, theme] of Object.entries(THEMES)) {
      const normalizedThemeKey = themeKey.toLowerCase().replace(/_/g, '-');

      const screenshotPath = path.join(matrixKey, component, `${storyName}-${normalizedThemeKey}-${density}.png`);
      usedScreenshotPaths.push(screenshotPath);

      test(screenshotPath, async ({ page }) => {
        const storyParams = new URLSearchParams({
          id: storyId,
          args: 'highlight:false',
          globals: `theme:${theme}`,
          viewMode: 'story',
        });
        const viewport = getPageViewPort(component, storyName);
        if (viewport) {
          page.setViewportSize(viewport);
        }

        await page.goto(`http://localhost:8080/iframe.html?${storyParams}`);

        const fullPage = takeFullPageScreenshot(component, storyName);
        const screenshotTarget = fullPage ? page : page.locator('body');

        await expect(screenshotTarget).toHaveScreenshot(screenshotPath.split(path.sep), {
          fullPage,
          animations: 'disabled',
          caret: 'hide',
          threshold: 0.01,
        });
      });
    }
  }
}

const takeFullPageScreenshot = (component, storyName) => {
  return ScreenshotOptions[component]?.fullPageScreenshot || ScreenshotOptions[storyName]?.fullPageScreenshot;
};

const getPageViewPort = (component, storyName) => {
  return ScreenshotOptions[component]?.viewport || ScreenshotOptions[storyName]?.viewport;
};

const unusedScreenshotsFilePath = path.join('.', 'tests', 'snapshots', `used-screenshot-paths-${matrixKey}.txt`);
fs.writeFileSync(unusedScreenshotsFilePath, usedScreenshotPaths.join('\n'));
