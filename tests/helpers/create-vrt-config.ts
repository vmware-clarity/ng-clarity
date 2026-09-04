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
 * Shared configuration for the visual regression test suites (Storybook and website).
 * See https://playwright.dev/docs/test-configuration.
 */
export function createVrtConfig(options: {
  testDir: string;
  testIgnore?: string;
  /** Per-test timeout in milliseconds. */
  timeout: number;
  /** Timeout for expect() assertions (including screenshot stabilization) in milliseconds. */
  expectTimeout: number;
  webServerCommand: string;
  webServerPort: number;
}) {
  return defineConfig({
    testDir: options.testDir,
    testIgnore: options.testIgnore,
    snapshotPathTemplate: './tests/snapshots/{arg}{ext}',
    timeout: options.timeout,
    expect: {
      timeout: options.expectTimeout,
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
      command: options.webServerCommand,
      port: options.webServerPort,
    },
  });
}
