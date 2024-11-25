/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.demo.component.html',
})
export class NumberInputDemoComponent {
  form = new FormGroup({
    number: new FormControl(5),
    numberRequired: new FormControl(),
    numberReadonly: new FormControl(),
    numberDisabled: new FormControl({ value: null, disabled: true }),
  });
}
