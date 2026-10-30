/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/applications',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  workers: 3,
  timeout: 30000,
  expect: { timeout: 10000 },
  reporter: 'list',
  use: { ...devices['Desktop Chrome'], channel: 'chromium', trace: 'retain-on-failure' },
  webServer: [
    {
      command: 'node --experimental-strip-types scripts/start-static-server.ts dist/docs 8082 --spa=demo/index.html',
      port: 8082,
    },
    {
      command: 'node --experimental-strip-types scripts/start-static-server.ts dist/website 8083 --spa',
      port: 8083,
    },
    {
      command: 'node --experimental-strip-types scripts/start-static-server.ts dist/docs 8085',
      port: 8085,
    },
  ],
});
