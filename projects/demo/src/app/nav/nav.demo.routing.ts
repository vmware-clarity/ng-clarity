/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HEADER_EXAMPLES } from '@clr/examples/header';

import { HeaderColorsDemo } from './header-colors';
import { HeaderTypesDemo } from './header-types';
import { HeadersDemo } from './headers';
import { NavDemo } from './nav.demo';
import { NavsDemo } from './navs';
import { ExampleListComponent } from '../_utils/example-list.component';

const ROUTES: Routes = [
  {
    path: '',
    component: NavDemo,
    children: [
      { path: '', redirectTo: 'examples', pathMatch: 'full' },
      { path: 'examples', component: ExampleListComponent, data: { examples: HEADER_EXAMPLES } },
      {
        path: 'headers',
        component: HeadersDemo,
        children: [
          { path: '', redirectTo: 'header-types', pathMatch: 'full' },
          { path: 'header-types', component: HeaderTypesDemo },
          { path: 'header-colors', component: HeaderColorsDemo },
        ],
      },
      { path: 'nav-tabs', component: NavsDemo },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
