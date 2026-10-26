/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAdvancedFilterValidator } from './advanced-filter-validator';
import { ClrBooleanFilterValidator } from './boolean-filter-validator';
import { ClrDateFilterValidator } from './date-filter-validator';
import { ClrEnumFilterValidator } from './enum-filter-validator';
import { ClrNumberFilterValidator } from './number-filter-validator';
import { ClrStringFilterValidator } from './string-filter-validator';
import { ClrAdvancedFilterFieldType } from '../enums/advanced-filter-field-type.enum';

/**
 * Internal. Builds the built-in validator of a field type: a new instance on every call, so no two fields share one.
 */
export class AdvancedFilterValidatorBuilder {
  private readonly validators: Readonly<Record<ClrAdvancedFilterFieldType, new () => ClrAdvancedFilterValidator>> = {
    [ClrAdvancedFilterFieldType.STRING]: ClrStringFilterValidator,
    [ClrAdvancedFilterFieldType.NUMBER]: ClrNumberFilterValidator,
    [ClrAdvancedFilterFieldType.BOOLEAN]: ClrBooleanFilterValidator,
    [ClrAdvancedFilterFieldType.DATE]: ClrDateFilterValidator,
    [ClrAdvancedFilterFieldType.ENUM]: ClrEnumFilterValidator,
  };

  /**
   * @returns A new validator for the type, or `undefined` for a type without a built-in validator.
   */
  build(type: ClrAdvancedFilterFieldType): ClrAdvancedFilterValidator | undefined {
    // Types can come from runtime data, so a value such as 'toString' never resolves to a table entry.
    return typeof type === 'string' && Object.prototype.hasOwnProperty.call(this.validators, type)
      ? new this.validators[type]()
      : undefined;
  }
}
