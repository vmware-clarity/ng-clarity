/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppfxWorkflowCoreModule, CloseHandler, Step, StepModel, StepModelHolder, Var } from '@clr/addons/var';
import { AppfxWizardModule, WizardComponent } from '@clr/addons/wizard';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

class Step1Model implements StepModel {
  name = Var.of<string>('');
  readyToComplete = true;
}

@Component({
  selector: 'clr-story-wizard-step1',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="clr-form-group">
      <label class="clr-control-label" for="name">Name</label>
      <input id="name" type="text" class="clr-input" [(ngModel)]="model.name.value" />
    </div>
  `,
})
class WizardStoryStep1 implements StepModelHolder {
  model: Step1Model;
}

class Step2Model implements StepModel {
  region = Var.of<string>('us-east');
  readyToComplete = true;
}

@Component({
  selector: 'clr-story-wizard-step2',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="clr-select-wrapper">
      <select class="clr-select" [(ngModel)]="model.region.value">
        <option value="us-east">US East</option>
        <option value="us-west">US West</option>
        <option value="eu-central">EU Central</option>
      </select>
    </div>
  `,
})
class WizardStoryStep2 implements StepModelHolder {
  model: Step2Model;
}

class DemoModel {
  name = Var.of<string>('');
  region = Var.of<string>('us-east');
}

@Component({
  selector: 'clr-wizard-story-wrapper',
  standalone: true,
  imports: [CommonModule, AppfxWizardModule, WizardStoryStep1, WizardStoryStep2],
  template: `
    <button class="btn btn-primary" (click)="open()">{{ label }}</button>
    <appfx-wizard
      [title]="title"
      [pages]="steps"
      [wizardModel]="model"
      [opened]="isOpen"
      (openedChange)="isOpen = $event"
      [size]="size"
      [closeHandler]="closeHandler"
    ></appfx-wizard>
  `,
})
class WizardStoryWrapperComponent implements OnInit {
  label = 'Open Wizard';
  title = 'Create Workload';
  size = 'lg';
  isOpen = false;
  model = new DemoModel();
  steps: Step[];
  closeHandler: CloseHandler = {
    onSubmit: (): Observable<void> => of(undefined).pipe(delay(300)),
  };

  ngOnInit() {
    this.steps = [
      { title: 'Name', componentClass: WizardStoryStep1, model: new Step1Model() },
      { title: 'Region', componentClass: WizardStoryStep2, model: new Step2Model() },
    ];
  }

  open() {
    this.model = new DemoModel();
    this.isOpen = true;
  }
}

export default {
  title: 'Addons/Wizard',
  component: WizardComponent,
  decorators: [
    moduleMetadata({
      imports: [AppfxWizardModule, AppfxWorkflowCoreModule, CommonModule, WizardStoryWrapperComponent],
    }),
  ],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['md', 'lg', 'xl', 'full-screen'],
    },
  },
  args: {
    label: 'Open Wizard',
    title: 'Create Workload',
    size: 'lg',
  },
};

const WizardTemplate: StoryFn = args => ({
  props: args,
  template: `
    <clr-wizard-story-wrapper [label]="label" [title]="title" [size]="size"></clr-wizard-story-wrapper>
  `,
});

export const Default: StoryObj = {
  render: WizardTemplate,
};

export const FullScreen: StoryObj = {
  render: WizardTemplate,
  args: { size: 'full-screen', label: 'Open Full-Screen Wizard' },
};
