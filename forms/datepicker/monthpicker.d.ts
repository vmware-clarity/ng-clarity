import { AfterViewInit, ElementRef } from '@angular/core';
import { ClrCommonStringsService } from '../../utils';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { LocaleHelperService } from './providers/locale-helper.service';
import { ViewManagerService } from './providers/view-manager.service';
import * as i0 from "@angular/core";
export declare class ClrMonthpicker implements AfterViewInit {
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
