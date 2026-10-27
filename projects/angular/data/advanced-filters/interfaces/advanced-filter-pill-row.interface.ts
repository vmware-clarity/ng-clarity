/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAdvancedFilterValue } from './advanced-filter-condition.interface';
import { ClrAdvancedFilterOperator } from '../enums/advanced-filter-operator.enum';
import { ClrAdvancedFilter } from '../models/advanced-filter.model';

/**
 * Internal. One condition row of the pill popover, a draft until Apply.
 */
export interface AdvancedFilterPillRow {
  /**
   * Tracks the row in the view.
   */
  readonly id: string;
  /**
   * The filter the row edits, or `null` for a new row.
   */
  readonly filter: ClrAdvancedFilter | null;
  operator: ClrAdvancedFilterOperator;
  value: ClrAdvancedFilterValue | undefined;
}
