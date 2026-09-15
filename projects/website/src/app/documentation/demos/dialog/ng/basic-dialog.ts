/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppfxMultiPageDialogModule } from '@clr/addons/dialog';
import { Step, TabLayout } from '@clr/addons/var';

class NameModel {
  name = '';
}

class ReviewModel {}

@Component({
  selector: 'clr-basic-dialog-name-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="model">
      <label>Name</label>
      <input class="clr-input" type="text" [(ngModel)]="model.name" />
    </div>
  `,
})
export class BasicDialogNameStepComponent {
  model: NameModel;
}

@Component({
  selector: 'clr-basic-dialog-review-step',
  standalone: true,
  imports: [CommonModule],
  template: `<p>Ready to submit.</p>`,
})
export class BasicDialogReviewStepComponent {}

@Component({
  selector: 'clr-basic-dialog-demo',
  standalone: true,
  imports: [CommonModule, AppfxMultiPageDialogModule, BasicDialogNameStepComponent, BasicDialogReviewStepComponent],
  templateUrl: 'basic-dialog.html',
})
export class BasicDialogDemoComponent implements OnInit {
  TabLayout = TabLayout;
  dialogOpened = false;
  steps: Step[] = [];
  dialogModel = {};

  ngOnInit() {
    const nameModel = new NameModel();
    this.steps = [
      {
        title: 'Name',
        navTitle: 'Name',
        componentClass: BasicDialogNameStepComponent,
        model: nameModel,
      } as Step,
      {
        title: 'Ready to Complete',
        navTitle: 'Review',
        componentClass: BasicDialogReviewStepComponent,
        model: new ReviewModel(),
      } as Step,
    ];
  }
}
