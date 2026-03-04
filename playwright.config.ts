/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import 'dotenv/config';

import { EyesFixture } from '@applitools/eyes-playwright/fixture';
import { defineConfig } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<EyesFixture>({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  workers: '50%',
  reporter: [['html'], ['@applitools/eyes-playwright/reporter']],
  use: {
    eyesConfig: {
      appName: 'Clarity Design System',
      matchLevel: 'Strict',
      type: 'ufg',
      browsersInfo: [
        { name: 'chrome', width: 1920, height: 1080 },
        { name: 'firefox', width: 1920, height: 1080 },
      ],
      batch: { name: 'Clarity VRT' },
      failTestsOnDiff: 'afterAll',
    },
  },
  webServer: {
    command: 'npm run ts-node -- ./scripts/start-storybook-server.ts',
    port: 8080,
  },
});
