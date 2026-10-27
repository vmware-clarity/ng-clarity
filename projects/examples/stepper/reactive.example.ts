/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ClrCommonFormsModule,
  ClrIfExpanded,
  ClrInputModule,
  ClrPasswordModule,
  ClrStepperModule,
} from '@clr/angular';

@Component({
  selector: 'clr-stepper-reactive-example',
  templateUrl: './reactive.example.html',
  imports: [
    ReactiveFormsModule,
    ClrCommonFormsModule,
    ClrInputModule,
    ClrPasswordModule,
    ClrStepperModule,
    ClrIfExpanded,
  ],
})
export class StepperReactiveExample {
  form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      name: formBuilder.group({
        first: ['Luke', Validators.required],
        last: ['Skywalker', Validators.required],
      }),
      contact: formBuilder.group({
        email: [],
        phone: [],
      }),
      password: formBuilder.group({
        password: [],
        confirm: [],
      }),
    });
  }

  submit() {
    console.log('reactive form submit', this.form.value);
  }
}
