/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { DateFormControlService } from './providers/date-form-control.service';
import { DateNavigationService } from './providers/date-navigation.service';

@Component({
  selector: 'clr-datepicker-actions',
  template: `
    <button class="btn btn-outline" (click)="cancel()">{{ commonStrings.keys.cancel }}</button>
    <button class="btn btn-primary" (click)="apply()">{{ commonStrings.keys.apply }}</button>
  `,
  host: {
    '[class.datepicker-actions]': 'true',
  },
  standalone: false,
})
export class ClrDatepickerActions {
  constructor(
    protected commonStrings: ClrCommonStringsService,
    private toggleService: ClrPopoverToggleService,
    private dateNavigationService: DateNavigationService,
    private dateFormControlService: DateFormControlService
  ) {}

  protected apply() {
    if (
      this.dateNavigationService.isRangePicker &&
      this.dateNavigationService.selectedDay &&
      this.dateNavigationService.selectedEndDay
    ) {
      this.dateNavigationService.notifySelectedDayChanged({
        startDate: this.dateNavigationService.selectedDay,
        endDate: this.dateNavigationService.selectedEndDay,
      });
      this.dateFormControlService.markAsDirty();
    } else if (!this.dateNavigationService.isRangePicker && this.dateNavigationService.selectedDay) {
      this.dateNavigationService.notifySelectedDayChanged(this.dateNavigationService.selectedDay);
      this.dateFormControlService.markAsDirty();
    }
    this.toggleService.open = false;
  }

  protected cancel() {
    this.dateNavigationService.resetSelectedDay();
    this.toggleService.open = false;
  }
}
