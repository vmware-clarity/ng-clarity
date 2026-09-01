/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { defineConfig, devices } from '@playwright/test';

const browser = process.env['CLARITY_VRT_BROWSER'];

const deviceMap = {
  chromium: { ...devices['Desktop Chrome'], channel: 'chromium' },
  firefox: { ...devices['Desktop Firefox'] },
};

/**
 * Visual regression tests for the website (projects/website).
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/website',
  snapshotPathTemplate: './tests/snapshots/{arg}{ext}',
  // Full-page screenshots of long documentation pages take longer than story screenshots.
  timeout: 60 * 1000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  forbidOnly: true,
  retries: 2,
  workers: '95%',
  reporter: 'html',
  projects: [
    {
      name: browser,
      use: {
        ...deviceMap[browser],
        serviceWorkers: 'block',
      },
    },
  ],
  webServer: {
    command: 'npm run ts-node -- ./scripts/start-website-server.ts',
    port: 8081,
  },
});
