/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

export class NameModel {
  name = '';
}

export class ReviewModel {}

@Component({
  selector: 'clr-basic-dialog-name-step',
  imports: [FormsModule],
  template: `
    @if (model) {
      <div>
        <label>Name</label>
        <input class="clr-input" type="text" [(ngModel)]="model.name" />
      </div>
    }
  `,
})
export class BasicDialogNameStepComponent {
  model: NameModel;
}

@Component({
  selector: 'clr-basic-dialog-review-step',
  template: `
    <p>Ready to submit.</p>
  `,
})
export class BasicDialogReviewStepComponent {}
