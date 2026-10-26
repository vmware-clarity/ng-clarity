/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCommonStrings } from '@clr/angular/utils';

import { DATE_TIME_OPERATORS } from './date-time-operators';
import { ClrAdvancedFilterOperator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError } from '../enums/advanced-filter-validation-error.enum';
import { AdvancedFilterOperatorDefinition } from '../interfaces/advanced-filter-operator-definition.interface';
import { ClrAdvancedFilterValidator } from '../validators/advanced-filter-validator';

/**
 * Largest distance from the epoch, in milliseconds, that a `Date` can represent.
 */
const MAX_TIMESTAMP = 8.64e15;

/**
 * Internal, parked until a DATE_TIME field type exists: the validator of a date and time field. Unlike a DATE field,
 * whose value names a day ("2026-10-20"), its value is an instant: an epoch millisecond timestamp that a `Date` can
 * represent. A range is `[from, to]` with `from <= to`, both included.
 *
 * It sets no `fieldType`, because DATE_TIME is not a `ClrAdvancedFilterFieldType` member yet; it brings its own
 * operators instead.
 */
export class ClrDateTimeFilterValidator extends ClrAdvancedFilterValidator {
  override getOperators(): ClrAdvancedFilterOperator[] {
    return DATE_TIME_OPERATORS.map(definition => definition.operator);
  }

  override getOperatorLabelKey(operator: ClrAdvancedFilterOperator): keyof ClrCommonStrings | undefined {
    return this.findOperator(operator)?.labelKey;
  }

  override getOperatorTextKey(operator: ClrAdvancedFilterOperator): keyof ClrCommonStrings | undefined {
    return this.findOperator(operator)?.textKey;
  }

  /**
   * An epoch millisecond timestamp that a `Date` can represent.
   */
  isTimestamp(value: unknown): value is number {
    return this.isFiniteNumber(value) && Math.abs(value) <= MAX_TIMESTAMP;
  }

  protected override supportsOperator(operator: ClrAdvancedFilterOperator): boolean {
    return !!this.findOperator(operator);
  }

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

  private findOperator(operator: ClrAdvancedFilterOperator): AdvancedFilterOperatorDefinition | undefined {
    return DATE_TIME_OPERATORS.find(definition => definition.operator === operator);
  }
}
