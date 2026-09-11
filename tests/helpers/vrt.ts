/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export const browser = process.env['CLARITY_VRT_BROWSER'];
export const theme = process.env['CLARITY_VRT_THEME'];
export const density = process.env['CLARITY_VRT_DENSITY'];
export const shard = process.env['CLARITY_VRT_SHARD'];

// The used-screenshot-paths file only needs to be unique per CI job; shard is appended so
// parallel shards of the same browser/theme/density combo don't write the same filename.
export const matrixKey = shard ? `${browser}-${theme}-${density}-${shard}` : `${browser}-${theme}-${density}`;

/** Options passed to every toHaveScreenshot() assertion in the visual regression suites. */
export const screenshotExpectOptions = {
  animations: 'disabled',
  caret: 'hide',
  threshold: 0.01,
} as const;
