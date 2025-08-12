import { ElementRef, NgZone } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * This service focuses the day that is focusable in the calendar.
 */
export declare class DatepickerFocusService {
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
