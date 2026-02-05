/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { ViewManagerService } from './providers/view-manager.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';

@Component({
  selector: 'clr-datepicker-view-manager',
  templateUrl: './datepicker-view-manager.html',
  providers: [DatepickerFocusService],
  host: {
    '[class.datepicker]': 'true',
    '[class.has-range-option]': 'hasRangeOptions',
    '[class.has-action-buttons]': 'hasActionButtons',
    '[attr.aria-modal]': 'true',
    '[attr.aria-label]': 'commonStrings.keys.datepickerDialogLabel',
    role: 'dialog',
  },
  standalone: false,
})
export class ClrDatepickerViewManager {
  constructor(
    public commonStrings: ClrCommonStringsService,
    private viewManagerService: ViewManagerService,
    private dateNavigationService: DateNavigationService,
    private dateIOService: DateIOService
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

  get hasRangeOptions() {
    return !!this.dateNavigationService?.isRangePicker && !!this.dateRangeOptions?.length;
  }

  protected get hasActionButtons() {
    return this.dateNavigationService.hasActionButtons;
  }

  protected get dateRangeOptions() {
    return this.dateIOService.getRangeOptions();
  }

  onRangeOptionSelect(selectedRange) {
    const startDate = this.dateNavigationService.convertDateToDayModel(selectedRange?.value[0]),
      endDate = this.dateNavigationService.convertDateToDayModel(selectedRange?.value[1]);
    this.dateNavigationService.notifySelectedDayChanged({ startDate, endDate }, { emitEvent: !this.hasActionButtons });
    this.dateNavigationService.moveToSpecificMonth(startDate);
  }
}
