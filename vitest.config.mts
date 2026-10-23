/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { defineConfig } from 'vitest/config';

const seedValue = process.env['VITEST_SEED'] ?? String(Date.now());
const seed = Number(seedValue);
if (seedValue.trim() === '' || !Number.isSafeInteger(seed) || seed < 0) {
  throw new Error('VITEST_SEED must be a non-negative safe integer.');
}

export default defineConfig({
  test: {
    restoreMocks: true,
    browser: { screenshotFailures: false },
    slowTestThreshold: 250,
    sequence: { shuffle: true, seed },
    // Run browser files sequentially so focus tests do not compete between iframes.
    fileParallelism: false,
    // Match Angular's shared browser environment; fixtures still tear down after every test.
    isolate: false,
  },
});
