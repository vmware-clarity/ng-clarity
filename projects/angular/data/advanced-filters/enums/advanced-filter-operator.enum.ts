/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * The operators a filter can use. Which ones a field offers, and in which order, depends on its type.
 *
 * The value a filter carries depends on the operator:
 * - IS_EMPTY: no value;
 * - BETWEEN: `[from, to]`, both bounds inclusive;
 * - IN: a non-empty array of option values;
 * - every other operator: a single value.
 *
 * Relative dates are not operators: they come from the presets of the date range picker (`rangeOptions`).
 * Later phases add members, for example NOT_IN for dynamic lists, so code that switches over operators should have a
 * default branch.
 */
export enum ClrAdvancedFilterOperator {
  CONTAINS = 'contains',
  NOT_CONTAINS = 'notContains',
  EQUALS = 'equals',
  NOT_EQUALS = 'notEquals',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
  IS_EMPTY = 'isEmpty',
  LESS_THAN = 'lessThan',
  LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
  GREATER_THAN = 'greaterThan',
  GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
  BETWEEN = 'between',
  BEFORE = 'before',
  BEFORE_OR_EQUAL = 'beforeOrEqual',
  AFTER = 'after',
  AFTER_OR_EQUAL = 'afterOrEqual',
  IN = 'in',
}
