import * as i0 from "@angular/core";
export declare class DatepickerEnabledService {
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
