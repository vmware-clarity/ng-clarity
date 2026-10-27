/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BADGE_EXAMPLES } from '@clr/examples/badge';

import { BadgeColorsDemo } from './badge-colors';
import { BadgeStatusesDemo } from './badge-statuses';
import { BadgesDemo } from './badges.demo';
import { ExampleListComponent } from '../_utils/example-list.component';

const ROUTES: Routes = [
  {
    path: '',
    component: BadgesDemo,
    children: [
      { path: '', redirectTo: 'examples', pathMatch: 'full' },
      { path: 'examples', component: ExampleListComponent, data: { examples: BADGE_EXAMPLES } },
      { path: 'color-options', component: BadgeColorsDemo },
      { path: 'status', component: BadgeStatusesDemo },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
