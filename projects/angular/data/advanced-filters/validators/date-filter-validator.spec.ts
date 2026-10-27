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

  it('accepts only the date operators', () => {
    expect(validate(Operator.BEFORE, '2026-10-21')).toBeNull();
    expect(validate(Operator.LESS_THAN, '2026-10-21')).toBe(Code.UNSUPPORTED_OPERATOR);
  });

  it('requires an ISO date without a time of day', () => {
    expect(validate(Operator.AFTER, '2026-10-21')).toBeNull();
    expect(validate(Operator.AFTER)).toBe(Code.REQUIRED);
    expect(validate(Operator.AFTER, '')).toBe(Code.REQUIRED);
    [
      '2026-10-21T00:00:00.000Z',
      '2026-1-21',
      '21.10.2026',
      '10/21/2026',
      new Date(2026, 9, 21).getTime(),
      new Date(2026, 9, 21),
      'tomorrow',
    ].forEach(value => expect(validate(Operator.AFTER, value)).withContext(String(value)).toBe(Code.INVALID_DATE));
  });

  it('requires a day that exists', () => {
    expect(validate(Operator.AFTER, '2028-02-29')).toBeNull();
    expect(validate(Operator.AFTER, '2026-02-29')).toBe(Code.INVALID_DATE);
    expect(validate(Operator.AFTER, '2026-13-01')).toBe(Code.INVALID_DATE);
    expect(validate(Operator.AFTER, '2026-10-32')).toBe(Code.INVALID_DATE);
  });

  it('accepts an inclusive range, also a single day', () => {
    expect(validate(Operator.BETWEEN, ['2026-10-01', '2026-10-21'])).toBeNull();
    expect(validate(Operator.BETWEEN, ['2026-10-21', '2026-10-21'])).toBeNull();
  });

  it('rejects a range that ends before it starts, and bounds that are no dates', () => {
    expect(validate(Operator.BETWEEN, ['2026-10-21', '2026-10-01'])).toBe(Code.INVALID_RANGE);
    expect(validate(Operator.BETWEEN, ['2025-12-31', '2026-01-01'])).toBeNull();
    expect(validate(Operator.BETWEEN, ['2026-10-21', 'tomorrow'])).toBe(Code.INVALID_DATE);
    expect(validate(Operator.BETWEEN, '2026-10-21')).toBe(Code.REQUIRED);
  });
});
