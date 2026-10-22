/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCommonStrings } from '@clr/angular/utils';

import { ClrAdvancedFilterOperator } from '../enums/advanced-filter-operator.enum';

/**
 * Internal. One entry of the operators-per-type table.
 */
export interface AdvancedFilterOperatorDefinition {
  readonly operator: ClrAdvancedFilterOperator;
  /**
   * Key of the label in `ClrCommonStrings`. The same operator can have another label per type: Equals, Equal to,
   * On date.
   */
  readonly labelKey: keyof ClrCommonStrings;
}
