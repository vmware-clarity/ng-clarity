/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrWeekday } from '@clr/angular';

@Component({
  selector: 'clr-datepicker-first-day-of-week-demo',
  templateUrl: './datepicker-first-day-of-week.html',
  styleUrls: ['./datepicker.demo.scss'],
  standalone: false,
})
export class DatepickerFirstDayOfWeekDemo {
  firstDayOfWeek: ClrWeekday = null;

  weekdayOptions: { label: string; value: ClrWeekday }[] = [
    { label: 'Locale Default', value: null },
    { label: ClrWeekday[0], value: ClrWeekday.Sunday },
    { label: ClrWeekday[1], value: ClrWeekday.Monday },
    { label: ClrWeekday[2], value: ClrWeekday.Tuesday },
    { label: ClrWeekday[3], value: ClrWeekday.Wednesday },
    { label: ClrWeekday[4], value: ClrWeekday.Thursday },
    { label: ClrWeekday[5], value: ClrWeekday.Friday },
    { label: ClrWeekday[6], value: ClrWeekday.Saturday },
  ];

  get firstDayLabel(): string {
    if (this.firstDayOfWeek === null) {
      return 'locale default';
    }
    return ClrWeekday[this.firstDayOfWeek];
  }
}
