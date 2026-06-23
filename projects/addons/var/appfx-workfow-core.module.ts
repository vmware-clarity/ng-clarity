/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { A11yModule } from '@clr/addons/a11y';
import { PropertyViewModule } from '@clr/addons/property-view';
import { WorkflowStrings } from '@clr/addons/workflow/strings';
import { ClrStackViewModule } from '@clr/angular/data/stack-view';
import { ClrAlertModule } from '@clr/angular/emphasis/alert';
import {
  angleIcon,
  barsIcon,
  ClarityIcons,
  ClrIcon,
  exclamationCircleIcon,
  pencilIcon,
  refreshIcon,
  successStandardIcon,
} from '@clr/angular/icon';
import { ClrSignpostModule } from '@clr/angular/popover/signpost';
import { ClrSpinnerModule } from '@clr/angular/progress/spinner';

import { WorkflowConfigurationService } from './config/workflow-configuration.service';
import { WorkflowModelMonitorComponent } from './debug/workflow-model-monitor.component';
import { ErrorComponent } from './error/error.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { StepContainerComponent } from './step-container/step-container.component';
import {
  ValidationBannerComponent,
  ValidationBannerInternalComponent,
} from './step-container/validation-banner/validation-banner.component';

/**
 * This token is used to determine if the Wizard/Dialog is opened through ModalService.
 * If it is not injected (value is null), this means the the component is used directly,
 * without ModalService.
 * If the value is true, this means that the component is opened using
 * ModalService.openModalComponent API.
 * If the value is false, this means that the component is opened using
 * ModalService.openModal API (which is not correct).
 */
export const modalServiceToken = new InjectionToken('ModalService#openModalComponent');

export function workflowConfigurationServiceFactory(existing: WorkflowConfigurationService) {
  return existing || new WorkflowConfigurationService();
}

export function workflowStringsServiceFactory(existing: WorkflowStrings) {
  return existing || new WorkflowStrings();
}

const components = [
  ValidationBannerComponent,
  ValidationBannerInternalComponent,
  StepContainerComponent,
  WorkflowModelMonitorComponent,
  ErrorComponent,
  SpinnerComponent,
];

const clarityDependencies = [ClrAlertModule, ClrIcon, ClrSpinnerModule, ClrStackViewModule, ClrSignpostModule];

const appfxDependencies = [PropertyViewModule, A11yModule];

@NgModule({
  imports: [...appfxDependencies, ...clarityDependencies, CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [...components],
  providers: [
    {
      // This pattern allows the importer of this module to specify its own WorkflowConfigurationService.
      provide: WorkflowConfigurationService,
      useFactory: workflowConfigurationServiceFactory,
      deps: [[new Optional(), new SkipSelf(), WorkflowConfigurationService]],
    },
    {
      // This pattern allows the importer of this module to specify its own WorkflowStrings.
      provide: WorkflowStrings,
      useFactory: workflowStringsServiceFactory,
      deps: [[new Optional(), new SkipSelf(), WorkflowStrings]],
    },
  ],
  exports: [...components],
})
export class AppfxWorkflowCoreModule {
  constructor() {
    ClarityIcons.addIcons(angleIcon, barsIcon, exclamationCircleIcon, pencilIcon, refreshIcon, successStandardIcon);
  }
}
