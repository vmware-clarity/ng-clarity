/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrCommonFormsModule, ClrInputModule, ClrNumberInputModule, ClrWizard, ClrWizardModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const code = `
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrWizardModule, ClrFormsModule, FormsModule],
})
export class ExampleComponent {
  @ViewChild('wizard') wizard: ClrWizard | undefined;
  @ViewChild('number') numberField: any;
  open = false;

  model = {
    name: '',
    favorite: '',
    number: '',
  };
}
`;

const html = `
<button class="btn btn-primary" (click)="wizard.open()">Wizard Form Validation</button>

<clr-wizard #wizard [(clrWizardOpen)]="open">
  <clr-wizard-title>Wizard with form validation</clr-wizard-title>

  <clr-wizard-button [type]="'cancel'">Close</clr-wizard-button>
  <clr-wizard-button [type]="'previous'">Previous</clr-wizard-button>
  <clr-wizard-button [type]="'next'">Next</clr-wizard-button>
  <clr-wizard-button [type]="'finish'">Done</clr-wizard-button>

  <clr-wizard-page [clrWizardPageNextDisabled]="name.pristine || !formPageOne.valid">
    <ng-template clrPageTitle>Form with validation</ng-template>
    <!-- mandatory -->

    <form clrForm #formPageOne="ngForm">
      <clr-input-container>
        <label>Name</label>
        <input clrInput required [(ngModel)]="model.name" name="name" #name="ngModel" />
        <clr-control-error>This field is required!</clr-control-error>
      </clr-input-container>

      <clr-input-container>
        <label>Favorite food</label>
        <input clrInput [(ngModel)]="model.favorite" name="favorite" />
      </clr-input-container>
    </form>
  </clr-wizard-page>

  <clr-wizard-page [clrWizardPageNextDisabled]="number.pristine || !formPageTwo.valid">
    <ng-template clrPageTitle>We need a number</ng-template>
    <!-- mandatory -->
    <ng-template clrPageNavTitle>Enter a number</ng-template>
    <!-- optional -->

    <form #formPageTwo="ngForm">
      <label>Please your lucky number!</label>
      <clr-number-input-container>
        <label>Your number</label>
        <input
          clrNumberInput
          required
          type="number"
          [(ngModel)]="model.number"
          name="number"
          #number="ngModel"
        />
        <clr-control-error>This field is required!</clr-control-error>
      </clr-number-input-container>
    </form>
  </clr-wizard-page>

  <clr-wizard-page [clrWizardPageNextDisabled]="!formPageOne.valid || !formPageTwo.valid">
    <ng-template clrPageTitle>Title for page 3</ng-template>
    <!-- mandatory -->
    <ng-template clrPageNavTitle>
      <span *ngIf="formPageOne.valid && formPageTwo.valid">Ready to go!</span>
      <span *ngIf="!formPageOne.valid || !formPageTwo.valid">Not ready yet</span>
    </ng-template>
    <!-- optional -->

    <div *ngIf="formPageOne.valid && formPageTwo.valid">
      <p>Congratulations! You are done with this wizard.</p>
      <label>Your information</label>
      <section>
        <p>
          <label>Your name:</label>
          <span>{{ model.name }}</span>
        </p>
        <p>
          <label>Your favorite food:</label>
          <span>{{ model.favorite }}</span>
        </p>
        <p>
          <label>Your lucky number:</label>
          <span>{{ model.number }}</span>
        </p>
      </section>
    </div>

    <div *ngIf="!formPageOne.valid || !formPageTwo.valid">
      <p>Not quite there yet.</p>
    </div>
  </clr-wizard-page>
</clr-wizard>
`;

@Component({
  selector: 'clr-wizard-form-validation',
  templateUrl: './wizard-form-validation.demo.html',
  imports: [
    ClrWizardModule,
    FormsModule,
    ClrCommonFormsModule,
    ClrInputModule,
    ClrNumberInputModule,
    StackblitzExampleComponent,
  ],
})
export class WizardFormValidation {
  readonly wizard = viewChild<ClrWizard>('wizard');
  readonly numberField = viewChild<any>('number');

  open = false;

  model = {
    name: '',
    favorite: '',
    number: '',
  };

  code = code;
  html = html;
}
