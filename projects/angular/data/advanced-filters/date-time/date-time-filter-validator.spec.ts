/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDateTimeFilterValidator } from './date-time-filter-validator';
import { ClrAdvancedFilterOperator as Operator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError as Code } from '../enums/advanced-filter-validation-error.enum';
import { ClrAdvancedFilterCondition } from '../interfaces/advanced-filter-condition.interface';
import { ClrAdvancedFilterValidator } from '../validators/advanced-filter-validator';

describe('ClrDateTimeFilterValidator (internal, parked)', () => {
  const validator = new ClrDateTimeFilterValidator();
  const validate = (operator: Operator, value?: unknown) =>
    validator.validate({ field: 'updated', operator, value } as ClrAdvancedFilterCondition);
  const morning = new Date(2026, 9, 21, 9, 30).getTime();
  const evening = new Date(2026, 9, 21, 18, 0).getTime();

  it('extends the base validator, so it keeps the shape rules', () => {
    expect(validator).toEqual(jasmine.any(ClrAdvancedFilterValidator));
    expect(validate(Operator.IS_EMPTY)).toBeNull();
    expect(validate(Operator.IS_EMPTY, morning)).toBe(Code.REQUIRED);
  });

  it('offers its own operators, in display order, with the date labels and texts', () => {
    expect(validator.getOperators()).toEqual([
      Operator.BEFORE,
      Operator.BEFORE_OR_EQUAL,
      Operator.AFTER,
      Operator.AFTER_OR_EQUAL,
      Operator.BETWEEN,
      Operator.IS_EMPTY,
    ]);
    expect(validator.getOperatorLabelKey(Operator.AFTER)).toBe('advancedFilterAfter');
    expect(validator.getOperatorTextKey(Operator.BETWEEN)).toBe('advancedFilterTextBetween');
    expect(validator.getOperatorLabelKey(Operator.EQUALS)).toBeUndefined();
    expect(validator.getOperatorTextKey(Operator.EQUALS)).toBeUndefined();
  });

  it('rejects the operators it does not offer', () => {
    [Operator.EQUALS, Operator.NOT_EQUALS, Operator.CONTAINS, Operator.IN].forEach(operator =>
      expect(validate(operator, morning)).withContext(operator).toBe(Code.UNSUPPORTED_OPERATOR)
    );
  });

  it('requires an epoch millisecond timestamp that a Date can represent', () => {
    expect(validate(Operator.AFTER, morning)).toBeNull();
    expect(validate(Operator.AFTER, 8.64e15)).toBeNull();
    expect(validate(Operator.AFTER, -8.64e15)).toBeNull();
    expect(validate(Operator.AFTER)).toBe(Code.REQUIRED);
    [8.64e15 + 1, NaN, Infinity, '2026-10-21', new Date(morning)].forEach(value =>
      expect(validate(Operator.AFTER, value)).withContext(String(value)).toBe(Code.INVALID_DATE)
    );
  });

  it('accepts an inclusive range of instants, also within one day or with equal bounds', () => {
    expect(validate(Operator.BETWEEN, [morning, evening])).toBeNull();
    expect(validate(Operator.BETWEEN, [morning, morning])).toBeNull();
    expect(validate(Operator.BETWEEN, [evening, morning])).toBe(Code.INVALID_RANGE);
    expect(validate(Operator.BETWEEN, [morning, '2026-10-21'])).toBe(Code.INVALID_DATE);
    expect(validate(Operator.BETWEEN, morning)).toBe(Code.REQUIRED);
  });
});
