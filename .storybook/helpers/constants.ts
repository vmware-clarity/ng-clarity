/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export const DENSITY = {
  // Review: the value stays 'default' because the VRT matrix (CLARITY_VRT_DENSITY in pr-build.yml) and the
  // snapshot file names use it. Renaming it to 'regular' means renaming those too.
  REGULAR: 'default',
  COMPACT: 'compact',
} as const;
