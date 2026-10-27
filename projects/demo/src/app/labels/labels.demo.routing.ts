/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LABEL_EXAMPLES } from '@clr/examples/label';

import { LabelsClickableDemo } from './labels-clickable';
import { LabelsColorOptionsDemo } from './labels-color-options';
import { LabelsStatusDemo } from './labels-status';
import { LabelsWithBadgesDemo } from './labels-with-badges';
import { LabelsDemo } from './labels.demo';
import { ExampleListComponent } from '../_utils/example-list.component';

const ROUTES: Routes = [
  {
    path: '',
    component: LabelsDemo,
    children: [
      { path: '', redirectTo: 'examples', pathMatch: 'full' },
      { path: 'examples', component: ExampleListComponent, data: { examples: LABEL_EXAMPLES } },
      { path: 'with-badges', component: LabelsWithBadgesDemo },
      { path: 'status', component: LabelsStatusDemo },
      { path: 'clickable', component: LabelsClickableDemo },
      { path: 'color-options', component: LabelsColorOptionsDemo },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
