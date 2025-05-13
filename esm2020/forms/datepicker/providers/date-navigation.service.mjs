/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Subject } from 'rxjs';
import { CalendarModel } from '../model/calendar.model';
import { DayModel } from '../model/day.model';
import * as i0 from "@angular/core";
/**
 * This service is responsible for:
 * 1. Initializing the displayed calendar.
 * 2. Moving the calendar to the next, previous or current months
 * 3. Managing the focused and selected day models.
 */
export class DateNavigationService {
    constructor() {
        this.isRangePicker = false;
        this.hasActionButtons = false;
        this._todaysFullDate = new Date();
        this._selectedDayChange = new Subject();
        this._selectedEndDayChange = new Subject();
        this._displayedCalendarChange = new Subject();
        this._focusOnCalendarChange = new Subject();
        this._refreshCalendarView = new Subject();
        this._focusedDayChange = new Subject();
    }
    get today() {
        return this._today;
    }
    get displayedCalendar() {
        return this._displayedCalendar;
    }
    get selectedDayChange() {
        return this._selectedDayChange.asObservable();
    }
    get selectedEndDayChange() {
        return this._selectedEndDayChange.asObservable();
    }
    /**
     * This observable lets the subscriber know that the displayed calendar has changed.
     */
    get displayedCalendarChange() {
        return this._displayedCalendarChange.asObservable();
    }
    /**
     * This observable lets the subscriber know that the focus should be applied on the calendar.
     */
    get focusOnCalendarChange() {
        return this._focusOnCalendarChange.asObservable();
    }
    /**
     * This observable lets the subscriber know that the focused day in the displayed calendar has changed.
     */
    get focusedDayChange() {
        return this._focusedDayChange.asObservable().pipe(tap((day) => (this.focusedDay = day)));
    }
    /**
     * This observable lets the subscriber know that the displayed calendar has changed.
     */
    get refreshCalendarView() {
        return this._refreshCalendarView.asObservable();
    }
    /**
     * Notifies that the selected day has changed so that the date can be emitted to the user.
     */
    notifySelectedDayChanged(dayObject, { emitEvent } = { emitEvent: true }) {
        if (this.isRangePicker) {
            const { startDate, endDate } = dayObject;
            if (startDate && endDate) {
                this.setSelectedDay(startDate, emitEvent);
                this.setSelectedEndDay(endDate, emitEvent);
            }
            else {
                if (endDate !== null) {
                    this.setSelectedEndDay(endDate, emitEvent);
                }
                if (startDate !== null) {
                    this.setSelectedDay(startDate, emitEvent);
                }
            }
        }
        else {
            const day = dayObject;
            this.setSelectedDay(day, emitEvent);
        }
        this._refreshCalendarView.next();
    }
    /**
     * Initializes the calendar based on the selected day.
     */
    initializeCalendar() {
        this.focusedDay = null; // Can be removed later on the store focus
        this.initializeTodaysDate();
        if (this.selectedDay) {
            this._displayedCalendar = new CalendarModel(this.selectedDay.year, this.selectedDay.month);
        }
        else {
            this._displayedCalendar = new CalendarModel(this.today.year, this.today.month);
        }
    }
    changeMonth(month) {
        this.setDisplayedCalendar(new CalendarModel(this._displayedCalendar.year, month));
    }
    changeYear(year) {
        this.setDisplayedCalendar(new CalendarModel(year, this._displayedCalendar.month));
    }
    /**
     * Moves the displayed calendar to the next month.
     */
    moveToNextMonth() {
        this.setDisplayedCalendar(this._displayedCalendar.nextMonth());
    }
    /**
     * Moves the displayed calendar to the previous month.
     */
    moveToPreviousMonth() {
        this.setDisplayedCalendar(this._displayedCalendar.previousMonth());
    }
    /**
     * Moves the displayed calendar to the next year.
     */
    moveToNextYear() {
        this.setDisplayedCalendar(this._displayedCalendar.nextYear());
    }
    /**
     * Moves the displayed calendar to the previous year.
     */
    moveToPreviousYear() {
        this.setDisplayedCalendar(this._displayedCalendar.previousYear());
    }
    /**
     * Moves the displayed calendar to the current month and year.
     */
    moveToCurrentMonth() {
        if (!this.displayedCalendar.isDayInCalendar(this.today)) {
            this.setDisplayedCalendar(new CalendarModel(this.today.year, this.today.month));
        }
        this._focusOnCalendarChange.next();
    }
    moveToSpecificMonth(day) {
        if (!this.displayedCalendar.isDayInCalendar(day)) {
            this.setDisplayedCalendar(new CalendarModel(day.year, day.month));
        }
    }
    incrementFocusDay(value) {
        this.hoveredDay = this.focusedDay = this.focusedDay.incrementBy(value);
        if (this._displayedCalendar.isDayInCalendar(this.focusedDay)) {
            this._focusedDayChange.next(this.focusedDay);
        }
        else {
            this.setDisplayedCalendar(new CalendarModel(this.focusedDay.year, this.focusedDay.month));
        }
        this._focusOnCalendarChange.next();
    }
    resetSelectedDay() {
        this.selectedDay = this.persistedDate;
        this.selectedEndDay = this.persistedEndDate;
    }
    convertDateToDayModel(date) {
        return new DayModel(date.getFullYear(), date.getMonth(), date.getDate());
    }
    setSelectedDay(dayModel, emitEvent) {
        this.selectedDay = dayModel;
        if (emitEvent) {
            this._selectedDayChange.next(dayModel);
        }
    }
    setSelectedEndDay(dayModel, emitEvent) {
        this.selectedEndDay = dayModel;
        if (emitEvent) {
            this._selectedEndDayChange.next(dayModel);
        }
    }
    // not a setter because i want this to remain private
    setDisplayedCalendar(value) {
        if (!this._displayedCalendar.isEqual(value)) {
            this._displayedCalendar = value;
            this._displayedCalendarChange.next();
        }
    }
    initializeTodaysDate() {
        this._todaysFullDate = new Date();
        this._today = new DayModel(this._todaysFullDate.getFullYear(), this._todaysFullDate.getMonth(), this._todaysFullDate.getDate());
    }
}
DateNavigationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DateNavigationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
DateNavigationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DateNavigationService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DateNavigationService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1uYXZpZ2F0aW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9kYXRlcGlja2VyL3Byb3ZpZGVycy9kYXRlLW5hdmlnYXRpb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFjLEdBQUcsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN2QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRy9CLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7O0FBRTlDOzs7OztHQUtHO0FBRUgsTUFBTSxPQUFPLHFCQUFxQjtJQURsQztRQVVFLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQUdqQixvQkFBZSxHQUFTLElBQUksSUFBSSxFQUFFLENBQUM7UUFFbkMsdUJBQWtCLEdBQUcsSUFBSSxPQUFPLEVBQVksQ0FBQztRQUM3QywwQkFBcUIsR0FBRyxJQUFJLE9BQU8sRUFBWSxDQUFDO1FBQ2hELDZCQUF3QixHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFDL0MsMkJBQXNCLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUM3Qyx5QkFBb0IsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBQzNDLHNCQUFpQixHQUFHLElBQUksT0FBTyxFQUFZLENBQUM7S0F3THJEO0lBdExDLElBQUksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBRUQsSUFBSSxpQkFBaUI7UUFDbkIsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUM7SUFDakMs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QWlCLENBQUMsUUFBOEIsRUFBRSxTQUFTO1FBQ2pFLElBQUksQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDO1FBQy9CLElBQUksU0FBUyxFQUFFO1lBQ2IsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUMzQztJQUNILENBQUM7SUFFRCxxREFBcUQ7SUFDN0Msb0JBQW9CLENBQUMsS0FBb0I7UUFDL0MsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDM0MsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztZQUNoQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDdEM7SUFDSCxDQUFDO0lBRU8sb0JBQW9CO1FBQzFCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksUUFBUSxDQUN4QixJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxFQUNsQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxFQUMvQixJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxDQUMvQixDQUFDO0lBQ0osQ0FBQzs7a0hBM01VLHFCQUFxQjtzSEFBckIscUJBQXFCOzJGQUFyQixxQkFBcUI7a0JBRGpDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIHRhcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBEYXRlUmFuZ2VJbnB1dCB9IGZyb20gJy4uL2ludGVyZmFjZXMvZGF0ZS1yYW5nZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ2FsZW5kYXJNb2RlbCB9IGZyb20gJy4uL21vZGVsL2NhbGVuZGFyLm1vZGVsJztcbmltcG9ydCB7IERheU1vZGVsIH0gZnJvbSAnLi4vbW9kZWwvZGF5Lm1vZGVsJztcblxuLyoqXG4gKiBUaGlzIHNlcnZpY2UgaXMgcmVzcG9uc2libGUgZm9yOlxuICogMS4gSW5pdGlhbGl6aW5nIHRoZSBkaXNwbGF5ZWQgY2FsZW5kYXIuXG4gKiAyLiBNb3ZpbmcgdGhlIGNhbGVuZGFyIHRvIHRoZSBuZXh0LCBwcmV2aW91cyBvciBjdXJyZW50IG1vbnRoc1xuICogMy4gTWFuYWdpbmcgdGhlIGZvY3VzZWQgYW5kIHNlbGVjdGVkIGRheSBtb2RlbHMuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBEYXRlTmF2aWdhdGlvblNlcnZpY2Uge1xuICBwZXJzaXN0ZWREYXRlOiBEYXlNb2RlbDtcbiAgcGVyc2lzdGVkRW5kRGF0ZTogRGF5TW9kZWw7XG4gIHNlbGVjdGVkRGF5OiBEYXlNb2RlbDtcbiAgc2VsZWN0ZWRFbmREYXk6IERheU1vZGVsO1xuICBmb2N1c2VkRGF5OiBEYXlNb2RlbDtcbiAgaG92ZXJlZERheTogRGF5TW9kZWw7XG4gIGhvdmVyZWRNb250aDogbnVtYmVyO1xuICBob3ZlcmVkWWVhcjogbnVtYmVyO1xuICBpc1JhbmdlUGlja2VyID0gZmFsc2U7XG4gIGhhc0FjdGlvbkJ1dHRvbnMgPSBmYWxzZTtcblxuICBwcml2YXRlIF9kaXNwbGF5ZWRDYWxlbmRhcjogQ2FsZW5kYXJNb2RlbDtcbiAgcHJpdmF0ZSBfdG9kYXlzRnVsbERhdGU6IERhdGUgPSBuZXcgRGF0ZSgpO1xuICBwcml2YXRlIF90b2RheTogRGF5TW9kZWw7XG4gIHByaXZhdGUgX3NlbGVjdGVkRGF5Q2hhbmdlID0gbmV3IFN1YmplY3Q8RGF5TW9kZWw+KCk7XG4gIHByaXZhdGUgX3NlbGVjdGVkRW5kRGF5Q2hhbmdlID0gbmV3IFN1YmplY3Q8RGF5TW9kZWw+KCk7XG4gIHByaXZhdGUgX2Rpc3BsYXllZENhbGVuZGFyQ2hhbmdlID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSBfZm9jdXNPbkNhbGVuZGFyQ2hhbmdlID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSBfcmVmcmVzaENhbGVuZGFyVmlldyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHByaXZhdGUgX2ZvY3VzZWREYXlDaGFuZ2UgPSBuZXcgU3ViamVjdDxEYXlNb2RlbD4oKTtcblxuICBnZXQgdG9kYXkoKTogRGF5TW9kZWwge1xuICAgIHJldHVybiB0aGlzLl90b2RheTtcbiAgfVxuXG4gIGdldCBkaXNwbGF5ZWRDYWxlbmRhcigpOiBDYWxlbmRhck1vZGVsIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzcGxheWVkQ2FsZW5kYXI7XG4gIH1cblxuICBnZXQgc2VsZWN0ZWREYXlDaGFuZ2UoKTogT2JzZXJ2YWJsZTxEYXlNb2RlbD4ge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZERheUNoYW5nZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGdldCBzZWxlY3RlZEVuZERheUNoYW5nZSgpOiBPYnNlcnZhYmxlPERheU1vZGVsPiB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkRW5kRGF5Q2hhbmdlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgb2JzZXJ2YWJsZSBsZXRzIHRoZSBzdWJzY3JpYmVyIGtub3cgdGhhdCB0aGUgZGlzcGxheWVkIGNhbGVuZGFyIGhhcyBjaGFuZ2VkLlxuICAgKi9cbiAgZ2V0IGRpc3BsYXllZENhbGVuZGFyQ2hhbmdlKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNwbGF5ZWRDYWxlbmRhckNoYW5nZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG9ic2VydmFibGUgbGV0cyB0aGUgc3Vic2NyaWJlciBrbm93IHRoYXQgdGhlIGZvY3VzIHNob3VsZCBiZSBhcHBsaWVkIG9uIHRoZSBjYWxlbmRhci5cbiAgICovXG4gIGdldCBmb2N1c09uQ2FsZW5kYXJDaGFuZ2UoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuX2ZvY3VzT25DYWxlbmRhckNoYW5nZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG9ic2VydmFibGUgbGV0cyB0aGUgc3Vic2NyaWJlciBrbm93IHRoYXQgdGhlIGZvY3VzZWQgZGF5IGluIHRoZSBkaXNwbGF5ZWQgY2FsZW5kYXIgaGFzIGNoYW5nZWQuXG4gICAqL1xuICBnZXQgZm9jdXNlZERheUNoYW5nZSgpOiBPYnNlcnZhYmxlPERheU1vZGVsPiB7XG4gICAgcmV0dXJuIHRoaXMuX2ZvY3VzZWREYXlDaGFuZ2UuYXNPYnNlcnZhYmxlKCkucGlwZSh0YXAoKGRheTogRGF5TW9kZWwpID0+ICh0aGlzLmZvY3VzZWREYXkgPSBkYXkpKSk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBvYnNlcnZhYmxlIGxldHMgdGhlIHN1YnNjcmliZXIga25vdyB0aGF0IHRoZSBkaXNwbGF5ZWQgY2FsZW5kYXIgaGFzIGNoYW5nZWQuXG4gICAqL1xuICBnZXQgcmVmcmVzaENhbGVuZGFyVmlldygpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5fcmVmcmVzaENhbGVuZGFyVmlldy5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3RpZmllcyB0aGF0IHRoZSBzZWxlY3RlZCBkYXkgaGFzIGNoYW5nZWQgc28gdGhhdCB0aGUgZGF0ZSBjYW4gYmUgZW1pdHRlZCB0byB0aGUgdXNlci5cbiAgICovXG4gIG5vdGlmeVNlbGVjdGVkRGF5Q2hhbmdlZChkYXlPYmplY3Q6IERheU1vZGVsIHwgRGF0ZVJhbmdlSW5wdXQsIHsgZW1pdEV2ZW50IH0gPSB7IGVtaXRFdmVudDogdHJ1ZSB9KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNSYW5nZVBpY2tlcikge1xuICAgICAgY29uc3QgeyBzdGFydERhdGUsIGVuZERhdGUgfSA9IGRheU9iamVjdCBhcyBEYXRlUmFuZ2VJbnB1dDtcbiAgICAgIGlmIChzdGFydERhdGUgJiYgZW5kRGF0ZSkge1xuICAgICAgICB0aGlzLnNldFNlbGVjdGVkRGF5KHN0YXJ0RGF0ZSwgZW1pdEV2ZW50KTtcbiAgICAgICAgdGhpcy5zZXRTZWxlY3RlZEVuZERheShlbmREYXRlLCBlbWl0RXZlbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGVuZERhdGUgIT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLnNldFNlbGVjdGVkRW5kRGF5KGVuZERhdGUsIGVtaXRFdmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXJ0RGF0ZSAhPT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuc2V0U2VsZWN0ZWREYXkoc3RhcnREYXRlLCBlbWl0RXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGRheSA9IGRheU9iamVjdCBhcyBEYXlNb2RlbDtcbiAgICAgIHRoaXMuc2V0U2VsZWN0ZWREYXkoZGF5LCBlbWl0RXZlbnQpO1xuICAgIH1cbiAgICB0aGlzLl9yZWZyZXNoQ2FsZW5kYXJWaWV3Lm5leHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgY2FsZW5kYXIgYmFzZWQgb24gdGhlIHNlbGVjdGVkIGRheS5cbiAgICovXG4gIGluaXRpYWxpemVDYWxlbmRhcigpOiB2b2lkIHtcbiAgICB0aGlzLmZvY3VzZWREYXkgPSBudWxsOyAvLyBDYW4gYmUgcmVtb3ZlZCBsYXRlciBvbiB0aGUgc3RvcmUgZm9jdXNcbiAgICB0aGlzLmluaXRpYWxpemVUb2RheXNEYXRlKCk7XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWREYXkpIHtcbiAgICAgIHRoaXMuX2Rpc3BsYXllZENhbGVuZGFyID0gbmV3IENhbGVuZGFyTW9kZWwodGhpcy5zZWxlY3RlZERheS55ZWFyLCB0aGlzLnNlbGVjdGVkRGF5Lm1vbnRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZGlzcGxheWVkQ2FsZW5kYXIgPSBuZXcgQ2FsZW5kYXJNb2RlbCh0aGlzLnRvZGF5LnllYXIsIHRoaXMudG9kYXkubW9udGgpO1xuICAgIH1cbiAgfVxuXG4gIGNoYW5nZU1vbnRoKG1vbnRoOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNldERpc3BsYXllZENhbGVuZGFyKG5ldyBDYWxlbmRhck1vZGVsKHRoaXMuX2Rpc3BsYXllZENhbGVuZGFyLnllYXIsIG1vbnRoKSk7XG4gIH1cblxuICBjaGFuZ2VZZWFyKHllYXI6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuc2V0RGlzcGxheWVkQ2FsZW5kYXIobmV3IENhbGVuZGFyTW9kZWwoeWVhciwgdGhpcy5fZGlzcGxheWVkQ2FsZW5kYXIubW9udGgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgZGlzcGxheWVkIGNhbGVuZGFyIHRvIHRoZSBuZXh0IG1vbnRoLlxuICAgKi9cbiAgbW92ZVRvTmV4dE1vbnRoKCk6IHZvaWQge1xuICAgIHRoaXMuc2V0RGlzcGxheWVkQ2FsZW5kYXIodGhpcy5fZGlzcGxheWVkQ2FsZW5kYXIubmV4dE1vbnRoKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vdmVzIHRoZSBkaXNwbGF5ZWQgY2FsZW5kYXIgdG8gdGhlIHByZXZpb3VzIG1vbnRoLlxuICAgKi9cbiAgbW92ZVRvUHJldmlvdXNNb250aCgpOiB2b2lkIHtcbiAgICB0aGlzLnNldERpc3BsYXllZENhbGVuZGFyKHRoaXMuX2Rpc3BsYXllZENhbGVuZGFyLnByZXZpb3VzTW9udGgoKSk7XG4gIH1cblxuICAvKipcbiAgICogTW92ZXMgdGhlIGRpc3BsYXllZCBjYWxlbmRhciB0byB0aGUgbmV4dCB5ZWFyLlxuICAgKi9cbiAgbW92ZVRvTmV4dFllYXIoKTogdm9pZCB7XG4gICAgdGhpcy5zZXREaXNwbGF5ZWRDYWxlbmRhcih0aGlzLl9kaXNwbGF5ZWRDYWxlbmRhci5uZXh0WWVhcigpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgZGlzcGxheWVkIGNhbGVuZGFyIHRvIHRoZSBwcmV2aW91cyB5ZWFyLlxuICAgKi9cbiAgbW92ZVRvUHJldmlvdXNZZWFyKCk6IHZvaWQge1xuICAgIHRoaXMuc2V0RGlzcGxheWVkQ2FsZW5kYXIodGhpcy5fZGlzcGxheWVkQ2FsZW5kYXIucHJldmlvdXNZZWFyKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vdmVzIHRoZSBkaXNwbGF5ZWQgY2FsZW5kYXIgdG8gdGhlIGN1cnJlbnQgbW9udGggYW5kIHllYXIuXG4gICAqL1xuICBtb3ZlVG9DdXJyZW50TW9udGgoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmRpc3BsYXllZENhbGVuZGFyLmlzRGF5SW5DYWxlbmRhcih0aGlzLnRvZGF5KSkge1xuICAgICAgdGhpcy5zZXREaXNwbGF5ZWRDYWxlbmRhcihuZXcgQ2FsZW5kYXJNb2RlbCh0aGlzLnRvZGF5LnllYXIsIHRoaXMudG9kYXkubW9udGgpKTtcbiAgICB9XG4gICAgdGhpcy5fZm9jdXNPbkNhbGVuZGFyQ2hhbmdlLm5leHQoKTtcbiAgfVxuXG4gIG1vdmVUb1NwZWNpZmljTW9udGgoZGF5OiBEYXlNb2RlbCkge1xuICAgIGlmICghdGhpcy5kaXNwbGF5ZWRDYWxlbmRhci5pc0RheUluQ2FsZW5kYXIoZGF5KSkge1xuICAgICAgdGhpcy5zZXREaXNwbGF5ZWRDYWxlbmRhcihuZXcgQ2FsZW5kYXJNb2RlbChkYXkueWVhciwgZGF5Lm1vbnRoKSk7XG4gICAgfVxuICB9XG5cbiAgaW5jcmVtZW50Rm9jdXNEYXkodmFsdWU6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuaG92ZXJlZERheSA9IHRoaXMuZm9jdXNlZERheSA9IHRoaXMuZm9jdXNlZERheS5pbmNyZW1lbnRCeSh2YWx1ZSk7XG4gICAgaWYgKHRoaXMuX2Rpc3BsYXllZENhbGVuZGFyLmlzRGF5SW5DYWxlbmRhcih0aGlzLmZvY3VzZWREYXkpKSB7XG4gICAgICB0aGlzLl9mb2N1c2VkRGF5Q2hhbmdlLm5leHQodGhpcy5mb2N1c2VkRGF5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXREaXNwbGF5ZWRDYWxlbmRhcihuZXcgQ2FsZW5kYXJNb2RlbCh0aGlzLmZvY3VzZWREYXkueWVhciwgdGhpcy5mb2N1c2VkRGF5Lm1vbnRoKSk7XG4gICAgfVxuICAgIHRoaXMuX2ZvY3VzT25DYWxlbmRhckNoYW5nZS5uZXh0KCk7XG4gIH1cblxuICByZXNldFNlbGVjdGVkRGF5KCkge1xuICAgIHRoaXMuc2VsZWN0ZWREYXkgPSB0aGlzLnBlcnNpc3RlZERhdGU7XG4gICAgdGhpcy5zZWxlY3RlZEVuZERheSA9IHRoaXMucGVyc2lzdGVkRW5kRGF0ZTtcbiAgfVxuXG4gIGNvbnZlcnREYXRlVG9EYXlNb2RlbChkYXRlOiBEYXRlKTogRGF5TW9kZWwge1xuICAgIHJldHVybiBuZXcgRGF5TW9kZWwoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RGF0ZSgpKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0U2VsZWN0ZWREYXkoZGF5TW9kZWw6IERheU1vZGVsIHwgdW5kZWZpbmVkLCBlbWl0RXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdGVkRGF5ID0gZGF5TW9kZWw7XG4gICAgaWYgKGVtaXRFdmVudCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWREYXlDaGFuZ2UubmV4dChkYXlNb2RlbCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRTZWxlY3RlZEVuZERheShkYXlNb2RlbDogRGF5TW9kZWwgfCB1bmRlZmluZWQsIGVtaXRFdmVudCk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0ZWRFbmREYXkgPSBkYXlNb2RlbDtcbiAgICBpZiAoZW1pdEV2ZW50KSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZEVuZERheUNoYW5nZS5uZXh0KGRheU1vZGVsKTtcbiAgICB9XG4gIH1cblxuICAvLyBub3QgYSBzZXR0ZXIgYmVjYXVzZSBpIHdhbnQgdGhpcyB0byByZW1haW4gcHJpdmF0ZVxuICBwcml2YXRlIHNldERpc3BsYXllZENhbGVuZGFyKHZhbHVlOiBDYWxlbmRhck1vZGVsKSB7XG4gICAgaWYgKCF0aGlzLl9kaXNwbGF5ZWRDYWxlbmRhci5pc0VxdWFsKHZhbHVlKSkge1xuICAgICAgdGhpcy5fZGlzcGxheWVkQ2FsZW5kYXIgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX2Rpc3BsYXllZENhbGVuZGFyQ2hhbmdlLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGluaXRpYWxpemVUb2RheXNEYXRlKCk6IHZvaWQge1xuICAgIHRoaXMuX3RvZGF5c0Z1bGxEYXRlID0gbmV3IERhdGUoKTtcbiAgICB0aGlzLl90b2RheSA9IG5ldyBEYXlNb2RlbChcbiAgICAgIHRoaXMuX3RvZGF5c0Z1bGxEYXRlLmdldEZ1bGxZZWFyKCksXG4gICAgICB0aGlzLl90b2RheXNGdWxsRGF0ZS5nZXRNb250aCgpLFxuICAgICAgdGhpcy5fdG9kYXlzRnVsbERhdGUuZ2V0RGF0ZSgpXG4gICAgKTtcbiAgfVxufVxuIl19