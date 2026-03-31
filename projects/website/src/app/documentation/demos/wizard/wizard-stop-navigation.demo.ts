/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrCommonFormsModule, ClrInputModule, ClrWizard, ClrWizardModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const code = `
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrFormsModule, ClrWizard, ClrWizardModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ClrWizardModule, ClrFormsModule, FormsModule],
})
export class ExampleComponent {
  @ViewChild('wizard', { static: true }) wizard: ClrWizard | undefined;

  untouched = true;
  loading = false;
  errorFlag = false;
  progress = 0;
  open = false;

  model = {
    won: '',
    too: '',
    tree: '',
  };

  get readyToFinish(): boolean {
    return !this.untouched && !this.loading;
  }

  doCancel(): void {
    this.wizard?.close();
    this.resetWizard();
  }

  resetWizard(): void {
    this.wizard?.reset();
    this.model.won = '';
    this.model.too = '';
    this.model.tree = '';
    this.progress = 0;
  }

  onCommit(): void {
    if (this.untouched) {
      this.untouched = false;
      this.loading = true;
      const timer = setInterval(() => {
        this.progress = this.progress + 14;

        if (this.progress > 99) {
          this.progress = 100;
          this.loading = false;
          clearInterval(timer);
        }
      }, 1000);
    } else {
      this.wizard?.forceFinish();
      this.resetWizard();
    }
  }
}
`;

const html = `
<button class="btn btn-primary" (click)="wizard.open()">Wizard: Stop Navigation</button>

<clr-wizard
  #wizard
  [(clrWizardOpen)]="open"
  [clrWizardSize]="'lg'"
  [clrWizardPreventNavigation]="loading"
  [clrWizardDisableStepnav]="readyToFinish"
  [clrWizardPreventDefaultCancel]="true"
  (clrWizardOnCancel)="doCancel()"
  [clrWizardClosable]="!readyToFinish"
>
  <clr-wizard-title>Wizard stops navigating while validating</clr-wizard-title>

  @if (!readyToFinish) {
    <clr-wizard-button type="cancel">Cancel</clr-wizard-button>
    <clr-wizard-button type="previous">Back</clr-wizard-button>
  }
  <clr-wizard-button type="next">Next</clr-wizard-button>
  <clr-wizard-button type="finish">
    @if (untouched && !loading) {
      <span>Validate</span>
    }
    @if (loading) {
      <span>Please wait...</span>
    }
    @if (readyToFinish) {
      <span>OK</span>
    }
  </clr-wizard-button>

  <clr-wizard-page
    [clrWizardPageNextDisabled]="
      (name.pristine && quest.pristine && velocity.pristine) || !formPage.valid
    "
  >
    <ng-template clrPageTitle>Form to submit</ng-template>
    <!-- mandatory -->

    <form clrForm #formPage="ngForm">
      <label>To proceed, you must answer these three questions...</label>
      <clr-input-container>
        <label>What is your name?</label>
        <input clrInput name="name" required [(ngModel)]="model.won" #name="ngModel" />
        <clr-control-error>This field is required!</clr-control-error>
      </clr-input-container>

      <clr-input-container>
        <label>What is your quest?</label>
        <input clrInput name="quest" required [(ngModel)]="model.too" #quest="ngModel" />
        <clr-control-error>This field is required!</clr-control-error>
      </clr-input-container>

      <clr-input-container>
        <label>What is the air-speed velocity of an unladen swallow?</label>
        <input clrInput name="velocity" required [(ngModel)]="model.tree" #velocity="ngModel" />
        <clr-control-error>This field is required!</clr-control-error>
      </clr-input-container>
    </form>
  </clr-wizard-page>
  <clr-wizard-page [clrWizardPagePreventDefaultNext]="true" (clrWizardPageOnCommit)="onCommit()">
    <ng-template clrPageTitle>Validate your information</ng-template>
    <ng-template clrPageNavTitle>
      @if (!readyToFinish) {
        <span>Validate Info</span>
      }
      @if (readyToFinish) {
        <span>Ready to Go!</span>
      }
    </ng-template>

    @if (untouched && !loading) {
      <p>
        Click the Validate button to kick off a timed routine. While the validation is running, try
        clicking buttons and stepnav items. Note that they don't do anything while the validation is
        running. The validation is just an exercise. It will not fail.
      </p>
    }

    @if (loading) {
      <p>Loading...</p>
      <div class="progress">
        <progress [value]="progress" max="100" [attr.data-displayval]="progress + '%'"></progress>
      </div>
    }

    @if (readyToFinish) {
      <p>Click on the OK button to close the wizard.</p>
    }
  </clr-wizard-page>
</clr-wizard>
`;

@Component({
  selector: 'clr-wizard-stop-navigation',
  templateUrl: './wizard-stop-navigation.demo.html',
  imports: [ClrWizardModule, FormsModule, ClrCommonFormsModule, ClrInputModule, StackblitzExampleComponent],
})
export class WizardStopNavigation {
  readonly wizard = viewChild<ClrWizard>('wizard');

  untouched = true;
  loading = false;
  errorFlag = false;
  progress = 0;
  open = false;

  code = code;
  html = html;

  model = {
    won: '',
    too: '',
    tree: '',
  };

  get readyToFinish(): boolean {
    return !this.untouched && !this.loading;
  }

  // have to define doCancel because page will prevent doCancel from working
  // if the page had a previous button, you would need to call
  // this.wizard.previous() manually as well...
  doCancel(): void {
    this.wizard()?.close();
    this.resetWizard();
  }

  resetWizard(): void {
    this.wizard()?.reset();
    this.model.won = '';
    this.model.too = '';
    this.model.tree = '';
    this.progress = 0;
  }

  onCommit(): void {
    if (this.untouched) {
      this.untouched = false;
      this.loading = true;
      const timer = setInterval(() => {
        this.progress = this.progress + 14;

        if (this.progress > 99) {
          this.progress = 100;
          this.loading = false;
          clearInterval(timer);
        }
      }, 1000);
    } else {
      this.wizard()?.forceFinish();
      this.resetWizard();
    }
  }
}
