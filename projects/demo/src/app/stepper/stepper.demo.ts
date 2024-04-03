/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: 'stepper.demo.html',
  styleUrls: ['./stepper.demo.scss'],
})
export class StepperDemo {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      dbMainConfig: this.formBuilder.group({
        dbName: ['', Validators.required, Validators.minLength(3)], // Database Name
      }),
    });
  }

  submit() {
    console.log('reactive form submit', this.form.value);
  }
}
