import { AfterViewInit, ElementRef } from '@angular/core';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { YearRangeModel } from './model/year-range.model';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { ViewManagerService } from './providers/view-manager.service';
import * as i0 from "@angular/core";
export declare class ClrYearpicker implements AfterViewInit {
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
