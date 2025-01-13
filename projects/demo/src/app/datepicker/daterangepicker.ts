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
    showActionButtons: new FormControl(true),
    showRangeOptions: new FormControl(true),
    date: new FormControl(),
    minDate: new FormControl('2024-02-01'),
    maxDate: new FormControl('2025-12-31'),

    startDateV1: new FormControl(),
    endDateV1: new FormControl(),
    minDateV1: new FormControl('2024-02-01'),
    maxDateV1: new FormControl('2025-12-31'),
  });

  dateRangeOptions = [
    { label: 'Today', value: [new Date(), new Date()] },
    { label: 'Last 7 Days', value: [this.addDays(new Date(), -7), this.addDays(new Date(), -1)] },
    { label: 'Last 14 Days', value: [this.addDays(new Date(), -14), this.addDays(new Date(), -1)] },
    { label: 'Last 30 Days', value: [this.addDays(new Date(), -30), this.addDays(new Date(), -1)] },
    { label: 'Last 90 Days', value: [this.addDays(new Date(), -90), this.addDays(new Date(), -1)] },
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
