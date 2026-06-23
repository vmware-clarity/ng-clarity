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

/* ---- Step 1 model ---- */
export class ProjectNameModel implements StepModel {
  name = Var.of<string>('');
  readyToComplete = true;
}

@Component({
  selector: 'clr-demo-stepper-step1',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="clr-form-group">
      <label class="clr-control-label" for="proj-name">Project Name</label>
      <div class="clr-control-container">
        <input id="proj-name" type="text" class="clr-input" [(ngModel)]="model.name.value" />
      </div>
    </div>
  `,
})
export class StepperStep1Component implements StepModelHolder {
  model: ProjectNameModel;
}

/* ---- Step 2 model ---- */
export class TeamModel implements StepModel {
  team = Var.of<string>('frontend');
  readyToComplete = true;
}

@Component({
  selector: 'clr-demo-stepper-step2',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="clr-form-group">
      <label class="clr-control-label" for="team-select">Assign Team</label>
      <div class="clr-control-container">
        <div class="clr-select-wrapper">
          <select id="team-select" class="clr-select" [(ngModel)]="model.team.value">
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="platform">Platform</option>
          </select>
        </div>
      </div>
    </div>
  `,
})
export class StepperStep2Component implements StepModelHolder {
  model: TeamModel;
}

/* ---- Workflow model ---- */
export class ProjectWorkflowModel {
  name = Var.of<string>('');
  team = Var.of<string>('frontend');
}

@Component({
  selector: 'clr-basic-stepper-demo',
  standalone: true,
  imports: [CommonModule, AppfxStepperModule, StepperStep1Component, StepperStep2Component],
  template: `
    <appfx-stepper [steps]="steps" [wizardModel]="model" (onFinish)="onFinish()"></appfx-stepper>

    <div class="clr-mt-24px alert alert-success" *ngIf="submitted">
      <div class="alert-items">
        <div class="alert-item static">
          <span class="alert-text">
            Created project <strong>{{ result?.name }}</strong> for team <strong>{{ result?.team }}</strong
            >.
          </span>
        </div>
      </div>
    </div>
  `,
})
export class BasicStepperDemoComponent implements OnInit {
  model = new ProjectWorkflowModel();
  steps: Step[];
  submitted = false;
  result: { name: string; team: string } | null = null;

  ngOnInit() {
    this.steps = [
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
  }

  onFinish() {
    this.result = { name: this.model.name.value, team: this.model.team.value };
    this.submitted = true;
  }
}
