/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrCheckboxModule,
  ClrCommonFormsModule,
  ClrInputModule,
  ClrNumberInputModule,
  ClrWizard,
  ClrWizardModule,
} from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const code = `
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrFormsModule, ClrWizard, ClrWizardModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrWizardModule, ClrFormsModule, FormsModule],
})
export class ExampleComponent implements OnInit {
  @ViewChild('wizard', { static: true }) wizard: ClrWizard | undefined;

  open = false;
  model: any;

  ngOnInit() {
    this.model = {
      forceReset: false,
      favoriteColor: '',
      luckyNumber: '',
      flavorOfIceCream: '',
    };
  }

  doFinish(): void {
    this.doReset();
  }

  doReset(): void {
    if (this.model.forceReset) {
      this.wizard?.reset();
      this.model.forceReset = false;
      this.model.favoriteColor = '';
      this.model.luckyNumber = '';
      this.model.flavorOfIceCream = '';
    }
  }
}
`;

const html = `
<button class="btn btn-primary" (click)="wizard.open()">Reset Wizard</button>

<clr-wizard
  #wizard
  [(clrWizardOpen)]="open"
  [clrWizardSize]="'md'"
  (clrWizardOnFinish)="doFinish()"
  (clrWizardOnCancel)="doFinish()"
>
  <clr-wizard-title>
    {{ model.forceReset ? 'Wizard resets' : "Wizard doesn't reset" }}
  </clr-wizard-title>

  <clr-wizard-button [type]="'cancel'">Cancel</clr-wizard-button>
  <clr-wizard-button [type]="'previous'">Back</clr-wizard-button>
  <clr-wizard-button [type]="'next'">Next</clr-wizard-button>
  <clr-wizard-button [type]="'finish'">OK</clr-wizard-button>

  <clr-wizard-page>
    <ng-template clrPageTitle>Page 1</ng-template>
    <!-- mandatory -->

    <p>Check below if you want the wizard to reset when it finishes or closes.</p>

    <clr-checkbox-wrapper>
      <input #forceReset type="checkbox" clrCheckbox name="forceReset" [(ngModel)]="model.forceReset" />
      <label>Force reset on close</label>
    </clr-checkbox-wrapper>
  </clr-wizard-page>

  <clr-wizard-page>
    <ng-template clrPageTitle>Page 2</ng-template>
    <!-- mandatory -->
    <clr-input-container>
      <label>What is your favorite color?</label>
      <input clrInput placeholder="Color?" #stepTwoInput [(ngModel)]="model.favoriteColor" />
    </clr-input-container>
  </clr-wizard-page>

  <clr-wizard-page>
    <ng-template clrPageTitle>Page 3</ng-template>
    <!-- mandatory -->
    <clr-input-container>
      <label>What is your favorite ice cream?</label>
      <input clrInput placeholder="Flavor?" #stepThreeInput [(ngModel)]="model.flavorOfIceCream" />
    </clr-input-container>
  </clr-wizard-page>

  <clr-wizard-page>
    <ng-template clrPageTitle>Page 4</ng-template>
    <!-- mandatory -->
    <clr-number-input-container>
      <label>What is your lucky number?</label>
      <input
        clrNumberInput
        placeholder="Lucky number?"
        #stepFourInput
        type="number"
        [(ngModel)]="model.luckyNumber"
      />
    </clr-number-input-container>
  </clr-wizard-page>
</clr-wizard>
`;

@Component({
  selector: 'clr-wizard-reset',
  templateUrl: './wizard-reset.demo.html',
  imports: [
    ClrWizardModule,
    ClrCheckboxModule,
    FormsModule,
    ClrCommonFormsModule,
    ClrInputModule,
    ClrNumberInputModule,
    StackblitzExampleComponent,
  ],
})
export class WizardResetDemo implements OnInit {
  readonly wizard = viewChild<ClrWizard>('wizard');

  open = false;

  model: any;

  code = code;
  html = html;

  ngOnInit() {
    this.model = {
      forceReset: false,
      favoriteColor: '',
      luckyNumber: '',
      flavorOfIceCream: '',
    };
  }

  doFinish(): void {
    this.doReset();
  }

  doReset(): void {
    if (this.model.forceReset) {
      this.wizard()?.reset();
      this.model.forceReset = false;
      this.model.favoriteColor = '';
      this.model.luckyNumber = '';
      this.model.flavorOfIceCream = '';
    }
  }
}
