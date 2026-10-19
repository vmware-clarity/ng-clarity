/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expect, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import type { StoryIndex } from 'storybook/internal/types';

import { density, matrixKey, screenshotExpectOptions, screenshotPathFor, theme } from './helpers/vrt';
import { screenshotOptions } from './screenshot-options';

const usedScreenshotPaths: string[] = [];
const indexFilePath = path.join('.', 'dist', 'docs', 'index.json');

const index: StoryIndex = JSON.parse(fs.readFileSync(indexFilePath).toString());

const entries = Object.values(index.entries);

/**
 * Snapshot paths are derived from the story file's `importPath`, never from its `title`, so
 * retitling a story does not move or orphan its committed PNGs.
 *
 *   importPath: "./.storybook/stories/components/forms/datepicker/datepicker-opened.stories.ts"
 *   storyId:    "components-forms-datepicker-opened--month-view"
 *   group:      "components/forms/datepicker"            <- the directory
 *   storyName:  "datepicker-opened--month-view"          <- "<file>--<story>"
 *   snapshot:   "<browser>/components/forms/datepicker/datepicker-opened--month-view-<theme>-<density>.png"
 *
 * The file's base name is part of the story name because sibling story files routinely export
 * the same story names (`side-panel.stories.ts` and `side-panel-inline.stories.ts` share all of
 * theirs). Without it those stories would share a snapshot path, and the last one written would
 * silently replace the other's baseline; the duplicate check below guards against that.
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

const usedOptionKeys = new Set<string>();

/**
 * Merges every `screenshotOptions` entry that covers a story, from the broadest key to the most
 * specific, so a narrower key overrides a broader one. For `components/forms/datepicker/
 * datepicker-opened--month-view` the keys are `components`, `components/forms`,
 * `components/forms/datepicker`, `components/forms/datepicker/datepicker-opened` and the story key.
 */
function optionsFor(group: string, storyName: string) {
  const folders = group.split('/').map((_, index, parts) => parts.slice(0, index + 1).join('/'));
  const file = storyName.slice(0, storyName.indexOf('--'));
  const keys = [...folders, `${group}/${file}`, `${group}/${storyName}`].filter(key => key in screenshotOptions);
  keys.forEach(key => usedOptionKeys.add(key));
  return Object.assign({}, ...keys.map(key => screenshotOptions[key]));
}

const takenScreenshotPaths = new Map<string, string>();

for (const entry of entries) {
  const storyId = entry.id;
  const group = groupFor(entry.importPath);
  const storyName = storyNameFor(entry.importPath, storyId);
  const options = optionsFor(group, storyName);
  if (storyId.endsWith('--docs')) {
    continue;
  }
  // A story file placed directly in `.storybook/stories/` has no directory to name its snapshot
  // group. Skipping it would silently leave every story in it without a snapshot, so fail loudly.
  if (!group) {
    throw new Error(
      `Story "${storyId}" comes from "${entry.importPath}", which sits directly in .storybook/stories/. ` +
        `Move the story file into a directory so its stories get a snapshot group.`
    );
  }
  if (options.exclude) {
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

// A key that covers no story is a typo or a leftover from a moved story file, and its options
// would silently stop applying.
const unusedOptionKeys = Object.keys(screenshotOptions).filter(key => !usedOptionKeys.has(key));
if (unusedOptionKeys.length) {
  throw new Error(`tests/screenshot-options.ts has keys that match no story: ${unusedOptionKeys.join(', ')}`);
}

const usedScreenshotsFilePath = path.join('.', 'tests', 'snapshots', `used-screenshot-paths-${matrixKey}.txt`);
fs.writeFileSync(usedScreenshotsFilePath, usedScreenshotPaths.join('\n'));
