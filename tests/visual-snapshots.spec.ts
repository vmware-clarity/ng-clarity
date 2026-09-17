/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, test } from '@playwright/test';
import { StoryIndex, StoryIndexV3 } from '@storybook/types';
import * as fs from 'fs';
import * as path from 'path';

import { density, matrixKey, screenshotExpectOptions, screenshotPathFor, theme } from './helpers/vrt';
import { screenshotOptions } from './screenshot-options';

const usedScreenshotPaths: string[] = [];
const indexFilePath = path.join('.', 'dist', 'docs', 'index.json');

const index = JSON.parse(fs.readFileSync(indexFilePath).toString());

const stories: any[] = Object.values(convertToIndexV3(index).stories);

for (const story of stories) {
  const component = story.kind.split('/')[0];
  const storyId = story.id;
  const componentParsed = component.replaceAll(' ', '-').replaceAll('/', '-').toLowerCase();
  const storyName = storyId.replace(`${componentParsed}-`, '');
  // Component-level options apply to all of the component's stories; a story-level entry
  // fills in what the component entry doesn't set.
  const options = { ...screenshotOptions[storyName], ...screenshotOptions[componentParsed] };
  if (story.id.endsWith('--docs') || !component || options.exclude) {
    continue;
  }

  const screenshotPath = screenshotPathFor(componentParsed, storyName);
  usedScreenshotPaths.push(screenshotPath);

  test(screenshotPath, async ({ page }) => {
    const storyParams = new URLSearchParams({
      id: storyId,
      args: 'highlight:false',
      globals: `theme:${theme};density:${density}`,
      viewMode: 'story',
    });

    if (options.viewport) {
      await page.setViewportSize(options.viewport);
    }

    await page.goto(`http://localhost:8080/iframe.html?${storyParams}`);

    for (const selector of options.waitForSelectors ?? []) {
      await page.locator(selector).waitFor();
    }

    const fullPage = options.fullPageScreenshot ?? false;
    const screenshotTarget = fullPage ? page : page.locator('body');

    await expect(screenshotTarget).toHaveScreenshot(screenshotPath.split(path.sep), {
      fullPage,
      ...screenshotExpectOptions,
      mask: (options.maskSelectors ?? []).map(selector => page.locator(selector)),
    });
  });
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
