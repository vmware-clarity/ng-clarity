/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { COMBOBOX_EXAMPLES } from '@clr/examples/combobox';

import { ComboboxDemo } from './combobox.demo';
import { ExampleListComponent } from '../_utils/example-list.component';

const ROUTES: Routes = [
  { path: '', component: ComboboxDemo },
  { path: 'examples', component: ExampleListComponent, data: { examples: COMBOBOX_EXAMPLES } },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
