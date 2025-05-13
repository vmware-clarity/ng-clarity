/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/date-navigation.service";
import * as i2 from "../../utils/i18n/common-strings.service";
export class ClrDay {
    constructor(_dateNavigationService, commonStrings) {
        this._dateNavigationService = _dateNavigationService;
        this.commonStrings = commonStrings;
        this.onSelectDay = new EventEmitter();
    }
    /**
     * DayViewModel input which is used to build the Day View.
     */
    get dayView() {
        return this._dayView;
    }
    set dayView(day) {
        this._dayView = day;
    }
    get dayString() {
        return this.dayView.isSelected
            ? this.commonStrings.parse(this.commonStrings.keys.datepickerSelectedLabel, {
                FULL_DATE: this._dayView.dayModel.toDateString(),
            })
            : this._dayView.dayModel.toDateString();
    }
    get isRangeStartDay() {
        return (this._dateNavigationService.isRangePicker &&
            this.dayView?.dayModel?.toComparisonString() === this._dateNavigationService.selectedDay?.toComparisonString());
    }
    get isRangeEndDay() {
        return (this._dateNavigationService.isRangePicker &&
            this.dayView?.dayModel?.toComparisonString() === this._dateNavigationService.selectedEndDay?.toComparisonString());
    }
    /**
     * Calls the DateNavigationService to update the hovered day value of the calendar
     */
    hoverListener() {
        if (!this.dayView.isDisabled) {
            this._dateNavigationService.hoveredDay = this.dayView.dayModel;
        }
    }
    /**
     * Updates the focusedDay in the DateNavigationService when the ClrDay is focused.
     */
    onDayViewFocus() {
        this._dateNavigationService.focusedDay = this.dayView.dayModel;
    }
    /**
     * Updates the selectedDay when the ClrDay is selected and closes the datepicker popover.
     */
    selectDay() {
        if (this.dayView.isDisabled) {
            return;
        }
        const day = this.dayView.dayModel;
        this.onSelectDay.emit(day);
    }
    /**
     * Applicable only to date range picker
     * Compares whether the day is in between the start and end date range
     */
    isInRange() {
        if (!this._dateNavigationService.isRangePicker) {
            return false;
        }
        if (this._dateNavigationService.selectedDay && this._dateNavigationService.selectedEndDay) {
            return (this._dayView.dayModel?.isAfter(this._dateNavigationService.selectedDay) &&
                this._dayView.dayModel?.isBefore(this._dateNavigationService.selectedEndDay));
        }
        else if (this._dateNavigationService.selectedDay && !this._dateNavigationService.selectedEndDay) {
            return (this._dayView.dayModel?.isAfter(this._dateNavigationService.selectedDay) &&
                this._dayView.dayModel?.isBefore(this._dateNavigationService.hoveredDay, true));
        }
        else {
            return false;
        }
    }
}
ClrDay.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDay, deps: [{ token: i1.DateNavigationService }, { token: i2.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrDay.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDay, selector: "clr-day", inputs: { dayView: ["clrDayView", "dayView"] }, outputs: { onSelectDay: "selectDay" }, host: { listeners: { "mouseenter": "hoverListener()" }, properties: { "class.day": "true" } }, ngImport: i0, template: `
    <button
      class="day-btn"
      type="button"
      [class.is-today]="dayView.isTodaysDate"
      [class.is-excluded]="dayView.isExcluded"
      [class.is-disabled]="dayView.isDisabled"
      [class.is-selected]="dayView.isSelected"
      [class.in-range]="isInRange()"
      [class.is-start-range]="isRangeStartDay"
      [class.is-end-range]="isRangeEndDay"
      [attr.tabindex]="dayView.tabIndex"
      (click)="selectDay()"
      (focus)="onDayViewFocus()"
      [attr.aria-current]="dayView.isTodaysDate ? 'date' : 'false'"
      [attr.aria-label]="dayString"
      [attr.aria-selected]="dayView.isSelected"
    >
      {{ dayView.dayModel.date }}
    </button>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDay, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-day',
                    template: `
    <button
      class="day-btn"
      type="button"
      [class.is-today]="dayView.isTodaysDate"
      [class.is-excluded]="dayView.isExcluded"
      [class.is-disabled]="dayView.isDisabled"
      [class.is-selected]="dayView.isSelected"
      [class.in-range]="isInRange()"
      [class.is-start-range]="isRangeStartDay"
      [class.is-end-range]="isRangeEndDay"
      [attr.tabindex]="dayView.tabIndex"
      (click)="selectDay()"
      (focus)="onDayViewFocus()"
      [attr.aria-current]="dayView.isTodaysDate ? 'date' : 'false'"
      [attr.aria-label]="dayString"
      [attr.aria-selected]="dayView.isSelected"
    >
      {{ dayView.dayModel.date }}
    </button>
  `,
                    host: { '[class.day]': 'true' },
                }]
        }], ctorParameters: function () { return [{ type: i1.DateNavigationService }, { type: i2.ClrCommonStringsService }]; }, propDecorators: { onSelectDay: [{
                type: Output,
                args: ['selectDay']
            }], dayView: [{
                type: Input,
                args: ['clrDayView']
            }], hoverListener: [{
                type: HostListener,
                args: ['mouseenter']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvZGF0ZXBpY2tlci9kYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQWdDckYsTUFBTSxPQUFPLE1BQU07SUFLakIsWUFBb0Isc0JBQTZDLEVBQVUsYUFBc0M7UUFBN0YsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF1QjtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQUo1RixnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFZLENBQUM7SUFJb0QsQ0FBQztJQUVySDs7T0FFRztJQUVILElBQ0ksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBQ0QsSUFBSSxPQUFPLENBQUMsR0FBaUI7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQzVCLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtnQkFDeEUsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRTthQUNqRCxDQUFDO1lBQ0osQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzVDLENBQUM7SUFFRCxJQUFJLGVBQWU7UUFDakIsT0FBTyxDQUNMLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxhQUFhO1lBQ3pDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGtCQUFrQixFQUFFLEtBQUssSUFBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsRUFBRSxrQkFBa0IsRUFBRSxDQUMvRyxDQUFDO0lBQ0osQ0FBQztJQUVELElBQUksYUFBYTtRQUNmLE9BQU8sQ0FDTCxJQUFJLENBQUMsc0JBQXNCLENBQUMsYUFBYTtZQUN6QyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxLQUFLLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLEVBQUUsQ0FDbEgsQ0FBQztJQUNKLENBQUM7SUFFRDs7T0FFRztJQUVILGFBQWE7UUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDNUIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztTQUNoRTtJQUNILENBQUM7SUFFRDs7T0FFRztJQUNILGNBQWM7UUFDWixJQUFJLENBQUMsc0JBQXNCLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7T0FFRztJQUNILFNBQVM7UUFDUCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO1lBQzNCLE9BQU87U0FDUjtRQUNELE1BQU0sR0FBRyxHQUFhLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQzVDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxTQUFTO1FBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxhQUFhLEVBQUU7WUFDOUMsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELElBQUksSUFBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsY0FBYyxFQUFFO1lBQ3pGLE9BQU8sQ0FDTCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsQ0FBQztnQkFDeEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxjQUFjLENBQUMsQ0FDN0UsQ0FBQztTQUNIO2FBQU0sSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGNBQWMsRUFBRTtZQUNqRyxPQUFPLENBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLENBQUM7Z0JBQ3hFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUMvRSxDQUFDO1NBQ0g7YUFBTTtZQUNMLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7SUFDSCxDQUFDOzttR0ExRlUsTUFBTTt1RkFBTixNQUFNLHFPQXZCUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQlQ7MkZBR1UsTUFBTTtrQkF6QmxCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLFNBQVM7b0JBQ25CLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQlQ7b0JBQ0QsSUFBSSxFQUFFLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRTtpQkFDaEM7a0pBRXNCLFdBQVc7c0JBQS9CLE1BQU07dUJBQUMsV0FBVztnQkFXZixPQUFPO3NCQURWLEtBQUs7dUJBQUMsWUFBWTtnQkFrQ25CLGFBQWE7c0JBRFosWUFBWTt1QkFBQyxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBJbnB1dCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IERheVZpZXdNb2RlbCB9IGZyb20gJy4vbW9kZWwvZGF5LXZpZXcubW9kZWwnO1xuaW1wb3J0IHsgRGF5TW9kZWwgfSBmcm9tICcuL21vZGVsL2RheS5tb2RlbCc7XG5pbXBvcnQgeyBEYXRlTmF2aWdhdGlvblNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9kYXRlLW5hdmlnYXRpb24uc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1kYXknLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxidXR0b25cbiAgICAgIGNsYXNzPVwiZGF5LWJ0blwiXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIFtjbGFzcy5pcy10b2RheV09XCJkYXlWaWV3LmlzVG9kYXlzRGF0ZVwiXG4gICAgICBbY2xhc3MuaXMtZXhjbHVkZWRdPVwiZGF5Vmlldy5pc0V4Y2x1ZGVkXCJcbiAgICAgIFtjbGFzcy5pcy1kaXNhYmxlZF09XCJkYXlWaWV3LmlzRGlzYWJsZWRcIlxuICAgICAgW2NsYXNzLmlzLXNlbGVjdGVkXT1cImRheVZpZXcuaXNTZWxlY3RlZFwiXG4gICAgICBbY2xhc3MuaW4tcmFuZ2VdPVwiaXNJblJhbmdlKClcIlxuICAgICAgW2NsYXNzLmlzLXN0YXJ0LXJhbmdlXT1cImlzUmFuZ2VTdGFydERheVwiXG4gICAgICBbY2xhc3MuaXMtZW5kLXJhbmdlXT1cImlzUmFuZ2VFbmREYXlcIlxuICAgICAgW2F0dHIudGFiaW5kZXhdPVwiZGF5Vmlldy50YWJJbmRleFwiXG4gICAgICAoY2xpY2spPVwic2VsZWN0RGF5KClcIlxuICAgICAgKGZvY3VzKT1cIm9uRGF5Vmlld0ZvY3VzKClcIlxuICAgICAgW2F0dHIuYXJpYS1jdXJyZW50XT1cImRheVZpZXcuaXNUb2RheXNEYXRlID8gJ2RhdGUnIDogJ2ZhbHNlJ1wiXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImRheVN0cmluZ1wiXG4gICAgICBbYXR0ci5hcmlhLXNlbGVjdGVkXT1cImRheVZpZXcuaXNTZWxlY3RlZFwiXG4gICAgPlxuICAgICAge3sgZGF5Vmlldy5kYXlNb2RlbC5kYXRlIH19XG4gICAgPC9idXR0b24+XG4gIGAsXG4gIGhvc3Q6IHsgJ1tjbGFzcy5kYXldJzogJ3RydWUnIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsckRheSB7XG4gIEBPdXRwdXQoJ3NlbGVjdERheScpIG9uU2VsZWN0RGF5ID0gbmV3IEV2ZW50RW1pdHRlcjxEYXlNb2RlbD4oKTtcblxuICBwcml2YXRlIF9kYXlWaWV3OiBEYXlWaWV3TW9kZWw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZGF0ZU5hdmlnYXRpb25TZXJ2aWNlOiBEYXRlTmF2aWdhdGlvblNlcnZpY2UsIHByaXZhdGUgY29tbW9uU3RyaW5nczogQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UpIHt9XG5cbiAgLyoqXG4gICAqIERheVZpZXdNb2RlbCBpbnB1dCB3aGljaCBpcyB1c2VkIHRvIGJ1aWxkIHRoZSBEYXkgVmlldy5cbiAgICovXG5cbiAgQElucHV0KCdjbHJEYXlWaWV3JylcbiAgZ2V0IGRheVZpZXcoKTogRGF5Vmlld01vZGVsIHtcbiAgICByZXR1cm4gdGhpcy5fZGF5VmlldztcbiAgfVxuICBzZXQgZGF5VmlldyhkYXk6IERheVZpZXdNb2RlbCkge1xuICAgIHRoaXMuX2RheVZpZXcgPSBkYXk7XG4gIH1cblxuICBnZXQgZGF5U3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZGF5Vmlldy5pc1NlbGVjdGVkXG4gICAgICA/IHRoaXMuY29tbW9uU3RyaW5ncy5wYXJzZSh0aGlzLmNvbW1vblN0cmluZ3Mua2V5cy5kYXRlcGlja2VyU2VsZWN0ZWRMYWJlbCwge1xuICAgICAgICAgIEZVTExfREFURTogdGhpcy5fZGF5Vmlldy5kYXlNb2RlbC50b0RhdGVTdHJpbmcoKSxcbiAgICAgICAgfSlcbiAgICAgIDogdGhpcy5fZGF5Vmlldy5kYXlNb2RlbC50b0RhdGVTdHJpbmcoKTtcbiAgfVxuXG4gIGdldCBpc1JhbmdlU3RhcnREYXkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5pc1JhbmdlUGlja2VyICYmXG4gICAgICB0aGlzLmRheVZpZXc/LmRheU1vZGVsPy50b0NvbXBhcmlzb25TdHJpbmcoKSA9PT0gdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRGF5Py50b0NvbXBhcmlzb25TdHJpbmcoKVxuICAgICk7XG4gIH1cblxuICBnZXQgaXNSYW5nZUVuZERheSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLmlzUmFuZ2VQaWNrZXIgJiZcbiAgICAgIHRoaXMuZGF5Vmlldz8uZGF5TW9kZWw/LnRvQ29tcGFyaXNvblN0cmluZygpID09PSB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWRFbmREYXk/LnRvQ29tcGFyaXNvblN0cmluZygpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyB0aGUgRGF0ZU5hdmlnYXRpb25TZXJ2aWNlIHRvIHVwZGF0ZSB0aGUgaG92ZXJlZCBkYXkgdmFsdWUgb2YgdGhlIGNhbGVuZGFyXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCdtb3VzZWVudGVyJylcbiAgaG92ZXJMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGF5Vmlldy5pc0Rpc2FibGVkKSB7XG4gICAgICB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UuaG92ZXJlZERheSA9IHRoaXMuZGF5Vmlldy5kYXlNb2RlbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgZm9jdXNlZERheSBpbiB0aGUgRGF0ZU5hdmlnYXRpb25TZXJ2aWNlIHdoZW4gdGhlIENsckRheSBpcyBmb2N1c2VkLlxuICAgKi9cbiAgb25EYXlWaWV3Rm9jdXMoKSB7XG4gICAgdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLmZvY3VzZWREYXkgPSB0aGlzLmRheVZpZXcuZGF5TW9kZWw7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgc2VsZWN0ZWREYXkgd2hlbiB0aGUgQ2xyRGF5IGlzIHNlbGVjdGVkIGFuZCBjbG9zZXMgdGhlIGRhdGVwaWNrZXIgcG9wb3Zlci5cbiAgICovXG4gIHNlbGVjdERheSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kYXlWaWV3LmlzRGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZGF5OiBEYXlNb2RlbCA9IHRoaXMuZGF5Vmlldy5kYXlNb2RlbDtcbiAgICB0aGlzLm9uU2VsZWN0RGF5LmVtaXQoZGF5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWNhYmxlIG9ubHkgdG8gZGF0ZSByYW5nZSBwaWNrZXJcbiAgICogQ29tcGFyZXMgd2hldGhlciB0aGUgZGF5IGlzIGluIGJldHdlZW4gdGhlIHN0YXJ0IGFuZCBlbmQgZGF0ZSByYW5nZVxuICAgKi9cbiAgaXNJblJhbmdlKCk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLmlzUmFuZ2VQaWNrZXIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5zZWxlY3RlZERheSAmJiB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWRFbmREYXkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMuX2RheVZpZXcuZGF5TW9kZWw/LmlzQWZ0ZXIodGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRGF5KSAmJlxuICAgICAgICB0aGlzLl9kYXlWaWV3LmRheU1vZGVsPy5pc0JlZm9yZSh0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWRFbmREYXkpXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRGF5ICYmICF0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWRFbmREYXkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHRoaXMuX2RheVZpZXcuZGF5TW9kZWw/LmlzQWZ0ZXIodGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRGF5KSAmJlxuICAgICAgICB0aGlzLl9kYXlWaWV3LmRheU1vZGVsPy5pc0JlZm9yZSh0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UuaG92ZXJlZERheSwgdHJ1ZSlcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==