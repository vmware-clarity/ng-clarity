/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SIGNPOST_EXAMPLES } from '@clr/examples/signpost';

import { SignpostDemo } from './signpost.demo';
import { ExampleListComponent } from '../_utils/example-list.component';

const ROUTES: Routes = [
  { path: '', component: SignpostDemo },
  { path: 'examples', component: ExampleListComponent, data: { examples: SIGNPOST_EXAMPLES } },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
