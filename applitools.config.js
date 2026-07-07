/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

module.exports = {
  apiKey: process.env['APPLITOOLS_API_KEY'],
  serverUrl: process.env['APPLITOOLS_SERVER_URL'],
  batch: {
    name: process.env['PR_NUMBER'] ? `PR #${process.env['PR_NUMBER']}` : 'Local Run',
    id: process.env['PR_NUMBER'],
  },
  browser: [
    { width: 1280, height: 800, name: 'chrome' },
    { width: 1280, height: 800, name: 'firefox' },
  ],
  layoutBreakpoints: { breakpoints: true, heightBreakpoints: true, reload: false },
  testConcurrency: 50,
  storybookUrl: process.env['STORYBOOK_URL'] || 'http://localhost:8080',
  puppeteerOptions: process.env['PUPPETEER_EXECUTABLE_PATH']
    ? { executablePath: process.env['PUPPETEER_EXECUTABLE_PATH'] }
    : undefined,
  include: ({ kind, name, parameters }) => {
    if (parameters?.docsOnly) {
      return false;
    }
    // Matches 'application--default' exclusion in tests/screenshot-options.ts
    const normalizedKind = kind?.split('/').pop()?.trim().toLowerCase().replaceAll(' ', '-');
    const normalizedName = name?.toLowerCase().replaceAll(' ', '-');
    if (`${normalizedKind}--${normalizedName}` === 'application--default') {
      return false;
    }
    return true;
  },
  // Run every story with all 4 theme/density combinations.
  // 'eyes-variation' appears in the Applitools dashboard test name; 'globals' applies the theme to the story.
  variations: [
    { queryParams: { 'eyes-variation': 'light-default', globals: 'theme:light;density:default' } },
    { queryParams: { 'eyes-variation': 'light-compact', globals: 'theme:light;density:compact' } },
    { queryParams: { 'eyes-variation': 'dark-default', globals: 'theme:dark;density:default' } },
    { queryParams: { 'eyes-variation': 'dark-compact', globals: 'theme:dark;density:compact' } },
  ],
};
