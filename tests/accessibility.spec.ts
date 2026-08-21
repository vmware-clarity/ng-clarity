/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

import { THEMES } from '../.storybook/helpers/constants';

const indexFilePath = path.join('.', 'dist', 'docs', 'index.json');
const index: any = JSON.parse(fs.readFileSync(indexFilePath).toString());
const stories: any[] = Object.values(flattenIndex(index));

for (const story of stories) {
  const component = story.kind.split('/')[0];
  const storyId = story.id;

  if (story.id.endsWith('--docs') || !component) {
    continue;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_themeKey, theme] of Object.entries(THEMES)) {
    test(`${storyId} (${theme}) - no WCAG A/AA violations`, async ({ page }, testInfo) => {
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

      await testInfo.attach('accessibility-scan-results', {
        body: JSON.stringify(accessibilityScanResults, null, 2),
        contentType: 'application/json',
      });

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
}

function flattenIndex(index: any): Record<string, any> {
  // Storybook v7+ uses `entries`; v6 used `stories` directly.
  const entries: Record<string, any> = index.entries ?? index.stories ?? {};
  return Object.fromEntries(
    Object.entries(entries).map(([id, entry]: [string, any]) => [
      id,
      { ...entry, kind: entry.title, story: entry.name },
    ])
  );
}
