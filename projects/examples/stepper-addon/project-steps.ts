/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Out, StepModel, StepModelHolder, Var } from '@clr/addons/var';

/* ---- Step 1 model ---- */
export class ProjectNameModel implements StepModel {
  @Out() name: Var<string> = Var.of('Test');
  readyToComplete = true;
}

@Component({
  selector: 'clr-demo-stepper-step1',
  imports: [FormsModule],
  template: `
    <div class="clr-form-group">
      <label class="clr-control-label" for="proj-name">Project Name</label>
      <div class="clr-control-container">
        <input id="proj-name" type="text" class="clr-input" [(ngModel)]="model.name.value" required />
      </div>
    </div>
  `,
})
export class StepperStep1Component implements StepModelHolder {
  model: ProjectNameModel;
}

/* ---- Step 2 model ---- */
export class TeamModel implements StepModel {
  @Out() team: Var<string> = Var.of('frontend');
  readyToComplete = true;
}

@Component({
  selector: 'clr-demo-stepper-step2',
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
  @Out() name: Var<string> = Var.of();
  @Out() team: Var<string> = Var.of();
}
