/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppfxStepperModule } from '@clr/addons/stepper';
import { Step, StepModel, StepModelHolder, Var } from '@clr/addons/var';

class NameModel implements StepModel {
  name = Var.of<string>('');
  readyToComplete = true;
}

@Component({
  selector: 'clr-demo-app-stepper-step1',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="clr-form-group">
      <label class="clr-control-label" for="stp-name">Project Name</label>
      <input id="stp-name" type="text" class="clr-input" [(ngModel)]="model.name.value" />
    </div>
  `,
})
class DemoStepperStep1 implements StepModelHolder {
  model: NameModel;
}

class TeamModel implements StepModel {
  team = Var.of<string>('frontend');
  readyToComplete = true;
}

@Component({
  selector: 'clr-demo-app-stepper-step2',
  standalone: true,
  imports: [FormsModule],
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
  name = Var.of<string>('');
  team = Var.of<string>('frontend');
}

@Component({
  selector: 'clr-stepper-addon-demo',
  standalone: true,
  imports: [CommonModule, AppfxStepperModule, DemoStepperStep1, DemoStepperStep2],
  templateUrl: './stepper-addon.demo.html',
})
export class StepperAddonDemo implements OnInit {
  model = new ProjectModel();
  steps: Step[];
  done = false;

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
    this.done = true;
  }

  reset() {
    this.done = false;
    this.model = new ProjectModel();
    this.ngOnInit();
  }
}
