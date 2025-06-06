/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DropdownAngularCloseItemFalseDemo } from './dropdown-angular-close-item-false';
import { DropdownAngularNestedDemo } from './dropdown-angular-nested';
import { DropdownAngularPositioningDemo } from './dropdown-angular-positioning';
import { DropdownAngularShadowRootDemo } from './dropdown-angular-shadow-root';
import { DropdownHeaderDemo } from './dropdown-header';
import { DropdownStaticButtonLinkToggleDemo } from './dropdown-static-buttonlink-toggle';
import { DropdownStaticDefaultDemo } from './dropdown-static-default';
import { DropdownStaticIconToggleDemo } from './dropdown-static-icon-toggle';
import { DropdownStaticPositioningDemo } from './dropdown-static-positioning';
import { DropdownDemo } from './dropdown.demo';

const ROUTES: Routes = [
  {
    path: '',
    component: DropdownDemo,
    children: [
      { path: '', redirectTo: 'default', pathMatch: 'full' },
      { path: 'default', component: DropdownStaticDefaultDemo },
      { path: 'positioning', component: DropdownStaticPositioningDemo },
      { path: 'icon-toggle', component: DropdownStaticIconToggleDemo },
      { path: 'buttonlink-toggle', component: DropdownStaticButtonLinkToggleDemo },
      { path: 'angular-positioning', component: DropdownAngularPositioningDemo },
      { path: 'angular-shadow-root', component: DropdownAngularShadowRootDemo },
      { path: 'angular-nested', component: DropdownAngularNestedDemo },
      { path: 'multi-click', component: DropdownAngularCloseItemFalseDemo },
      { path: 'dropdown-header', component: DropdownHeaderDemo },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
