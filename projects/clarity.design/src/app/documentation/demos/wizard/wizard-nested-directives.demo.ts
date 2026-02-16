/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

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
  _open = false;

  pages = [{ skipped: false }, { skipped: true }, { skipped: false }];

  open() {
    this._open = true;
  }
}
`;

const html = `
<button class="btn btn-primary" (click)="open()">Open the Wizard</button>

<clr-wizard #wizard [(clrWizardOpen)]="_open">
  <clr-wizard-title>Wizard Title</clr-wizard-title>

  <clr-wizard-button type="cancel">Cancel</clr-wizard-button>
  <clr-wizard-button type="previous">Back</clr-wizard-button>
  <clr-wizard-button type="next">Next</clr-wizard-button>
  <clr-wizard-button type="finish">Finish</clr-wizard-button>

  <ng-container *ngFor="let page of pages; let i = index">
    <clr-wizard-page *ngIf="!page.skipped">
      <ng-template clrPageTitle>Page {{ i + 1 }}</ng-template>
      Content for page {{ i + 1 }}
    </clr-wizard-page>
  </ng-container>
</clr-wizard>
`;

@Component({
  selector: 'clr-wizard-nested-directives',
  template: ` <app-stackblitz-example
    name="Wizard Nested Directives"
    [componentTemplate]="html"
    [componentClass]="code"
    [showComponentClass]="false"
  ></app-stackblitz-example>`,
  standalone: false,
})
export class WizardNestedDirectiveDemo {
  html = html;
  code = code;
}
