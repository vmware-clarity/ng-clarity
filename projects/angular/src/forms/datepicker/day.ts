/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, HostListener, Input, ViewChild } from '@angular/core';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { DayViewModel } from './model/day-view.model';
import { DayModel } from './model/day.model';
import { DateFormControlService } from './providers/date-form-control.service';
import { DateNavigationService } from './providers/date-navigation.service';

@Component({
  selector: 'clr-day',
  template: `
    <button
      #dayBtn
      class="day-btn"
      type="button"
      [class.is-today]="dayView.isTodaysDate"
      [class.is-excluded]="dayView.isExcluded"
      [class.is-disabled]="dayView.isDisabled"
      [class.is-selected]="dayView.isSelected"
      [class.in-range]="isInRange()"
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
  @ViewChild('dayBtn') dayBtn: HTMLElement;

  private _dayView: DayViewModel;

  constructor(
    private _dateNavigationService: DateNavigationService,
    private _toggleService: ClrPopoverToggleService,
    private dateFormControlService: DateFormControlService,
    private commonStrings: ClrCommonStringsService
  ) {}

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

  @HostListener('mouseenter')
  hoverListener() {
    if (!this.dayView.isExcluded && !this.dayView.isDisabled) {
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
    const day: DayModel = this.dayView.dayModel;
    this._dateNavigationService.notifySelectedDayChanged(day);
    this.dateFormControlService.markAsDirty();
    this.toggleDatepickerVisibility();
    this._dateNavigationService.hoveredDay = undefined;
    // this._toggleService.open = false;
  }

  toggleDatepickerVisibility() {
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

  isInRange() {
    if (!this._dateNavigationService.isRangePicker) {
      return false;
    }
    if (this._dateNavigationService.selectedDay && this._dateNavigationService.selectedEndDay) {
      // return this._dayView.dayModel.toDate()?.getTime() > this._dateNavigationService.selectedDay?.toDate()?.getTime() && this._dayView.dayModel.toDate()?.getTime() < this._dateNavigationService.selectedEndDay?.toDate()?.getTime();
      return (
        this._dayView.dayModel.isAfter(this._dateNavigationService.selectedDay) &&
        this._dayView.dayModel.isBefore(this._dateNavigationService.selectedEndDay)
      );
    } else if (this._dateNavigationService.selectedDay && !this._dateNavigationService.selectedEndDay) {
      // return this._dayView.dayModel.toDate()?.getTime() > this._dateNavigationService.selectedDay?.toDate()?.getTime() && this._dayView.dayModel.toDate()?.getTime() < this._dateNavigationService.hoveredDay?.toDate()?.getTime();
      return (
        this._dayView.dayModel.isAfter(this._dateNavigationService.selectedDay) &&
        this._dayView.dayModel.isBefore(this._dateNavigationService.hoveredDay)
      );
    } else {
      return false;
    }
  }
}
