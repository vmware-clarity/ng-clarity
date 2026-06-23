/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppfxMultiPageDialogModule, DialogComponent } from '@clr/addons/dialog';
import {
  AppfxWorkflowCoreModule,
  Step,
  StepModel,
  StepModelHolder,
  TabLayout,
  Var,
  WorkflowModel,
} from '@clr/addons/var';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

// ─── Step models ─────────────────────────────────────────────────────────────

class NameModel implements StepModel {
  name = Var.of<string>('');
  readyToComplete = true;
}

class ReviewModel implements StepModel {
  readyToComplete = true;
}

class DialogWorkflowModel extends WorkflowModel {}

// ─── Step components ─────────────────────────────────────────────────────────

@Component({
  selector: 'clr-dialog-story-name-step',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="model">
      <label class="clr-control-label">Name</label>
      <input
        class="clr-input"
        type="text"
        [value]="model.name.value"
        (input)="model.name.value = $any($event.target).value"
      />
    </div>
  `,
})
class DialogNameStepComponent implements StepModelHolder {
  model: NameModel;
}

@Component({
  selector: 'clr-dialog-story-review-step',
  standalone: true,
  imports: [CommonModule],
  template: ` <p>Ready to complete.</p> `,
})
class DialogReviewStepComponent {}

// ─── Wrapper ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'clr-dialog-story-wrapper',
  standalone: true,
  imports: [CommonModule, AppfxMultiPageDialogModule, DialogNameStepComponent, DialogReviewStepComponent],
  template: `
    <button class="btn btn-primary" (click)="opened = true">Open Dialog</button>
    <appfx-dialog
      [(opened)]="opened"
      [steps]="steps"
      [model]="model"
      [title]="title"
      [tabLayout]="tabLayout"
      [size]="size"
      [defaultButton]="defaultButton"
      [showTabLinks]="showTabLinks"
    ></appfx-dialog>
  `,
})
class DialogStoryWrapperComponent implements OnInit {
  title = 'Dialog Title';
  tabLayout: TabLayout = TabLayout.horizontal;
  size: string;
  defaultButton: 'submit' | 'close' = 'close';
  showTabLinks = true;

  opened = false;
  steps: Step[] = [];
  model = new DialogWorkflowModel();

  ngOnInit() {
    this.steps = [
      { title: 'Name', navTitle: 'Name', componentClass: DialogNameStepComponent, model: new NameModel() } as Step,
      {
        title: 'Review',
        navTitle: 'Review',
        componentClass: DialogReviewStepComponent,
        model: new ReviewModel(),
      } as Step,
    ];
  }
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export default {
  title: 'Addons/Dialog',
  component: DialogComponent,
  decorators: [
    moduleMetadata({
      imports: [AppfxMultiPageDialogModule, AppfxWorkflowCoreModule, CommonModule, DialogStoryWrapperComponent],
    }),
  ],
  argTypes: {
    tabLayout: {
      control: { type: 'select' },
      options: Object.values(TabLayout),
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'full-screen'],
    },
    defaultButton: {
      control: { type: 'select' },
      options: ['submit', 'close'],
    },
    showTabLinks: { control: 'boolean' },
  },
  args: {
    tabLayout: TabLayout.horizontal,
    size: 'xl',
    defaultButton: 'close',
    showTabLinks: true,
  },
};

type Story = StoryObj<DialogComponent>;

const template: StoryFn<DialogStoryWrapperComponent> = args => ({
  props: args,
  component: DialogStoryWrapperComponent,
});

export const Default: Story = {
  render: template,
};

export const VerticalTabs: Story = {
  render: template,
  args: {
    tabLayout: TabLayout.vertical,
  },
};

export const SubmitDefault: Story = {
  render: template,
  args: {
    defaultButton: 'submit',
  },
};
