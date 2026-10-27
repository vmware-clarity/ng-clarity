/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrCommonFormsModule, ClrDatepickerModule, DateRangeOption } from '@clr/angular';

@Component({
  selector: 'clr-date-range-picker-range-options-example',
  templateUrl: './range-options.example.html',
  imports: [FormsModule, ClrCommonFormsModule, ClrDatepickerModule],
})
export class DateRangePickerRangeOptionsExample {
  startDate: string | undefined;
  endDate: string | undefined;

  dateRangeOptions: DateRangeOption[] = [
    { label: 'Today', value: [new Date(), new Date()] },
    { label: 'Last 7 Days', value: [this.addDays(new Date(), -7), this.addDays(new Date(), -1)] },
    { label: 'Last 14 Days', value: [this.addDays(new Date(), -14), this.addDays(new Date(), -1)] },
    { label: 'Last 30 Days', value: [this.addDays(new Date(), -30), this.addDays(new Date(), -1)] },
    { label: 'Last 90 Days', value: [this.addDays(new Date(), -90), this.addDays(new Date(), -1)] },
  ];

  addDays(date = new Date(), days: number) {
    return new Date(date.getTime() + 86400000 * days);
  }
}
