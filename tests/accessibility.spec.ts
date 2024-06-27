/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import * as fs from 'fs';

import { THEMES } from '../.storybook/helpers/constants';
import { Story } from './helpers/story.interface';

const stories: Story[] = JSON.parse(fs.readFileSync('./dist/docs/stories.json').toString());

for (const { storyId, component } of stories) {
  if (storyId.endsWith('--docs') || !component) {
    continue;
  }

  const storyName = storyId.replace(`${component}-`, '');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_themeKey, theme] of Object.entries(THEMES)) {
    test(`${storyName} ${theme} should not have any automatically detectable WCAG A or AA violations`, async ({
      page,
    }) => {
      const storyParams = new URLSearchParams({
        id: storyId,
        args: 'highlight:false',
        globals: `theme:${theme}`,
        viewMode: 'story',
      });
      await page.goto(`http://localhost:8080/iframe.html?${storyParams}`);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
}
