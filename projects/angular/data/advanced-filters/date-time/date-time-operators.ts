/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAdvancedFilterOperator } from '../enums/advanced-filter-operator.enum';
import { AdvancedFilterOperatorDefinition } from '../interfaces/advanced-filter-operator-definition.interface';

/**
 * Internal, parked until a DATE_TIME field type exists. The operators a date and time field will offer, in display
 * order. Instants are compared, so there is no "equals": two instants are rarely the same to the millisecond.
 */
export const DATE_TIME_OPERATORS: readonly AdvancedFilterOperatorDefinition[] = [
  { operator: ClrAdvancedFilterOperator.BEFORE, labelKey: 'advancedFilterBefore', textKey: 'advancedFilterTextBefore' },
  {
    operator: ClrAdvancedFilterOperator.BEFORE_OR_EQUAL,
    labelKey: 'advancedFilterBeforeOrEqual',
    textKey: 'advancedFilterTextBeforeOrEqual',
  },
  { operator: ClrAdvancedFilterOperator.AFTER, labelKey: 'advancedFilterAfter', textKey: 'advancedFilterTextAfter' },
  {
    operator: ClrAdvancedFilterOperator.AFTER_OR_EQUAL,
    labelKey: 'advancedFilterAfterOrEqual',
    textKey: 'advancedFilterTextAfterOrEqual',
  },
  {
    operator: ClrAdvancedFilterOperator.BETWEEN,
    labelKey: 'advancedFilterBetween',
    textKey: 'advancedFilterTextBetween',
  },
  {
    operator: ClrAdvancedFilterOperator.IS_EMPTY,
    labelKey: 'advancedFilterIsEmpty',
    textKey: 'advancedFilterTextIsEmpty',
  },
];
