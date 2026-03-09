/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const code = `
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ClrWizard, ClrWizardModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrWizardModule],
})
export class ExampleComponent {
  @ViewChild('wizard') wizard: ClrWizard | undefined;
  open = false;
}
`;

const html = `
<button class="btn btn-primary" (click)="wizard.open()">Open Wizard</button>

<clr-wizard #wizard [(clrWizardOpen)]="open">
  <clr-wizard-title>Wizard Title</clr-wizard-title>

  <clr-wizard-button type="cancel">Cancel</clr-wizard-button>
  <clr-wizard-button type="previous">Back</clr-wizard-button>
  <clr-wizard-button type="next">Next</clr-wizard-button>
  <clr-wizard-button type="finish">Finish</clr-wizard-button>

  <clr-wizard-page>
    <ng-template clrPageTitle>Page 1 Title</ng-template>
    Content for page 1
  </clr-wizard-page>

  <clr-wizard-page>
    <ng-template clrPageTitle>Page 2 Title</ng-template>
    <ng-template clrPageNavTitle>This title in the sidebar</ng-template>
    Content for page 2
  </clr-wizard-page>
</clr-wizard>
`;

@Component({
  selector: 'clr-wizard-default-buttons',
  template: ` <app-stackblitz-example
    name="Wizard Buttons example"
    [componentTemplate]="html"
    [componentClass]="code"
    [showComponentClass]="false"
  ></app-stackblitz-example>`,
  imports: [StackblitzExampleComponent],
})
export class WizardDefaultButtonsDemo {
  html = html;
  code = code;
}
