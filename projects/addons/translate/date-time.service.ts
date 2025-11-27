/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

import { AppfxTranslateService } from './translate.service';

export interface DateTimeFormatOptions {
  dateTimeKind: DateTimeKind;
  hourFormat?: HourFormat;
}

export enum DateTimeKind {
  Date,
  Time,
  DateTime,
  LongDateTime,
}

export enum HourFormat {
  Hour12 = 'h12',
  Hour24 = 'h24',
}

const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
};

const timeOptions: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

@Injectable()
export class DateTimeService {
  private readonly optionsMap: Readonly<Record<DateTimeKind, Intl.DateTimeFormatOptions>> = {
    [DateTimeKind.Date]: dateOptions,
    [DateTimeKind.Time]: timeOptions,
    [DateTimeKind.DateTime]: {
      ...dateOptions,
      ...timeOptions,
    },
    [DateTimeKind.LongDateTime]: {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'longOffset',
    },
  };

  private readonly defaultFormatOptions: DateTimeFormatOptions = {
    dateTimeKind: DateTimeKind.LongDateTime,
    hourFormat: HourFormat.Hour24,
  };

  constructor(private readonly appfxTranslateService: AppfxTranslateService) {}

  format(date?: Date, options?: DateTimeFormatOptions): string {
    return date?.toLocaleString(this.appfxTranslateService.localeAsBcp47(), this.transformOptions(options)) ?? '';
  }

  private transformOptions(options?: DateTimeFormatOptions): Intl.DateTimeFormatOptions {
    const opts = {
      ...this.defaultFormatOptions,
      ...options,
    };

    return {
      ...this.optionsMap[opts.dateTimeKind],
      hourCycle: opts.hourFormat || HourFormat.Hour24,
    };
  }
}
