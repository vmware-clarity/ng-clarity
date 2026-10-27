/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAdvancedFilterField } from './advanced-filter-field.interface';
import { AdvancedFilterPillRow } from './advanced-filter-pill-row.interface';
import { ClrAdvancedFilterLogic } from '../enums/advanced-filter-logic.enum';

/**
 * Internal. What the pill popover applies: one field, its logic, and complete rows that passed the field's validator.
 */
export interface AdvancedFilterPillEdit {
  readonly field: ClrAdvancedFilterField;
  readonly logic: ClrAdvancedFilterLogic;
  readonly rows: readonly AdvancedFilterPillRow[];
}
