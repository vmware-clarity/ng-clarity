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
  ClrWizardPage,
} from '@clr/angular';

@Component({
  selector: 'clr-wizard-async-completion-example',
  templateUrl: './async-completion.example.html',
  imports: [ClrAlertModule, ClrSpinnerModule, ClrWizardModule, ClrFormsModule, FormsModule],
})
export class WizardAsyncCompletionExample {
  @ViewChild('wizard', { static: true }) wizard: ClrWizard | undefined;
  @ViewChild('myForm', { static: true }) formData: any;
  @ViewChild('myFinishPage', { static: true }) finishPage: ClrWizardPage | undefined;

  loadingFlag = false;
  errorFlag = false;
  checked = false;
  finished = false;
  open = false;
  answer: number | null = null;

  get showCongrats(): boolean {
    return !this.errorFlag && this.checked;
  }

  doCancel(): void {
    this.wizard?.close();
  }

  resetFinalPage(): void {
    this.loadingFlag = false;
    this.errorFlag = false;
    this.checked = false;
  }

  goBack(): void {
    this.wizard?.previous();
  }

  doFinish(): void {
    this.wizard?.forceFinish();
    this.resetFinalPage();
  }

  onCommit(): void {
    const value: any = this.formData.value;
    this.loadingFlag = true;
    this.errorFlag = false;

    if (this.finished) {
      this.doFinish();
      return;
    }

    setTimeout(() => {
      if (value.answer === '42') {
        this.finished = true;
      } else if (this.finishPage) {
        this.finishPage.completed = false;
        this.errorFlag = true;
      }
      this.checked = true;
      this.loadingFlag = false;
    }, 1000);
  }
}
