import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { LocaleHelperService } from './providers/locale-helper.service';
import { ViewManagerService } from './providers/view-manager.service';
import * as i0 from "@angular/core";
export declare class ClrDaypicker {
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
