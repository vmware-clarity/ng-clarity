/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, HostListener } from '@angular/core';
import { Keys } from '../../utils/enums/keys.enum';
import { normalizeKey } from '../../utils/focus/key-focus/util';
import { CalendarViewModel } from './model/calendar-view.model';
import { NO_OF_DAYS_IN_A_WEEK } from './utils/constants';
import * as i0 from "@angular/core";
import * as i1 from "./providers/locale-helper.service";
import * as i2 from "./providers/date-navigation.service";
import * as i3 from "./providers/datepicker-focus.service";
import * as i4 from "./providers/date-io.service";
import * as i5 from "./providers/date-form-control.service";
import * as i6 from "../../utils/popover/providers/popover-toggle.service";
import * as i7 from "@angular/common";
import * as i8 from "./day";
export class ClrCalendar {
    constructor(_localeHelperService, _dateNavigationService, _datepickerFocusService, _dateIOService, _elRef, _dateFormControlService, _toggleService) {
        this._localeHelperService = _localeHelperService;
        this._dateNavigationService = _dateNavigationService;
        this._datepickerFocusService = _datepickerFocusService;
        this._dateIOService = _dateIOService;
        this._elRef = _elRef;
        this._dateFormControlService = _dateFormControlService;
        this._toggleService = _toggleService;
        this._subs = [];
        this.generateCalendarView();
        this.initializeSubscriptions();
    }
    /**
     * Gets the locale days according to the TranslationWidth.Narrow format.
     */
    get localeDays() {
        return this._localeHelperService.localeDays;
    }
    get calendar() {
        return this._dateNavigationService.displayedCalendar;
    }
    get selectedDay() {
        return this._dateNavigationService.selectedDay;
    }
    get selectedEndDay() {
        return this._dateNavigationService.selectedEndDay;
    }
    get focusedDay() {
        return this._dateNavigationService.focusedDay;
    }
    get today() {
        return this._dateNavigationService.today;
    }
    /**
     * Focuses on the focusable day when the Calendar View is initialized.
     */
    ngAfterViewInit() {
        this._datepickerFocusService.focusCell(this._elRef);
    }
    /**
     * Unsubscribe from subscriptions.
     */
    ngOnDestroy() {
        this._subs.forEach((sub) => sub.unsubscribe());
    }
    /**
     * Delegates Keyboard arrow navigation to the DateNavigationService.
     */
    onKeyDown(event) {
        if (event && this.focusedDay) {
            switch (normalizeKey(event.key)) {
                case Keys.ArrowUp:
                    event.preventDefault();
                    this._dateNavigationService.incrementFocusDay(-1 * NO_OF_DAYS_IN_A_WEEK);
                    break;
                case Keys.ArrowDown:
                    event.preventDefault();
                    this._dateNavigationService.incrementFocusDay(NO_OF_DAYS_IN_A_WEEK);
                    break;
                case Keys.ArrowLeft:
                    event.preventDefault();
                    this._dateNavigationService.incrementFocusDay(-1);
                    break;
                case Keys.ArrowRight:
                    event.preventDefault();
                    this._dateNavigationService.incrementFocusDay(1);
                    break;
                default:
                    break; // No default case. ESLint x-(
            }
        }
    }
    setSelectedDay(day) {
        const hasActionButtons = this._dateNavigationService.hasActionButtons;
        const selectedDates = this.updateCalendarViewModal(day);
        this._dateNavigationService.notifySelectedDayChanged(selectedDates, { emitEvent: !hasActionButtons });
        if (!hasActionButtons) {
            this._dateFormControlService.markAsDirty();
            this.validateAndCloseDatePicker();
        }
    }
    /**
     * Initialize subscriptions to:
     * 1. update the calendar view model.
     * 2. update the focusable day in the calendar view model.
     * 3. focus on the focusable day in the calendar.
     */
    initializeSubscriptions() {
        this._subs.push(this._dateNavigationService.displayedCalendarChange.subscribe(() => {
            this.generateCalendarView();
        }));
        this._subs.push(this._dateNavigationService.focusedDayChange.subscribe((focusedDay) => {
            this.calendarViewModel.updateFocusableDay(focusedDay);
        }));
        this._subs.push(this._dateNavigationService.focusOnCalendarChange.subscribe(() => {
            this._datepickerFocusService.focusCell(this._elRef);
        }));
        this._subs.push(this._dateNavigationService.refreshCalendarView.subscribe(() => {
            this.refreshCalendarViewModal();
        }));
    }
    validateAndCloseDatePicker() {
        if ((this._dateNavigationService.isRangePicker &&
            this._dateNavigationService.selectedDay &&
            this._dateNavigationService.selectedEndDay) ||
            (!this._dateNavigationService.isRangePicker && this._dateNavigationService.selectedDay)) {
            this._toggleService.open = false;
        }
    }
    updateCalendarViewModal(day) {
        const startDate = this.calendarViewModel.selectedDay || null, isRangePicker = this._dateNavigationService.isRangePicker;
        let endDate = this.calendarViewModel.selectedEndDay || null;
        if (isRangePicker) {
            if (!startDate || (!!startDate && !!endDate) || (!!startDate && day?.isBefore(startDate))) {
                this.calendarViewModel.updateSelectedDay(day);
                if (endDate) {
                    endDate = undefined;
                    this.calendarViewModel.updateSelectedEndDay(endDate);
                }
            }
            else {
                this.calendarViewModel.updateSelectedEndDay(day);
            }
        }
        else {
            this.calendarViewModel.updateSelectedDay(day);
        }
        return isRangePicker
            ? { startDate: this.calendarViewModel.selectedDay, endDate: this.calendarViewModel.selectedEndDay }
            : this.calendarViewModel.selectedDay;
    }
    refreshCalendarViewModal() {
        this.calendarViewModel.updateSelectedDay(this._dateNavigationService.selectedDay);
        if (this._dateNavigationService.isRangePicker) {
            this.calendarViewModel.updateSelectedEndDay(this._dateNavigationService.selectedEndDay);
        }
    }
    /**
     * Generates the Calendar View based on the calendar retrieved from the DateNavigationService.
     */
    generateCalendarView() {
        this.calendarViewModel = new CalendarViewModel(this.calendar, this.selectedDay, this.selectedEndDay, this.focusedDay, this.today, this._localeHelperService.firstDayOfWeek, this._dateIOService.disabledDates);
    }
}
ClrCalendar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCalendar, deps: [{ token: i1.LocaleHelperService }, { token: i2.DateNavigationService }, { token: i3.DatepickerFocusService }, { token: i4.DateIOService }, { token: i0.ElementRef }, { token: i5.DateFormControlService }, { token: i6.ClrPopoverToggleService }], target: i0.ɵɵFactoryTarget.Component });
ClrCalendar.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrCalendar, selector: "clr-calendar", host: { listeners: { "keydown": "onKeyDown($event)" } }, ngImport: i0, template: "<table class=\"calendar-table\" role=\"presentation\">\n  <tr class=\"calendar-row weekdays\">\n    <th *ngFor=\"let day of localeDays\" class=\"calendar-cell weekday\">\n      <span [attr.aria-label]=\"day.day\">{{day.narrow}}</span>\n    </th>\n  </tr>\n  <tr class=\"calendar-row\" *ngFor=\"let row of calendarViewModel.calendarView\">\n    <td *ngFor=\"let dayView of row\" class=\"calendar-cell\">\n      <clr-day [clrDayView]=\"dayView\" (selectDay)=\"setSelectedDay($event)\"></clr-day>\n    </td>\n  </tr>\n</table>\n", dependencies: [{ kind: "directive", type: i7.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "component", type: i8.ClrDay, selector: "clr-day", inputs: ["clrDayView"], outputs: ["selectDay"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCalendar, decorators: [{
            type: Component,
            args: [{ selector: 'clr-calendar', template: "<table class=\"calendar-table\" role=\"presentation\">\n  <tr class=\"calendar-row weekdays\">\n    <th *ngFor=\"let day of localeDays\" class=\"calendar-cell weekday\">\n      <span [attr.aria-label]=\"day.day\">{{day.narrow}}</span>\n    </th>\n  </tr>\n  <tr class=\"calendar-row\" *ngFor=\"let row of calendarViewModel.calendarView\">\n    <td *ngFor=\"let dayView of row\" class=\"calendar-cell\">\n      <clr-day [clrDayView]=\"dayView\" (selectDay)=\"setSelectedDay($event)\"></clr-day>\n    </td>\n  </tr>\n</table>\n" }]
        }], ctorParameters: function () { return [{ type: i1.LocaleHelperService }, { type: i2.DateNavigationService }, { type: i3.DatepickerFocusService }, { type: i4.DateIOService }, { type: i0.ElementRef }, { type: i5.DateFormControlService }, { type: i6.ClrPopoverToggleService }]; }, propDecorators: { onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9kYXRlcGlja2VyL2NhbGVuZGFyLnRzIiwiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvZGF0ZXBpY2tlci9jYWxlbmRhci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBYyxZQUFZLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFHL0UsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ25ELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUloRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQVFoRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7Ozs7Ozs7OztBQU16RCxNQUFNLE9BQU8sV0FBVztJQVF0QixZQUNVLG9CQUF5QyxFQUN6QyxzQkFBNkMsRUFDN0MsdUJBQStDLEVBQy9DLGNBQTZCLEVBQzdCLE1BQStCLEVBQy9CLHVCQUErQyxFQUMvQyxjQUF1QztRQU52Qyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXFCO1FBQ3pDLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBdUI7UUFDN0MsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUF3QjtRQUMvQyxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQUM3QixXQUFNLEdBQU4sTUFBTSxDQUF5QjtRQUMvQiw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXdCO1FBQy9DLG1CQUFjLEdBQWQsY0FBYyxDQUF5QjtRQVR6QyxVQUFLLEdBQW1CLEVBQUUsQ0FBQztRQVdqQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lB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QUFzQixDQUFDLGFBQWEsRUFBRTtZQUM3QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQ3pGO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0ssb0JBQW9CO1FBQzFCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLGlCQUFpQixDQUM1QyxJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxXQUFXLEVBQ2hCLElBQUksQ0FBQyxjQUFjLEVBQ25CLElBQUksQ0FBQyxVQUFVLEVBQ2YsSUFBSSxDQUFDLEtBQUssRUFDVixJQUFJLENBQUMsb0JBQW9CLENBQUMsY0FBYyxFQUN4QyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FDbEMsQ0FBQztJQUNKLENBQUM7O3dHQTVMVSxXQUFXOzRGQUFYLFdBQVcsNkdDN0J4QiwrZ0JBWUE7MkZEaUJhLFdBQVc7a0JBSnZCLFNBQVM7K0JBQ0UsY0FBYzttVEFxRXhCLFNBQVM7c0JBRFIsWUFBWTt1QkFBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBLZXlzIH0gZnJvbSAnLi4vLi4vdXRpbHMvZW51bXMva2V5cy5lbnVtJztcbmltcG9ydCB7IG5vcm1hbGl6ZUtleSB9IGZyb20gJy4uLy4uL3V0aWxzL2ZvY3VzL2tleS1mb2N1cy91dGlsJztcbmltcG9ydCB7IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wcm92aWRlcnMvcG9wb3Zlci10b2dnbGUuc2VydmljZSc7XG5pbXBvcnQgeyBEYXRlUmFuZ2VJbnB1dCB9IGZyb20gJy4vaW50ZXJmYWNlcy9kYXRlLXJhbmdlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBDbHJEYXlPZldlZWsgfSBmcm9tICcuL2ludGVyZmFjZXMvZGF5LW9mLXdlZWsuaW50ZXJmYWNlJztcbmltcG9ydCB7IENhbGVuZGFyVmlld01vZGVsIH0gZnJvbSAnLi9tb2RlbC9jYWxlbmRhci12aWV3Lm1vZGVsJztcbmltcG9ydCB7IENhbGVuZGFyTW9kZWwgfSBmcm9tICcuL21vZGVsL2NhbGVuZGFyLm1vZGVsJztcbmltcG9ydCB7IERheU1vZGVsIH0gZnJvbSAnLi9tb2RlbC9kYXkubW9kZWwnO1xuaW1wb3J0IHsgRGF0ZUZvcm1Db250cm9sU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2RhdGUtZm9ybS1jb250cm9sLnNlcnZpY2UnO1xuaW1wb3J0IHsgRGF0ZUlPU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2RhdGUtaW8uc2VydmljZSc7XG5pbXBvcnQgeyBEYXRlTmF2aWdhdGlvblNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9kYXRlLW5hdmlnYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBEYXRlcGlja2VyRm9jdXNTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGF0ZXBpY2tlci1mb2N1cy5zZXJ2aWNlJztcbmltcG9ydCB7IExvY2FsZUhlbHBlclNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9sb2NhbGUtaGVscGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgTk9fT0ZfREFZU19JTl9BX1dFRUsgfSBmcm9tICcuL3V0aWxzL2NvbnN0YW50cyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1jYWxlbmRhcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9jYWxlbmRhci5odG1sJyxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyQ2FsZW5kYXIgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogQ2FsZW5kYXIgVmlldyBNb2RlbCB0byBnZW5lcmF0ZSB0aGUgQ2FsZW5kYXIuXG4gICAqL1xuICBjYWxlbmRhclZpZXdNb2RlbDogQ2FsZW5kYXJWaWV3TW9kZWw7XG5cbiAgcHJpdmF0ZSBfc3ViczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9sb2NhbGVIZWxwZXJTZXJ2aWNlOiBMb2NhbGVIZWxwZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgX2RhdGVOYXZpZ2F0aW9uU2VydmljZTogRGF0ZU5hdmlnYXRpb25TZXJ2aWNlLFxuICAgIHByaXZhdGUgX2RhdGVwaWNrZXJGb2N1c1NlcnZpY2U6IERhdGVwaWNrZXJGb2N1c1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBfZGF0ZUlPU2VydmljZTogRGF0ZUlPU2VydmljZSxcbiAgICBwcml2YXRlIF9lbFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfZGF0ZUZvcm1Db250cm9sU2VydmljZTogRGF0ZUZvcm1Db250cm9sU2VydmljZSxcbiAgICBwcml2YXRlIF90b2dnbGVTZXJ2aWNlOiBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZVxuICApIHtcbiAgICB0aGlzLmdlbmVyYXRlQ2FsZW5kYXJWaWV3KCk7XG4gICAgdGhpcy5pbml0aWFsaXplU3Vic2NyaXB0aW9ucygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGxvY2FsZSBkYXlzIGFjY29yZGluZyB0byB0aGUgVHJhbnNsYXRpb25XaWR0aC5OYXJyb3cgZm9ybWF0LlxuICAgKi9cbiAgZ2V0IGxvY2FsZURheXMoKTogUmVhZG9ubHlBcnJheTxDbHJEYXlPZldlZWs+IHtcbiAgICByZXR1cm4gdGhpcy5fbG9jYWxlSGVscGVyU2VydmljZS5sb2NhbGVEYXlzO1xuICB9XG5cbiAgZ2V0IGNhbGVuZGFyKCk6IENhbGVuZGFyTW9kZWwge1xuICAgIHJldHVybiB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UuZGlzcGxheWVkQ2FsZW5kYXI7XG4gIH1cblxuICBnZXQgc2VsZWN0ZWREYXkoKTogRGF5TW9kZWwge1xuICAgIHJldHVybiB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWREYXk7XG4gIH1cblxuICBnZXQgc2VsZWN0ZWRFbmREYXkoKTogRGF5TW9kZWwge1xuICAgIHJldHVybiB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWRFbmREYXk7XG4gIH1cblxuICBnZXQgZm9jdXNlZERheSgpOiBEYXlNb2RlbCB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5mb2N1c2VkRGF5O1xuICB9XG5cbiAgZ2V0IHRvZGF5KCk6IERheU1vZGVsIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnRvZGF5O1xuICB9XG5cbiAgLyoqXG4gICAqIEZvY3VzZXMgb24gdGhlIGZvY3VzYWJsZSBkYXkgd2hlbiB0aGUgQ2FsZW5kYXIgVmlldyBpcyBpbml0aWFsaXplZC5cbiAgICovXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9kYXRlcGlja2VyRm9jdXNTZXJ2aWNlLmZvY3VzQ2VsbCh0aGlzLl9lbFJlZik7XG4gIH1cblxuICAvKipcbiAgICogVW5zdWJzY3JpYmUgZnJvbSBzdWJzY3JpcHRpb25zLlxuICAgKi9cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5fc3Vicy5mb3JFYWNoKChzdWI6IFN1YnNjcmlwdGlvbikgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGVnYXRlcyBLZXlib2FyZCBhcnJvdyBuYXZpZ2F0aW9uIHRvIHRoZSBEYXRlTmF2aWdhdGlvblNlcnZpY2UuXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgb25LZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKGV2ZW50ICYmIHRoaXMuZm9jdXNlZERheSkge1xuICAgICAgc3dpdGNoIChub3JtYWxpemVLZXkoZXZlbnQua2V5KSkge1xuICAgICAgICBjYXNlIEtleXMuQXJyb3dVcDpcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5pbmNyZW1lbnRGb2N1c0RheSgtMSAqIE5PX09GX0RBWVNfSU5fQV9XRUVLKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLZXlzLkFycm93RG93bjpcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5pbmNyZW1lbnRGb2N1c0RheShOT19PRl9EQVlTX0lOX0FfV0VFSyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS2V5cy5BcnJvd0xlZnQ6XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UuaW5jcmVtZW50Rm9jdXNEYXkoLTEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleXMuQXJyb3dSaWdodDpcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5pbmNyZW1lbnRGb2N1c0RheSgxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBicmVhazsgLy8gTm8gZGVmYXVsdCBjYXNlLiBFU0xpbnQgeC0oXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0U2VsZWN0ZWREYXkoZGF5OiBEYXlNb2RlbCkge1xuICAgIGNvbnN0IGhhc0FjdGlvbkJ1dHRvbnMgPSB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UuaGFzQWN0aW9uQnV0dG9ucztcbiAgICBjb25zdCBzZWxlY3RlZERhdGVzOiBEYXlNb2RlbCB8IERhdGVSYW5nZUlucHV0ID0gdGhpcy51cGRhdGVDYWxlbmRhclZpZXdNb2RhbChkYXkpO1xuICAgIHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5ub3RpZnlTZWxlY3RlZERheUNoYW5nZWQoc2VsZWN0ZWREYXRlcywgeyBlbWl0RXZlbnQ6ICFoYXNBY3Rpb25CdXR0b25zIH0pO1xuICAgIGlmICghaGFzQWN0aW9uQnV0dG9ucykge1xuICAgICAgdGhpcy5fZGF0ZUZvcm1Db250cm9sU2VydmljZS5tYXJrQXNEaXJ0eSgpO1xuICAgICAgdGhpcy52YWxpZGF0ZUFuZENsb3NlRGF0ZVBpY2tlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHN1YnNjcmlwdGlvbnMgdG86XG4gICAqIDEuIHVwZGF0ZSB0aGUgY2FsZW5kYXIgdmlldyBtb2RlbC5cbiAgICogMi4gdXBkYXRlIHRoZSBmb2N1c2FibGUgZGF5IGluIHRoZSBjYWxlbmRhciB2aWV3IG1vZGVsLlxuICAgKiAzLiBmb2N1cyBvbiB0aGUgZm9jdXNhYmxlIGRheSBpbiB0aGUgY2FsZW5kYXIuXG4gICAqL1xuICBwcml2YXRlIGluaXRpYWxpemVTdWJzY3JpcHRpb25zKCk6IHZvaWQge1xuICAgIHRoaXMuX3N1YnMucHVzaChcbiAgICAgIHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5kaXNwbGF5ZWRDYWxlbmRhckNoYW5nZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLmdlbmVyYXRlQ2FsZW5kYXJWaWV3KCk7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICB0aGlzLl9zdWJzLnB1c2goXG4gICAgICB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UuZm9jdXNlZERheUNoYW5nZS5zdWJzY3JpYmUoKGZvY3VzZWREYXk6IERheU1vZGVsKSA9PiB7XG4gICAgICAgIHRoaXMuY2FsZW5kYXJWaWV3TW9kZWwudXBkYXRlRm9jdXNhYmxlRGF5KGZvY3VzZWREYXkpO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgdGhpcy5fc3Vicy5wdXNoKFxuICAgICAgdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLmZvY3VzT25DYWxlbmRhckNoYW5nZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9kYXRlcGlja2VyRm9jdXNTZXJ2aWNlLmZvY3VzQ2VsbCh0aGlzLl9lbFJlZik7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICB0aGlzLl9zdWJzLnB1c2goXG4gICAgICB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UucmVmcmVzaENhbGVuZGFyVmlldy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLnJlZnJlc2hDYWxlbmRhclZpZXdNb2RhbCgpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZUFuZENsb3NlRGF0ZVBpY2tlcigpIHtcbiAgICBpZiAoXG4gICAgICAodGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLmlzUmFuZ2VQaWNrZXIgJiZcbiAgICAgICAgdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRGF5ICYmXG4gICAgICAgIHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5zZWxlY3RlZEVuZERheSkgfHxcbiAgICAgICghdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLmlzUmFuZ2VQaWNrZXIgJiYgdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRGF5KVxuICAgICkge1xuICAgICAgdGhpcy5fdG9nZ2xlU2VydmljZS5vcGVuID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVDYWxlbmRhclZpZXdNb2RhbChkYXk6IERheU1vZGVsKTogRGF5TW9kZWwgfCBEYXRlUmFuZ2VJbnB1dCB7XG4gICAgY29uc3Qgc3RhcnREYXRlID0gdGhpcy5jYWxlbmRhclZpZXdNb2RlbC5zZWxlY3RlZERheSB8fCBudWxsLFxuICAgICAgaXNSYW5nZVBpY2tlciA9IHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5pc1JhbmdlUGlja2VyO1xuICAgIGxldCBlbmREYXRlID0gdGhpcy5jYWxlbmRhclZpZXdNb2RlbC5zZWxlY3RlZEVuZERheSB8fCBudWxsO1xuXG4gICAgaWYgKGlzUmFuZ2VQaWNrZXIpIHtcbiAgICAgIGlmICghc3RhcnREYXRlIHx8ICghIXN0YXJ0RGF0ZSAmJiAhIWVuZERhdGUpIHx8ICghIXN0YXJ0RGF0ZSAmJiBkYXk/LmlzQmVmb3JlKHN0YXJ0RGF0ZSkpKSB7XG4gICAgICAgIHRoaXMuY2FsZW5kYXJWaWV3TW9kZWwudXBkYXRlU2VsZWN0ZWREYXkoZGF5KTtcbiAgICAgICAgaWYgKGVuZERhdGUpIHtcbiAgICAgICAgICBlbmREYXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIHRoaXMuY2FsZW5kYXJWaWV3TW9kZWwudXBkYXRlU2VsZWN0ZWRFbmREYXkoZW5kRGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2FsZW5kYXJWaWV3TW9kZWwudXBkYXRlU2VsZWN0ZWRFbmREYXkoZGF5KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jYWxlbmRhclZpZXdNb2RlbC51cGRhdGVTZWxlY3RlZERheShkYXkpO1xuICAgIH1cblxuICAgIHJldHVybiBpc1JhbmdlUGlja2VyXG4gICAgICA/IHsgc3RhcnREYXRlOiB0aGlzLmNhbGVuZGFyVmlld01vZGVsLnNlbGVjdGVkRGF5LCBlbmREYXRlOiB0aGlzLmNhbGVuZGFyVmlld01vZGVsLnNlbGVjdGVkRW5kRGF5IH1cbiAgICAgIDogdGhpcy5jYWxlbmRhclZpZXdNb2RlbC5zZWxlY3RlZERheTtcbiAgfVxuXG4gIHByaXZhdGUgcmVmcmVzaENhbGVuZGFyVmlld01vZGFsKCkge1xuICAgIHRoaXMuY2FsZW5kYXJWaWV3TW9kZWwudXBkYXRlU2VsZWN0ZWREYXkodGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRGF5KTtcbiAgICBpZiAodGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLmlzUmFuZ2VQaWNrZXIpIHtcbiAgICAgIHRoaXMuY2FsZW5kYXJWaWV3TW9kZWwudXBkYXRlU2VsZWN0ZWRFbmREYXkodGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRW5kRGF5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIHRoZSBDYWxlbmRhciBWaWV3IGJhc2VkIG9uIHRoZSBjYWxlbmRhciByZXRyaWV2ZWQgZnJvbSB0aGUgRGF0ZU5hdmlnYXRpb25TZXJ2aWNlLlxuICAgKi9cbiAgcHJpdmF0ZSBnZW5lcmF0ZUNhbGVuZGFyVmlldygpOiB2b2lkIHtcbiAgICB0aGlzLmNhbGVuZGFyVmlld01vZGVsID0gbmV3IENhbGVuZGFyVmlld01vZGVsKFxuICAgICAgdGhpcy5jYWxlbmRhcixcbiAgICAgIHRoaXMuc2VsZWN0ZWREYXksXG4gICAgICB0aGlzLnNlbGVjdGVkRW5kRGF5LFxuICAgICAgdGhpcy5mb2N1c2VkRGF5LFxuICAgICAgdGhpcy50b2RheSxcbiAgICAgIHRoaXMuX2xvY2FsZUhlbHBlclNlcnZpY2UuZmlyc3REYXlPZldlZWssXG4gICAgICB0aGlzLl9kYXRlSU9TZXJ2aWNlLmRpc2FibGVkRGF0ZXNcbiAgICApO1xuICB9XG59XG4iLCI8dGFibGUgY2xhc3M9XCJjYWxlbmRhci10YWJsZVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cbiAgPHRyIGNsYXNzPVwiY2FsZW5kYXItcm93IHdlZWtkYXlzXCI+XG4gICAgPHRoICpuZ0Zvcj1cImxldCBkYXkgb2YgbG9jYWxlRGF5c1wiIGNsYXNzPVwiY2FsZW5kYXItY2VsbCB3ZWVrZGF5XCI+XG4gICAgICA8c3BhbiBbYXR0ci5hcmlhLWxhYmVsXT1cImRheS5kYXlcIj57e2RheS5uYXJyb3d9fTwvc3Bhbj5cbiAgICA8L3RoPlxuICA8L3RyPlxuICA8dHIgY2xhc3M9XCJjYWxlbmRhci1yb3dcIiAqbmdGb3I9XCJsZXQgcm93IG9mIGNhbGVuZGFyVmlld01vZGVsLmNhbGVuZGFyVmlld1wiPlxuICAgIDx0ZCAqbmdGb3I9XCJsZXQgZGF5VmlldyBvZiByb3dcIiBjbGFzcz1cImNhbGVuZGFyLWNlbGxcIj5cbiAgICAgIDxjbHItZGF5IFtjbHJEYXlWaWV3XT1cImRheVZpZXdcIiAoc2VsZWN0RGF5KT1cInNldFNlbGVjdGVkRGF5KCRldmVudClcIj48L2Nsci1kYXk+XG4gICAgPC90ZD5cbiAgPC90cj5cbjwvdGFibGU+XG4iXX0=