/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrRadioModule } from '@clr/angular';

@Component({
  selector: 'clr-radio-inline-example',
  templateUrl: './inline.example.html',
  imports: [FormsModule, ClrRadioModule],
})
export class RadioInlineExample {
  options = '';
}
