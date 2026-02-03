/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Type } from '@angular/core';
import { ClrDatagridComparatorInterface, ClrDatagridSortOrder, ClrDatagridStringFilterInterface } from '@clr/angular';

import { ColumnFilter } from '../../interfaces/column-filter';

/**
 * Defines a column in the Datagrid.
 */
export interface ColumnDefinition<T> {
  /**
   * Unique identifier for the column, used for persistence.
   */
  uid?: string;

  /**
   * The text displayed as the column header.
   */
  displayName: string;

  /**
   * The name of the property in the Datagrid data that this column represents.
   */
  field: string;

  /**
   * Determines whether the column can be hidden using the column toggle in the footer.
   * If set to `false`, the column will always remain visible.
   *
   * @default true - Columns are hideable by default.
   */
  hideable?: boolean;

  /**
   * Specifies whether the column is initially hidden when the Datagrid is rendered.
   * A value of `true` hides the column by default, while `false` ensures it is visible.
   *
   * @default false - Columns are visible by default.
   */
  hidden?: boolean;

  /**
   * Defines string filter for data in this column.
   */
  stringFilter?: ClrDatagridStringFilterInterface<T>;

  /**
   * Defines filter component for data in this column.
   */
  filter?: Type<ColumnFilter<T>>;

  /**
   * Default filter value for the column's filter.
   */
  defaultFilterValue?: any;

  /**
   * A custom component to render/display data in this column.
   */
  columnRenderer?: Type<ColumnRenderer<T>>;

  /**
   * Additional key/value pair configuration options for the `columnRenderer`.
   */
  columnRendererConfig?: any;

  /**
   * Comparator that to be used when sorting data in this column.
   */
  sortComparator?: ClrDatagridComparatorInterface<T> | string;

  /**
   * Specifies the default sort order for the column.
   */
  defaultSortOrder?: ClrDatagridSortOrder;

  /**
   * Column width in pixels (e.g., '100px'). Auto-calculated if not set.
   */
  width?: string;

  /**
   * The field by which the column will be filtered and sorted.
   */
  sortAndFilterByField?: string;
}

/**
 * Represents a custom renderer for a Datagrid column, responsible for displaying data
 * and responding to changes in the associated item or column configuration.
 */
export interface ColumnRenderer<T> {
  /**
   * The data item representing a row in the Datagrid.
   */
  item: T;

  /**
   * The definition of the column being rendered.
   */
  column?: ColumnDefinition<T>;

  /**
   * Called when the item or the column objects have changed.
   * The DatagridCellContainer has ngOnChanges lifecycle hook and call
   * this function if it is implemented.
   *
   * In most cases this method is good to be implemented.
   * The renderer should not implement this method only if they don't expect
   * their data to be updated or if they directly bind properties of the item
   * object in their html template.
   */
  onChange?(item: T, column?: ColumnDefinition<T>): void;
}
