/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrCommonFormsModule, ClrDatepickerModule } from '@clr/angular';

@Component({
  selector: 'clr-datepicker-date-object-example',
  templateUrl: './date-object.example.html',
  imports: [JsonPipe, ClrCommonFormsModule, ClrDatepickerModule],
})
export class DatepickerDateObjectExample {
  date = new Date('2023-06-30T12:00');
}
