/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Internal. The value editor of the filter popover, chosen by the field type and the operator.
 */
export enum AdvancedFilterValueEditor {
  /**
   * IS_EMPTY takes no value.
   */
  NONE = 'none',
  TEXT = 'text',
  NUMBER = 'number',
  NUMBER_RANGE = 'numberRange',
  BOOLEAN = 'boolean',
  DATE = 'date',
  DATE_RANGE = 'dateRange',
  /**
   * A checkbox list of the field's options.
   */
  SET = 'set',
}
