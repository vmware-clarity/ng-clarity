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
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrWizardModule],
})
export class ExampleComponent {
  @ViewChild('wizard', { static: true }) wizard: ClrWizard | undefined;

  wizardOpen = false;
  size = 'xl';

  openWizard(size: string) {
    this.size = size;

    this.wizard?.open();
  }

  get textSize(): string {
    let returnVal = 'X-Large (Default)';

    switch (this.size) {
      case 'md':
        returnVal = 'Medium';
        break;
      case 'full-screen':
        returnVal = 'Full-Screen';
        break;
      case 'lg':
        returnVal = 'Large';
        break;
    }

    return returnVal;
  }
}
`;

const html = `
<button class="btn btn-primary" (click)="openWizard('md')">Medium Wizard</button>
<button class="btn btn-primary" (click)="openWizard('lg')">Large Wizard</button>
<button class="btn btn-primary" (click)="openWizard('xl')">X-Large Wizard</button>
<button class="btn btn-primary" (click)="openWizard('full-screen')">Full-Screen Wizard</button>

<clr-wizard #wizard [(clrWizardOpen)]="wizardOpen" [clrWizardSize]="size">
  <clr-wizard-title>{{ textSize }} Wizard</clr-wizard-title>

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
</clr-wizard>
`;

@Component({
  selector: 'clr-wizard-basic',
  templateUrl: './wizard-basic.demo.html',
  imports: [ClrWizardModule, StackblitzExampleComponent],
})
export class WizardBasic {
  readonly wizardMedium = viewChild<ClrWizard>('wizardMd');
  readonly wizardLarge = viewChild<ClrWizard>('wizardLg');
  readonly wizardExtraLarge = viewChild<ClrWizard>('wizardXl');
  readonly wizardFullScreen = viewChild<ClrWizard>('wizardFullScreen');

  mdOpen = false;
  lgOpen = false;
  xlOpen = false;
  fullScreenOpen = false;

  code = code;
  html = html;
}
