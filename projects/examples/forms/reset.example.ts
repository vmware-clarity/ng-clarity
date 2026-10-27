/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClrAlertModule, ClrInputModule } from '@clr/angular';

@Component({
  selector: 'clr-forms-reset-example',
  templateUrl: './reset.example.html',
  imports: [ReactiveFormsModule, ClrInputModule, ClrAlertModule],
})
export class FormsResetExample {
  submitted = false;
  exampleForm = new FormGroup({
    sample: new FormControl('', Validators.required),
  });

  resetForm() {
    this.exampleForm.reset();
  }

  submit() {
    this.submitted = true;

    setTimeout(() => {
      this.submitted = false;
    }, 1000);
  }
}
