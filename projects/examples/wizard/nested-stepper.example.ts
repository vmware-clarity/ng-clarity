/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClrInputModule, ClrStepperModule, ClrWizard, ClrWizardModule } from '@clr/angular';

@Component({
  selector: 'clr-wizard-nested-stepper-example',
  templateUrl: './nested-stepper.example.html',
  imports: [ReactiveFormsModule, ClrWizardModule, ClrStepperModule, ClrInputModule],
})
export class WizardNestedStepperExample {
  @ViewChild('parentWizard') parentWizard: ClrWizard | undefined;

  _open = false;
  stepperComplete = false;

  stepperForm = new FormGroup({
    name: new FormGroup({ value: new FormControl('') }),
    description: new FormGroup({ value: new FormControl('') }),
    details: new FormGroup({ value: new FormControl('') }),
  });

  onStepperSubmit() {
    this.stepperComplete = true;
    this.parentWizard?.forceNext();
  }
}
