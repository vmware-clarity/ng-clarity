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
  ClrWizardPage,
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
  ClrWizardPage,
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
`;

const html = `
<button class="btn btn-primary" (click)="wizard.open()">Wizard Async Completion</button>

<clr-wizard #wizard [(clrWizardOpen)]="open" (clrWizardCurrentPageChange)="resetFinalPage()">
  <clr-wizard-title>Async validation on completion</clr-wizard-title>

  <clr-wizard-button [type]="'cancel'">Cancel</clr-wizard-button>
  <clr-wizard-button [type]="'previous'">Back</clr-wizard-button>
  <clr-wizard-button [type]="'next'">Next</clr-wizard-button>
  <clr-wizard-button [type]="'finish'">
    {{ finished ? 'Done' : 'Check Form' }}
  </clr-wizard-button>

  <clr-wizard-page>
    <ng-template clrPageTitle>Form question</ng-template>

    <clr-alert
      [clrAlertType]="'info'"
      [clrAlertClosable]="false"
      [clrCloseButtonAriaLabel]="'Close Wiki alert'"
    >
      <div class="alert-item">
        This&nbsp;
        <a
          href="https://en.wikipedia.org/wiki/42_(number)#The_Hitchhiker.27s_Guide_to_the_Galaxy"
          target="_blank"
        >
          wiki article
        </a>
        &nbsp;might help you answer the question.
      </div>
    </clr-alert>
    <form clrForm #myForm="ngForm">
      <clr-input-container>
        <label>The answer to life, the universe and everything</label>
        <input clrInput [(ngModel)]="answer" name="answer" />
      </clr-input-container>
    </form>
  </clr-wizard-page>
  <clr-wizard-page
    #myFinishPage
    clrWizardPagePreventDefault="true"
    (clrWizardPageOnCommit)="onCommit()"
    (clrWizardPageOnCancel)="doCancel()"
    (clrWizardPagePrevious)="goBack()"
  >
    <ng-template clrPageTitle>Async validation on finish</ng-template>

    @if (errorFlag) {
      <clr-alert [clrAlertType]="'danger'" [clrCloseButtonAriaLabel]="'Close Answer alert'">
        <div class="alert-item">Your answer is incorrect.</div>
      </clr-alert>
    }

    @if (loadingFlag) {
      <clr-spinner>Loading</clr-spinner>
    }

    @if (errorFlag && !loadingFlag) {
      <p>Go back and try again!</p>
    }

    @if (showCongrats && !loadingFlag) {
      <p>Congratulations! Now you know the answer to life, the universe and everything!</p>
    }

    @if (!checked && !loadingFlag) {
      <p>Click finish to see if you got the answer right.</p>
    }
  </clr-wizard-page>
</clr-wizard>
`;

@Component({
  selector: 'clr-wizard-async-completion',
  templateUrl: './wizard-async-completion.demo.html',
  imports: [
    ClrWizardModule,
    ClrAlertModule,
    FormsModule,
    ClrCommonFormsModule,
    ClrInputModule,
    ClrSpinnerModule,
    StackblitzExampleComponent,
  ],
})
export class WizardAsyncCompletion {
  readonly wizard = viewChild<ClrWizard>('wizard');
  readonly formData = viewChild<any>('myForm');
  readonly finishPage = viewChild<ClrWizardPage>('myFinishPage');

  loadingFlag = false;
  errorFlag = false;
  checked = false;
  finished = false;
  open = false;
  answer: number | null = null;

  code = code;
  html = html;

  get showCongrats(): boolean {
    return !this.errorFlag && this.checked;
  }

  // have to define doCancel because page will prevent doCancel from working
  // if the page had a previous button, you would need to call
  // this.wizard.previous() manually as well...
  doCancel(): void {
    this.wizard()?.close();
  }

  resetFinalPage(): void {
    this.loadingFlag = false;
    this.errorFlag = false;
    this.checked = false;
  }

  goBack(): void {
    this.wizard()?.previous();
  }

  doFinish(): void {
    this.wizard()?.forceFinish();
    this.resetFinalPage();
  }

  onCommit(): void {
    const value: any = this.formData().value;
    this.loadingFlag = true;
    this.errorFlag = false;

    if (this.finished) {
      this.doFinish();
      return;
    }

    setTimeout(() => {
      const finishPage = this.finishPage();
      if (value.answer === '42') {
        this.finished = true;
      } else if (finishPage) {
        finishPage.completed = false;
        this.errorFlag = true;
      }
      this.checked = true;
      this.loadingFlag = false;
    }, 1000);
  }
}
