/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AppfxMultiPageDialogModule } from '@clr/addons/dialog';
import { Step, StepModel, StepModelHolder, TabLayout, Var } from '@clr/addons/var';

class NameModel implements StepModel {
  name = Var.of<string>('');
  readyToComplete = true;
}

class ReviewModel implements StepModel {
  readyToComplete = true;
}

class DialogWorkflowModel {}

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
export class DialogNameStepComponent implements StepModelHolder {
  model: NameModel;
}

@Component({
  selector: 'clr-dialog-story-review-step',
  standalone: true,
  imports: [CommonModule],
  template: '<p>Ready to complete.</p>',
})
export class DialogReviewStepComponent {}

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
export class DialogStoryWrapperComponent implements OnInit {
  title = 'Dialog Title';
  @Input() tabLayout: TabLayout = TabLayout.horizontal;
  @Input() size: string;
  @Input() defaultButton: 'submit' | 'close' = 'close';
  @Input() showTabLinks = true;
  @Input() opened = true;

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
