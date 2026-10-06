/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrButtonModule, ClrLoadingModule, ClrLoadingState } from '@clr/angular';

@Component({
  selector: 'clr-button-loading-example',
  templateUrl: './loading.example.html',
  imports: [ClrButtonModule, ClrLoadingModule],
})
export class ButtonLoadingExample {
  validateBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
  submitBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

  validateDemo() {
    this.validateBtnState = ClrLoadingState.LOADING;

    // Use actual validation logic in a real application.
    setTimeout(() => {
      this.validateBtnState = ClrLoadingState.SUCCESS;
    }, 1500);
  }

  submitDemo() {
    this.submitBtnState = ClrLoadingState.LOADING;

    // Use actual submit logic in a real application.
    setTimeout(() => {
      this.submitBtnState = ClrLoadingState.DEFAULT;
    }, 1500);
  }
}
