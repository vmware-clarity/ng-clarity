/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrCommonFormsModule, ClrDatepickerModule } from '@clr/angular';

@Component({
  selector: 'clr-datepicker-min-max-example',
  templateUrl: './min-max.example.html',
  imports: [FormsModule, ClrCommonFormsModule, ClrDatepickerModule],
})
export class DatepickerMinMaxExample {
  value: string | undefined;
}
