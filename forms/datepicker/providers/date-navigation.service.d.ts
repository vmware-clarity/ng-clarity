import { Observable } from 'rxjs';
import { DateRangeInput } from '../interfaces/date-range.interface';
import { CalendarModel } from '../model/calendar.model';
import { DayModel } from '../model/day.model';
import * as i0 from "@angular/core";
/**
 * This service is responsible for:
 * 1. Initializing the displayed calendar.
 * 2. Moving the calendar to the next, previous or current months
 * 3. Managing the focused and selected day models.
 */
export declare class DateNavigationService {
    persistedDate: DayModel;
    persistedEndDate: DayModel;
    selectedDay: DayModel;
    selectedEndDay: DayModel;
    focusedDay: DayModel;
    hoveredDay: DayModel;
    hoveredMonth: number;
    hoveredYear: number;
    isRangePicker: boolean;
    hasActionButtons: boolean;
    private _displayedCalendar;
    private _todaysFullDate;
    private _today;
    private _selectedDayChange;
    private _selectedEndDayChange;
    private _displayedCalendarChange;
    private _focusOnCalendarChange;
    private _refreshCalendarView;
    private _focusedDayChange;
    get today(): DayModel;
    get displayedCalendar(): CalendarModel;
    get selectedDayChange(): Observable<DayModel>;
    get selectedEndDayChange(): Observable<DayModel>;
    /**
     * This observable lets the subscriber know that the displayed calendar has changed.
     */
    get displayedCalendarChange(): Observable<void>;
    /**
     * This observable lets the subscriber know that the focus should be applied on the calendar.
     */
    get focusOnCalendarChange(): Observable<void>;
    /**
     * This observable lets the subscriber know that the focused day in the displayed calendar has changed.
     */
    get focusedDayChange(): Observable<DayModel>;
    /**
     * This observable lets the subscriber know that the displayed calendar has changed.
     */
    get refreshCalendarView(): Observable<void>;
    /**
     * Notifies that the selected day has changed so that the date can be emitted to the user.
     */
    notifySelectedDayChanged(dayObject: DayModel | DateRangeInput, { emitEvent }?: {
        emitEvent: boolean;
    }): void;
    /**
     * Initializes the calendar based on the selected day.
     */
    initializeCalendar(): void;
    changeMonth(month: number): void;
    changeYear(year: number): void;
    /**
     * Moves the displayed calendar to the next month.
     */
    moveToNextMonth(): void;
    /**
     * Moves the displayed calendar to the previous month.
     */
    moveToPreviousMonth(): void;
    /**
     * Moves the displayed calendar to the next year.
     */
    moveToNextYear(): void;
    /**
     * Moves the displayed calendar to the previous year.
     */
    moveToPreviousYear(): void;
    /**
     * Moves the displayed calendar to the current month and year.
     */
    moveToCurrentMonth(): void;
    moveToSpecificMonth(day: DayModel): void;
    incrementFocusDay(value: number): void;
    resetSelectedDay(): void;
    convertDateToDayModel(date: Date): DayModel;
    private setSelectedDay;
    private setSelectedEndDay;
    private setDisplayedCalendar;
    private initializeTodaysDate;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateNavigationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DateNavigationService>;
}
