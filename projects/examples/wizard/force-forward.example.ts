/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ClrWizard, ClrWizardModule } from '@clr/angular';

@Component({
  selector: 'clr-wizard-force-forward-example',
  templateUrl: './force-forward.example.html',
  imports: [ClrWizardModule],
})
export class WizardForceForwardExample {
  @ViewChild('wizard') wizard: ClrWizard | undefined;
  open = false;
}
