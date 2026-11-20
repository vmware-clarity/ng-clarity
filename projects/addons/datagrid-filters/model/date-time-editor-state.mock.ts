/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Spec helpers for date-time filters. Not part of the package.

import { addDays, toIsoDate } from './date-time-editor-state';

/**
 * The days of a year whose local midnight-to-midnight span is not 24 hours, i.e. the days the clocks change.
 * Empty in a time zone without daylight saving (e.g. UTC).
 */
export function clockChangeDays(year: number): string[] {
  const days: string[] = [];
  for (let day = new Date(year, 0, 1); day.getFullYear() === year; day = addDays(day, 1)) {
    if (addDays(day, 1).getTime() - day.getTime() !== 24 * 60 * 60 * 1000) {
      days.push(toIsoDate(day));
    }
  }
  return days;
}
