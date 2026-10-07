/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export type DatagridMode = 'client' | 'server' | 'virtual-scroll';
export type DatagridSelection = 'none' | 'single' | 'multi';
export type DatagridDetail = 'none' | 'expandable' | 'pane';
export type ColumnType = 'string' | 'number' | 'date' | 'boolean';

/** Options of the `datagrid` schematic. Mirrors `schema.json`. */
export interface DatagridSchema {
  name: string;
  columns: string | string[];
  mode?: DatagridMode;
  pagination?: boolean;
  pageSize?: number;
  sort?: boolean;
  filter?: boolean;
  selection?: DatagridSelection;
  actionBar?: boolean;
  rowActions?: boolean;
  detail?: DatagridDetail;
  hideableColumns?: boolean;
  compact?: boolean;
  animations?: boolean;
  path?: string;
  project?: string;
  prefix?: string;
  flat?: boolean;
}
