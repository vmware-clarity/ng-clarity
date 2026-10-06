/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BUTTON_EXAMPLES } from '@clr/examples/button';

import { ButtonsIconsDemo } from './buttons-icons';
import { ButtonsTestDemo } from './buttons-test';
import { ButtonsDemo } from './buttons.demo';
import { PrimaryButtonDemo } from './primary-button';
import { SecondaryButtonDemo } from './secondary-button';
import { TertiaryButtonDemo } from './tertiary-button';
import { ExampleListComponent } from '../_utils/example-list.component';

const ROUTES: Routes = [
  {
    path: '',
    component: ButtonsDemo,
    children: [
      { path: '', redirectTo: 'examples', pathMatch: 'full' },
      { path: 'examples', component: ExampleListComponent, data: { examples: BUTTON_EXAMPLES } },
      { path: 'primary-button', component: PrimaryButtonDemo },
      { path: 'secondary-button', component: SecondaryButtonDemo },
      { path: 'tertiary-button', component: TertiaryButtonDemo },
      { path: 'buttons-test', component: ButtonsTestDemo },
      { path: 'icons', component: ButtonsIconsDemo },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
