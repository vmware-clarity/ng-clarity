/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Internal. The value of a DATE field: an ISO 8601 calendar date without a time of day, such as "2026-10-20". It names
 * a day, not an instant, so it means the same day in every time zone. Converts it to and from a `Date` at local
 * midnight, for the date inputs and the filter text.
 */
export class AdvancedFilterIsoDate {
  /**
   * Whether the value is an ISO date of a day that exists: "2026-02-30" does not.
   */
  isIsoDate(value: unknown): value is string {
    return this.toDate(value) !== null;
  }

  /**
   * The day as a `Date` at local midnight, or `null` for anything that is not an ISO date of a day that exists.
   */
  toDate(value: unknown): Date | null {
    const parts = typeof value === 'string' ? ISO_DATE.exec(value) : null;
    if (!parts) {
      return null;
    }
    const [year, month, day] = [Number(parts[1]), Number(parts[2]) - 1, Number(parts[3])];
    const date = new Date(year, month, day);
    // Years below 100 would otherwise be read as 19xx.
    date.setFullYear(year);
    return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ? date : null;
  }

  /**
   * The local day of the date, such as "2026-10-20". Its time of day is ignored.
   */
  fromDate(date: Date): string {
    const year = String(date.getFullYear()).padStart(4, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
