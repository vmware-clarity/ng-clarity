/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppfxStepperModule } from '@clr/addons/stepper';
import { Out, Step, StepModel, StepModelHolder, Var } from '@clr/addons/var';

class NameModel implements StepModel {
  @Out() name: Var<string> = Var.of('Test');
  readyToComplete = true;
}

@Component({
  selector: 'clr-demo-app-stepper-step1',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  template: `
    <div class="clr-form-group">
      <label class="clr-control-label" for="step-name">Project Name</label>
      <input id="step-name" type="text" class="clr-input" [(ngModel)]="model.name.value" required />
    </div>
  `,
})
class DemoStepperStep1 implements StepModelHolder {
  model: NameModel;
}

class TeamModel implements StepModel {
  @Out() team: Var<string> = Var.of('frontend');
  readyToComplete = true;
}

@Component({
  selector: 'clr-demo-app-stepper-step2',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  template: `
    <div class="clr-select-wrapper">
      <select class="clr-select" [(ngModel)]="model.team.value">
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
        <option value="platform">Platform</option>
      </select>
    </div>
  `,
})
class DemoStepperStep2 implements StepModelHolder {
  model: TeamModel;
}

class ProjectModel {
  @Out() name: Var<string> = Var.of();
  @Out() team: Var<string> = Var.of();
}

@Component({
  selector: 'clr-stepper-addon-demo',
  standalone: true,
  imports: [CommonModule, AppfxStepperModule],
  templateUrl: './stepper-addon.demo.html',
})
export class StepperAddonDemo implements OnInit {
  model = new ProjectModel();
  steps: Step[];
  submitted = false;
  result: { name: string; team: string } | null = null;

  ngOnInit() {
    this.steps = [
      {
        title: 'Project Name',
        description: 'Enter a unique name',
        componentClass: DemoStepperStep1,
        model: new NameModel(),
      },
      {
        title: 'Assign Team',
        description: 'Select owner team',
        componentClass: DemoStepperStep2,
        model: new TeamModel(),
      },
    ];
  }

  onFinish() {
    this.result = { name: this.model.name.value, team: this.model.team.value };
    this.submitted = true;
  }

  onModelChange(event) {
    console.log(event);
  }

  reset() {
    this.submitted = false;
    this.result = null;
    this.model = new ProjectModel();
    this.ngOnInit();
  }
}
