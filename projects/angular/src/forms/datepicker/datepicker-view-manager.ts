/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { DatePickerHelperService } from './providers/datepicker-helper.service';
import { ViewManagerService } from './providers/view-manager.service';

@Component({
  selector: 'clr-datepicker-view-manager',
  templateUrl: './datepicker-view-manager.html',
  providers: [DatepickerFocusService],
  host: {
    '[attr.aria-modal]': 'true',
    '[attr.aria-label]': 'commonStrings.keys.datepickerDialogLabel',
    role: 'dialog',
  },
})
export class ClrDatepickerViewManager {
  dateRangeOptions = this.dateIOService.getRangeOptions();

  constructor(
    public commonStrings: ClrCommonStringsService,
    private viewManagerService: ViewManagerService,
    public dateIOService: DateIOService,
    private datePickerHelperService: DatePickerHelperService,
    public dateNavigationService: DateNavigationService
  ) {}

  /**
   * Returns if the current view is the monthpicker.
   */
  get isMonthView(): boolean {
    return this.viewManagerService.isMonthView;
  }

  /**
   * Returns if the current view is the yearpicker.
   */
  get isYearView(): boolean {
    return this.viewManagerService.isYearView;
  }

  /**
   * Returns if the current view is the daypicker.
   */
  get isDayView(): boolean {
    return this.viewManagerService.isDayView;
  }

  onRangeOptionSelect(selectedRange) {
    selectedRange?.value?.forEach(date => {
      this.datePickerHelperService.selectDay(this.datePickerHelperService.convertDateToDayModel(date));
    });
  }
}
