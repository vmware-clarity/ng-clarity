/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Spec helpers for date-time filters. Not part of the package.

import { formatDate } from '@angular/common';

const isoDate = (date: Date) => formatDate(date, 'yyyy-MM-dd', 'en-US');

/** The same clock time one calendar day later. */
function nextDay(date: Date): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return next;
}

/** The calendar day after a `yyyy-MM-dd` date, as `yyyy-MM-dd`. */
export function nextIsoDay(iso: string): string {
  return isoDate(nextDay(new Date(`${iso}T00:00:00`)));
}

/**
 * The days of a year whose local midnight-to-midnight span is not 24 hours, i.e. the days the clocks change.
 * Empty in a time zone without daylight saving (e.g. UTC).
 */
export function clockChangeDays(year: number): string[] {
  const days: string[] = [];
  for (let day = new Date(year, 0, 1); day.getFullYear() === year; day = nextDay(day)) {
    if (nextDay(day).getTime() - day.getTime() !== 24 * 60 * 60 * 1000) {
      days.push(isoDate(day));
    }
  }
  return days;
}
