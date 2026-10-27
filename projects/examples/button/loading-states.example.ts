/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrButtonModule, ClrIcon, ClrLoadingModule, ClrLoadingState } from '@clr/angular';

@Component({
  selector: 'clr-button-loading-states-example',
  templateUrl: './loading-states.example.html',
  imports: [ClrButtonModule, ClrIcon, ClrLoadingModule],
})
export class ButtonLoadingStatesExample {
  disabledState: ClrLoadingState = ClrLoadingState.DEFAULT;
  enabledState: ClrLoadingState = ClrLoadingState.DEFAULT;
  disabledStateDisabled = false;
  enabledStateDisabled = false;

  validateSmState = false;
  submitSmState: ClrLoadingState = ClrLoadingState.DEFAULT;
  validateFalsyState: any;

  disabledDemo() {
    this.disabledState = ClrLoadingState.LOADING;
    setTimeout(() => {
      this.disabledState = ClrLoadingState.SUCCESS;
      this.disabledStateDisabled = true;
    }, 1500);
  }

  enabledDemo() {
    this.enabledState = ClrLoadingState.LOADING;
    setTimeout(() => {
      this.enabledState = ClrLoadingState.SUCCESS;
      this.enabledStateDisabled = false;
    }, 1500);
  }

  validateSmDemo() {
    this.validateSmState = true;
    setTimeout(() => {
      this.validateSmState = false;
    }, 1500);
  }

  submitSmDemo() {
    this.submitSmState = ClrLoadingState.LOADING;
    setTimeout(() => {
      this.submitSmState = ClrLoadingState.DEFAULT;
    }, 1500);
  }

  validateFalsyDemo() {
    this.validateFalsyState = true;
    setTimeout(() => {
      this.validateFalsyState = null;
    }, 1500);
  }
}
