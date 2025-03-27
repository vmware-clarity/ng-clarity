/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ZIndexDemo } from './z-index.demo';

const ROUTES: Routes = [{ path: '', component: ZIndexDemo }];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
