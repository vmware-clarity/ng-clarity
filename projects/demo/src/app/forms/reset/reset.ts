/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClrForm } from '@clr/angular';

@Component({
  templateUrl: './reset.html',
  standalone: false,
})
export class FormsResetDemo {
  @ViewChild(ClrForm) form: ClrForm;

  model = new FormGroup({
    required: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/asdfasdf/)]),
  });

  validate() {
    this.form.markAsTouched();
  }
}
