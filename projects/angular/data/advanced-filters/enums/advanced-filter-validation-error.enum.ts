/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Why `ClrAdvancedFilterValidator.validate()` rejects a condition. The UI maps each one to a message.
 */
export enum ClrAdvancedFilterValidationError {
  /**
   * The field type does not offer the operator, or the operator or the type is unknown.
   */
  UNSUPPORTED_OPERATOR = 'unsupportedOperator',
  /**
   * The field key is missing or empty, a single value or a bound of a range is missing or blank, or the value does not
   * have the shape the operator needs (IS_EMPTY takes no value at all).
   */
  REQUIRED = 'required',
  /**
   * Not a finite number, for a number field.
   */
  INVALID_NUMBER = 'invalidNumber',
  /**
   * Not a timestamp that a `Date` can represent, for a date field.
   */
  INVALID_DATE = 'invalidDate',
  /**
   * `from` is after `to`.
   */
  INVALID_RANGE = 'invalidRange',
  /**
   * A set lists the same value twice. Values are compared as they are: `1` and `'1'`, or `'a'` and `'A'`, differ.
   */
  DUPLICATE_VALUE = 'duplicateValue',
}
