/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ActionDefinition } from './action-definition';

export interface ActionClickEvent<T = any> {
  action: ActionDefinition;
  /**
   * Represent action context.
   * Array of selected data grid items in case of action bar action
   * or the data grid item associated with the datagrid row which single row
   * action is clicked.
   */
  context: T;
}

export interface SingleRowActionOpen<T = any> {
  /**
   * Menu state open/close
   */
  open: boolean;
  /**
   * Actions of the single row datagrid menu.
   */
  actions: ActionDefinition[] | null;
  /**
   * The data grid item associated with the Datagrid row which single row
   * menu is opened/closed.
   */
  context: T;
}
