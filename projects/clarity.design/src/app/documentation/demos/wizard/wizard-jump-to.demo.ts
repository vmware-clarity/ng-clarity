/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ClrWizard, ClrWizardPage } from '@clr/angular';

const code = `
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ClrWizard, ClrWizardPage, ClrWizardModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrWizardModule],
})
export class ExampleComponent {
  @ViewChild('wizard') wizard: ClrWizard | undefined;
  @ViewChild('pageThree') pageThree: ClrWizardPage | undefined;
  @ViewChild('pageFive') pageFive: ClrWizardPage | undefined;

  open = false;

  public jumpTo(page: ClrWizardPage) {
    if (!this.wizard) {
      return;
    }

    if (page && page.completed) {
      this.wizard.navService.currentPage = page;
    } else {
      this.wizard?.navService.setLastEnabledPageCurrent();
    }
    this.wizard?.open();
  }

  public jumpToThree(): void {
    if (!this.pageThree) {
      return;
    }

    this.jumpTo(this.pageThree);
  }

  public jumpToFive(): void {
    if (!this.pageFive) {
      return;
    }

    this.jumpTo(this.pageFive);
  }
}
`;

const html = `
<button class="btn btn-primary" (click)="wizard.open()">Open Wizard</button>
<button class="btn btn-outline" (click)="jumpToThree()">Try to Open at Step 3</button>
<button class="btn btn-outline" (click)="jumpToFive()">Try to Open at Step 5</button>

<clr-wizard #wizard [(clrWizardOpen)]="open" [clrWizardSize]="'md'">
  <clr-wizard-title>Jump-To Wizard</clr-wizard-title>

  <clr-wizard-button [type]="'cancel'">Cancel</clr-wizard-button>
  <clr-wizard-button [type]="'previous'">Back</clr-wizard-button>
  <clr-wizard-button [type]="'next'">Next</clr-wizard-button>
  <clr-wizard-button [type]="'finish'">Done</clr-wizard-button>

  <clr-wizard-page>
    <ng-template clrPageTitle>Page 1</ng-template>
    <p>
      If the wizard can navigate to a page, you can click on the buttons above to have it open up at
      step three or step five. Try clicking through all the pages, closing the wizard, and clicking on
      the buttons.
    </p>
    <p>
      Enabling a page for navigation entails setting the pages before it as both ready to complete and
      completed. This can be done programmatically as well.
    </p>
    <p>
      If a page cannot be navigated to, you can either programmatically set the wizard to open on the
      first page or tell it to open on the last navigable page in the workflow.
    </p>
  </clr-wizard-page>

  <clr-wizard-page>
    <ng-template clrPageTitle>Page 2</ng-template>
    <p>Content for step 2</p>
  </clr-wizard-page>

  <clr-wizard-page #pageThree>
    <ng-template clrPageTitle>Page 3</ng-template>
    <p>Content for step 3</p>
  </clr-wizard-page>

  <clr-wizard-page>
    <ng-template clrPageTitle>Page 4</ng-template>
    <p>Content for step 4</p>
  </clr-wizard-page>

  <clr-wizard-page #pageFive>
    <ng-template clrPageTitle>Page 5</ng-template>
    <p>Content for step 5</p>
  </clr-wizard-page>
</clr-wizard>
`;

@Component({
  selector: 'clr-wizard-jump-to',
  templateUrl: './wizard-jump-to.demo.html',
  standalone: false,
})
export class WizardJumpToDemo {
  @ViewChild('wizard', { static: true }) wizard: ClrWizard | undefined;
  @ViewChild('pageThree', { static: true }) pageThree: ClrWizardPage | undefined;
  @ViewChild('pageFive', { static: true }) pageFive: ClrWizardPage | undefined;

  open = false;

  code = code;
  html = html;

  jumpTo(page: ClrWizardPage) {
    if (this.wizard) {
      if (page && page.completed) {
        this.wizard.navService.currentPage = page;
      } else {
        this.wizard.navService.setLastEnabledPageCurrent();
      }
      this.wizard.open();
    }
  }

  jumpToThree(): void {
    if (this.pageThree) {
      this.jumpTo(this.pageThree);
    }
  }

  jumpToFive(): void {
    if (this.pageFive) {
      this.jumpTo(this.pageFive);
    }
  }
}
