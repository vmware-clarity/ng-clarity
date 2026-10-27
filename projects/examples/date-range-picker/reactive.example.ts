/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClrCommonFormsModule, ClrDatepickerModule } from '@clr/angular';

@Component({
  selector: 'clr-date-range-picker-reactive-example',
  templateUrl: './reactive.example.html',
  imports: [JsonPipe, ReactiveFormsModule, ClrCommonFormsModule, ClrDatepickerModule],
})
export class DateRangePickerReactiveExample {
  dateForm = new FormGroup({ startDate: new FormControl(), endDate: new FormControl() });
}
