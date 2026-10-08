/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';

import { browser } from './tests/helpers/vrt';

const storybookServer = {
  command: 'npm run ts-node -- ./scripts/start-static-server.ts ./dist/docs 8080',
  port: 8080,
};

/**
 * The visual regression test suites, selected with CLARITY_VRT_SUITE (`storybook` by default).
 */
const suites: Record<string, PlaywrightTestConfig> = {
  // The Storybook stories.
  storybook: {
    testDir: './tests',
    testIgnore: '**/{website,animations}/**',
    timeout: 30 * 1000,
    expect: { timeout: 5000 },
    webServer: storybookServer,
  },
  // The pages of the website (projects/website).
  website: {
    testDir: './tests/website',
    // Each test captures full-page screenshots of every tab of a documentation page, including
    // section subpages (the datagrid code tab alone has over twenty), which takes minutes
    // rather than the seconds a story screenshot takes.
    timeout: 600 * 1000,
    expect: { timeout: 10000 },
    webServer: {
      command: 'npm run ts-node -- ./scripts/start-static-server.ts ./dist/website 8081 --spa',
      port: 8081,
    },
  },
  // Frames of the component animations, in chromium only (see tests/animations/README.md).
  animations: {
    testDir: './tests/animations',
    // A component takes about 10 seconds, and twice that when its frames change: each changed frame is captured again
    // until stable.
    timeout: 60 * 1000,
    expect: { timeout: 5000 },
    webServer: storybookServer,
  },
};

const suiteName = process.env['CLARITY_VRT_SUITE'] || 'storybook';
const suite = suites[suiteName];
if (!suite) {
  throw new Error(`Unknown CLARITY_VRT_SUITE "${suiteName}": use ${Object.keys(suites).join(', ')}.`);
}

const deviceMap = {
  chromium: { ...devices['Desktop Chrome'], channel: 'chromium' },
  firefox: {
    ...devices['Desktop Firefox'],
    launchOptions: {
      firefoxUserPrefs: {
        // Firefox shares :visited state across browser contexts, so a link's color would
        // depend on which pages the other tests in the run had already visited.
        'layout.css.visited_links_enabled': false,
      },
    },
  },
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...suite,
  snapshotPathTemplate: './tests/snapshots/{arg}{ext}',
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
});
