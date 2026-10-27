/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrFormsModule, ClrWizard, ClrWizardModule } from '@clr/angular';

@Component({
  selector: 'clr-wizard-form-validation-example',
  templateUrl: './form-validation.example.html',
  imports: [ClrWizardModule, ClrFormsModule, FormsModule],
})
export class WizardFormValidationExample {
  @ViewChild('wizard') wizard: ClrWizard | undefined;
  @ViewChild('number') numberField: any;
  open = false;

  model = {
    name: '',
    favorite: '',
    number: '',
  };
}
