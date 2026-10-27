/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AdvancedFilterValidatorBuilder } from './advanced-filter-validator-builder';
import { ClrBooleanFilterValidator } from './boolean-filter-validator';
import { ClrDateFilterValidator } from './date-filter-validator';
import { ClrEnumFilterValidator } from './enum-filter-validator';
import { ClrNumberFilterValidator } from './number-filter-validator';
import { ClrStringFilterValidator } from './string-filter-validator';
import { ClrAdvancedFilterFieldType as FieldType } from '../enums/advanced-filter-field-type.enum';

describe('AdvancedFilterValidatorBuilder', () => {
  const builder = new AdvancedFilterValidatorBuilder();

  it('builds the built-in validator of every field type', () => {
    expect(builder.build(FieldType.STRING)).toEqual(jasmine.any(ClrStringFilterValidator));
    expect(builder.build(FieldType.NUMBER)).toEqual(jasmine.any(ClrNumberFilterValidator));
    expect(builder.build(FieldType.BOOLEAN)).toEqual(jasmine.any(ClrBooleanFilterValidator));
    expect(builder.build(FieldType.DATE)).toEqual(jasmine.any(ClrDateFilterValidator));
    expect(builder.build(FieldType.ENUM)).toEqual(jasmine.any(ClrEnumFilterValidator));
  });

  it('builds a new instance on every call', () => {
    expect(builder.build(FieldType.STRING)).not.toBe(builder.build(FieldType.STRING));
  });

  it('builds nothing for a type without a built-in validator', () => {
    ['ip', 'toString', '__proto__', undefined, null, 42].forEach(type =>
      expect(builder.build(type as FieldType))
        .withContext(String(type))
        .toBeUndefined()
    );
  });
});
