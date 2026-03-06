/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrLoadingButtonModule, ClrLoadingModule, ClrLoadingState } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const MAIN_TS_EXAMPLE = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ClrButtonModule, ClrLoadingModule],
})
export class ExampleComponent {
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
`;

const MAIN_HTML_EXAMPLE = `
<button [clrLoading]="validateBtnState" class="btn btn-info-outline" (click)="validateDemo()">
  Validate
</button>
<button
  [clrLoading]="submitBtnState"
  type="submit"
  class="btn btn-success-outline"
  (click)="submitDemo()"
>
  Submit
</button>
`;

@Component({
  selector: 'clr-buttons-demo-button-loading',
  templateUrl: './button-loading.html',
  styleUrl: './buttons.demo.scss',
  imports: [ClrLoadingButtonModule, ClrLoadingModule, StackblitzExampleComponent],
})
export class ButtonLoadingDemo {
  mainTSExample = MAIN_TS_EXAMPLE;
  mainHTMLExample = MAIN_HTML_EXAMPLE;

  validateBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
  submitBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

  validateDemo() {
    this.validateBtnState = ClrLoadingState.LOADING;
    setTimeout(() => {
      this.validateBtnState = ClrLoadingState.SUCCESS;
    }, 1500);
  }

  submitDemo() {
    this.submitBtnState = ClrLoadingState.LOADING;
    setTimeout(() => {
      this.submitBtnState = ClrLoadingState.DEFAULT;
    }, 1500);
  }
}
