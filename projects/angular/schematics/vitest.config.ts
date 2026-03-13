/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: 'projects/angular/schematics',
    include: ['**/*.spec.ts'],
    globals: true,
  },
});
