/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAdvancedFilterValue } from './advanced-filter-condition.interface';
import { ClrAdvancedFilterField } from './advanced-filter-field.interface';
import { ClrAdvancedFilterOperator } from '../enums/advanced-filter-operator.enum';

/**
 * Internal. What the filter popover applies: a complete condition that passed the field's validator.
 */
export interface AdvancedFilterEdit {
  readonly field: ClrAdvancedFilterField;
  readonly operator: ClrAdvancedFilterOperator;
  readonly value: ClrAdvancedFilterValue | undefined;
}
