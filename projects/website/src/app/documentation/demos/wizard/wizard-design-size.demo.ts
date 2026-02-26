/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, viewChild } from '@angular/core';
import { ClarityIcons, ClrIcon, ClrIconModule, ClrWizard, ClrWizardModule, resizeIcon } from '@clr/angular';

@Component({
  selector: 'clr-wizard-design-size-demo',
  templateUrl: './wizard-design-size.demo.html',
  styleUrl: './wizard-design-size.demo.scss',
  imports: [ClrIcon, ClrIconModule, ClrWizardModule],
})
export class WizardDesignSizeDemo {
  readonly wizard = viewChild<ClrWizard>('wizard');
  open = false;
  size = 'xl';

  constructor() {
    ClarityIcons.addIcons(resizeIcon);
  }

  get textSize(): string {
    let returnVal = 'X-Large';

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

  openWizard(size: string): void {
    this.size = size;
    this.open = true;
  }
}
