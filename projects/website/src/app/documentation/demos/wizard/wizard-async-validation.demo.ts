/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrAlertModule,
  ClrCommonFormsModule,
  ClrInputModule,
  ClrSpinnerModule,
  ClrWizard,
  ClrWizardModule,
} from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const code = `
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
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ClrAlertModule, ClrSpinnerModule, ClrWizardModule, ClrFormsModule, FormsModule],
})
export class ExampleComponent {
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
`;

const html = `
<button class="btn btn-primary" (click)="wizard.open()">Wizard Async Form Validation</button>

<clr-wizard #wizard [(clrWizardOpen)]="open">
  <clr-wizard-title>Async validation</clr-wizard-title>

  <clr-wizard-button [type]="'cancel'">Cancel</clr-wizard-button>
  <clr-wizard-button [type]="'previous'">Back</clr-wizard-button>
  <clr-wizard-button [type]="'next'">Next</clr-wizard-button>
  <clr-wizard-button [type]="'finish'">Finish</clr-wizard-button>

  <clr-wizard-page
    clrWizardPagePreventDefault="true"
    (clrWizardPageOnCommit)="onCommit()"
    (clrWizardPageOnCancel)="doCancel()"
  >
    <ng-template clrPageTitle>Form with async validation</ng-template>
    @if (loadingFlag) {
      <clr-spinner>Loading</clr-spinner>
    }
    <clr-alert
      [clrAlertType]="'alert-info'"
      [clrAlertClosable]="false"
      [clrCloseButtonAriaLabel]="'Close Wiki alert'"
    >
      <clr-alert-item>
        This&nbsp;
        <a
          href="https://en.wikipedia.org/wiki/42_(number)#The_Hitchhiker.27s_Guide_to_the_Galaxy"
          target="_blank"
        >
          wiki article
        </a>
        &nbsp;might help you answer the question.
      </clr-alert-item>
    </clr-alert>
    @if (errorFlag) {
      <clr-alert [clrAlertType]="'alert-danger'" [clrCloseButtonAriaLabel]="'Close Answer alert'">
        <clr-alert-item>Your answer is incorrect.</clr-alert-item>
      </clr-alert>
    }

    <form clrForm #myForm="ngForm" [class.hide]="loadingFlag">
      <clr-input-container>
        <label>The answer to life, the universe and everything</label>
        <input clrInput [(ngModel)]="answer" name="answer" />
      </clr-input-container>
    </form>
  </clr-wizard-page>
  <clr-wizard-page>
    <ng-template clrPageTitle>Wizard complete</ng-template>
    <p>Congratulations! Now you know the answer to life, the universe and everything!</p>
  </clr-wizard-page>
</clr-wizard>
`;

@Component({
  selector: 'clr-wizard-async-validation',
  templateUrl: './wizard-async-validation.demo.html',
  imports: [
    ClrWizardModule,
    ClrSpinnerModule,
    ClrAlertModule,
    FormsModule,
    ClrCommonFormsModule,
    ClrInputModule,
    StackblitzExampleComponent,
  ],
})
export class WizardAsyncValidation {
  readonly wizard = viewChild<ClrWizard>('wizard');
  readonly formData = viewChild<any>('myForm');

  loadingFlag = false;
  errorFlag = false;
  answer: number | null = null;
  open = false;

  code = code;
  html = html;

  // have to define doCancel because page will prevent doCancel from working
  // if the page had a previous button, you would need to call
  // this.wizard.previous() manually as well...
  doCancel(): void {
    this.wizard()?.close();
  }

  onCommit(): void {
    const value: any = this.formData().value;
    this.loadingFlag = true;
    this.errorFlag = false;

    setTimeout(() => {
      if (value.answer === '42') {
        this.wizard()?.forceNext();
      } else {
        this.errorFlag = true;
      }
      this.loadingFlag = false;
    }, 1000);
  }
}
