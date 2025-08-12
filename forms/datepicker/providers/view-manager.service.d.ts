import { ClrPopoverPosition } from '../../../utils/popover/interfaces/popover-position.interface';
import * as i0 from "@angular/core";
/**
 * This service manages which view is visible in the datepicker popover.
 */
export declare class ViewManagerService {
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
