/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PROGRESS_BAR_EXAMPLES } from '@clr/examples/progress-bar';

import { ProgressBarAnimationsDemo } from './progress-bar-animations';
import { ProgressBarCardsDemo } from './progress-bar-cards';
import { ProgressBarComponentDemo } from './progress-bar-component';
import { ProgressBarInlineDemo } from './progress-bar-inline';
import { ProgressBarInlineCardsDemo } from './progress-bar-inline-cards';
import { ProgressBarLoopDemo } from './progress-bar-loop';
import { ProgressBarStaticDemo } from './progress-bar-static';
import { ProgressBarsDemo } from './progress-bars.demo';
import { ExampleListComponent } from '../_utils/example-list.component';

const ROUTES: Routes = [
  {
    path: '',
    component: ProgressBarsDemo,
    children: [
      { path: '', redirectTo: 'examples', pathMatch: 'full' },
      { path: 'examples', component: ExampleListComponent, data: { examples: PROGRESS_BAR_EXAMPLES } },
      { path: 'progress-bar-animations', component: ProgressBarAnimationsDemo },
      { path: 'progress-bar-cards', component: ProgressBarCardsDemo },
      { path: 'progress-bar-loop', component: ProgressBarLoopDemo },
      { path: 'progress-bar-static', component: ProgressBarStaticDemo },
      { path: 'progress-bar-inline', component: ProgressBarInlineDemo },
      { path: 'progress-bar-inline-cards', component: ProgressBarInlineCardsDemo },
      { path: 'progress-bar-component', component: ProgressBarComponentDemo },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
