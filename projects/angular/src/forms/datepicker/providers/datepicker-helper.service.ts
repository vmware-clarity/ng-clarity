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
import { DateNavigationService } from './date-navigation.service';

@Injectable()
export class DatePickerHelperService {
  disabled: boolean;

  constructor(
    private _dateNavigationService: DateNavigationService,
    private _toggleService: ClrPopoverToggleService,
    private _dateFormControlService: DateFormControlService
  ) {}

  selectDay(day: DayModel, emitEvent = !this._dateNavigationService.hasActionButtons): void {
    this._dateNavigationService.notifySelectedDayChanged(day, emitEvent);
    this._dateFormControlService.markAsDirty();
    this._dateNavigationService.hoveredDay = undefined;
    if (emitEvent) {
      this.toggleDatepickerVisibility();
    }
  }

  persistSelectedDates() {
    const startDate = this._dateNavigationService.interimSelectedDay,
      endDate = this._dateNavigationService.interimSelectedEndDay,
      isRangePicker = this._dateNavigationService.isRangePicker;
    if ((isRangePicker && !!startDate && !!endDate) || (!isRangePicker && !!startDate)) {
      this._dateNavigationService.setSelectedDay(startDate);
      this._dateNavigationService.setSelectedEndDay(endDate);
      this.toggleDatepickerVisibility();
    }
  }

  resetSelectedDates() {
    this._dateNavigationService.syncInterimDateValues();
  }

  toggleDatepickerVisibility(): void {
    const isRangePicker = this._dateNavigationService.isRangePicker,
      startDate = this._dateNavigationService.getSelectedDate(),
      endDate = this._dateNavigationService.getSelectedEndDate();
    if ((isRangePicker && !!startDate && !!endDate) || (!isRangePicker && !!startDate)) {
      this.closeDatePicker();
    }
  }

  closeDatePicker() {
    this._toggleService.open = false;
  }

  convertDateToDayModel(date: Date): DayModel {
    return new DayModel(date.getFullYear(), date.getMonth(), date.getDate());
  }

  convertStringDateToDayModel(year: number, month: number, day: number): DayModel {
    return new DayModel(year, month, day);
  }
}
