/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TEXTAREA_EXAMPLES } from '@clr/examples/textarea';

import { TextareaDemo } from './textarea.demo';
import { ExampleListComponent } from '../_utils/example-list.component';

const ROUTES: Routes = [
  { path: '', component: TextareaDemo },
  { path: 'examples', component: ExampleListComponent, data: { examples: TEXTAREA_EXAMPLES } },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
