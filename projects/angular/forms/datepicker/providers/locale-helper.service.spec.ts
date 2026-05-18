/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localePl from '@angular/common/locales/pl';

import { LocaleHelperService } from './locale-helper.service';
import { ClrWeekday } from '../interfaces/day-of-week.interface';

registerLocaleData(localeFr);
registerLocaleData(localePl);

export default function () {
  describe('Locale Helper Service', () => {
    let localeHelperServiceUS: LocaleHelperService;
    let localeHelperServiceFr: LocaleHelperService;
    let localeHelperServicePl: LocaleHelperService;

    const usDays: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const frDays: string[] = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    const plDays: string[] = ['P', 'W', 'Ś', 'C', 'P', 'S', 'N'];

    const usMonthsAbbreviated: string[] = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const frMonthsAbbreviated: string[] = [
      'janv.',
      'févr.',
      'mars',
      'avr.',
      'mai',
      'juin',
      'juil.',
      'août',
      'sept.',
      'oct.',
      'nov.',
      'déc.',
    ];
    const plMonthsAbbreviated: string[] = [
      'sty',
      'lut',
      'mar',
      'kwi',
      'maj',
      'cze',
      'lip',
      'sie',
      'wrz',
      'paź',
      'lis',
      'gru',
    ];

    const usMonthsWide: string[] = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const frMonthsWide: string[] = [
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'août',
      'septembre',
      'octobre',
      'novembre',
      'décembre',
    ];
    const plMonthsWide: string[] = [
      'styczeń',
      'luty',
      'marzec',
      'kwiecień',
      'maj',
      'czerwiec',
      'lipiec',
      'sierpień',
      'wrzesień',
      'październik',
      'listopad',
      'grudzień',
    ];

    beforeEach(() => {
      localeHelperServiceFr = new LocaleHelperService('fr');
      localeHelperServicePl = new LocaleHelperService('pl');
      localeHelperServiceUS = new LocaleHelperService('en-US');
    });

    it('returns the first day of the week', () => {
      expect(localeHelperServiceUS.firstDayOfWeek).toBe(ClrWeekday.Sunday);
      expect(localeHelperServiceFr.firstDayOfWeek).toBe(ClrWeekday.Monday);
      expect(localeHelperServicePl.firstDayOfWeek).toBe(ClrWeekday.Monday);
    });

    describe('overrideFirstDayOfWeek', () => {
      it('overrides the first day of the week using ClrWeekday enum', () => {
        localeHelperServiceUS.overrideFirstDayOfWeek(ClrWeekday.Monday);
        expect(localeHelperServiceUS.firstDayOfWeek).toBe(ClrWeekday.Monday);

        const days = localeHelperServiceUS.localeDaysNarrow;
        expect(days[0]).toBe('M');
        expect(days[6]).toBe('S');
      });

      it('reverts to locale default when override is set to null', () => {
        localeHelperServiceUS.overrideFirstDayOfWeek(ClrWeekday.Monday);
        expect(localeHelperServiceUS.firstDayOfWeek).toBe(ClrWeekday.Monday);

        localeHelperServiceUS.overrideFirstDayOfWeek(null);
        expect(localeHelperServiceUS.firstDayOfWeek).toBe(ClrWeekday.Sunday);

        const days = localeHelperServiceUS.localeDaysNarrow;
        expect(days[0]).toBe('S');
      });

      it('falls back to Sunday for invalid override values', () => {
        localeHelperServiceUS.overrideFirstDayOfWeek(7 as ClrWeekday);
        expect(localeHelperServiceUS.firstDayOfWeek).toBe(ClrWeekday.Sunday);

        localeHelperServiceUS.overrideFirstDayOfWeek(-1 as ClrWeekday);
        expect(localeHelperServiceUS.firstDayOfWeek).toBe(ClrWeekday.Sunday);
      });

      it('allows override to ClrWeekday.Sunday explicitly', () => {
        localeHelperServiceFr.overrideFirstDayOfWeek(ClrWeekday.Sunday);
        expect(localeHelperServiceFr.firstDayOfWeek).toBe(ClrWeekday.Sunday);

        const days = localeHelperServiceFr.localeDaysNarrow;
        expect(days[0]).toBe('D');
      });

      it('updates wide day names (localeDays) when overridden', () => {
        localeHelperServiceUS.overrideFirstDayOfWeek(ClrWeekday.Monday);
        const days = localeHelperServiceUS.localeDays;
        expect(days[0].day).toBe('Monday');
        expect(days[6].day).toBe('Sunday');
      });

      it('supports all ClrWeekday enum values', () => {
        const expectedFirstNarrow = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const weekdays: ClrWeekday[] = [
          ClrWeekday.Sunday,
          ClrWeekday.Monday,
          ClrWeekday.Tuesday,
          ClrWeekday.Wednesday,
          ClrWeekday.Thursday,
          ClrWeekday.Friday,
          ClrWeekday.Saturday,
        ];
        weekdays.forEach((weekday, i) => {
          localeHelperServiceUS.overrideFirstDayOfWeek(weekday);
          expect(localeHelperServiceUS.firstDayOfWeek).toBe(weekday);
          expect(localeHelperServiceUS.localeDaysNarrow[0]).toBe(expectedFirstNarrow[i]);
        });
      });

      it('allows switching between multiple override values', () => {
        localeHelperServiceUS.overrideFirstDayOfWeek(ClrWeekday.Monday);
        expect(localeHelperServiceUS.localeDaysNarrow[0]).toBe('M');

        localeHelperServiceUS.overrideFirstDayOfWeek(ClrWeekday.Wednesday);
        expect(localeHelperServiceUS.localeDaysNarrow[0]).toBe('W');

        localeHelperServiceUS.overrideFirstDayOfWeek(ClrWeekday.Saturday);
        expect(localeHelperServiceUS.localeDaysNarrow[0]).toBe('S');
      });

      it('does not affect locale months when overriding first day', () => {
        const monthsBefore = localeHelperServiceUS.localeMonthsAbbreviated.slice();
        localeHelperServiceUS.overrideFirstDayOfWeek(ClrWeekday.Wednesday);
        expect(localeHelperServiceUS.localeMonthsAbbreviated).toEqual(monthsBefore);
      });

      it('does not affect locale date format when overriding first day', () => {
        const formatBefore = localeHelperServiceUS.localeDateFormat;
        localeHelperServiceUS.overrideFirstDayOfWeek(ClrWeekday.Wednesday);
        expect(localeHelperServiceUS.localeDateFormat).toBe(formatBefore);
      });

      it('resets to Sunday when an invalid value is provided after a valid one', () => {
        localeHelperServiceUS.overrideFirstDayOfWeek(ClrWeekday.Tuesday);
        expect(localeHelperServiceUS.firstDayOfWeek).toBe(ClrWeekday.Tuesday);

        localeHelperServiceUS.overrideFirstDayOfWeek(10 as ClrWeekday);
        expect(localeHelperServiceUS.firstDayOfWeek).toBe(ClrWeekday.Sunday);
      });

      it('overrides fr locale from Monday to Sunday', () => {
        expect(localeHelperServiceFr.firstDayOfWeek).toBe(ClrWeekday.Monday);

        localeHelperServiceFr.overrideFirstDayOfWeek(ClrWeekday.Sunday);
        expect(localeHelperServiceFr.firstDayOfWeek).toBe(ClrWeekday.Sunday);

        const narrowDays = localeHelperServiceFr.localeDaysNarrow;
        expect(narrowDays[0]).toBe('D');
        expect(narrowDays[1]).toBe('L');
      });

      it('always returns 7 days in localeDays regardless of override', () => {
        const weekdays: ClrWeekday[] = [
          ClrWeekday.Sunday,
          ClrWeekday.Monday,
          ClrWeekday.Tuesday,
          ClrWeekday.Wednesday,
          ClrWeekday.Thursday,
          ClrWeekday.Friday,
          ClrWeekday.Saturday,
        ];
        weekdays.forEach(weekday => {
          localeHelperServiceUS.overrideFirstDayOfWeek(weekday);
          expect(localeHelperServiceUS.localeDays.length).toBe(7);
          expect(localeHelperServiceUS.localeDaysNarrow.length).toBe(7);
        });
      });

      it('ClrWeekday enum has the expected numeric values', () => {
        expect(ClrWeekday.Sunday).toBe(0);
        expect(ClrWeekday.Monday).toBe(1);
        expect(ClrWeekday.Tuesday).toBe(2);
        expect(ClrWeekday.Wednesday).toBe(3);
        expect(ClrWeekday.Thursday).toBe(4);
        expect(ClrWeekday.Friday).toBe(5);
        expect(ClrWeekday.Saturday).toBe(6);
      });
    });

    it('returns the months in abbreviated format' + 'and nominative form', () => {
      const a1: ReadonlyArray<string> = localeHelperServiceUS.localeMonthsAbbreviated;
      const a2: ReadonlyArray<string> = localeHelperServiceFr.localeMonthsAbbreviated;
      const a3: ReadonlyArray<string> = localeHelperServicePl.localeMonthsAbbreviated;

      expect(a1.length === usMonthsAbbreviated.length && a1.every((v, i) => v === usMonthsAbbreviated[i])).toBe(true);
      expect(a2.length === frMonthsAbbreviated.length && a2.every((v, i) => v === frMonthsAbbreviated[i])).toBe(true);
      expect(a3.length === plMonthsAbbreviated.length && a3.every((v, i) => v === plMonthsAbbreviated[i])).toBe(true);
    });

    it('returns the months in wide format ' + 'and nominative form', () => {
      const a1: ReadonlyArray<string> = localeHelperServiceUS.localeMonthsWide;
      const a2: ReadonlyArray<string> = localeHelperServiceFr.localeMonthsWide;
      const a3: ReadonlyArray<string> = localeHelperServicePl.localeMonthsWide;

      expect(a1.length === usMonthsWide.length && a1.every((v, i) => v === usMonthsWide[i])).toBe(true);
      expect(a2.length === frMonthsWide.length && a2.every((v, i) => v === frMonthsWide[i])).toBe(true);
      expect(a3.length === plMonthsWide.length && a3.every((v, i) => v === plMonthsWide[i])).toBe(true);
    });

    it('returns the locale date format', () => {
      expect(localeHelperServiceUS.localeDateFormat).toBe('M/d/yy');
      expect(localeHelperServiceFr.localeDateFormat).toBe('dd/MM/y');
      expect(localeHelperServicePl.localeDateFormat).toBe('d.MM.y');
    });

    it(
      'returns the locale days in narrow format ' + 'and nominative form ' + 'according to the first day of the week',
      () => {
        const a1: ReadonlyArray<string> = localeHelperServiceUS.localeDaysNarrow;
        const a2: ReadonlyArray<string> = localeHelperServiceFr.localeDaysNarrow;
        const a3: ReadonlyArray<string> = localeHelperServicePl.localeDaysNarrow;

        expect(a1.length === usDays.length && a1.every((v, i) => v === usDays[i])).toBe(true);
        expect(a2.length === usDays.length && a2.every((v, i) => v === frDays[i])).toBe(true);
        expect(a3.length === plDays.length && a3.every((v, i) => v === plDays[i])).toBe(true);
      }
    );
  });
}
