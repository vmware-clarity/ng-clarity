/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { WizardAltCancelDemo } from './wizard-alt-cancel.demo';
import { WizardAltNextDemo } from './wizard-alt-next.demo';
import { WizardAsyncValidation } from './wizard-async-validation.demo';
import { WizardBasicDemo } from './wizard-basic.demo';
import { WizardCustomButtonsDemo } from './wizard-custom-buttons.demo';
import { WizardForceForwardDemo } from './wizard-force-forward.demo';
import { WizardFormValidation } from './wizard-form-validation.demo';
import { WizardHeaderActionsDemo } from './wizard-header-actions.demo';
import { WizardInPageDemo } from './wizard-in-page.demo';
import { WizardInlineDemo } from './wizard-inline.demo';
import { WizardJumpToDemo } from './wizard-jump-to.demo';
import { WizardNotClosableDemo } from './wizard-not-closable.demo';
import { WizardResetDemo } from './wizard-reset.demo';
import { WizardSkipPageDemo } from './wizard-skip-page.demo';
import { WizardStepErrorDemo } from './wizard-step-error.demo';
import { WizardStopNavigation } from './wizard-stop-navigation.demo';
import { WizardDemo } from './wizard.demo';
import { ROUTING } from './wizard.demo.routing';

@NgModule({
  imports: [CommonModule, FormsModule, ClarityModule, ROUTING],
  declarations: [
    WizardBasicDemo,
    WizardDemo,
    WizardSkipPageDemo,
    WizardFormValidation,
    WizardAsyncValidation,
    WizardNotClosableDemo,
    WizardCustomButtonsDemo,
    WizardResetDemo,
    WizardHeaderActionsDemo,
    WizardAltCancelDemo,
    WizardInPageDemo,
    WizardInlineDemo,
    WizardJumpToDemo,
    WizardAltNextDemo,
    WizardForceForwardDemo,
    WizardStopNavigation,
    WizardStepErrorDemo,
  ],
  exports: [
    WizardBasicDemo,
    WizardDemo,
    WizardFormValidation,
    WizardAsyncValidation,
    WizardNotClosableDemo,
    WizardSkipPageDemo,
    WizardCustomButtonsDemo,
    WizardHeaderActionsDemo,
    WizardAltCancelDemo,
    WizardInlineDemo,
    WizardResetDemo,
    WizardJumpToDemo,
    WizardAltNextDemo,
    WizardForceForwardDemo,
    WizardStopNavigation,
    WizardStepErrorDemo,
  ],
})
export class WizardDemoModule {}
