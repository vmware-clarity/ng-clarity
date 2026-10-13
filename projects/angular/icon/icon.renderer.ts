/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { IconShapeCollection } from './interfaces/icon.interfaces';

// Every icon shape calls this at module level. esbuild (used by the Angular CLI) can't tell the call is pure and keeps
// every shape. The annotation lets it drop unused shapes. Rollup and webpack drop them without it.
// Keep it above `export`: the TypeScript build drops it when it sits between `export` and `function`.
/* @__NO_SIDE_EFFECTS__ */
export function renderIcon(shapeOrStringIcon: IconShapeCollection | string) {
  return shapeOrStringIcon;
}
