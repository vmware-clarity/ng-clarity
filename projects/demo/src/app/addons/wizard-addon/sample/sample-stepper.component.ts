/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, inject, Input, OnInit } from '@angular/core';
import { AppfxStepperModule } from '@clr/addons/stepper';
import { ModelChange, Step } from '@clr/addons/var';

import { SampleWorkflowModel } from './sample-workflow.model';
import { SampleWorkflowService } from './sample-workflow.service';

@Component({
  selector: 'clr-demo-sample-stepper',
  standalone: true,
  imports: [AppfxStepperModule],
  templateUrl: 'sample-stepper.component.html',
})
export class SampleStepperComponent implements OnInit {
  @Input() vcMoRef: string;

  steps: Step[];
  workflowModel: SampleWorkflowModel;

  private readonly workflowService = inject(SampleWorkflowService);

  ngOnInit(): void {
    this.workflowModel = this.workflowService.initModel(this.vcMoRef);
    this.steps = this.workflowService.buildStepperSteps(this.workflowModel);
  }

  onModelChange(changes: ModelChange[]): void {
    console.debug('Stepper model changed', changes);
  }

  onFinish(): void {
    this.workflowService.apply();
  }
}
