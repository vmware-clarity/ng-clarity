/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export enum DatagridColumnChanges {
  WIDTH,
  HIDDEN,
  INITIALIZE,
}

export const ALL_COLUMN_CHANGES: DatagridColumnChanges[] = Object.keys(DatagridColumnChanges)
  .map(key => (DatagridColumnChanges as Record<string, any>)[key])
  .filter(key => key === parseInt(key, 10) && key !== DatagridColumnChanges.INITIALIZE); // extracts only integer keys
