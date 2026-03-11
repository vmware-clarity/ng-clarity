/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClrAlertModule, ClrForm, ClrFormsModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  imports: [CommonModule, ReactiveFormsModule, ClrFormsModule, ClrAlertModule],
})
export class ExampleComponent {
  submitted = false;
  error = false;
  readonly clrForm = viewChild(ClrForm);

  exampleForm = new FormGroup({
    sample: new FormControl('', Validators.required),
  });

  submit() {
    if (this.exampleForm.invalid) {
      this.clrForm()?.markAsTouched();

      // Do error logic
      this.error = true;
      setTimeout(() => {
        this.error = false;
      }, 1000);
    } else {
      // Do submit logic
      this.submitted = true;
      setTimeout(() => {
        this.submitted = false;
      }, 1000);
    }
  }
}
