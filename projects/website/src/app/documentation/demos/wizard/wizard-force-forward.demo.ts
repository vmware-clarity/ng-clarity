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
  open = false;
}
`;

const html = `
<button class="btn btn-primary" (click)="wizard.open()">Force Forward Wizard</button>

<clr-wizard #wizard [(clrWizardOpen)]="open" [clrWizardForceForwardNavigation]="true">
  <clr-wizard-title>Wizard, Only Forward Navigation</clr-wizard-title>

  <clr-wizard-button [type]="'cancel'">Cancel</clr-wizard-button>
  <clr-wizard-button [type]="'previous'">Back</clr-wizard-button>
  <clr-wizard-button [type]="'next'">Next</clr-wizard-button>
  <clr-wizard-button [type]="'finish'">Finish</clr-wizard-button>

  @for (page of [1, 2, 3, 4]; track page) {
    <clr-wizard-page>
      <ng-template clrPageTitle>Title for page {{ page }}</ng-template>
      <p>Content for page {{ page }}.</p>
    </clr-wizard-page>
  }
</clr-wizard>
`;

@Component({
  selector: 'clr-wizard-force-forward',
  templateUrl: './wizard-force-forward.demo.html',
  imports: [ClrWizardModule, StackblitzExampleComponent],
})
export class WizardForceForwardDemo {
  readonly wizard = viewChild<ClrWizard>('wizard');
  open = false;

  code = code;
  html = html;
}
