/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ClrWizard, ClrWizardModule } from '@clr/angular';

@Component({
  selector: 'clr-wizard-basic-example',
  templateUrl: './basic.example.html',
  imports: [ClrWizardModule],
})
export class WizardBasicExample {
  @ViewChild('wizard', { static: true }) wizard: ClrWizard | undefined;

  wizardOpen = false;
  size = 'xl';

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

  openWizard(size: string) {
    this.size = size;

    this.wizard?.open();
  }
}
