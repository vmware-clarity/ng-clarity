/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridSortOrder } from '@clr/angular';

import { ColumnDefinition } from '../shared/column/column-definitions';

export interface ColumnState {
  column: ColumnDefinition<any>;
}

export interface ColumnResize extends ColumnState {
  columnSize: number;
}

export interface ColumnSortOrder extends ColumnState {
  sortOrder: ClrDatagridSortOrder;
}

export interface ColumnHiddenState extends ColumnState {
  hidden: boolean;
}

export interface ColumnFilterChange extends ColumnState {
  filterValue: any;
}

export interface ColumnOrderChanged {
  previousIndex: number;
  currentIndex: number;
  columns: ColumnDefinition<any>[];
}
