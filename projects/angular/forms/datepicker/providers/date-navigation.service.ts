/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, signal } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

import { DateRangeInput } from '../interfaces/date-range.interface';
import { CalendarModel } from '../model/calendar.model';
import { DayModel } from '../model/day.model';

/**
 * This service is responsible for:
 * 1. Initializing the displayed calendar.
 * 2. Moving the calendar to the next, previous or current months
 * 3. Managing the focused and selected day models.
 */
@Injectable()
export class DateNavigationService {
  persistedDate: DayModel | null | undefined;
  persistedEndDate: DayModel | null | undefined;
  focusedDay: DayModel | null | undefined;

  // State that the calendar views render. Signals, so that every view reading it refreshes when it changes.
  private readonly _selectedDay = signal<DayModel | null | undefined>(undefined);
  private readonly _selectedEndDay = signal<DayModel | null | undefined>(undefined);
  private readonly _hoveredDay = signal<DayModel | undefined>(undefined);
  private readonly _hoveredMonth = signal<number | undefined>(undefined);
  private readonly _hoveredYear = signal<number | undefined>(undefined);
  private readonly _isRangePicker = signal(false);
  private readonly _hasActionButtons = signal(false);
  private readonly _displayedCalendar = signal<CalendarModel>(undefined);
  private _todaysFullDate: Date = new Date();
  private _today!: DayModel;
  private _selectedDayChange = new Subject<DayModel | null | undefined>();
  private _selectedEndDayChange = new Subject<DayModel | null | undefined>();
  private _focusOnCalendarChange = new Subject<void>();
  private _refreshCalendarView = new Subject<void>();
  private _focusedDayChange = new Subject<DayModel>();

  get today(): DayModel {
    return this._today;
  }

  get displayedCalendar(): CalendarModel {
    return this._displayedCalendar();
  }

  get selectedDay(): DayModel | null | undefined {
    return this._selectedDay();
  }
  set selectedDay(day: DayModel | null | undefined) {
    this._selectedDay.set(day);
  }

  get selectedEndDay(): DayModel | null | undefined {
    return this._selectedEndDay();
  }
  set selectedEndDay(day: DayModel | null | undefined) {
    this._selectedEndDay.set(day);
  }

  get hoveredDay(): DayModel | undefined {
    return this._hoveredDay();
  }
  set hoveredDay(day: DayModel | undefined) {
    this._hoveredDay.set(day);
  }

  get hoveredMonth(): number | undefined {
    return this._hoveredMonth();
  }
  set hoveredMonth(month: number | undefined) {
    this._hoveredMonth.set(month);
  }

  get hoveredYear(): number | undefined {
    return this._hoveredYear();
  }
  set hoveredYear(year: number | undefined) {
    this._hoveredYear.set(year);
  }

  get isRangePicker(): boolean {
    return this._isRangePicker();
  }
  set isRangePicker(value: boolean) {
    this._isRangePicker.set(value);
  }

  get hasActionButtons(): boolean {
    return this._hasActionButtons();
  }
  set hasActionButtons(value: boolean) {
    this._hasActionButtons.set(value);
  }

  get selectedDayChange(): Observable<DayModel | null | undefined> {
    return this._selectedDayChange.asObservable();
  }

  get selectedEndDayChange(): Observable<DayModel | null | undefined> {
    return this._selectedEndDayChange.asObservable();
  }

  /**
   * This observable lets the subscriber know that the focus should be applied on the calendar.
   */
  get focusOnCalendarChange(): Observable<void> {
    return this._focusOnCalendarChange.asObservable();
  }

  /**
   * This observable lets the subscriber know that the focused day in the displayed calendar has changed.
   */
  get focusedDayChange(): Observable<DayModel> {
    return this._focusedDayChange.asObservable().pipe(tap((day: DayModel) => (this.focusedDay = day)));
  }

  /**
   * This observable lets the subscriber know that the displayed calendar has changed.
   */
  get refreshCalendarView(): Observable<void> {
    return this._refreshCalendarView.asObservable();
  }

  /**
   * Notifies that the selected day has changed so that the date can be emitted to the user.
   */
  notifySelectedDayChanged(
    dayObject: DayModel | DateRangeInput | null | undefined,
    { emitEvent } = { emitEvent: true }
  ): void {
    if (this.isRangePicker) {
      const { startDate, endDate } = dayObject as DateRangeInput;
      if (startDate && endDate) {
        this.setSelectedDay(startDate, emitEvent);
        this.setSelectedEndDay(endDate, emitEvent);
      } else {
        if (endDate !== null) {
          this.setSelectedEndDay(endDate, emitEvent);
        }
        if (startDate !== null) {
          this.setSelectedDay(startDate, emitEvent);
        }
      }
    } else {
      const day = dayObject as DayModel | null | undefined;
      this.setSelectedDay(day, emitEvent);
    }
    this._refreshCalendarView.next();
  }

  /**
   * Initializes the calendar based on the selected day.
   */
  initializeCalendar(): void {
    this.focusedDay = null; // Can be removed later on the store focus
    this.initializeTodaysDate();
    const day = this.selectedDay || this.today;
    this._displayedCalendar.set(new CalendarModel(day.year, day.month));
  }

  changeMonth(month: number): void {
    this.setDisplayedCalendar(new CalendarModel(this.displayedCalendar.year, month));
  }

  changeYear(year: number): void {
    this.setDisplayedCalendar(new CalendarModel(year, this.displayedCalendar.month));
  }

  /**
   * Moves the displayed calendar to the next month.
   */
  moveToNextMonth(): void {
    this.setDisplayedCalendar(this.displayedCalendar.nextMonth());
  }

  /**
   * Moves the displayed calendar to the previous month.
   */
  moveToPreviousMonth(): void {
    this.setDisplayedCalendar(this.displayedCalendar.previousMonth());
  }

  /**
   * Moves the displayed calendar to the next year.
   */
  moveToNextYear(): void {
    this.setDisplayedCalendar(this.displayedCalendar.nextYear());
  }

  /**
   * Moves the displayed calendar to the previous year.
   */
  moveToPreviousYear(): void {
    this.setDisplayedCalendar(this.displayedCalendar.previousYear());
  }

  /**
   * Moves the displayed calendar to the current month and year.
   */
  moveToCurrentMonth(): void {
    if (!this.displayedCalendar.isDayInCalendar(this.today)) {
      this.setDisplayedCalendar(new CalendarModel(this.today.year, this.today.month));
    }
    this._focusOnCalendarChange.next();
  }

  moveToSpecificMonth(day: DayModel) {
    if (!this.displayedCalendar.isDayInCalendar(day)) {
      this.setDisplayedCalendar(new CalendarModel(day.year, day.month));
    }
  }

  incrementFocusDay(value: number): void {
    if (!this.focusedDay) {
      return;
    }

    this.hoveredDay = this.focusedDay = this.focusedDay.incrementBy(value);
    if (this.displayedCalendar.isDayInCalendar(this.focusedDay)) {
      this._focusedDayChange.next(this.focusedDay);
    } else {
      this.setDisplayedCalendar(new CalendarModel(this.focusedDay.year, this.focusedDay.month));
    }
    this._focusOnCalendarChange.next();
  }

  resetSelectedDay() {
    this.selectedDay = this.persistedDate;
    this.selectedEndDay = this.persistedEndDate;
  }

  convertDateToDayModel(date: Date): DayModel {
    return new DayModel(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private setSelectedDay(dayModel: DayModel | null | undefined, emitEvent: boolean): void {
    this.selectedDay = dayModel;
    if (emitEvent) {
      this._selectedDayChange.next(dayModel);
    }
  }

  private setSelectedEndDay(dayModel: DayModel | null | undefined, emitEvent: boolean): void {
    this.selectedEndDay = dayModel;
    if (emitEvent) {
      this._selectedEndDayChange.next(dayModel);
    }
  }

  // not a setter because i want this to remain private
  private setDisplayedCalendar(value: CalendarModel) {
    if (!this.displayedCalendar.isEqual(value)) {
      this._displayedCalendar.set(value);
    }
  }

  private initializeTodaysDate(): void {
    this._todaysFullDate = new Date();
    this._today = new DayModel(
      this._todaysFullDate.getFullYear(),
      this._todaysFullDate.getMonth(),
      this._todaysFullDate.getDate()
    );
  }
}
