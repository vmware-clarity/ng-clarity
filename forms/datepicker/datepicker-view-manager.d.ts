import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { ViewManagerService } from './providers/view-manager.service';
import * as i0 from "@angular/core";
export declare class ClrDatepickerViewManager {
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
