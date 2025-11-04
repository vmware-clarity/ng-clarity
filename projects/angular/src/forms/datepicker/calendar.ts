/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DateRangeInput } from './interfaces/date-range.interface';
import { ClrDayOfWeek } from './interfaces/day-of-week.interface';
import { CalendarViewModel } from './model/calendar-view.model';
import { CalendarModel } from './model/calendar.model';
import { DayModel } from './model/day.model';
import { DateFormControlService } from './providers/date-form-control.service';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { LocaleHelperService } from './providers/locale-helper.service';
import { NO_OF_DAYS_IN_A_WEEK } from './utils/constants';
import { ClrPopoverToggleService } from '../../popover/common/providers/popover-toggle.service';
import { Keys } from '../../utils/enums/keys.enum';
import { normalizeKey } from '../../utils/focus/key-focus/util';

@Component({
  selector: 'clr-calendar',
  templateUrl: './calendar.html',
  standalone: false,
})
export class ClrCalendar implements OnDestroy {
  /**
   * Calendar View Model to generate the Calendar.
   */
  calendarViewModel: CalendarViewModel;

  private _subs: Subscription[] = [];

  constructor(
    private _localeHelperService: LocaleHelperService,
    private _dateNavigationService: DateNavigationService,
    private _datepickerFocusService: DatepickerFocusService,
    private _dateIOService: DateIOService,
    private _elRef: ElementRef<HTMLElement>,
    private _dateFormControlService: DateFormControlService,
    private _toggleService: ClrPopoverToggleService
  ) {
    this.generateCalendarView();
    this.initializeSubscriptions();
  }

  /**
   * Gets the locale days according to the TranslationWidth.Narrow format.
   */
  get localeDays(): ReadonlyArray<ClrDayOfWeek> {
    return this._localeHelperService.localeDays;
  }

  get calendar(): CalendarModel {
    return this._dateNavigationService.displayedCalendar;
  }

  get selectedDay(): DayModel {
    return this._dateNavigationService.selectedDay;
  }

  get selectedEndDay(): DayModel {
    return this._dateNavigationService.selectedEndDay;
  }

  get focusedDay(): DayModel {
    return this._dateNavigationService.focusedDay;
  }

  get today(): DayModel {
    return this._dateNavigationService.today;
  }

  /**
   * Focuses on the focusable day when the Calendar View is initialized.
   */
  ngAfterViewInit() {
    this._datepickerFocusService.focusCell(this._elRef);
  }

  /**
   * Unsubscribe from subscriptions.
   */
  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  /**
   * Delegates Keyboard arrow navigation to the DateNavigationService.
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event && this.focusedDay) {
      switch (normalizeKey(event.key)) {
        case Keys.ArrowUp:
          event.preventDefault();
          this._dateNavigationService.incrementFocusDay(-1 * NO_OF_DAYS_IN_A_WEEK);
          break;
        case Keys.ArrowDown:
          event.preventDefault();
          this._dateNavigationService.incrementFocusDay(NO_OF_DAYS_IN_A_WEEK);
          break;
        case Keys.ArrowLeft:
          event.preventDefault();
          this._dateNavigationService.incrementFocusDay(-1);
          break;
        case Keys.ArrowRight:
          event.preventDefault();
          this._dateNavigationService.incrementFocusDay(1);
          break;
        default:
          break; // No default case. ESLint x-(
      }
    }
  }

  setSelectedDay(day: DayModel) {
    const hasActionButtons = this._dateNavigationService.hasActionButtons;
    const selectedDates: DayModel | DateRangeInput = this.updateCalendarViewModal(day);
    this._dateNavigationService.notifySelectedDayChanged(selectedDates, { emitEvent: !hasActionButtons });
    if (!hasActionButtons) {
      this._dateFormControlService.markAsDirty();
      this.validateAndCloseDatePicker();
    }
  }

  /**
   * Initialize subscriptions to:
   * 1. update the calendar view model.
   * 2. update the focusable day in the calendar view model.
   * 3. focus on the focusable day in the calendar.
   */
  private initializeSubscriptions(): void {
    this._subs.push(
      this._dateNavigationService.displayedCalendarChange.subscribe(() => {
        this.generateCalendarView();
      })
    );

    this._subs.push(
      this._dateNavigationService.focusedDayChange.subscribe((focusedDay: DayModel) => {
        this.calendarViewModel.updateFocusableDay(focusedDay);
      })
    );

    this._subs.push(
      this._dateNavigationService.focusOnCalendarChange.subscribe(() => {
        this._datepickerFocusService.focusCell(this._elRef);
      })
    );

    this._subs.push(
      this._dateNavigationService.refreshCalendarView.subscribe(() => {
        this.refreshCalendarViewModal();
      })
    );
  }

  private validateAndCloseDatePicker() {
    if (
      (this._dateNavigationService.isRangePicker &&
        this._dateNavigationService.selectedDay &&
        this._dateNavigationService.selectedEndDay) ||
      (!this._dateNavigationService.isRangePicker && this._dateNavigationService.selectedDay)
    ) {
      this._toggleService.open = false;
    }
  }

  private updateCalendarViewModal(day: DayModel): DayModel | DateRangeInput {
    const startDate = this.calendarViewModel.selectedDay || null,
      isRangePicker = this._dateNavigationService.isRangePicker;
    let endDate = this.calendarViewModel.selectedEndDay || null;

    if (isRangePicker) {
      if (!startDate || (!!startDate && !!endDate) || (!!startDate && day?.isBefore(startDate))) {
        this.calendarViewModel.updateSelectedDay(day);
        if (endDate) {
          endDate = undefined;
          this.calendarViewModel.updateSelectedEndDay(endDate);
        }
      } else {
        this.calendarViewModel.updateSelectedEndDay(day);
      }
    } else {
      this.calendarViewModel.updateSelectedDay(day);
    }

    return isRangePicker
      ? { startDate: this.calendarViewModel.selectedDay, endDate: this.calendarViewModel.selectedEndDay }
      : this.calendarViewModel.selectedDay;
  }

  private refreshCalendarViewModal() {
    this.calendarViewModel.updateSelectedDay(this._dateNavigationService.selectedDay);
    if (this._dateNavigationService.isRangePicker) {
      this.calendarViewModel.updateSelectedEndDay(this._dateNavigationService.selectedEndDay);
    }
  }

  /**
   * Generates the Calendar View based on the calendar retrieved from the DateNavigationService.
   */
  private generateCalendarView(): void {
    this.calendarViewModel = new CalendarViewModel(
      this.calendar,
      this.selectedDay,
      this.selectedEndDay,
      this.focusedDay,
      this.today,
      this._localeHelperService.firstDayOfWeek,
      this._dateIOService.disabledDates
    );
  }
}
