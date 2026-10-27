/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrBooleanFilterValidator } from './boolean-filter-validator';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError as Code } from '../enums/advanced-filter-validation-error.enum';
import { ClrAdvancedFilterCondition } from '../interfaces/advanced-filter-condition.interface';

describe('ClrBooleanFilterValidator', () => {
  const validator = new ClrBooleanFilterValidator();
  const validate = (operator: Operator, value?: unknown) =>
    validator.validate({ field: 'backedUp', operator, value } as ClrAdvancedFilterCondition);

  it('accepts EQUALS with true or false', () => {
    expect(validate(Operator.EQUALS, true)).toBeNull();
    expect(validate(Operator.EQUALS, false)).toBeNull();
  });

  it('requires a real boolean', () => {
    [undefined, null, 'true', 1, 0, ''].forEach(value =>
      expect(validate(Operator.EQUALS, value))
        .withContext(JSON.stringify(value) ?? 'undefined')
        .toBe(Code.REQUIRED)
    );
  });

  it('rejects every other operator, and the removed isTrue / isFalse', () => {
    expect(validate(Operator.NOT_EQUALS, true)).toBe(Code.UNSUPPORTED_OPERATOR);
    expect(validate(Operator.IS_EMPTY)).toBe(Code.UNSUPPORTED_OPERATOR);
    expect(validate('isTrue' as Operator)).toBe(Code.UNSUPPORTED_OPERATOR);
    expect(validate('isFalse' as Operator)).toBe(Code.UNSUPPORTED_OPERATOR);
  });
});
