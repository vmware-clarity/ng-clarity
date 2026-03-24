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
  @ViewChild('wizard') wizard: ClrWizard | undefined;
  _open = false;

  open() {
    this._open = true;
    this.wizard?.open();
  }
}
`;

const html = `
<button class="btn btn-primary" (click)="open()">Horizontal Wizard</button>

<clr-wizard #wizard [(clrWizardOpen)]="_open" clrWizardStepnavLayout="horizontal">
  <clr-wizard-title>Horizontal Wizard</clr-wizard-title>

  <clr-wizard-button [type]="'cancel'">Cancel</clr-wizard-button>
  <clr-wizard-button [type]="'previous'">Back</clr-wizard-button>
  <clr-wizard-button [type]="'next'">Next</clr-wizard-button>
  <clr-wizard-button [type]="'finish'">Finish</clr-wizard-button>

  <clr-wizard-page>
    <ng-template clrPageTitle>Page 1</ng-template>
    <p>Content for step 1</p>
  </clr-wizard-page>

  <clr-wizard-page>
    <ng-template clrPageTitle>Page 2</ng-template>
    <p>Content for step 2</p>
  </clr-wizard-page>

  <clr-wizard-page>
    <ng-template clrPageTitle>Page 3</ng-template>
    <p>Content for step 3</p>
  </clr-wizard-page>

  <clr-wizard-page>
    <ng-template clrPageTitle>Page 4</ng-template>
    <p>Content for step 4</p>
  </clr-wizard-page>
</clr-wizard>
`;

@Component({
  selector: 'clr-wizard-horizontal',
  templateUrl: './wizard-horizontal.demo.html',
  imports: [ClrWizardModule, StackblitzExampleComponent],
})
export class WizardHorizontalDemo {
  readonly wizard = viewChild<ClrWizard>('wizard');

  _open = false;

  code = code;
  html = html;
}
