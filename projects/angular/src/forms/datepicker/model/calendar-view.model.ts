/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DateRange } from '../interfaces/date-range.interface';
import { NO_OF_DAYS_IN_A_WEEK, NO_OF_ROWS_IN_CALENDAR_VIEW, TOTAL_DAYS_IN_DAYS_VIEW } from '../utils/constants';
import { getDay } from '../utils/date-utils';
import { CalendarModel } from './calendar.model';
import { DayViewModel } from './day-view.model';
import { DayModel } from './day.model';

export class CalendarViewModel {
  private currMonthDayViews: DayViewModel[] = [];
  private _calendarView: DayViewModel[][];

  constructor(
    public calendar: CalendarModel,
    public selectedDay: DayModel,
    public selectedEndDay: DayModel,
    private focusableDay: DayModel,
    private today: DayModel,
    public firstDayOfWeek: number,
    private excludedDates: DateRange
  ) {
    this.initializeCalendarView();
  }

  /**
   * DayViewModel matrix. Size 6x7
   */
  get calendarView(): DayViewModel[][] {
    return this._calendarView;
  }

  /**
   * Updates the focusable day in the calendar.
   */
  updateFocusableDay(day: DayModel): void {
    this.setFocusableFlag(this.focusableDay, false);
    this.setFocusableFlag(day, true);
    this.focusableDay = day;
  }

  /**
   * Updates the selected day in the calendar
   */
  updateSelectedDay(day: DayModel | undefined): void {
    this.setSelectedDay(this.selectedDay, false);
    this.selectedDay = day;
    this.setSelectedDay(day, true);
  }

  /**
   * Updates the selected end day in the calendar
   */
  updateSelectedEndDay(day: DayModel | undefined): void {
    this.setSelectedDay(this.selectedEndDay, false);
    this.selectedEndDay = day;
    this.setSelectedDay(day, true);
  }

  /**
   * Generates a 6x7 matrix of DayViewModel based on the Calendar.
   * The 6x7 matrix is structured according to the first day of the week.
   * 6 rows to accommodate months which might have dates spanning over 6 weeks.
   * 7 columns because there are 7 days in a week :P :D
   */
  private initializeCalendarView(): void {
    // Generate prev and next month calendar models.
    const prevMonthCalendar: CalendarModel = this.calendar.previousMonth();
    const nextMonthCalendar: CalendarModel = this.calendar.nextMonth();

    // Get no of days from prev and next months.
    const daysFromPrevMonthInCalView: number = this.numDaysFromPrevMonthInCalView(
      this.calendar.year,
      this.calendar.month
    );
    const daysFromNextMonthInCalView: number =
      TOTAL_DAYS_IN_DAYS_VIEW - (this.calendar.days.length + daysFromPrevMonthInCalView);

    // Generate prev, curr and next day view models
    let prevMonthDayViews: DayViewModel[] = [];
    let nextMonthDayViews: DayViewModel[] = [];

    if (daysFromPrevMonthInCalView > 0) {
      prevMonthDayViews = this.generateDayViewModels(
        prevMonthCalendar.days.slice(-1 * daysFromPrevMonthInCalView),
        true,
        false
      );
    }

    this.currMonthDayViews = this.generateDayViewModels(this.calendar.days, false, true);

    if (daysFromNextMonthInCalView > 0) {
      nextMonthDayViews = this.generateDayViewModels(
        nextMonthCalendar.days.slice(0, daysFromNextMonthInCalView),
        true,
        false
      );
    }

    // Generate calendar view and initialize flags
    this._calendarView = this.generateCalendarView(prevMonthDayViews, this.currMonthDayViews, nextMonthDayViews);
    this.initializeSelectedDay();
    this.initializeFocusableDay();
  }

  private isDateExcluded(date: DayModel) {
    const { minDate, maxDate }: DateRange = this.excludedDates;
    const from = minDate.toComparisonString();
    const to = maxDate.toComparisonString();
    const today = date.toComparisonString();

    return !(today >= from && today <= to);
  }

  /**
   * Generates a DayViewModel array based on the DayModel passed
   */
  private generateDayViewModels(days: DayModel[], isExcluded: boolean, isCurrentCalendar: boolean): DayViewModel[] {
    const dayViews: DayViewModel[] = days.map(day => {
      return new DayViewModel(day, false, isExcluded, this.isDateExcluded(day), false, false);
    });
    if (isCurrentCalendar && this.calendar.isDayInCalendar(this.today)) {
      dayViews[this.today.date - 1].isTodaysDate = true;
    }
    return dayViews;
  }

  /**
   * Gets the first day of the current month to figure out how many dates of previous month
   * are needed to complete the Calendar View based on the first day of the week.
   * eg: Assuming locale en-US, the first day of the week is Sunday,
   * if first day of the current month lands on Wednesday, then
   * (this.getDay function would return 3 since
   * first day of the week is 0), we need the 3 days from the previous month.
   */
  private numDaysFromPrevMonthInCalView(currentYear: number, currentMonth: number): number {
    const firstDayOfCurrMonth: number = getDay(currentYear, currentMonth, 1);

    if (firstDayOfCurrMonth >= this.firstDayOfWeek) {
      return firstDayOfCurrMonth - this.firstDayOfWeek;
    } else {
      return NO_OF_DAYS_IN_A_WEEK + firstDayOfCurrMonth - this.firstDayOfWeek;
    }
  }

  /**
   * Checks if the Day passed is in the CalendarView.
   */
  private isDayInCalendarView(day: DayModel): boolean {
    if (!this.calendar.isDayInCalendar(day)) {
      return false;
    }
    return true;
  }

  /**
   * Using the DayViewModels from the previous, current and next month, this function
   * generates the CalendarView.
   */
  private generateCalendarView(prev: DayViewModel[], curr: DayViewModel[], next: DayViewModel[]): DayViewModel[][] {
    const combinationArr: DayViewModel[] = [...prev, ...curr, ...next];

    const calendarView: DayViewModel[][] = [];
    for (let i = 0; i < NO_OF_ROWS_IN_CALENDAR_VIEW; i++) {
      calendarView[i] = combinationArr.slice(i * NO_OF_DAYS_IN_A_WEEK, (i + 1) * NO_OF_DAYS_IN_A_WEEK);
    }
    return calendarView;
  }

  /**
   * Initialize the selected day if the day is in the calendar.
   */
  private initializeSelectedDay(): void {
    this.setSelectedDay(this.selectedDay, true);
    this.setSelectedDay(this.selectedEndDay, true);
  }

  /**
   * Initializes the focusable day if the day is in the calendar. If focusable day is not set, then
   * we check for the selected day. If selected day is not set then check if today is in the current
   * calendar. If not then just set the 15th of the current calendar month.
   */
  private initializeFocusableDay(): void {
    if (this.focusableDay && this.isDayInCalendarView(this.focusableDay)) {
      this.setFocusableFlag(this.focusableDay, true);
    } else if (this.selectedDay && this.isDayInCalendarView(this.selectedDay)) {
      this.setFocusableFlag(this.selectedDay, true);
      this.focusableDay = this.selectedDay.clone();
    } else if (this.selectedEndDay && this.isDayInCalendarView(this.selectedEndDay)) {
      this.setFocusableFlag(this.selectedEndDay, true);
      this.focusableDay = this.selectedEndDay.clone();
    } else if (this.isDayInCalendarView(this.today)) {
      this.setFocusableFlag(this.today, true);
      this.focusableDay = this.today.clone();
    } else {
      this.focusableDay = new DayModel(this.calendar.year, this.calendar.month, 15);
      this.setFocusableFlag(this.focusableDay, true);
    }
  }

  private setFocusableFlag(day: DayModel, flag: boolean): void {
    if (day) {
      this.currMonthDayViews[day.date - 1].isFocusable = flag;
    }
  }

  private setSelectedDay(day: DayModel, flag: boolean) {
    if (day && this.isDayInCalendarView(day)) {
      this.currMonthDayViews[day?.date - 1].isSelected = flag;
    }
  }
}
