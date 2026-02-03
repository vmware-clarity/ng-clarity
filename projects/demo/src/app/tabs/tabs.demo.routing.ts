/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsActionsAngularDemo } from './tabs-actions-angular';
import { TabsAngularDemo } from './tabs-angular';
import { TabsStaticDemo } from './tabs-static';
import { TabsDemo } from './tabs.demo';

const ROUTES: Routes = [
  {
    path: '',
    component: TabsDemo,
    children: [
      { path: '', redirectTo: 'static', pathMatch: 'full' },
      { path: 'static', component: TabsStaticDemo },
      { path: 'angular', component: TabsAngularDemo },
      { path: 'actions-angular', component: TabsActionsAngularDemo },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
