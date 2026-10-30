/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';

@Component({
  selector: 'clr-buttons-demo-button-loading',
  templateUrl: './button-loading.html',
  styleUrls: ['./buttons.demo.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
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
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  disabledDemo() {
    this.disabledState = ClrLoadingState.LOADING;
    setTimeout(() => {
      this.disabledState = ClrLoadingState.SUCCESS;
      this.disabledStateDisabled = true;
      this.changeDetectorRef.markForCheck();
    }, 1500);
  }

  enabledDemo() {
    this.enabledState = ClrLoadingState.LOADING;
    setTimeout(() => {
      this.enabledState = ClrLoadingState.SUCCESS;
      this.enabledStateDisabled = false;
      this.changeDetectorRef.markForCheck();
    }, 1500);
  }

  validateDemo() {
    this.validateState = ClrLoadingState.LOADING;
    setTimeout(() => {
      this.validateState = ClrLoadingState.SUCCESS;
      this.changeDetectorRef.markForCheck();
    }, 1500);
  }

  submitDemo() {
    this.submitState = ClrLoadingState.LOADING;
    setTimeout(() => {
      this.submitState = ClrLoadingState.DEFAULT;
      this.changeDetectorRef.markForCheck();
    }, 1500);
  }

  validateSmDemo() {
    this.validateSmState = true;
    setTimeout(() => {
      this.validateSmState = false;
      this.changeDetectorRef.markForCheck();
    }, 1500);
  }

  submitSmDemo() {
    this.submitSmState = ClrLoadingState.LOADING;
    setTimeout(() => {
      this.submitSmState = ClrLoadingState.DEFAULT;
      this.changeDetectorRef.markForCheck();
    }, 1500);
  }

  validateFalsyDemo() {
    this.validateFalsyState = true;
    setTimeout(() => {
      this.validateFalsyState = null;
      this.changeDetectorRef.markForCheck();
    }, 1500);
  }
}
