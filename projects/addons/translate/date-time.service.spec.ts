/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { inject, TestBed } from '@angular/core/testing';

import { DateTimeKind, DateTimeService, HourFormat } from './date-time.service';
import { AppfxLocale, AppfxTranslateService } from './translate.service';

describe('Service: DateTime', () => {
  const testDate = new Date('01 June 2023 UTC');

  let translateService: AppfxTranslateService;

  beforeEach(() => {
    const testbed = TestBed.configureTestingModule({
      providers: [AppfxTranslateService, DateTimeService],
    });

    translateService = testbed.inject(AppfxTranslateService);
  });

  // Ensure that the locale is reset after each test because the locale state is global
  afterEach(inject([AppfxTranslateService], (service: AppfxTranslateService) => {
    service.locale = AppfxLocale.En;
  }));

  beforeEach(() => {
    const toLocaleString = Date.prototype.toLocaleString;
    spyOn(Date.prototype, 'toLocaleString').and.callFake(function (
      this: Date,
      locales?: string | string[],
      options?: Intl.DateTimeFormatOptions
    ): string {
      return toLocaleString.call(this, locales, {
        ...options,
        timeZone: 'UTC',
      });
    });
  });

  it('exists', inject([DateTimeService], (service: DateTimeService) => {
    expect(service).toBeTruthy();
  }));

  describe('using the default options', () => {
    it('formats the date as LongDateTime', inject([DateTimeService], (service: DateTimeService) => {
      expect(service.format(testDate)).toBe('Thursday, June 01, 2023 at 24:00:00 GMT');
    }));
  });

  describe('overriding the default options', () => {
    it('with Date', inject([DateTimeService], (service: DateTimeService) => {
      expect(
        service.format(testDate, {
          dateTimeKind: DateTimeKind.Date,
        })
      ).toBe('06/01/2023');
    }));

    it('with Time', inject([DateTimeService], (service: DateTimeService) => {
      expect(
        service.format(testDate, {
          dateTimeKind: DateTimeKind.Time,
        })
      ).toBe('24:00:00');
    }));

    it('with DateTime', inject([DateTimeService], (service: DateTimeService) => {
      expect(
        service.format(testDate, {
          dateTimeKind: DateTimeKind.DateTime,
        })
      ).toBe('06/01/2023, 24:00:00');
    }));

    it('with LongDateTime', inject([DateTimeService], (service: DateTimeService) => {
      expect(
        service.format(testDate, {
          dateTimeKind: DateTimeKind.LongDateTime,
        })
      ).toBe('Thursday, June 01, 2023 at 24:00:00 GMT');
    }));
  });

  describe('using 12-hour format', () => {
    it('with Date', inject([DateTimeService], (service: DateTimeService) => {
      expect(
        service.format(testDate, {
          dateTimeKind: DateTimeKind.Date,
          hourFormat: HourFormat.Hour12,
        })
      ).toBe('06/01/2023');
    }));

    it('with Time', inject([DateTimeService], (service: DateTimeService) => {
      expect(
        service.format(testDate, {
          dateTimeKind: DateTimeKind.Time,
          hourFormat: HourFormat.Hour12,
        })
      ).toBe('12:00:00 AM');
    }));

    it('with DateTime', inject([DateTimeService], (service: DateTimeService) => {
      expect(
        service.format(testDate, {
          dateTimeKind: DateTimeKind.DateTime,
          hourFormat: HourFormat.Hour12,
        })
      ).toBe('06/01/2023, 12:00:00 AM');
    }));

    it('with LongDateTime', inject([DateTimeService], (service: DateTimeService) => {
      expect(
        service.format(testDate, {
          dateTimeKind: DateTimeKind.LongDateTime,
          hourFormat: HourFormat.Hour12,
        })
      ).toBe('Thursday, June 01, 2023 at 12:00:00 AM GMT');
    }));
  });

  describe('when the locale changes', () => {
    beforeEach(() => {
      translateService.locale = AppfxLocale.Fr;
    });

    it('translates in the new locale', inject([DateTimeService], (service: DateTimeService) => {
      expect(
        service.format(testDate, {
          dateTimeKind: DateTimeKind.LongDateTime,
        })
      ).toBe('jeudi 01 juin 2023 à 24:00:00 UTC');
    }));
  });

  describe('for any given locale', () => {
    for (const locale of Object.values(AppfxLocale)) {
      it(`formats in the ${locale} locale without error`, inject(
        [AppfxTranslateService, DateTimeService],
        (translateService: AppfxTranslateService, dateTimeService: DateTimeService) => {
          translateService.locale = locale;
          expect(() =>
            dateTimeService.format(testDate, {
              dateTimeKind: DateTimeKind.LongDateTime,
            })
          ).not.toThrow();
        }
      ));
    }
  });
});
