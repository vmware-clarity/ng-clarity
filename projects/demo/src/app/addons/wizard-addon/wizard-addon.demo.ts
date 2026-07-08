/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WorkflowConfigurationService } from '@clr/addons/var';
import { AppfxWizardModule } from '@clr/addons/wizard';
import { ClarityModule } from '@clr/angular';

import { SampleStepperComponent } from './sample/sample-stepper.component';
import { SampleWizardComponent } from './sample/sample-wizard.component';
import { SampleWorkflowService } from './sample/sample-workflow.service';

@Component({
  selector: 'clr-wizard-addon-demo',
  standalone: true,
  imports: [CommonModule, ClarityModule, FormsModule, AppfxWizardModule, SampleWizardComponent, SampleStepperComponent],
  providers: [SampleWorkflowService],
  templateUrl: './wizard-addon.demo.html',
})
export class WizardAddonDemo {
  readonly vcMoRef = 'demo-datacenter-ref';
  readonly supportedWizardSizes = ['md', 'lg', 'xl', 'full-screen'];

  simpleWizardOpened = false;
  longNavTitle = false;
  showSummaryPage = true;
  asyncErrorOnSubmit = false;
  useCustomFooter = false;
  selectedWizardSize = 'xl';

  #inlineMode = false;

  constructor(readonly configurationService: WorkflowConfigurationService) {}

  get inlineMode(): boolean {
    return this.#inlineMode;
  }
  set inlineMode(value: boolean) {
    this.#inlineMode = value;
    this.simpleWizardOpened = false;
  }

  openSimpleWizard(): void {
    this.simpleWizardOpened = true;
  }

  closeSimpleWizard(): void {
    this.simpleWizardOpened = false;
  }
}
