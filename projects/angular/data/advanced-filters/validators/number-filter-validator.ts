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
 * The rules of NUMBER fields: the number operators, finite numbers, and ranges with `from <= to`.
 */
export class ClrNumberFilterValidator extends ClrAdvancedFilterValidator {
  protected override readonly fieldType = ClrAdvancedFilterFieldType.NUMBER;

  protected override validateSingle(
    _operator: ClrAdvancedFilterOperator,
    value: unknown
  ): ClrAdvancedFilterValidationError | null {
    if (this.isMissing(value)) {
      return ClrAdvancedFilterValidationError.REQUIRED;
    }
    return this.isFiniteNumber(value) ? null : ClrAdvancedFilterValidationError.INVALID_NUMBER;
  }

  protected override validateRange(value: unknown): ClrAdvancedFilterValidationError | null {
    if (!this.isRange(value)) {
      return ClrAdvancedFilterValidationError.REQUIRED;
    }
    const [from, to] = value;
    if (!this.isFiniteNumber(from) || !this.isFiniteNumber(to)) {
      return ClrAdvancedFilterValidationError.INVALID_NUMBER;
    }
    return from <= to ? null : ClrAdvancedFilterValidationError.INVALID_RANGE;
  }
}
