/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrAlertModule,
  ClrFormsModule,
  ClrSpinnerModule,
  ClrWizard,
  ClrWizardModule,
} from '@clr/angular';

@Component({
  selector: 'clr-wizard-async-validation-example',
  templateUrl: './async-validation.example.html',
  imports: [ClrAlertModule, ClrSpinnerModule, ClrWizardModule, ClrFormsModule, FormsModule],
})
export class WizardAsyncValidationExample {
  @ViewChild('wizard', { static: true }) wizard: ClrWizard | undefined;
  @ViewChild('myForm', { static: true }) formData: any;

  loadingFlag = false;
  errorFlag = false;
  answer: number | null = null;
  open = false;

  doCancel(): void {
    this.wizard?.close();
  }

  onCommit(): void {
    const value: any = this.formData.value;
    this.loadingFlag = true;
    this.errorFlag = false;

    setTimeout(() => {
      if (value.answer === '42') {
        this.wizard?.forceNext();
      } else {
        this.errorFlag = true;
      }
      this.loadingFlag = false;
    }, 1000);
  }
}
