import { ClrPopoverPosition } from '../../../utils/popover/interfaces/popover-position.interface';
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
}
