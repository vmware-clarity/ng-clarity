/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Type } from '@angular/core';
import {
  ClrDatagridComparatorInterface,
  ClrDatagridSortOrder,
  ClrDatagridStringFilterInterface,
} from '@clr/angular/data/datagrid';

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
   * Pins the column to the left of the Datagrid, so it stays visible while the remaining columns
   * are scrolled horizontally. Pinned columns keep the order they are defined in and are rendered
   * after the built-in row controls.
   *
   * @default false - Columns are not pinned by default.
   */
  pinned?: boolean;

  /**
   * Determines whether the user can pin and unpin the column from a control in its header. It only
   * adds the control - the pinned state itself is held by `pinned`, which is kept up to date when
   * the user toggles it.
   *
   * @default false - Columns cannot be pinned by the user by default.
   */
  pinnable?: boolean;

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

  /**
   * Controls whether the "unsort" step is removed from this column's sort cycle,
   * overriding the grid-level `disableUnsort` default.
   * - `true`: this column toggles ascending ↔ descending only.
   * - `false`: this column cycles ascending → descending → unsorted.
   *
   * When omitted, the grid-level `disableUnsort` value is used.
   */
  disableUnsort?: boolean;
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
