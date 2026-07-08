/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AppfxMultiPageDialogModule } from '@clr/addons/dialog';
import { AppfxStepperModule } from '@clr/addons/stepper';
import { AppfxTabsModule } from '@clr/addons/tabs';
import { AppfxWorkflowCoreModule, WorkflowConfigurationService } from '@clr/addons/var';
import { AppfxWizardModule } from '@clr/addons/wizard';
import { WorkflowStrings } from '@clr/addons/workflow/strings';

export function workflowConfigurationServiceFactory(existing: WorkflowConfigurationService) {
  return existing || new WorkflowConfigurationService();
}

export function workflowStringsServiceFactory(existing: WorkflowStrings) {
  return existing || new WorkflowStrings();
}

@NgModule({
  imports: [
    AppfxMultiPageDialogModule,
    AppfxStepperModule,
    AppfxTabsModule,
    AppfxWizardModule,
    AppfxWorkflowCoreModule,
  ],
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
  exports: [AppfxMultiPageDialogModule, AppfxStepperModule, AppfxTabsModule, AppfxWizardModule],
})
export class AppfxWorkflowsModule {}
