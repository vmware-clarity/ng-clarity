import * as i5$1 from '@angular/common';
import { getLocaleDayNames, FormStyle, TranslationWidth, getLocaleMonthNames, getLocaleFirstDayOfWeek, getLocaleDateFormat, FormatWidth, isPlatformBrowser, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Injectable, LOCALE_ID, Inject, DOCUMENT, PLATFORM_ID, HostListener, Component, EventEmitter, Input, Output, ViewChild, Optional, forwardRef, HostBinding, Self, Directive, NgModule } from '@angular/core';
import * as i7 from '@clr/angular/forms/common';
import { ClrAbstractContainer, ControlIdService, ControlClassService, FormsFocusService, NgControlService, WrappedFormControl, ClrCommonFormsModule } from '@clr/angular/forms/common';
import * as i4 from '@clr/angular/utils';
import { DATEPICKER_ENABLE_BREAKPOINT, Keys, isBooleanAttributeSet, CdkTrapFocusModule, ClrHostWrappingModule, ClrConditionalModule } from '@clr/angular/utils';
import { first, filter, startWith } from 'rxjs/operators';
import * as i1 from '@clr/angular/popover/common';
import { ClrPopoverPosition, ClrPopoverType, DROPDOWN_POSITIONS, ClrPopoverHostDirective, ÇlrClrPopoverModuleNext as _lrClrPopoverModuleNext } from '@clr/angular/popover/common';
import { Subject, tap } from 'rxjs';
import * as i5 from '@clr/angular/icon';
import { ClarityIcons, exclamationCircleIcon, checkCircleIcon, angleIcon, eventIcon, calendarIcon, ClrIcon } from '@clr/angular/icon';
import * as i6 from '@clr/angular/layout/vertical-nav';
import { ClrVerticalNavModule } from '@clr/angular/layout/vertical-nav';
import * as i1$1 from '@angular/forms';
import { NG_VALIDATORS } from '@angular/forms';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DateFormControlService {
    constructor() {
        this._touchedChange = new Subject();
        this._dirtyChange = new Subject();
    }
    get touchedChange() {
        return this._touchedChange.asObservable();
    }
    get dirtyChange() {
        return this._dirtyChange.asObservable();
    }
    markAsTouched() {
        this._touchedChange.next();
    }
    markAsDirty() {
        this._dirtyChange.next();
    }
    // friendly wrapper
    setDisabled(state) {
        this.disabled = state;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DateFormControlService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DateFormControlService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DateFormControlService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DayModel {
    constructor(year, month, date) {
        this.year = year;
        this.month = month;
        this.date = date;
    }
    /**
     * Checks if the passed CalendarDate is equal to itself.
     */
    isEqual(day) {
        if (day) {
            return this.year === day.year && this.month === day.month && this.date === day.date;
        }
        return false;
    }
    toDate() {
        return new Date(this.year, this.month, this.date);
    }
    /**
     * Returns a new DayModel which is incremented based on the value passed.
     */
    incrementBy(value) {
        // Creating new Javascript Date object to increment because
        // it will automatically take care of switching to next or previous
        // months & years without we having to worry about it.
        const date = new Date(this.year, this.month, this.date + value);
        return new DayModel(date.getFullYear(), date.getMonth(), date.getDate());
    }
    /**
     * Clones the current day model.
     */
    clone() {
        return new DayModel(this.year, this.month, this.date);
    }
    toComparisonString() {
        return `${this.year}${this.pad(this.month)}${this.pad(this.date)}`;
    }
    toDateString() {
        return this.toDate().toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    }
    /**
     * Compares the dates and returns boolean value based on the value passed
     */
    isBefore(day, dayInclusive = false) {
        return dayInclusive
            ? this.toDate().getTime() <= day?.toDate().getTime()
            : this.toDate().getTime() < day?.toDate().getTime();
    }
    /**
     * Compares the dates and returns boolean value based on the value passed
     */
    isAfter(day, dayInclusive = false) {
        return dayInclusive
            ? this.toDate().getTime() >= day?.toDate().getTime()
            : this.toDate().getTime() > day?.toDate().getTime();
    }
    pad(num) {
        return num < 10 ? `0${num}` : `${num}`;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * This is the en-001 short locale date format. Setting as default.
 */
const DEFAULT_LOCALE_FORMAT = 'dd/MM/y';
// https://en.wikipedia.org/wiki/Date_format_by_country
const LITTLE_ENDIAN_REGEX = /d+.+m+.+y+/i;
const MIDDLE_ENDIAN_REGEX = /m+.+d+.+y+/i;
// No need for BIG_ENDIAN_REGEX because anything that doesn't satisfy the above 2
// is automatically BIG_ENDIAN
const DELIMITER_REGEX = /d+|m+|y+/i;
const USER_INPUT_REGEX = /\d+/g;
const MOBILE_USERAGENT_REGEX = /Mobi/i;
const RTL_REGEX = /\u200f/g;
const YEAR = 'YYYY';
const MONTH = 'MM';
const DATE = 'DD';
const LITTLE_ENDIAN = {
    name: 'LITTLE_ENDIAN',
    format: [DATE, MONTH, YEAR],
};
const MIDDLE_ENDIAN = {
    name: 'MIDDLE_ENDIAN',
    format: [MONTH, DATE, YEAR],
};
const BIG_ENDIAN = {
    name: 'BIG_ENDIAN',
    format: [YEAR, MONTH, DATE],
};
const NO_OF_DAYS_IN_A_WEEK = 7;
const NO_OF_ROWS_IN_CALENDAR_VIEW = 6;
const TOTAL_DAYS_IN_DAYS_VIEW = NO_OF_DAYS_IN_A_WEEK * NO_OF_ROWS_IN_CALENDAR_VIEW;

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Returns the number of days in a month.
 */
function getNumberOfDaysInTheMonth(year, month) {
    // If we go to the next month, but use a day of 0, it returns the last day from the previous month
    return new Date(year, month + 1, 0).getDate();
}
/**
 * Returns the day for the corresponding date where 0 represents Sunday.
 */
function getDay(year, month, date) {
    return new Date(year, month, date).getDay();
}
/**
 * Takes in a year and if it is a 2 digit year, returns the corresponding 4 digit year.
 * Window of 80 years before and 20 years after the present year.
 * Credit: https://github.com/globalizejs/globalize/blob/e1b31cd6a4f1cff75b185b68b7a32220aac5196f/src/date/parse.js
 */
function parseToFourDigitYear(year) {
    if (year > 9999 || (year > 100 && year < 999) || year < 10) {
        return -1;
    }
    if (year > 999) {
        return year;
    }
    const currYear = new Date().getFullYear();
    const century = Math.floor(currYear / 100) * 100;
    let result = year + century;
    if (result > currYear + 20) {
        result = result - 100;
    }
    return result;
}
function datesAreEqual(date1, date2) {
    if (date1 instanceof Date && date2 instanceof Date) {
        return (date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate());
    }
    else {
        return false;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * This service extracts the Angular CLDR data needed by the datepicker.
 */
class LocaleHelperService {
    constructor(locale) {
        this.locale = locale;
        this._firstDayOfWeek = 0;
        this.initializeLocaleData();
    }
    get firstDayOfWeek() {
        return this._firstDayOfWeek;
    }
    get localeDays() {
        return this._localeDays;
    }
    // leave for backward compatibility
    get localeDaysNarrow() {
        return this._localeDays.map(day => day.narrow);
    }
    get localeMonthsAbbreviated() {
        return this._localeMonthsAbbreviated;
    }
    get localeMonthsWide() {
        return this._localeMonthsWide;
    }
    get localeDateFormat() {
        return this._localeDateFormat;
    }
    /**
     * Initializes the locale data.
     */
    initializeLocaleData() {
        // Order in which these functions is called is very important.
        this.initializeFirstDayOfWeek();
        this.initializeLocaleDateFormat();
        this.initializeLocaleMonthsAbbreviated();
        this.initializeLocaleMonthsWide();
        this.initializeLocaleDays();
    }
    /**
     * Initialize day names based on the locale.
     * eg: [{day: Sunday, narrow: S}, {day: Monday, narrow: M}...] for en-US.
     */
    initializeLocaleDays() {
        // Get locale day names starting with Sunday
        const tempArr = [];
        const tempWideArr = getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Wide).slice();
        const tempNarrowArr = getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Narrow).slice();
        // Get first day of the week based on the locale
        const firstDayOfWeek = this.firstDayOfWeek;
        for (let i = 0; i < 7; i++) {
            tempArr.push({ day: tempWideArr[i], narrow: tempNarrowArr[i] });
        }
        // Rearrange the tempArr to start with the first day of the week based on the locale.
        if (firstDayOfWeek > 0) {
            const prevDays = tempArr.splice(0, firstDayOfWeek);
            tempArr.push(...prevDays);
        }
        this._localeDays = tempArr;
    }
    /**
     * Initializes the array of month names in the TranslationWidth.Abbreviated format.
     * e.g. `[Jan, Feb, ...]` for en-US
     */
    initializeLocaleMonthsAbbreviated() {
        this._localeMonthsAbbreviated = getLocaleMonthNames(this.locale, FormStyle.Standalone, TranslationWidth.Abbreviated).slice();
    }
    /**
     * Initializes the array of month names in the TranslationWidth.Wide format.
     * e.g. `[January, February, ...]` for en-US
     */
    initializeLocaleMonthsWide() {
        this._localeMonthsWide = getLocaleMonthNames(this.locale, FormStyle.Standalone, TranslationWidth.Wide).slice();
    }
    /**
     * Initializes the first day of the week based on the locale.
     */
    initializeFirstDayOfWeek() {
        this._firstDayOfWeek = getLocaleFirstDayOfWeek(this.locale);
    }
    initializeLocaleDateFormat() {
        this._localeDateFormat = getLocaleDateFormat(this.locale, FormatWidth.Short);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: LocaleHelperService, deps: [{ token: LOCALE_ID }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: LocaleHelperService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: LocaleHelperService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DateIOService {
    constructor(localeHelperService) {
        /**
         * This is the default range. It approximates the beginning of time to the end of time.
         * The disabled dates are the dates that are not allowed to be selected.
         * The min date is the earliest date that can be selected.
         * The max date is the latest date that can be selected.
         * Unless a minDate or maxDate is set with the native HTML5 api the range is all dates
         */
        this.disabledDates = {
            minDate: new DayModel(0, 0, 1),
            maxDate: new DayModel(9999, 11, 31),
        };
        this.cldrLocaleDateFormat = DEFAULT_LOCALE_FORMAT;
        this.minDateChange = new Subject();
        this.maxDateChange = new Subject();
        this.localeDisplayFormat = LITTLE_ENDIAN;
        this.delimiters = ['/', '/'];
        this.cldrLocaleDateFormat = localeHelperService.localeDateFormat;
        this.initializeLocaleDisplayFormat();
    }
    get placeholderText() {
        const format = this.localeDisplayFormat.format;
        return format[0] + this.delimiters[0] + format[1] + this.delimiters[1] + format[2];
    }
    setMinDate(date) {
        // NOTE: I'm expecting consumers to pass one of four things here:
        //       A proper date string(2019-11-11), null, undefined or empty string ('')
        if (!date) {
            // attribute binding was removed, reset back to the beginning of time
            this.disabledDates.minDate = new DayModel(0, 0, 1);
        }
        else {
            const [year, month, day] = date.split('-').map(n => parseInt(n, 10));
            this.disabledDates.minDate = new DayModel(year, month - 1, day);
        }
        this.minDateChange.next(this.disabledDates.minDate);
    }
    setMaxDate(date) {
        // NOTE: I'm expecting consumers to pass one of four things here:
        //       A proper date string(2019-11-11), null, undefined or empty string ('')
        if (!date) {
            // attribute binding was removed, reset forward to the end of time
            this.disabledDates.maxDate = new DayModel(9999, 11, 31);
        }
        else {
            const [year, month, day] = date.split('-').map(n => parseInt(n, 10));
            this.disabledDates.maxDate = new DayModel(year, month - 1, day);
        }
        this.maxDateChange.next(this.disabledDates.maxDate);
    }
    setRangeOptions(rangeOptions) {
        const validatedRangeOption = this.validateDateRangeOptions(rangeOptions);
        this.dateRangeOptions = validatedRangeOption || [];
    }
    getRangeOptions() {
        return this.dateRangeOptions;
    }
    toLocaleDisplayFormatString(date) {
        if (date) {
            if (isNaN(date.getTime())) {
                return '';
            }
            const dateNo = date.getDate();
            const monthNo = date.getMonth() + 1;
            const dateStr = dateNo > 9 ? dateNo.toString() : '0' + dateNo;
            const monthStr = monthNo > 9 ? monthNo.toString() : '0' + monthNo;
            if (this.localeDisplayFormat === LITTLE_ENDIAN) {
                return dateStr + this.delimiters[0] + monthStr + this.delimiters[1] + date.getFullYear();
            }
            else if (this.localeDisplayFormat === MIDDLE_ENDIAN) {
                return monthStr + this.delimiters[0] + dateStr + this.delimiters[1] + date.getFullYear();
            }
            else {
                return date.getFullYear() + this.delimiters[0] + monthStr + this.delimiters[1] + dateStr;
            }
        }
        return '';
    }
    getDateValueFromDateString(date) {
        if (!date || typeof date !== 'string') {
            return null;
        }
        const dateParts = date.match(USER_INPUT_REGEX);
        if (!dateParts || dateParts.length !== 3) {
            return null;
        }
        const [firstPart, secondPart, thirdPart] = dateParts;
        if (this.localeDisplayFormat === LITTLE_ENDIAN) {
            // secondPart is month && firstPart is date
            return this.validateAndGetDate(thirdPart, secondPart, firstPart);
        }
        else if (this.localeDisplayFormat === MIDDLE_ENDIAN) {
            // firstPart is month && secondPart is date
            return this.validateAndGetDate(thirdPart, firstPart, secondPart);
        }
        else {
            // secondPart is month && thirdPart is date
            return this.validateAndGetDate(firstPart, secondPart, thirdPart);
        }
    }
    validateDateRangeOptions(rangeOptions) {
        const validOptions = [];
        rangeOptions?.forEach((rangeOption) => {
            if (rangeOption?.value?.length !== 2 ||
                Object.prototype.toString.call(rangeOption?.value[0]) !== '[object Date]' ||
                Object.prototype.toString.call(rangeOption?.value[1]) !== '[object Date]') {
                return;
            }
            validOptions.push(rangeOption);
        });
        return validOptions;
    }
    initializeLocaleDisplayFormat() {
        const format = this.cldrLocaleDateFormat.toLocaleLowerCase();
        if (LITTLE_ENDIAN_REGEX.test(format)) {
            this.localeDisplayFormat = LITTLE_ENDIAN;
        }
        else if (MIDDLE_ENDIAN_REGEX.test(format)) {
            this.localeDisplayFormat = MIDDLE_ENDIAN;
        }
        else {
            // everything else is set to BIG-ENDIAN FORMAT
            this.localeDisplayFormat = BIG_ENDIAN;
        }
        this.extractDelimiters();
    }
    extractDelimiters() {
        if (this.cldrLocaleDateFormat) {
            // Sanitize Date Format. Remove RTL characters.
            // FIXME: When we support RTL, remove this and handle it correctly.
            const localeFormat = this.cldrLocaleDateFormat.replace(RTL_REGEX, '');
            const delimiters = localeFormat.split(DELIMITER_REGEX);
            // NOTE: The split from the CLDR date format should always result
            // in an arary with 4 elements. The 1st and the 2nd values are the delimiters
            // we will use in order.
            // Eg: "dd/MM/y".split(/d+|m+|y+/i) results in ["", "/", "/", ""]
            if (delimiters && delimiters.length === 4) {
                this.delimiters = [delimiters[1], delimiters[2]];
            }
            else {
                console.error('Unexpected date format received. Delimiters extracted: ', delimiters);
            }
        }
    }
    /**
     * Checks if the month entered by the user is valid or not.
     * Note: Month is 0 based.
     */
    isValidMonth(month) {
        return month > -1 && month < 12;
    }
    /**
     * Checks if the date is valid depending on the year and month provided.
     */
    isValidDate(year, month, date) {
        return date > 0 && date <= getNumberOfDaysInTheMonth(year, month);
    }
    /**
     * Validates the parameters provided and returns the date.
     * If the parameters are not
     * valid then return null.
     * NOTE: (Month here is 1 based since the user has provided that as an input)
     */
    validateAndGetDate(year, month, date) {
        // I don't know whats wrong with the TS compiler. It throws an error if I write
        // the below if statement. The error is:
        // Operator '!==' cannot be applied to types '2' and '4'
        // More info here: https://github.com/Microsoft/TypeScript/issues/12794#issuecomment-270342936
        /*
            if (year.length !== 2 || year.length !== 4) {
                return null;
            }
            */
        // Instead I have to write the logic like this x-(
        const y = +year;
        const m = +month - 1; // month is 0 based
        const d = +date;
        if (!this.isValidMonth(m) || !this.isValidDate(y, m, d)) {
            return null;
        }
        const result = parseToFourDigitYear(y);
        return result !== -1 ? new Date(result, m, d) : null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DateIOService, deps: [{ token: LocaleHelperService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DateIOService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DateIOService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: LocaleHelperService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class CalendarModel {
    constructor(year, month) {
        this.year = year;
        this.month = month;
        this.initializeDaysInCalendar();
    }
    /**
     * Checks if the calendar passed is equal to the current calendar.
     */
    isEqual(calendar) {
        if (calendar) {
            return this.year === calendar.year && this.month === calendar.month;
        }
        return false;
    }
    /**
     * Checks if a DayModel is in the Calendar
     */
    isDayInCalendar(day) {
        if (day) {
            return this.year === day.year && this.month === day.month;
        }
        return false;
    }
    /**
     * Returns CalendarModel of the previous month.
     */
    previousMonth() {
        if (this.month === 0) {
            return new CalendarModel(this.year - 1, 11);
        }
        else {
            return new CalendarModel(this.year, this.month - 1);
        }
    }
    /**
     * Returns CalendarModel of the next month.
     */
    nextMonth() {
        if (this.month === 11) {
            return new CalendarModel(this.year + 1, 0);
        }
        else {
            return new CalendarModel(this.year, this.month + 1);
        }
    }
    /**
     * Returns CalendarModel of the previous year.
     */
    previousYear() {
        return new CalendarModel(this.year - 1, this.month);
    }
    /**
     * Returns CalendarModel of the next year.
     */
    nextYear() {
        return new CalendarModel(this.year + 1, this.month);
    }
    /**
     * Populates the days array with the DayModels in the current Calendar.
     */
    initializeDaysInCalendar() {
        const noOfDaysInCalendar = getNumberOfDaysInTheMonth(this.year, this.month);
        this.days = Array(noOfDaysInCalendar)
            .fill(null)
            .map((_date, index) => {
            return new DayModel(this.year, this.month, index + 1);
        });
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * This service is responsible for:
 * 1. Initializing the displayed calendar.
 * 2. Moving the calendar to the next, previous or current months
 * 3. Managing the focused and selected day models.
 */
class DateNavigationService {
    constructor() {
        this.isRangePicker = false;
        this.hasActionButtons = false;
        this._todaysFullDate = new Date();
        this._selectedDayChange = new Subject();
        this._selectedEndDayChange = new Subject();
        this._displayedCalendarChange = new Subject();
        this._focusOnCalendarChange = new Subject();
        this._refreshCalendarView = new Subject();
        this._focusedDayChange = new Subject();
    }
    get today() {
        return this._today;
    }
    get displayedCalendar() {
        return this._displayedCalendar;
    }
    get selectedDayChange() {
        return this._selectedDayChange.asObservable();
    }
    get selectedEndDayChange() {
        return this._selectedEndDayChange.asObservable();
    }
    /**
     * This observable lets the subscriber know that the displayed calendar has changed.
     */
    get displayedCalendarChange() {
        return this._displayedCalendarChange.asObservable();
    }
    /**
     * This observable lets the subscriber know that the focus should be applied on the calendar.
     */
    get focusOnCalendarChange() {
        return this._focusOnCalendarChange.asObservable();
    }
    /**
     * This observable lets the subscriber know that the focused day in the displayed calendar has changed.
     */
    get focusedDayChange() {
        return this._focusedDayChange.asObservable().pipe(tap((day) => (this.focusedDay = day)));
    }
    /**
     * This observable lets the subscriber know that the displayed calendar has changed.
     */
    get refreshCalendarView() {
        return this._refreshCalendarView.asObservable();
    }
    /**
     * Notifies that the selected day has changed so that the date can be emitted to the user.
     */
    notifySelectedDayChanged(dayObject, { emitEvent } = { emitEvent: true }) {
        if (this.isRangePicker) {
            const { startDate, endDate } = dayObject;
            if (startDate && endDate) {
                this.setSelectedDay(startDate, emitEvent);
                this.setSelectedEndDay(endDate, emitEvent);
            }
            else {
                if (endDate !== null) {
                    this.setSelectedEndDay(endDate, emitEvent);
                }
                if (startDate !== null) {
                    this.setSelectedDay(startDate, emitEvent);
                }
            }
        }
        else {
            const day = dayObject;
            this.setSelectedDay(day, emitEvent);
        }
        this._refreshCalendarView.next();
    }
    /**
     * Initializes the calendar based on the selected day.
     */
    initializeCalendar() {
        this.focusedDay = null; // Can be removed later on the store focus
        this.initializeTodaysDate();
        if (this.selectedDay) {
            this._displayedCalendar = new CalendarModel(this.selectedDay.year, this.selectedDay.month);
        }
        else {
            this._displayedCalendar = new CalendarModel(this.today.year, this.today.month);
        }
    }
    changeMonth(month) {
        this.setDisplayedCalendar(new CalendarModel(this._displayedCalendar.year, month));
    }
    changeYear(year) {
        this.setDisplayedCalendar(new CalendarModel(year, this._displayedCalendar.month));
    }
    /**
     * Moves the displayed calendar to the next month.
     */
    moveToNextMonth() {
        this.setDisplayedCalendar(this._displayedCalendar.nextMonth());
    }
    /**
     * Moves the displayed calendar to the previous month.
     */
    moveToPreviousMonth() {
        this.setDisplayedCalendar(this._displayedCalendar.previousMonth());
    }
    /**
     * Moves the displayed calendar to the next year.
     */
    moveToNextYear() {
        this.setDisplayedCalendar(this._displayedCalendar.nextYear());
    }
    /**
     * Moves the displayed calendar to the previous year.
     */
    moveToPreviousYear() {
        this.setDisplayedCalendar(this._displayedCalendar.previousYear());
    }
    /**
     * Moves the displayed calendar to the current month and year.
     */
    moveToCurrentMonth() {
        if (!this.displayedCalendar.isDayInCalendar(this.today)) {
            this.setDisplayedCalendar(new CalendarModel(this.today.year, this.today.month));
        }
        this._focusOnCalendarChange.next();
    }
    moveToSpecificMonth(day) {
        if (!this.displayedCalendar.isDayInCalendar(day)) {
            this.setDisplayedCalendar(new CalendarModel(day.year, day.month));
        }
    }
    incrementFocusDay(value) {
        this.hoveredDay = this.focusedDay = this.focusedDay.incrementBy(value);
        if (this._displayedCalendar.isDayInCalendar(this.focusedDay)) {
            this._focusedDayChange.next(this.focusedDay);
        }
        else {
            this.setDisplayedCalendar(new CalendarModel(this.focusedDay.year, this.focusedDay.month));
        }
        this._focusOnCalendarChange.next();
    }
    resetSelectedDay() {
        this.selectedDay = this.persistedDate;
        this.selectedEndDay = this.persistedEndDate;
    }
    convertDateToDayModel(date) {
        return new DayModel(date.getFullYear(), date.getMonth(), date.getDate());
    }
    setSelectedDay(dayModel, emitEvent) {
        this.selectedDay = dayModel;
        if (emitEvent) {
            this._selectedDayChange.next(dayModel);
        }
    }
    setSelectedEndDay(dayModel, emitEvent) {
        this.selectedEndDay = dayModel;
        if (emitEvent) {
            this._selectedEndDayChange.next(dayModel);
        }
    }
    // not a setter because i want this to remain private
    setDisplayedCalendar(value) {
        if (!this._displayedCalendar.isEqual(value)) {
            this._displayedCalendar = value;
            this._displayedCalendarChange.next();
        }
    }
    initializeTodaysDate() {
        this._todaysFullDate = new Date();
        this._today = new DayModel(this._todaysFullDate.getFullYear(), this._todaysFullDate.getMonth(), this._todaysFullDate.getDate());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DateNavigationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DateNavigationService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DateNavigationService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatepickerEnabledService {
    constructor(_document) {
        this._document = _document;
        this._isUserAgentMobile = false;
        if (_document) {
            this._isUserAgentMobile = MOBILE_USERAGENT_REGEX.test(_document.defaultView.navigator.userAgent);
            this._innerWidth = _document.defaultView.innerWidth;
        }
    }
    /**
     * Returns if the calendar should be active or not.
     * If the user agent is mobile and the screen width is less than DATEPICKER_ACTIVE_BREAKPOINT
     * then the calendar is inactive.
     */
    get isEnabled() {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
        // What they recommend is:
        //"In summary, we recommend looking for the string 'Mobi'
        // anywhere in the User Agent to detect a mobile device."
        if (this._document) {
            if (this._innerWidth < DATEPICKER_ENABLE_BREAKPOINT && this._isUserAgentMobile) {
                return false;
            }
        }
        return true;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatepickerEnabledService, deps: [{ token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatepickerEnabledService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatepickerEnabledService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * This service manages which view is visible in the datepicker popover.
 */
class ViewManagerService {
    constructor() {
        this.position = ClrPopoverPosition.BOTTOM_LEFT;
        this._currentView = "DAYVIEW" /* DatepickerViewEnum.DAYVIEW */;
    }
    get isDayView() {
        return this._currentView === "DAYVIEW" /* DatepickerViewEnum.DAYVIEW */;
    }
    get isYearView() {
        return this._currentView === "YEARVIEW" /* DatepickerViewEnum.YEARVIEW */;
    }
    get isMonthView() {
        return this._currentView === "MONTHVIEW" /* DatepickerViewEnum.MONTHVIEW */;
    }
    changeToMonthView() {
        this._currentView = "MONTHVIEW" /* DatepickerViewEnum.MONTHVIEW */;
    }
    changeToYearView() {
        this._currentView = "YEARVIEW" /* DatepickerViewEnum.YEARVIEW */;
    }
    changeToDayView() {
        this._currentView = "DAYVIEW" /* DatepickerViewEnum.DAYVIEW */;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ViewManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ViewManagerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ViewManagerService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * This service focuses the day that is focusable in the calendar.
 */
class DatepickerFocusService {
    constructor(_ngZone, platformId) {
        this._ngZone = _ngZone;
        this.platformId = platformId;
    }
    focusCell(elRef) {
        this._ngZone.runOutsideAngular(() => {
            this.ngZoneIsStableInBrowser().subscribe(() => {
                const focusEl = elRef.nativeElement.querySelector('[tabindex="0"]');
                if (focusEl) {
                    focusEl.focus();
                }
            });
        });
    }
    focusInput(element) {
        this._ngZone.runOutsideAngular(() => this.ngZoneIsStableInBrowser().subscribe(() => element.focus()));
    }
    elementIsFocused(element) {
        return isPlatformBrowser(this.platformId) && document.activeElement === element;
    }
    ngZoneIsStableInBrowser() {
        // Credit: Material: https://github.com/angular/material2/blob/master/src/lib/datepicker/calendar.ts
        return this._ngZone.onStable.asObservable().pipe(first(), filter(() => isPlatformBrowser(this.platformId)));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatepickerFocusService, deps: [{ token: i0.NgZone }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatepickerFocusService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatepickerFocusService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrMonthpicker {
    constructor(_localeHelperService, _dateNavigationService, _datepickerFocusService, _elRef, _viewManagerService, commonStrings) {
        this._localeHelperService = _localeHelperService;
        this._dateNavigationService = _dateNavigationService;
        this._datepickerFocusService = _datepickerFocusService;
        this._elRef = _elRef;
        this._viewManagerService = _viewManagerService;
        this.commonStrings = commonStrings;
        this._focusedMonthIndex = this.calendarMonthIndex;
    }
    /**
     * Gets the months array which is used to rendered the monthpicker view.
     * Months are in the TranslationWidth.Wide format.
     */
    get monthNames() {
        return this._localeHelperService.localeMonthsWide;
    }
    /**
     * Gets the month value of the Calendar.
     */
    get calendarMonthIndex() {
        return this._dateNavigationService.displayedCalendar.month;
    }
    /**
     * Gets the year which the user is currently on.
     */
    get calendarEndMonthIndex() {
        return this._dateNavigationService.selectedEndDay?.month;
    }
    get yearAttrString() {
        return this.commonStrings.parse(this.commonStrings.keys.datepickerSelectYearText, {
            CALENDAR_YEAR: this.calendarYear.toString(),
        });
    }
    /**
     * Returns the year value of the calendar.
     */
    get calendarYear() {
        return this._dateNavigationService.displayedCalendar.year;
    }
    get currentCalendarYear() {
        return new Date().getFullYear();
    }
    get currentCalendarMonth() {
        return new Date().getMonth();
    }
    getIsRangeStartMonth(monthIndex) {
        return (this._dateNavigationService.isRangePicker &&
            this.calendarYear === this._dateNavigationService.selectedDay?.year &&
            monthIndex === this._dateNavigationService.selectedDay?.month);
    }
    getIsRangeEndMonth(monthIndex) {
        return (this._dateNavigationService.isRangePicker &&
            this.calendarYear === this._dateNavigationService.selectedEndDay?.year &&
            monthIndex === this._dateNavigationService.selectedEndDay?.month);
    }
    /**
     * Calls the ViewManagerService to change to the yearpicker view.
     */
    changeToYearView() {
        this._viewManagerService.changeToYearView();
    }
    /**
     * Focuses on the current calendar month when the View is initialized.
     */
    ngAfterViewInit() {
        this._datepickerFocusService.focusCell(this._elRef);
    }
    /**
     * Handles the Keyboard arrow navigation for the monthpicker.
     */
    onKeyDown(event) {
        // NOTE: Didn't move this to the date navigation service because
        // the logic is fairly simple and it didn't make sense for me
        // to create extra observables just to move this logic to the service.
        if (event) {
            const key = event.key;
            if (key === Keys.ArrowUp && this._focusedMonthIndex > 1) {
                event.preventDefault();
                this._focusedMonthIndex -= 2;
                this._datepickerFocusService.focusCell(this._elRef);
            }
            else if (key === Keys.ArrowDown && this._focusedMonthIndex < 10) {
                event.preventDefault();
                this._focusedMonthIndex += 2;
                this._datepickerFocusService.focusCell(this._elRef);
            }
            else if (key === Keys.ArrowRight && this._focusedMonthIndex < 11) {
                event.preventDefault();
                this._focusedMonthIndex++;
                this._datepickerFocusService.focusCell(this._elRef);
            }
            else if (key === Keys.ArrowLeft && this._focusedMonthIndex > 0) {
                event.preventDefault();
                this._focusedMonthIndex--;
                this._datepickerFocusService.focusCell(this._elRef);
            }
        }
    }
    isSelected(monthIndex) {
        return ((this._dateNavigationService.selectedDay?.year === this.calendarYear &&
            monthIndex === this._dateNavigationService.selectedDay?.month) ||
            (this._dateNavigationService.selectedEndDay?.year === this.calendarYear &&
                monthIndex === this.calendarEndMonthIndex));
    }
    /**
     * Calls the DateNavigationService to update the hovered month value of the calendar
     */
    onHover(monthIndex) {
        this._dateNavigationService.hoveredMonth = monthIndex;
    }
    /**
     * Calls the DateNavigationService to update the month value of the calendar.
     * Also changes the view to the daypicker.
     */
    changeMonth(monthIndex) {
        this._dateNavigationService.changeMonth(monthIndex);
        this._viewManagerService.changeToDayView();
    }
    /**
     * Compares the month passed to the focused month and returns the tab index.
     */
    getTabIndex(monthIndex) {
        return monthIndex === this._focusedMonthIndex ? 0 : -1;
    }
    /**
     * Calls the DateNavigationService to move to the next month.
     */
    nextYear() {
        this._dateNavigationService.moveToNextYear();
    }
    /**
     * Calls the DateNavigationService to move to the previous month.
     */
    previousYear() {
        this._dateNavigationService.moveToPreviousYear();
    }
    /**
     * Calls the DateNavigationService to move to the current month.
     */
    currentYear() {
        this._dateNavigationService.moveToCurrentMonth();
    }
    /**
     * Applicable only to date range picker
     * Compares the month passed is in between the start and end date range
     */
    isInRange(monthIndex) {
        if (!this._dateNavigationService.isRangePicker) {
            return false;
        }
        if (this._dateNavigationService.selectedDay && this._dateNavigationService.selectedEndDay) {
            return ((this.calendarYear === this._dateNavigationService.selectedDay.year &&
                monthIndex > this._dateNavigationService.selectedDay.month &&
                this.calendarYear === this._dateNavigationService.selectedEndDay.year &&
                monthIndex < this._dateNavigationService.selectedEndDay.month) ||
                (this._dateNavigationService.selectedDay.year !== this._dateNavigationService.selectedEndDay.year &&
                    this.calendarYear === this._dateNavigationService.selectedDay.year &&
                    monthIndex > this._dateNavigationService.selectedDay.month) ||
                (this._dateNavigationService.selectedDay.year !== this._dateNavigationService.selectedEndDay.year &&
                    this.calendarYear === this._dateNavigationService.selectedEndDay.year &&
                    monthIndex < this._dateNavigationService.selectedEndDay.month) ||
                (this.calendarYear > this._dateNavigationService.selectedDay.year &&
                    this.calendarYear < this._dateNavigationService.selectedEndDay.year));
        }
        else if (this._dateNavigationService.selectedDay && !this._dateNavigationService.selectedEndDay) {
            return ((this.calendarYear === this._dateNavigationService.selectedDay.year &&
                monthIndex > this._dateNavigationService.selectedDay.month &&
                monthIndex < this._dateNavigationService.hoveredMonth) ||
                (this.calendarYear > this._dateNavigationService.selectedDay.year &&
                    monthIndex < this._dateNavigationService.hoveredMonth));
        }
        else {
            return false;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrMonthpicker, deps: [{ token: LocaleHelperService }, { token: DateNavigationService }, { token: DatepickerFocusService }, { token: i0.ElementRef }, { token: ViewManagerService }, { token: i4.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrMonthpicker, isStandalone: false, selector: "clr-monthpicker", host: { attributes: { "role": "application" }, listeners: { "keydown": "onKeyDown($event)" }, properties: { "class.monthpicker": "true" } }, ngImport: i0, template: `
    <div class="calendar-header in-monthpicker">
      <div class="year-view-switcher">
        <button
          class="calendar-btn yearpicker-trigger"
          type="button"
          (click)="changeToYearView()"
          [attr.aria-label]="yearAttrString"
          [attr.title]="yearAttrString"
        >
          {{ calendarYear }}
        </button>
      </div>
      <div class="calendar-switchers">
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="previousYear()"
          [attr.aria-label]="commonStrings.keys.datepickerPreviousMonth"
        >
          <cds-icon shape="angle" direction="left" [attr.title]="commonStrings.keys.datepickerPreviousMonth"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="currentYear()"
          [attr.aria-label]="commonStrings.keys.datepickerCurrentMonth"
        >
          <cds-icon shape="event" [attr.title]="commonStrings.keys.datepickerCurrentMonth"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="nextYear()"
          [attr.aria-label]="commonStrings.keys.datepickerNextMonth"
        >
          <cds-icon shape="angle" direction="right" [attr.title]="commonStrings.keys.datepickerNextMonth"></cds-icon>
        </button>
      </div>
    </div>
    <div class="months">
      @for (month of monthNames; track month; let monthIndex = $index) {
        <button
          type="button"
          class="calendar-btn month"
          (click)="changeMonth(monthIndex)"
          [class.is-selected]="isSelected(monthIndex)"
          [class.is-start-range]="getIsRangeStartMonth(monthIndex)"
          [class.is-end-range]="getIsRangeEndMonth(monthIndex)"
          [class.in-range]="isInRange(monthIndex)"
          [attr.tabindex]="getTabIndex(monthIndex)"
          [class.is-today]="calendarYear === currentCalendarYear && monthIndex === currentCalendarMonth"
          (mouseenter)="onHover(monthIndex)"
        >
          {{ month }}
        </button>
      }
    </div>
  `, isInline: true, dependencies: [{ kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrMonthpicker, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-monthpicker',
                    template: `
    <div class="calendar-header in-monthpicker">
      <div class="year-view-switcher">
        <button
          class="calendar-btn yearpicker-trigger"
          type="button"
          (click)="changeToYearView()"
          [attr.aria-label]="yearAttrString"
          [attr.title]="yearAttrString"
        >
          {{ calendarYear }}
        </button>
      </div>
      <div class="calendar-switchers">
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="previousYear()"
          [attr.aria-label]="commonStrings.keys.datepickerPreviousMonth"
        >
          <cds-icon shape="angle" direction="left" [attr.title]="commonStrings.keys.datepickerPreviousMonth"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="currentYear()"
          [attr.aria-label]="commonStrings.keys.datepickerCurrentMonth"
        >
          <cds-icon shape="event" [attr.title]="commonStrings.keys.datepickerCurrentMonth"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="nextYear()"
          [attr.aria-label]="commonStrings.keys.datepickerNextMonth"
        >
          <cds-icon shape="angle" direction="right" [attr.title]="commonStrings.keys.datepickerNextMonth"></cds-icon>
        </button>
      </div>
    </div>
    <div class="months">
      @for (month of monthNames; track month; let monthIndex = $index) {
        <button
          type="button"
          class="calendar-btn month"
          (click)="changeMonth(monthIndex)"
          [class.is-selected]="isSelected(monthIndex)"
          [class.is-start-range]="getIsRangeStartMonth(monthIndex)"
          [class.is-end-range]="getIsRangeEndMonth(monthIndex)"
          [class.in-range]="isInRange(monthIndex)"
          [attr.tabindex]="getTabIndex(monthIndex)"
          [class.is-today]="calendarYear === currentCalendarYear && monthIndex === currentCalendarMonth"
          (mouseenter)="onHover(monthIndex)"
        >
          {{ month }}
        </button>
      }
    </div>
  `,
                    host: {
                        '[class.monthpicker]': 'true',
                        role: 'application',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: LocaleHelperService }, { type: DateNavigationService }, { type: DatepickerFocusService }, { type: i0.ElementRef }, { type: ViewManagerService }, { type: i4.ClrCommonStringsService }], propDecorators: { onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const YEARS_TO_DISPLAY = 10;
class YearRangeModel {
    constructor(year) {
        this.year = year;
        this.yearRange = [];
        this.generateYearRange();
    }
    /**
     * Gets the number in the middle of the range.
     */
    get middleYear() {
        return this.yearRange[Math.floor(this.yearRange.length / 2)];
    }
    /**
     * Generates the YearRangeModel for the next decade.
     */
    nextDecade() {
        return new YearRangeModel(this.year + 10);
    }
    /**
     * Generates the YearRangeModel for the previous decade.
     */
    previousDecade() {
        return new YearRangeModel(this.year - 10);
    }
    /**
     * Generates the YearRangeModel for the current decade.
     */
    currentDecade() {
        return new YearRangeModel(new Date().getFullYear());
    }
    /**
     * Checks if the value is in the YearRangeModel.
     */
    inRange(value) {
        return this.yearRange.indexOf(value) > -1;
    }
    /**
     * Generates the year range based on the year parameter.
     * eg: If 2018 is passed the output will be [2010, 2011, ..., 2019]
     */
    generateYearRange() {
        const remainder = this.year % YEARS_TO_DISPLAY;
        const floor = this.year - remainder;
        const ceil = floor + YEARS_TO_DISPLAY;
        this.yearRange = this.generateRange(floor, ceil);
    }
    /**
     * Function which generate a range of numbers from floor to ceil.
     */
    generateRange(floor, ceil) {
        return Array.from({ length: ceil - floor }, (_v, k) => k + floor);
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrYearpicker {
    constructor(_dateNavigationService, _viewManagerService, _datepickerFocusService, _elRef, commonStrings) {
        this._dateNavigationService = _dateNavigationService;
        this._viewManagerService = _viewManagerService;
        this._datepickerFocusService = _datepickerFocusService;
        this._elRef = _elRef;
        this.commonStrings = commonStrings;
        this.yearRangeModel = new YearRangeModel(this.calendarYear);
        this._focusedYear = this.calendarYear;
    }
    get selectedStartYear() {
        return this._dateNavigationService.selectedDay?.year;
    }
    get selectedEndYear() {
        return this._dateNavigationService.selectedEndDay?.year;
    }
    /**
     * Gets the year which the user is currently on.
     */
    get calendarYear() {
        return this._dateNavigationService.displayedCalendar.year;
    }
    isCurrentCalendarYear(year) {
        return year === new Date().getFullYear();
    }
    getIsRangeStartYear(year) {
        return this._dateNavigationService.isRangePicker && year === this._dateNavigationService.selectedDay?.year;
    }
    getIsRangeEndYear(year) {
        return this._dateNavigationService.isRangePicker && year === this._dateNavigationService.selectedEndDay?.year;
    }
    /**
     * Focuses on the current calendar year when the View is initialized.
     */
    ngAfterViewInit() {
        this._datepickerFocusService.focusCell(this._elRef);
    }
    /**
     * Handles the Keyboard arrow navigation for the yearpicker.
     */
    onKeyDown(event) {
        // NOTE: Didn't move this to the date navigation service because
        // the logic is fairly simple and it didn't make sense for me
        // to create extra observables just to move this logic to the service.
        if (event) {
            const key = event.key;
            if (key === Keys.ArrowUp) {
                event.preventDefault();
                this.incrementFocusYearBy(-2);
            }
            else if (key === Keys.ArrowDown) {
                event.preventDefault();
                this.incrementFocusYearBy(2);
            }
            else if (key === Keys.ArrowRight) {
                event.preventDefault();
                this.incrementFocusYearBy(1);
            }
            else if (key === Keys.ArrowLeft) {
                event.preventDefault();
                this.incrementFocusYearBy(-1);
            }
        }
    }
    /**
     * Calls the DateNavigationService to update the year value of the calendar.
     * Also changes the view to the daypicker.
     */
    changeYear(year) {
        this._dateNavigationService.changeYear(year);
        this._viewManagerService.changeToDayView();
    }
    /**
     * Calls the DateNavigationService to update the hovered year value of the calendar
     */
    onHover(year) {
        this._dateNavigationService.hoveredYear = year;
    }
    /**
     * Updates the YearRangeModel to the previous decade.
     */
    previousDecade() {
        this.yearRangeModel = this.yearRangeModel.previousDecade();
        // Year in the yearpicker is not focused because while navigating to a different decade,
        // you want the focus to remain on the decade switcher arrows.
    }
    /**
     * Updates the YearRangeModel to the current decade.
     */
    currentDecade() {
        if (!this.yearRangeModel.inRange(this._dateNavigationService.today.year)) {
            this.yearRangeModel = this.yearRangeModel.currentDecade();
        }
        this._datepickerFocusService.focusCell(this._elRef);
    }
    /**
     * Updates the YearRangeModel to the next decade.
     */
    nextDecade() {
        this.yearRangeModel = this.yearRangeModel.nextDecade();
        // Year in the yearpicker is not focused because while navigating to a different decade,
        // you want the focus to remain on the decade switcher arrows.
    }
    /**
     * Compares the year passed to the focused year and returns the tab index.
     */
    getTabIndex(year) {
        if (!this.yearRangeModel.inRange(this._focusedYear)) {
            if (this.yearRangeModel.inRange(this.calendarYear)) {
                this._focusedYear = this.calendarYear;
            }
            else if (this.yearRangeModel.inRange(this.selectedEndYear)) {
                this._focusedYear = this.selectedEndYear;
            }
            else {
                this._focusedYear = this.yearRangeModel.middleYear;
            }
        }
        return this._focusedYear === year ? 0 : -1;
    }
    /**
     * Applicable only to date range picker
     * Compares the year passed is in between the start and end date range
     */
    isInRange(year) {
        if (!this._dateNavigationService.isRangePicker) {
            return false;
        }
        if (this._dateNavigationService.selectedDay?.year && this.selectedEndYear) {
            return year > this.selectedStartYear && year < this.selectedEndYear;
        }
        else if (this._dateNavigationService.selectedDay?.year && !this.selectedEndYear) {
            return year > this.selectedStartYear && year < this._dateNavigationService.hoveredYear;
        }
        else {
            return false;
        }
    }
    changeToDayView() {
        this._viewManagerService.changeToDayView();
    }
    /**
     * Increments the focus year by the value passed. Updates the YearRangeModel if the
     * new value is not in the current decade.
     */
    incrementFocusYearBy(value) {
        this._focusedYear = this._focusedYear + value;
        if (!this.yearRangeModel.inRange(this._focusedYear)) {
            if (value > 0) {
                this.yearRangeModel = this.yearRangeModel.nextDecade();
            }
            else {
                this.yearRangeModel = this.yearRangeModel.previousDecade();
            }
        }
        this._datepickerFocusService.focusCell(this._elRef);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrYearpicker, deps: [{ token: DateNavigationService }, { token: ViewManagerService }, { token: DatepickerFocusService }, { token: i0.ElementRef }, { token: i4.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrYearpicker, isStandalone: false, selector: "clr-yearpicker", host: { attributes: { "role": "application" }, listeners: { "keydown": "onKeyDown($event)" }, properties: { "class.yearpicker": "true" } }, ngImport: i0, template: `
    <div class="calendar-header">
      <div class="calendar-pickers">
        <button class="calendar-btn yearpicker-trigger year-range" type="button" (click)="changeToDayView()">
          {{ yearRangeModel.yearRange[0] }} - {{ yearRangeModel.yearRange[yearRangeModel.yearRange.length - 1] }}
        </button>
      </div>
      <div class="year-switchers">
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="previousDecade()"
          [attr.aria-label]="commonStrings.keys.datepickerPreviousDecade"
        >
          <cds-icon
            shape="angle"
            direction="left"
            [attr.title]="commonStrings.keys.datepickerPreviousDecade"
          ></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="currentDecade()"
          [attr.aria-label]="commonStrings.keys.datepickerCurrentDecade"
        >
          <cds-icon shape="event" [attr.title]="commonStrings.keys.datepickerCurrentDecade"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="nextDecade()"
          [attr.aria-label]="commonStrings.keys.datepickerNextDecade"
        >
          <cds-icon shape="angle" direction="right" [attr.title]="commonStrings.keys.datepickerNextDecade"></cds-icon>
        </button>
      </div>
    </div>

    <div class="years">
      @for (year of yearRangeModel.yearRange; track year) {
        <button
          type="button"
          class="calendar-btn year"
          [attr.tabindex]="getTabIndex(year)"
          [class.is-selected]="year === selectedStartYear || year === selectedEndYear"
          [class.is-start-range]="getIsRangeStartYear(year)"
          [class.is-end-range]="getIsRangeEndYear(year)"
          [class.in-range]="isInRange(year)"
          [class.is-today]="isCurrentCalendarYear(year)"
          (click)="changeYear(year)"
          (mouseenter)="onHover(year)"
        >
          {{ year }}
        </button>
      }
    </div>
  `, isInline: true, dependencies: [{ kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrYearpicker, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-yearpicker',
                    template: `
    <div class="calendar-header">
      <div class="calendar-pickers">
        <button class="calendar-btn yearpicker-trigger year-range" type="button" (click)="changeToDayView()">
          {{ yearRangeModel.yearRange[0] }} - {{ yearRangeModel.yearRange[yearRangeModel.yearRange.length - 1] }}
        </button>
      </div>
      <div class="year-switchers">
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="previousDecade()"
          [attr.aria-label]="commonStrings.keys.datepickerPreviousDecade"
        >
          <cds-icon
            shape="angle"
            direction="left"
            [attr.title]="commonStrings.keys.datepickerPreviousDecade"
          ></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="currentDecade()"
          [attr.aria-label]="commonStrings.keys.datepickerCurrentDecade"
        >
          <cds-icon shape="event" [attr.title]="commonStrings.keys.datepickerCurrentDecade"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="nextDecade()"
          [attr.aria-label]="commonStrings.keys.datepickerNextDecade"
        >
          <cds-icon shape="angle" direction="right" [attr.title]="commonStrings.keys.datepickerNextDecade"></cds-icon>
        </button>
      </div>
    </div>

    <div class="years">
      @for (year of yearRangeModel.yearRange; track year) {
        <button
          type="button"
          class="calendar-btn year"
          [attr.tabindex]="getTabIndex(year)"
          [class.is-selected]="year === selectedStartYear || year === selectedEndYear"
          [class.is-start-range]="getIsRangeStartYear(year)"
          [class.is-end-range]="getIsRangeEndYear(year)"
          [class.in-range]="isInRange(year)"
          [class.is-today]="isCurrentCalendarYear(year)"
          (click)="changeYear(year)"
          (mouseenter)="onHover(year)"
        >
          {{ year }}
        </button>
      }
    </div>
  `,
                    host: {
                        '[class.yearpicker]': 'true',
                        role: 'application',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: DateNavigationService }, { type: ViewManagerService }, { type: DatepickerFocusService }, { type: i0.ElementRef }, { type: i4.ClrCommonStringsService }], propDecorators: { onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DayViewModel {
    constructor(dayModel, isTodaysDate = false, isExcluded = false, isDisabled = false, isSelected = false, isFocusable = false, isRangeStartDay = false, isRangeEndDay = false) {
        this.dayModel = dayModel;
        this.isTodaysDate = isTodaysDate;
        this.isExcluded = isExcluded;
        this.isDisabled = isDisabled;
        this.isSelected = isSelected;
        this.isFocusable = isFocusable;
        this.isRangeStartDay = isRangeStartDay;
        this.isRangeEndDay = isRangeEndDay;
    }
    /**
     * Gets the tab index based on the isFocusable flag.
     */
    get tabIndex() {
        return this.isFocusable ? 0 : -1;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class CalendarViewModel {
    constructor(calendar, selectedDay, selectedEndDay, focusableDay, today, firstDayOfWeek, excludedDates) {
        this.calendar = calendar;
        this.selectedDay = selectedDay;
        this.selectedEndDay = selectedEndDay;
        this.focusableDay = focusableDay;
        this.today = today;
        this.firstDayOfWeek = firstDayOfWeek;
        this.excludedDates = excludedDates;
        this.currMonthDayViews = [];
        this.initializeCalendarView();
    }
    /**
     * DayViewModel matrix. Size 6x7
     */
    get calendarView() {
        return this._calendarView;
    }
    /**
     * Updates the focusable day in the calendar.
     */
    updateFocusableDay(day) {
        this.setFocusableFlag(this.focusableDay, false);
        this.setFocusableFlag(day, true);
        this.focusableDay = day;
    }
    /**
     * Updates the selected day in the calendar
     */
    updateSelectedDay(day) {
        this.setSelectedDay(this.selectedDay, false);
        this.selectedDay = day;
        this.setSelectedDay(day, true);
    }
    /**
     * Updates the selected end day in the calendar
     */
    updateSelectedEndDay(day) {
        this.setSelectedDay(this.selectedEndDay, false);
        this.selectedEndDay = day;
        this.setSelectedDay(day, true);
    }
    /**
     * Generates a 6x7 matrix of DayViewModel based on the Calendar.
     * The 6x7 matrix is structured according to the first day of the week.
     * 6 rows to accommodate months which might have dates spanning over 6 weeks.
     * 7 columns because there are 7 days in a week :P :D
     */
    initializeCalendarView() {
        // Generate prev and next month calendar models.
        const prevMonthCalendar = this.calendar.previousMonth();
        const nextMonthCalendar = this.calendar.nextMonth();
        // Get no of days from prev and next months.
        const daysFromPrevMonthInCalView = this.numDaysFromPrevMonthInCalView(this.calendar.year, this.calendar.month);
        const daysFromNextMonthInCalView = TOTAL_DAYS_IN_DAYS_VIEW - (this.calendar.days.length + daysFromPrevMonthInCalView);
        // Generate prev, curr and next day view models
        let prevMonthDayViews = [];
        let nextMonthDayViews = [];
        if (daysFromPrevMonthInCalView > 0) {
            prevMonthDayViews = this.generateDayViewModels(prevMonthCalendar.days.slice(-1 * daysFromPrevMonthInCalView), true, false);
        }
        this.currMonthDayViews = this.generateDayViewModels(this.calendar.days, false, true);
        if (daysFromNextMonthInCalView > 0) {
            nextMonthDayViews = this.generateDayViewModels(nextMonthCalendar.days.slice(0, daysFromNextMonthInCalView), true, false);
        }
        // Generate calendar view and initialize flags
        this._calendarView = this.generateCalendarView(prevMonthDayViews, this.currMonthDayViews, nextMonthDayViews);
        this.initializeSelectedDay();
        this.initializeFocusableDay();
    }
    isDateExcluded(date) {
        const { minDate, maxDate } = this.excludedDates;
        const from = minDate.toComparisonString();
        const to = maxDate.toComparisonString();
        const today = date.toComparisonString();
        return !(today >= from && today <= to);
    }
    /**
     * Generates a DayViewModel array based on the DayModel passed
     */
    generateDayViewModels(days, isExcluded, isCurrentCalendar) {
        const dayViews = days.map(day => {
            return new DayViewModel(day, false, isExcluded, this.isDateExcluded(day), false, false);
        });
        if (isCurrentCalendar && this.calendar.isDayInCalendar(this.today)) {
            dayViews[this.today.date - 1].isTodaysDate = true;
        }
        return dayViews;
    }
    /**
     * Gets the first day of the current month to figure out how many dates of previous month
     * are needed to complete the Calendar View based on the first day of the week.
     * eg: Assuming locale en-US, the first day of the week is Sunday,
     * if first day of the current month lands on Wednesday, then
     * (this.getDay function would return 3 since
     * first day of the week is 0), we need the 3 days from the previous month.
     */
    numDaysFromPrevMonthInCalView(currentYear, currentMonth) {
        const firstDayOfCurrMonth = getDay(currentYear, currentMonth, 1);
        if (firstDayOfCurrMonth >= this.firstDayOfWeek) {
            return firstDayOfCurrMonth - this.firstDayOfWeek;
        }
        else {
            return NO_OF_DAYS_IN_A_WEEK + firstDayOfCurrMonth - this.firstDayOfWeek;
        }
    }
    /**
     * Checks if the Day passed is in the CalendarView.
     */
    isDayInCalendarView(day) {
        if (!this.calendar.isDayInCalendar(day)) {
            return false;
        }
        return true;
    }
    /**
     * Using the DayViewModels from the previous, current and next month, this function
     * generates the CalendarView.
     */
    generateCalendarView(prev, curr, next) {
        const combinationArr = [...prev, ...curr, ...next];
        const calendarView = [];
        for (let i = 0; i < NO_OF_ROWS_IN_CALENDAR_VIEW; i++) {
            calendarView[i] = combinationArr.slice(i * NO_OF_DAYS_IN_A_WEEK, (i + 1) * NO_OF_DAYS_IN_A_WEEK);
        }
        return calendarView;
    }
    /**
     * Initialize the selected day if the day is in the calendar.
     */
    initializeSelectedDay() {
        this.setSelectedDay(this.selectedDay, true);
        this.setSelectedDay(this.selectedEndDay, true);
    }
    /**
     * Initializes the focusable day if the day is in the calendar. If focusable day is not set, then
     * we check for the selected day. If selected day is not set then check if today is in the current
     * calendar. If not then just set the 15th of the current calendar month.
     */
    initializeFocusableDay() {
        if (this.focusableDay && this.isDayInCalendarView(this.focusableDay)) {
            this.setFocusableFlag(this.focusableDay, true);
        }
        else if (this.selectedDay && this.isDayInCalendarView(this.selectedDay)) {
            this.setFocusableFlag(this.selectedDay, true);
            this.focusableDay = this.selectedDay.clone();
        }
        else if (this.selectedEndDay && this.isDayInCalendarView(this.selectedEndDay)) {
            this.setFocusableFlag(this.selectedEndDay, true);
            this.focusableDay = this.selectedEndDay.clone();
        }
        else if (this.isDayInCalendarView(this.today)) {
            this.setFocusableFlag(this.today, true);
            this.focusableDay = this.today.clone();
        }
        else {
            this.focusableDay = new DayModel(this.calendar.year, this.calendar.month, 15);
            this.setFocusableFlag(this.focusableDay, true);
        }
    }
    setFocusableFlag(day, flag) {
        if (day) {
            this.currMonthDayViews[day.date - 1].isFocusable = flag;
        }
    }
    setSelectedDay(day, flag) {
        if (day && this.isDayInCalendarView(day)) {
            this.currMonthDayViews[day?.date - 1].isSelected = flag;
        }
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDay {
    constructor(_dateNavigationService, commonStrings) {
        this._dateNavigationService = _dateNavigationService;
        this.commonStrings = commonStrings;
        this.onSelectDay = new EventEmitter();
    }
    /**
     * DayViewModel input which is used to build the Day View.
     */
    get dayView() {
        return this._dayView;
    }
    set dayView(day) {
        this._dayView = day;
    }
    get dayString() {
        return this.dayView.isSelected
            ? this.commonStrings.parse(this.commonStrings.keys.datepickerSelectedLabel, {
                FULL_DATE: this._dayView.dayModel.toDateString(),
            })
            : this._dayView.dayModel.toDateString();
    }
    get isRangeStartDay() {
        return (this._dateNavigationService.isRangePicker &&
            this.dayView?.dayModel?.toComparisonString() === this._dateNavigationService.selectedDay?.toComparisonString());
    }
    get isRangeEndDay() {
        return (this._dateNavigationService.isRangePicker &&
            this.dayView?.dayModel?.toComparisonString() === this._dateNavigationService.selectedEndDay?.toComparisonString());
    }
    /**
     * Calls the DateNavigationService to update the hovered day value of the calendar
     */
    hoverListener() {
        if (!this.dayView.isDisabled) {
            this._dateNavigationService.hoveredDay = this.dayView.dayModel;
        }
    }
    /**
     * Updates the focusedDay in the DateNavigationService when the ClrDay is focused.
     */
    onDayViewFocus() {
        this._dateNavigationService.focusedDay = this.dayView.dayModel;
    }
    /**
     * Updates the selectedDay when the ClrDay is selected and closes the datepicker popover.
     */
    selectDay() {
        if (this.dayView.isDisabled) {
            return;
        }
        const day = this.dayView.dayModel;
        this.onSelectDay.emit(day);
    }
    /**
     * Applicable only to date range picker
     * Compares whether the day is in between the start and end date range
     */
    isInRange() {
        if (!this._dateNavigationService.isRangePicker) {
            return false;
        }
        if (this._dateNavigationService.selectedDay && this._dateNavigationService.selectedEndDay) {
            return (this._dayView.dayModel?.isAfter(this._dateNavigationService.selectedDay) &&
                this._dayView.dayModel?.isBefore(this._dateNavigationService.selectedEndDay));
        }
        else if (this._dateNavigationService.selectedDay && !this._dateNavigationService.selectedEndDay) {
            return (this._dayView.dayModel?.isAfter(this._dateNavigationService.selectedDay) &&
                this._dayView.dayModel?.isBefore(this._dateNavigationService.hoveredDay, true));
        }
        else {
            return false;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDay, deps: [{ token: DateNavigationService }, { token: i4.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrDay, isStandalone: false, selector: "clr-day", inputs: { dayView: ["clrDayView", "dayView"] }, outputs: { onSelectDay: "selectDay" }, host: { listeners: { "mouseenter": "hoverListener()" }, properties: { "class.day": "true" } }, ngImport: i0, template: `
    <button
      class="day-btn"
      type="button"
      [class.is-today]="dayView.isTodaysDate"
      [class.is-excluded]="dayView.isExcluded"
      [class.is-disabled]="dayView.isDisabled"
      [class.is-selected]="dayView.isSelected"
      [class.in-range]="isInRange()"
      [class.is-start-range]="isRangeStartDay"
      [class.is-end-range]="isRangeEndDay"
      [attr.tabindex]="dayView.tabIndex"
      (click)="selectDay()"
      (focus)="onDayViewFocus()"
      [attr.aria-current]="dayView.isTodaysDate ? 'date' : 'false'"
      [attr.aria-label]="dayString"
      [attr.aria-selected]="dayView.isSelected"
    >
      {{ dayView.dayModel.date }}
    </button>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDay, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-day',
                    template: `
    <button
      class="day-btn"
      type="button"
      [class.is-today]="dayView.isTodaysDate"
      [class.is-excluded]="dayView.isExcluded"
      [class.is-disabled]="dayView.isDisabled"
      [class.is-selected]="dayView.isSelected"
      [class.in-range]="isInRange()"
      [class.is-start-range]="isRangeStartDay"
      [class.is-end-range]="isRangeEndDay"
      [attr.tabindex]="dayView.tabIndex"
      (click)="selectDay()"
      (focus)="onDayViewFocus()"
      [attr.aria-current]="dayView.isTodaysDate ? 'date' : 'false'"
      [attr.aria-label]="dayString"
      [attr.aria-selected]="dayView.isSelected"
    >
      {{ dayView.dayModel.date }}
    </button>
  `,
                    host: { '[class.day]': 'true' },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: DateNavigationService }, { type: i4.ClrCommonStringsService }], propDecorators: { onSelectDay: [{
                type: Output,
                args: ['selectDay']
            }], dayView: [{
                type: Input,
                args: ['clrDayView']
            }], hoverListener: [{
                type: HostListener,
                args: ['mouseenter']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCalendar {
    constructor(_localeHelperService, _dateNavigationService, _datepickerFocusService, _dateIOService, _elRef, _dateFormControlService, _popoverService) {
        this._localeHelperService = _localeHelperService;
        this._dateNavigationService = _dateNavigationService;
        this._datepickerFocusService = _datepickerFocusService;
        this._dateIOService = _dateIOService;
        this._elRef = _elRef;
        this._dateFormControlService = _dateFormControlService;
        this._popoverService = _popoverService;
        this._subs = [];
        this.generateCalendarView();
        this.initializeSubscriptions();
    }
    /**
     * Gets the locale days according to the TranslationWidth.Narrow format.
     */
    get localeDays() {
        return this._localeHelperService.localeDays;
    }
    get calendar() {
        return this._dateNavigationService.displayedCalendar;
    }
    get selectedDay() {
        return this._dateNavigationService.selectedDay;
    }
    get selectedEndDay() {
        return this._dateNavigationService.selectedEndDay;
    }
    get focusedDay() {
        return this._dateNavigationService.focusedDay;
    }
    get today() {
        return this._dateNavigationService.today;
    }
    /**
     * Focuses on the focusable day when the Calendar View is initialized.
     */
    ngAfterViewInit() {
        this._datepickerFocusService.focusCell(this._elRef);
    }
    /**
     * Unsubscribe from subscriptions.
     */
    ngOnDestroy() {
        this._subs.forEach((sub) => sub.unsubscribe());
    }
    /**
     * Delegates Keyboard arrow navigation to the DateNavigationService.
     */
    onKeyDown(event) {
        if (event && this.focusedDay) {
            switch (event.key) {
                case Keys.ArrowUp:
                    event.preventDefault();
                    this._dateNavigationService.incrementFocusDay(-1 * NO_OF_DAYS_IN_A_WEEK);
                    break;
                case Keys.ArrowDown:
                    event.preventDefault();
                    this._dateNavigationService.incrementFocusDay(NO_OF_DAYS_IN_A_WEEK);
                    break;
                case Keys.ArrowLeft:
                    event.preventDefault();
                    this._dateNavigationService.incrementFocusDay(-1);
                    break;
                case Keys.ArrowRight:
                    event.preventDefault();
                    this._dateNavigationService.incrementFocusDay(1);
                    break;
                default:
                    break; // No default case. ESLint x-(
            }
        }
    }
    setSelectedDay(day) {
        const hasActionButtons = this._dateNavigationService.hasActionButtons;
        const selectedDates = this.updateCalendarViewModal(day);
        this._dateNavigationService.notifySelectedDayChanged(selectedDates, { emitEvent: !hasActionButtons });
        if (!hasActionButtons) {
            this._dateFormControlService.markAsDirty();
            this.validateAndCloseDatePicker();
        }
    }
    /**
     * Initialize subscriptions to:
     * 1. update the calendar view model.
     * 2. update the focusable day in the calendar view model.
     * 3. focus on the focusable day in the calendar.
     */
    initializeSubscriptions() {
        this._subs.push(this._dateNavigationService.displayedCalendarChange.subscribe(() => {
            this.generateCalendarView();
        }));
        this._subs.push(this._dateNavigationService.focusedDayChange.subscribe((focusedDay) => {
            this.calendarViewModel.updateFocusableDay(focusedDay);
        }));
        this._subs.push(this._dateNavigationService.focusOnCalendarChange.subscribe(() => {
            this._datepickerFocusService.focusCell(this._elRef);
        }));
        this._subs.push(this._dateNavigationService.refreshCalendarView.subscribe(() => {
            this.refreshCalendarViewModal();
        }));
    }
    validateAndCloseDatePicker() {
        if ((this._dateNavigationService.isRangePicker &&
            this._dateNavigationService.selectedDay &&
            this._dateNavigationService.selectedEndDay) ||
            (!this._dateNavigationService.isRangePicker && this._dateNavigationService.selectedDay)) {
            this._popoverService.open = false;
        }
    }
    updateCalendarViewModal(day) {
        const startDate = this.calendarViewModel.selectedDay || null, isRangePicker = this._dateNavigationService.isRangePicker;
        let endDate = this.calendarViewModel.selectedEndDay || null;
        if (isRangePicker) {
            if (!startDate || (!!startDate && !!endDate) || (!!startDate && day?.isBefore(startDate))) {
                this.calendarViewModel.updateSelectedDay(day);
                if (endDate) {
                    endDate = undefined;
                    this.calendarViewModel.updateSelectedEndDay(endDate);
                }
            }
            else {
                this.calendarViewModel.updateSelectedEndDay(day);
            }
        }
        else {
            this.calendarViewModel.updateSelectedDay(day);
        }
        return isRangePicker
            ? { startDate: this.calendarViewModel.selectedDay, endDate: this.calendarViewModel.selectedEndDay }
            : this.calendarViewModel.selectedDay;
    }
    refreshCalendarViewModal() {
        this.calendarViewModel.updateSelectedDay(this._dateNavigationService.selectedDay);
        if (this._dateNavigationService.isRangePicker) {
            this.calendarViewModel.updateSelectedEndDay(this._dateNavigationService.selectedEndDay);
        }
    }
    /**
     * Generates the Calendar View based on the calendar retrieved from the DateNavigationService.
     */
    generateCalendarView() {
        this.calendarViewModel = new CalendarViewModel(this.calendar, this.selectedDay, this.selectedEndDay, this.focusedDay, this.today, this._localeHelperService.firstDayOfWeek, this._dateIOService.disabledDates);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrCalendar, deps: [{ token: LocaleHelperService }, { token: DateNavigationService }, { token: DatepickerFocusService }, { token: DateIOService }, { token: i0.ElementRef }, { token: DateFormControlService }, { token: i1.ClrPopoverService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrCalendar, isStandalone: false, selector: "clr-calendar", host: { listeners: { "keydown": "onKeyDown($event)" } }, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<table class=\"calendar-table\" role=\"presentation\">\n  <tr class=\"calendar-row weekdays\">\n    @for (day of localeDays; track day) {\n    <th class=\"calendar-cell weekday\">\n      <span [attr.aria-label]=\"day.day\">{{day.narrow}}</span>\n    </th>\n    }\n  </tr>\n  @for (row of calendarViewModel.calendarView; track row) {\n  <tr class=\"calendar-row\">\n    @for (dayView of row; track dayView) {\n    <td class=\"calendar-cell\">\n      <clr-day [clrDayView]=\"dayView\" (selectDay)=\"setSelectedDay($event)\"></clr-day>\n    </td>\n    }\n  </tr>\n  }\n</table>\n", dependencies: [{ kind: "component", type: ClrDay, selector: "clr-day", inputs: ["clrDayView"], outputs: ["selectDay"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrCalendar, decorators: [{
            type: Component,
            args: [{ selector: 'clr-calendar', standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<table class=\"calendar-table\" role=\"presentation\">\n  <tr class=\"calendar-row weekdays\">\n    @for (day of localeDays; track day) {\n    <th class=\"calendar-cell weekday\">\n      <span [attr.aria-label]=\"day.day\">{{day.narrow}}</span>\n    </th>\n    }\n  </tr>\n  @for (row of calendarViewModel.calendarView; track row) {\n  <tr class=\"calendar-row\">\n    @for (dayView of row; track dayView) {\n    <td class=\"calendar-cell\">\n      <clr-day [clrDayView]=\"dayView\" (selectDay)=\"setSelectedDay($event)\"></clr-day>\n    </td>\n    }\n  </tr>\n  }\n</table>\n" }]
        }], ctorParameters: () => [{ type: LocaleHelperService }, { type: DateNavigationService }, { type: DatepickerFocusService }, { type: DateIOService }, { type: i0.ElementRef }, { type: DateFormControlService }, { type: i1.ClrPopoverService }], propDecorators: { onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDaypicker {
    constructor(_viewManagerService, _dateNavigationService, _localeHelperService, commonStrings) {
        this._viewManagerService = _viewManagerService;
        this._dateNavigationService = _dateNavigationService;
        this._localeHelperService = _localeHelperService;
        this.commonStrings = commonStrings;
    }
    get monthAttrString() {
        return this.commonStrings.parse(this.commonStrings.keys.datepickerSelectMonthText, {
            CALENDAR_MONTH: this.calendarMonth,
        });
    }
    get yearAttrString() {
        return this.commonStrings.parse(this.commonStrings.keys.datepickerSelectYearText, {
            CALENDAR_YEAR: this.calendarYear.toString(),
        });
    }
    /**
     * Returns the month value of the calendar in the TranslationWidth.Abbreviated format.
     */
    get calendarMonth() {
        return this._localeHelperService.localeMonthsAbbreviated[this._dateNavigationService.displayedCalendar.month];
    }
    /**
     * Returns the year value of the calendar.
     */
    get calendarYear() {
        return this._dateNavigationService.displayedCalendar.year;
    }
    /**
     * Calls the ViewManagerService to change to the monthpicker view.
     */
    changeToMonthView() {
        this._viewManagerService.changeToMonthView();
    }
    /**
     * Calls the ViewManagerService to change to the yearpicker view.
     */
    changeToYearView() {
        this._viewManagerService.changeToYearView();
    }
    /**
     * Calls the DateNavigationService to move to the next month.
     */
    nextMonth() {
        this._dateNavigationService.moveToNextMonth();
    }
    /**
     * Calls the DateNavigationService to move to the previous month.
     */
    previousMonth() {
        this._dateNavigationService.moveToPreviousMonth();
    }
    /**
     * Calls the DateNavigationService to move to the current month.
     */
    currentMonth() {
        this._dateNavigationService.moveToCurrentMonth();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDaypicker, deps: [{ token: ViewManagerService }, { token: DateNavigationService }, { token: LocaleHelperService }, { token: i4.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrDaypicker, isStandalone: false, selector: "clr-daypicker", host: { attributes: { "role": "application" }, properties: { "class.daypicker": "true" } }, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"clr-sr-only\">{{commonStrings.keys.modalContentStart}}</div>\n<div class=\"calendar-header\">\n  <div class=\"calendar-pickers\">\n    <button\n      class=\"calendar-btn monthpicker-trigger\"\n      type=\"button\"\n      (click)=\"changeToMonthView()\"\n      [attr.aria-label]=\"monthAttrString\"\n      [attr.title]=\"monthAttrString\"\n    >\n      {{calendarMonth}}\n    </button>\n    <button\n      class=\"calendar-btn yearpicker-trigger\"\n      type=\"button\"\n      (click)=\"changeToYearView()\"\n      [attr.aria-label]=\"yearAttrString\"\n      [attr.title]=\"yearAttrString\"\n    >\n      {{calendarYear}}\n    </button>\n  </div>\n  <div class=\"calendar-switchers\">\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"previousMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerPreviousMonth\"\n    >\n      <cds-icon shape=\"angle\" direction=\"left\" [attr.title]=\"commonStrings.keys.datepickerPreviousMonth\"></cds-icon>\n    </button>\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"currentMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerCurrentMonth\"\n    >\n      <cds-icon shape=\"event\" [attr.title]=\"commonStrings.keys.datepickerCurrentMonth\"></cds-icon>\n    </button>\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"nextMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerNextMonth\"\n    >\n      <cds-icon shape=\"angle\" direction=\"right\" [attr.title]=\"commonStrings.keys.datepickerNextMonth\"></cds-icon>\n    </button>\n  </div>\n</div>\n<clr-calendar></clr-calendar>\n<div class=\"clr-sr-only\">{{commonStrings.keys.modalContentEnd}}</div>\n", dependencies: [{ kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "component", type: ClrCalendar, selector: "clr-calendar" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDaypicker, decorators: [{
            type: Component,
            args: [{ selector: 'clr-daypicker', host: { '[class.daypicker]': 'true', role: 'application' }, standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"clr-sr-only\">{{commonStrings.keys.modalContentStart}}</div>\n<div class=\"calendar-header\">\n  <div class=\"calendar-pickers\">\n    <button\n      class=\"calendar-btn monthpicker-trigger\"\n      type=\"button\"\n      (click)=\"changeToMonthView()\"\n      [attr.aria-label]=\"monthAttrString\"\n      [attr.title]=\"monthAttrString\"\n    >\n      {{calendarMonth}}\n    </button>\n    <button\n      class=\"calendar-btn yearpicker-trigger\"\n      type=\"button\"\n      (click)=\"changeToYearView()\"\n      [attr.aria-label]=\"yearAttrString\"\n      [attr.title]=\"yearAttrString\"\n    >\n      {{calendarYear}}\n    </button>\n  </div>\n  <div class=\"calendar-switchers\">\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"previousMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerPreviousMonth\"\n    >\n      <cds-icon shape=\"angle\" direction=\"left\" [attr.title]=\"commonStrings.keys.datepickerPreviousMonth\"></cds-icon>\n    </button>\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"currentMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerCurrentMonth\"\n    >\n      <cds-icon shape=\"event\" [attr.title]=\"commonStrings.keys.datepickerCurrentMonth\"></cds-icon>\n    </button>\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"nextMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerNextMonth\"\n    >\n      <cds-icon shape=\"angle\" direction=\"right\" [attr.title]=\"commonStrings.keys.datepickerNextMonth\"></cds-icon>\n    </button>\n  </div>\n</div>\n<clr-calendar></clr-calendar>\n<div class=\"clr-sr-only\">{{commonStrings.keys.modalContentEnd}}</div>\n" }]
        }], ctorParameters: () => [{ type: ViewManagerService }, { type: DateNavigationService }, { type: LocaleHelperService }, { type: i4.ClrCommonStringsService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatepickerActions {
    constructor(commonStrings, popoverService, dateNavigationService, dateFormControlService) {
        this.commonStrings = commonStrings;
        this.popoverService = popoverService;
        this.dateNavigationService = dateNavigationService;
        this.dateFormControlService = dateFormControlService;
    }
    apply() {
        if (this.dateNavigationService.isRangePicker &&
            this.dateNavigationService.selectedDay &&
            this.dateNavigationService.selectedEndDay) {
            this.dateNavigationService.notifySelectedDayChanged({
                startDate: this.dateNavigationService.selectedDay,
                endDate: this.dateNavigationService.selectedEndDay,
            });
            this.dateFormControlService.markAsDirty();
        }
        else if (!this.dateNavigationService.isRangePicker && this.dateNavigationService.selectedDay) {
            this.dateNavigationService.notifySelectedDayChanged(this.dateNavigationService.selectedDay);
            this.dateFormControlService.markAsDirty();
        }
        this.popoverService.open = false;
    }
    cancel() {
        this.dateNavigationService.resetSelectedDay();
        this.popoverService.open = false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDatepickerActions, deps: [{ token: i4.ClrCommonStringsService }, { token: i1.ClrPopoverService }, { token: DateNavigationService }, { token: DateFormControlService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrDatepickerActions, isStandalone: false, selector: "clr-datepicker-actions", host: { properties: { "class.datepicker-actions": "true" } }, ngImport: i0, template: `
    <button class="btn btn-outline" (click)="cancel()">{{ commonStrings.keys.cancel }}</button>
    <button class="btn btn-primary" (click)="apply()">{{ commonStrings.keys.apply }}</button>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDatepickerActions, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-datepicker-actions',
                    template: `
    <button class="btn btn-outline" (click)="cancel()">{{ commonStrings.keys.cancel }}</button>
    <button class="btn btn-primary" (click)="apply()">{{ commonStrings.keys.apply }}</button>
  `,
                    host: {
                        '[class.datepicker-actions]': 'true',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i4.ClrCommonStringsService }, { type: i1.ClrPopoverService }, { type: DateNavigationService }, { type: DateFormControlService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatepickerViewManager {
    constructor(commonStrings, viewManagerService, dateNavigationService, dateIOService) {
        this.commonStrings = commonStrings;
        this.viewManagerService = viewManagerService;
        this.dateNavigationService = dateNavigationService;
        this.dateIOService = dateIOService;
    }
    /**
     * Returns if the current view is the monthpicker.
     */
    get isMonthView() {
        return this.viewManagerService.isMonthView;
    }
    /**
     * Returns if the current view is the yearpicker.
     */
    get isYearView() {
        return this.viewManagerService.isYearView;
    }
    /**
     * Returns if the current view is the daypicker.
     */
    get isDayView() {
        return this.viewManagerService.isDayView;
    }
    get hasRangeOptions() {
        return !!this.dateNavigationService?.isRangePicker && !!this.dateRangeOptions?.length;
    }
    get hasActionButtons() {
        return this.dateNavigationService.hasActionButtons;
    }
    get dateRangeOptions() {
        return this.dateIOService.getRangeOptions();
    }
    onRangeOptionSelect(selectedRange) {
        const startDate = this.dateNavigationService.convertDateToDayModel(selectedRange?.value[0]), endDate = this.dateNavigationService.convertDateToDayModel(selectedRange?.value[1]);
        this.dateNavigationService.notifySelectedDayChanged({ startDate, endDate }, { emitEvent: !this.hasActionButtons });
        this.dateNavigationService.moveToSpecificMonth(startDate);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDatepickerViewManager, deps: [{ token: i4.ClrCommonStringsService }, { token: ViewManagerService }, { token: DateNavigationService }, { token: DateIOService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrDatepickerViewManager, isStandalone: false, selector: "clr-datepicker-view-manager", host: { attributes: { "role": "dialog" }, properties: { "class.datepicker": "true", "class.has-range-option": "hasRangeOptions", "class.has-action-buttons": "hasActionButtons", "attr.aria-modal": "true", "attr.aria-label": "commonStrings.keys.datepickerDialogLabel" } }, providers: [DatepickerFocusService], ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n@if (hasRangeOptions) {\n<clr-vertical-nav class=\"clr-date-range-picker-nav\">\n  @for (option of dateRangeOptions; track option) {\n  <a\n    clrVerticalNavLink\n    href=\"javascript:void(0)\"\n    [attr.aria-label]=\"option?.label\"\n    tabindex=\"0\"\n    (keyup.enter)=\"onRangeOptionSelect(option)\"\n    (click)=\"onRangeOptionSelect(option)\"\n  >\n    {{option.label}}\n  </a>\n  }\n</clr-vertical-nav>\n<ng-container *ngTemplateOutlet=\"calendarView\"></ng-container>\n} @else {\n<div class=\"datepicker-view-manager\">\n  @if (isMonthView) {\n  <clr-monthpicker></clr-monthpicker>\n  } @if (isYearView) {\n  <clr-yearpicker></clr-yearpicker>\n  } @if (isDayView) {\n  <clr-daypicker></clr-daypicker>\n  } @if (hasActionButtons) {\n  <clr-datepicker-actions></clr-datepicker-actions>\n  }\n</div>\n}\n\n<ng-template #calendarView>\n  <div class=\"datepicker-view-manager\">\n    @if (isMonthView) {\n    <clr-monthpicker></clr-monthpicker>\n    } @if (isYearView) {\n    <clr-yearpicker></clr-yearpicker>\n    } @if (isDayView) {\n    <clr-daypicker></clr-daypicker>\n    } @if (hasActionButtons) {\n    <clr-datepicker-actions></clr-datepicker-actions>\n    }\n  </div>\n</ng-template>\n", dependencies: [{ kind: "directive", type: i5$1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i6.ClrVerticalNav, selector: "clr-vertical-nav", inputs: ["clrVerticalNavToggleLabel", "clrVerticalNavCollapsible", "clrVerticalNavCollapsed"], outputs: ["clrVerticalNavCollapsedChange"] }, { kind: "component", type: i6.ClrVerticalNavLink, selector: "[clrVerticalNavLink]" }, { kind: "component", type: ClrMonthpicker, selector: "clr-monthpicker" }, { kind: "component", type: ClrYearpicker, selector: "clr-yearpicker" }, { kind: "component", type: ClrDaypicker, selector: "clr-daypicker" }, { kind: "component", type: ClrDatepickerActions, selector: "clr-datepicker-actions" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDatepickerViewManager, decorators: [{
            type: Component,
            args: [{ selector: 'clr-datepicker-view-manager', providers: [DatepickerFocusService], host: {
                        '[class.datepicker]': 'true',
                        '[class.has-range-option]': 'hasRangeOptions',
                        '[class.has-action-buttons]': 'hasActionButtons',
                        '[attr.aria-modal]': 'true',
                        '[attr.aria-label]': 'commonStrings.keys.datepickerDialogLabel',
                        role: 'dialog',
                    }, standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n@if (hasRangeOptions) {\n<clr-vertical-nav class=\"clr-date-range-picker-nav\">\n  @for (option of dateRangeOptions; track option) {\n  <a\n    clrVerticalNavLink\n    href=\"javascript:void(0)\"\n    [attr.aria-label]=\"option?.label\"\n    tabindex=\"0\"\n    (keyup.enter)=\"onRangeOptionSelect(option)\"\n    (click)=\"onRangeOptionSelect(option)\"\n  >\n    {{option.label}}\n  </a>\n  }\n</clr-vertical-nav>\n<ng-container *ngTemplateOutlet=\"calendarView\"></ng-container>\n} @else {\n<div class=\"datepicker-view-manager\">\n  @if (isMonthView) {\n  <clr-monthpicker></clr-monthpicker>\n  } @if (isYearView) {\n  <clr-yearpicker></clr-yearpicker>\n  } @if (isDayView) {\n  <clr-daypicker></clr-daypicker>\n  } @if (hasActionButtons) {\n  <clr-datepicker-actions></clr-datepicker-actions>\n  }\n</div>\n}\n\n<ng-template #calendarView>\n  <div class=\"datepicker-view-manager\">\n    @if (isMonthView) {\n    <clr-monthpicker></clr-monthpicker>\n    } @if (isYearView) {\n    <clr-yearpicker></clr-yearpicker>\n    } @if (isDayView) {\n    <clr-daypicker></clr-daypicker>\n    } @if (hasActionButtons) {\n    <clr-datepicker-actions></clr-datepicker-actions>\n    }\n  </div>\n</ng-template>\n" }]
        }], ctorParameters: () => [{ type: i4.ClrCommonStringsService }, { type: ViewManagerService }, { type: DateNavigationService }, { type: DateIOService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDateContainer extends ClrAbstractContainer {
    constructor(renderer, elem, popoverService, dateNavigationService, datepickerEnabledService, dateFormControlService, dateIOService, commonStrings, focusService, viewManagerService, controlClassService, layoutService, ngControlService) {
        super(layoutService, controlClassService, ngControlService);
        this.renderer = renderer;
        this.elem = elem;
        this.popoverService = popoverService;
        this.dateNavigationService = dateNavigationService;
        this.datepickerEnabledService = datepickerEnabledService;
        this.dateFormControlService = dateFormControlService;
        this.dateIOService = dateIOService;
        this.commonStrings = commonStrings;
        this.viewManagerService = viewManagerService;
        this.controlClassService = controlClassService;
        this.layoutService = layoutService;
        this.ngControlService = ngControlService;
        this.focus = false;
        this.popoverType = ClrPopoverType.DROPDOWN;
        this.subscriptions.push(focusService.focusChange.subscribe(state => {
            this.focus = state;
        }));
        this.subscriptions.push(popoverService.openChange.subscribe(() => {
            dateFormControlService.markAsTouched();
        }));
        if (dateNavigationService) {
            const tagName = elem.nativeElement.tagName.toLowerCase();
            dateNavigationService.hasActionButtons = dateNavigationService.isRangePicker =
                tagName === 'clr-date-range-container';
        }
    }
    /**
     * For date range picker actions buttons are shown by default
     */
    set showActionButtons(flag) {
        if (this.dateNavigationService.isRangePicker && !flag) {
            console.error('Error! The date range picker requires action buttons, [showActionButtons] cannot be turned off.');
        }
        else {
            this.dateNavigationService.hasActionButtons = flag;
        }
    }
    set clrPosition(position) {
        if (!position) {
            return;
        }
        const posIndex = DROPDOWN_POSITIONS.indexOf(position);
        if (posIndex === -1) {
            return;
        }
        this.viewManagerService.position = DROPDOWN_POSITIONS[posIndex];
    }
    set rangeOptions(rangeOptions) {
        this.dateIOService.setRangeOptions(rangeOptions);
    }
    set min(dateString) {
        if (this.dateNavigationService.isRangePicker) {
            this.dateIOService.setMinDate(dateString);
        }
        else {
            console.error('Error! The date container [min] input only works for date range pickers. Use the native `min` attribute/property for single-date inputs.');
        }
    }
    set max(dateString) {
        if (this.dateNavigationService.isRangePicker) {
            this.dateIOService.setMaxDate(dateString);
        }
        else {
            console.error('Error! The date container [max] input only works for date range pickers. Use the native `max` attribute/property for single-date inputs.');
        }
    }
    set actionButton(button) {
        this.toggleButton = button;
    }
    get popoverPosition() {
        return this.viewManagerService.position;
    }
    get open() {
        return this.popoverService.open;
    }
    /**
     * Returns if the Datepicker is enabled or not. If disabled, hides the datepicker trigger.
     */
    get isEnabled() {
        return this.datepickerEnabledService.isEnabled;
    }
    /**
     * Return if Datepicker is diabled or not as Form Control
     */
    get isInputDateDisabled() {
        /* clrForm wrapper or without clrForm */
        return ((this.control && this.control.disabled) || (this.dateFormControlService && this.dateFormControlService.disabled));
    }
    get isRangePicker() {
        return this.dateNavigationService.isRangePicker;
    }
    ngAfterViewInit() {
        this.dateRangeStructuralChecks();
        this.subscriptions.push(this.popoverService.openChange.subscribe(open => {
            if (open) {
                this.initializeCalendar();
            }
            else {
                this.toggleButton.nativeElement.focus();
                this.dateNavigationService.resetSelectedDay();
            }
        }));
        this.subscriptions.push(this.listenForDateChanges());
    }
    /**
     * Return the label for the toggle button.
     * If there's a selected date, the date is included in the label.
     */
    getToggleButtonLabel(day) {
        if (day) {
            const formattedDate = this.dateIOService.toLocaleDisplayFormatString(day.toDate());
            return this.commonStrings.parse(this.commonStrings.keys.datepickerToggleChangeDateLabel, {
                SELECTED_DATE: formattedDate,
            });
        }
        return this.commonStrings.keys.datepickerToggleChooseDateLabel;
    }
    listenForDateChanges() {
        // because date-input.ts initializes the input in ngAfterViewInit,
        // using a databound attribute to change the button labels results in ExpressionChangedAfterItHasBeenCheckedError.
        // so instead, update the attribute directly on the element
        return this.dateNavigationService.selectedDayChange
            .pipe(startWith(this.dateNavigationService.selectedDay))
            .subscribe(day => {
            if (this.isEnabled) {
                const label = this.getToggleButtonLabel(day);
                const toggleEl = this.toggleButton.nativeElement;
                this.renderer.setAttribute(toggleEl, 'aria-label', label);
                this.renderer.setAttribute(toggleEl, 'title', label);
            }
        });
    }
    /**
     * Processes the user input and Initializes the Calendar everytime the datepicker popover is open.
     */
    initializeCalendar() {
        this.dateNavigationService.initializeCalendar();
    }
    dateRangeStructuralChecks() {
        if (this.dateNavigationService.isRangePicker) {
            const inputs = Array.from(this.elem.nativeElement.querySelectorAll('input'));
            if (inputs.some(input => input.classList.contains('clr-date-input'))) {
                console.error('Error! clr-date-range-container must contain clrStartDate and clrEndDate inputs');
            }
            if (!inputs.some(input => input.classList.contains('clr-date-start-input'))) {
                console.error('Error! clr-date-range-container must contain clrStartDate input');
            }
            if (!inputs.some(input => input.classList.contains('clr-date-end-input'))) {
                console.error('Error! clr-date-range-container must contain clrEndDate input');
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDateContainer, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i1.ClrPopoverService }, { token: DateNavigationService }, { token: DatepickerEnabledService }, { token: DateFormControlService }, { token: DateIOService }, { token: i4.ClrCommonStringsService }, { token: i7.FormsFocusService }, { token: ViewManagerService }, { token: i7.ControlClassService }, { token: i7.LayoutService, optional: true }, { token: i7.NgControlService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrDateContainer, isStandalone: false, selector: "clr-date-container, clr-date-range-container", inputs: { showActionButtons: "showActionButtons", clrPosition: "clrPosition", rangeOptions: "rangeOptions", min: "min", max: "max" }, host: { properties: { "class.clr-date-container": "true", "class.clr-form-control-disabled": "isInputDateDisabled", "class.clr-form-control": "true", "class.clr-row": "addGrid()" } }, providers: [
            ControlIdService,
            LocaleHelperService,
            ControlClassService,
            FormsFocusService,
            NgControlService,
            DateIOService,
            DateNavigationService,
            DatepickerEnabledService,
            DateFormControlService,
            ViewManagerService,
        ], viewQueries: [{ propertyName: "actionButton", first: true, predicate: ["actionButton"], descendants: true }], usesInheritance: true, hostDirectives: [{ directive: i1.ClrPopoverHostDirective }], ngImport: i0, template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper" clrPopoverOrigin>
        <div class="clr-input-group" [class.clr-focus]="focus">
          <!-- render range inputs only if using clr-date-range-container -->
          @if (isRangePicker) {
            <ng-content select="[clrStartDate]"></ng-content>
            <span class="date-range-separator">-</span>
            <ng-content select="[clrEndDate]"></ng-content>
          }
          <!-- no @if for the singe-date input because it breaks the "auto-wrapped" date picker -->
          <ng-content select="[clrDate]"></ng-content>
          @if (isEnabled) {
            <button
              #actionButton
              type="button"
              clrPopoverOpenCloseButton
              class="clr-input-group-icon-action"
              [disabled]="isInputDateDisabled"
            >
              <cds-icon status="info" shape="calendar"></cds-icon>
            </button>
          }
          <clr-datepicker-view-manager
            *clrPopoverContent="
              open;
              at: popoverPosition;
              type: popoverType;
              outsideClickToClose: true;
              scrollToClose: true
            "
            cdkTrapFocus
          ></clr-datepicker-view-manager>
        </div>
        @if (showInvalid) {
          <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger" aria-hidden="true"></cds-icon>
        }
        @if (showValid) {
          <cds-icon class="clr-validate-icon" shape="check-circle" status="success" aria-hidden="true"></cds-icon>
        }
      </div>
      @if (showHelper) {
        <ng-content select="clr-control-helper"></ng-content>
      }
      @if (showInvalid) {
        <ng-content select="clr-control-error"></ng-content>
      }
      @if (showValid) {
        <ng-content select="clr-control-success"></ng-content>
      }
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i5$1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i4.CdkTrapFocusModule_CdkTrapFocus, selector: "[cdkTrapFocus]" }, { kind: "directive", type: i1.ClrPopoverOrigin, selector: "[clrPopoverOrigin]" }, { kind: "directive", type: i1.ÇlrClrPopoverOpenCloseButton, selector: "[clrPopoverOpenCloseButton]", outputs: ["clrPopoverOpenCloseChange"] }, { kind: "directive", type: i1.ClrPopoverContent, selector: "[clrPopoverContent]", inputs: ["clrPopoverContent", "clrPopoverContentAt", "clrPopoverContentAvailablePositions", "clrPopoverContentType", "clrPopoverContentOutsideClickToClose", "clrPopoverContentScrollToClose", "clrPopoverContentOrigin"] }, { kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i7.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "component", type: ClrDatepickerViewManager, selector: "clr-datepicker-view-manager" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDateContainer, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-date-container, clr-date-range-container',
                    template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()">
      <div class="clr-input-wrapper" clrPopoverOrigin>
        <div class="clr-input-group" [class.clr-focus]="focus">
          <!-- render range inputs only if using clr-date-range-container -->
          @if (isRangePicker) {
            <ng-content select="[clrStartDate]"></ng-content>
            <span class="date-range-separator">-</span>
            <ng-content select="[clrEndDate]"></ng-content>
          }
          <!-- no @if for the singe-date input because it breaks the "auto-wrapped" date picker -->
          <ng-content select="[clrDate]"></ng-content>
          @if (isEnabled) {
            <button
              #actionButton
              type="button"
              clrPopoverOpenCloseButton
              class="clr-input-group-icon-action"
              [disabled]="isInputDateDisabled"
            >
              <cds-icon status="info" shape="calendar"></cds-icon>
            </button>
          }
          <clr-datepicker-view-manager
            *clrPopoverContent="
              open;
              at: popoverPosition;
              type: popoverType;
              outsideClickToClose: true;
              scrollToClose: true
            "
            cdkTrapFocus
          ></clr-datepicker-view-manager>
        </div>
        @if (showInvalid) {
          <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger" aria-hidden="true"></cds-icon>
        }
        @if (showValid) {
          <cds-icon class="clr-validate-icon" shape="check-circle" status="success" aria-hidden="true"></cds-icon>
        }
      </div>
      @if (showHelper) {
        <ng-content select="clr-control-helper"></ng-content>
      }
      @if (showInvalid) {
        <ng-content select="clr-control-error"></ng-content>
      }
      @if (showValid) {
        <ng-content select="clr-control-success"></ng-content>
      }
    </div>
  `,
                    providers: [
                        ControlIdService,
                        LocaleHelperService,
                        ControlClassService,
                        FormsFocusService,
                        NgControlService,
                        DateIOService,
                        DateNavigationService,
                        DatepickerEnabledService,
                        DateFormControlService,
                        ViewManagerService,
                    ],
                    hostDirectives: [ClrPopoverHostDirective],
                    host: {
                        '[class.clr-date-container]': 'true',
                        '[class.clr-form-control-disabled]': 'isInputDateDisabled',
                        '[class.clr-form-control]': 'true',
                        '[class.clr-row]': 'addGrid()',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i1.ClrPopoverService }, { type: DateNavigationService }, { type: DatepickerEnabledService }, { type: DateFormControlService }, { type: DateIOService }, { type: i4.ClrCommonStringsService }, { type: i7.FormsFocusService }, { type: ViewManagerService }, { type: i7.ControlClassService }, { type: i7.LayoutService, decorators: [{
                    type: Optional
                }] }, { type: i7.NgControlService }], propDecorators: { showActionButtons: [{
                type: Input,
                args: ['showActionButtons']
            }], clrPosition: [{
                type: Input,
                args: ['clrPosition']
            }], rangeOptions: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], actionButton: [{
                type: ViewChild,
                args: ['actionButton']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// There are four ways the datepicker value is set
// 1. Value set by user typing into text input as a string ex: '01/28/2015'
// 2. Value set explicitly by Angular Forms APIs as a string ex: '01/28/2015'
// 3. Value set by user via datepicker UI as a Date Object
// 4. Value set via `clrDate` input as a Date Object
class ClrDateInputBase extends WrappedFormControl {
    constructor(viewContainerRef, injector, el, renderer, control, container, dateIOService, dateNavigationService, datepickerEnabledService, dateFormControlService, platformId, focusService, datepickerFocusService) {
        super(viewContainerRef, ClrDateContainer, injector, control, renderer, el);
        this.el = el;
        this.renderer = renderer;
        this.control = control;
        this.container = container;
        this.dateIOService = dateIOService;
        this.dateNavigationService = dateNavigationService;
        this.datepickerEnabledService = datepickerEnabledService;
        this.dateFormControlService = dateFormControlService;
        this.platformId = platformId;
        this.focusService = focusService;
        this.datepickerFocusService = datepickerFocusService;
        this.index = 1;
    }
    get disabled() {
        if (this.dateFormControlService) {
            return this.dateFormControlService.disabled || !!this.control?.control?.disabled;
        }
        return null;
    }
    set disabled(value) {
        if (this.dateFormControlService) {
            this.dateFormControlService.setDisabled(isBooleanAttributeSet(value));
        }
    }
    get placeholderText() {
        return this.placeholder ? this.placeholder : this.dateIOService.placeholderText;
    }
    get inputType() {
        return isPlatformBrowser(this.platformId) && this.usingNativeDatepicker() ? 'date' : 'text';
    }
    ngOnInit() {
        super.ngOnInit();
        this.populateServicesFromContainerComponent();
        this.subscriptions.push(this.listenForUserSelectedDayChanges(), this.listenForControlValueChanges(), this.listenForTouchChanges(), this.listenForDirtyChanges(), this.listenForInputRefocus());
    }
    ngAfterViewInit() {
        // I don't know why I have to do this but after using the new HostWrapping Module I have to delay the processing
        // of the initial Input set by the user to here. If I do not 2 issues occur:
        // 1. The Input setter is called before ngOnInit. ngOnInit initializes the services without which the setter fails.
        // 2. The Renderer doesn't work before ngAfterViewInit (It used to before the new HostWrapping Module for some reason).
        // I need the renderer to set the value property on the input to make sure that if the user has supplied a Date
        // input object, we reflect it with the right date on the input field using the IO service. I am not sure if
        // these are major issues or not but just noting them down here.
        this.processInitialInputs();
    }
    setFocusStates() {
        this.setFocus(true);
    }
    triggerValidation() {
        super.triggerValidation();
        this.setFocus(false);
    }
    onValueChange(target) {
        const validDateValue = this.dateIOService.getDateValueFromDateString(target.value);
        if (this.usingClarityDatepicker() && validDateValue) {
            this.updateDate(validDateValue, true);
        }
        else if (this.usingNativeDatepicker()) {
            const [year, month, day] = target.value.split('-');
            this.updateDate(new Date(+year, +month - 1, +day), true);
        }
        else {
            this.emitDateOutput(null);
        }
    }
    datepickerHasFormControl() {
        return !!this.control;
    }
    setDate(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        if (this.previousDateChange !== date) {
            this.updateDate(date);
        }
        if (!this.initialClrDateInputValue) {
            this.initialClrDateInputValue = date;
        }
    }
    triggerControlInputValidation() {
        if (this.datepickerHasFormControl()) {
            this.control.control?.updateValueAndValidity({ emitEvent: false });
            this.control.control?.setErrors(this.control.control.errors);
        }
    }
    usingClarityDatepicker() {
        return this.datepickerEnabledService.isEnabled;
    }
    usingNativeDatepicker() {
        return !this.datepickerEnabledService.isEnabled;
    }
    setFocus(focus) {
        if (this.focusService) {
            this.focusService.focused = focus;
        }
    }
    populateServicesFromContainerComponent() {
        if (!this.container) {
            this.dateIOService = this.getProviderFromContainer(DateIOService);
            this.dateNavigationService = this.getProviderFromContainer(DateNavigationService);
            this.datepickerEnabledService = this.getProviderFromContainer(DatepickerEnabledService);
            this.dateFormControlService = this.getProviderFromContainer(DateFormControlService);
        }
    }
    processInitialInputs() {
        if (this.datepickerHasFormControl()) {
            this.updateDate(this.dateIOService.getDateValueFromDateString(this.control.value));
        }
        else {
            this.updateDate(this.initialClrDateInputValue);
        }
    }
    updateDate(value, setByUserInteraction = false) {
        const date = this.getValidDateValueFromDate(value);
        if (setByUserInteraction) {
            this.emitDateOutput(date);
        }
        else {
            this.previousDateChange = date;
        }
        if (this.dateNavigationService) {
            const dayModel = date ? new DayModel(date.getFullYear(), date.getMonth(), date.getDate()) : null;
            this.updateDayModel(dayModel);
        }
        this.updateInput(date);
    }
    updateInput(date) {
        if (date) {
            const dateString = this.dateIOService.toLocaleDisplayFormatString(date);
            if (this.usingNativeDatepicker()) {
                // valueAsDate expects UTC, date from input is time-zoned
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                this.renderer.setProperty(this.el.nativeElement, 'valueAsDate', date);
            }
            else if (this.datepickerHasFormControl() && dateString !== this.control.value) {
                this.control.control.setValue(dateString);
            }
            else {
                this.renderer.setProperty(this.el.nativeElement, 'value', dateString);
            }
            this.validateDateRange();
        }
        else {
            this.renderer.setProperty(this.el.nativeElement, 'value', '');
        }
    }
    getValidDateValueFromDate(date) {
        if (this.dateIOService) {
            const dateString = this.dateIOService.toLocaleDisplayFormatString(date);
            return this.dateIOService.getDateValueFromDateString(dateString);
        }
        else {
            return null;
        }
    }
    emitDateOutput(date) {
        if (!datesAreEqual(date, this.previousDateChange)) {
            this.dateChange.emit(date);
            this.previousDateChange = date;
        }
        else if (!date && this.previousDateChange) {
            this.dateChange.emit(null);
            this.previousDateChange = null;
        }
    }
    listenForControlValueChanges() {
        if (this.datepickerHasFormControl()) {
            return this.control.valueChanges
                .pipe(
            // only update date value if not being set by user
            filter(() => !this.datepickerFocusService.elementIsFocused(this.el.nativeElement)))
                .subscribe((value) => this.updateDate(this.dateIOService.getDateValueFromDateString(value)));
        }
        else {
            return null;
        }
    }
    listenForUserSelectedDayChanges() {
        return this.userSelectedDayChange.subscribe(dayModel => this.updateDate(dayModel?.toDate(), true));
    }
    listenForTouchChanges() {
        return this.dateFormControlService.touchedChange
            .pipe(filter(() => this.datepickerHasFormControl()))
            .subscribe(() => this.control.control.markAsTouched());
    }
    listenForDirtyChanges() {
        return this.dateFormControlService.dirtyChange
            .pipe(filter(() => this.datepickerHasFormControl()))
            .subscribe(() => this.control.control.markAsDirty());
    }
    listenForInputRefocus() {
        return this.dateNavigationService.selectedDayChange
            .pipe(filter(date => !!date && !this.dateNavigationService.isRangePicker))
            .subscribe(() => this.datepickerFocusService.focusInput(this.el.nativeElement));
    }
    /**
     * In case of date range error, both start & end date field validation has to be triggered
     * if either of the field gets updated
     */
    validateDateRange() {
        if (this.dateNavigationService.isRangePicker) {
            const controls = this.ngControlService?.controls;
            const isValid = this.dateNavigationService.selectedDay?.isBefore(this.dateNavigationService.selectedEndDay, true);
            if (isValid && controls?.some(control => control.hasError('range'))) {
                controls.forEach((ngControl) => {
                    ngControl?.control?.updateValueAndValidity({ emitEvent: false });
                });
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDateInputBase, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1$1.NgControl, optional: true, self: true }, { token: forwardRef(() => ClrDateContainer), optional: true }, { token: DateIOService, optional: true }, { token: DateNavigationService, optional: true }, { token: DatepickerEnabledService, optional: true }, { token: DateFormControlService, optional: true }, { token: PLATFORM_ID }, { token: i7.FormsFocusService, optional: true }, { token: DatepickerFocusService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrDateInputBase, isStandalone: true, inputs: { placeholder: "placeholder", disabled: "disabled" }, host: { listeners: { "focus": "setFocusStates()", "change": "onValueChange($event.target)" }, properties: { "disabled": "this.disabled", "attr.placeholder": "this.placeholderText", "attr.type": "this.inputType" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDateInputBase, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1$1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: ClrDateContainer, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [forwardRef(() => ClrDateContainer)]
                }] }, { type: DateIOService, decorators: [{
                    type: Optional
                }] }, { type: DateNavigationService, decorators: [{
                    type: Optional
                }] }, { type: DatepickerEnabledService, decorators: [{
                    type: Optional
                }] }, { type: DateFormControlService, decorators: [{
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i7.FormsFocusService, decorators: [{
                    type: Optional
                }] }, { type: DatepickerFocusService }], propDecorators: { placeholder: [{
                type: Input
            }], disabled: [{
                type: Input,
                args: ['disabled']
            }, {
                type: HostBinding,
                args: ['disabled']
            }], placeholderText: [{
                type: HostBinding,
                args: ['attr.placeholder']
            }], inputType: [{
                type: HostBinding,
                args: ['attr.type']
            }], setFocusStates: [{
                type: HostListener,
                args: ['focus']
            }], onValueChange: [{
                type: HostListener,
                args: ['change', ['$event.target']]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDateInput extends ClrDateInputBase {
    constructor() {
        super(...arguments);
        this.dateChange = new EventEmitter(false);
    }
    set date(date) {
        this.setDate(date);
    }
    set min(dateString) {
        this.dateIOService.setMinDate(dateString);
    }
    set max(dateString) {
        this.dateIOService.setMaxDate(dateString);
    }
    get userSelectedDayChange() {
        return this.dateNavigationService.selectedDayChange;
    }
    updateDayModel(dayModel) {
        this.dateNavigationService.persistedDate = this.dateNavigationService.selectedDay = dayModel;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDateInput, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrDateInput, isStandalone: false, selector: "[clrDate]", inputs: { date: ["clrDate", "date"], min: "min", max: "max" }, outputs: { dateChange: "clrDateChange" }, host: { properties: { "class.clr-input": "true", "class.clr-date-input": "true" } }, providers: [DatepickerFocusService], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDateInput, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrDate]',
                    host: {
                        '[class.clr-input]': 'true',
                        '[class.clr-date-input]': 'true',
                    },
                    providers: [DatepickerFocusService],
                    standalone: false,
                }]
        }], propDecorators: { dateChange: [{
                type: Output,
                args: ['clrDateChange']
            }], date: [{
                type: Input,
                args: ['clrDate']
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrStartDateInput extends ClrDateInputBase {
    constructor() {
        super(...arguments);
        this.dateChange = new EventEmitter(false);
        this.inputWidth = 13;
    }
    set date(date) {
        this.setDate(date);
    }
    get inputSize() {
        return this.inputWidth;
    }
    get userSelectedDayChange() {
        return this.dateNavigationService.selectedDayChange;
    }
    ngOnInit() {
        super.ngOnInit();
        this.subscriptions.push(this.dateIOService.minDateChange.subscribe(() => this.triggerControlInputValidation()));
    }
    updateDayModel(dayModel) {
        this.dateNavigationService.persistedDate = this.dateNavigationService.selectedDay = dayModel;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStartDateInput, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrStartDateInput, isStandalone: false, selector: "[clrStartDate]", inputs: { inputWidth: "inputWidth", date: ["clrStartDate", "date"] }, outputs: { dateChange: "clrStartDateChange" }, host: { properties: { "class.clr-input": "true", "class.clr-date-start-input": "true", "style.text-align": "'right'", "attr.size": "this.inputSize" } }, providers: [DatepickerFocusService], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStartDateInput, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrStartDate]',
                    host: {
                        '[class.clr-input]': 'true',
                        '[class.clr-date-start-input]': 'true',
                        '[style.text-align]': "'right'",
                    },
                    providers: [DatepickerFocusService],
                    standalone: false,
                }]
        }], propDecorators: { dateChange: [{
                type: Output,
                args: ['clrStartDateChange']
            }], inputWidth: [{
                type: Input,
                args: ['inputWidth']
            }], date: [{
                type: Input,
                args: ['clrStartDate']
            }], inputSize: [{
                type: HostBinding,
                args: ['attr.size']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrEndDateInput extends ClrDateInputBase {
    constructor() {
        super(...arguments);
        this.dateChange = new EventEmitter(false);
        this.inputWidth = 13;
    }
    set date(date) {
        this.setDate(date);
    }
    get inputSize() {
        return this.inputWidth;
    }
    get userSelectedDayChange() {
        return this.dateNavigationService.selectedEndDayChange;
    }
    ngOnInit() {
        super.ngOnInit();
        this.subscriptions.push(this.dateIOService.maxDateChange.subscribe(() => this.triggerControlInputValidation()));
    }
    updateDayModel(dayModel) {
        this.dateNavigationService.persistedEndDate = this.dateNavigationService.selectedEndDay = dayModel;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrEndDateInput, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrEndDateInput, isStandalone: false, selector: "[clrEndDate]", inputs: { inputWidth: "inputWidth", date: ["clrEndDate", "date"] }, outputs: { dateChange: "clrEndDateChange" }, host: { properties: { "class.clr-input": "true", "class.clr-date-end-input": "true", "attr.size": "this.inputSize" } }, providers: [DatepickerFocusService], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrEndDateInput, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrEndDate]',
                    host: {
                        '[class.clr-input]': 'true',
                        '[class.clr-date-end-input]': 'true',
                    },
                    providers: [DatepickerFocusService],
                    standalone: false,
                }]
        }], propDecorators: { dateChange: [{
                type: Output,
                args: ['clrEndDateChange']
            }], inputWidth: [{
                type: Input,
                args: ['inputWidth']
            }], date: [{
                type: Input,
                args: ['clrEndDate']
            }], inputSize: [{
                type: HostBinding,
                args: ['attr.size']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDateInputValidator {
    constructor(dateIOService) {
        this.dateIOService = dateIOService;
    }
    validate(control) {
        if (this.dateIOService) {
            const value = this.dateIOService.getDateValueFromDateString(control.value);
            const minDate = this.dateIOService.disabledDates.minDate.toDate();
            const maxDate = this.dateIOService.disabledDates.maxDate.toDate();
            if (value && value < minDate) {
                return { min: { min: minDate.toLocaleDateString(), actual: value.toLocaleDateString() } };
            }
            else if (value && value > maxDate) {
                return { max: { max: maxDate.toLocaleDateString(), actual: value.toLocaleDateString() } };
            }
        }
        return null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDateInputValidator, deps: [{ token: DateIOService, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrDateInputValidator, isStandalone: false, selector: "[clrDate], [clrStartDate], [clrEndDate]", providers: [{ provide: NG_VALIDATORS, useExisting: ClrDateInputValidator, multi: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDateInputValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrDate], [clrStartDate], [clrEndDate]',
                    providers: [{ provide: NG_VALIDATORS, useExisting: ClrDateInputValidator, multi: true }],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: DateIOService, decorators: [{
                    type: Optional
                }] }] });
class ClrStartDateInputValidator {
    constructor(dateIOService, dateNavigationService) {
        this.dateIOService = dateIOService;
        this.dateNavigationService = dateNavigationService;
    }
    validate(control) {
        if (this.dateIOService) {
            const value = this.dateIOService.getDateValueFromDateString(control.value);
            const endDate = this.dateNavigationService?.selectedEndDay?.toDate();
            if (value && endDate && value > endDate) {
                return { range: { startDate: value, endDate } };
            }
        }
        return null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStartDateInputValidator, deps: [{ token: DateIOService, optional: true }, { token: DateNavigationService, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrStartDateInputValidator, isStandalone: false, selector: "[clrStartDate]", providers: [{ provide: NG_VALIDATORS, useExisting: ClrStartDateInputValidator, multi: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrStartDateInputValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrStartDate]',
                    providers: [{ provide: NG_VALIDATORS, useExisting: ClrStartDateInputValidator, multi: true }],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: DateIOService, decorators: [{
                    type: Optional
                }] }, { type: DateNavigationService, decorators: [{
                    type: Optional
                }] }] });
class ClrEndDateInputValidator {
    constructor(dateIOService, dateNavigationService) {
        this.dateIOService = dateIOService;
        this.dateNavigationService = dateNavigationService;
    }
    validate(control) {
        if (this.dateIOService) {
            const value = this.dateIOService.getDateValueFromDateString(control.value);
            const startDate = this.dateNavigationService?.selectedDay?.toDate();
            if (value && startDate && value < startDate) {
                return { range: { startDate, endDate: value } };
            }
        }
        return null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrEndDateInputValidator, deps: [{ token: DateIOService, optional: true }, { token: DateNavigationService, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrEndDateInputValidator, isStandalone: false, selector: "[clrEndDate]", providers: [{ provide: NG_VALIDATORS, useExisting: ClrEndDateInputValidator, multi: true }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrEndDateInputValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrEndDate]',
                    providers: [{ provide: NG_VALIDATORS, useExisting: ClrEndDateInputValidator, multi: true }],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: DateIOService, decorators: [{
                    type: Optional
                }] }, { type: DateNavigationService, decorators: [{
                    type: Optional
                }] }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_DATEPICKER_DIRECTIVES = [
    ClrDateInput,
    ClrDay,
    ClrDateContainer,
    ClrDateInputValidator,
    ClrStartDateInput,
    ClrEndDateInput,
    ClrStartDateInputValidator,
    ClrEndDateInputValidator,
    ClrDatepickerViewManager,
    ClrMonthpicker,
    ClrYearpicker,
    ClrDaypicker,
    ClrCalendar,
    ClrDatepickerActions,
];
class ClrDatepickerModule {
    constructor() {
        ClarityIcons.addIcons(exclamationCircleIcon, checkCircleIcon, angleIcon, eventIcon, calendarIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDatepickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrDatepickerModule, declarations: [ClrDateInput,
            ClrDay,
            ClrDateContainer,
            ClrDateInputValidator,
            ClrStartDateInput,
            ClrEndDateInput,
            ClrStartDateInputValidator,
            ClrEndDateInputValidator,
            ClrDatepickerViewManager,
            ClrMonthpicker,
            ClrYearpicker,
            ClrDaypicker,
            ClrCalendar,
            ClrDatepickerActions], imports: [CommonModule,
            CdkTrapFocusModule,
            ClrHostWrappingModule,
            ClrConditionalModule,
            _lrClrPopoverModuleNext,
            ClrIcon,
            ClrCommonFormsModule,
            ClrVerticalNavModule], exports: [ClrDateInput,
            ClrDay,
            ClrDateContainer,
            ClrDateInputValidator,
            ClrStartDateInput,
            ClrEndDateInput,
            ClrStartDateInputValidator,
            ClrEndDateInputValidator,
            ClrDatepickerViewManager,
            ClrMonthpicker,
            ClrYearpicker,
            ClrDaypicker,
            ClrCalendar,
            ClrDatepickerActions] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDatepickerModule, imports: [CommonModule,
            CdkTrapFocusModule,
            ClrHostWrappingModule,
            ClrConditionalModule,
            _lrClrPopoverModuleNext,
            ClrIcon,
            ClrCommonFormsModule,
            ClrVerticalNavModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrDatepickerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        CdkTrapFocusModule,
                        ClrHostWrappingModule,
                        ClrConditionalModule,
                        _lrClrPopoverModuleNext,
                        ClrIcon,
                        ClrCommonFormsModule,
                        ClrVerticalNavModule,
                    ],
                    declarations: [CLR_DATEPICKER_DIRECTIVES],
                    exports: [CLR_DATEPICKER_DIRECTIVES],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CLR_DATEPICKER_DIRECTIVES, ClrCalendar, ClrDateContainer, ClrDateInput, ClrDateInputBase, ClrDateInputValidator, ClrDatepickerActions, ClrDatepickerModule, ClrDatepickerViewManager, ClrDay, ClrDaypicker, ClrEndDateInput, ClrEndDateInputValidator, ClrMonthpicker, ClrStartDateInput, ClrStartDateInputValidator, ClrYearpicker };
//# sourceMappingURL=clr-angular-forms-datepicker.mjs.map
