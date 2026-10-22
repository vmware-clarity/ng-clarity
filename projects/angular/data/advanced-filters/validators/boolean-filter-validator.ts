/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAdvancedFilterValidator } from './advanced-filter-validator';
import { ClrAdvancedFilterFieldType } from '../enums/advanced-filter-field-type.enum';
import { ClrAdvancedFilterOperator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilterValidationError } from '../enums/advanced-filter-validation-error.enum';

/**
 * The rules of BOOLEAN fields: EQUALS, with the value `true` or `false`.
 */
export class ClrBooleanFilterValidator extends ClrAdvancedFilterValidator {
  protected override readonly fieldType = ClrAdvancedFilterFieldType.BOOLEAN;

  protected override validateSingle(
    _operator: ClrAdvancedFilterOperator,
    value: unknown
  ): ClrAdvancedFilterValidationError | null {
    return typeof value === 'boolean' ? null : ClrAdvancedFilterValidationError.REQUIRED;
  }
}
