/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import * as fs from 'fs';
import { globSync } from 'glob';
import * as path from 'path';

const snapshotsRootPath = './tests/snapshots';

const usedScreenshotPaths = getUsedScreenshotPaths();
const screenshotPaths = globSync(`${snapshotsRootPath}/**/*.png`);

for (const screenshotPath of screenshotPaths) {
  const relativeScreenshotPath = path.relative(snapshotsRootPath, screenshotPath);

  if (!usedScreenshotPaths.includes(relativeScreenshotPath)) {
    fs.unlinkSync(screenshotPath);
  }
}

function getUsedScreenshotPaths() {
  const usedScreenshotPaths = [];

  for (const filePath of globSync(`${snapshotsRootPath}/used-screenshot-paths-*.txt`)) {
    usedScreenshotPaths.push(...fs.readFileSync(filePath).toString().split('\n'));
    fs.unlinkSync(filePath);
  }

  return usedScreenshotPaths;
}
