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
  @ViewChild('wizard') wizard: ClrWizard | undefined;

  open = false;
  showWarning = false;

  handleDangerClick(): void {
    this.wizard?.finish();
  }

  doCustomClick(buttonType: string): void {
    if ('custom-next' === buttonType) {
      this.wizard?.next();
    }

    if ('custom-previous' === buttonType) {
      this.wizard?.previous();
    }

    if ('custom-danger' === buttonType) {
      this.showWarning = true;
    }
  }
}
`;

const html = `
<button class="btn btn-primary" (click)="wizard.open()">Wizard Button Overrides</button>

<clr-wizard #wizard [(clrWizardOpen)]="open" [clrWizardSize]="'lg'">
  <clr-wizard-title>Custom and default buttons</clr-wizard-title>

  <clr-wizard-button [type]="'cancel'">Default</clr-wizard-button>
  <clr-wizard-button [type]="'previous'">Default</clr-wizard-button>
  <clr-wizard-button [type]="'next'">Default</clr-wizard-button>
  <clr-wizard-button [type]="'finish'">Default</clr-wizard-button>

  <clr-wizard-page>
    <ng-template clrPageTitle>Page 1 with default buttons</ng-template>
    <ng-template clrPageNavTitle>Default buttons</ng-template>
    <p>Content for page 1.</p>
  </clr-wizard-page>

  <clr-wizard-page (clrWizardPageCustomButton)="doCustomClick($event)">
    <ng-template clrPageTitle>Page 2 with custom buttons</ng-template>
    <ng-template clrPageNavTitle>Custom buttons</ng-template>
    <p>Content for page 2.</p>

    <ng-template clrPageButtons>
      <clr-wizard-button [type]="'cancel'">Page Override</clr-wizard-button>
      <clr-wizard-button [type]="'custom-previous'">Custom</clr-wizard-button>
      <clr-wizard-button [type]="'custom-next'">Custom</clr-wizard-button>
    </ng-template>
  </clr-wizard-page>

  <clr-wizard-page>
    <ng-template clrPageTitle>Page 3 with default buttons</ng-template>
    <ng-template clrPageNavTitle>Default buttons</ng-template>
    <p>Content for page 3.</p>
  </clr-wizard-page>

  <clr-wizard-page (clrWizardPageCustomButton)="doCustomClick($event)">
    <ng-template clrPageTitle>Page 4 with custom finish</ng-template>
    <ng-template clrPageNavTitle>Custom buttons</ng-template>

    <p *ngIf="!showWarning">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae minima inventore quia, officiis rem
      id explicabo incidunt, illum deleniti qui doloremque voluptatem, saepe tenetur quas! Quaerat
      explicabo expedita placeat vero.
    </p>

    <p *ngIf="showWarning">
      <button type="submit" class="btn btn-danger" (click)="handleDangerClick()">
        Click here if you are sure
      </button>
    </p>

    <ng-template clrPageButtons>
      <clr-wizard-button [type]="'cancel'">Page Override</clr-wizard-button>
      <clr-wizard-button [type]="'previous'">Page Override</clr-wizard-button>
      <clr-wizard-button [type]="'custom-danger'">Custom</clr-wizard-button>
    </ng-template>
  </clr-wizard-page>
</clr-wizard>
`;

@Component({
  selector: 'clr-wizard-custom-buttons',
  templateUrl: './wizard-custom-buttons.demo.html',
  standalone: false,
})
export class WizardCustomButtonsDemo {
  @ViewChild('wizard', { static: true }) wizard: ClrWizard | undefined;

  open = false;
  showWarning = false;

  code = code;
  html = html;

  handleDangerClick(): void {
    this.wizard?.finish();
  }

  doCustomClick(buttonType: string): void {
    if ('custom-next' === buttonType) {
      this.wizard?.next();
    }

    if ('custom-previous' === buttonType) {
      this.wizard?.previous();
    }

    if ('custom-danger' === buttonType) {
      this.showWarning = true;
    }
  }
}
