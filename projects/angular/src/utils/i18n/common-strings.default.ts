/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCommonStrings } from './common-strings.interface';

export const commonStringsDefault: ClrCommonStrings = {
  open: 'Open',
  close: 'Close',
  show: 'Show',
  hide: 'Hide',
  expand: 'Expand',
  collapse: 'Collapse',
  more: 'More',
  select: 'Select',
  selectAll: 'Select All',
  previous: 'Previous',
  next: 'Next',
  current: 'Jump to current',
  info: 'Info',
  success: 'Success',
  warning: 'Warning',
  danger: 'Error',
  rowActions: 'Available actions',
  pickColumns: 'Manage Columns',
  showColumns: 'Show Columns',
  sortColumn: 'Sort Column',
  firstPage: 'First Page',
  lastPage: 'Last Page',
  nextPage: 'Next Page',
  previousPage: 'Previous Page',
  currentPage: 'Current Page',
  totalPages: 'Total Pages',
  filterItems: 'Filter items',
  minValue: 'Min value',
  maxValue: 'Max value',
  modalContentStart: 'Beginning of Modal Content',
  modalContentEnd: 'End of Modal Content',
  showColumnsMenuDescription: 'Show or hide columns menu',
  allColumnsSelected: 'All columns selected',
  signpostToggle: 'Signpost Toggle',
  signpostClose: 'Signpost Close',
  loading: 'Loading',
  // Datagrid
  detailPaneStart: 'Start of row details',
  detailPaneEnd: 'End of row details',
  singleSelectionAriaLabel: 'Single selection header',
  singleActionableAriaLabel: 'Single actionable header',
  detailExpandableAriaLabel: 'Toggle more row content',
  datagridFilterAriaLabel: 'Toggle {COLUMN} filter',
  datagridFilterDialogAriaLabel: 'Filter dialog',
  columnSeparatorAriaLabel: 'Column resize handle',
  columnSeparatorDescription: 'Use left or right key to resize the column',
  // Alert
  alertCloseButtonAriaLabel: 'Close alert',
  alertNextAlertAriaLabel: 'Next alert message, {CURRENT} of {COUNT}',
  alertPreviousAlertAriaLabel: 'Previous alert message, {CURRENT} of {COUNT}',
  // Date Picker
  datepickerDialogLabel: 'Choose date',
  datepickerToggleChooseDateLabel: 'Choose date',
  datepickerToggleChangeDateLabel: 'Change date, {SELECTED_DATE}',
  datepickerPreviousMonth: 'Previous month',
  datepickerCurrentMonth: 'Current month',
  datepickerNextMonth: 'Next month',
  datepickerPreviousDecade: 'Previous decade',
  datepickerNextDecade: 'Next decade',
  datepickerCurrentDecade: 'Current decade',
  datepickerSelectMonthText: 'Select month, the current month is {CALENDAR_MONTH}',
  datepickerSelectYearText: 'Select year, the current year is {CALENDAR_YEAR}',
  datepickerSelectedLabel: '{FULL_DATE} - Selected',
  // Stack View
  stackViewChanged: 'Value changed.',
  // Responsive Nav
  responsiveNavToggleOpen: 'Open navigation menu',
  responsiveNavToggleClose: 'Close navigation menu',
  responsiveNavOverflowOpen: 'Open navigation overflow menu',
  responsiveNavOverflowClose: 'Close navigation overflow menu',
  //Vertical Nav
  verticalNavToggle: 'Toggle vertical navigation',
  // Timeline steps
  timelineStepNotStarted: 'Not started',
  timelineStepCurrent: 'Current',
  timelineStepSuccess: 'Completed',
  timelineStepError: 'Error',
  timelineStepProcessing: 'In progress',
  // Combobox
  comboboxDelete: 'Delete selected option',
  comboboxSearching: 'Searching for matches for "{INPUT}"',
  comboboxSelection: 'Selection',
  comboboxSelected: 'Selected',
  comboboxNoResults: 'No results',
  comboboxOpen: 'Show options',
  // Datagrid expandable rows
  datagridExpandableBeginningOf: 'Beginning of',
  datagridExpandableEndOf: 'End of',
  datagridExpandableRowContent: 'Expandable row content',
  datagridExpandableRowsHelperText: `Screen reader table commands may not work for viewing expanded content, please use your screen reader's browse mode to read the content exposed by this button`,
  // Wizard
  wizardStepSuccess: 'Completed',
  wizardStepError: 'Error',
  wizardStepnavAriaLabel: 'Step navigation',

  /**
   * Password Input
   * Screen-reader text for the hide/show password field button
   */
  passwordHide: 'Hide password for {LABEL}',
  passwordShow: 'Show password for {LABEL}',

  /**
   * Datagrid footer; sr-only text after the number of selected rows.
   */
  selectedRows: 'Selected rows',

  // Accordion/Stepper
  stepComplete: 'Step {STEP} complete',
  stepError: 'Error in step {STEP}',
};
