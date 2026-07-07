/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { StoryIndex, StoryIndexV3 } from '@storybook/types';
import * as fs from 'fs';
import * as path from 'path';

import { screenshotOptions } from '../screenshot-options';

const indexFilePath = path.join('.', 'dist', 'docs', 'index.json');

export function loadStories(): any[] {
  const index = JSON.parse(fs.readFileSync(indexFilePath).toString());
  return Object.values(convertToIndexV3(index).stories);
}

export function excludeTakingScreenshot(component: string, storyName: string): boolean | undefined {
  return screenshotOptions[component]?.exclude || screenshotOptions[storyName]?.exclude;
}

export function takeFullPageScreenshot(component: string, storyName: string): boolean | undefined {
  return screenshotOptions[component]?.fullPageScreenshot || screenshotOptions[storyName]?.fullPageScreenshot;
}

export function getPageViewPort(component: string, storyName: string): { width: number; height: number } | undefined {
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
  return { v: 3, stories };
}
