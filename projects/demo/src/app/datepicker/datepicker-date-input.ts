/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const date1: Date = new Date(2015, 1, 1);
const date2: Date = new Date(2017, 4, 5);

@Component({
  selector: 'clr-datepicker-date-input-demo',
  styleUrls: ['./datepicker.demo.scss'],
  templateUrl: './datepicker-date-input.html',
  standalone: false,
})
export class DatepickerDateInputDemo {
  date: Date = date1;
  dateStr: string;

  dateChanged(date: Date) {
    console.log('Datepicker Output Changed', date);
    if (date) {
      this.dateStr = date.toLocaleDateString();
    } else {
      this.dateStr = '';
    }
  }

  updateDate(): void {
    if (this.date === date1) {
      this.date = date2;
    } else {
      this.date = date1;
    }
  }
}
