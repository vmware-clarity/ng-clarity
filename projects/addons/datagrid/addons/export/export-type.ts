/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Defining the three export types, selected export option is passed to Datagrid Export Component
 * @type {{ALL: string; SELECTED_ONLY: string; MATCHING_FILTERS: string}}
 */
export enum ExportType {
  ALL = 'ALL',
  SELECTED_ONLY = 'SELECTED_ONLY',
  MATCHING_FILTERS = 'MATCHING_FILTERS',
}
