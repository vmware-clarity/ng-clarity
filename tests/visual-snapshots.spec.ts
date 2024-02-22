/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

import { THEMES } from '../.storybook/helpers/constants';
import { Story } from './helpers/story.interface';
import { ScreenshotOptions } from './screenshot-options';

const browser = process.env['CLARITY_VRT_BROWSER'];
const matrixKey = browser;

const usedScreenshotPaths: string[] = [];

const stories: Story[] = JSON.parse(fs.readFileSync('./dist/docs/stories.json').toString());

for (const { storyId, component } of stories) {
  if (storyId.endsWith('--default') || !component) {
    continue;
  }

  const storyName = storyId.replace(`${component}-`, '');

  for (const [themeKey, theme] of Object.entries(THEMES)) {
    const normalizedThemeKey = themeKey.toLowerCase().replace(/_/g, '-');

    const screenshotPath = path.join(matrixKey, component, `${storyName}-${normalizedThemeKey}.png`);
    usedScreenshotPaths.push(screenshotPath);

    test(screenshotPath, async ({ page }) => {
      const storyParams = new URLSearchParams({
        id: storyId,
        args: 'highlight:false',
        globals: `theme:${theme}`,
        viewMode: 'story',
      });

      await page.goto(`http://localhost:8080/iframe.html?${storyParams}`);

      const body = await page.locator('body');
      if (takeFullPageScreenshot(component, storyName)) {
        await body.evaluate(() => {
          document.body.style.setProperty('height', `${document.querySelector('html').scrollHeight}px`);
        });
      }

      await expect(body).toHaveScreenshot(screenshotPath.split(path.sep), {
        animations: 'disabled',
        caret: 'hide',
        threshold: 0,
      });
    });
  }
}

const takeFullPageScreenshot = (component, storyName) => {
  return ScreenshotOptions[component]?.fullPageScreenshot || ScreenshotOptions[storyName]?.fullPageScreenshot;
};

fs.writeFileSync(`./tests/snapshots/used-screenshot-paths-${matrixKey}.txt`, usedScreenshotPaths.join('\n'));
