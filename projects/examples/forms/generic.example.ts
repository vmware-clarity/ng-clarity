/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClrCommonFormsModule, ClrSelectModule } from '@clr/angular';

@Component({
  selector: 'clr-forms-generic-example',
  templateUrl: './generic.example.html',
  imports: [FormsModule, ReactiveFormsModule, ClrCommonFormsModule, ClrSelectModule],
})
export class FormsGenericExample {
  cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab', disabled: true },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
    { id: 'custom', name: 'Custom' },
  ];

  model = {
    basic: '',
    container: '',
    required: '',
    cars: [3],
  };

  reactiveModel: FormGroup = inject(FormBuilder).group({
    basic: new FormControl(),
    container: new FormControl(),
    required: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.pattern(/asdfasdf/),
    ]),
    cars: new FormControl([3], [Validators.required]),
  });
}
