/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridFilterInterface } from '@clr/angular';

export interface ColumnFilter<T> extends ClrDatagridFilterInterface<T> {
  /**
   * Initial filter value provided from defaultFilterValue
   * property of column definition @see #SelectionType
   */
  filterValue: any;
}
