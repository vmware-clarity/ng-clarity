/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDateFilterValidator } from './date-filter-validator';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError as Code } from '../enums/advanced-filter-validation-error.enum';
import { ClrAdvancedFilterCondition } from '../interfaces/advanced-filter-condition.interface';

describe('ClrDateFilterValidator', () => {
  const validator = new ClrDateFilterValidator();
  const validate = (operator: Operator, value?: unknown) =>
    validator.validate({ field: 'created', operator, value } as ClrAdvancedFilterCondition);
  const day = new Date(2026, 9, 21).getTime();
  const endOfDay = new Date(2026, 9, 21, 23, 59, 59, 999).getTime();

  it('accepts only the date operators', () => {
    expect(validate(Operator.BEFORE, day)).toBeNull();
    expect(validate(Operator.LESS_THAN, day)).toBe(Code.UNSUPPORTED_OPERATOR);
  });

  it('requires an epoch millisecond timestamp', () => {
    expect(validate(Operator.AFTER, day)).toBeNull();
    expect(validate(Operator.AFTER)).toBe(Code.REQUIRED);
    expect(validate(Operator.AFTER, '2026-10-21')).toBe(Code.INVALID_DATE);
    expect(validate(Operator.AFTER, new Date(day))).toBe(Code.INVALID_DATE);
    expect(validate(Operator.AFTER, NaN)).toBe(Code.INVALID_DATE);
    expect(validate(Operator.AFTER, Infinity)).toBe(Code.INVALID_DATE);
  });

  it('requires a timestamp that a Date can represent', () => {
    expect(validate(Operator.AFTER, 8.64e15)).toBeNull();
    expect(validate(Operator.AFTER, -8.64e15)).toBeNull();
    expect(validate(Operator.AFTER, 8.64e15 + 1)).toBe(Code.INVALID_DATE);
    expect(validate(Operator.AFTER, -8.64e15 - 1)).toBe(Code.INVALID_DATE);
    expect(validate(Operator.BETWEEN, [day, 8.64e15 + 1])).toBe(Code.INVALID_DATE);
    expect(validate(Operator.BETWEEN, [-8.64e15 - 1, day])).toBe(Code.INVALID_DATE);
  });

  it('accepts an inclusive range, also within a single day or with equal bounds', () => {
    expect(validate(Operator.BETWEEN, [day, endOfDay])).toBeNull();
    expect(validate(Operator.BETWEEN, [day, day])).toBeNull();
  });

  it('rejects a range that ends before it starts', () => {
    expect(validate(Operator.BETWEEN, [endOfDay, day])).toBe(Code.INVALID_RANGE);
    expect(validate(Operator.BETWEEN, [day, 'tomorrow'])).toBe(Code.INVALID_DATE);
    expect(validate(Operator.BETWEEN, day)).toBe(Code.REQUIRED);
  });
});
