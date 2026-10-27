/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrTextareaModule } from '@clr/angular';

@Component({
  selector: 'clr-textarea-helpers-example',
  templateUrl: './helpers.example.html',
  imports: [FormsModule, ClrTextareaModule],
})
export class TextareaHelpersExample {
  description = '';
}
