/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { createVrtConfig } from './tests/helpers/create-vrt-config';

/**
 * Visual regression tests for the website (projects/website).
 */
export default createVrtConfig({
  testDir: './tests/website',
  // Each test captures full-page screenshots of every tab of a documentation page, which
  // takes longer than a story screenshot.
  timeout: 120 * 1000,
  expectTimeout: 10000,
  webServerCommand: 'npm run ts-node -- ./scripts/start-static-server.ts ./dist/website 8081 --spa',
  webServerPort: 8081,
});
