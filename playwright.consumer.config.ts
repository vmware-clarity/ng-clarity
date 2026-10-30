/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/consumer',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  workers: 2,
  timeout: 30000,
  reporter: 'list',
  outputDir: 'test-results/consumer',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://localhost:8084',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node --experimental-strip-types ./scripts/start-static-server.ts ./dist/consumer-smoke 8084',
    port: 8084,
  },
});
