/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrEnumFilterValidator } from './enum-filter-validator';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError as Code } from '../enums/advanced-filter-validation-error.enum';
import { ClrAdvancedFilterCondition } from '../interfaces/advanced-filter-condition.interface';

describe('ClrEnumFilterValidator', () => {
  const validator = new ClrEnumFilterValidator();
  const validate = (operator: Operator, value?: unknown) =>
    validator.validate({ field: 'status', operator, value } as ClrAdvancedFilterCondition);

  it('accepts only IN', () => {
    expect(validate(Operator.IN, ['running'])).toBeNull();
    expect(validate(Operator.EQUALS, 'running')).toBe(Code.UNSUPPORTED_OPERATOR);
  });

  it('requires at least one option value', () => {
    expect(validate(Operator.IN, ['running', 2])).toBeNull();
    expect(validate(Operator.IN, [])).toBe(Code.REQUIRED);
    expect(validate(Operator.IN)).toBe(Code.REQUIRED);
    expect(validate(Operator.IN, 'running')).toBe(Code.REQUIRED);
    expect(validate(Operator.IN, [{ value: 'running' }])).toBe(Code.REQUIRED);
    expect(validate(Operator.IN, [null])).toBe(Code.REQUIRED);
  });

  it('requires each option value once', () => {
    expect(validate(Operator.IN, ['running', 'running'])).toBe(Code.DUPLICATE_VALUE);
  });

  it('requires option values that survive JSON, so no NaN, Infinity or holes', () => {
    expect(validate(Operator.IN, [NaN])).toBe(Code.REQUIRED);
    expect(validate(Operator.IN, ['running', Infinity])).toBe(Code.REQUIRED);
    expect(validate(Operator.IN, [, 'running'])).toBe(Code.REQUIRED);
    expect(validate(Operator.IN, new Array(3))).toBe(Code.REQUIRED);
  });
});
