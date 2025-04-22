import { DayModel } from './day.model';
export declare class CalendarModel {
    readonly year: number;
    readonly month: number;
    days: DayModel[];
    constructor(year: number, month: number);
    /**
     * Checks if the calendar passed is equal to the current calendar.
     */
    isEqual(calendar: CalendarModel): boolean;
    /**
     * Checks if a DayModel is in the Calendar
     */
    isDayInCalendar(day: DayModel): boolean;
    /**
     * Returns CalendarModel of the previous month.
     */
    previousMonth(): CalendarModel;
    /**
     * Returns CalendarModel of the next month.
     */
    nextMonth(): CalendarModel;
    /**
     * Returns CalendarModel of the previous year.
     */
    previousYear(): CalendarModel;
    /**
     * Returns CalendarModel of the next year.
     */
    nextYear(): CalendarModel;
    /**
     * Populates the days array with the DayModels in the current Calendar.
     */
    private initializeDaysInCalendar;
}
