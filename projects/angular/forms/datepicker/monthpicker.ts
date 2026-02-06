/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Component, ElementRef, HostListener } from '@angular/core';

import { ClrCommonStringsService } from '../../utils';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { LocaleHelperService } from './providers/locale-helper.service';
import { ViewManagerService } from './providers/view-manager.service';
import { Keys } from '../../utils/enums/keys.enum';
import { normalizeKey } from '../../utils/focus/key-focus/util';
@Component({
  selector: 'clr-monthpicker',
  template: `
    <div class="calendar-header in-monthpicker">
      <div class="year-view-switcher">
        <button
          class="calendar-btn yearpicker-trigger"
          type="button"
          (click)="changeToYearView()"
          [attr.aria-label]="yearAttrString"
          [attr.title]="yearAttrString"
        >
          {{ calendarYear }}
        </button>
      </div>
      <div class="calendar-switchers">
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="previousYear()"
          [attr.aria-label]="commonStrings.keys.datepickerPreviousMonth"
        >
          <cds-icon shape="angle" direction="left" [attr.title]="commonStrings.keys.datepickerPreviousMonth"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="currentYear()"
          [attr.aria-label]="commonStrings.keys.datepickerCurrentMonth"
        >
          <cds-icon shape="event" [attr.title]="commonStrings.keys.datepickerCurrentMonth"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="nextYear()"
          [attr.aria-label]="commonStrings.keys.datepickerNextMonth"
        >
          <cds-icon shape="angle" direction="right" [attr.title]="commonStrings.keys.datepickerNextMonth"></cds-icon>
        </button>
      </div>
    </div>
    <div class="months">
      @for (month of monthNames; track month; let monthIndex = $index) {
        <button
          type="button"
          class="calendar-btn month"
          (click)="changeMonth(monthIndex)"
          [class.is-selected]="isSelected(monthIndex)"
          [class.is-start-range]="getIsRangeStartMonth(monthIndex)"
          [class.is-end-range]="getIsRangeEndMonth(monthIndex)"
          [class.in-range]="isInRange(monthIndex)"
          [attr.tabindex]="getTabIndex(monthIndex)"
          [class.is-today]="calendarYear === currentCalendarYear && monthIndex === currentCalendarMonth"
          (mouseenter)="onHover(monthIndex)"
        >
          {{ month }}
        </button>
      }
    </div>
  `,
  host: {
    '[class.monthpicker]': 'true',
    role: 'application',
  },
  standalone: false,
})
export class ClrMonthpicker implements AfterViewInit {
  /**
   * Keeps track of the current focused month.
   */
  private _focusedMonthIndex: number;

  constructor(
    private _localeHelperService: LocaleHelperService,
    private _dateNavigationService: DateNavigationService,
    private _datepickerFocusService: DatepickerFocusService,
    private _elRef: ElementRef,
    private _viewManagerService: ViewManagerService,
    public commonStrings: ClrCommonStringsService
  ) {
    this._focusedMonthIndex = this.calendarMonthIndex;
  }
  /**
   * Gets the months array which is used to rendered the monthpicker view.
   * Months are in the TranslationWidth.Wide format.
   */
  get monthNames(): ReadonlyArray<string> {
    return this._localeHelperService.localeMonthsWide;
  }
  /**
   * Gets the month value of the Calendar.
   */
  get calendarMonthIndex(): number {
    return this._dateNavigationService.displayedCalendar.month;
  }

  /**
   * Gets the year which the user is currently on.
   */
  get calendarEndMonthIndex(): number {
    return this._dateNavigationService.selectedEndDay?.month;
  }

  get yearAttrString(): string {
    return this.commonStrings.parse(this.commonStrings.keys.datepickerSelectYearText, {
      CALENDAR_YEAR: this.calendarYear.toString(),
    });
  }

  /**
   * Returns the year value of the calendar.
   */
  get calendarYear(): number {
    return this._dateNavigationService.displayedCalendar.year;
  }

  get currentCalendarYear(): number {
    return new Date().getFullYear();
  }

  get currentCalendarMonth(): number {
    return new Date().getMonth();
  }

  getIsRangeStartMonth(monthIndex: number): boolean {
    return (
      this._dateNavigationService.isRangePicker &&
      this.calendarYear === this._dateNavigationService.selectedDay?.year &&
      monthIndex === this._dateNavigationService.selectedDay?.month
    );
  }

  getIsRangeEndMonth(monthIndex: number): boolean {
    return (
      this._dateNavigationService.isRangePicker &&
      this.calendarYear === this._dateNavigationService.selectedEndDay?.year &&
      monthIndex === this._dateNavigationService.selectedEndDay?.month
    );
  }

  /**
   * Calls the ViewManagerService to change to the yearpicker view.
   */
  changeToYearView(): void {
    this._viewManagerService.changeToYearView();
  }

  /**
   * Focuses on the current calendar month when the View is initialized.
   */
  ngAfterViewInit() {
    this._datepickerFocusService.focusCell(this._elRef);
  }

  /**
   * Handles the Keyboard arrow navigation for the monthpicker.
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // NOTE: Didn't move this to the date navigation service because
    // the logic is fairly simple and it didn't make sense for me
    // to create extra observables just to move this logic to the service.
    if (event) {
      const key = normalizeKey(event.key);
      if (key === Keys.ArrowUp && this._focusedMonthIndex > 1) {
        event.preventDefault();
        this._focusedMonthIndex -= 2;
        this._datepickerFocusService.focusCell(this._elRef);
      } else if (key === Keys.ArrowDown && this._focusedMonthIndex < 10) {
        event.preventDefault();
        this._focusedMonthIndex += 2;
        this._datepickerFocusService.focusCell(this._elRef);
      } else if (key === Keys.ArrowRight && this._focusedMonthIndex < 11) {
        event.preventDefault();
        this._focusedMonthIndex++;
        this._datepickerFocusService.focusCell(this._elRef);
      } else if (key === Keys.ArrowLeft && this._focusedMonthIndex > 0) {
        event.preventDefault();
        this._focusedMonthIndex--;
        this._datepickerFocusService.focusCell(this._elRef);
      }
    }
  }

  isSelected(monthIndex: number): boolean {
    return (
      (this._dateNavigationService.selectedDay?.year === this.calendarYear &&
        monthIndex === this._dateNavigationService.selectedDay?.month) ||
      (this._dateNavigationService.selectedEndDay?.year === this.calendarYear &&
        monthIndex === this.calendarEndMonthIndex)
    );
  }

  /**
   * Calls the DateNavigationService to update the hovered month value of the calendar
   */
  onHover(monthIndex: number): void {
    this._dateNavigationService.hoveredMonth = monthIndex;
  }

  /**
   * Calls the DateNavigationService to update the month value of the calendar.
   * Also changes the view to the daypicker.
   */
  changeMonth(monthIndex: number) {
    this._dateNavigationService.changeMonth(monthIndex);
    this._viewManagerService.changeToDayView();
  }

  /**
   * Compares the month passed to the focused month and returns the tab index.
   */
  getTabIndex(monthIndex: number): number {
    return monthIndex === this._focusedMonthIndex ? 0 : -1;
  }

  /**
   * Calls the DateNavigationService to move to the next month.
   */
  nextYear(): void {
    this._dateNavigationService.moveToNextYear();
  }

  /**
   * Calls the DateNavigationService to move to the previous month.
   */
  previousYear(): void {
    this._dateNavigationService.moveToPreviousYear();
  }

  /**
   * Calls the DateNavigationService to move to the current month.
   */
  currentYear(): void {
    this._dateNavigationService.moveToCurrentMonth();
  }

  /**
   * Applicable only to date range picker
   * Compares the month passed is in between the start and end date range
   */
  isInRange(monthIndex: number): boolean {
    if (!this._dateNavigationService.isRangePicker) {
      return false;
    }
    if (this._dateNavigationService.selectedDay && this._dateNavigationService.selectedEndDay) {
      return (
        (this.calendarYear === this._dateNavigationService.selectedDay.year &&
          monthIndex > this._dateNavigationService.selectedDay.month &&
          this.calendarYear === this._dateNavigationService.selectedEndDay.year &&
          monthIndex < this._dateNavigationService.selectedEndDay.month) ||
        (this._dateNavigationService.selectedDay.year !== this._dateNavigationService.selectedEndDay.year &&
          this.calendarYear === this._dateNavigationService.selectedDay.year &&
          monthIndex > this._dateNavigationService.selectedDay.month) ||
        (this._dateNavigationService.selectedDay.year !== this._dateNavigationService.selectedEndDay.year &&
          this.calendarYear === this._dateNavigationService.selectedEndDay.year &&
          monthIndex < this._dateNavigationService.selectedEndDay.month) ||
        (this.calendarYear > this._dateNavigationService.selectedDay.year &&
          this.calendarYear < this._dateNavigationService.selectedEndDay.year)
      );
    } else if (this._dateNavigationService.selectedDay && !this._dateNavigationService.selectedEndDay) {
      return (
        (this.calendarYear === this._dateNavigationService.selectedDay.year &&
          monthIndex > this._dateNavigationService.selectedDay.month &&
          monthIndex < this._dateNavigationService.hoveredMonth) ||
        (this.calendarYear > this._dateNavigationService.selectedDay.year &&
          monthIndex < this._dateNavigationService.hoveredMonth)
      );
    } else {
      return false;
    }
  }
}
