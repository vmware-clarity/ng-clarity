/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppfxStepperModule, StepperComponent } from '@clr/addons/stepper';
import { AppfxWorkflowCoreModule, Step, StepModel, StepModelHolder, Var } from '@clr/addons/var';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

class Step1Model implements StepModel {
  projectName = Var.of<string>('');
  readyToComplete = true;
}

@Component({
  selector: 'clr-story-stepper-step1',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="clr-form-group">
      <label class="clr-control-label" for="pname">Project Name</label>
      <input id="pname" type="text" class="clr-input" [(ngModel)]="model.projectName.value" />
    </div>
  `,
})
class StepperStoryStep1 implements StepModelHolder {
  model: Step1Model;
}

class Step2Model implements StepModel {
  team = Var.of<string>('frontend');
  readyToComplete = true;
}

@Component({
  selector: 'clr-story-stepper-step2',
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
class StepperStoryStep2 implements StepModelHolder {
  model: Step2Model;
}

class ProjectModel {
  projectName = Var.of<string>('');
  team = Var.of<string>('frontend');
}

@Component({
  selector: 'clr-stepper-story-wrapper',
  standalone: true,
  imports: [CommonModule, AppfxStepperModule, StepperStoryStep1, StepperStoryStep2],
  template: `
    <appfx-stepper
      [steps]="steps"
      [wizardModel]="model"
      [usePrimaryNextButton]="usePrimaryNextButton"
      (onFinish)="finished = true"
    ></appfx-stepper>
    <div class="clr-mt-16px" *ngIf="finished">
      <span class="label label-success">Finished!</span>
    </div>
  `,
})
class StepperStoryWrapperComponent implements OnInit {
  usePrimaryNextButton = false;
  finished = false;
  model = new ProjectModel();
  steps: Step[];

  ngOnInit() {
    this.steps = [
      { title: 'Project Name', componentClass: StepperStoryStep1, model: new Step1Model() },
      { title: 'Team', componentClass: StepperStoryStep2, model: new Step2Model() },
    ];
  }
}

export default {
  title: 'Addons/Stepper',
  component: StepperComponent,
  decorators: [
    moduleMetadata({
      imports: [AppfxStepperModule, AppfxWorkflowCoreModule, CommonModule, StepperStoryWrapperComponent],
    }),
  ],
  argTypes: {
    usePrimaryNextButton: { control: { type: 'boolean' } },
  },
  args: {
    usePrimaryNextButton: false,
  },
};

const StepperTemplate: StoryFn = args => ({
  props: args,
  template: `
    <clr-stepper-story-wrapper [usePrimaryNextButton]="usePrimaryNextButton"></clr-stepper-story-wrapper>
  `,
});

export const Default: StoryObj = {
  render: StepperTemplate,
};

export const PrimaryButton: StoryObj = {
  render: StepperTemplate,
  args: { usePrimaryNextButton: true },
};
