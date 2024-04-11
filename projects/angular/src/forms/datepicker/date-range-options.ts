/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrCommonStringsService } from '../../utils';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { DatePickerHelperService } from './providers/datepicker-helper.service';

@Component({
  selector: 'clr-date-range-options',
  templateUrl: './date-range-options.html',
  providers: [DatepickerFocusService],
  host: {
    '[class.date-range-options]': 'true',
    '[attr.aria-modal]': 'true',
    role: 'dialog',
  },
})
export class ClrDateRangeOptions {
  dateRangeOptions = this.dateIOService.getRangeOptions();

  constructor(
    public dateIOService: DateIOService,
    public commonStrings: ClrCommonStringsService,
    private datePickerHelperService: DatePickerHelperService,
    public dateNavigationService: DateNavigationService
  ) {}

  onRangeOptionSelect(selectedRange) {
    selectedRange?.value?.forEach(date => {
      console.log('🚀 ~ ClrDateRangeOptions ~ onRangeOptionSelect ~ selectedRange:', date);
      this.datePickerHelperService.selectDay(this.datePickerHelperService.convertDateToDayModel(date));
    });
  }
}
