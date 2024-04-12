/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener } from '@angular/core';

import { ClrCommonStringsService } from '../../utils';
import { Keys } from '../../utils/enums/keys.enum';
import { normalizeKey } from '../../utils/focus/key-focus/util';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { DatePickerHelperService } from './providers/datepicker-helper.service';
import { LocaleHelperService } from './providers/locale-helper.service';
import { ViewManagerService } from './providers/view-manager.service';

@Component({
  selector: 'clr-monthpicker',
  template: `
    <div class="year-view-switcher in-monthpicker">
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
    <div class="months">
      <button
        type="button"
        class="calendar-btn month"
        *ngFor="let month of monthNames; let monthIndex = index"
        (click)="changeMonth(monthIndex)"
        [class.is-selected]="isSelected(monthIndex)"
        [class.is-start-range]="
          _dateNavigationService.isRangePicker &&
          calendarYear === _dateNavigationService.selectedDay?.year &&
          monthIndex === _dateNavigationService.selectedDay?.month
        "
        [class.is-end-range]="
          _dateNavigationService.isRangePicker &&
          calendarYear === _dateNavigationService.selectedEndDay?.year &&
          monthIndex === _dateNavigationService.selectedEndDay?.month
        "
        [class.in-range]="isInRange(monthIndex)"
        [attr.tabindex]="getTabIndex(monthIndex)"
        (mouseenter)="onHover(monthIndex)"
      >
        {{ month }}
      </button>
    </div>
  `,
  host: {
    '[class.monthpicker]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrMonthpicker implements AfterViewInit {
  /**
   * Keeps track of the current focused month.
   */
  private _focusedMonthIndex: number;

  constructor(
    private _localeHelperService: LocaleHelperService,
    public _dateNavigationService: DateNavigationService,
    private _datePickerHelperService: DatePickerHelperService,
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

  /**
   * Calls the ViewManagerService to change to the yearpicker view.
   */
  changeToYearView(): void {
    this._viewManagerService.changeToYearView();
  }

  // @HostListener('mouseenter')
  // hoverListener() {
  //   this._dateNavigationService.hoveredMonth = this.dayView.dayModel;
  // }

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
      if (key === Keys.ArrowUp && this._focusedMonthIndex > 0) {
        event.preventDefault();
        this._focusedMonthIndex--;
        this._datepickerFocusService.focusCell(this._elRef);
      } else if (key === Keys.ArrowDown && this._focusedMonthIndex < 11) {
        event.preventDefault();
        this._focusedMonthIndex++;
        this._datepickerFocusService.focusCell(this._elRef);
      } else if (key === Keys.ArrowRight && this._focusedMonthIndex < 6) {
        event.preventDefault();
        this._focusedMonthIndex = this._focusedMonthIndex + 6;
        this._datepickerFocusService.focusCell(this._elRef);
      } else if (key === Keys.ArrowLeft && this._focusedMonthIndex > 5) {
        event.preventDefault();
        this._focusedMonthIndex = this._focusedMonthIndex - 6;
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

  onHover(monthIndex: number) {
    this._dateNavigationService.hoveredMonth = monthIndex;
  }
  /**
   * Calls the DateNavigationService to update the month value of the calendar.
   * Also changes the view to the daypicker.
   */
  changeMonth(monthIndex: number) {
    this._datePickerHelperService.selectMonth(monthIndex);
  }

  /**
   * Compares the month passed to the focused month and returns the tab index.
   */
  getTabIndex(monthIndex: number): number {
    return monthIndex === this._focusedMonthIndex || monthIndex === this.calendarEndMonthIndex ? 0 : -1;
  }

  isInRange(monthIndex: number) {
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

        // (this.calendarYear > this._dateNavigationService.selectedDay.year &&
        //   this.calendarYear < this._dateNavigationService.selectedEndDay.year) ||
        // (monthIndex > this._dateNavigationService.selectedDay.month &&
        //   monthIndex < this._dateNavigationService.selectedEndDay.month)
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

  // isInRange() {
  //   if (!this._dateNavigationService.isRangePicker) {
  //     return false;
  //   }
  //   if (this._dateNavigationService.selectedDay && this._dateNavigationService.selectedEndDay) {
  //     // return this._dayView.dayModel.toDate()?.getTime() > this._dateNavigationService.selectedDay?.toDate()?.getTime() && this._dayView.dayModel.toDate()?.getTime() < this._dateNavigationService.selectedEndDay?.toDate()?.getTime();
  //     const dayModel = this._datePickerHelperService.convertStringDateToDayModel(this._dateNavigationService.displayedCalendar.year, );
  //     return (
  //       this._dayView.dayModel.isAfter(this._dateNavigationService.selectedDay) &&
  //       this._dayView.dayModel.isBefore(this._dateNavigationService.selectedEndDay)
  //     );
  //   } else if (this._dateNavigationService.selectedDay && !this._dateNavigationService.selectedEndDay) {
  //     // return this._dayView.dayModel.toDate()?.getTime() > this._dateNavigationService.selectedDay?.toDate()?.getTime() && this._dayView.dayModel.toDate()?.getTime() < this._dateNavigationService.hoveredDay?.toDate()?.getTime();
  //     return (
  //       this._dayView.dayModel.isAfter(this._dateNavigationService.selectedDay) &&
  //       this._dayView.dayModel.isBefore(this._dateNavigationService.hoveredDay)
  //     );
  //   } else {
  //     return false;
  //   }
  // }
}
