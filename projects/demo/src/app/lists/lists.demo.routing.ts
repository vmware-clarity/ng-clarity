/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LIST_EXAMPLES } from '@clr/examples/list';

import { ListsCompactDemo } from './lists-compact';
import { ListsInCardsDemo } from './lists-in-cards';
import { ListsMixedDemo } from './lists-mixed';
import { ListsOlDemo } from './lists-ol';
import { ListsUlDemo } from './lists-ul';
import { ListsUnstyledDemo } from './lists-unstyled';
import { ListsDemo } from './lists.demo';
import { ExampleListComponent } from '../_utils/example-list.component';

const ROUTES: Routes = [
  {
    path: '',
    component: ListsDemo,
    children: [
      { path: '', redirectTo: 'examples', pathMatch: 'full' },
      { path: 'examples', component: ExampleListComponent, data: { examples: LIST_EXAMPLES } },
      { path: 'lists-ul', component: ListsUlDemo },
      { path: 'lists-ol', component: ListsOlDemo },
      { path: 'lists-in-cards', component: ListsInCardsDemo },
      { path: 'lists-unstyled', component: ListsUnstyledDemo },
      { path: 'lists-mixed', component: ListsMixedDemo },
      { path: 'lists-compact', component: ListsCompactDemo },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
