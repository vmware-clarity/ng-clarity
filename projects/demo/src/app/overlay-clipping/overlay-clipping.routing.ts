/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OverlayClippingDemo } from './overlay-clipping.demo';

const ROUTES: Routes = [{ path: '', component: OverlayClippingDemo }];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
