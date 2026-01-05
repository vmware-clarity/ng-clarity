/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Supported zoom levels are 200% and 400% with breakpoints based on
// Bootstrap responsive breakpoints:
// https://getbootstrap.com/docs/4.5/layout/overview/
// The mapping between zoom levels and Bootstrap breakpoints is:
// 400% = Bootstrap XS - <576px
// 200% = Bootstrap SM | MD | L - ≥576px
// none (no-zoom) = Bootstrap XL - ≥1200px

export enum ZoomLevel {
  x2 = 'zoom2x',
  x4 = 'zoom4x',
  none = 'no-zoom',
}

export const zoomBreakpoints = [
  {
    zoomLevel: ZoomLevel.x4,
    maxWidth: 575,
  },
  {
    zoomLevel: ZoomLevel.x2,
    maxWidth: 1199,
  },
  {
    zoomLevel: ZoomLevel.none,
    maxWidth: Number.MAX_VALUE,
  },
];
