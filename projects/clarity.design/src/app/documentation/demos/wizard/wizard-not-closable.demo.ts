/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ClrWizard } from '@clr/angular';

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
  @ViewChild('wizard', { static: true }) wizard: ClrWizard | undefined;
  open = false;
}
`;

const html = `
<button class="btn btn-primary" (click)="wizard.open()">Wizard, Not Closable</button>

<clr-wizard #wizard [(clrWizardOpen)]="open" [clrWizardClosable]="false" [clrWizardSize]="'md'">
  <clr-wizard-title>Wizard, not closable</clr-wizard-title>

  <clr-wizard-button [type]="'cancel'">Cancel</clr-wizard-button>
  <clr-wizard-button [type]="'previous'">Back</clr-wizard-button>
  <clr-wizard-button [type]="'next'">Next</clr-wizard-button>
  <clr-wizard-button [type]="'finish'">Finish</clr-wizard-button>

  <clr-wizard-page>
    <ng-template clrPageTitle>Page 1</ng-template>
    <p>Notice there's no close "X" in the top right</p>
  </clr-wizard-page>

  <clr-wizard-page>
    <ng-template clrPageTitle>Page 2</ng-template>
    <p>Notice there's no close "X" in the top right</p>
  </clr-wizard-page>
</clr-wizard>
`;

@Component({
  selector: 'clr-wizard-not-closable',
  templateUrl: './wizard-not-closable.demo.html',
  standalone: false,
})
export class WizardNotClosable {
  @ViewChild('wizard', { static: true }) wizard: ClrWizard | undefined;

  open = false;

  code = code;
  html = html;
}
