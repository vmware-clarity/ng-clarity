import { ElementRef, OnDestroy } from '@angular/core';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { ClrDayOfWeek } from './interfaces/day-of-week.interface';
import { CalendarViewModel } from './model/calendar-view.model';
import { CalendarModel } from './model/calendar.model';
import { DayModel } from './model/day.model';
import { DateFormControlService } from './providers/date-form-control.service';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { LocaleHelperService } from './providers/locale-helper.service';
import * as i0 from "@angular/core";
export declare class ClrCalendar implements OnDestroy {
    private _localeHelperService;
    private _dateNavigationService;
    private _datepickerFocusService;
    private _dateIOService;
    private _elRef;
    private _dateFormControlService;
    private _toggleService;
    /**
     * Calendar View Model to generate the Calendar.
     */
    calendarViewModel: CalendarViewModel;
    private _subs;
    constructor(_localeHelperService: LocaleHelperService, _dateNavigationService: DateNavigationService, _datepickerFocusService: DatepickerFocusService, _dateIOService: DateIOService, _elRef: ElementRef<HTMLElement>, _dateFormControlService: DateFormControlService, _toggleService: ClrPopoverToggleService);
    /**
     * Gets the locale days according to the TranslationWidth.Narrow format.
     */
    get localeDays(): ReadonlyArray<ClrDayOfWeek>;
    get calendar(): CalendarModel;
    get selectedDay(): DayModel;
    get selectedEndDay(): DayModel;
    get focusedDay(): DayModel;
    get today(): DayModel;
    /**
     * Focuses on the focusable day when the Calendar View is initialized.
     */
    ngAfterViewInit(): void;
    /**
     * Unsubscribe from subscriptions.
     */
    ngOnDestroy(): void;
    /**
     * Delegates Keyboard arrow navigation to the DateNavigationService.
     */
    onKeyDown(event: KeyboardEvent): void;
    setSelectedDay(day: DayModel): void;
    /**
     * Initialize subscriptions to:
     * 1. update the calendar view model.
     * 2. update the focusable day in the calendar view model.
     * 3. focus on the focusable day in the calendar.
     */
    private initializeSubscriptions;
    private validateAndCloseDatePicker;
    private updateCalendarViewModal;
    private refreshCalendarViewModal;
    /**
     * Generates the Calendar View based on the calendar retrieved from the DateNavigationService.
     */
    private generateCalendarView;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCalendar, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCalendar, "clr-calendar", never, {}, {}, never, never, false, never>;
}
