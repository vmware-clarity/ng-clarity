/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { STACK_VIEW_EXAMPLES } from '@clr/examples/stack-view';

import { StackViewAngularBasicDemo } from './stack-view-angular-basic';
import { StackViewDemo } from './stack-view.demo';
import { ExampleListComponent } from '../_utils/example-list.component';

const routes: Routes = [
  {
    path: '',
    component: StackViewDemo,
    children: [
      { path: '', redirectTo: 'examples', pathMatch: 'full' },
      { path: 'examples', component: ExampleListComponent, data: { examples: STACK_VIEW_EXAMPLES } },
      { path: 'angular-basic', component: StackViewAngularBasicDemo },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
