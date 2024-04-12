/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'clr-daterangepicker-demo',
  styleUrls: ['./datepicker.demo.scss'],
  templateUrl: './daterangepicker.html',
})
export class DateRangePickerDemo {
  dateForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
    startDate1: new FormControl(),
    endDate1: new FormControl(),
    startDate2: new FormControl('Apr/2024'),
    endDate2: new FormControl('Jun/2024'),
    startDate3: new FormControl('2022'),
    endDate3: new FormControl('2024'),
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
