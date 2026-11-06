/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormatWidth, getLocaleDateFormat } from '@angular/common';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Converts between the locale date string held by a Clarity `clrDate` form control
 * (e.g. "01/15/2003" for en-US, "15.01.2003" for bg) and the `yyyy-MM-dd` string the filters use.
 * The part order and delimiter are read from the Angular locale short date format, as Clarity does.
 */
type DatePart = 'd' | 'm' | 'y';

function localeDateParts(locale: string): { order: DatePart[]; delimiters: [string, string] } {
  const format = getLocaleDateFormat(locale, FormatWidth.Short).replace(/[‎‏]/g, '');
  const lower = format.toLowerCase();
  let order: DatePart[] = ['y', 'm', 'd'];
  if (/d+.+m+.+y+/.test(lower)) {
    order = ['d', 'm', 'y'];
  } else if (/m+.+d+.+y+/.test(lower)) {
    order = ['m', 'd', 'y'];
  }
  const split = format.split(/d+|m+|y+/i);
  const delimiters: [string, string] = split.length === 4 ? [split[1], split[2]] : ['/', '/'];
  return { order, delimiters };
}

function toFourDigitYear(year: number): number {
  if (year > 999) {
    return year;
  }
  if (year < 10 || year > 99) {
    return -1;
  }
  const currentYear = new Date().getFullYear();
  const result = Math.floor(currentYear / 100) * 100 + year;
  return result > currentYear + 20 ? result - 100 : result;
}

const pad = (value: number, length = 2) => value.toString().padStart(length, '0');

/** Locale date string from the date picker to `yyyy-MM-dd`. Returns '' when empty and null when invalid. */
export function localeDateToIso(value: string, locale: string): string | null {
  if (!value) {
    return '';
  }
  const numbers = value.match(/\d+/g);
  if (!numbers || numbers.length !== 3) {
    return null;
  }
  const { order } = localeDateParts(locale);
  const parts: Record<DatePart, number> = { d: 0, m: 0, y: 0 };
  order.forEach((part, index) => (parts[part] = +numbers[index]));
  const year = toFourDigitYear(parts.y);
  const date = new Date(year, parts.m - 1, parts.d);
  if (year < 0 || date.getFullYear() !== year || date.getMonth() !== parts.m - 1 || date.getDate() !== parts.d) {
    return null;
  }
  return `${pad(year, 4)}-${pad(parts.m)}-${pad(parts.d)}`;
}

/** `yyyy-MM-dd` to the locale date string the date picker displays. Returns '' when empty or invalid. */
export function isoToLocaleDate(iso: string, locale: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
  if (!match) {
    return '';
  }
  const { order, delimiters } = localeDateParts(locale);
  const parts: Record<DatePart, string> = { y: match[1], m: match[2], d: match[3] };
  return parts[order[0]] + delimiters[0] + parts[order[1]] + delimiters[1] + parts[order[2]];
}

/** Flags a typed date that cannot be read in the current locale with the `pattern` error. */
export function localeDateValidator(locale: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    localeDateToIso(control.value, locale) === null ? { pattern: true } : null;
}
