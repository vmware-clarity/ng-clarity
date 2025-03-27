/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { DayViewModel } from './model/day-view.model';
import { DayModel } from './model/day.model';
import { DateNavigationService } from './providers/date-navigation.service';

@Component({
  selector: 'clr-day',
  template: `
    <button
      class="day-btn"
      type="button"
      [class.is-today]="dayView.isTodaysDate"
      [class.is-excluded]="dayView.isExcluded"
      [class.is-disabled]="dayView.isDisabled"
      [class.is-selected]="dayView.isSelected"
      [class.in-range]="isInRange()"
      [class.is-start-range]="isRangeStartDay"
      [class.is-end-range]="isRangeEndDay"
      [attr.tabindex]="dayView.tabIndex"
      (click)="selectDay()"
      (focus)="onDayViewFocus()"
      [attr.aria-current]="dayView.isTodaysDate ? 'date' : 'false'"
      [attr.aria-label]="dayString"
      [attr.aria-selected]="dayView.isSelected"
    >
      {{ dayView.dayModel.date }}
    </button>
  `,
  host: { '[class.day]': 'true' },
})
export class ClrDay {
  @Output('selectDay') onSelectDay = new EventEmitter<DayModel>();

  private _dayView: DayViewModel;

  constructor(private _dateNavigationService: DateNavigationService, private commonStrings: ClrCommonStringsService) {}

  /**
   * DayViewModel input which is used to build the Day View.
   */

  @Input('clrDayView')
  get dayView(): DayViewModel {
    return this._dayView;
  }
  set dayView(day: DayViewModel) {
    this._dayView = day;
  }

  get dayString(): string {
    return this.dayView.isSelected
      ? this.commonStrings.parse(this.commonStrings.keys.datepickerSelectedLabel, {
          FULL_DATE: this._dayView.dayModel.toDateString(),
        })
      : this._dayView.dayModel.toDateString();
  }

  get isRangeStartDay(): boolean {
    return (
      this._dateNavigationService.isRangePicker &&
      this.dayView?.dayModel?.toComparisonString() === this._dateNavigationService.selectedDay?.toComparisonString()
    );
  }

  get isRangeEndDay(): boolean {
    return (
      this._dateNavigationService.isRangePicker &&
      this.dayView?.dayModel?.toComparisonString() === this._dateNavigationService.selectedEndDay?.toComparisonString()
    );
  }

  /**
   * Calls the DateNavigationService to update the hovered day value of the calendar
   */
  @HostListener('mouseenter')
  hoverListener(): void {
    if (!this.dayView.isDisabled) {
      this._dateNavigationService.hoveredDay = this.dayView.dayModel;
    }
  }

  /**
   * Updates the focusedDay in the DateNavigationService when the ClrDay is focused.
   */
  onDayViewFocus() {
    this._dateNavigationService.focusedDay = this.dayView.dayModel;
  }

  /**
   * Updates the selectedDay when the ClrDay is selected and closes the datepicker popover.
   */
  selectDay(): void {
    if (this.dayView.isDisabled) {
      return;
    }
    const day: DayModel = this.dayView.dayModel;
    this.onSelectDay.emit(day);
  }

  /**
   * Applicable only to date range picker
   * Compares whether the day is in between the start and end date range
   */
  isInRange(): boolean {
    if (!this._dateNavigationService.isRangePicker) {
      return false;
    }
    if (this._dateNavigationService.selectedDay && this._dateNavigationService.selectedEndDay) {
      return (
        this._dayView.dayModel?.isAfter(this._dateNavigationService.selectedDay) &&
        this._dayView.dayModel?.isBefore(this._dateNavigationService.selectedEndDay)
      );
    } else if (this._dateNavigationService.selectedDay && !this._dateNavigationService.selectedEndDay) {
      return (
        this._dayView.dayModel?.isAfter(this._dateNavigationService.selectedDay) &&
        this._dayView.dayModel?.isBefore(this._dateNavigationService.hoveredDay, true)
      );
    } else {
      return false;
    }
  }
}
