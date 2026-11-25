/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ClarityModule, ClrWizard } from '@clr/angular';

/**
 * A Zone.js style consumer: Eager, plain fields, and changes made after a timer instead of in a template event.
 * The wizard is OnPush, so each change must reach it through its signal state.
 */
@Component({
  selector: 'wizard-acceptance',
  imports: [ClarityModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (enabled) {
      <section id="wizard-acceptance">
        <button class="btn" (click)="later(validate)">Validate later</button>
        <button class="btn" (click)="later(jumpToLast)">Jump later</button>
        <button class="btn" (click)="later(completeFirst)">Complete later</button>
        <button class="btn" (click)="later(addPage)">Add page later</button>
        <button class="btn" (click)="later(rename)">Rename later</button>
        <clr-wizard [clrWizardInPage]="true">
          <clr-wizard-title>Zone wizard</clr-wizard-title>
          <clr-wizard-button type="previous">Back</clr-wizard-button>
          <clr-wizard-button type="next">Next</clr-wizard-button>
          <clr-wizard-button type="finish">Finish</clr-wizard-button>
          @for (page of pages; track page; let first = $first) {
            <clr-wizard-page [clrWizardPageNextDisabled]="first && nextDisabled">
              <ng-template clrPageTitle>{{ page }} {{ title }}</ng-template>
              <p>{{ page }} content</p>
            </clr-wizard-page>
          }
        </clr-wizard>
      </section>
    }
  `,
})
export class WizardAcceptance {
  readonly enabled = new URLSearchParams(location.search).get('suite') === 'wizard';
  readonly pages = ['One', 'Two', 'Three'];
  nextDisabled = true;
  title = 'title';
  @ViewChild(ClrWizard) private wizard: ClrWizard;

  later(change: () => void) {
    setTimeout(change, 25);
  }

  readonly validate = () => (this.nextDisabled = false);
  readonly jumpToLast = () => (this.wizard.navService.currentPage = this.wizard.pages.last);
  readonly completeFirst = () => (this.wizard.pages.first.completed = true);
  readonly addPage = () => this.pages.push('Four');
  readonly rename = () => (this.title = 'renamed');
}
