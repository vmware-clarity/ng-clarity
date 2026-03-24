/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, viewChild } from '@angular/core';
import { ClrWizard, ClrWizardModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const code = `
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ClrWizardModule],
})
export class ExampleComponent {
  @ViewChild('parentWizard') parentWizard: ClrWizard | undefined;

  _open = false;
  nestedWizardComplete = false;

  onNestedWizardFinish() {
    this.nestedWizardComplete = true;
    this.parentWizard?.forceNext();
  }
}
`;

const html = `
<button class="btn btn-primary" (click)="_open = true">Wizard with Nested Wizard</button>

<clr-wizard #parentWizard [(clrWizardOpen)]="_open" clrWizardStepnavLayout="horizontal">
  <clr-wizard-title>Outer Wizard</clr-wizard-title>

  <clr-wizard-button [type]="'cancel'">Cancel</clr-wizard-button>
  <clr-wizard-button [type]="'previous'">Back</clr-wizard-button>
  <clr-wizard-button [type]="'next'">Next</clr-wizard-button>
  <clr-wizard-button [type]="'finish'">Finish</clr-wizard-button>

  <clr-wizard-page [clrWizardPageNextDisabled]="!nestedWizardComplete">
    <ng-template clrPageTitle>Configuration</ng-template>

    <clr-wizard
      [clrWizardInPage]="true"
      [clrWizardInPageFillContentArea]="true"
      [clrWizardClosable]="false"
      (clrWizardOnFinish)="onNestedWizardFinish()"
    >
      <clr-wizard-title>Nested Wizard</clr-wizard-title>

      <clr-wizard-button [type]="'previous'">Back</clr-wizard-button>
      <clr-wizard-button [type]="'next'">Next</clr-wizard-button>
      <clr-wizard-button [type]="'finish'">Continue</clr-wizard-button>

      <clr-wizard-page>
        <ng-template clrPageTitle>Nested Step 1</ng-template>
        <p>Content for nested step 1.</p>
      </clr-wizard-page>

      <clr-wizard-page>
        <ng-template clrPageTitle>Nested Step 2</ng-template>
        <p>Content for nested step 2.</p>
      </clr-wizard-page>

      <clr-wizard-page>
        <ng-template clrPageTitle>Nested Step 3</ng-template>
        <p>Content for nested step 3.</p>
      </clr-wizard-page>
    </clr-wizard>
  </clr-wizard-page>

  <clr-wizard-page>
    <ng-template clrPageTitle>Review</ng-template>
    <p>Review the data from the nested wizard.</p>
  </clr-wizard-page>

  <clr-wizard-page>
    <ng-template clrPageTitle>Summary</ng-template>
    <p>All done.</p>
  </clr-wizard-page>
</clr-wizard>
`;

@Component({
  selector: 'clr-wizard-nested-wizard',
  templateUrl: './wizard-nested-wizard.demo.html',
  imports: [ClrWizardModule, StackblitzExampleComponent],
})
export class WizardNestedWizardDemo {
  readonly parentWizard = viewChild<ClrWizard>('parentWizard');

  _open = false;
  nestedWizardComplete = false;

  code = code;
  html = html;

  onNestedWizardFinish() {
    this.nestedWizardComplete = true;
    this.parentWizard()?.forceNext();
  }
}
