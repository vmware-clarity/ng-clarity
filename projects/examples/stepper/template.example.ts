/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrCommonFormsModule,
  ClrInputModule,
  ClrPasswordModule,
  ClrStepperModule,
} from '@clr/angular';

@Component({
  selector: 'clr-stepper-template-example',
  templateUrl: './template.example.html',
  imports: [FormsModule, ClrCommonFormsModule, ClrInputModule, ClrPasswordModule, ClrStepperModule],
})
export class StepperTemplateExample {
  templateForm = {
    name: {
      firstName: '',
      lastName: '',
    },
    contact: {
      email: '',
      phone: '',
    },
    password: {
      password: '',
      confirm: '',
    },
  };

  templateFormSubmit(templateFormValues: object) {
    console.log('template form submit', templateFormValues);
  }
}
