/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'clr-enhanced-datepicker-demo',
  styleUrls: ['./datepicker.demo.scss'],
  templateUrl: './enhanced-datepicker.html',
})
export class EnhancedDatePickerDemo implements OnInit {
  dateForm = new FormGroup({
    dateV1: new FormControl(),
    minDateV1: new FormControl('2024-02-01'),
    maxDateV1: new FormControl('2024-10-31'),

    dateWithOptionV1: new FormControl(),
    minDateWithOptionV1: new FormControl('2024-02-01'),
    maxDateWithOptionV1: new FormControl('2024-10-31'),

    dateV2: new FormControl(),
    minDateV2: new FormControl('2024-02-01'),
    maxDateV2: new FormControl('2024-10-31'),

    dateV3: new FormControl(),
    minDateV3: new FormControl('2024-02-01'),
    maxDateV3: new FormControl('2024-10-31'),

    dateYearMonthV1: new FormControl(),
    minDateYearMonthV1: new FormControl('2024-02-01'),
    maxDateYearMonthV1: new FormControl('2024-12-31'),

    dateYearMonthWithOptionV1: new FormControl(),
    minDateYearMonthWithOptionV1: new FormControl('2024-02-01'),
    maxDateYearMonthWithOptionV1: new FormControl('2024-10-31'),

    dateYearMonthV2: new FormControl(),
    minDateYearMonthV2: new FormControl('2024-02-01'),
    maxDateYearMonthV2: new FormControl('2024-10-31'),

    dateMonthV1: new FormControl(),
    minDateMonthV1: new FormControl('2024-02-01'),
    maxDateMonthV1: new FormControl('2024-10-31'),

    dateYearV1: new FormControl(),
    minDateYearV1: new FormControl('2024-01-01'),
    maxDateYearV1: new FormControl('2025-12-31'),
  });

  ngOnInit(): void {
    // setInterval(() => {
    //   console.log(this.dateForm);
    // }, 4000);
  }
  stDateChanged(date: Date) {
    console.log(date);
  }

  endDateChanged(date: Date) {
    console.log(date);
  }

  addDays(date = new Date(), days) {
    return new Date(date.getTime() + 86400000 * days);
  }
}
