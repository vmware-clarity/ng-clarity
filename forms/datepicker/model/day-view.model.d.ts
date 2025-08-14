import { DayModel } from './day.model';
export declare class DayViewModel {
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
