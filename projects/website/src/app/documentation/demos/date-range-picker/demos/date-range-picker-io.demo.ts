/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';

import { DateRangePickerDateIODemo } from './date-range-picker-date-io.demo';
import { DateRangePickerReactiveFormsDemo } from './date-range-picker-reactive-forms';
import { DateRangePickerTemplateDrivenFormsDemo } from './date-range-picker-template-driven-forms';

@Component({
  selector: 'clr-date-range-picker-io-demo',
  templateUrl: './date-range-picker-io.demo.html',
  imports: [
    DateRangePickerDateIODemo,
    DateRangePickerTemplateDrivenFormsDemo,
    DateRangePickerReactiveFormsDemo,
    ClrAlertModule,
  ],
})
export class DateRangePickerIODemo {}
