/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DateRangeOption } from '@clr/angular/forms/datepicker';

import { ClrAdvancedFilterOption } from './advanced-filter-option.interface';
import { ClrAdvancedFilterFieldType } from '../enums/advanced-filter-field-type.enum';
import type { ClrAdvancedFilterValidator } from '../validators/advanced-filter-validator';

/**
 * A field that can be filtered on. Consumer configuration, given to `clr-advanced-filters` and never stored in the
 * tree: a filter refers to its field by `key` only. Definitions can change at any time, and a filter whose key matches
 * no definition is kept.
 */
export interface ClrAdvancedFilterField {
  /**
   * What `ClrAdvancedFilter.toJSON()` writes as `field`. Unique among the definitions given to one component.
   */
  key: string;
  label: string;
  type: ClrAdvancedFilterFieldType;
  /**
   * The options to pick from, for ENUM fields.
   */
  options?: ClrAdvancedFilterOption[];
  /**
   * Presets of the date range picker, for DATE fields. A picked preset is stored as fixed timestamps.
   */
  rangeOptions?: DateRangeOption[];
  /**
   * Checks the conditions of this field, for example `new ClrNumberFilterValidator()` for a NUMBER field. Without it,
   * `ClrAdvancedFilter` only checks the shape, with the base `ClrAdvancedFilterValidator`.
   */
  validator?: ClrAdvancedFilterValidator;
}
