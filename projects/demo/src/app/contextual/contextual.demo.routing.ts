/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContextualDemo } from './contextual.demo';
import { ContextualFramesDemo } from './frames/frames.demo';
import { ContextualLiveDemo } from './inventory/live.demo';
import { ContextualMutationDemo } from './mutation/mutation.demo';
import { ContextualPlaygroundDemo } from './playground/playground.demo';

const ROUTES: Routes = [
  {
    path: '',
    component: ContextualDemo,
    children: [
      { path: '', redirectTo: 'live', pathMatch: 'full' },
      { path: 'live', component: ContextualLiveDemo },
      { path: 'frames', component: ContextualFramesDemo },
      { path: 'playground', component: ContextualPlaygroundDemo },
      { path: 'mutation', component: ContextualMutationDemo },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
