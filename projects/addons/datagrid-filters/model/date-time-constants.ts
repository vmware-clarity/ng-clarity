/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Internal time units in milliseconds and formatDate formats for the date-time filters. Not exported from the package.

/**
 * Locale for formatDate with the formats below. Angular always has its data, without registerLocaleData, and the
 * formats are numbers only, so the output is the same in every locale.
 */
export const formatLocale = 'en-US';
/** Date of predicates and editor state, e.g. "2023-08-09". */
export const dateFormat = 'yyyy-MM-dd';
/** Time input value, e.g. "10:30". */
export const timeFormat = 'HH:mm';
/** Time input value with seconds, e.g. "10:30:15". */
export const timeWithSecondsFormat = `${timeFormat}:ss`;
/** Local date and time, e.g. "2023-08-09T10:30". */
export const dateTimeFormat = `${dateFormat}T${timeFormat}`;
/** Local date and time with seconds, e.g. "2023-08-09T10:30:15". */
export const dateTimeWithSecondsFormat = `${dateFormat}T${timeWithSecondsFormat}`;

// TODO: zpopov: Existing time utils to convert to/from milliseconds may make the code even easier to read
export const oneSecondMs: number = 1000;
export const oneMinuteMs: number = 60 * oneSecondMs;
export const oneHourMs: number = 60 * oneMinuteMs;
/**
 * A fixed 24 hours Time span, not a calendar day.
 * For calendar days use `Date.setDate()`, since a day can have 23 or 25 hours when daylight saving changes.
 */
export const oneDayMs: number = 24 * oneHourMs;
export const oneWeekMs: number = 7 * oneDayMs;
export const oneMonthMs: number = 30 * oneDayMs;
// We ignore leap years when it comes to time-spans.
export const oneYearMs: number = 365 * oneDayMs;
