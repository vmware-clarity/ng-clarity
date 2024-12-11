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
  constructor(
    private _dateNavigationService: DateNavigationService,
    private _toggleService: ClrPopoverToggleService,
    private _dateFormControlService: DateFormControlService
  ) {}

  selectDay(day: DayModel, emitEvent = !this._dateNavigationService.hasActionButtons): void {
    this._dateNavigationService.notifySelectedDayChanged(day, emitEvent);
    this._dateFormControlService.markAsDirty();
    if (emitEvent) {
      this.toggleDatepickerVisibility();
    }
  }

  persistSelectedDates() {
    const selecteDate = this._dateNavigationService.interimSelectedDay;
    if (selecteDate) {
      this._dateNavigationService.setSelectedDay(selecteDate);
      this.toggleDatepickerVisibility();
    }
  }

  resetSelectedDates() {
    this._dateNavigationService.syncInterimDateValues();
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

  private toggleDatepickerVisibility(): void {
    const selecteDate = this._dateNavigationService.getSelectedDate();
    if (selecteDate) {
      this.closeDatePicker();
    }
  }
}
