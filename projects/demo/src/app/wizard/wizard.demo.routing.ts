/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WIZARD_EXAMPLES } from '@clr/examples/wizard';

import { WizardAltNextDemo } from './wizard-alt-next.demo';
import { WizardAsyncValidation } from './wizard-async-validation.demo';
import { WizardBasicDemo } from './wizard-basic.demo';
import { WizardCustomButtonsDemo } from './wizard-custom-buttons.demo';
import { WizardFormValidation } from './wizard-form-validation.demo';
import { WizardHeaderActionsDemo } from './wizard-header-actions.demo';
import { WizardInPageDemo } from './wizard-in-page.demo';
import { WizardInlineDemo } from './wizard-inline.demo';
import { WizardStepErrorDemo } from './wizard-step-error.demo';
import { WizardDemo } from './wizard.demo';
import { ExampleListComponent } from '../_utils/example-list.component';

const ROUTES: Routes = [
  {
    path: '',
    component: WizardDemo,
    children: [
      { path: '', redirectTo: 'examples', pathMatch: 'full' },
      { path: 'examples', component: ExampleListComponent, data: { examples: WIZARD_EXAMPLES } },
      { path: 'basic', component: WizardBasicDemo },
      { path: 'form-validation', component: WizardFormValidation },
      { path: 'async-validation', component: WizardAsyncValidation },
      { path: 'custom-buttons', component: WizardCustomButtonsDemo },
      { path: 'header-actions', component: WizardHeaderActionsDemo },
      { path: 'inline', component: WizardInlineDemo },
      { path: 'alt-next', component: WizardAltNextDemo },
      { path: 'step-error', component: WizardStepErrorDemo },
    ],
  },
  { path: 'in-page', component: WizardInPageDemo },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
