/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * How a group combines its direct children. The logic belongs to the group, so AND and OR never mix on one level:
 * that takes a nested group. A new group, and the empty filter, use AND.
 */
export enum ClrAdvancedFilterLogic {
  AND = 'and',
  OR = 'or',
}
