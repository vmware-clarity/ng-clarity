/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';

@Component({
  selector: 'clr-buttons-demo-button-loading',
  templateUrl: './button-loading.html',
  styleUrls: ['./buttons.demo.scss'],
})
export class ButtonLoadingDemo {
  validateState: ClrLoadingState = ClrLoadingState.DEFAULT;
  submitState: ClrLoadingState = ClrLoadingState.DEFAULT;
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

  validateDemo() {
    this.validateState = ClrLoadingState.LOADING;
    setTimeout(() => {
      this.validateState = ClrLoadingState.SUCCESS;
    }, 1500);
  }

  submitDemo() {
    this.submitState = ClrLoadingState.LOADING;
    setTimeout(() => {
      this.submitState = ClrLoadingState.DEFAULT;
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
