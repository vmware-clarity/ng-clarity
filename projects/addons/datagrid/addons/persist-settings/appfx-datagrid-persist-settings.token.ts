/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { InjectionToken } from '@angular/core';

import { PersistDatagridSettingsService } from './datagrid-persist-settings.interfaces';

// injectable service contract for app-specific code that can store and read data from local browser storage
export const appfxDatagridPersistSettingsToken = new InjectionToken<PersistDatagridSettingsService>(
  'service that store and read data from local browser storage'
);
