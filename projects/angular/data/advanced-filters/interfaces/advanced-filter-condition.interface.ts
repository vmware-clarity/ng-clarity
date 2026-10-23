/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAdvancedFilterOperator } from '../enums/advanced-filter-operator.enum';

/**
 * The value of a condition. Its shape depends on the operator:
 * - IS_EMPTY: no value (`undefined`);
 * - BETWEEN: `[from, to]`, both bounds inclusive;
 * - IN: a non-empty array of option values;
 * - every other operator: one string, number or boolean.
 *
 * Per field type:
 * - number: finite numbers.
 * - date: epoch millisecond timestamps. A picked day is its local midnight; the `to` of a range is the end of the last
 *   picked day (23:59:59.999 local time).
 * - string: the text entered.
 * - boolean: `true` or `false`, with EQUALS.
 * - enum: the `value` of options.
 */
export type ClrAdvancedFilterValue = string | number | boolean | readonly (string | number)[];

/**
 * The field key, operator and value of a filter, as plain data: what `ClrAdvancedFilterValidator.validate()` checks.
 * It is also the shape of an editor draft, which may be incomplete.
 */
export interface ClrAdvancedFilterCondition {
  /**
   * The `key` of the field definition the condition refers to.
   */
  readonly field: string;
  readonly operator: ClrAdvancedFilterOperator;
  /**
   * See `ClrAdvancedFilterValue` for the shape per operator and field type.
   */
  readonly value?: ClrAdvancedFilterValue;
}
