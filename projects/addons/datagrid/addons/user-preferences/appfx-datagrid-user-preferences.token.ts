/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { InjectionToken } from '@angular/core';

import { DatagridUserPreferencesService } from './datagrid-user-preferences.interfaces';

// Injectable service contract for app-specific code that can get user preferences
export const appfxDatagridUserPreferencesToken = new InjectionToken<DatagridUserPreferencesService>(
  'Service that stores and reads user preferences related to the datagrid.'
);
