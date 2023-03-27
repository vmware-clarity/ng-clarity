/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import * as fs from 'fs';
import { globSync } from 'glob';
import * as path from 'path';

export function handleUnusedScreenshots(usedScreenshotPaths: string[]) {
  // Don't do anything in worker threads.
  if (process.argv[0].endsWith('process.js')) {
    return;
  }

  const snapshotsRootPath = './tests/snapshots';

  const unusedScreenshotPaths = globSync(`${snapshotsRootPath}/**/*.png`)
    .map(screenshotPath => path.relative(snapshotsRootPath, screenshotPath))
    .filter(screenshotPath => !usedScreenshotPaths.includes(screenshotPath));

  if (unusedScreenshotPaths.length) {
    if (process.argv.includes('--update-snapshots')) {
      for (const screenshotPath of unusedScreenshotPaths) {
        fs.unlinkSync(path.resolve(snapshotsRootPath, screenshotPath));
      }
    } else {
      throw new Error(`unused screenshots: ${unusedScreenshotPaths.join()}`);
    }
  }
}
