/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export interface ClrCommonStrings {
  /**
   * Open button
   */
  open: string;
  /**
   * Close button
   */
  close: string;
  /**
   * Show button
   */
  show: string;
  /**
   * Hide button
   */
  hide: string;
  /**
   * Delete button
   */
  delete?: string;
  /**
   * Expandable components: expand caret
   */
  expand: string;
  /**
   * Expandable components: collapse caret
   */
  collapse: string;
  /**
   * Overflow menus: ellipsis button
   */
  more: string;
  /**
   * Selectable components: checkbox or radio
   */
  select: string;
  /**
   * Selectable components: checkbox to select all
   */
  selectAll: string;
  /**
   * Selected item(s): combobox
   */
  selection?: string;
  /**
   * Pagination: previous button
   */
  previous: string;
  /**
   * Pagination: next button
   */
  next: string;
  /**
   * Pagination: go to current
   */
  current: string;
  /**
   * Alert levels: info
   */
  info: string;
  /**
   * Alert levels: success
   */
  success: string;
  /**
   * Alert levels: warning
   */
  warning: string;
  /**
   * Alert levels: danger
   */
  danger: string;
  /**
   * Datagrid: row actions
   */
  rowActions: string;
  /**
   * Datagrid: pick columns
   */
  pickColumns: string;
  /**
   * Datagrid: show columns
   */
  showColumns: string;
  /**
   * Datagrid: sort of columns
   */
  sortColumn: string;
  /**
   * Datagrid: first page
   */
  firstPage: string;
  /**
   * Datagrid: last page
   */
  lastPage: string;
  /**
   * Datagrid: next page
   */
  nextPage: string;
  /**
   * Datagrid: previous page
   */
  previousPage: string;
  /**
   * Datagrid: previous page
   */
  currentPage: string;
  /**
   * Datagird: total pages
   */
  totalPages: string;
  /**
   * Datagrid string filter: filter items
   */
  filterItems: string;
  /**
   * Datagrid numeric filter: min
   */
  minValue: string;
  /**
   * Datagrid numeric filter: max
   */
  maxValue: string;
  /**
   * Datagrid filter toggle button
   */
  datagridFilterAriaLabel?: string;
  /**
   * Datagrid filter dialog
   */
  datagridFilterDialogAriaLabel?: string;
  /**
   * Datagrid column handler string
   */
  columnSeparatorAriaLabel?: string;
  /**
   * Datagrid column resize handler string
   */
  columnSeparatorDescription?: string;
  /**
   * Modal start of content
   */
  modalContentStart: string;
  /**
   * Modal end of content
   */
  modalContentEnd: string;

  /**
   * Datagrid Show columns menu description
   */
  showColumnsMenuDescription: string;
  /**
   * Datagrid Show columns / All columns selected confirmation
   */
  allColumnsSelected: string;
  /**
   * Signpost Toggle Button
   */
  signpostToggle: string;
  /**
   * Signpost Close Button
   * (used inside signpost content components)
   */
  signpostClose: string;
  /*
   * Loaders/Spinners
   */
  loading: string;
  /**
   * Datagrid: detail pane start content for screen reader
   */
  detailPaneStart: string;
  /**
   * Datagrid: detail pane end content for screen reader
   */
  detailPaneEnd: string;
  /**
   * Datagrid: Single selection header
   */
  singleSelectionAriaLabel: string;

  /**
   * Datagrid: Single actionable header
   */
  singleActionableAriaLabel: string;

  /**
   * Datagrid: Expandable row
   */
  detailExpandableAriaLabel: string;

  /**
   * Alert: Close alert button
   */
  alertCloseButtonAriaLabel: string;

  /**
   * Datepicker UI labels
   */
  datepickerDialogLabel: string;
  datepickerToggle: string;
  datepickerToggleChooseDateLabel: string;
  datepickerToggleChangeDateLabel: string;
  datepickerPreviousMonth: string;
  datepickerCurrentMonth: string;
  datepickerNextMonth: string;
  datepickerPreviousDecade: string;
  datepickerNextDecade: string;
  datepickerCurrentDecade: string;
  datepickerSelectMonthText: string;
  datepickerSelectYearText: string;
  /**
   * Stack View: Record has changed
   */
  stackViewChanged: string;
  // Vertical Nav
  verticalNavToggle: string;
  verticalNavGroupToggle: string;
  /**
   * Timeline Steps
   */
  timelineStepNotStarted: string;
  timelineStepCurrent: string;
  timelineStepSuccess: string;
  timelineStepError: string;
  timelineStepProcessing: string;

  // Datagrid Helper text for expandable rows
  /**
   * @deprecated Should be removed in v14
   */
  dategridExpandableBeginningOf?: string;
  /**
   * @deprecated Should be removed in v14
   */
  dategridExpandableEndOf?: string;
  /**
   * @deprecated Should be removed in v14
   */
  dategridExpandableRowContent?: string;
  /**
   * @deprecated Should be removed in v14
   */
  dategridExpandableRowsHelperText?: string;
  datagridExpandableBeginningOf?: string;
  datagridExpandableEndOf?: string;
  datagridExpandableRowContent?: string;
  datagridExpandableRowsHelperText?: string;

  /**
   * Combobox Searching Text
   */
  comboboxSearching: string;
  comboboxDelete: string;
  comboboxSelection: string;
  comboboxSelected: string;
  comboboxNoResults: string;
  comboboxOpen: string;
}
