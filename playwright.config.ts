/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { createVrtConfig } from './tests/helpers/create-vrt-config';

/**
 * Visual regression tests for Storybook.
 */
export default createVrtConfig({
  testDir: './tests',
  // The website visual tests live in tests/website and run with playwright-website.config.ts.
  testIgnore: '**/website/**',
  timeout: 30 * 1000,
  expectTimeout: 5000,
  webServerCommand: 'npm run ts-node -- ./scripts/start-static-server.ts ./dist/docs 8080',
  webServerPort: 8080,
});
