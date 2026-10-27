/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * How `clr-advanced-filters` shows the filter structure.
 */
export enum ClrAdvancedFilterLayout {
  /**
   * The whole structure as a tree: groups at any depth, up to `clrMaxDepth`. The default.
   */
  TREE = 'tree',
  /**
   * One pill per field, next to an Add filter button. The root is always AND and is not shown, and each pill is a
   * filter or a group of filters on its field, so the structure has two levels.
   */
  PILLS = 'pills',
}
