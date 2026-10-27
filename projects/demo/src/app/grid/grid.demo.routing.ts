/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GRID_EXAMPLES } from '@clr/examples/grid';

import { GridColumnWrappingDemo } from './column-wrapping/column-wrapping';
import { GridColumnsDemo } from './columns/grid-columns';
import { GridDemo } from './grid.demo';
import { GridNestingDemo } from './nesting/nesting';
import { GridNoGuttersDemo } from './no-gutters/no-gutters';
import { GridContainerDemo } from './overflow/grid-container';
import { GridColumnStackingDemo } from './stacking/grid-column-stacking';
import { ExampleListComponent } from '../_utils/example-list.component';

const ROUTES: Routes = [
  {
    path: '',
    component: GridDemo,
    children: [
      { path: '', redirectTo: 'examples', pathMatch: 'full' },
      { path: 'examples', component: ExampleListComponent, data: { examples: GRID_EXAMPLES } },
      { path: 'grid-columns', component: GridColumnsDemo },
      { path: 'grid-columns-stacking', component: GridColumnStackingDemo },
      { path: 'grid-no-gutters', component: GridNoGuttersDemo },
      { path: 'grid-column-wrapping', component: GridColumnWrappingDemo },
      { path: 'grid-nesting', component: GridNestingDemo },
      { path: 'grid-container', component: GridContainerDemo },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
