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

  get firstDayLabel(): string {
    if (this.firstDayOfWeek === null) {
      return 'locale default';
    }
    return ClrWeekday[this.firstDayOfWeek];
  }

  onFirstDayChange(value: string) {
    this.firstDayOfWeek = value === '' ? null : (Number(value) as ClrWeekday);
  }
}
