/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { AppfxStepperModule } from '@clr/addons/stepper';
import { Step } from '@clr/addons/var';

import {
  ProjectNameModel,
  ProjectWorkflowModel,
  StepperStep1Component,
  StepperStep2Component,
  TeamModel,
} from './project-steps';

@Component({
  selector: 'clr-stepper-addon-basic-example',
  templateUrl: './basic.example.html',
  imports: [AppfxStepperModule],
})
export class StepperAddonBasicExample {
  model = new ProjectWorkflowModel();
  steps: Step[] = [
    {
      title: 'Project Name',
      description: 'Enter a unique name for your project',
      componentClass: StepperStep1Component,
      model: new ProjectNameModel(),
    },
    {
      title: 'Assign Team',
      description: 'Select which team owns this project',
      componentClass: StepperStep2Component,
      model: new TeamModel(),
    },
  ];
  submitted = false;
  result: { name: string; team: string } | null = null;

  onFinish() {
    this.result = { name: this.model.name.value, team: this.model.team.value };
    this.submitted = true;
  }
}
