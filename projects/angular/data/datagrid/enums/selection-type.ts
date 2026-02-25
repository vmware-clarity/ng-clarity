/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export enum SelectionType {
  /**
   * User cannot select any row in the Datagrid
   */
  None = 'none',

  /**
   * User can select only one row at a time in the Datagrid.
   */
  Single = 'single',

  /**
   * User can select any number of rows in the Datagrid.
   */
  Multi = 'multi',
}

const SELECTION_TYPE_VALUES = new Set<string>(Object.values(SelectionType));

export function selectionTypeAttribute(value: SelectionType | string): SelectionType {
  if (SELECTION_TYPE_VALUES.has(value as string)) {
    return value as SelectionType;
  }
  throw new Error(`Invalid SelectionType: "${value}". Expected one of: ${[...SELECTION_TYPE_VALUES].join(', ')}`);
}
