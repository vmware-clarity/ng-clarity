/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  interimSelectedDay: DayModel;
  interimSelectedEndDay: DayModel;
  focusedDay: DayModel;
  hoveredDay: DayModel;
  hoveredMonth: number;
  hoveredYear: number;
  isRangePicker = false;
  hasActionButtons = false;

  private _selectedDay: DayModel;
  private _selectedEndDay: DayModel;
  private _displayedCalendar: CalendarModel;
  private _todaysFullDate: Date = new Date();
  private _today: DayModel;
  private _selectedDayChange = new Subject<DayModel>();
  private _selectedEndDayChange = new Subject<DayModel>();
  private _interimSelectedDayChange = new Subject<DayModel>();
  private _interimSelectedEndDayChange = new Subject<DayModel>();
  private _displayedCalendarChange = new Subject<void>();
  private _focusOnCalendarChange = new Subject<void>();
  private _focusedDayChange = new Subject<DayModel>();

  get selectedDay(): DayModel {
    return this.hasActionButtons ? this.interimSelectedDay : this._selectedDay;
  }

  set selectedDay(selectedDay: DayModel) {
    this._selectedDay = selectedDay;
  }

  get selectedEndDay(): DayModel {
    return this.hasActionButtons ? this.interimSelectedEndDay : this._selectedEndDay;
  }

  set selectedEndDay(selectedDay: DayModel) {
    this._selectedEndDay = selectedDay;
  }

  get today(): DayModel {
    return this._today;
  }

  get displayedCalendar(): CalendarModel {
    return this._displayedCalendar;
  }

  get selectedDayChange(): Observable<DayModel> {
    return this._selectedDayChange.asObservable();
  }

  get selectedEndDayChange(): Observable<DayModel> {
    return this._selectedEndDayChange.asObservable();
  }

  get interimSelectedDayChange(): Observable<DayModel> {
    return this._interimSelectedDayChange.asObservable();
  }

  get interimSelectedEndDayChange(): Observable<DayModel> {
    return this._interimSelectedEndDayChange.asObservable();
  }

  /**
   * This observable lets the subscriber know that the displayed calendar has changed.
   */
  get displayedCalendarChange(): Observable<void> {
    return this._displayedCalendarChange.asObservable();
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
   * Notifies that the selected day has changed so that the date can be emitted to the user.
   * Note: Only to be called from day.ts
   */
  notifySelectedDayChanged(dayModel: DayModel, emitEvent: boolean) {
    const startDay = emitEvent ? this.selectedDay : this.interimSelectedDay;
    const endDay = emitEvent ? this.selectedEndDay : this.interimSelectedEndDay;
    this.compareAndSelectDate(dayModel, startDay, endDay, emitEvent);
  }

  /**
   * Initializes the calendar based on the selected day.
   */
  initializeCalendar(): void {
    this.focusedDay = null; // Can be removed later on the store focus
    this.initializeTodaysDate();
    if (this.selectedDay) {
      this._displayedCalendar = new CalendarModel(this.selectedDay.year, this.selectedDay.month);
    } else {
      this._displayedCalendar = new CalendarModel(this.today.year, this.today.month);
    }
  }

  changeMonth(month: number): void {
    this.setDisplayedCalendar(new CalendarModel(this._displayedCalendar.year, month));
  }

  changeYear(year: number): void {
    this.setDisplayedCalendar(new CalendarModel(year, this._displayedCalendar.month));
  }

  /**
   * Moves the displayed calendar to the next month.
   */
  moveToNextMonth(): void {
    this.setDisplayedCalendar(this._displayedCalendar.nextMonth());
  }

  /**
   * Moves the displayed calendar to the previous month.
   */
  moveToPreviousMonth(): void {
    this.setDisplayedCalendar(this._displayedCalendar.previousMonth());
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

  /**
   * Moves the displayed calendar to the next year.
   */
  moveToNextYear(): void {
    this.setDisplayedCalendar(this._displayedCalendar.nextYear());
  }

  /**
   * Moves the displayed calendar to the previous year.
   */
  moveToPreviousYear(): void {
    this.setDisplayedCalendar(this._displayedCalendar.previousYear());
  }

  incrementFocusDay(value: number): void {
    this.hoveredDay = this.focusedDay = this.focusedDay.incrementBy(value);
    if (this._displayedCalendar.isDayInCalendar(this.focusedDay)) {
      this._focusedDayChange.next(this.focusedDay);
    } else {
      this.setDisplayedCalendar(new CalendarModel(this.focusedDay.year, this.focusedDay.month));
    }
    this._focusOnCalendarChange.next();
  }

  setSelectedDay(dayModel: DayModel | undefined): void {
    this.selectedDay = dayModel;
    this._selectedDayChange.next(dayModel);
  }

  setSelectedEndDay(dayModel: DayModel | undefined): void {
    this.selectedEndDay = dayModel;
    this._selectedEndDayChange.next(dayModel);
  }

  updateDisplayedCalendarOnDaySelection(day: DayModel | undefined): void {
    if (day && this._displayedCalendar && !this._displayedCalendar.isDayInCalendar(day)) {
      this.setDisplayedCalendar(new CalendarModel(day.year, day.month));
    }
  }

  getSelectedDate() {
    return this._selectedDay;
  }

  getSelectedEndDate() {
    return this._selectedEndDay;
  }

  validateDateRange() {
    if (!this.getSelectedDate() || !this.getSelectedEndDate()) {
      if (this.getSelectedDate()) {
        this.updateSelectedDay({ startDate: undefined, endDate: null }, true);
      }
      if (this.getSelectedEndDate()) {
        this.updateSelectedDay({ startDate: null, endDate: undefined }, true);
      }
    }
  }

  syncInterimDateValues() {
    this.setInterimSelectedDay(this.getSelectedDate());
    this.setInterimSelectedEndDay(this.getSelectedEndDate());
    this.updateDisplayedCalendarOnDaySelection(this.getSelectedDate());
  }

  private setInterimSelectedDay(dayModel: DayModel | undefined): void {
    this.interimSelectedDay = dayModel;
    this._interimSelectedDayChange.next(dayModel);
  }

  private setInterimSelectedEndDay(dayModel: DayModel | undefined): void {
    this.interimSelectedEndDay = dayModel;
    this._interimSelectedEndDayChange.next(dayModel);
  }

  private updateSelectedDay(dayObject: { startDate: DayModel; endDate: DayModel }, emitEvent: boolean): void {
    const { startDate, endDate } = dayObject;
    if (emitEvent) {
      if (startDate && endDate) {
        this.setSelectedDay(startDate);
        this.setSelectedEndDay(endDate);
      } else {
        if (endDate !== null) {
          this.setSelectedEndDay(endDate);
        }
        if (startDate !== null) {
          this.setSelectedDay(startDate);
        }
      }
    } else {
      if (endDate !== null) {
        this.setInterimSelectedEndDay(endDate);
      }
      if (startDate !== null) {
        this.setInterimSelectedDay(startDate);
      }
    }
  }

  private compareAndSelectDate(selectedDay: DayModel, startDay: DayModel, endDay: DayModel, emitEvent: boolean) {
    const dayObject: { startDate: DayModel; endDate: DayModel } = { startDate: null, endDate: null };
    if (this.isRangePicker) {
      if (!startDay || (!!startDay && !!endDay) || (!!startDay && selectedDay?.isBefore(startDay))) {
        if (endDay) {
          this.hoveredDay = this.hoveredMonth = this.hoveredYear = undefined;
          dayObject.endDate = undefined;
        }
        dayObject.startDate = selectedDay;
      } else {
        dayObject.endDate = selectedDay;
      }
    } else {
      dayObject.startDate = selectedDay;
    }
    this.updateDisplayedCalendarOnDaySelection(selectedDay);
    this.updateSelectedDay(dayObject, emitEvent);
  }

  // not a setter because i want this to remain private
  private setDisplayedCalendar(value: CalendarModel) {
    if (!this._displayedCalendar.isEqual(value)) {
      this._displayedCalendar = value;
      this._displayedCalendarChange.next();
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
