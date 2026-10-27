/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SPINNER_EXAMPLES } from '@clr/examples/spinner';

import { SpinnerComponentDemo } from './spinner-component';
import { SpinnerSizesDemo } from './spinner-sizes';
import { SpinnerTypesDemo } from './spinner-types';
import { SpinnerDemo } from './spinner.demo';
import { ExampleListComponent } from '../_utils/example-list.component';

const ROUTES: Routes = [
  {
    path: '',
    component: SpinnerDemo,
    children: [
      { path: '', redirectTo: 'examples', pathMatch: 'full' },
      { path: 'examples', component: ExampleListComponent, data: { examples: SPINNER_EXAMPLES } },
      { path: 'spinner-types', component: SpinnerTypesDemo },
      { path: 'spinner-sizes', component: SpinnerSizesDemo },
      { path: 'spinner-component', component: SpinnerComponentDemo },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
