/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MODAL_EXAMPLES } from '@clr/examples/modal';

import { ModalAngularShowDemo } from './modal-angular-show';
import { ModalAngularSizeDemo } from './modal-angular-size';
import { ModalFormDemo } from './modal-form.demo';
import { ModalMaxHeightDemo } from './modal-max-height';
import { ModalStaticOldDemo } from './modal-static-old';
import { ModalTrapDemo } from './modal-trap';
import { ModalDemo } from './modal.demo';
import { ExampleListComponent } from '../_utils/example-list.component';

const ROUTES: Routes = [
  {
    path: '',
    component: ModalDemo,
    children: [
      { path: '', redirectTo: 'examples', pathMatch: 'full' },
      { path: 'examples', component: ExampleListComponent, data: { examples: MODAL_EXAMPLES } },
      { path: 'old-close-button', component: ModalStaticOldDemo },
      { path: 'dynamic-show', component: ModalAngularShowDemo },
      { path: 'dynamic-sizing', component: ModalAngularSizeDemo },
      { path: 'max-height', component: ModalMaxHeightDemo },
      { path: 'focus-trap', component: ModalTrapDemo },
      { path: 'modal-form', component: ModalFormDemo },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
