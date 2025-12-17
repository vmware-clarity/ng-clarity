/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Mirrors Clarity's Selection Type : `data/datagrid/providers/selection`
 */
export enum SelectionType {
  /**
   * User cannot select any row in the Datagrid
   */
  None = 0,

  /**
   * User can select only one row at a time in the Datagrid..
   */
  Single = 1,

  /**
   * User can select any number of rows in the Datagrid.
   */
  Multi = 2,
}
