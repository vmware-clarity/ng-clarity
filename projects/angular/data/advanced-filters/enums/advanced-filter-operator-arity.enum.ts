/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Internal. How many values an operator takes, which decides the value editor and the shape of the value.
 */
export enum AdvancedFilterOperatorArity {
  /**
   * IS_EMPTY.
   */
  NONE = 'none',
  /**
   * Every operator not listed in the other members.
   */
  SINGLE = 'single',
  /**
   * BETWEEN: `[from, to]`.
   */
  RANGE = 'range',
  /**
   * IN: a non-empty array.
   */
  SET = 'set',
}
