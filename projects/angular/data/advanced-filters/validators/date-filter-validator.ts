/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAdvancedFilterValidator } from './advanced-filter-validator';
import { ClrAdvancedFilterFieldType } from '../enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterOperator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError } from '../enums/advanced-filter-validation-error.enum';

/**
 * The rules of DATE fields: the date operators, epoch millisecond timestamps that a `Date` can represent, and ranges
 * with `from <= to` (inclusive, so a single day is valid).
 */
export class ClrDateFilterValidator extends ClrAdvancedFilterValidator {
  protected override readonly fieldType = ClrAdvancedFilterFieldType.DATE;

  protected override validateSingle(
    _operator: ClrAdvancedFilterOperator,
    value: unknown
  ): ClrAdvancedFilterValidationError | null {
    if (this.isMissing(value)) {
      return ClrAdvancedFilterValidationError.REQUIRED;
    }
    return this.isTimestamp(value) ? null : ClrAdvancedFilterValidationError.INVALID_DATE;
  }

  protected override validateRange(value: unknown): ClrAdvancedFilterValidationError | null {
    if (!this.isRange(value)) {
      return ClrAdvancedFilterValidationError.REQUIRED;
    }
    const [from, to] = value;
    if (!this.isTimestamp(from) || !this.isTimestamp(to)) {
      return ClrAdvancedFilterValidationError.INVALID_DATE;
    }
    return from <= to ? null : ClrAdvancedFilterValidationError.INVALID_RANGE;
  }
}
