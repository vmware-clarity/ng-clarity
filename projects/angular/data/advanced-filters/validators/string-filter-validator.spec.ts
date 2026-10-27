/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrStringFilterValidator } from './string-filter-validator';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError as Code } from '../enums/advanced-filter-validation-error.enum';
import { ClrAdvancedFilterCondition } from '../interfaces/advanced-filter-condition.interface';

describe('ClrStringFilterValidator', () => {
  const validator = new ClrStringFilterValidator();
  const validate = (operator: Operator, value?: unknown) =>
    validator.validate({ field: 'name', operator, value } as ClrAdvancedFilterCondition);

  it('accepts only the string operators', () => {
    expect(validate(Operator.STARTS_WITH, 'a')).toBeNull();
    expect(validate(Operator.LESS_THAN, 'a')).toBe(Code.UNSUPPORTED_OPERATOR);
    expect(validate(Operator.IN, ['a'])).toBe(Code.UNSUPPORTED_OPERATOR);
  });

  it('requires a non-blank string', () => {
    expect(validate(Operator.CONTAINS, 'fds')).toBeNull();
    expect(validate(Operator.CONTAINS, ' fds ')).toBeNull();
    expect(validate(Operator.CONTAINS)).toBe(Code.REQUIRED);
    expect(validate(Operator.CONTAINS, null)).toBe(Code.REQUIRED);
    expect(validate(Operator.CONTAINS, '')).toBe(Code.REQUIRED);
    expect(validate(Operator.CONTAINS, '   ')).toBe(Code.REQUIRED);
    expect(validate(Operator.CONTAINS, 42)).toBe(Code.REQUIRED);
  });

  it('accepts IS_EMPTY without a value', () => {
    expect(validate(Operator.IS_EMPTY)).toBeNull();
  });
});
