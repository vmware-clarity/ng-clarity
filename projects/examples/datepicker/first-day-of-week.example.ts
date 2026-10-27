/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrCommonFormsModule, ClrDatepickerModule, ClrSelectModule, ClrWeekday } from '@clr/angular';

@Component({
  selector: 'clr-datepicker-first-day-of-week-example',
  templateUrl: './first-day-of-week.example.html',
  imports: [FormsModule, ClrCommonFormsModule, ClrDatepickerModule, ClrSelectModule],
})
export class DatepickerFirstDayOfWeekExample {
  value: string | undefined;

  // Force Monday to be the first day of the week regardless of locale.
  firstDayOfWeek: ClrWeekday | null = ClrWeekday.Monday;

  weekdayOptions: { label: string; value: ClrWeekday | null }[] = [
    { label: 'Locale Default', value: null },
    { label: ClrWeekday[0], value: ClrWeekday.Sunday },
    { label: ClrWeekday[1], value: ClrWeekday.Monday },
    { label: ClrWeekday[2], value: ClrWeekday.Tuesday },
    { label: ClrWeekday[3], value: ClrWeekday.Wednesday },
    { label: ClrWeekday[4], value: ClrWeekday.Thursday },
    { label: ClrWeekday[5], value: ClrWeekday.Friday },
    { label: ClrWeekday[6], value: ClrWeekday.Saturday },
  ];
}
