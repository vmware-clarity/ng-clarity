import * as i5 from "@angular/common";
import { CommonModule, FormStyle, FormatWidth, TranslationWidth, getLocaleDateFormat, getLocaleDayNames, getLocaleFirstDayOfWeek, getLocaleMonthNames, isPlatformBrowser } from "@angular/common";
import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, Component, DOCUMENT, Directive, EventEmitter, HostBinding, HostListener, Inject, Injectable, Input, LOCALE_ID, NgModule, Optional, Output, PLATFORM_ID, Self, ViewChild, afterNextRender, forwardRef } from "@angular/core";
import * as i7 from "@clr/angular/forms/common";
import { ClrAbstractContainer, ClrCommonFormsModule, ControlClassService, ControlIdService, FormsFocusService, NgControlService, WrappedFormControl } from "@clr/angular/forms/common";
import * as i5$1 from "@clr/angular/utils";
import { CdkTrapFocusModule, ClrConditionalModule, ClrHostWrappingModule, DATEPICKER_ENABLE_BREAKPOINT, Keys, isBooleanAttributeSet } from "@clr/angular/utils";
import { filter, startWith } from "rxjs/operators";
import * as i6$1 from "@clr/angular/popover/common";
import { ClrPopoverHostDirective, ClrPopoverModuleNext, ClrPopoverPosition, ClrPopoverType, DROPDOWN_POSITIONS } from "@clr/angular/popover/common";
import { Subject, tap } from "rxjs";
import * as i6$2 from "@clr/angular/icon";
import { ClarityIcons, ClrIcon, angleIcon, calendarIcon, errorStandardIcon, eventIcon, successStandardIcon } from "@clr/angular/icon";
import * as i6 from "@clr/angular/layout/vertical-nav";
import { ClrVerticalNavModule } from "@clr/angular/layout/vertical-nav";
import * as i1 from "@angular/forms";
import { NG_VALIDATORS } from "@angular/forms";
var DateFormControlService = class DateFormControlService {
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
	setDisabled(state) {
		this.disabled = state;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DateFormControlService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DateFormControlService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DateFormControlService,
	decorators: [{ type: Injectable }]
});
var DayModel = class DayModel {
	constructor(year, month, date) {
		this.year = year;
		this.month = month;
		this.date = date;
	}
	isEqual(day) {
		if (day) return this.year === day.year && this.month === day.month && this.date === day.date;
		return false;
	}
	toDate() {
		return new Date(this.year, this.month, this.date);
	}
	incrementBy(value) {
		const date = new Date(this.year, this.month, this.date + value);
		return new DayModel(date.getFullYear(), date.getMonth(), date.getDate());
	}
	clone() {
		return new DayModel(this.year, this.month, this.date);
	}
	toComparisonString() {
		return `${this.year}${this.pad(this.month)}${this.pad(this.date)}`;
	}
	toDateString() {
		return this.toDate().toLocaleDateString(void 0, {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric"
		});
	}
	isBefore(day, dayInclusive = false) {
		return dayInclusive ? this.toDate().getTime() <= day?.toDate().getTime() : this.toDate().getTime() < day?.toDate().getTime();
	}
	isAfter(day, dayInclusive = false) {
		return dayInclusive ? this.toDate().getTime() >= day?.toDate().getTime() : this.toDate().getTime() > day?.toDate().getTime();
	}
	pad(num) {
		return num < 10 ? `0${num}` : `${num}`;
	}
};
const LITTLE_ENDIAN_REGEX = /d+.+m+.+y+/i;
const MIDDLE_ENDIAN_REGEX = /m+.+d+.+y+/i;
const DELIMITER_REGEX = /d+|m+|y+/i;
const USER_INPUT_REGEX = /\d+/g;
const MOBILE_USERAGENT_REGEX = /Mobi/i;
const RTL_REGEX = /\u200f/g;
const YEAR = "YYYY";
const LITTLE_ENDIAN = {
	name: "LITTLE_ENDIAN",
	format: [
		"DD",
		"MM",
		YEAR
	]
};
const MIDDLE_ENDIAN = {
	name: "MIDDLE_ENDIAN",
	format: [
		"MM",
		"DD",
		YEAR
	]
};
const BIG_ENDIAN = {
	name: "BIG_ENDIAN",
	format: [
		YEAR,
		"MM",
		"DD"
	]
};
function getNumberOfDaysInTheMonth(year, month) {
	return new Date(year, month + 1, 0).getDate();
}
function getDay(year, month, date) {
	return new Date(year, month, date).getDay();
}
function parseToFourDigitYear(year) {
	if (year > 9999 || year > 100 && year < 999 || year < 10) return -1;
	if (year > 999) return year;
	const currYear = (/* @__PURE__ */ new Date()).getFullYear();
	let result = year + Math.floor(currYear / 100) * 100;
	if (result > currYear + 20) result = result - 100;
	return result;
}
function datesAreEqual(date1, date2) {
	if (date1 instanceof Date && date2 instanceof Date) return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
	else return false;
}
var ClrLocaleDateFormat = class {
	constructor(locale) {
		this.locale = locale;
		const localeDateFormat = getLocaleDateFormat(locale, FormatWidth.Short);
		this.displayFormat = this.getDisplayFormat(localeDateFormat);
		this.delimiters = this.extractDelimiters(localeDateFormat) ?? ["/", "/"];
	}
	get placeholder() {
		const format = this.displayFormat.format;
		return format[0] + this.delimiters[0] + format[1] + this.delimiters[1] + format[2];
	}
	format(date) {
		if (date) {
			if (isNaN(date.getTime())) return "";
			const dateNo = date.getDate();
			const monthNo = date.getMonth() + 1;
			const dateStr = dateNo > 9 ? dateNo.toString() : "0" + dateNo;
			const monthStr = monthNo > 9 ? monthNo.toString() : "0" + monthNo;
			if (this.displayFormat === LITTLE_ENDIAN) return dateStr + this.delimiters[0] + monthStr + this.delimiters[1] + date.getFullYear();
			else if (this.displayFormat === MIDDLE_ENDIAN) return monthStr + this.delimiters[0] + dateStr + this.delimiters[1] + date.getFullYear();
			else return date.getFullYear() + this.delimiters[0] + monthStr + this.delimiters[1] + dateStr;
		}
		return "";
	}
	parse(text) {
		if (!text || typeof text !== "string") return null;
		const dateParts = text.match(USER_INPUT_REGEX);
		if (!dateParts || dateParts.length !== 3) return null;
		const [firstPart, secondPart, thirdPart] = dateParts;
		if (this.displayFormat === LITTLE_ENDIAN) return this.validateAndGetDate(thirdPart, secondPart, firstPart);
		else if (this.displayFormat === MIDDLE_ENDIAN) return this.validateAndGetDate(thirdPart, firstPart, secondPart);
		else return this.validateAndGetDate(firstPart, secondPart, thirdPart);
	}
	getDisplayFormat(localeDateFormat) {
		const format = localeDateFormat.toLocaleLowerCase();
		if (LITTLE_ENDIAN_REGEX.test(format)) return LITTLE_ENDIAN;
		else if (MIDDLE_ENDIAN_REGEX.test(format)) return MIDDLE_ENDIAN;
		return BIG_ENDIAN;
	}
	extractDelimiters(localeDateFormat) {
		if (localeDateFormat) {
			const delimiters = localeDateFormat.replace(RTL_REGEX, "").split(DELIMITER_REGEX);
			if (delimiters && delimiters.length === 4) return [delimiters[1], delimiters[2]];
			console.error("Unexpected date format received. Delimiters extracted: ", delimiters);
		}
		return null;
	}
	isValidMonth(month) {
		return month > -1 && month < 12;
	}
	isValidDate(year, month, date) {
		return date > 0 && date <= getNumberOfDaysInTheMonth(year, month);
	}
	validateAndGetDate(year, month, date) {
		const y = +year;
		const m = +month - 1;
		const d = +date;
		if (!this.isValidMonth(m) || !this.isValidDate(y, m, d)) return null;
		const result = parseToFourDigitYear(y);
		return result !== -1 ? new Date(result, m, d) : null;
	}
};
var ClrWeekday;
(function(ClrWeekday) {
	ClrWeekday[ClrWeekday["Sunday"] = 0] = "Sunday";
	ClrWeekday[ClrWeekday["Monday"] = 1] = "Monday";
	ClrWeekday[ClrWeekday["Tuesday"] = 2] = "Tuesday";
	ClrWeekday[ClrWeekday["Wednesday"] = 3] = "Wednesday";
	ClrWeekday[ClrWeekday["Thursday"] = 4] = "Thursday";
	ClrWeekday[ClrWeekday["Friday"] = 5] = "Friday";
	ClrWeekday[ClrWeekday["Saturday"] = 6] = "Saturday";
})(ClrWeekday || (ClrWeekday = {}));
var LocaleHelperService = class LocaleHelperService {
	constructor(locale) {
		this.locale = locale;
		this._firstDayOfWeek = ClrWeekday.Sunday;
		this.initializeLocaleData();
	}
	get firstDayOfWeek() {
		return this._firstDayOfWeek;
	}
	get localeDays() {
		return this._localeDays;
	}
	get localeDaysNarrow() {
		return this._localeDays.map((day) => day.narrow);
	}
	get localeMonthsAbbreviated() {
		return this._localeMonthsAbbreviated;
	}
	get localeMonthsWide() {
		return this._localeMonthsWide;
	}
	updateFirstDayOfWeek(day) {
		if (day === null || day < ClrWeekday.Sunday || day > ClrWeekday.Saturday) {
			this.initializeLocaleFirstDayOfWeek();
			this.initializeLocaleDays();
			return;
		}
		this._firstDayOfWeek = day;
		this.initializeLocaleDays();
	}
	initializeLocaleData() {
		this.initializeLocaleFirstDayOfWeek();
		this.initializeLocaleMonthsAbbreviated();
		this.initializeLocaleMonthsWide();
		this.initializeLocaleDays();
	}
	initializeLocaleDays() {
		const tempArr = [];
		const tempWideArr = getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Wide).slice();
		const tempNarrowArr = getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Narrow).slice();
		for (let i = 0; i < 7; i++) tempArr.push({
			day: tempWideArr[i],
			narrow: tempNarrowArr[i]
		});
		if (this.firstDayOfWeek > ClrWeekday.Sunday) {
			const prevDays = tempArr.splice(0, this.firstDayOfWeek);
			tempArr.push(...prevDays);
		}
		this._localeDays = tempArr;
	}
	initializeLocaleMonthsAbbreviated() {
		this._localeMonthsAbbreviated = getLocaleMonthNames(this.locale, FormStyle.Standalone, TranslationWidth.Abbreviated).slice();
	}
	initializeLocaleMonthsWide() {
		this._localeMonthsWide = getLocaleMonthNames(this.locale, FormStyle.Standalone, TranslationWidth.Wide).slice();
	}
	initializeLocaleFirstDayOfWeek() {
		this._firstDayOfWeek = getLocaleFirstDayOfWeek(this.locale);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: LocaleHelperService,
			deps: [{ token: LOCALE_ID }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: LocaleHelperService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: LocaleHelperService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{
		type: void 0,
		decorators: [{
			type: Inject,
			args: [LOCALE_ID]
		}]
	}]
});
var DateIOService = class DateIOService {
	constructor(localeHelperService) {
		this.disabledDates = {
			minDate: new DayModel(0, 0, 1),
			maxDate: new DayModel(9999, 11, 31)
		};
		this.minDateChange = new Subject();
		this.maxDateChange = new Subject();
		this.localeDateFormat = new ClrLocaleDateFormat(localeHelperService.locale);
	}
	get placeholderText() {
		return this.localeDateFormat.placeholder;
	}
	setMinDate(date) {
		if (!date) this.disabledDates.minDate = new DayModel(0, 0, 1);
		else {
			const [year, month, day] = date.split("-").map((n) => parseInt(n, 10));
			this.disabledDates.minDate = new DayModel(year, month - 1, day);
		}
		this.minDateChange.next(this.disabledDates.minDate);
	}
	setMaxDate(date) {
		if (!date) this.disabledDates.maxDate = new DayModel(9999, 11, 31);
		else {
			const [year, month, day] = date.split("-").map((n) => parseInt(n, 10));
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
		return this.localeDateFormat.format(date);
	}
	getDateValueFromDateString(date) {
		return this.localeDateFormat.parse(date);
	}
	validateDateRangeOptions(rangeOptions) {
		const validOptions = [];
		rangeOptions?.forEach((rangeOption) => {
			if (rangeOption?.value?.length !== 2 || Object.prototype.toString.call(rangeOption?.value[0]) !== "[object Date]" || Object.prototype.toString.call(rangeOption?.value[1]) !== "[object Date]") return;
			validOptions.push(rangeOption);
		});
		return validOptions;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DateIOService,
			deps: [{ token: LocaleHelperService }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DateIOService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DateIOService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{ type: LocaleHelperService }]
});
var CalendarModel = class CalendarModel {
	constructor(year, month) {
		this.year = year;
		this.month = month;
		this.initializeDaysInCalendar();
	}
	isEqual(calendar) {
		if (calendar) return this.year === calendar.year && this.month === calendar.month;
		return false;
	}
	isDayInCalendar(day) {
		if (day) return this.year === day.year && this.month === day.month;
		return false;
	}
	previousMonth() {
		if (this.month === 0) return new CalendarModel(this.year - 1, 11);
		else return new CalendarModel(this.year, this.month - 1);
	}
	nextMonth() {
		if (this.month === 11) return new CalendarModel(this.year + 1, 0);
		else return new CalendarModel(this.year, this.month + 1);
	}
	previousYear() {
		return new CalendarModel(this.year - 1, this.month);
	}
	nextYear() {
		return new CalendarModel(this.year + 1, this.month);
	}
	initializeDaysInCalendar() {
		const noOfDaysInCalendar = getNumberOfDaysInTheMonth(this.year, this.month);
		this.days = Array(noOfDaysInCalendar).fill(null).map((_date, index) => {
			return new DayModel(this.year, this.month, index + 1);
		});
	}
};
var DateNavigationService = class DateNavigationService {
	constructor() {
		this.isRangePicker = false;
		this.hasActionButtons = false;
		this._todaysFullDate = /* @__PURE__ */ new Date();
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
	get displayedCalendarChange() {
		return this._displayedCalendarChange.asObservable();
	}
	get focusOnCalendarChange() {
		return this._focusOnCalendarChange.asObservable();
	}
	get focusedDayChange() {
		return this._focusedDayChange.asObservable().pipe(tap((day) => this.focusedDay = day));
	}
	get refreshCalendarView() {
		return this._refreshCalendarView.asObservable();
	}
	notifySelectedDayChanged(dayObject, { emitEvent } = { emitEvent: true }) {
		if (this.isRangePicker) {
			const { startDate, endDate } = dayObject;
			if (startDate && endDate) {
				this.setSelectedDay(startDate, emitEvent);
				this.setSelectedEndDay(endDate, emitEvent);
			} else {
				if (endDate !== null) this.setSelectedEndDay(endDate, emitEvent);
				if (startDate !== null) this.setSelectedDay(startDate, emitEvent);
			}
		} else {
			const day = dayObject;
			this.setSelectedDay(day, emitEvent);
		}
		this._refreshCalendarView.next();
	}
	initializeCalendar() {
		this.focusedDay = null;
		this.initializeTodaysDate();
		if (this.selectedDay) this._displayedCalendar = new CalendarModel(this.selectedDay.year, this.selectedDay.month);
		else this._displayedCalendar = new CalendarModel(this.today.year, this.today.month);
	}
	changeMonth(month) {
		this.setDisplayedCalendar(new CalendarModel(this._displayedCalendar.year, month));
	}
	changeYear(year) {
		this.setDisplayedCalendar(new CalendarModel(year, this._displayedCalendar.month));
	}
	moveToNextMonth() {
		this.setDisplayedCalendar(this._displayedCalendar.nextMonth());
	}
	moveToPreviousMonth() {
		this.setDisplayedCalendar(this._displayedCalendar.previousMonth());
	}
	moveToNextYear() {
		this.setDisplayedCalendar(this._displayedCalendar.nextYear());
	}
	moveToPreviousYear() {
		this.setDisplayedCalendar(this._displayedCalendar.previousYear());
	}
	moveToCurrentMonth() {
		if (!this.displayedCalendar.isDayInCalendar(this.today)) this.setDisplayedCalendar(new CalendarModel(this.today.year, this.today.month));
		this._focusOnCalendarChange.next();
	}
	moveToSpecificMonth(day) {
		if (!this.displayedCalendar.isDayInCalendar(day)) this.setDisplayedCalendar(new CalendarModel(day.year, day.month));
	}
	incrementFocusDay(value) {
		this.hoveredDay = this.focusedDay = this.focusedDay.incrementBy(value);
		if (this._displayedCalendar.isDayInCalendar(this.focusedDay)) this._focusedDayChange.next(this.focusedDay);
		else this.setDisplayedCalendar(new CalendarModel(this.focusedDay.year, this.focusedDay.month));
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
		if (emitEvent) this._selectedDayChange.next(dayModel);
	}
	setSelectedEndDay(dayModel, emitEvent) {
		this.selectedEndDay = dayModel;
		if (emitEvent) this._selectedEndDayChange.next(dayModel);
	}
	setDisplayedCalendar(value) {
		if (!this._displayedCalendar.isEqual(value)) {
			this._displayedCalendar = value;
			this._displayedCalendarChange.next();
		}
	}
	initializeTodaysDate() {
		this._todaysFullDate = /* @__PURE__ */ new Date();
		this._today = new DayModel(this._todaysFullDate.getFullYear(), this._todaysFullDate.getMonth(), this._todaysFullDate.getDate());
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DateNavigationService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DateNavigationService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DateNavigationService,
	decorators: [{ type: Injectable }]
});
var DatepickerEnabledService = class DatepickerEnabledService {
	constructor(_document) {
		this._document = _document;
		this._isUserAgentMobile = false;
		if (_document) {
			this._isUserAgentMobile = MOBILE_USERAGENT_REGEX.test(_document.defaultView.navigator.userAgent);
			this._innerWidth = _document.defaultView.innerWidth;
		}
	}
	get isEnabled() {
		if (this._document) {
			if (this._innerWidth < DATEPICKER_ENABLE_BREAKPOINT && this._isUserAgentMobile) return false;
		}
		return true;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatepickerEnabledService,
			deps: [{ token: DOCUMENT }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatepickerEnabledService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatepickerEnabledService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{
		type: void 0,
		decorators: [{
			type: Inject,
			args: [DOCUMENT]
		}]
	}]
});
var ViewManagerService = class ViewManagerService {
	constructor() {
		this.position = ClrPopoverPosition.BOTTOM_LEFT;
		this._currentView = "DAYVIEW";
	}
	get isDayView() {
		return this._currentView === "DAYVIEW";
	}
	get isYearView() {
		return this._currentView === "YEARVIEW";
	}
	get isMonthView() {
		return this._currentView === "MONTHVIEW";
	}
	changeToMonthView() {
		this._currentView = "MONTHVIEW";
	}
	changeToYearView() {
		this._currentView = "YEARVIEW";
	}
	changeToDayView() {
		this._currentView = "DAYVIEW";
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ViewManagerService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ViewManagerService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ViewManagerService,
	decorators: [{ type: Injectable }]
});
var DatepickerFocusService = class DatepickerFocusService {
	constructor(injector, platformId) {
		this.injector = injector;
		this.platformId = platformId;
	}
	focusCell(elRef) {
		if (isPlatformBrowser(this.platformId)) afterNextRender(() => elRef.nativeElement.querySelector("[tabindex=\"0\"]")?.focus(), { injector: this.injector });
	}
	focusInput(element) {
		if (isPlatformBrowser(this.platformId)) afterNextRender(() => element.focus(), { injector: this.injector });
	}
	elementIsFocused(element) {
		return isPlatformBrowser(this.platformId) && document.activeElement === element;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatepickerFocusService,
			deps: [{ token: i0.Injector }, { token: PLATFORM_ID }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatepickerFocusService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatepickerFocusService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{ type: i0.Injector }, {
		type: void 0,
		decorators: [{
			type: Inject,
			args: [PLATFORM_ID]
		}]
	}]
});
var ClrMonthpicker = class ClrMonthpicker {
	constructor(_localeHelperService, _dateNavigationService, _datepickerFocusService, _elRef, _viewManagerService, commonStrings) {
		this._localeHelperService = _localeHelperService;
		this._dateNavigationService = _dateNavigationService;
		this._datepickerFocusService = _datepickerFocusService;
		this._elRef = _elRef;
		this._viewManagerService = _viewManagerService;
		this.commonStrings = commonStrings;
		this._focusedMonthIndex = this.calendarMonthIndex;
	}
	get monthNames() {
		return this._localeHelperService.localeMonthsWide;
	}
	get calendarMonthIndex() {
		return this._dateNavigationService.displayedCalendar.month;
	}
	get calendarEndMonthIndex() {
		return this._dateNavigationService.selectedEndDay?.month;
	}
	get yearAttrString() {
		return this.commonStrings.parse(this.commonStrings.keys.datepickerSelectYearText, { CALENDAR_YEAR: this.calendarYear.toString() });
	}
	get calendarYear() {
		return this._dateNavigationService.displayedCalendar.year;
	}
	get currentCalendarYear() {
		return (/* @__PURE__ */ new Date()).getFullYear();
	}
	get currentCalendarMonth() {
		return (/* @__PURE__ */ new Date()).getMonth();
	}
	getIsRangeStartMonth(monthIndex) {
		return this._dateNavigationService.isRangePicker && this.calendarYear === this._dateNavigationService.selectedDay?.year && monthIndex === this._dateNavigationService.selectedDay?.month;
	}
	getIsRangeEndMonth(monthIndex) {
		return this._dateNavigationService.isRangePicker && this.calendarYear === this._dateNavigationService.selectedEndDay?.year && monthIndex === this._dateNavigationService.selectedEndDay?.month;
	}
	changeToYearView() {
		this._viewManagerService.changeToYearView();
	}
	ngAfterViewInit() {
		this._datepickerFocusService.focusCell(this._elRef);
	}
	onKeyDown(event) {
		if (event) {
			const key = event.key;
			if (key === Keys.ArrowUp && this._focusedMonthIndex > 1) {
				event.preventDefault();
				this._focusedMonthIndex -= 2;
				this._datepickerFocusService.focusCell(this._elRef);
			} else if (key === Keys.ArrowDown && this._focusedMonthIndex < 10) {
				event.preventDefault();
				this._focusedMonthIndex += 2;
				this._datepickerFocusService.focusCell(this._elRef);
			} else if (key === Keys.ArrowRight && this._focusedMonthIndex < 11) {
				event.preventDefault();
				this._focusedMonthIndex++;
				this._datepickerFocusService.focusCell(this._elRef);
			} else if (key === Keys.ArrowLeft && this._focusedMonthIndex > 0) {
				event.preventDefault();
				this._focusedMonthIndex--;
				this._datepickerFocusService.focusCell(this._elRef);
			}
		}
	}
	isSelected(monthIndex) {
		return this._dateNavigationService.selectedDay?.year === this.calendarYear && monthIndex === this._dateNavigationService.selectedDay?.month || this._dateNavigationService.selectedEndDay?.year === this.calendarYear && monthIndex === this.calendarEndMonthIndex;
	}
	onHover(monthIndex) {
		this._dateNavigationService.hoveredMonth = monthIndex;
	}
	changeMonth(monthIndex) {
		this._dateNavigationService.changeMonth(monthIndex);
		this._viewManagerService.changeToDayView();
	}
	getTabIndex(monthIndex) {
		return monthIndex === this._focusedMonthIndex ? 0 : -1;
	}
	nextYear() {
		this._dateNavigationService.moveToNextYear();
	}
	previousYear() {
		this._dateNavigationService.moveToPreviousYear();
	}
	currentYear() {
		this._dateNavigationService.moveToCurrentMonth();
	}
	isInRange(monthIndex) {
		if (!this._dateNavigationService.isRangePicker) return false;
		if (this._dateNavigationService.selectedDay && this._dateNavigationService.selectedEndDay) return this.calendarYear === this._dateNavigationService.selectedDay.year && monthIndex > this._dateNavigationService.selectedDay.month && this.calendarYear === this._dateNavigationService.selectedEndDay.year && monthIndex < this._dateNavigationService.selectedEndDay.month || this._dateNavigationService.selectedDay.year !== this._dateNavigationService.selectedEndDay.year && this.calendarYear === this._dateNavigationService.selectedDay.year && monthIndex > this._dateNavigationService.selectedDay.month || this._dateNavigationService.selectedDay.year !== this._dateNavigationService.selectedEndDay.year && this.calendarYear === this._dateNavigationService.selectedEndDay.year && monthIndex < this._dateNavigationService.selectedEndDay.month || this.calendarYear > this._dateNavigationService.selectedDay.year && this.calendarYear < this._dateNavigationService.selectedEndDay.year;
		else if (this._dateNavigationService.selectedDay && !this._dateNavigationService.selectedEndDay) return this.calendarYear === this._dateNavigationService.selectedDay.year && monthIndex > this._dateNavigationService.selectedDay.month && monthIndex < this._dateNavigationService.hoveredMonth || this.calendarYear > this._dateNavigationService.selectedDay.year && monthIndex < this._dateNavigationService.hoveredMonth;
		else return false;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrMonthpicker,
			deps: [
				{ token: LocaleHelperService },
				{ token: DateNavigationService },
				{ token: DatepickerFocusService },
				{ token: i0.ElementRef },
				{ token: ViewManagerService },
				{ token: i5$1.ClrCommonStringsService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrMonthpicker,
			isStandalone: false,
			selector: "clr-monthpicker",
			host: {
				attributes: { "role": "application" },
				listeners: { "keydown": "onKeyDown($event)" },
				properties: { "class.monthpicker": "true" }
			},
			ngImport: i0,
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
			isInline: true,
			dependencies: [{
				kind: "component",
				type: i6$2.ClrIcon,
				selector: "clr-icon, cds-icon",
				inputs: [
					"shape",
					"size",
					"direction",
					"flip",
					"solid",
					"status",
					"inverse",
					"badge",
					"innerOffset"
				]
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrMonthpicker,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-monthpicker",
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
				"[class.monthpicker]": "true",
				role: "application"
			},
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: LocaleHelperService },
		{ type: DateNavigationService },
		{ type: DatepickerFocusService },
		{ type: i0.ElementRef },
		{ type: ViewManagerService },
		{ type: i5$1.ClrCommonStringsService }
	],
	propDecorators: { onKeyDown: [{
		type: HostListener,
		args: ["keydown", ["$event"]]
	}] }
});
const YEARS_TO_DISPLAY = 10;
var YearRangeModel = class YearRangeModel {
	constructor(year) {
		this.year = year;
		this.yearRange = [];
		this.generateYearRange();
	}
	get middleYear() {
		return this.yearRange[Math.floor(this.yearRange.length / 2)];
	}
	nextDecade() {
		return new YearRangeModel(this.year + 10);
	}
	previousDecade() {
		return new YearRangeModel(this.year - 10);
	}
	currentDecade() {
		return new YearRangeModel((/* @__PURE__ */ new Date()).getFullYear());
	}
	inRange(value) {
		return this.yearRange.indexOf(value) > -1;
	}
	generateYearRange() {
		const remainder = this.year % YEARS_TO_DISPLAY;
		const floor = this.year - remainder;
		const ceil = floor + YEARS_TO_DISPLAY;
		this.yearRange = this.generateRange(floor, ceil);
	}
	generateRange(floor, ceil) {
		return Array.from({ length: ceil - floor }, (_v, k) => k + floor);
	}
};
var ClrYearpicker = class ClrYearpicker {
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
	get calendarYear() {
		return this._dateNavigationService.displayedCalendar.year;
	}
	isCurrentCalendarYear(year) {
		return year === (/* @__PURE__ */ new Date()).getFullYear();
	}
	getIsRangeStartYear(year) {
		return this._dateNavigationService.isRangePicker && year === this._dateNavigationService.selectedDay?.year;
	}
	getIsRangeEndYear(year) {
		return this._dateNavigationService.isRangePicker && year === this._dateNavigationService.selectedEndDay?.year;
	}
	ngAfterViewInit() {
		this._datepickerFocusService.focusCell(this._elRef);
	}
	onKeyDown(event) {
		if (event) {
			const key = event.key;
			if (key === Keys.ArrowUp) {
				event.preventDefault();
				this.incrementFocusYearBy(-2);
			} else if (key === Keys.ArrowDown) {
				event.preventDefault();
				this.incrementFocusYearBy(2);
			} else if (key === Keys.ArrowRight) {
				event.preventDefault();
				this.incrementFocusYearBy(1);
			} else if (key === Keys.ArrowLeft) {
				event.preventDefault();
				this.incrementFocusYearBy(-1);
			}
		}
	}
	changeYear(year) {
		this._dateNavigationService.changeYear(year);
		this._viewManagerService.changeToDayView();
	}
	onHover(year) {
		this._dateNavigationService.hoveredYear = year;
	}
	previousDecade() {
		this.yearRangeModel = this.yearRangeModel.previousDecade();
	}
	currentDecade() {
		if (!this.yearRangeModel.inRange(this._dateNavigationService.today.year)) this.yearRangeModel = this.yearRangeModel.currentDecade();
		this._datepickerFocusService.focusCell(this._elRef);
	}
	nextDecade() {
		this.yearRangeModel = this.yearRangeModel.nextDecade();
	}
	getTabIndex(year) {
		if (!this.yearRangeModel.inRange(this._focusedYear)) {
			if (this.yearRangeModel.inRange(this.calendarYear)) this._focusedYear = this.calendarYear;
			else if (this.yearRangeModel.inRange(this.selectedEndYear)) this._focusedYear = this.selectedEndYear;
			else this._focusedYear = this.yearRangeModel.middleYear;
		}
		return this._focusedYear === year ? 0 : -1;
	}
	isInRange(year) {
		if (!this._dateNavigationService.isRangePicker) return false;
		if (this._dateNavigationService.selectedDay?.year && this.selectedEndYear) return year > this.selectedStartYear && year < this.selectedEndYear;
		else if (this._dateNavigationService.selectedDay?.year && !this.selectedEndYear) return year > this.selectedStartYear && year < this._dateNavigationService.hoveredYear;
		else return false;
	}
	changeToDayView() {
		this._viewManagerService.changeToDayView();
	}
	incrementFocusYearBy(value) {
		this._focusedYear = this._focusedYear + value;
		if (!this.yearRangeModel.inRange(this._focusedYear)) {
			if (value > 0) this.yearRangeModel = this.yearRangeModel.nextDecade();
			else this.yearRangeModel = this.yearRangeModel.previousDecade();
		}
		this._datepickerFocusService.focusCell(this._elRef);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrYearpicker,
			deps: [
				{ token: DateNavigationService },
				{ token: ViewManagerService },
				{ token: DatepickerFocusService },
				{ token: i0.ElementRef },
				{ token: i5$1.ClrCommonStringsService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrYearpicker,
			isStandalone: false,
			selector: "clr-yearpicker",
			host: {
				attributes: { "role": "application" },
				listeners: { "keydown": "onKeyDown($event)" },
				properties: { "class.yearpicker": "true" }
			},
			ngImport: i0,
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
			isInline: true,
			dependencies: [{
				kind: "component",
				type: i6$2.ClrIcon,
				selector: "clr-icon, cds-icon",
				inputs: [
					"shape",
					"size",
					"direction",
					"flip",
					"solid",
					"status",
					"inverse",
					"badge",
					"innerOffset"
				]
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrYearpicker,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-yearpicker",
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
				"[class.yearpicker]": "true",
				role: "application"
			},
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: DateNavigationService },
		{ type: ViewManagerService },
		{ type: DatepickerFocusService },
		{ type: i0.ElementRef },
		{ type: i5$1.ClrCommonStringsService }
	],
	propDecorators: { onKeyDown: [{
		type: HostListener,
		args: ["keydown", ["$event"]]
	}] }
});
var DayViewModel = class {
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
	get tabIndex() {
		return this.isFocusable ? 0 : -1;
	}
};
var CalendarViewModel = class {
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
	get calendarView() {
		return this._calendarView;
	}
	updateFocusableDay(day) {
		this.setFocusableFlag(this.focusableDay, false);
		this.setFocusableFlag(day, true);
		this.focusableDay = day;
	}
	updateSelectedDay(day) {
		this.setSelectedDay(this.selectedDay, false);
		this.selectedDay = day;
		this.setSelectedDay(day, true);
	}
	updateSelectedEndDay(day) {
		this.setSelectedDay(this.selectedEndDay, false);
		this.selectedEndDay = day;
		this.setSelectedDay(day, true);
	}
	initializeCalendarView() {
		const prevMonthCalendar = this.calendar.previousMonth();
		const nextMonthCalendar = this.calendar.nextMonth();
		const daysFromPrevMonthInCalView = this.numDaysFromPrevMonthInCalView(this.calendar.year, this.calendar.month);
		const daysFromNextMonthInCalView = 42 - (this.calendar.days.length + daysFromPrevMonthInCalView);
		let prevMonthDayViews = [];
		let nextMonthDayViews = [];
		if (daysFromPrevMonthInCalView > 0) prevMonthDayViews = this.generateDayViewModels(prevMonthCalendar.days.slice(-1 * daysFromPrevMonthInCalView), true, false);
		this.currMonthDayViews = this.generateDayViewModels(this.calendar.days, false, true);
		if (daysFromNextMonthInCalView > 0) nextMonthDayViews = this.generateDayViewModels(nextMonthCalendar.days.slice(0, daysFromNextMonthInCalView), true, false);
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
	generateDayViewModels(days, isExcluded, isCurrentCalendar) {
		const dayViews = days.map((day) => {
			return new DayViewModel(day, false, isExcluded, this.isDateExcluded(day), false, false);
		});
		if (isCurrentCalendar && this.calendar.isDayInCalendar(this.today)) dayViews[this.today.date - 1].isTodaysDate = true;
		return dayViews;
	}
	numDaysFromPrevMonthInCalView(currentYear, currentMonth) {
		const firstDayOfCurrMonth = getDay(currentYear, currentMonth, 1);
		if (firstDayOfCurrMonth >= this.firstDayOfWeek) return firstDayOfCurrMonth - this.firstDayOfWeek;
		else return 7 + firstDayOfCurrMonth - this.firstDayOfWeek;
	}
	isDayInCalendarView(day) {
		if (!this.calendar.isDayInCalendar(day)) return false;
		return true;
	}
	generateCalendarView(prev, curr, next) {
		const combinationArr = [
			...prev,
			...curr,
			...next
		];
		const calendarView = [];
		for (let i = 0; i < 6; i++) calendarView[i] = combinationArr.slice(i * 7, (i + 1) * 7);
		return calendarView;
	}
	initializeSelectedDay() {
		this.setSelectedDay(this.selectedDay, true);
		this.setSelectedDay(this.selectedEndDay, true);
	}
	initializeFocusableDay() {
		if (this.focusableDay && this.isDayInCalendarView(this.focusableDay)) this.setFocusableFlag(this.focusableDay, true);
		else if (this.selectedDay && this.isDayInCalendarView(this.selectedDay)) {
			this.setFocusableFlag(this.selectedDay, true);
			this.focusableDay = this.selectedDay.clone();
		} else if (this.selectedEndDay && this.isDayInCalendarView(this.selectedEndDay)) {
			this.setFocusableFlag(this.selectedEndDay, true);
			this.focusableDay = this.selectedEndDay.clone();
		} else if (this.isDayInCalendarView(this.today)) {
			this.setFocusableFlag(this.today, true);
			this.focusableDay = this.today.clone();
		} else {
			this.focusableDay = new DayModel(this.calendar.year, this.calendar.month, 15);
			this.setFocusableFlag(this.focusableDay, true);
		}
	}
	setFocusableFlag(day, flag) {
		if (day) this.currMonthDayViews[day.date - 1].isFocusable = flag;
	}
	setSelectedDay(day, flag) {
		if (day && this.isDayInCalendarView(day)) this.currMonthDayViews[day?.date - 1].isSelected = flag;
	}
};
var ClrDay = class ClrDay {
	constructor(_dateNavigationService, commonStrings) {
		this._dateNavigationService = _dateNavigationService;
		this.commonStrings = commonStrings;
		this.onSelectDay = new EventEmitter();
	}
	get dayView() {
		return this._dayView;
	}
	set dayView(day) {
		this._dayView = day;
	}
	get dayString() {
		return this.dayView.isSelected ? this.commonStrings.parse(this.commonStrings.keys.datepickerSelectedLabel, { FULL_DATE: this._dayView.dayModel.toDateString() }) : this._dayView.dayModel.toDateString();
	}
	get isRangeStartDay() {
		return this._dateNavigationService.isRangePicker && this.dayView?.dayModel?.toComparisonString() === this._dateNavigationService.selectedDay?.toComparisonString();
	}
	get isRangeEndDay() {
		return this._dateNavigationService.isRangePicker && this.dayView?.dayModel?.toComparisonString() === this._dateNavigationService.selectedEndDay?.toComparisonString();
	}
	hoverListener() {
		if (!this.dayView.isDisabled) this._dateNavigationService.hoveredDay = this.dayView.dayModel;
	}
	onDayViewFocus() {
		this._dateNavigationService.focusedDay = this.dayView.dayModel;
	}
	selectDay() {
		if (this.dayView.isDisabled) return;
		const day = this.dayView.dayModel;
		this.onSelectDay.emit(day);
	}
	isInRange() {
		if (!this._dateNavigationService.isRangePicker) return false;
		if (this._dateNavigationService.selectedDay && this._dateNavigationService.selectedEndDay) return this._dayView.dayModel?.isAfter(this._dateNavigationService.selectedDay) && this._dayView.dayModel?.isBefore(this._dateNavigationService.selectedEndDay);
		else if (this._dateNavigationService.selectedDay && !this._dateNavigationService.selectedEndDay) return this._dayView.dayModel?.isAfter(this._dateNavigationService.selectedDay) && this._dayView.dayModel?.isBefore(this._dateNavigationService.hoveredDay, true);
		else return false;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDay,
			deps: [{ token: DateNavigationService }, { token: i5$1.ClrCommonStringsService }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDay,
			isStandalone: false,
			selector: "clr-day",
			inputs: { dayView: ["clrDayView", "dayView"] },
			outputs: { onSelectDay: "selectDay" },
			host: {
				listeners: { "mouseenter": "hoverListener()" },
				properties: { "class.day": "true" }
			},
			ngImport: i0,
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
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDay,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-day",
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
			host: { "[class.day]": "true" },
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [{ type: DateNavigationService }, { type: i5$1.ClrCommonStringsService }],
	propDecorators: {
		onSelectDay: [{
			type: Output,
			args: ["selectDay"]
		}],
		dayView: [{
			type: Input,
			args: ["clrDayView"]
		}],
		hoverListener: [{
			type: HostListener,
			args: ["mouseenter"]
		}]
	}
});
var ClrCalendar = class ClrCalendar {
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
	ngAfterViewInit() {
		this._datepickerFocusService.focusCell(this._elRef);
	}
	ngOnDestroy() {
		this._subs.forEach((sub) => sub.unsubscribe());
	}
	onKeyDown(event) {
		if (event && this.focusedDay) switch (event.key) {
			case Keys.ArrowUp:
				event.preventDefault();
				this._dateNavigationService.incrementFocusDay(-7);
				break;
			case Keys.ArrowDown:
				event.preventDefault();
				this._dateNavigationService.incrementFocusDay(7);
				break;
			case Keys.ArrowLeft:
				event.preventDefault();
				this._dateNavigationService.incrementFocusDay(-1);
				break;
			case Keys.ArrowRight:
				event.preventDefault();
				this._dateNavigationService.incrementFocusDay(1);
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
		if (this._dateNavigationService.isRangePicker && this._dateNavigationService.selectedDay && this._dateNavigationService.selectedEndDay || !this._dateNavigationService.isRangePicker && this._dateNavigationService.selectedDay) this._popoverService.open = false;
	}
	updateCalendarViewModal(day) {
		const startDate = this.calendarViewModel.selectedDay || null, isRangePicker = this._dateNavigationService.isRangePicker;
		let endDate = this.calendarViewModel.selectedEndDay || null;
		if (isRangePicker) {
			if (!startDate || !!startDate && !!endDate || !!startDate && day?.isBefore(startDate)) {
				this.calendarViewModel.updateSelectedDay(day);
				if (endDate) {
					endDate = void 0;
					this.calendarViewModel.updateSelectedEndDay(endDate);
				}
			} else this.calendarViewModel.updateSelectedEndDay(day);
		} else this.calendarViewModel.updateSelectedDay(day);
		return isRangePicker ? {
			startDate: this.calendarViewModel.selectedDay,
			endDate: this.calendarViewModel.selectedEndDay
		} : this.calendarViewModel.selectedDay;
	}
	refreshCalendarViewModal() {
		this.calendarViewModel.updateSelectedDay(this._dateNavigationService.selectedDay);
		if (this._dateNavigationService.isRangePicker) this.calendarViewModel.updateSelectedEndDay(this._dateNavigationService.selectedEndDay);
	}
	generateCalendarView() {
		this.calendarViewModel = new CalendarViewModel(this.calendar, this.selectedDay, this.selectedEndDay, this.focusedDay, this.today, this._localeHelperService.firstDayOfWeek, this._dateIOService.disabledDates);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrCalendar,
			deps: [
				{ token: LocaleHelperService },
				{ token: DateNavigationService },
				{ token: DatepickerFocusService },
				{ token: DateIOService },
				{ token: i0.ElementRef },
				{ token: DateFormControlService },
				{ token: i6$1.ClrPopoverService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrCalendar,
			isStandalone: false,
			selector: "clr-calendar",
			host: { listeners: { "keydown": "onKeyDown($event)" } },
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<table class=\"calendar-table\" role=\"presentation\">\n  <tr class=\"calendar-row weekdays\">\n    @for (day of localeDays; track day) {\n    <th class=\"calendar-cell weekday\">\n      <span [attr.aria-label]=\"day.day\">{{day.narrow}}</span>\n    </th>\n    }\n  </tr>\n  @for (row of calendarViewModel.calendarView; track row) {\n  <tr class=\"calendar-row\">\n    @for (dayView of row; track dayView) {\n    <td class=\"calendar-cell\">\n      <clr-day [clrDayView]=\"dayView\" (selectDay)=\"setSelectedDay($event)\"></clr-day>\n    </td>\n    }\n  </tr>\n  }\n</table>\n",
			dependencies: [{
				kind: "component",
				type: ClrDay,
				selector: "clr-day",
				inputs: ["clrDayView"],
				outputs: ["selectDay"]
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrCalendar,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-calendar",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<table class=\"calendar-table\" role=\"presentation\">\n  <tr class=\"calendar-row weekdays\">\n    @for (day of localeDays; track day) {\n    <th class=\"calendar-cell weekday\">\n      <span [attr.aria-label]=\"day.day\">{{day.narrow}}</span>\n    </th>\n    }\n  </tr>\n  @for (row of calendarViewModel.calendarView; track row) {\n  <tr class=\"calendar-row\">\n    @for (dayView of row; track dayView) {\n    <td class=\"calendar-cell\">\n      <clr-day [clrDayView]=\"dayView\" (selectDay)=\"setSelectedDay($event)\"></clr-day>\n    </td>\n    }\n  </tr>\n  }\n</table>\n"
		}]
	}],
	ctorParameters: () => [
		{ type: LocaleHelperService },
		{ type: DateNavigationService },
		{ type: DatepickerFocusService },
		{ type: DateIOService },
		{ type: i0.ElementRef },
		{ type: DateFormControlService },
		{ type: i6$1.ClrPopoverService }
	],
	propDecorators: { onKeyDown: [{
		type: HostListener,
		args: ["keydown", ["$event"]]
	}] }
});
var ClrDaypicker = class ClrDaypicker {
	constructor(_viewManagerService, _dateNavigationService, _localeHelperService, commonStrings) {
		this._viewManagerService = _viewManagerService;
		this._dateNavigationService = _dateNavigationService;
		this._localeHelperService = _localeHelperService;
		this.commonStrings = commonStrings;
	}
	get monthAttrString() {
		return this.commonStrings.parse(this.commonStrings.keys.datepickerSelectMonthText, { CALENDAR_MONTH: this.calendarMonth });
	}
	get yearAttrString() {
		return this.commonStrings.parse(this.commonStrings.keys.datepickerSelectYearText, { CALENDAR_YEAR: this.calendarYear.toString() });
	}
	get calendarMonth() {
		return this._localeHelperService.localeMonthsAbbreviated[this._dateNavigationService.displayedCalendar.month];
	}
	get calendarYear() {
		return this._dateNavigationService.displayedCalendar.year;
	}
	changeToMonthView() {
		this._viewManagerService.changeToMonthView();
	}
	changeToYearView() {
		this._viewManagerService.changeToYearView();
	}
	nextMonth() {
		this._dateNavigationService.moveToNextMonth();
	}
	previousMonth() {
		this._dateNavigationService.moveToPreviousMonth();
	}
	currentMonth() {
		this._dateNavigationService.moveToCurrentMonth();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDaypicker,
			deps: [
				{ token: ViewManagerService },
				{ token: DateNavigationService },
				{ token: LocaleHelperService },
				{ token: i5$1.ClrCommonStringsService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDaypicker,
			isStandalone: false,
			selector: "clr-daypicker",
			host: {
				attributes: { "role": "application" },
				properties: { "class.daypicker": "true" }
			},
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"clr-sr-only\">{{commonStrings.keys.modalContentStart}}</div>\n<div class=\"calendar-header\">\n  <div class=\"calendar-pickers\">\n    <button\n      class=\"calendar-btn monthpicker-trigger\"\n      type=\"button\"\n      (click)=\"changeToMonthView()\"\n      [attr.aria-label]=\"monthAttrString\"\n      [attr.title]=\"monthAttrString\"\n    >\n      {{calendarMonth}}\n    </button>\n    <button\n      class=\"calendar-btn yearpicker-trigger\"\n      type=\"button\"\n      (click)=\"changeToYearView()\"\n      [attr.aria-label]=\"yearAttrString\"\n      [attr.title]=\"yearAttrString\"\n    >\n      {{calendarYear}}\n    </button>\n  </div>\n  <div class=\"calendar-switchers\">\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"previousMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerPreviousMonth\"\n    >\n      <cds-icon shape=\"angle\" direction=\"left\" [attr.title]=\"commonStrings.keys.datepickerPreviousMonth\"></cds-icon>\n    </button>\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"currentMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerCurrentMonth\"\n    >\n      <cds-icon shape=\"event\" [attr.title]=\"commonStrings.keys.datepickerCurrentMonth\"></cds-icon>\n    </button>\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"nextMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerNextMonth\"\n    >\n      <cds-icon shape=\"angle\" direction=\"right\" [attr.title]=\"commonStrings.keys.datepickerNextMonth\"></cds-icon>\n    </button>\n  </div>\n</div>\n<clr-calendar></clr-calendar>\n<div class=\"clr-sr-only\">{{commonStrings.keys.modalContentEnd}}</div>\n",
			dependencies: [{
				kind: "component",
				type: i6$2.ClrIcon,
				selector: "clr-icon, cds-icon",
				inputs: [
					"shape",
					"size",
					"direction",
					"flip",
					"solid",
					"status",
					"inverse",
					"badge",
					"innerOffset"
				]
			}, {
				kind: "component",
				type: ClrCalendar,
				selector: "clr-calendar"
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDaypicker,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-daypicker",
			host: {
				"[class.daypicker]": "true",
				role: "application"
			},
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"clr-sr-only\">{{commonStrings.keys.modalContentStart}}</div>\n<div class=\"calendar-header\">\n  <div class=\"calendar-pickers\">\n    <button\n      class=\"calendar-btn monthpicker-trigger\"\n      type=\"button\"\n      (click)=\"changeToMonthView()\"\n      [attr.aria-label]=\"monthAttrString\"\n      [attr.title]=\"monthAttrString\"\n    >\n      {{calendarMonth}}\n    </button>\n    <button\n      class=\"calendar-btn yearpicker-trigger\"\n      type=\"button\"\n      (click)=\"changeToYearView()\"\n      [attr.aria-label]=\"yearAttrString\"\n      [attr.title]=\"yearAttrString\"\n    >\n      {{calendarYear}}\n    </button>\n  </div>\n  <div class=\"calendar-switchers\">\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"previousMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerPreviousMonth\"\n    >\n      <cds-icon shape=\"angle\" direction=\"left\" [attr.title]=\"commonStrings.keys.datepickerPreviousMonth\"></cds-icon>\n    </button>\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"currentMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerCurrentMonth\"\n    >\n      <cds-icon shape=\"event\" [attr.title]=\"commonStrings.keys.datepickerCurrentMonth\"></cds-icon>\n    </button>\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"nextMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerNextMonth\"\n    >\n      <cds-icon shape=\"angle\" direction=\"right\" [attr.title]=\"commonStrings.keys.datepickerNextMonth\"></cds-icon>\n    </button>\n  </div>\n</div>\n<clr-calendar></clr-calendar>\n<div class=\"clr-sr-only\">{{commonStrings.keys.modalContentEnd}}</div>\n"
		}]
	}],
	ctorParameters: () => [
		{ type: ViewManagerService },
		{ type: DateNavigationService },
		{ type: LocaleHelperService },
		{ type: i5$1.ClrCommonStringsService }
	]
});
var ClrDatepickerActions = class ClrDatepickerActions {
	constructor(commonStrings, popoverService, dateNavigationService, dateFormControlService) {
		this.commonStrings = commonStrings;
		this.popoverService = popoverService;
		this.dateNavigationService = dateNavigationService;
		this.dateFormControlService = dateFormControlService;
	}
	apply() {
		if (this.dateNavigationService.isRangePicker && this.dateNavigationService.selectedDay && this.dateNavigationService.selectedEndDay) {
			this.dateNavigationService.notifySelectedDayChanged({
				startDate: this.dateNavigationService.selectedDay,
				endDate: this.dateNavigationService.selectedEndDay
			});
			this.dateFormControlService.markAsDirty();
		} else if (!this.dateNavigationService.isRangePicker && this.dateNavigationService.selectedDay) {
			this.dateNavigationService.notifySelectedDayChanged(this.dateNavigationService.selectedDay);
			this.dateFormControlService.markAsDirty();
		}
		this.popoverService.open = false;
	}
	cancel() {
		this.dateNavigationService.resetSelectedDay();
		this.popoverService.open = false;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatepickerActions,
			deps: [
				{ token: i5$1.ClrCommonStringsService },
				{ token: i6$1.ClrPopoverService },
				{ token: DateNavigationService },
				{ token: DateFormControlService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDatepickerActions,
			isStandalone: false,
			selector: "clr-datepicker-actions",
			host: { properties: { "class.datepicker-actions": "true" } },
			ngImport: i0,
			template: `
    <button class="btn btn-outline" (click)="cancel()">{{ commonStrings.keys.cancel }}</button>
    <button class="btn btn-primary" (click)="apply()">{{ commonStrings.keys.apply }}</button>
  `,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatepickerActions,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-datepicker-actions",
			template: `
    <button class="btn btn-outline" (click)="cancel()">{{ commonStrings.keys.cancel }}</button>
    <button class="btn btn-primary" (click)="apply()">{{ commonStrings.keys.apply }}</button>
  `,
			host: { "[class.datepicker-actions]": "true" },
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: i5$1.ClrCommonStringsService },
		{ type: i6$1.ClrPopoverService },
		{ type: DateNavigationService },
		{ type: DateFormControlService }
	]
});
var ClrDatepickerViewManager = class ClrDatepickerViewManager {
	constructor(commonStrings, viewManagerService, dateNavigationService, dateIOService) {
		this.commonStrings = commonStrings;
		this.viewManagerService = viewManagerService;
		this.dateNavigationService = dateNavigationService;
		this.dateIOService = dateIOService;
	}
	get isMonthView() {
		return this.viewManagerService.isMonthView;
	}
	get isYearView() {
		return this.viewManagerService.isYearView;
	}
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
		this.dateNavigationService.notifySelectedDayChanged({
			startDate,
			endDate
		}, { emitEvent: !this.hasActionButtons });
		this.dateNavigationService.moveToSpecificMonth(startDate);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatepickerViewManager,
			deps: [
				{ token: i5$1.ClrCommonStringsService },
				{ token: ViewManagerService },
				{ token: DateNavigationService },
				{ token: DateIOService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrDatepickerViewManager,
			isStandalone: false,
			selector: "clr-datepicker-view-manager",
			host: {
				attributes: { "role": "dialog" },
				properties: {
					"class.datepicker": "true",
					"class.has-range-option": "hasRangeOptions",
					"class.has-action-buttons": "hasActionButtons",
					"attr.aria-modal": "true",
					"attr.aria-label": "commonStrings.keys.datepickerDialogLabel"
				}
			},
			providers: [DatepickerFocusService],
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n@if (hasRangeOptions) {\n<clr-vertical-nav class=\"clr-date-range-picker-nav\">\n  @for (option of dateRangeOptions; track option) {\n  <a\n    clrVerticalNavLink\n    href=\"javascript:void(0)\"\n    [attr.aria-label]=\"option?.label\"\n    tabindex=\"0\"\n    (keyup.enter)=\"onRangeOptionSelect(option)\"\n    (click)=\"onRangeOptionSelect(option)\"\n  >\n    {{option.label}}\n  </a>\n  }\n</clr-vertical-nav>\n<ng-container *ngTemplateOutlet=\"calendarView\"></ng-container>\n} @else {\n<div class=\"datepicker-view-manager\">\n  @if (isMonthView) {\n  <clr-monthpicker></clr-monthpicker>\n  } @if (isYearView) {\n  <clr-yearpicker></clr-yearpicker>\n  } @if (isDayView) {\n  <clr-daypicker></clr-daypicker>\n  } @if (hasActionButtons) {\n  <clr-datepicker-actions></clr-datepicker-actions>\n  }\n</div>\n}\n\n<ng-template #calendarView>\n  <div class=\"datepicker-view-manager\">\n    @if (isMonthView) {\n    <clr-monthpicker></clr-monthpicker>\n    } @if (isYearView) {\n    <clr-yearpicker></clr-yearpicker>\n    } @if (isDayView) {\n    <clr-daypicker></clr-daypicker>\n    } @if (hasActionButtons) {\n    <clr-datepicker-actions></clr-datepicker-actions>\n    }\n  </div>\n</ng-template>\n",
			dependencies: [
				{
					kind: "directive",
					type: i5.NgTemplateOutlet,
					selector: "[ngTemplateOutlet]",
					inputs: [
						"ngTemplateOutletContext",
						"ngTemplateOutlet",
						"ngTemplateOutletInjector"
					]
				},
				{
					kind: "component",
					type: i6.ClrVerticalNav,
					selector: "clr-vertical-nav",
					inputs: [
						"clrVerticalNavToggleLabel",
						"clrVerticalNavCollapsible",
						"clrVerticalNavCollapsed"
					],
					outputs: ["clrVerticalNavCollapsedChange"]
				},
				{
					kind: "component",
					type: i6.ClrVerticalNavLink,
					selector: "[clrVerticalNavLink]"
				},
				{
					kind: "component",
					type: ClrMonthpicker,
					selector: "clr-monthpicker"
				},
				{
					kind: "component",
					type: ClrYearpicker,
					selector: "clr-yearpicker"
				},
				{
					kind: "component",
					type: ClrDaypicker,
					selector: "clr-daypicker"
				},
				{
					kind: "component",
					type: ClrDatepickerActions,
					selector: "clr-datepicker-actions"
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatepickerViewManager,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-datepicker-view-manager",
			providers: [DatepickerFocusService],
			host: {
				"[class.datepicker]": "true",
				"[class.has-range-option]": "hasRangeOptions",
				"[class.has-action-buttons]": "hasActionButtons",
				"[attr.aria-modal]": "true",
				"[attr.aria-label]": "commonStrings.keys.datepickerDialogLabel",
				role: "dialog"
			},
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n@if (hasRangeOptions) {\n<clr-vertical-nav class=\"clr-date-range-picker-nav\">\n  @for (option of dateRangeOptions; track option) {\n  <a\n    clrVerticalNavLink\n    href=\"javascript:void(0)\"\n    [attr.aria-label]=\"option?.label\"\n    tabindex=\"0\"\n    (keyup.enter)=\"onRangeOptionSelect(option)\"\n    (click)=\"onRangeOptionSelect(option)\"\n  >\n    {{option.label}}\n  </a>\n  }\n</clr-vertical-nav>\n<ng-container *ngTemplateOutlet=\"calendarView\"></ng-container>\n} @else {\n<div class=\"datepicker-view-manager\">\n  @if (isMonthView) {\n  <clr-monthpicker></clr-monthpicker>\n  } @if (isYearView) {\n  <clr-yearpicker></clr-yearpicker>\n  } @if (isDayView) {\n  <clr-daypicker></clr-daypicker>\n  } @if (hasActionButtons) {\n  <clr-datepicker-actions></clr-datepicker-actions>\n  }\n</div>\n}\n\n<ng-template #calendarView>\n  <div class=\"datepicker-view-manager\">\n    @if (isMonthView) {\n    <clr-monthpicker></clr-monthpicker>\n    } @if (isYearView) {\n    <clr-yearpicker></clr-yearpicker>\n    } @if (isDayView) {\n    <clr-daypicker></clr-daypicker>\n    } @if (hasActionButtons) {\n    <clr-datepicker-actions></clr-datepicker-actions>\n    }\n  </div>\n</ng-template>\n"
		}]
	}],
	ctorParameters: () => [
		{ type: i5$1.ClrCommonStringsService },
		{ type: ViewManagerService },
		{ type: DateNavigationService },
		{ type: DateIOService }
	]
});
var ClrDateContainer = class ClrDateContainer extends ClrAbstractContainer {
	constructor(renderer, elem, popoverService, dateNavigationService, datepickerEnabledService, dateFormControlService, dateIOService, commonStrings, focusService, viewManagerService, controlClassService, layoutService, ngControlService, localeHelperService) {
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
		this.localeHelperService = localeHelperService;
		this.focus = false;
		this.popoverType = ClrPopoverType.DROPDOWN;
		this.subscriptions.push(focusService.focusChange.subscribe((state) => {
			this.focus = state;
		}));
		this.subscriptions.push(popoverService.openChange.subscribe(() => {
			dateFormControlService.markAsTouched();
		}));
		if (dateNavigationService) dateNavigationService.hasActionButtons = dateNavigationService.isRangePicker = elem.nativeElement.tagName.toLowerCase() === "clr-date-range-container";
	}
	set firstDayOfWeek(value) {
		this.localeHelperService.updateFirstDayOfWeek(value ?? null);
	}
	set showActionButtons(flag) {
		if (this.dateNavigationService.isRangePicker && !flag) console.error("Error! The date range picker requires action buttons, [showActionButtons] cannot be turned off.");
		else this.dateNavigationService.hasActionButtons = flag;
	}
	set clrPosition(position) {
		if (!position) return;
		const posIndex = DROPDOWN_POSITIONS.indexOf(position);
		if (posIndex === -1) return;
		this.viewManagerService.position = DROPDOWN_POSITIONS[posIndex];
	}
	set rangeOptions(rangeOptions) {
		this.dateIOService.setRangeOptions(rangeOptions);
	}
	set min(dateString) {
		if (this.dateNavigationService.isRangePicker) this.dateIOService.setMinDate(dateString);
		else console.error("Error! The date container [min] input only works for date range pickers. Use the native `min` attribute/property for single-date inputs.");
	}
	set max(dateString) {
		if (this.dateNavigationService.isRangePicker) this.dateIOService.setMaxDate(dateString);
		else console.error("Error! The date container [max] input only works for date range pickers. Use the native `max` attribute/property for single-date inputs.");
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
	get isEnabled() {
		return this.datepickerEnabledService.isEnabled;
	}
	get isInputDateDisabled() {
		return this.control && this.control.disabled || this.dateFormControlService && this.dateFormControlService.disabled;
	}
	get isRangePicker() {
		return this.dateNavigationService.isRangePicker;
	}
	ngAfterViewInit() {
		this.dateRangeStructuralChecks();
		this.subscriptions.push(this.popoverService.openChange.subscribe((open) => {
			if (open) this.initializeCalendar();
			else {
				this.toggleButton.nativeElement.focus();
				this.dateNavigationService.resetSelectedDay();
			}
		}));
		this.subscriptions.push(this.listenForDateChanges());
	}
	getToggleButtonLabel(day) {
		if (day) {
			const formattedDate = this.dateIOService.toLocaleDisplayFormatString(day.toDate());
			return this.commonStrings.parse(this.commonStrings.keys.datepickerToggleChangeDateLabel, { SELECTED_DATE: formattedDate });
		}
		return this.commonStrings.keys.datepickerToggleChooseDateLabel;
	}
	listenForDateChanges() {
		return this.dateNavigationService.selectedDayChange.pipe(startWith(this.dateNavigationService.selectedDay)).subscribe((day) => {
			if (this.isEnabled) {
				const label = this.getToggleButtonLabel(day);
				const toggleEl = this.toggleButton.nativeElement;
				this.renderer.setAttribute(toggleEl, "aria-label", label);
				this.renderer.setAttribute(toggleEl, "title", label);
			}
		});
	}
	initializeCalendar() {
		this.dateNavigationService.initializeCalendar();
	}
	dateRangeStructuralChecks() {
		if (this.dateNavigationService.isRangePicker) {
			const inputs = Array.from(this.elem.nativeElement.querySelectorAll("input"));
			if (inputs.some((input) => input.classList.contains("clr-date-input"))) console.error("Error! clr-date-range-container must contain clrStartDate and clrEndDate inputs");
			if (!inputs.some((input) => input.classList.contains("clr-date-start-input"))) console.error("Error! clr-date-range-container must contain clrStartDate input");
			if (!inputs.some((input) => input.classList.contains("clr-date-end-input"))) console.error("Error! clr-date-range-container must contain clrEndDate input");
		}
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDateContainer,
			deps: [
				{ token: i0.Renderer2 },
				{ token: i0.ElementRef },
				{ token: i6$1.ClrPopoverService },
				{ token: DateNavigationService },
				{ token: DatepickerEnabledService },
				{ token: DateFormControlService },
				{ token: DateIOService },
				{ token: i5$1.ClrCommonStringsService },
				{ token: i7.FormsFocusService },
				{ token: ViewManagerService },
				{ token: i7.ControlClassService },
				{
					token: i7.LayoutService,
					optional: true
				},
				{ token: i7.NgControlService },
				{ token: LocaleHelperService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrDateContainer,
			isStandalone: false,
			selector: "clr-date-container, clr-date-range-container",
			inputs: {
				firstDayOfWeek: ["clrFirstDayOfWeek", "firstDayOfWeek"],
				showActionButtons: "showActionButtons",
				clrPosition: "clrPosition",
				rangeOptions: "rangeOptions",
				min: "min",
				max: "max"
			},
			host: { properties: {
				"class.clr-date-container": "true",
				"class.clr-form-control-disabled": "isInputDateDisabled",
				"class.clr-form-control": "true",
				"class.clr-row": "addGrid()"
			} },
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
				ViewManagerService
			],
			viewQueries: [{
				propertyName: "actionButton",
				first: true,
				predicate: ["actionButton"],
				descendants: true
			}],
			usesInheritance: true,
			hostDirectives: [{ directive: i6$1.ClrPopoverHostDirective }],
			ngImport: i0,
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
			isInline: true,
			dependencies: [
				{
					kind: "directive",
					type: i5.NgClass,
					selector: "[ngClass]",
					inputs: ["class", "ngClass"]
				},
				{
					kind: "directive",
					type: i5$1.CdkTrapFocusModule_CdkTrapFocus,
					selector: "[cdkTrapFocus]"
				},
				{
					kind: "directive",
					type: i6$1.ClrPopoverOrigin,
					selector: "[clrPopoverOrigin]"
				},
				{
					kind: "directive",
					type: i6$1.ClrPopoverOpenCloseButton,
					selector: "[clrPopoverOpenCloseButton]",
					outputs: ["clrPopoverOpenCloseChange"]
				},
				{
					kind: "directive",
					type: i6$1.ClrPopoverContent,
					selector: "[clrPopoverContent]",
					inputs: [
						"clrPopoverContent",
						"clrPopoverContentAt",
						"clrPopoverContentAvailablePositions",
						"clrPopoverContentType",
						"clrPopoverContentOutsideClickToClose",
						"clrPopoverContentScrollToClose",
						"clrPopoverContentOrigin"
					]
				},
				{
					kind: "component",
					type: i6$2.ClrIcon,
					selector: "clr-icon, cds-icon",
					inputs: [
						"shape",
						"size",
						"direction",
						"flip",
						"solid",
						"status",
						"inverse",
						"badge",
						"innerOffset"
					]
				},
				{
					kind: "directive",
					type: i7.ClrControlLabel,
					selector: "label",
					inputs: ["id", "for"]
				},
				{
					kind: "component",
					type: ClrDatepickerViewManager,
					selector: "clr-datepicker-view-manager"
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDateContainer,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-date-container, clr-date-range-container",
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
				ViewManagerService
			],
			hostDirectives: [ClrPopoverHostDirective],
			host: {
				"[class.clr-date-container]": "true",
				"[class.clr-form-control-disabled]": "isInputDateDisabled",
				"[class.clr-form-control]": "true",
				"[class.clr-row]": "addGrid()"
			},
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: i0.Renderer2 },
		{ type: i0.ElementRef },
		{ type: i6$1.ClrPopoverService },
		{ type: DateNavigationService },
		{ type: DatepickerEnabledService },
		{ type: DateFormControlService },
		{ type: DateIOService },
		{ type: i5$1.ClrCommonStringsService },
		{ type: i7.FormsFocusService },
		{ type: ViewManagerService },
		{ type: i7.ControlClassService },
		{
			type: i7.LayoutService,
			decorators: [{ type: Optional }]
		},
		{ type: i7.NgControlService },
		{ type: LocaleHelperService }
	],
	propDecorators: {
		firstDayOfWeek: [{
			type: Input,
			args: ["clrFirstDayOfWeek"]
		}],
		showActionButtons: [{
			type: Input,
			args: ["showActionButtons"]
		}],
		clrPosition: [{
			type: Input,
			args: ["clrPosition"]
		}],
		rangeOptions: [{ type: Input }],
		min: [{ type: Input }],
		max: [{ type: Input }],
		actionButton: [{
			type: ViewChild,
			args: ["actionButton"]
		}]
	}
});
var ClrDateInputBase = class ClrDateInputBase extends WrappedFormControl {
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
		if (this.dateFormControlService) return this.dateFormControlService.disabled || !!this.control?.control?.disabled;
		return null;
	}
	set disabled(value) {
		if (this.dateFormControlService) this.dateFormControlService.setDisabled(isBooleanAttributeSet(value));
	}
	get placeholderText() {
		return this.placeholder ? this.placeholder : this.dateIOService.placeholderText;
	}
	get inputType() {
		return isPlatformBrowser(this.platformId) && this.usingNativeDatepicker() ? "date" : "text";
	}
	ngOnInit() {
		super.ngOnInit();
		this.populateServicesFromContainerComponent();
		this.subscriptions.push(this.listenForUserSelectedDayChanges(), this.listenForControlValueChanges(), this.listenForTouchChanges(), this.listenForDirtyChanges(), this.listenForInputRefocus());
	}
	ngAfterViewInit() {
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
		if (this.usingClarityDatepicker() && validDateValue) this.updateDate(validDateValue, true);
		else if (this.usingNativeDatepicker()) {
			const [year, month, day] = target.value.split("-");
			this.updateDate(new Date(+year, +month - 1, +day), true);
		} else this.emitDateOutput(null);
	}
	datepickerHasFormControl() {
		return !!this.control;
	}
	setDate(date) {
		if (typeof date === "string") date = new Date(date);
		if (this.previousDateChange !== date) this.updateDate(date);
		if (!this.initialClrDateInputValue) this.initialClrDateInputValue = date;
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
		if (this.focusService) this.focusService.focused = focus;
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
		if (this.datepickerHasFormControl()) this.updateDate(this.dateIOService.getDateValueFromDateString(this.control.value));
		else this.updateDate(this.initialClrDateInputValue);
	}
	updateDate(value, setByUserInteraction = false) {
		const date = this.getValidDateValueFromDate(value);
		if (setByUserInteraction) this.emitDateOutput(date);
		else this.previousDateChange = date;
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
				date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
				this.renderer.setProperty(this.el.nativeElement, "valueAsDate", date);
			} else if (this.datepickerHasFormControl() && dateString !== this.control.value) this.control.control.setValue(dateString);
			else this.renderer.setProperty(this.el.nativeElement, "value", dateString);
			this.validateDateRange();
		} else this.renderer.setProperty(this.el.nativeElement, "value", "");
	}
	getValidDateValueFromDate(date) {
		if (this.dateIOService) {
			const dateString = this.dateIOService.toLocaleDisplayFormatString(date);
			return this.dateIOService.getDateValueFromDateString(dateString);
		} else return null;
	}
	emitDateOutput(date) {
		if (!datesAreEqual(date, this.previousDateChange)) {
			this.dateChange.emit(date);
			this.previousDateChange = date;
		} else if (!date && this.previousDateChange) {
			this.dateChange.emit(null);
			this.previousDateChange = null;
		}
	}
	listenForControlValueChanges() {
		if (this.datepickerHasFormControl()) return this.control.valueChanges.pipe(filter(() => !this.datepickerFocusService.elementIsFocused(this.el.nativeElement))).subscribe((value) => this.updateDate(this.dateIOService.getDateValueFromDateString(value)));
		else return null;
	}
	listenForUserSelectedDayChanges() {
		return this.userSelectedDayChange.subscribe((dayModel) => this.updateDate(dayModel?.toDate(), true));
	}
	listenForTouchChanges() {
		return this.dateFormControlService.touchedChange.pipe(filter(() => this.datepickerHasFormControl())).subscribe(() => this.control.control.markAsTouched());
	}
	listenForDirtyChanges() {
		return this.dateFormControlService.dirtyChange.pipe(filter(() => this.datepickerHasFormControl())).subscribe(() => this.control.control.markAsDirty());
	}
	listenForInputRefocus() {
		return this.dateNavigationService.selectedDayChange.pipe(filter((date) => !!date && !this.dateNavigationService.isRangePicker)).subscribe(() => this.datepickerFocusService.focusInput(this.el.nativeElement));
	}
	validateDateRange() {
		if (this.dateNavigationService.isRangePicker) {
			const controls = this.ngControlService?.controls;
			if (this.dateNavigationService.selectedDay?.isBefore(this.dateNavigationService.selectedEndDay, true) && controls?.some((control) => control.hasError("range"))) controls.forEach((ngControl) => {
				ngControl?.control?.updateValueAndValidity({ emitEvent: false });
			});
		}
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDateInputBase,
			deps: [
				{ token: i0.ViewContainerRef },
				{ token: i0.Injector },
				{ token: i0.ElementRef },
				{ token: i0.Renderer2 },
				{
					token: i1.NgControl,
					optional: true,
					self: true
				},
				{
					token: forwardRef(() => ClrDateContainer),
					optional: true
				},
				{
					token: DateIOService,
					optional: true
				},
				{
					token: DateNavigationService,
					optional: true
				},
				{
					token: DatepickerEnabledService,
					optional: true
				},
				{
					token: DateFormControlService,
					optional: true
				},
				{ token: PLATFORM_ID },
				{
					token: i7.FormsFocusService,
					optional: true
				},
				{ token: DatepickerFocusService }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDateInputBase,
			isStandalone: true,
			inputs: {
				placeholder: "placeholder",
				disabled: "disabled"
			},
			host: {
				listeners: {
					"focus": "setFocusStates()",
					"change": "onValueChange($event.target)"
				},
				properties: {
					"disabled": "this.disabled",
					"attr.placeholder": "this.placeholderText",
					"attr.type": "this.inputType"
				}
			},
			usesInheritance: true,
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDateInputBase,
	decorators: [{ type: Directive }],
	ctorParameters: () => [
		{ type: i0.ViewContainerRef },
		{ type: i0.Injector },
		{ type: i0.ElementRef },
		{ type: i0.Renderer2 },
		{
			type: i1.NgControl,
			decorators: [{ type: Self }, { type: Optional }]
		},
		{
			type: ClrDateContainer,
			decorators: [{ type: Optional }, {
				type: Inject,
				args: [forwardRef(() => ClrDateContainer)]
			}]
		},
		{
			type: DateIOService,
			decorators: [{ type: Optional }]
		},
		{
			type: DateNavigationService,
			decorators: [{ type: Optional }]
		},
		{
			type: DatepickerEnabledService,
			decorators: [{ type: Optional }]
		},
		{
			type: DateFormControlService,
			decorators: [{ type: Optional }]
		},
		{
			type: void 0,
			decorators: [{
				type: Inject,
				args: [PLATFORM_ID]
			}]
		},
		{
			type: i7.FormsFocusService,
			decorators: [{ type: Optional }]
		},
		{ type: DatepickerFocusService }
	],
	propDecorators: {
		placeholder: [{ type: Input }],
		disabled: [{
			type: Input,
			args: ["disabled"]
		}, {
			type: HostBinding,
			args: ["disabled"]
		}],
		placeholderText: [{
			type: HostBinding,
			args: ["attr.placeholder"]
		}],
		inputType: [{
			type: HostBinding,
			args: ["attr.type"]
		}],
		setFocusStates: [{
			type: HostListener,
			args: ["focus"]
		}],
		onValueChange: [{
			type: HostListener,
			args: ["change", ["$event.target"]]
		}]
	}
});
var ClrDateInput = class ClrDateInput extends ClrDateInputBase {
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
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDateInput,
			deps: null,
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDateInput,
			isStandalone: false,
			selector: "[clrDate]",
			inputs: {
				date: ["clrDate", "date"],
				min: "min",
				max: "max"
			},
			outputs: { dateChange: "clrDateChange" },
			host: { properties: {
				"class.clr-input": "true",
				"class.clr-date-input": "true"
			} },
			providers: [DatepickerFocusService],
			usesInheritance: true,
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDateInput,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrDate]",
			host: {
				"[class.clr-input]": "true",
				"[class.clr-date-input]": "true"
			},
			providers: [DatepickerFocusService],
			standalone: false
		}]
	}],
	propDecorators: {
		dateChange: [{
			type: Output,
			args: ["clrDateChange"]
		}],
		date: [{
			type: Input,
			args: ["clrDate"]
		}],
		min: [{ type: Input }],
		max: [{ type: Input }]
	}
});
var ClrStartDateInput = class ClrStartDateInput extends ClrDateInputBase {
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
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrStartDateInput,
			deps: null,
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrStartDateInput,
			isStandalone: false,
			selector: "[clrStartDate]",
			inputs: {
				inputWidth: "inputWidth",
				date: ["clrStartDate", "date"]
			},
			outputs: { dateChange: "clrStartDateChange" },
			host: { properties: {
				"class.clr-input": "true",
				"class.clr-date-start-input": "true",
				"style.text-align": "'right'",
				"attr.size": "this.inputSize"
			} },
			providers: [DatepickerFocusService],
			usesInheritance: true,
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrStartDateInput,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrStartDate]",
			host: {
				"[class.clr-input]": "true",
				"[class.clr-date-start-input]": "true",
				"[style.text-align]": "'right'"
			},
			providers: [DatepickerFocusService],
			standalone: false
		}]
	}],
	propDecorators: {
		dateChange: [{
			type: Output,
			args: ["clrStartDateChange"]
		}],
		inputWidth: [{
			type: Input,
			args: ["inputWidth"]
		}],
		date: [{
			type: Input,
			args: ["clrStartDate"]
		}],
		inputSize: [{
			type: HostBinding,
			args: ["attr.size"]
		}]
	}
});
var ClrEndDateInput = class ClrEndDateInput extends ClrDateInputBase {
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
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrEndDateInput,
			deps: null,
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrEndDateInput,
			isStandalone: false,
			selector: "[clrEndDate]",
			inputs: {
				inputWidth: "inputWidth",
				date: ["clrEndDate", "date"]
			},
			outputs: { dateChange: "clrEndDateChange" },
			host: { properties: {
				"class.clr-input": "true",
				"class.clr-date-end-input": "true",
				"attr.size": "this.inputSize"
			} },
			providers: [DatepickerFocusService],
			usesInheritance: true,
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrEndDateInput,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrEndDate]",
			host: {
				"[class.clr-input]": "true",
				"[class.clr-date-end-input]": "true"
			},
			providers: [DatepickerFocusService],
			standalone: false
		}]
	}],
	propDecorators: {
		dateChange: [{
			type: Output,
			args: ["clrEndDateChange"]
		}],
		inputWidth: [{
			type: Input,
			args: ["inputWidth"]
		}],
		date: [{
			type: Input,
			args: ["clrEndDate"]
		}],
		inputSize: [{
			type: HostBinding,
			args: ["attr.size"]
		}]
	}
});
var ClrDateInputValidator = class ClrDateInputValidator {
	constructor(dateIOService) {
		this.dateIOService = dateIOService;
	}
	validate(control) {
		if (this.dateIOService) {
			const value = this.dateIOService.getDateValueFromDateString(control.value);
			const minDate = this.dateIOService.disabledDates.minDate.toDate();
			const maxDate = this.dateIOService.disabledDates.maxDate.toDate();
			if (value && value < minDate) return { min: {
				min: minDate.toLocaleDateString(),
				actual: value.toLocaleDateString()
			} };
			else if (value && value > maxDate) return { max: {
				max: maxDate.toLocaleDateString(),
				actual: value.toLocaleDateString()
			} };
		}
		return null;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDateInputValidator,
			deps: [{
				token: DateIOService,
				optional: true
			}],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDateInputValidator,
			isStandalone: false,
			selector: "[clrDate], [clrStartDate], [clrEndDate]",
			providers: [{
				provide: NG_VALIDATORS,
				useExisting: ClrDateInputValidator,
				multi: true
			}],
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDateInputValidator,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrDate], [clrStartDate], [clrEndDate]",
			providers: [{
				provide: NG_VALIDATORS,
				useExisting: ClrDateInputValidator,
				multi: true
			}],
			standalone: false
		}]
	}],
	ctorParameters: () => [{
		type: DateIOService,
		decorators: [{ type: Optional }]
	}]
});
var ClrStartDateInputValidator = class ClrStartDateInputValidator {
	constructor(dateIOService, dateNavigationService) {
		this.dateIOService = dateIOService;
		this.dateNavigationService = dateNavigationService;
	}
	validate(control) {
		if (this.dateIOService) {
			const value = this.dateIOService.getDateValueFromDateString(control.value);
			const endDate = this.dateNavigationService?.selectedEndDay?.toDate();
			if (value && endDate && value > endDate) return { range: {
				startDate: value,
				endDate
			} };
		}
		return null;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrStartDateInputValidator,
			deps: [{
				token: DateIOService,
				optional: true
			}, {
				token: DateNavigationService,
				optional: true
			}],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrStartDateInputValidator,
			isStandalone: false,
			selector: "[clrStartDate]",
			providers: [{
				provide: NG_VALIDATORS,
				useExisting: ClrStartDateInputValidator,
				multi: true
			}],
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrStartDateInputValidator,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrStartDate]",
			providers: [{
				provide: NG_VALIDATORS,
				useExisting: ClrStartDateInputValidator,
				multi: true
			}],
			standalone: false
		}]
	}],
	ctorParameters: () => [{
		type: DateIOService,
		decorators: [{ type: Optional }]
	}, {
		type: DateNavigationService,
		decorators: [{ type: Optional }]
	}]
});
var ClrEndDateInputValidator = class ClrEndDateInputValidator {
	constructor(dateIOService, dateNavigationService) {
		this.dateIOService = dateIOService;
		this.dateNavigationService = dateNavigationService;
	}
	validate(control) {
		if (this.dateIOService) {
			const value = this.dateIOService.getDateValueFromDateString(control.value);
			const startDate = this.dateNavigationService?.selectedDay?.toDate();
			if (value && startDate && value < startDate) return { range: {
				startDate,
				endDate: value
			} };
		}
		return null;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrEndDateInputValidator,
			deps: [{
				token: DateIOService,
				optional: true
			}, {
				token: DateNavigationService,
				optional: true
			}],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrEndDateInputValidator,
			isStandalone: false,
			selector: "[clrEndDate]",
			providers: [{
				provide: NG_VALIDATORS,
				useExisting: ClrEndDateInputValidator,
				multi: true
			}],
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrEndDateInputValidator,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrEndDate]",
			providers: [{
				provide: NG_VALIDATORS,
				useExisting: ClrEndDateInputValidator,
				multi: true
			}],
			standalone: false
		}]
	}],
	ctorParameters: () => [{
		type: DateIOService,
		decorators: [{ type: Optional }]
	}, {
		type: DateNavigationService,
		decorators: [{ type: Optional }]
	}]
});
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
	ClrDatepickerActions
];
var ClrDatepickerModule = class ClrDatepickerModule {
	constructor() {
		ClarityIcons.addIcons(successStandardIcon, errorStandardIcon, angleIcon, eventIcon, calendarIcon);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatepickerModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatepickerModule,
			declarations: [
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
				ClrDatepickerActions
			],
			imports: [
				CommonModule,
				CdkTrapFocusModule,
				ClrHostWrappingModule,
				ClrConditionalModule,
				ClrPopoverModuleNext,
				ClrIcon,
				ClrCommonFormsModule,
				ClrVerticalNavModule
			],
			exports: [
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
				ClrDatepickerActions
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatepickerModule,
			imports: [
				CommonModule,
				CdkTrapFocusModule,
				ClrHostWrappingModule,
				ClrConditionalModule,
				ClrPopoverModuleNext,
				ClrIcon,
				ClrCommonFormsModule,
				ClrVerticalNavModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatepickerModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [
				CommonModule,
				CdkTrapFocusModule,
				ClrHostWrappingModule,
				ClrConditionalModule,
				ClrPopoverModuleNext,
				ClrIcon,
				ClrCommonFormsModule,
				ClrVerticalNavModule
			],
			declarations: [CLR_DATEPICKER_DIRECTIVES],
			exports: [CLR_DATEPICKER_DIRECTIVES]
		}]
	}],
	ctorParameters: () => []
});
export { CLR_DATEPICKER_DIRECTIVES, ClrCalendar, ClrDateContainer, ClrDateInput, ClrDateInputBase, ClrDateInputValidator, ClrDatepickerActions, ClrDatepickerModule, ClrDatepickerViewManager, ClrDay, ClrDaypicker, ClrEndDateInput, ClrEndDateInputValidator, ClrLocaleDateFormat, ClrMonthpicker, ClrStartDateInput, ClrStartDateInputValidator, ClrWeekday, ClrYearpicker };

//# sourceMappingURL=clr-angular-forms-datepicker.mjs.map