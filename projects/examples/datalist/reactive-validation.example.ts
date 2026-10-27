/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClrCommonFormsModule, ClrDatalistModule } from '@clr/angular';

@Component({
  selector: 'clr-datalist-reactive-validation-example',
  templateUrl: './reactive-validation.example.html',
  imports: [ReactiveFormsModule, ClrCommonFormsModule, ClrDatalistModule],
})
export class DatalistReactiveValidationExample {
  items: string[] = ['Item1', 'Item2', 'Item3'];
  form = new FormGroup({
    item: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  submit() {
    console.log('Form submit', this.form.value);
  }
}
