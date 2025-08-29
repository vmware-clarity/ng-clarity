/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
import { ViewManagerService } from './providers/view-manager.service';

@Component({
  selector: 'clr-yearpicker',
  template: `
    <div class="calendar-header">
      <div class="calendar-pickers">
        <button class="calendar-btn yearpicker-trigger year-range" type="button" (click)="changeToDayView()">
          {{ yearRangeModel.yearRange[0] }} - {{ yearRangeModel.yearRange[yearRangeModel.yearRange.length - 1] }}
        </button>
      </div>
      <div class="year-switchers">
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="previousDecade()"
          [attr.aria-label]="commonStrings.keys.datepickerPreviousDecade"
        >
          <cds-icon
            shape="angle"
            direction="left"
            [attr.title]="commonStrings.keys.datepickerPreviousDecade"
          ></cds-icon>
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
    </div>

    <div class="years">
      @for (year of yearRangeModel.yearRange; track year) {
      <button
        type="button"
        class="calendar-btn year"
        [attr.tabindex]="getTabIndex(year)"
        [class.is-selected]="year === selectedStartYear || year === selectedEndYear"
        [class.is-start-range]="getIsRangeStartYear(year)"
        [class.is-end-range]="getIsRangeEndYear(year)"
        [class.in-range]="isInRange(year)"
        [class.is-today]="isCurrentCalendarYear(year)"
        (click)="changeYear(year)"
        (mouseenter)="onHover(year)"
      >
        {{ year }}
      </button>
      }
    </div>
  `,
  host: {
    '[class.yearpicker]': 'true',
    role: 'application',
  },
  standalone: false,
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
    private _viewManagerService: ViewManagerService,
    private _datepickerFocusService: DatepickerFocusService,
    private _elRef: ElementRef<HTMLElement>,
    public commonStrings: ClrCommonStringsService
  ) {
    this.yearRangeModel = new YearRangeModel(this.calendarYear);
    this._focusedYear = this.calendarYear;
  }

  get selectedStartYear(): number {
    return this._dateNavigationService.selectedDay?.year;
  }

  get selectedEndYear(): number {
    return this._dateNavigationService.selectedEndDay?.year;
  }

  /**
   * Gets the year which the user is currently on.
   */
  get calendarYear(): number {
    return this._dateNavigationService.displayedCalendar.year;
  }

  isCurrentCalendarYear(year: number): boolean {
    return year === new Date().getFullYear();
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
   * Also changes the view to the daypicker.
   */
  changeYear(year: number): void {
    this._dateNavigationService.changeYear(year);
    this._viewManagerService.changeToDayView();
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
      } else if (this.yearRangeModel.inRange(this.selectedEndYear)) {
        this._focusedYear = this.selectedEndYear;
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
    if (this._dateNavigationService.selectedDay?.year && this.selectedEndYear) {
      return year > this.selectedStartYear && year < this.selectedEndYear;
    } else if (this._dateNavigationService.selectedDay?.year && !this.selectedEndYear) {
      return year > this.selectedStartYear && year < this._dateNavigationService.hoveredYear;
    } else {
      return false;
    }
  }

  changeToDayView() {
    this._viewManagerService.changeToDayView();
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
