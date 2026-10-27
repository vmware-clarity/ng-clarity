/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AdvancedFilterIsoDate } from './advanced-filter-iso-date';
import { ClrAdvancedFilterValidator } from './advanced-filter-validator';
import { ClrAdvancedFilterFieldType } from '../enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterOperator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError } from '../enums/advanced-filter-validation-error.enum';

/**
 * The rules of DATE fields: the date operators, ISO dates without a time of day ("2026-10-20") of days that exist, and
 * ranges with `from <= to` (inclusive, so a single day is valid).
 */
export class ClrDateFilterValidator extends ClrAdvancedFilterValidator {
  protected override readonly fieldType = ClrAdvancedFilterFieldType.DATE;

  private readonly isoDate = new AdvancedFilterIsoDate();

  protected override validateSingle(
    _operator: ClrAdvancedFilterOperator,
    value: unknown
  ): ClrAdvancedFilterValidationError | null {
    if (this.isMissing(value)) {
      return ClrAdvancedFilterValidationError.REQUIRED;
    }
    return this.isoDate.isIsoDate(value) ? null : ClrAdvancedFilterValidationError.INVALID_DATE;
  }

  protected override validateRange(value: unknown): ClrAdvancedFilterValidationError | null {
    if (!this.isRange(value)) {
      return ClrAdvancedFilterValidationError.REQUIRED;
    }
    const [from, to] = value;
    if (!this.isoDate.isIsoDate(from) || !this.isoDate.isIsoDate(to)) {
      return ClrAdvancedFilterValidationError.INVALID_DATE;
    }
    // ISO dates sort as text in the order of the days.
    return from <= to ? null : ClrAdvancedFilterValidationError.INVALID_RANGE;
  }
}
