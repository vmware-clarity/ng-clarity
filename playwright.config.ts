/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { defineConfig, devices } from '@playwright/test';

const browser = process.env['CLARITY_VRT_BROWSER'];

const deviceMap = {
  chromium: 'Desktop Chrome',
  firefox: 'Desktop Firefox',
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  snapshotPathTemplate: './tests/snapshots/{arg}{ext}',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: true,
  retries: 2,
  workers: 3,
  reporter: 'html',
  projects: [
    {
      name: browser,
      use: { ...devices[deviceMap[browser]] },
    },
  ],
  webServer: {
    command: 'npm run ts-node -- ./scripts/start-storybook-server.ts',
    port: 8080,
  },
});
