/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Component, ElementRef, HostListener } from '@angular/core';

import { Keys } from '../../utils/enums/keys.enum';
import { normalizeKey } from '../../utils/focus/key-focus/util';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { YearRangeModel } from './model/year-range.model';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { DatePickerHelperService } from './providers/datepicker-helper.service';

@Component({
  selector: 'clr-yearpicker',
  template: `
    <div class="year-switchers">
      <button
        class="calendar-btn switcher"
        type="button"
        (click)="previousDecade()"
        [attr.aria-label]="commonStrings.keys.datepickerPreviousDecade"
      >
        <cds-icon shape="angle" direction="left" [attr.title]="commonStrings.keys.datepickerPreviousDecade"></cds-icon>
      </button>
      <button
        class="calendar-btn switcher"
        type="button"
        (click)="currentDecade()"
        [attr.aria-label]="commonStrings.keys.datepickerCurrentDecade"
      >
        <cds-icon shape="event" [attr.title]="commonStrings.keys.datepickerCurrentDecade"></cds-icon>
      </button>
      <button
        class="calendar-btn switcher"
        type="button"
        (click)="nextDecade()"
        [attr.aria-label]="commonStrings.keys.datepickerNextDecade"
      >
        <cds-icon shape="angle" direction="right" [attr.title]="commonStrings.keys.datepickerNextDecade"></cds-icon>
      </button>
    </div>
    <div class="years">
      <button
        *ngFor="let year of yearRangeModel.yearRange"
        type="button"
        class="calendar-btn year"
        [attr.tabindex]="getTabIndex(year)"
        [class.is-selected]="year === calendarYear || year === calendarEndYear"
        [class.is-start-range]="getIsRangeStartYear(year)"
        [class.is-end-range]="getIsRangeEndYear(year)"
        [class.in-range]="isInRange(year)"
        [class.is-today]="year === currentCalendarYear"
        (click)="changeYear(year)"
        (mouseenter)="onHover(year)"
      >
        {{ year }}
      </button>
    </div>
  `,
  host: {
    '[class.yearpicker]': 'true',
    role: 'application',
  },
})
export class ClrYearpicker implements AfterViewInit {
  /**
   * YearRangeModel which is used to build the YearPicker view.
   */
  yearRangeModel: YearRangeModel;

  /**
   * Keeps track of the current focused year.
   */
  private _focusedYear: number;

  constructor(
    private _dateNavigationService: DateNavigationService,
    private datePickerHelperService: DatePickerHelperService,
    private _datepickerFocusService: DatepickerFocusService,
    private _elRef: ElementRef,
    public commonStrings: ClrCommonStringsService
  ) {
    this.yearRangeModel = new YearRangeModel(this.calendarYear);
    this._focusedYear = this.calendarYear;
  }

  /**
   * Gets the year which the user is currently on.
   */
  get calendarYear(): number {
    return this._dateNavigationService.selectedDay?.year
      ? this._dateNavigationService.selectedDay?.year
      : this._dateNavigationService.displayedCalendar.year;
  }

  /**
   * Gets the year which the user is currently on.
   */
  get calendarEndYear(): number {
    return this._dateNavigationService.selectedEndDay?.year;
  }

  get currentCalendarYear(): number {
    return new Date().getFullYear();
  }

  getIsRangeStartYear(year: number): boolean {
    return this._dateNavigationService.isRangePicker && year === this._dateNavigationService.selectedDay?.year;
  }

  getIsRangeEndYear(year: number): boolean {
    return this._dateNavigationService.isRangePicker && year === this._dateNavigationService.selectedEndDay?.year;
  }

  /**
   * Focuses on the current calendar year when the View is initialized.
   */
  ngAfterViewInit() {
    this._datepickerFocusService.focusCell(this._elRef);
  }

  /**
   * Handles the Keyboard arrow navigation for the yearpicker.
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // NOTE: Didn't move this to the date navigation service because
    // the logic is fairly simple and it didn't make sense for me
    // to create extra observables just to move this logic to the service.
    if (event) {
      const key = normalizeKey(event.key);
      if (key === Keys.ArrowUp) {
        event.preventDefault();
        this.incrementFocusYearBy(-2);
      } else if (key === Keys.ArrowDown) {
        event.preventDefault();
        this.incrementFocusYearBy(2);
      } else if (key === Keys.ArrowRight) {
        event.preventDefault();
        this.incrementFocusYearBy(1);
      } else if (key === Keys.ArrowLeft) {
        event.preventDefault();
        this.incrementFocusYearBy(-1);
      }
    }
  }

  /**
   * Calls the DateNavigationService to update the year value of the calendar.
   * Also changes the view to the monthPicker if month view is allowed.
   */
  changeYear(year: number): void {
    this.datePickerHelperService.selectYear(year);
  }

  /**
   * Calls the DateNavigationService to update the hovered year value of the calendar
   */
  onHover(year: number): void {
    this._dateNavigationService.hoveredYear = year;
  }

  /**
   * Updates the YearRangeModel to the previous decade.
   */
  previousDecade(): void {
    this.yearRangeModel = this.yearRangeModel.previousDecade();
    // Year in the yearpicker is not focused because while navigating to a different decade,
    // you want the focus to remain on the decade switcher arrows.
  }

  /**
   * Updates the YearRangeModel to the current decade.
   */
  currentDecade(): void {
    if (!this.yearRangeModel.inRange(this._dateNavigationService.today.year)) {
      this.yearRangeModel = this.yearRangeModel.currentDecade();
    }
    this._datepickerFocusService.focusCell(this._elRef);
  }

  /**
   * Updates the YearRangeModel to the next decade.
   */
  nextDecade(): void {
    this.yearRangeModel = this.yearRangeModel.nextDecade();
    // Year in the yearpicker is not focused because while navigating to a different decade,
    // you want the focus to remain on the decade switcher arrows.
  }

  /**
   * Compares the year passed to the focused year and returns the tab index.
   */
  getTabIndex(year: number): number {
    if (!this.yearRangeModel.inRange(this._focusedYear)) {
      if (this.yearRangeModel.inRange(this.calendarYear)) {
        this._focusedYear = this.calendarYear;
      } else if (this.yearRangeModel.inRange(this.calendarEndYear)) {
        this._focusedYear = this.calendarEndYear;
      } else {
        this._focusedYear = this.yearRangeModel.middleYear;
      }
    }
    return this._focusedYear === year ? 0 : -1;
  }

  /**
   * Applicable only to date range picker
   * Compares the year passed is in between the start and end date range
   */
  isInRange(year: number): boolean {
    if (!this._dateNavigationService.isRangePicker) {
      return false;
    }
    if (this._dateNavigationService.selectedDay?.year && this.calendarEndYear) {
      return year > this.calendarYear && year < this.calendarEndYear;
    } else if (this._dateNavigationService.selectedDay?.year && !this.calendarEndYear) {
      return year > this.calendarYear && year < this._dateNavigationService.hoveredYear;
    } else {
      return false;
    }
  }
  /**
   * Increments the focus year by the value passed. Updates the YearRangeModel if the
   * new value is not in the current decade.
   */
  private incrementFocusYearBy(value: number): void {
    this._focusedYear = this._focusedYear + value;
    if (!this.yearRangeModel.inRange(this._focusedYear)) {
      if (value > 0) {
        this.yearRangeModel = this.yearRangeModel.nextDecade();
      } else {
        this.yearRangeModel = this.yearRangeModel.previousDecade();
      }
    }
    this._datepickerFocusService.focusCell(this._elRef);
  }
}
