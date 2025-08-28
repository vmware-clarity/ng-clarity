/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ClrWizard } from '@clr/angular';

@Component({
  selector: 'clr-wizard-inline',
  templateUrl: './wizard-inline.demo.html',
  standalone: false,
})
export class WizardInlineDemo {
  @ViewChild('wizard') wizard: ClrWizard;

  open = true;
}
