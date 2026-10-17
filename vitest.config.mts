/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { defineConfig } from 'vitest/config';

const seed = Number(process.env['VITEST_SEED'] ?? Date.now());

export default defineConfig({
  test: {
    restoreMocks: true,
    browser: { screenshotFailures: false },
    slowTestThreshold: 250,
    sequence: { shuffle: true, seed },
    // Run browser files sequentially so focus tests do not compete between iframes.
    fileParallelism: false,
    isolate: true,
  },
});
