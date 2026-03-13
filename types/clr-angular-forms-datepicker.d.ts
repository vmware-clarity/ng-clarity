import * as i0 from '@angular/core';
import { AfterViewInit, Renderer2, ElementRef, NgZone, OnInit, OnDestroy, EventEmitter, ViewContainerRef, Injector, Type } from '@angular/core';
import { NgControl, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import * as i17 from '@clr/angular/forms/common';
import { ClrAbstractContainer, ControlClassService, LayoutService, NgControlService, FormsFocusService, WrappedFormControl } from '@clr/angular/forms/common';
import * as rxjs from 'rxjs';
import { Observable, Subject } from 'rxjs';
import * as i1 from '@clr/angular/popover/common';
import { ClrPopoverPosition, ClrPopoverType, ClrPopoverService } from '@clr/angular/popover/common';
import * as i14 from '@clr/angular/utils';
import { ClrCommonStringsService } from '@clr/angular/utils';
import * as i13 from '@angular/common';
import * as i16 from '@clr/angular/icon';
import * as i18 from '@clr/angular/layout/vertical-nav';

declare class DateFormControlService {
    disabled: boolean;
    private _touchedChange;
    private _dirtyChange;
    get touchedChange(): Observable<void>;
    get dirtyChange(): Observable<void>;
    markAsTouched(): void;
    markAsDirty(): void;
    setDisabled(state: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateFormControlService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DateFormControlService>;
}

interface ClrDayOfWeek {
    readonly day: string;
    readonly narrow: string;
}

/**
 * This service extracts the Angular CLDR data needed by the datepicker.
 */
declare class LocaleHelperService {
    locale: string;
    private _firstDayOfWeek;
    private _localeDays;
    private _localeMonthsAbbreviated;
    private _localeMonthsWide;
    private _localeDateFormat;
    constructor(locale: string);
    get firstDayOfWeek(): number;
    get localeDays(): ReadonlyArray<ClrDayOfWeek>;
    get localeDaysNarrow(): ReadonlyArray<string>;
    get localeMonthsAbbreviated(): ReadonlyArray<string>;
    get localeMonthsWide(): ReadonlyArray<string>;
    get localeDateFormat(): string;
    /**
     * Initializes the locale data.
     */
    private initializeLocaleData;
    /**
     * Initialize day names based on the locale.
     * eg: [{day: Sunday, narrow: S}, {day: Monday, narrow: M}...] for en-US.
     */
    private initializeLocaleDays;
    /**
     * Initializes the array of month names in the TranslationWidth.Abbreviated format.
     * e.g. `[Jan, Feb, ...]` for en-US
     */
    private initializeLocaleMonthsAbbreviated;
    /**
     * Initializes the array of month names in the TranslationWidth.Wide format.
     * e.g. `[January, February, ...]` for en-US
     */
    private initializeLocaleMonthsWide;
    /**
     * Initializes the first day of the week based on the locale.
     */
    private initializeFirstDayOfWeek;
    private initializeLocaleDateFormat;
    static ɵfac: i0.ɵɵFactoryDeclaration<LocaleHelperService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LocaleHelperService>;
}

declare class DayModel {
    readonly year: number;
    readonly month: number;
    readonly date: number;
    constructor(year: number, month: number, date: number);
    /**
     * Checks if the passed CalendarDate is equal to itself.
     */
    isEqual(day: DayModel): boolean;
    toDate(): Date;
    /**
     * Returns a new DayModel which is incremented based on the value passed.
     */
    incrementBy(value: number): DayModel;
    /**
     * Clones the current day model.
     */
    clone(): DayModel;
    toComparisonString(): string;
    toDateString(): string;
    /**
     * Compares the dates and returns boolean value based on the value passed
     */
    isBefore(day: DayModel, dayInclusive?: boolean): boolean;
    /**
     * Compares the dates and returns boolean value based on the value passed
     */
    isAfter(day: DayModel, dayInclusive?: boolean): boolean;
    private pad;
}

interface DateRange {
    minDate?: DayModel;
    maxDate?: DayModel;
}
interface DateRangeInput {
    startDate: DayModel;
    endDate?: DayModel;
}
interface DateRangeOption {
    label: string;
    value: Date[];
}

declare class DateIOService {
    /**
     * This is the default range. It approximates the beginning of time to the end of time.
     * The disabled dates are the dates that are not allowed to be selected.
     * The min date is the earliest date that can be selected.
     * The max date is the latest date that can be selected.
     * Unless a minDate or maxDate is set with the native HTML5 api the range is all dates
     */
    disabledDates: DateRange;
    cldrLocaleDateFormat: string;
    minDateChange: Subject<DayModel>;
    maxDateChange: Subject<DayModel>;
    private dateRangeOptions;
    private localeDisplayFormat;
    private delimiters;
    constructor(localeHelperService: LocaleHelperService);
    get placeholderText(): string;
    setMinDate(date: string): void;
    setMaxDate(date: string): void;
    setRangeOptions(rangeOptions: DateRangeOption[]): void;
    getRangeOptions(): any;
    toLocaleDisplayFormatString(date: Date): string;
    getDateValueFromDateString(date: string): Date;
    private validateDateRangeOptions;
    private initializeLocaleDisplayFormat;
    private extractDelimiters;
    /**
     * Checks if the month entered by the user is valid or not.
     * Note: Month is 0 based.
     */
    private isValidMonth;
    /**
     * Checks if the date is valid depending on the year and month provided.
     */
    private isValidDate;
    /**
     * Validates the parameters provided and returns the date.
     * If the parameters are not
     * valid then return null.
     * NOTE: (Month here is 1 based since the user has provided that as an input)
     */
    private validateAndGetDate;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateIOService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DateIOService>;
}

declare class CalendarModel {
    readonly year: number;
    readonly month: number;
    days: DayModel[];
    constructor(year: number, month: number);
    /**
     * Checks if the calendar passed is equal to the current calendar.
     */
    isEqual(calendar: CalendarModel): boolean;
    /**
     * Checks if a DayModel is in the Calendar
     */
    isDayInCalendar(day: DayModel): boolean;
    /**
     * Returns CalendarModel of the previous month.
     */
    previousMonth(): CalendarModel;
    /**
     * Returns CalendarModel of the next month.
     */
    nextMonth(): CalendarModel;
    /**
     * Returns CalendarModel of the previous year.
     */
    previousYear(): CalendarModel;
    /**
     * Returns CalendarModel of the next year.
     */
    nextYear(): CalendarModel;
    /**
     * Populates the days array with the DayModels in the current Calendar.
     */
    private initializeDaysInCalendar;
}

/**
 * This service is responsible for:
 * 1. Initializing the displayed calendar.
 * 2. Moving the calendar to the next, previous or current months
 * 3. Managing the focused and selected day models.
 */
declare class DateNavigationService {
    persistedDate: DayModel;
    persistedEndDate: DayModel;
    selectedDay: DayModel;
    selectedEndDay: DayModel;
    focusedDay: DayModel;
    hoveredDay: DayModel;
    hoveredMonth: number;
    hoveredYear: number;
    isRangePicker: boolean;
    hasActionButtons: boolean;
    private _displayedCalendar;
    private _todaysFullDate;
    private _today;
    private _selectedDayChange;
    private _selectedEndDayChange;
    private _displayedCalendarChange;
    private _focusOnCalendarChange;
    private _refreshCalendarView;
    private _focusedDayChange;
    get today(): DayModel;
    get displayedCalendar(): CalendarModel;
    get selectedDayChange(): Observable<DayModel>;
    get selectedEndDayChange(): Observable<DayModel>;
    /**
     * This observable lets the subscriber know that the displayed calendar has changed.
     */
    get displayedCalendarChange(): Observable<void>;
    /**
     * This observable lets the subscriber know that the focus should be applied on the calendar.
     */
    get focusOnCalendarChange(): Observable<void>;
    /**
     * This observable lets the subscriber know that the focused day in the displayed calendar has changed.
     */
    get focusedDayChange(): Observable<DayModel>;
    /**
     * This observable lets the subscriber know that the displayed calendar has changed.
     */
    get refreshCalendarView(): Observable<void>;
    /**
     * Notifies that the selected day has changed so that the date can be emitted to the user.
     */
    notifySelectedDayChanged(dayObject: DayModel | DateRangeInput, { emitEvent }?: {
        emitEvent: boolean;
    }): void;
    /**
     * Initializes the calendar based on the selected day.
     */
    initializeCalendar(): void;
    changeMonth(month: number): void;
    changeYear(year: number): void;
    /**
     * Moves the displayed calendar to the next month.
     */
    moveToNextMonth(): void;
    /**
     * Moves the displayed calendar to the previous month.
     */
    moveToPreviousMonth(): void;
    /**
     * Moves the displayed calendar to the next year.
     */
    moveToNextYear(): void;
    /**
     * Moves the displayed calendar to the previous year.
     */
    moveToPreviousYear(): void;
    /**
     * Moves the displayed calendar to the current month and year.
     */
    moveToCurrentMonth(): void;
    moveToSpecificMonth(day: DayModel): void;
    incrementFocusDay(value: number): void;
    resetSelectedDay(): void;
    convertDateToDayModel(date: Date): DayModel;
    private setSelectedDay;
    private setSelectedEndDay;
    private setDisplayedCalendar;
    private initializeTodaysDate;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateNavigationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DateNavigationService>;
}

declare class DatepickerEnabledService {
    private _document;
    private _isUserAgentMobile;
    private _innerWidth;
    constructor(_document: any);
    /**
     * Returns if the calendar should be active or not.
     * If the user agent is mobile and the screen width is less than DATEPICKER_ACTIVE_BREAKPOINT
     * then the calendar is inactive.
     */
    get isEnabled(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatepickerEnabledService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DatepickerEnabledService>;
}

/**
 * This service manages which view is visible in the datepicker popover.
 */
declare class ViewManagerService {
    position: ClrPopoverPosition;
    private _currentView;
    get isDayView(): boolean;
    get isYearView(): boolean;
    get isMonthView(): boolean;
    changeToMonthView(): void;
    changeToYearView(): void;
    changeToDayView(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ViewManagerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ViewManagerService>;
}

declare class ClrDateContainer extends ClrAbstractContainer implements AfterViewInit {
    protected renderer: Renderer2;
    protected elem: ElementRef;
    private popoverService;
    private dateNavigationService;
    private datepickerEnabledService;
    private dateFormControlService;
    private dateIOService;
    commonStrings: ClrCommonStringsService;
    private viewManagerService;
    protected controlClassService: ControlClassService;
    protected layoutService: LayoutService;
    protected ngControlService: NgControlService;
    focus: boolean;
    protected popoverType: ClrPopoverType;
    private toggleButton;
    constructor(renderer: Renderer2, elem: ElementRef, popoverService: ClrPopoverService, dateNavigationService: DateNavigationService, datepickerEnabledService: DatepickerEnabledService, dateFormControlService: DateFormControlService, dateIOService: DateIOService, commonStrings: ClrCommonStringsService, focusService: FormsFocusService, viewManagerService: ViewManagerService, controlClassService: ControlClassService, layoutService: LayoutService, ngControlService: NgControlService);
    /**
     * For date range picker actions buttons are shown by default
     */
    set showActionButtons(flag: boolean);
    set clrPosition(position: string | ClrPopoverPosition);
    set rangeOptions(rangeOptions: any);
    set min(dateString: string);
    set max(dateString: string);
    set actionButton(button: ElementRef<HTMLButtonElement>);
    get popoverPosition(): ClrPopoverPosition;
    get open(): boolean;
    /**
     * Returns if the Datepicker is enabled or not. If disabled, hides the datepicker trigger.
     */
    get isEnabled(): boolean;
    /**
     * Return if Datepicker is diabled or not as Form Control
     */
    get isInputDateDisabled(): boolean;
    protected get isRangePicker(): boolean;
    ngAfterViewInit(): void;
    /**
     * Return the label for the toggle button.
     * If there's a selected date, the date is included in the label.
     */
    private getToggleButtonLabel;
    private listenForDateChanges;
    /**
     * Processes the user input and Initializes the Calendar everytime the datepicker popover is open.
     */
    private initializeCalendar;
    private dateRangeStructuralChecks;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDateContainer, [null, null, null, null, null, null, null, null, null, null, null, { optional: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDateContainer, "clr-date-container, clr-date-range-container", never, { "showActionButtons": { "alias": "showActionButtons"; "required": false; }; "clrPosition": { "alias": "clrPosition"; "required": false; }; "rangeOptions": { "alias": "rangeOptions"; "required": false; }; "min": { "alias": "min"; "required": false; }; "max": { "alias": "max"; "required": false; }; }, {}, never, ["label", "[clrStartDate]", "[clrEndDate]", "[clrDate]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, [{ directive: typeof i1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

/**
 * This service focuses the day that is focusable in the calendar.
 */
declare class DatepickerFocusService {
    private _ngZone;
    private platformId;
    constructor(_ngZone: NgZone, platformId: any);
    focusCell(elRef: ElementRef<HTMLElement>): void;
    focusInput(element: HTMLInputElement): void;
    elementIsFocused(element: HTMLInputElement): boolean;
    private ngZoneIsStableInBrowser;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatepickerFocusService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DatepickerFocusService>;
}

declare abstract class ClrDateInputBase extends WrappedFormControl<ClrDateContainer> implements OnInit, AfterViewInit, OnDestroy {
    protected el: ElementRef<HTMLInputElement>;
    protected renderer: Renderer2;
    protected control: NgControl;
    private container;
    protected dateIOService: DateIOService;
    protected dateNavigationService: DateNavigationService;
    private datepickerEnabledService;
    private dateFormControlService;
    private platformId;
    private focusService;
    protected datepickerFocusService: DatepickerFocusService;
    static ngAcceptInputType_date: Date | null | string;
    placeholder: string;
    protected index: number;
    private initialClrDateInputValue;
    private previousDateChange;
    protected abstract dateChange: EventEmitter<Date>;
    constructor(viewContainerRef: ViewContainerRef, injector: Injector, el: ElementRef<HTMLInputElement>, renderer: Renderer2, control: NgControl, container: ClrDateContainer, dateIOService: DateIOService, dateNavigationService: DateNavigationService, datepickerEnabledService: DatepickerEnabledService, dateFormControlService: DateFormControlService, platformId: any, focusService: FormsFocusService, datepickerFocusService: DatepickerFocusService);
    get disabled(): boolean | string;
    set disabled(value: boolean | string);
    get placeholderText(): string;
    get inputType(): string;
    protected abstract get userSelectedDayChange(): Observable<DayModel>;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    setFocusStates(): void;
    triggerValidation(): void;
    onValueChange(target: HTMLInputElement): void;
    protected datepickerHasFormControl(): boolean;
    protected setDate(date: Date | string): void;
    protected triggerControlInputValidation(): void;
    private usingClarityDatepicker;
    private usingNativeDatepicker;
    private setFocus;
    private populateServicesFromContainerComponent;
    private processInitialInputs;
    private updateDate;
    private updateInput;
    private getValidDateValueFromDate;
    private emitDateOutput;
    private listenForControlValueChanges;
    private listenForUserSelectedDayChanges;
    private listenForTouchChanges;
    private listenForDirtyChanges;
    private listenForInputRefocus;
    /**
     * In case of date range error, both start & end date field validation has to be triggered
     * if either of the field gets updated
     */
    private validateDateRange;
    protected abstract updateDayModel(dayModel: DayModel): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDateInputBase, [null, null, null, null, { optional: true; self: true; }, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }, { optional: true; }, null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDateInputBase, never, never, { "placeholder": { "alias": "placeholder"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; }, {}, never, never, true, never>;
}

declare class ClrDateInput extends ClrDateInputBase {
    dateChange: EventEmitter<Date>;
    set date(date: Date | string);
    set min(dateString: string);
    set max(dateString: string);
    protected get userSelectedDayChange(): rxjs.Observable<DayModel>;
    protected updateDayModel(dayModel: DayModel): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDateInput, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDateInput, "[clrDate]", never, { "date": { "alias": "clrDate"; "required": false; }; "min": { "alias": "min"; "required": false; }; "max": { "alias": "max"; "required": false; }; }, { "dateChange": "clrDateChange"; }, never, never, false, never>;
}

declare class ClrStartDateInput extends ClrDateInputBase {
    dateChange: EventEmitter<Date>;
    inputWidth: number;
    set date(date: Date | string);
    get inputSize(): number;
    protected get userSelectedDayChange(): rxjs.Observable<DayModel>;
    ngOnInit(): void;
    protected updateDayModel(dayModel: DayModel): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStartDateInput, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStartDateInput, "[clrStartDate]", never, { "inputWidth": { "alias": "inputWidth"; "required": false; }; "date": { "alias": "clrStartDate"; "required": false; }; }, { "dateChange": "clrStartDateChange"; }, never, never, false, never>;
}

declare class ClrEndDateInput extends ClrDateInputBase {
    dateChange: EventEmitter<Date>;
    inputWidth: number;
    set date(date: Date | string);
    get inputSize(): number;
    protected get userSelectedDayChange(): rxjs.Observable<DayModel>;
    ngOnInit(): void;
    protected updateDayModel(dayModel: DayModel): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrEndDateInput, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrEndDateInput, "[clrEndDate]", never, { "inputWidth": { "alias": "inputWidth"; "required": false; }; "date": { "alias": "clrEndDate"; "required": false; }; }, { "dateChange": "clrEndDateChange"; }, never, never, false, never>;
}

declare class ClrDateInputValidator implements Validator {
    private dateIOService;
    constructor(dateIOService: DateIOService);
    validate(control: AbstractControl): ValidationErrors;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDateInputValidator, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDateInputValidator, "[clrDate], [clrStartDate], [clrEndDate]", never, {}, {}, never, never, false, never>;
}
declare class ClrStartDateInputValidator implements Validator {
    private dateIOService;
    private dateNavigationService;
    constructor(dateIOService: DateIOService, dateNavigationService: DateNavigationService);
    validate(control: AbstractControl): ValidationErrors;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStartDateInputValidator, [{ optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStartDateInputValidator, "[clrStartDate]", never, {}, {}, never, never, false, never>;
}
declare class ClrEndDateInputValidator implements Validator {
    private dateIOService;
    private dateNavigationService;
    constructor(dateIOService: DateIOService, dateNavigationService: DateNavigationService);
    validate(control: AbstractControl): ValidationErrors;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrEndDateInputValidator, [{ optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrEndDateInputValidator, "[clrEndDate]", never, {}, {}, never, never, false, never>;
}

declare class ClrDatepickerViewManager {
    commonStrings: ClrCommonStringsService;
    private viewManagerService;
    private dateNavigationService;
    private dateIOService;
    constructor(commonStrings: ClrCommonStringsService, viewManagerService: ViewManagerService, dateNavigationService: DateNavigationService, dateIOService: DateIOService);
    /**
     * Returns if the current view is the monthpicker.
     */
    get isMonthView(): boolean;
    /**
     * Returns if the current view is the yearpicker.
     */
    get isYearView(): boolean;
    /**
     * Returns if the current view is the daypicker.
     */
    get isDayView(): boolean;
    get hasRangeOptions(): boolean;
    protected get hasActionButtons(): boolean;
    protected get dateRangeOptions(): any;
    onRangeOptionSelect(selectedRange: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatepickerViewManager, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatepickerViewManager, "clr-datepicker-view-manager", never, {}, {}, never, never, false, never>;
}

declare class ClrDaypicker {
    private _viewManagerService;
    private _dateNavigationService;
    private _localeHelperService;
    commonStrings: ClrCommonStringsService;
    constructor(_viewManagerService: ViewManagerService, _dateNavigationService: DateNavigationService, _localeHelperService: LocaleHelperService, commonStrings: ClrCommonStringsService);
    get monthAttrString(): string;
    get yearAttrString(): string;
    /**
     * Returns the month value of the calendar in the TranslationWidth.Abbreviated format.
     */
    get calendarMonth(): string;
    /**
     * Returns the year value of the calendar.
     */
    get calendarYear(): number;
    /**
     * Calls the ViewManagerService to change to the monthpicker view.
     */
    changeToMonthView(): void;
    /**
     * Calls the ViewManagerService to change to the yearpicker view.
     */
    changeToYearView(): void;
    /**
     * Calls the DateNavigationService to move to the next month.
     */
    nextMonth(): void;
    /**
     * Calls the DateNavigationService to move to the previous month.
     */
    previousMonth(): void;
    /**
     * Calls the DateNavigationService to move to the current month.
     */
    currentMonth(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDaypicker, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDaypicker, "clr-daypicker", never, {}, {}, never, never, false, never>;
}

declare class ClrMonthpicker implements AfterViewInit {
    private _localeHelperService;
    private _dateNavigationService;
    private _datepickerFocusService;
    private _elRef;
    private _viewManagerService;
    commonStrings: ClrCommonStringsService;
    /**
     * Keeps track of the current focused month.
     */
    private _focusedMonthIndex;
    constructor(_localeHelperService: LocaleHelperService, _dateNavigationService: DateNavigationService, _datepickerFocusService: DatepickerFocusService, _elRef: ElementRef, _viewManagerService: ViewManagerService, commonStrings: ClrCommonStringsService);
    /**
     * Gets the months array which is used to rendered the monthpicker view.
     * Months are in the TranslationWidth.Wide format.
     */
    get monthNames(): ReadonlyArray<string>;
    /**
     * Gets the month value of the Calendar.
     */
    get calendarMonthIndex(): number;
    /**
     * Gets the year which the user is currently on.
     */
    get calendarEndMonthIndex(): number;
    get yearAttrString(): string;
    /**
     * Returns the year value of the calendar.
     */
    get calendarYear(): number;
    get currentCalendarYear(): number;
    get currentCalendarMonth(): number;
    getIsRangeStartMonth(monthIndex: number): boolean;
    getIsRangeEndMonth(monthIndex: number): boolean;
    /**
     * Calls the ViewManagerService to change to the yearpicker view.
     */
    changeToYearView(): void;
    /**
     * Focuses on the current calendar month when the View is initialized.
     */
    ngAfterViewInit(): void;
    /**
     * Handles the Keyboard arrow navigation for the monthpicker.
     */
    onKeyDown(event: KeyboardEvent): void;
    isSelected(monthIndex: number): boolean;
    /**
     * Calls the DateNavigationService to update the hovered month value of the calendar
     */
    onHover(monthIndex: number): void;
    /**
     * Calls the DateNavigationService to update the month value of the calendar.
     * Also changes the view to the daypicker.
     */
    changeMonth(monthIndex: number): void;
    /**
     * Compares the month passed to the focused month and returns the tab index.
     */
    getTabIndex(monthIndex: number): number;
    /**
     * Calls the DateNavigationService to move to the next month.
     */
    nextYear(): void;
    /**
     * Calls the DateNavigationService to move to the previous month.
     */
    previousYear(): void;
    /**
     * Calls the DateNavigationService to move to the current month.
     */
    currentYear(): void;
    /**
     * Applicable only to date range picker
     * Compares the month passed is in between the start and end date range
     */
    isInRange(monthIndex: number): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrMonthpicker, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrMonthpicker, "clr-monthpicker", never, {}, {}, never, never, false, never>;
}

declare class YearRangeModel {
    private readonly year;
    yearRange: number[];
    constructor(year: number);
    /**
     * Gets the number in the middle of the range.
     */
    get middleYear(): number;
    /**
     * Generates the YearRangeModel for the next decade.
     */
    nextDecade(): YearRangeModel;
    /**
     * Generates the YearRangeModel for the previous decade.
     */
    previousDecade(): YearRangeModel;
    /**
     * Generates the YearRangeModel for the current decade.
     */
    currentDecade(): YearRangeModel;
    /**
     * Checks if the value is in the YearRangeModel.
     */
    inRange(value: number): boolean;
    /**
     * Generates the year range based on the year parameter.
     * eg: If 2018 is passed the output will be [2010, 2011, ..., 2019]
     */
    private generateYearRange;
    /**
     * Function which generate a range of numbers from floor to ceil.
     */
    private generateRange;
}

declare class ClrYearpicker implements AfterViewInit {
    private _dateNavigationService;
    private _viewManagerService;
    private _datepickerFocusService;
    private _elRef;
    commonStrings: ClrCommonStringsService;
    /**
     * YearRangeModel which is used to build the YearPicker view.
     */
    yearRangeModel: YearRangeModel;
    /**
     * Keeps track of the current focused year.
     */
    private _focusedYear;
    constructor(_dateNavigationService: DateNavigationService, _viewManagerService: ViewManagerService, _datepickerFocusService: DatepickerFocusService, _elRef: ElementRef<HTMLElement>, commonStrings: ClrCommonStringsService);
    get selectedStartYear(): number;
    get selectedEndYear(): number;
    /**
     * Gets the year which the user is currently on.
     */
    get calendarYear(): number;
    isCurrentCalendarYear(year: number): boolean;
    getIsRangeStartYear(year: number): boolean;
    getIsRangeEndYear(year: number): boolean;
    /**
     * Focuses on the current calendar year when the View is initialized.
     */
    ngAfterViewInit(): void;
    /**
     * Handles the Keyboard arrow navigation for the yearpicker.
     */
    onKeyDown(event: KeyboardEvent): void;
    /**
     * Calls the DateNavigationService to update the year value of the calendar.
     * Also changes the view to the daypicker.
     */
    changeYear(year: number): void;
    /**
     * Calls the DateNavigationService to update the hovered year value of the calendar
     */
    onHover(year: number): void;
    /**
     * Updates the YearRangeModel to the previous decade.
     */
    previousDecade(): void;
    /**
     * Updates the YearRangeModel to the current decade.
     */
    currentDecade(): void;
    /**
     * Updates the YearRangeModel to the next decade.
     */
    nextDecade(): void;
    /**
     * Compares the year passed to the focused year and returns the tab index.
     */
    getTabIndex(year: number): number;
    /**
     * Applicable only to date range picker
     * Compares the year passed is in between the start and end date range
     */
    isInRange(year: number): boolean;
    changeToDayView(): void;
    /**
     * Increments the focus year by the value passed. Updates the YearRangeModel if the
     * new value is not in the current decade.
     */
    private incrementFocusYearBy;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrYearpicker, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrYearpicker, "clr-yearpicker", never, {}, {}, never, never, false, never>;
}

declare class DayViewModel {
    dayModel: DayModel;
    isTodaysDate: boolean;
    isExcluded: boolean;
    isDisabled: boolean;
    isSelected: boolean;
    isFocusable: boolean;
    isRangeStartDay: boolean;
    isRangeEndDay: boolean;
    constructor(dayModel: DayModel, isTodaysDate?: boolean, isExcluded?: boolean, isDisabled?: boolean, isSelected?: boolean, isFocusable?: boolean, isRangeStartDay?: boolean, isRangeEndDay?: boolean);
    /**
     * Gets the tab index based on the isFocusable flag.
     */
    get tabIndex(): number;
}

declare class CalendarViewModel {
    calendar: CalendarModel;
    selectedDay: DayModel;
    selectedEndDay: DayModel;
    private focusableDay;
    private today;
    firstDayOfWeek: number;
    private excludedDates;
    private currMonthDayViews;
    private _calendarView;
    constructor(calendar: CalendarModel, selectedDay: DayModel, selectedEndDay: DayModel, focusableDay: DayModel, today: DayModel, firstDayOfWeek: number, excludedDates: DateRange);
    /**
     * DayViewModel matrix. Size 6x7
     */
    get calendarView(): DayViewModel[][];
    /**
     * Updates the focusable day in the calendar.
     */
    updateFocusableDay(day: DayModel): void;
    /**
     * Updates the selected day in the calendar
     */
    updateSelectedDay(day: DayModel | undefined): void;
    /**
     * Updates the selected end day in the calendar
     */
    updateSelectedEndDay(day: DayModel | undefined): void;
    /**
     * Generates a 6x7 matrix of DayViewModel based on the Calendar.
     * The 6x7 matrix is structured according to the first day of the week.
     * 6 rows to accommodate months which might have dates spanning over 6 weeks.
     * 7 columns because there are 7 days in a week :P :D
     */
    private initializeCalendarView;
    private isDateExcluded;
    /**
     * Generates a DayViewModel array based on the DayModel passed
     */
    private generateDayViewModels;
    /**
     * Gets the first day of the current month to figure out how many dates of previous month
     * are needed to complete the Calendar View based on the first day of the week.
     * eg: Assuming locale en-US, the first day of the week is Sunday,
     * if first day of the current month lands on Wednesday, then
     * (this.getDay function would return 3 since
     * first day of the week is 0), we need the 3 days from the previous month.
     */
    private numDaysFromPrevMonthInCalView;
    /**
     * Checks if the Day passed is in the CalendarView.
     */
    private isDayInCalendarView;
    /**
     * Using the DayViewModels from the previous, current and next month, this function
     * generates the CalendarView.
     */
    private generateCalendarView;
    /**
     * Initialize the selected day if the day is in the calendar.
     */
    private initializeSelectedDay;
    /**
     * Initializes the focusable day if the day is in the calendar. If focusable day is not set, then
     * we check for the selected day. If selected day is not set then check if today is in the current
     * calendar. If not then just set the 15th of the current calendar month.
     */
    private initializeFocusableDay;
    private setFocusableFlag;
    private setSelectedDay;
}

declare class ClrCalendar implements OnDestroy {
    private _localeHelperService;
    private _dateNavigationService;
    private _datepickerFocusService;
    private _dateIOService;
    private _elRef;
    private _dateFormControlService;
    private _popoverService;
    /**
     * Calendar View Model to generate the Calendar.
     */
    calendarViewModel: CalendarViewModel;
    private _subs;
    constructor(_localeHelperService: LocaleHelperService, _dateNavigationService: DateNavigationService, _datepickerFocusService: DatepickerFocusService, _dateIOService: DateIOService, _elRef: ElementRef<HTMLElement>, _dateFormControlService: DateFormControlService, _popoverService: ClrPopoverService);
    /**
     * Gets the locale days according to the TranslationWidth.Narrow format.
     */
    get localeDays(): ReadonlyArray<ClrDayOfWeek>;
    get calendar(): CalendarModel;
    get selectedDay(): DayModel;
    get selectedEndDay(): DayModel;
    get focusedDay(): DayModel;
    get today(): DayModel;
    /**
     * Focuses on the focusable day when the Calendar View is initialized.
     */
    ngAfterViewInit(): void;
    /**
     * Unsubscribe from subscriptions.
     */
    ngOnDestroy(): void;
    /**
     * Delegates Keyboard arrow navigation to the DateNavigationService.
     */
    onKeyDown(event: KeyboardEvent): void;
    setSelectedDay(day: DayModel): void;
    /**
     * Initialize subscriptions to:
     * 1. update the calendar view model.
     * 2. update the focusable day in the calendar view model.
     * 3. focus on the focusable day in the calendar.
     */
    private initializeSubscriptions;
    private validateAndCloseDatePicker;
    private updateCalendarViewModal;
    private refreshCalendarViewModal;
    /**
     * Generates the Calendar View based on the calendar retrieved from the DateNavigationService.
     */
    private generateCalendarView;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCalendar, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCalendar, "clr-calendar", never, {}, {}, never, never, false, never>;
}

declare class ClrDay {
    private _dateNavigationService;
    private commonStrings;
    onSelectDay: EventEmitter<DayModel>;
    private _dayView;
    constructor(_dateNavigationService: DateNavigationService, commonStrings: ClrCommonStringsService);
    /**
     * DayViewModel input which is used to build the Day View.
     */
    get dayView(): DayViewModel;
    set dayView(day: DayViewModel);
    get dayString(): string;
    get isRangeStartDay(): boolean;
    get isRangeEndDay(): boolean;
    /**
     * Calls the DateNavigationService to update the hovered day value of the calendar
     */
    hoverListener(): void;
    /**
     * Updates the focusedDay in the DateNavigationService when the ClrDay is focused.
     */
    onDayViewFocus(): void;
    /**
     * Updates the selectedDay when the ClrDay is selected and closes the datepicker popover.
     */
    selectDay(): void;
    /**
     * Applicable only to date range picker
     * Compares whether the day is in between the start and end date range
     */
    isInRange(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDay, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDay, "clr-day", never, { "dayView": { "alias": "clrDayView"; "required": false; }; }, { "onSelectDay": "selectDay"; }, never, never, false, never>;
}

declare class ClrDatepickerActions {
    protected commonStrings: ClrCommonStringsService;
    private popoverService;
    private dateNavigationService;
    private dateFormControlService;
    constructor(commonStrings: ClrCommonStringsService, popoverService: ClrPopoverService, dateNavigationService: DateNavigationService, dateFormControlService: DateFormControlService);
    protected apply(): void;
    protected cancel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatepickerActions, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatepickerActions, "clr-datepicker-actions", never, {}, {}, never, never, false, never>;
}

declare const CLR_DATEPICKER_DIRECTIVES: Type<any>[];
declare class ClrDatepickerModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatepickerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrDatepickerModule, [typeof ClrDateInput, typeof ClrDay, typeof ClrDateContainer, typeof ClrDateInputValidator, typeof ClrStartDateInput, typeof ClrEndDateInput, typeof ClrStartDateInputValidator, typeof ClrEndDateInputValidator, typeof ClrDatepickerViewManager, typeof ClrMonthpicker, typeof ClrYearpicker, typeof ClrDaypicker, typeof ClrCalendar, typeof ClrDatepickerActions], [typeof i13.CommonModule, typeof i14.CdkTrapFocusModule, typeof i14.ClrHostWrappingModule, typeof i14.ClrConditionalModule, typeof i1.ÇlrClrPopoverModuleNext, typeof i16.ClrIcon, typeof i17.ClrCommonFormsModule, typeof i18.ClrVerticalNavModule], [typeof ClrDateInput, typeof ClrDay, typeof ClrDateContainer, typeof ClrDateInputValidator, typeof ClrStartDateInput, typeof ClrEndDateInput, typeof ClrStartDateInputValidator, typeof ClrEndDateInputValidator, typeof ClrDatepickerViewManager, typeof ClrMonthpicker, typeof ClrYearpicker, typeof ClrDaypicker, typeof ClrCalendar, typeof ClrDatepickerActions]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrDatepickerModule>;
}

export { CLR_DATEPICKER_DIRECTIVES, ClrCalendar, ClrDateContainer, ClrDateInput, ClrDateInputBase, ClrDateInputValidator, ClrDatepickerActions, ClrDatepickerModule, ClrDatepickerViewManager, ClrDay, ClrDaypicker, ClrEndDateInput, ClrEndDateInputValidator, ClrMonthpicker, ClrStartDateInput, ClrStartDateInputValidator, ClrYearpicker };
