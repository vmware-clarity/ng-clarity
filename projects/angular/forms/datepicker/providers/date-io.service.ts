/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { LocaleHelperService } from './locale-helper.service';
import { DateRange, DateRangeOption } from '../interfaces/date-range.interface';
import { DayModel } from '../model/day.model';
import { ClrLocaleDateFormat } from '../utils/locale-date-format';

@Injectable()
export class DateIOService {
  /**
   * This is the default range. It approximates the beginning of time to the end of time.
   * The disabled dates are the dates that are not allowed to be selected.
   * The min date is the earliest date that can be selected.
   * The max date is the latest date that can be selected.
   * Unless a minDate or maxDate is set with the native HTML5 api the range is all dates
   */
  disabledDates: DateRange = {
    minDate: new DayModel(0, 0, 1),
    maxDate: new DayModel(9999, 11, 31),
  };

  minDateChange = new Subject<DayModel>();
  maxDateChange = new Subject<DayModel>();

  private dateRangeOptions;
  // Locale-only formatting and parsing; the state above is per date picker.
  private readonly localeDateFormat: ClrLocaleDateFormat;

  constructor(localeHelperService: LocaleHelperService) {
    this.localeDateFormat = new ClrLocaleDateFormat(localeHelperService.locale);
  }

  get placeholderText(): string {
    return this.localeDateFormat.placeholder;
  }

  setMinDate(date: string): void {
    // NOTE: I'm expecting consumers to pass one of four things here:
    //       A proper date string(2019-11-11), null, undefined or empty string ('')
    if (!date) {
      // attribute binding was removed, reset back to the beginning of time
      this.disabledDates.minDate = new DayModel(0, 0, 1);
    } else {
      const [year, month, day] = date.split('-').map(n => parseInt(n, 10));
      this.disabledDates.minDate = new DayModel(year, month - 1, day);
    }
    this.minDateChange.next(this.disabledDates.minDate);
  }

  setMaxDate(date: string): void {
    // NOTE: I'm expecting consumers to pass one of four things here:
    //       A proper date string(2019-11-11), null, undefined or empty string ('')
    if (!date) {
      // attribute binding was removed, reset forward to the end of time
      this.disabledDates.maxDate = new DayModel(9999, 11, 31);
    } else {
      const [year, month, day] = date.split('-').map(n => parseInt(n, 10));
      this.disabledDates.maxDate = new DayModel(year, month - 1, day);
    }
    this.maxDateChange.next(this.disabledDates.maxDate);
  }

  setRangeOptions(rangeOptions: DateRangeOption[]) {
    const validatedRangeOption = this.validateDateRangeOptions(rangeOptions);
    this.dateRangeOptions = validatedRangeOption || [];
  }

  getRangeOptions() {
    return this.dateRangeOptions;
  }

  toLocaleDisplayFormatString(date: Date): string {
    return this.localeDateFormat.format(date);
  }

  getDateValueFromDateString(date: string): Date {
    return this.localeDateFormat.parse(date);
  }

  private validateDateRangeOptions(rangeOptions: DateRangeOption[]): DateRangeOption[] {
    const validOptions = [];
    rangeOptions?.forEach((rangeOption: DateRangeOption) => {
      if (
        rangeOption?.value?.length !== 2 ||
        Object.prototype.toString.call(rangeOption?.value[0]) !== '[object Date]' ||
        Object.prototype.toString.call(rangeOption?.value[1]) !== '[object Date]'
      ) {
        return;
      }
      validOptions.push(rangeOption);
    });
    return validOptions;
  }
}
