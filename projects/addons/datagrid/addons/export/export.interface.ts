/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ColumnSortOrder } from '../../interfaces/column-state';
import { ExportType } from './export-type';

export interface DatagridItemSet {
  totalDatagridItems: any[];
  selectedItems: any[];
  filteredDatagridItems: any[];
}

export interface ExportValueCallbackParams {
  item: any;
  field: string;
  itemValue: any;
}

export type SortFunction = (items: any[], sortOrder?: ColumnSortOrder) => any[];

/**
 * Configuration for client-side data export.
 * Defines export settings such as file name and columns to be exported,
 * whether the export is custom (will be made by host component), count of all items (valuable for client-side grids in which data are filtered)
 * and how to sort the exported items.
 */
export interface ClientSideExportConfig {
  exportedFileName: string;
  columnDefinitions: ExportColumnDefinition[];
  customExport?: boolean;
  allItemsCount?: number;
  /**
   * If true, the export service will sort the items before exporting them
   * using the sortOrder field and the provided sortFunction. If the sort function
   * is not provided, we will use the internal sortExportedItems function.
   */
  sort?: boolean;
  /**
   * Column sort order is set by the grid when the user clicks on a column or when
   * ClientSideExportConfig is created. It is provided to SortFunction.
   *
   */
  sortOrder?: ColumnSortOrder;
  /**
   * Custom sort function, which can be used for sorting the items before exporting them.
   */
  sortFunction?: SortFunction;
}

/**
 * Represents the status of an export operation.
 */
export interface ExportStatus {
  /**
   * Specifies the type of export operation being performed.
   * @See ExportType {{ALL: string; SELECTED_ONLY: string; MATCHING_FILTERS: string}}
   */
  exportType: ExportType;

  /**
   * Indicates whether the export operation is currently in progress.
   */
  inProgress?: boolean;
}

/**
 * Defines a column structure for Export
 */
export interface ExportColumnDefinition {
  /**
   * The text for the column header
   */
  displayName: string;
  /**
   *  field: The name of the property that this column represents.
   *  Note: Make sure that the field property in Column Definitions are the same as used in rows for grid values.
   *
   *  See Example:->
   *  Columns: [ { 'field': 'name', 'displayName': 'Name', 'exportProperty': true },
   *             { 'field': 'id', 'displayName': 'id', 'exportProperty': false },
   *             { 'field': 'version', 'displayName': 'Version No.', 'exportProperty': true } ]
   *  Rows:    [ { 'name': 'Item A', 'id': 'item1', 'version': '1.0.1' },
   *             { 'name': 'Item B', 'id': 'item2', 'version': '1.0.2' } ]
   */
  field: string;
  /**
   * Whether to export this property or not
   */
  getExportValue?: any;
}

export const defaultFileExtension = '.csv';
export const defaultFileName = 'exportedData';
