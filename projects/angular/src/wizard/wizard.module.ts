/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClrWizard } from './wizard';
import { ClrWizardButton } from './wizard-button';
import { ClrWizardHeaderAction } from './wizard-header-action';
import { ClrWizardPage } from './wizard-page';
import { ClrWizardPageButtons } from './wizard-page-buttons';
import { ClrWizardPageHeaderActions } from './wizard-page-header-actions';
import { ClrWizardPageNavTitle } from './wizard-page-navtitle';
import { ClrWizardPageTitle } from './wizard-page-title';
import { ClrWizardStepnav } from './wizard-stepnav';
import { ClrWizardStepnavItem } from './wizard-stepnav-item';
import { ClrWizardTitle } from './wizard-title';
import { ClrAlertModule } from '../emphasis/alert/alert.module';
import { ClarityIcons, ClrIcon, errorStandardIcon, successStandardIcon } from '../icon';
import { ClrModalModule } from '../modal/modal.module';

export const CLR_WIZARD_DIRECTIVES: any[] = [
  ClrWizard,
  ClrWizardPage,
  ClrWizardStepnav,
  ClrWizardStepnavItem,
  ClrWizardButton,
  ClrWizardHeaderAction,
  ClrWizardTitle,
  ClrWizardPageTitle,
  ClrWizardPageNavTitle,
  ClrWizardPageButtons,
  ClrWizardPageHeaderActions,
];

@NgModule({
  imports: [CommonModule, ClrIcon, ClrModalModule, ClrAlertModule],
  declarations: [CLR_WIZARD_DIRECTIVES],
  exports: [CLR_WIZARD_DIRECTIVES],
})
export class ClrWizardModule {
  constructor() {
    ClarityIcons.addIcons(errorStandardIcon, successStandardIcon);
  }
}
