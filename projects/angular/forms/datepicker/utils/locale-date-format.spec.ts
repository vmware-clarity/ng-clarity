/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import localeBg from '@angular/common/locales/bg';
import localeHr from '@angular/common/locales/hr';
import localeJa from '@angular/common/locales/ja';
import localeNl from '@angular/common/locales/nl';
import { assertEqualDates } from '@clr/angular/testing';

import { ClrLocaleDateFormat } from './locale-date-format';

registerLocaleData(localeAr);
registerLocaleData(localeBg);
registerLocaleData(localeHr);
registerLocaleData(localeJa);
registerLocaleData(localeNl);

describe('Datepicker', () => {
  describe('Providers', () => {
    describe('ClrLocaleDateFormat', () => {
      it('keeps the locale it was created for', () => {
        expect(new ClrLocaleDateFormat('en-US').locale).toBe('en-US');
      });

      it('provides the placeholder for the locale', () => {
        expect(new ClrLocaleDateFormat('en-US').placeholder).toBe('MM/DD/YYYY');
        expect(new ClrLocaleDateFormat('bg').placeholder).toBe('DD.MM.YYYY');
        expect(new ClrLocaleDateFormat('ja').placeholder).toBe('YYYY/MM/DD');
      });

      it('formats dates in the order and with the delimiters of the locale', () => {
        const date = new Date(2015, 1, 1);
        expect(new ClrLocaleDateFormat('en-US').format(date)).toBe('02/01/2015');
        expect(new ClrLocaleDateFormat('bg').format(date)).toBe('01.02.2015');
        expect(new ClrLocaleDateFormat('ja').format(date)).toBe('2015/02/01');
        expect(new ClrLocaleDateFormat('hr').format(date)).toBe('01. 02. 2015');
        expect(new ClrLocaleDateFormat('nl').format(new Date(2016, 1, 15))).toBe('15-02-2016');
      });

      it('formats null, undefined and invalid dates as an empty string', () => {
        const dateFormat = new ClrLocaleDateFormat('en-US');
        expect(dateFormat.format(null)).toBe('');
        expect(dateFormat.format(undefined)).toBe('');
        expect(dateFormat.format(new Date('invalid'))).toBe('');
      });

      it('parses text in the order of the locale', () => {
        assertEqualDates(new ClrLocaleDateFormat('en-US').parse('02/01/2015'), new Date(2015, 1, 1));
        assertEqualDates(new ClrLocaleDateFormat('bg').parse('01.02.2015'), new Date(2015, 1, 1));
        assertEqualDates(new ClrLocaleDateFormat('ja').parse('2015/02/01'), new Date(2015, 1, 1));
      });

      it('accepts any delimiter and one-digit day and month', () => {
        const dateFormat = new ClrLocaleDateFormat('en-US');
        assertEqualDates(dateFormat.parse('2-1-2015'), new Date(2015, 1, 1));
        assertEqualDates(dateFormat.parse('2.1.2015'), new Date(2015, 1, 1));
      });

      it('expands two-digit years', () => {
        const date = new ClrLocaleDateFormat('en-US').parse('02/01/15');
        expect(date.getFullYear()).toBe(2015);
      });

      it('returns null for text that is not a day that exists', () => {
        const dateFormat = new ClrLocaleDateFormat('en-US');
        expect(dateFormat.parse('')).toBeNull();
        // Defensive guard for non-TypeScript callers; null is not part of the parse() contract.
        expect(dateFormat.parse(null as unknown as string)).toBeNull();
        expect(dateFormat.parse('abc')).toBeNull();
        expect(dateFormat.parse('02/30/2015')).toBeNull();
        expect(dateFormat.parse('13/01/2015')).toBeNull();
        expect(dateFormat.parse('02/01/201')).toBeNull();
        expect(dateFormat.parse('02/01/20155')).toBeNull();
      });

      it('ignores right-to-left marks in the locale date format', () => {
        // The ar short date format contains U+200F marks around its delimiters.
        const dateFormat = new ClrLocaleDateFormat('ar');
        expect(dateFormat.placeholder).toBe('DD/MM/YYYY');
        expect(dateFormat.format(new Date(2015, 1, 1))).toBe('01/02/2015');
        assertEqualDates(dateFormat.parse('01/02/2015'), new Date(2015, 1, 1));
      });

      it('round-trips its own output', () => {
        for (const locale of ['en-US', 'bg', 'ja', 'hr', 'nl']) {
          const dateFormat = new ClrLocaleDateFormat(locale);
          assertEqualDates(dateFormat.parse(dateFormat.format(new Date(2024, 10, 30))), new Date(2024, 10, 30));
        }
      });
    });
  });
});
