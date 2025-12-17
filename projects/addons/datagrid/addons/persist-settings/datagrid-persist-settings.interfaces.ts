/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridSortOrder } from '@clr/angular';

/**
 * Represent datagrid column state persisted in
 * the local browser storage.
 */
export interface PersistedDatagridColumnState {
  headerText: string;
  visible: boolean;
  width: number | undefined;
  uid: string;
}

/**
 * Represent datagrid state persisted in
 * the local browser storage.
 */
export interface PersistedDatagridState {
  columns?: PersistedDatagridColumnState[];
  sorting?: PersistedDatagridSortOrder;
  pageSize?: number;
}

/**
 * Represent datagrid sort order persisted in
 * the local browser storage.
 */
export interface PersistedDatagridSortOrder {
  column: PersistedDatagridColumnState;
  sortOrder: ClrDatagridSortOrder;
}

export interface PersistDatagridSettingsService {
  getUserDataSync: (key: string) => any;
  setUserData: (key: string, data: any) => void;
}
