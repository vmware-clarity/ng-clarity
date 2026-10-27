/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

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
import { ROUTING } from './wizard.demo.routing';

@NgModule({
  imports: [CommonModule, FormsModule, ClarityModule, ROUTING],
  declarations: [
    WizardBasicDemo,
    WizardDemo,
    WizardFormValidation,
    WizardAsyncValidation,
    WizardCustomButtonsDemo,
    WizardHeaderActionsDemo,
    WizardInPageDemo,
    WizardInlineDemo,
    WizardAltNextDemo,
    WizardStepErrorDemo,
  ],
  exports: [
    WizardBasicDemo,
    WizardDemo,
    WizardFormValidation,
    WizardAsyncValidation,
    WizardCustomButtonsDemo,
    WizardHeaderActionsDemo,
    WizardInlineDemo,
    WizardAltNextDemo,
    WizardStepErrorDemo,
  ],
})
export class WizardDemoModule {}
