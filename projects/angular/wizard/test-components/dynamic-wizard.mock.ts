/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';

import { ClrWizard } from '../wizard';

@Component({
  template: `
    <clr-wizard #wizard [(clrWizardOpen)]="open" [clrWizardSize]="'lg'">
      <clr-wizard-title>My Wizard Title</clr-wizard-title>
      <clr-wizard-button [type]="'cancel'">Cancel</clr-wizard-button>
      <clr-wizard-button [type]="'previous'">Back</clr-wizard-button>
      <clr-wizard-button [type]="'next'">Next</clr-wizard-button>
      <clr-wizard-button [type]="'finish'">Fait Accompli</clr-wizard-button>

      @for (page of pages; track page) {
        @if (!(page === 2) || showSecondPage) {
          <clr-wizard-page [id]="page">
            <ng-template clrPageTitle>Page {{ page }}</ng-template>
            <p>Content for page {{ page }}</p>
          </clr-wizard-page>
        }
      }
    </clr-wizard>
  `,
  standalone: false,
})
export class DynamicWizardTestComponent {
  @ViewChild('wizard', { static: true }) wizard: ClrWizard;
  open = true;
  pages = [1, 2, 4];
  showSecondPage = true;
}
