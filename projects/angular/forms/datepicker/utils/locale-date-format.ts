/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormatWidth, getLocaleDateFormat } from '@angular/common';

import {
  BIG_ENDIAN,
  DELIMITER_REGEX,
  InputDateDisplayFormat,
  LITTLE_ENDIAN,
  LITTLE_ENDIAN_REGEX,
  MIDDLE_ENDIAN,
  MIDDLE_ENDIAN_REGEX,
  RTL_REGEX,
  USER_INPUT_REGEX,
} from './constants';
import { getNumberOfDaysInTheMonth, parseToFourDigitYear } from './date-utils';

/**
 * The date format that Clarity date inputs use for a locale: the order of day, month and year and the
 * delimiters between them, read from the Angular locale short date format (`getLocaleDateFormat(locale,
 * FormatWidth.Short)`). Use it to format and parse dates exactly as `clrDate`, `clrStartDate` and
 * `clrEndDate` show and accept them, e.g. to convert a date input's form value.
 *
 * Instances are immutable and depend on the locale only, so they need no providers and can be shared.
 *
 * ```ts
 * const dateFormat = new ClrLocaleDateFormat(inject(LOCALE_ID));
 * dateFormat.placeholder; // "MM/DD/YYYY" for en-US
 * dateFormat.format(new Date(2015, 1, 1)); // "02/01/2015"
 * dateFormat.parse('02/01/2015'); // Date for 1 February 2015, local midnight
 * ```
 */
export class ClrLocaleDateFormat {
  private readonly displayFormat: InputDateDisplayFormat;
  private readonly delimiters: [string, string] = ['/', '/'];

  /**
   * @param locale An Angular locale id whose locale data is registered, such as the app's `LOCALE_ID`.
   */
  constructor(
    /**
     * The Angular locale id the format was read from.
     */
    readonly locale: string
  ) {
    const cldrLocaleDateFormat: string = getLocaleDateFormat(locale, FormatWidth.Short);
    this.displayFormat = this.getDisplayFormat(cldrLocaleDateFormat);
    this.delimiters = this.extractDelimiters(cldrLocaleDateFormat) ?? this.delimiters;
  }

  /**
   * The format as placeholder text, e.g. "MM/DD/YYYY" for en-US or "DD.MM.YYYY" for bg.
   */
  get placeholder(): string {
    const format: [string, string, string] = this.displayFormat.format;
    return format[0] + this.delimiters[0] + format[1] + this.delimiters[1] + format[2];
  }

  /**
   * Formats a date as the date inputs show it, e.g. "02/01/2015" for en-US.
   * Returns an empty string for `null`, `undefined` or an invalid date.
   */
  format(date: Date | null | undefined): string {
    if (date) {
      if (isNaN(date.getTime())) {
        return '';
      }
      const dateNo: number = date.getDate();
      const monthNo: number = date.getMonth() + 1;
      const dateStr: string = dateNo > 9 ? dateNo.toString() : '0' + dateNo;
      const monthStr: string = monthNo > 9 ? monthNo.toString() : '0' + monthNo;
      if (this.displayFormat === LITTLE_ENDIAN) {
        return dateStr + this.delimiters[0] + monthStr + this.delimiters[1] + date.getFullYear();
      } else if (this.displayFormat === MIDDLE_ENDIAN) {
        return monthStr + this.delimiters[0] + dateStr + this.delimiters[1] + date.getFullYear();
      } else {
        return date.getFullYear() + this.delimiters[0] + monthStr + this.delimiters[1] + dateStr;
      }
    }
    return '';
  }

  /**
   * Parses text typed in the locale's format into a `Date` at local midnight. Any non-digit characters
   * delimit the parts and two-digit years are expanded. Returns `null` when the text is not a day that exists.
   * Minimum and maximum dates are not checked.
   */
  parse(text: string): Date | null {
    if (!text || typeof text !== 'string') {
      return null;
    }
    const dateParts: string[] = text.match(USER_INPUT_REGEX);
    if (!dateParts || dateParts.length !== 3) {
      return null;
    }
    const [firstPart, secondPart, thirdPart] = dateParts;
    if (this.displayFormat === LITTLE_ENDIAN) {
      // secondPart is month && firstPart is date
      return this.validateAndGetDate(thirdPart, secondPart, firstPart);
    } else if (this.displayFormat === MIDDLE_ENDIAN) {
      // firstPart is month && secondPart is date
      return this.validateAndGetDate(thirdPart, firstPart, secondPart);
    } else {
      // secondPart is month && thirdPart is date
      return this.validateAndGetDate(firstPart, secondPart, thirdPart);
    }
  }

  private getDisplayFormat(cldrLocaleDateFormat: string): InputDateDisplayFormat {
    const format: string = cldrLocaleDateFormat.toLocaleLowerCase();
    if (LITTLE_ENDIAN_REGEX.test(format)) {
      return LITTLE_ENDIAN;
    } else if (MIDDLE_ENDIAN_REGEX.test(format)) {
      return MIDDLE_ENDIAN;
    }
    // everything else is set to BIG-ENDIAN FORMAT
    return BIG_ENDIAN;
  }

  private extractDelimiters(cldrLocaleDateFormat: string): [string, string] | null {
    if (cldrLocaleDateFormat) {
      // Sanitize Date Format. Remove RTL characters.
      // FIXME: When we support RTL, remove this and handle it correctly.
      const localeFormat: string = cldrLocaleDateFormat.replace(RTL_REGEX, '');
      const delimiters: string[] = localeFormat.split(DELIMITER_REGEX);

      // NOTE: The split from the CLDR date format should always result
      // in an arary with 4 elements. The 1st and the 2nd values are the delimiters
      // we will use in order.
      // Eg: "dd/MM/y".split(/d+|m+|y+/i) results in ["", "/", "/", ""]
      if (delimiters && delimiters.length === 4) {
        return [delimiters[1], delimiters[2]];
      }
      console.error('Unexpected date format received. Delimiters extracted: ', delimiters);
    }
    return null;
  }

  /**
   * Checks if the month entered by the user is valid or not.
   * Note: Month is 0 based.
   */
  private isValidMonth(month: number): boolean {
    return month > -1 && month < 12;
  }

  /**
   * Checks if the date is valid depending on the year and month provided.
   */
  private isValidDate(year: number, month: number, date: number): boolean {
    return date > 0 && date <= getNumberOfDaysInTheMonth(year, month);
  }

  /**
   * Validates the parameters provided and returns the date.
   * If the parameters are not valid then return null.
   * NOTE: (Month here is 1 based since the user has provided that as an input)
   */
  private validateAndGetDate(year: string, month: string, date: string): Date | null {
    const y: number = +year;
    const m: number = +month - 1; // month is 0 based
    const d: number = +date;
    if (!this.isValidMonth(m) || !this.isValidDate(y, m, d)) {
      return null;
    }
    const result: number = parseToFourDigitYear(y);
    return result !== -1 ? new Date(result, m, d) : null;
  }
}
