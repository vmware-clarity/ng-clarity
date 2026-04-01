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
import { ClrWizard, ClrWizardModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ClrWizardModule],
})
export class ExampleComponent {
  @ViewChild('wizard', { static: true }) wizard: ClrWizard | undefined;
  open = false;
  pageArray = ['1', '2', '3'];

  // adding a reset here for sanity's sake
  reset(): void {
    this.wizard?.reset();
  }
}
`;

const html = `
<button class="btn btn-primary" (click)="wizard.open()">Wizard That You Must Finish</button>

<clr-wizard
  #wizard
  [(clrWizardOpen)]="open"
  [clrWizardClosable]="false"
  [clrWizardSize]="'md'"
  (clrWizardOnFinish)="reset()"
>
  <clr-wizard-title>Wizard that you can't close</clr-wizard-title>

  @for (page of pageArray; track page) {
    <clr-wizard-page>
      <ng-template clrPageTitle>Page {{ page }}</ng-template>
      <p>Page {{ page }} of {{ pageArray.length }}</p>

      <ng-template clrPageButtons>
        <clr-wizard-button type="previous">Back</clr-wizard-button>
        <clr-wizard-button type="next">Next</clr-wizard-button>
        @if (page === '3') {
          <clr-wizard-button type="finish">YAY</clr-wizard-button>
        }
      </ng-template>
    </clr-wizard-page>
  }
</clr-wizard>
`;

@Component({
  selector: 'clr-wizard-no-cancel',
  templateUrl: './wizard-no-cancel.demo.html',
  imports: [ClrWizardModule, StackblitzExampleComponent],
})
export class WizardNoCancel {
  readonly wizard = viewChild<ClrWizard>('wizard');

  open = false;

  pageArray: string[] = ['1', '2', '3'];

  code = code;
  html = html;

  // adding a reset here for sanity's sake
  reset(): void {
    this.wizard()?.reset();
  }
}
