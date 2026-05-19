import { WeekDay } from '@angular/common';
/**
 * Returns the number of days in a month.
 */
export declare function getNumberOfDaysInTheMonth(year: number, month: number): number;
/**
 * Returns the day for the corresponding date where 0 represents Sunday.
 */
export declare function getDay(year: number, month: number, date: number): WeekDay;
/**
 * Takes in a year and if it is a 2 digit year, returns the corresponding 4 digit year.
 * Window of 80 years before and 20 years after the present year.
 * Credit: https://github.com/globalizejs/globalize/blob/e1b31cd6a4f1cff75b185b68b7a32220aac5196f/src/date/parse.js
 */
export declare function parseToFourDigitYear(year: number): number;
export declare function datesAreEqual(date1: Date, date2: Date): boolean;
