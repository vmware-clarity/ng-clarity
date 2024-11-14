/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StackViewAngularBasicDemo } from './stack-view-angular-basic';
import { StackViewAngularLazyloadDemo } from './stack-view-angular-lazyload';
import { StackViewAngularModalEditDemo } from './stack-view-angular-modal-edit';
import { StackViewStaticDemo } from './stack-view-static';
import { StackViewDemo } from './stack-view.demo';

const routes: Routes = [
  {
    path: '',
    component: StackViewDemo,
    children: [
      { path: '', redirectTo: 'static', pathMatch: 'full' },
      { path: 'static', component: StackViewStaticDemo },
      { path: 'angular-basic', component: StackViewAngularBasicDemo },
      { path: 'angular-modal-edit', component: StackViewAngularModalEditDemo },
      { path: 'angular-lazyload', component: StackViewAngularLazyloadDemo },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
