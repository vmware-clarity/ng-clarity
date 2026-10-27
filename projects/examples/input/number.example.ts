/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrNumberInputModule } from '@clr/angular';

@Component({
  selector: 'clr-input-number-example',
  templateUrl: './number.example.html',
  imports: [FormsModule, ClrNumberInputModule],
})
export class InputNumberExample {
  input: number | undefined;
}
