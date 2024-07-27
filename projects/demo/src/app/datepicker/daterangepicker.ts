/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
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
    startDateV1: new FormControl(),
    endDateV1: new FormControl(),
    minDateV1: new FormControl('2024-02-01'),
    maxDateV1: new FormControl('2024-12-31'),

    startDateWithOptionV1: new FormControl(),
    endDateWithOptionV1: new FormControl(),
    minDateWithOptionV1: new FormControl('2024-02-01'),
    maxDateWithOptionV1: new FormControl('2024-12-31'),
  });

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
    { label: 'Custom Range', value: [], isCustomRange: true },
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
    { label: 'Custom Range', value: [], isCustomRange: true },
  ];

  ngOnInit(): void {
    this.dateForm.get('startDateV1').statusChanges.subscribe(status => {
      console.log('🚀 ~ DateRangePickerDemo ~ startDateV1 ~ status:', status);
    });
    this.dateForm.get('endDateV1').statusChanges.subscribe(status => {
      console.log('🚀 ~ DateRangePickerDemo ~ endDateV1 ~ status:', status);
    });
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
