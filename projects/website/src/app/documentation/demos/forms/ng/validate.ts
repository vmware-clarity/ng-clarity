/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClrAlertModule, ClrForm, ClrFormsModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, ClrFormsModule, ClrAlertModule],
})
export class ExampleComponent {
  submitted = false;
  error = false;
  readonly clrForm = viewChild(ClrForm);

  exampleForm = new FormGroup({
    sample: new FormControl('', Validators.required),
  });

  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  submit() {
    if (this.exampleForm.invalid) {
      this.clrForm()?.markAsTouched();

      // Do error logic
      this.error = true;
      setTimeout(() => {
        this.error = false;

        this.changeDetectorRef.markForCheck();
      }, 1000);
    } else {
      // Do submit logic
      this.submitted = true;
      setTimeout(() => {
        this.submitted = false;

        this.changeDetectorRef.markForCheck();
      }, 1000);
    }
  }
}
