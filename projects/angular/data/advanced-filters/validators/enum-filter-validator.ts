/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAdvancedFilterValidator } from './advanced-filter-validator';
import { ClrAdvancedFilterFieldType } from '../enums/advanced-filter-field-type.enum';

/**
 * The rules of ENUM fields: IN, with a non-empty set of option values, each listed once. The values are not checked
 * against the field's options.
 */
export class ClrEnumFilterValidator extends ClrAdvancedFilterValidator {
  protected override readonly fieldType = ClrAdvancedFilterFieldType.ENUM;
}
