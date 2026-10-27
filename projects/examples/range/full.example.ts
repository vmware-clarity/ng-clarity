/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrRangeModule } from '@clr/angular';

@Component({
  selector: 'clr-range-full-example',
  templateUrl: './full.example.html',
  imports: [FormsModule, ClrRangeModule],
})
export class RangeFullExample {
  value = 36;
}
