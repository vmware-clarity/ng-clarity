/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'clr-daterangepicker-demo',
  styleUrls: ['./datepicker.demo.scss'],
  templateUrl: './daterangepicker.html',
})
export class DateRangePickerDemo implements OnInit {
  dateForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
    startDate1: new FormControl(),
    endDate1: new FormControl(),
    startDate2: new FormControl('Apr/2024'),
    endDate2: new FormControl('Jun/2024'),
    startDate3: new FormControl('2022'),
    endDate3: new FormControl('2024'),

    startDateV1: new FormControl(),
    endDateV1: new FormControl(),
    minDateV1: new FormControl('2024-02-15'),
    maxDateV1: new FormControl('2024-12-15'),

    startDateWithOptionV1: new FormControl(),
    endDateWithOptionV1: new FormControl(),
    minDateWithOptionV1: new FormControl('2024-02-15'),
    maxDateWithOptionV1: new FormControl('2024-12-15'),

    startDateV2: new FormControl(),
    endDateV2: new FormControl(),
    minDateV2: new FormControl('2024-02-15'),
    maxDateV2: new FormControl('2024-12-15'),

    startDateV3: new FormControl(),
    endDateV3: new FormControl(),
    minDateV3: new FormControl('2024-02-15'),
    maxDateV3: new FormControl('2024-12-15'),

    startDateYearMonthV1: new FormControl(),
    endDateYearMonthV1: new FormControl(),
    minDateYearMonthV1: new FormControl('2024-02'),
    maxDateYearMonthV1: new FormControl('2024-12'),

    startDateYearMonthWithOptionV1: new FormControl(),
    endDateYearMonthWithOptionV1: new FormControl(),
    minDateYearMonthWithOptionV1: new FormControl('2024-02'),
    maxDateYearMonthWithOptionV1: new FormControl('2024-12'),

    startDateYearMonthV2: new FormControl(),
    endDateYearMonthV2: new FormControl(),
    minDateYearMonthV2: new FormControl('2024-02'),
    maxDateYearMonthV2: new FormControl('2024-12'),

    startDateMonthV1: new FormControl(),
    endDateMonthV1: new FormControl(),
    minDateMonthV1: new FormControl('2024-02'),
    maxDateMonthV1: new FormControl('2024-10'),

    startDateYearV1: new FormControl(),
    endDateYearV1: new FormControl(),
    minDateYearV1: new FormControl('2024'),
    maxDateYearV1: new FormControl('2024'),

    startDateYearWithOptionV1: new FormControl(),
    endDateYearWithOptionV1: new FormControl(),
    minDateYearWithOptionV1: new FormControl('2024'),
    maxDateYearWithOptionV1: new FormControl('2024'),
  });
  minDate = '2020-02-15';
  maxDate = '2034-11-15';

  dateRangeOptions = [
    { label: 'Today', value: [new Date(), new Date()] },
    { label: 'Last 7 Days', value: [this.addDays(new Date(), -7), new Date()] },
    { label: 'Last 14 Days', value: [this.addDays(new Date(), -14), new Date()] },
    { label: 'Last 30 Days', value: [this.addDays(new Date(), -30), new Date()] },
    { label: 'Last 90 Days', value: [this.addDays(new Date(), -90), new Date()] },
  ];

  monthRangeOptions = [
    {
      label: 'This Month',
      value: [
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      ],
    },
    {
      label: 'Last Month',
      value: [
        new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      ],
    },
    {
      label: 'Last 2 Months',
      value: [
        new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1),
        new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      ],
    },
    {
      label: 'Last 6 Months',
      value: [
        new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1),
        new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      ],
    },
    {
      label: 'Last 12 Months',
      value: [
        new Date(new Date().getFullYear(), new Date().getMonth() - 12, 1),
        new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      ],
    },
  ];

  yearRangeOptions = [
    {
      label: 'This year',
      value: [new Date(new Date().getFullYear(), 1, 1), new Date(new Date().getFullYear() + 1, 0, 0)],
    },
    {
      label: 'Last year',
      value: [new Date(new Date().getFullYear() - 1, 1, 1), new Date(new Date().getFullYear(), 0, 0)],
    },
    {
      label: 'Last 2 Years',
      value: [new Date(new Date().getFullYear() - 2, 1, 1), new Date(new Date().getFullYear(), 0, 0)],
    },
    {
      label: 'Last 5 Years',
      value: [new Date(new Date().getFullYear() - 5, 1, 1), new Date(new Date().getFullYear(), 0, 0)],
    },
  ];

  ngOnInit(): void {
    setInterval(() => {
      console.log(this.dateForm);
    }, 4000);
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
