/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  FormatWidth,
  FormStyle,
  getLocaleDateFormat,
  getLocaleDayNames,
  getLocaleFirstDayOfWeek,
  getLocaleMonthNames,
  TranslationWidth,
} from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';

import { ClrWeekday } from '../enums/weekday.enum';
import { ClrDayOfWeek } from '../interfaces/day-of-week.interface';

/**
 * This service extracts the Angular CLDR data needed by the datepicker.
 */
@Injectable()
export class LocaleHelperService {
  private _firstDayOfWeek: number = ClrWeekday.Sunday;
  private _localeDays: ReadonlyArray<ClrDayOfWeek>;
  private _localeMonthsAbbreviated: ReadonlyArray<string>;
  private _localeMonthsWide: ReadonlyArray<string>;
  private _localeDateFormat: string;

  constructor(@Inject(LOCALE_ID) public locale: string) {
    this.initializeLocaleData();
  }

  get firstDayOfWeek(): number {
    return this._firstDayOfWeek;
  }

  get localeDays(): ReadonlyArray<ClrDayOfWeek> {
    return this._localeDays;
  }

  // leave for backward compatibility
  get localeDaysNarrow(): ReadonlyArray<string> {
    return this._localeDays.map(day => day.narrow);
  }

  get localeMonthsAbbreviated(): ReadonlyArray<string> {
    return this._localeMonthsAbbreviated;
  }

  get localeMonthsWide(): ReadonlyArray<string> {
    return this._localeMonthsWide;
  }

  get localeDateFormat(): string {
    return this._localeDateFormat;
  }

  /**
   * Overrides the first day of the week regardless of locale.
   * Accepts a `ClrWeekday` value (Sunday=0 through Saturday=6), or null to revert to locale default.
   * Incorrect values will revert to default value (Sunday).
   */
  overrideFirstDayOfWeek(day: ClrWeekday | null): void {
    if (day === null || day < ClrWeekday.Sunday || day > ClrWeekday.Saturday) {
      this.initializeLocaleFirstDayOfWeek();
      this.initializeLocaleDays();

      return;
    }

    this._firstDayOfWeek = day;

    this.initializeLocaleDays();
  }

  /**
   * Initializes the locale data.
   */
  private initializeLocaleData(): void {
    // Order in which these functions is called is very important.
    this.initializeLocaleFirstDayOfWeek();
    this.initializeLocaleDateFormat();
    this.initializeLocaleMonthsAbbreviated();
    this.initializeLocaleMonthsWide();
    this.initializeLocaleDays();
  }

  /**
   * Initialize day names based on the locale.
   * eg: [{day: Sunday, narrow: S}, {day: Monday, narrow: M}...] for en-US.
   */
  private initializeLocaleDays(): void {
    // Get locale day names starting with Sunday
    const tempArr = [];
    const tempWideArr: string[] = getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Wide).slice();
    const tempNarrowArr: string[] = getLocaleDayNames(
      this.locale,
      FormStyle.Standalone,
      TranslationWidth.Narrow
    ).slice();

    for (let i = 0; i < 7; i++) {
      tempArr.push({ day: tempWideArr[i], narrow: tempNarrowArr[i] });
    }

    // Rearrange the tempArr to start with the first day of the week based on the locale (default or override).
    if (this.firstDayOfWeek > ClrWeekday.Sunday) {
      const prevDays: { day: string; narrow: string }[] = tempArr.splice(0, this.firstDayOfWeek);
      tempArr.push(...prevDays);
    }

    this._localeDays = tempArr;
  }

  /**
   * Initializes the array of month names in the TranslationWidth.Abbreviated format.
   * e.g. `[Jan, Feb, ...]` for en-US
   */
  private initializeLocaleMonthsAbbreviated(): void {
    this._localeMonthsAbbreviated = getLocaleMonthNames(
      this.locale,
      FormStyle.Standalone,
      TranslationWidth.Abbreviated
    ).slice();
  }

  /**
   * Initializes the array of month names in the TranslationWidth.Wide format.
   * e.g. `[January, February, ...]` for en-US
   */
  private initializeLocaleMonthsWide(): void {
    this._localeMonthsWide = getLocaleMonthNames(this.locale, FormStyle.Standalone, TranslationWidth.Wide).slice();
  }

  /**
   * Initializes the first day of the week based on the locale.
   */
  private initializeLocaleFirstDayOfWeek(): void {
    this._firstDayOfWeek = getLocaleFirstDayOfWeek(this.locale);
  }

  private initializeLocaleDateFormat(): void {
    this._localeDateFormat = getLocaleDateFormat(this.locale, FormatWidth.Short);
  }
}
