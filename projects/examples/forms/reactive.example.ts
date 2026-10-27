/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClrInputModule } from '@clr/angular';

@Component({
  selector: 'clr-forms-reactive-example',
  templateUrl: './reactive.example.html',
  imports: [ReactiveFormsModule, ClrInputModule],
})
export class FormsReactiveExample {
  exampleForm = new FormGroup({
    sample: new FormControl('', Validators.required),
  });
}
