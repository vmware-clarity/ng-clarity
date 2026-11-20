/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Internal time units in milliseconds for the date-time filters. Not exported from the package.

// TODO: zpopov: Existing time utils to convert to/from milliseconds may make the code even easier to read
export const oneSecondMs: number = 1000;
export const oneMinuteMs: number = 60 * oneSecondMs;
export const oneHourMs: number = 60 * oneMinuteMs;
/**
 * A fixed 24 hours Time span, not a calendar day.
 * For calendar days calculation use `addDays()`, since a day can have 23 or 25 hours when daylight saving changes.
 */
export const oneDayMs: number = 24 * oneHourMs;
export const oneWeekMs: number = 7 * oneDayMs;
export const oneMonthMs: number = 30 * oneDayMs;
// We ignore leap years when it comes to time-spans.
export const oneYearMs: number = 365 * oneDayMs;
