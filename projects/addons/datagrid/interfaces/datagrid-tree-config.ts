/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridTreeChildrenFunction } from '@clr/angular/data/datagrid';

/**
 * Turns a server-driven datagrid with paging into a tree: `gridItems` are the roots, and a row is
 * expanded with the toggle in its toggle column (`ColumnDefinition.treeToggle`, by default the column
 * defined first). Pass a new object to change it, as the grid is OnPush.
 */
export interface DatagridTreeConfig<T> {
  /**
   * Loads the children of a row: an array, or a Promise or an Observable of one. Called when the row
   * is expanded for the first time, and again after `reloadTreeChildren()`.
   */
  getChildren: ClrDatagridTreeChildrenFunction<T>;

  /**
   * Whether a row can have children. Without it, every row offers the toggle until its children come
   * back empty.
   */
  hasChildren?: (item: T) => boolean;

  /**
   * In multi-selection, selecting a row also selects its loaded descendants, and a parent is selected
   * when all of its children are.
   *
   * @default false
   */
  cascadeSelection?: boolean;
}

/**
 * A row of the tree that was expanded or collapsed, emitted by `treeExpandedChange`.
 */
export interface TreeExpandedState<T> {
  item: T;
  expanded: boolean;
}
