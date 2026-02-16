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
import { ClrModalModule, ClrWizard, ClrWizardModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrWizardModule, ClrModalModule],
})
export class ExampleComponent {
  @ViewChild('wizard', { static: true }) wizard: ClrWizard | undefined;

  open = false;
  showConfirm = false;
  showCancelConfirm = false;

  pageCustomCancel(): void {
    this.showCancelConfirm = true;
  }

  doPageCancel() {
    this.showCancelConfirm = false;
    this.wizard?.close();
  }

  doCancel() {
    this.showConfirm = true;
  }
}
`;

const html = `
<button class="btn btn-primary" (click)="wizard.open()">Alt-Cancel Wizard</button>

<clr-wizard
  #wizard
  [(clrWizardOpen)]="open"
  (clrWizardOnCancel)="doCancel()"
  [clrWizardPreventDefaultCancel]="true"
>
  <clr-wizard-title>Wizard with alternate cancel</clr-wizard-title>

  <clr-wizard-button [type]="'cancel'">Cancel</clr-wizard-button>
  <clr-wizard-button [type]="'previous'">Back</clr-wizard-button>
  <clr-wizard-button [type]="'next'">Next</clr-wizard-button>
  <clr-wizard-button [type]="'finish'">Finish</clr-wizard-button>

  <clr-wizard-page>
    <ng-template clrPageTitle>Wizard level alt-cancel</ng-template>
    <p>Content for step 1</p>
  </clr-wizard-page>

  <clr-wizard-page
    (clrWizardPageOnCancel)="pageCustomCancel()"
    [clrWizardPagePreventDefaultCancel]="true"
  >
    <ng-template clrPageTitle>Page level alt-cancel</ng-template>
    <p *ngIf="!showCancelConfirm">Content for step 2</p>
    <p *ngIf="showCancelConfirm">
      <button type="submit" class="btn btn-danger" (click)="doPageCancel()">
        Click here if you are sure
      </button>
    </p>
  </clr-wizard-page>
</clr-wizard>

<clr-modal [(clrModalOpen)]="showConfirm">
  <h3 class="modal-title">Are you sure?</h3>
  <div class="modal-body">
    <p>You may lose data if you close now...</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline" (click)="showConfirm = false">Cancel</button>
    <button type="button" class="btn btn-primary" (click)="showConfirm = false; open = false">
      Yes
    </button>
  </div>
</clr-modal>
`;

@Component({
  selector: 'clr-wizard-alt-cancel',
  templateUrl: './wizard-alt-cancel.demo.html',
  standalone: false,
})
export class WizardAltCancelDemo {
  @ViewChild('wizard', { static: true }) wizard: ClrWizard | undefined;

  open = false;
  showConfirm = false;
  showCancelConfirm = false;

  code = code;
  html = html;

  pageCustomCancel(): void {
    this.showCancelConfirm = true;
  }

  doPageCancel() {
    this.showCancelConfirm = false;
    this.wizard?.close();
  }

  doCancel() {
    this.showConfirm = true;
  }
}
