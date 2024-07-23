/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

import { ClrPopoverToggleService } from '../../../utils/popover/providers/popover-toggle.service';
import { DayModel } from '../model/day.model';
import { DateFormControlService } from './date-form-control.service';
import { DateIOService } from './date-io.service';
import { DateNavigationService } from './date-navigation.service';
import { ViewManagerService } from './view-manager.service';

@Injectable()
export class DatePickerHelperService {
  disabled: boolean;

  constructor(
    private _dateNavigationService: DateNavigationService,
    private _dateIOService: DateIOService,
    private _toggleService: ClrPopoverToggleService,
    private _viewManagerService: ViewManagerService,
    private _dateFormControlService: DateFormControlService
  ) {}

  selectDay(day: DayModel): void {
    this.updateSelectedDate(day);
  }

  updateSelectedDate(day: DayModel): void {
    this._dateNavigationService.notifySelectedDayChanged(day);
    this._dateFormControlService.markAsDirty();
    this.toggleDatepickerVisibility();
    this._dateNavigationService.hoveredDay = undefined;
  }

  toggleDatepickerVisibility(): void {
    if (
      this._dateNavigationService.isRangePicker &&
      !!this._dateNavigationService.selectedDay &&
      !!this._dateNavigationService.selectedEndDay
    ) {
      this._toggleService.open = false;
    } else if (!this._dateNavigationService.isRangePicker && !!this._dateNavigationService.selectedDay) {
      this._toggleService.open = false;
    }
  }

  convertDateToDayModel(date: Date): DayModel {
    return new DayModel(date.getFullYear(), date.getMonth(), date.getDate());
  }

  convertStringDateToDayModel(year: number, month: number, day: number): DayModel {
    return new DayModel(year, month, day);
  }
}
