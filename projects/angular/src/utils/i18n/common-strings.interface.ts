/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
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
   * Alert levels: neutral
   */
  neutral: string;
  /**
   * Alert levels: unknown
   */
  unknown: string;
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
  datagridFilterAriaLabel: string;
  /**
   * Datagrid filter dialog
   */
  datagridFilterDialogAriaLabel: string;
  /**
   * Datagrid column handler string
   */
  columnSeparatorAriaLabel: string;
  /**
   * Datagrid column resize handler string
   */
  columnSeparatorDescription: string;
  /**
   * Numeric filter from label string
   */
  fromLabel: string;
  /**
   * Numeric filter to label string
   */
  toLabel: string;
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
   * Alert: Next Alert button
   */
  alertNextAlertAriaLabel: string;

  /**
   * Alert: Previous Alert button
   */
  alertPreviousAlertAriaLabel: string;

  /**
   * Datepicker UI labels
   */
  datepickerDialogLabel: string;
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
  datepickerSelectedLabel: string;
  /**
   * Stack View: Record has changed
   */
  stackViewChanged: string;
  // Responsive Nav
  responsiveNavToggleOpen: string;
  responsiveNavToggleClose: string;
  responsiveNavOverflowOpen: string;
  responsiveNavOverflowClose: string;
  // Vertical Nav
  verticalNavToggle: string;
  /**
   * Timeline Steps
   */
  timelineStepNotStarted: string;
  timelineStepCurrent: string;
  timelineStepSuccess: string;
  timelineStepError: string;
  timelineStepProcessing: string;

  // Datagrid Helper text for expandable rows
  datagridExpandableBeginningOf: string;
  datagridExpandableEndOf: string;
  datagridExpandableRowContent: string;
  datagridExpandableRowsHelperText: string;

  /**
   * Combobox Searching Text
   */
  comboboxSearching: string;
  comboboxDelete: string;
  comboboxSelection: string;
  comboboxSelected: string;
  comboboxNoResults: string;
  comboboxOpen: string;

  /**
   * Wizard: Screen-reader text for "step" (read before step number).
   */
  wizardStep: string;

  /**
   * Wizard: Screen-reader text for completed step.
   */
  wizardStepSuccess: string;

  /**
   * Wizard: Screen-reader text for step with error.
   */
  wizardStepError: string;

  /**
   * Wizard: Aria-label for the stepnav section.
   */
  wizardStepnavAriaLabel: string;

  /**
   * Password Input
   * Screen-reader text for the hide/show password field button.
   */
  passwordHide: string;
  passwordShow: string;

  /**
   * Datagrid footer; sr-only text after the number of selected rows.
   */
  selectedRows: string;

  //Stepper: Screen-reader text for completed/failed step
  stepComplete: string;
  stepError: string;

  // File input
  browse: string;
  fileCount: string;
  clearFile: string;
  clearFiles: string;

  // Tree
  selectedTreeNode: string;
  unselectedTreeNode: string;

  // Breadcrumbs
  breadcrumb: string;
}
