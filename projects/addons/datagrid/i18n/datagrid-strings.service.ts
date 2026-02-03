/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

/**
 * User-visible strings used in the 'datagrid' library.
 *
 * Strings are in English only. If you need to provide localized strings:
 * - extend this class
 * - override all fields with localized values
 * - provide instance in the module, where you use the library
 *
 * ```
 * @NgModule({
 *    ...
 *    providers: [
 *       { provide: DatagridStrings, useClass: LocalizedDatagridStrings },
 *    ]
 * })
 * export class AppModule {}
 * ```
 */
@Injectable()
export class DatagridStrings {
  /**
   * Text displayed inside the grid when the grid is empty.
   */
  noItemsFound = 'No items found';

  /**
   * Label of the column toggle buttons.
   */
  showColumns = 'Show Columns';

  /**
   * Label of the button (inside column toggle) that selects all columns.
   */
  selectAll = 'Select All';

  /**
   * Tooltip for Show Columns toggle button
   */
  pickColumns = 'Manage Columns';

  /**
   * Datagrid Show columns menu description
   */
  showColumnsMenuDescription = 'Show columns menu description';

  /**
   * Datagrid Show columns / All columns selected confirmation
   */
  allColumnsSelected = 'Select all columns';

  /**
   * Footer label to display.
   * Can contain up to 3 placeholders:
   * {0} - total items count
   * {1} - index of first item of the current page (if paging is used)
   * {2} - index of last item of the current page (if paging is used)
   *
   * @example
   *    footer = "Apples and bananas";
   *    footer = "{0} apples";
   *    footer = "{1} - {2} of {0} apples"
   *
   * If not set, the grid will automatically show one of the following strings:
   * @see singleItem: if there is only 1 item in the grid<br/>
   * @see multipleItems: if there are many items and data is not paged<br/>
   * @see pagedItems: if there is paging enabled
   */
  footer?: string;

  /**
   * Footer label displayed when there is a single item.
   * @example "1 item"
   */
  singleItem = '1 item';

  /**
   * Footer label to display total items count.
   * @example "{0} items"
   */
  multipleItems = '{0} items';

  /**
   * Footer label when using pagination.
   * @example "{1} - {2} of {0} items"
   */
  pagedItems = '{1} - {2} of {0} items';

  /**
   * Label for page size selector.
   */
  itemsPerPage = 'Items per page';

  /**
   * Title of the export button.
   */
  exportLink = 'Export';

  /**
   * Title of 'Export > Export All' option.
   */
  exportAll = 'All Rows';

  /**
   * Title of 'Export > Matching Filters' option.
   */
  exportMatchingFilters = 'Matching Filters';

  /**
   * Title of 'Export > Selected Rows' option.
   */
  exportSelectedRows = 'Selected Rows';

  /**
   * Error message displayed in case of error during data export.
   */
  exportErrorMessage = 'Sorry, the data could not be exported at the moment due to some internal error.';

  /**
   * Title of the error dialog displayed in case of error during data export.
   */
  exportErrorTitle = 'Export Data Failure';

  /**
   * Text for close button of column toggler on 4x zoom
   */
  closeColumnTogglerText = 'Close';

  /**
   * Label of the button for deselecting all rows.
   */
  deselectAll = 'Deselect All';

  /**
   * Details pane label for the collapsed button.
   * @example "Expand the details pane for the {0} item"
   */
  expandDetailsPaneLabel = 'Expand the details pane for the {0} item';

  /**
   * Details pane label for the expanded button.
   * @example "Collapse the details pane for the {0} item"
   */
  collapseDetailsPaneLabel = 'Collapse the details pane for the {0} item';

  /**
   * Placeholder text for the filter input in each filterable column.
   * @example "Filter items"
   */
  filterPlaceholder = 'Filter Items';
}
