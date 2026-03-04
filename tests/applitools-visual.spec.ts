/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { test } from '@applitools/eyes-playwright/fixture';
import { StoryIndex, StoryIndexV3 } from '@storybook/types';
import * as fs from 'fs';
import * as path from 'path';

import { screenshotOptions } from './screenshot-options';

const variations = [
  { theme: 'light', density: 'default' },
  { theme: 'light', density: 'compact' },
  { theme: 'dark', density: 'default' },
  { theme: 'dark', density: 'compact' },
];

const indexFilePath = path.join('.', 'dist', 'docs', 'index.json');
const index = JSON.parse(fs.readFileSync(indexFilePath).toString());
const stories: any[] = Object.values(convertToIndexV3(index).stories);

for (const story of stories) {
  const component = story.kind.split('/')[0];
  const storyId = story.id;
  const componentParsed = component.replaceAll(' ', '-').replaceAll('/', '-').toLowerCase();
  const storyName = storyId.replace(`${componentParsed}-`, '');

  if (story.id.endsWith('--docs') || !component || isExcluded(componentParsed, storyName)) {
    continue;
  }

  for (const { theme, density } of variations) {
    const checkName = `${componentParsed}/${storyName} [${theme}/${density}]`;

    test(checkName, async ({ page, eyes }) => {
      const storyParams = new URLSearchParams({
        id: storyId,
        args: 'highlight:false',
        globals: `theme:${theme};density:${density}`,
        viewMode: 'story',
      });

      const viewport = getPageViewPort(componentParsed, storyName);
      if (viewport) {
        await page.setViewportSize(viewport);
      }

      await page.goto(`http://localhost:8080/iframe.html?${storyParams}`);

      const fullPage = shouldTakeFullPage(componentParsed, storyName);

      await eyes.check(checkName, {
        fully: fullPage,
        matchLevel: 'Strict',
        properties: [
          { name: 'theme', value: theme },
          { name: 'density', value: density },
          { name: 'component', value: componentParsed },
        ],
      });
    });
  }
}

function isExcluded(component: string, storyName: string) {
  return screenshotOptions[component]?.exclude || screenshotOptions[storyName]?.exclude;
}

function shouldTakeFullPage(component: string, storyName: string) {
  return screenshotOptions[component]?.fullPageScreenshot || screenshotOptions[storyName]?.fullPageScreenshot || false;
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
