import { EventEmitter } from '@angular/core';
import { DayViewModel } from './model/day-view.model';
import { DayModel } from './model/day.model';
import { DateNavigationService } from './providers/date-navigation.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
export declare class ClrDay {
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
}
