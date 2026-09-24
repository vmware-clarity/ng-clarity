/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { defineConfig, devices } from '@playwright/test';
import { execSync } from 'child_process';

/**
 * Records the animations of the Storybook stories (see `tests/animations/README.md`).
 * Unlike the visual regression tests, animations are left enabled and nothing is compared here:
 * `npm run animations:compare` compares two recordings.
 */

export const recordingsDir = 'dist/animation-recordings';

/** Name of the recording: `CLARITY_ANIMATIONS_LABEL`, or the current git branch. */
export const recordingsLabel = sanitize(process.env['CLARITY_ANIMATIONS_LABEL'] || currentBranch());

/** Storybook build to record: `CLARITY_STORYBOOK_DIR`, or the one built by `npm run _build:storybook`. */
const storybookDir = process.env['CLARITY_STORYBOOK_DIR'] || './dist/docs';
const port = Number(process.env['CLARITY_STORYBOOK_PORT'] || 8080);

export default defineConfig({
  testDir: './tests/animations',
  outputDir: `${recordingsDir}/test-results`,
  timeout: 60 * 1000,
  forbidOnly: true,
  // One test at a time, so that concurrent tests do not steal frames from the animations being recorded.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    ...devices['Desktop Chrome'],
    channel: 'chromium',
    baseURL: `http://localhost:${port}`,
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    actionTimeout: 10 * 1000,
    video: { mode: 'on', size: { width: 1280, height: 800 } },
  },
  webServer: {
    command: `npm run ts-node -- ./scripts/start-static-server.ts ${storybookDir} ${port}`,
    port,
    reuseExistingServer: false,
  },
});

function currentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return 'recording';
  }
}

function sanitize(label: string) {
  return label.replace(/[^\w.-]+/g, '-');
}
