/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, test } from '@playwright/test';
import { StoryIndex, StoryIndexV3 } from '@storybook/types';
import * as fs from 'fs';
import * as path from 'path';

import { screenshotOptions } from './screenshot-options';

const browser = process.env['CLARITY_VRT_BROWSER'];
const theme = process.env['CLARITY_VRT_THEME'];
const density = process.env['CLARITY_VRT_DENSITY'];
const matrixKey = `${browser}-${theme}-${density}`;

const usedScreenshotPaths: string[] = [];
const indexFilePath = path.join('.', 'dist', 'docs', 'index.json');

const index = JSON.parse(fs.readFileSync(indexFilePath).toString());

const stories: any[] = Object.values(convertToIndexV3(index).stories);

for (const story of stories) {
  const component = story.kind.split('/')[0];
  const storyId = story.id;
  const componentParsed = component.replaceAll(' ', '-').replaceAll('/', '-').toLowerCase();
  const storyName = storyId.replace(`${componentParsed}-`, '');
  if (story.id.endsWith('--docs') || !component) {
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

function takeFullPageScreenshot(component: string, storyName: string) {
  return screenshotOptions[component]?.fullPageScreenshot || screenshotOptions[storyName]?.fullPageScreenshot;
}

function getPageViewPort(component: string, storyName: string) {
  return screenshotOptions[component]?.viewport || screenshotOptions[storyName]?.viewport;
}

function convertToIndexV3(index: StoryIndex): StoryIndexV3 {
  const { entries } = index;
  const stories = Object.entries(entries).reduce(
    (acc, [id, entry]) => {
      const { type, ...rest } = entry;
      acc[id] = {
        ...rest,
        kind: rest.title,
        story: rest.name,
        parameters: {
          __id: rest.id,
          docsOnly: type === 'docs',
          fileName: rest.importPath,
        },
      };
      return acc;
    },
    {} as StoryIndexV3['stories']
  );
  return {
    v: 3,
    stories,
  };
}

const usedScreenshotsFilePath = path.join('.', 'tests', 'snapshots', `used-screenshot-paths-${matrixKey}.txt`);
fs.writeFileSync(usedScreenshotsFilePath, usedScreenshotPaths.join('\n'));
