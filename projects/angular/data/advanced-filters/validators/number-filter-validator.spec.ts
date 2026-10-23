/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrNumberFilterValidator } from './number-filter-validator';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError as Code } from '../enums/advanced-filter-validation-error.enum';
import { ClrAdvancedFilterCondition } from '../interfaces/advanced-filter-condition.interface';

describe('ClrNumberFilterValidator', () => {
  const validator = new ClrNumberFilterValidator();
  const validate = (operator: Operator, value?: unknown) =>
    validator.validate({ field: 'cpu', operator, value } as ClrAdvancedFilterCondition);

  it('accepts only the number operators', () => {
    expect(validate(Operator.GREATER_THAN, 1)).toBeNull();
    expect(validate(Operator.CONTAINS, 'abc')).toBe(Code.UNSUPPORTED_OPERATOR);
    expect(validate(Operator.BEFORE, 1)).toBe(Code.UNSUPPORTED_OPERATOR);
  });

  it('requires a finite number', () => {
    expect(validate(Operator.GREATER_THAN, 60)).toBeNull();
    expect(validate(Operator.EQUALS, 0)).toBeNull();
    expect(validate(Operator.EQUALS, -0)).toBeNull();
    expect(validate(Operator.EQUALS, -1.5)).toBeNull();
    expect(validate(Operator.EQUALS)).toBe(Code.REQUIRED);
    expect(validate(Operator.EQUALS, null)).toBe(Code.REQUIRED);
    expect(validate(Operator.EQUALS, '')).toBe(Code.REQUIRED);
    expect(validate(Operator.EQUALS, '60')).toBe(Code.INVALID_NUMBER);
    expect(validate(Operator.EQUALS, true)).toBe(Code.INVALID_NUMBER);
    expect(validate(Operator.EQUALS, NaN)).toBe(Code.INVALID_NUMBER);
    expect(validate(Operator.EQUALS, Infinity)).toBe(Code.INVALID_NUMBER);
    expect(validate(Operator.EQUALS, -Infinity)).toBe(Code.INVALID_NUMBER);
  });

  it('requires an ordered range of two numbers, bounds included', () => {
    expect(validate(Operator.BETWEEN, [1, 10])).toBeNull();
    expect(validate(Operator.BETWEEN, [5, 5])).toBeNull();
    expect(validate(Operator.BETWEEN, [-0, 0])).toBeNull();
    expect(validate(Operator.BETWEEN, [10, 1])).toBe(Code.INVALID_RANGE);
    expect(validate(Operator.BETWEEN, [1])).toBe(Code.REQUIRED);
    expect(validate(Operator.BETWEEN, [1, 2, 3])).toBe(Code.REQUIRED);
    expect(validate(Operator.BETWEEN, [1, null])).toBe(Code.REQUIRED);
    expect(validate(Operator.BETWEEN, ['', 5])).toBe(Code.REQUIRED);
    expect(validate(Operator.BETWEEN, [, 5])).toBe(Code.REQUIRED);
    expect(validate(Operator.BETWEEN, 5)).toBe(Code.REQUIRED);
    expect(validate(Operator.BETWEEN, [1, '10'])).toBe(Code.INVALID_NUMBER);
    expect(validate(Operator.BETWEEN, [NaN, 5])).toBe(Code.INVALID_NUMBER);
    expect(validate(Operator.BETWEEN, [1, Infinity])).toBe(Code.INVALID_NUMBER);
  });

  it('accepts IS_EMPTY only without a value', () => {
    expect(validate(Operator.IS_EMPTY)).toBeNull();
    expect(validate(Operator.IS_EMPTY, 5)).toBe(Code.REQUIRED);
  });
});
