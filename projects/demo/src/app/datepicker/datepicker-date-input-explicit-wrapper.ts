/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, LOCALE_ID } from '@angular/core';

@Component({
  selector: 'clr-datepicker-date-input-wrapper-present-demo',
  styleUrls: ['./datepicker.demo.scss'],
  templateUrl: './datepicker-date-input-explicit-wrapper.html',
  providers: [{ provide: LOCALE_ID, useValue: 'en' }],
  standalone: false,
})
export class DatepickerDateInputExplicitWrapperDemo {
  date: Date = new Date();

  dateChanged(date: Date) {
    console.log('Datepicker Container Output Changed', date);
    this.date = date;
  }
}
