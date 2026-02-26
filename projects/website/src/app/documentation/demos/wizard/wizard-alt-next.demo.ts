/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrAlertModule,
  ClrCheckboxModule,
  ClrCommonFormsModule,
  ClrNumberInputModule,
  ClrWizard,
  ClrWizardModule,
} from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const code = `
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styles: ['.stress { color: var(--cds-alias-status-danger); }'],

  imports: [CommonModule, ClrWizardModule, ClrAlertModule, ClrFormsModule, FormsModule],
})
export class ExampleComponent implements OnInit {
  @ViewChild('wizard', { static: true }) wizard: ClrWizard | undefined;

  open = false;
  showCancelConfirm = false;

  model: any;
  stressText = false;
  errorFlag = false;

  ngOnInit() {
    this.model = {
      allowNext: false,
      sequenceOne: '',
      sequenceTwo: '',
      sequenceThree: '',
    };
  }

  pageCustomNext(): void {
    if (confirm('Are you sure you got it right?')) {
      this.errorFlag = false;
      this.wizard?.forceNext();
    }
  }

  doFinish() {
    const sequenceOneIsCorrect = this.model.sequenceOne === 3;
    const sequenceTwoIsCorrect = this.model.sequenceTwo === 5;
    const sequenceThreeIsCorrect = this.model.sequenceThree === 8;
    const allAreCorrect = sequenceOneIsCorrect && sequenceTwoIsCorrect && sequenceThreeIsCorrect;

    if (allAreCorrect) {
      this.wizard?.forceFinish();
      // resetting for another pass through
      this.model.allowNext = false;
      this.model.sequenceOne = '';
      this.model.sequenceTwo = '';
      this.model.sequenceThree = '';
      this.wizard?.reset();
      this.errorFlag = false;
    } else {
      this.errorFlag = true;
    }
  }

  doNext() {
    if (this.model.allowNext) {
      this.wizard?.forceNext();
      this.stressText = false;
    } else {
      this.stressText = true;
    }
  }
}
`;

const html = `
<button class="btn btn-primary" (click)="wizard.open()">Alt-Next Wizard</button>

<clr-wizard
  #wizard
  [(clrWizardOpen)]="open"
  [clrWizardSize]="'lg'"
  (clrWizardOnNext)="doNext()"
  (clrWizardOnFinish)="doFinish()"
  [clrWizardPreventDefaultNext]="true"
>
  <clr-wizard-title>Wizard with alternate next flows</clr-wizard-title>

  <clr-wizard-button [type]="'cancel'">Cancel</clr-wizard-button>
  <clr-wizard-button [type]="'previous'">Back</clr-wizard-button>
  <clr-wizard-button [type]="'next'">Next</clr-wizard-button>
  <clr-wizard-button [type]="'finish'">Finish</clr-wizard-button>

  <clr-wizard-page>
    <ng-template clrPageTitle>Wizard level alt-next</ng-template>
    <p [class.stress]="stressText">Alt-Next means you manually move users to the next page.</p>

    <clr-checkbox-wrapper>
      <input #allowNext type="checkbox" clrCheckbox name="allowNext" [(ngModel)]="model.allowNext" />
      <label>Check the box if you want to go to the next page</label>
    </clr-checkbox-wrapper>
  </clr-wizard-page>

  <clr-wizard-page (clrWizardPageNext)="pageCustomNext()" [clrWizardPagePreventDefaultNext]="true">
    <ng-template clrPageTitle>Page level alt-next</ng-template>
    <p *ngIf="showCancelConfirm">Complete this fibonacci sequence</p>

    <p>1, 2...</p>

    <form clrForm>
      <clr-number-input-container>
        <label>What comes after 2?</label>
        <input
          clrNumberInput
          type="number"
          name="number"
          placeholder="Enter a number"
          [(ngModel)]="model.sequenceOne"
        />
      </clr-number-input-container>

      <clr-number-input-container>
        <label>What is the next number in the sequence?</label>
        <input
          clrNumberInput
          type="number"
          name="number2"
          placeholder="Enter a number"
          [(ngModel)]="model.sequenceTwo"
        />
      </clr-number-input-container>

      <clr-number-input-container>
        <label>What is the next number in the sequence?</label>
        <input
          clrNumberInput
          type="number"
          name="number3"
          placeholder="Enter a number"
          [(ngModel)]="model.sequenceThree"
        />
      </clr-number-input-container>
    </form>
  </clr-wizard-page>

  <clr-wizard-page>
    <ng-template clrPageTitle>Wizard level alt-next and the finish button</ng-template>
    <clr-alert *ngIf="errorFlag" clrAlertType="danger">
      <clr-alert-item>Your sequence should be 1, 2, 3, 5, 8.</clr-alert-item>
    </clr-alert>

    <ng-container *ngIf="!errorFlag">
      <p>Alt-next at the wizard level also affects the finish button!</p>
      <p>So make sure to call through to finish when you use it.</p>
      <p>Click the finish button to test your answers.</p>
    </ng-container>

    <p *ngIf="errorFlag">Click back to the previous page to change your answers.</p>
  </clr-wizard-page>
</clr-wizard>
`;

@Component({
  selector: 'clr-wizard-alt-next',
  templateUrl: './wizard-alt-next.demo.html',
  styles: ['.stress { color: var(--cds-alias-status-danger); }'],
  imports: [
    ClrWizardModule,
    ClrCheckboxModule,
    FormsModule,
    ClrCommonFormsModule,
    ClrNumberInputModule,
    ClrAlertModule,
    StackblitzExampleComponent,
  ],
})
export class WizardAltNextDemo implements OnInit {
  readonly wizard = viewChild<ClrWizard>('wizard');

  open = false;
  showCancelConfirm = false;

  model: any;
  stressText = false;
  errorFlag = false;

  code = code;
  html = html;

  ngOnInit() {
    this.model = {
      allowNext: false,
      sequenceOne: '',
      sequenceTwo: '',
      sequenceThree: '',
    };
  }

  pageCustomNext(): void {
    if (confirm('Are you sure you got it right?')) {
      this.errorFlag = false;
      this.wizard()?.forceNext();
    }
  }

  doFinish() {
    const sequenceOneIsCorrect = this.model.sequenceOne === 3;
    const sequenceTwoIsCorrect = this.model.sequenceTwo === 5;
    const sequenceThreeIsCorrect = this.model.sequenceThree === 8;
    const allAreCorrect = sequenceOneIsCorrect && sequenceTwoIsCorrect && sequenceThreeIsCorrect;

    if (allAreCorrect) {
      this.wizard()?.forceFinish();
      // resetting for another pass through
      this.model.allowNext = false;
      this.model.sequenceOne = '';
      this.model.sequenceTwo = '';
      this.model.sequenceThree = '';
      this.wizard()?.reset();
      this.errorFlag = false;
    } else {
      this.errorFlag = true;
    }
  }

  doNext() {
    if (this.model.allowNext) {
      this.wizard()?.forceNext();
      this.stressText = false;
    } else {
      this.stressText = true;
    }
  }
}
