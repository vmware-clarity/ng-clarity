/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, test } from '@playwright/test';
import { StoryIndex } from '@storybook/types';
import * as fs from 'fs';
import * as path from 'path';

import { density, matrixKey, screenshotExpectOptions, screenshotPathFor, theme } from './helpers/vrt';
import { screenshotOptions } from './screenshot-options';

const usedScreenshotPaths: string[] = [];
const indexFilePath = path.join('.', 'dist', 'docs', 'index.json');

const index: StoryIndex = JSON.parse(fs.readFileSync(indexFilePath).toString());

const entries = Object.values(index.entries);

/**
 * Snapshot paths are derived from the story file's `importPath`, never from its `title`.
 * A title is a hand-typed string; the file path is not, so renaming or retitling a story
 * can no longer silently orphan 8 committed PNGs.
 *
 *   importPath: "./.storybook/stories/datepicker/datepicker-opened.stories.ts"
 *   storyId:    "datepicker-opened--month-view"
 *   group:      "datepicker"                         <- the directory
 *   storyName:  "datepicker-opened--month-view"      <- "<file>--<story>"
 *   snapshot:   "<browser>/datepicker/datepicker-opened--month-view-<theme>-<density>.png"
 *
 * The file's base name is part of the story name because a directory holds many story files
 * that routinely export the same story names (every `addons/*.stories.ts` exports `Default`,
 * `side-panel.stories.ts` and `side-panel-inline.stories.ts` export the same 17 names, ...).
 * Without it, 101 of the 561 stories would share a snapshot path with another story.
 */
function groupFor(importPath: string) {
  return path
    .dirname(importPath)
    .replace(/^\.\/?\.storybook\/stories\/?/, '')
    .replace(/\\/g, '/');
}

function storyNameFor(importPath: string, storyId: string) {
  const file = path.basename(importPath).replace(/\.stories\.[jt]sx?$/, '');
  // indexOf, not split('--'), so a story name that itself contains '--' is not truncated.
  const separator = storyId.indexOf('--');
  return `${file}--${storyId.slice(separator + 2)}`;
}

const takenScreenshotPaths = new Map<string, string>();

for (const entry of entries) {
  const storyId = entry.id;
  const group = groupFor(entry.importPath);
  const storyName = storyNameFor(entry.importPath, storyId);
  // Component-level options apply to all of the component's stories; a story-level entry
  // fills in what the component entry doesn't set.
  const options = { ...screenshotOptions[`${group}/${storyName}`], ...screenshotOptions[group] };
  if (storyId.endsWith('--docs') || !group || options.exclude) {
    continue;
  }

  const screenshotPath = screenshotPathFor(group, storyName);

  // Two stories sharing a snapshot path would overwrite each other under --update-snapshots and
  // leave one of them silently unverified. Fail loudly instead.
  const owner = takenScreenshotPaths.get(screenshotPath);
  if (owner) {
    throw new Error(
      `Duplicate snapshot path "${screenshotPath}" for stories "${owner}" and "${storyId}". ` +
        `Rename one of the story exports or move it to its own directory.`
    );
  }
  takenScreenshotPaths.set(screenshotPath, storyId);

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

const usedScreenshotsFilePath = path.join('.', 'tests', 'snapshots', `used-screenshot-paths-${matrixKey}.txt`);
fs.writeFileSync(usedScreenshotsFilePath, usedScreenshotPaths.join('\n'));
