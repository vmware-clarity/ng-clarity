/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ClrWizard, ClrWizardModule, ClrWizardPage } from '@clr/angular';

@Component({
  selector: 'clr-wizard-jump-to-example',
  templateUrl: './jump-to.example.html',
  imports: [ClrWizardModule],
})
export class WizardJumpToExample {
  @ViewChild('wizard') wizard: ClrWizard | undefined;
  @ViewChild('pageThree') pageThree: ClrWizardPage | undefined;
  @ViewChild('pageFive') pageFive: ClrWizardPage | undefined;

  open = false;

  jumpTo(page: ClrWizardPage) {
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

  jumpToThree(): void {
    if (!this.pageThree) {
      return;
    }

    this.jumpTo(this.pageThree);
  }

  jumpToFive(): void {
    if (!this.pageFive) {
      return;
    }

    this.jumpTo(this.pageFive);
  }
}
