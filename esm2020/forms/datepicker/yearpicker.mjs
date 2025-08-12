/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, HostListener } from '@angular/core';
import { Keys } from '../../utils/enums/keys.enum';
import { normalizeKey } from '../../utils/focus/key-focus/util';
import { YearRangeModel } from './model/year-range.model';
import * as i0 from "@angular/core";
import * as i1 from "./providers/date-navigation.service";
import * as i2 from "./providers/view-manager.service";
import * as i3 from "./providers/datepicker-focus.service";
import * as i4 from "../../utils/i18n/common-strings.service";
import * as i5 from "@angular/common";
import * as i6 from "../../icon/icon";
export class ClrYearpicker {
    constructor(_dateNavigationService, _viewManagerService, _datepickerFocusService, _elRef, commonStrings) {
        this._dateNavigationService = _dateNavigationService;
        this._viewManagerService = _viewManagerService;
        this._datepickerFocusService = _datepickerFocusService;
        this._elRef = _elRef;
        this.commonStrings = commonStrings;
        this.yearRangeModel = new YearRangeModel(this.calendarYear);
        this._focusedYear = this.calendarYear;
    }
    get selectedStartYear() {
        return this._dateNavigationService.selectedDay?.year;
    }
    get selectedEndYear() {
        return this._dateNavigationService.selectedEndDay?.year;
    }
    /**
     * Gets the year which the user is currently on.
     */
    get calendarYear() {
        return this._dateNavigationService.displayedCalendar.year;
    }
    isCurrentCalendarYear(year) {
        return year === new Date().getFullYear();
    }
    getIsRangeStartYear(year) {
        return this._dateNavigationService.isRangePicker && year === this._dateNavigationService.selectedDay?.year;
    }
    getIsRangeEndYear(year) {
        return this._dateNavigationService.isRangePicker && year === this._dateNavigationService.selectedEndDay?.year;
    }
    /**
     * Focuses on the current calendar year when the View is initialized.
     */
    ngAfterViewInit() {
        this._datepickerFocusService.focusCell(this._elRef);
    }
    /**
     * Handles the Keyboard arrow navigation for the yearpicker.
     */
    onKeyDown(event) {
        // NOTE: Didn't move this to the date navigation service because
        // the logic is fairly simple and it didn't make sense for me
        // to create extra observables just to move this logic to the service.
        if (event) {
            const key = normalizeKey(event.key);
            if (key === Keys.ArrowUp) {
                event.preventDefault();
                this.incrementFocusYearBy(-2);
            }
            else if (key === Keys.ArrowDown) {
                event.preventDefault();
                this.incrementFocusYearBy(2);
            }
            else if (key === Keys.ArrowRight) {
                event.preventDefault();
                this.incrementFocusYearBy(1);
            }
            else if (key === Keys.ArrowLeft) {
                event.preventDefault();
                this.incrementFocusYearBy(-1);
            }
        }
    }
    /**
     * Calls the DateNavigationService to update the year value of the calendar.
     * Also changes the view to the daypicker.
     */
    changeYear(year) {
        this._dateNavigationService.changeYear(year);
        this._viewManagerService.changeToDayView();
    }
    /**
     * Calls the DateNavigationService to update the hovered year value of the calendar
     */
    onHover(year) {
        this._dateNavigationService.hoveredYear = year;
    }
    /**
     * Updates the YearRangeModel to the previous decade.
     */
    previousDecade() {
        this.yearRangeModel = this.yearRangeModel.previousDecade();
        // Year in the yearpicker is not focused because while navigating to a different decade,
        // you want the focus to remain on the decade switcher arrows.
    }
    /**
     * Updates the YearRangeModel to the current decade.
     */
    currentDecade() {
        if (!this.yearRangeModel.inRange(this._dateNavigationService.today.year)) {
            this.yearRangeModel = this.yearRangeModel.currentDecade();
        }
        this._datepickerFocusService.focusCell(this._elRef);
    }
    /**
     * Updates the YearRangeModel to the next decade.
     */
    nextDecade() {
        this.yearRangeModel = this.yearRangeModel.nextDecade();
        // Year in the yearpicker is not focused because while navigating to a different decade,
        // you want the focus to remain on the decade switcher arrows.
    }
    /**
     * Compares the year passed to the focused year and returns the tab index.
     */
    getTabIndex(year) {
        if (!this.yearRangeModel.inRange(this._focusedYear)) {
            if (this.yearRangeModel.inRange(this.calendarYear)) {
                this._focusedYear = this.calendarYear;
            }
            else if (this.yearRangeModel.inRange(this.selectedEndYear)) {
                this._focusedYear = this.selectedEndYear;
            }
            else {
                this._focusedYear = this.yearRangeModel.middleYear;
            }
        }
        return this._focusedYear === year ? 0 : -1;
    }
    /**
     * Applicable only to date range picker
     * Compares the year passed is in between the start and end date range
     */
    isInRange(year) {
        if (!this._dateNavigationService.isRangePicker) {
            return false;
        }
        if (this._dateNavigationService.selectedDay?.year && this.selectedEndYear) {
            return year > this.selectedStartYear && year < this.selectedEndYear;
        }
        else if (this._dateNavigationService.selectedDay?.year && !this.selectedEndYear) {
            return year > this.selectedStartYear && year < this._dateNavigationService.hoveredYear;
        }
        else {
            return false;
        }
    }
    changeToDayView() {
        this._viewManagerService.changeToDayView();
    }
    /**
     * Increments the focus year by the value passed. Updates the YearRangeModel if the
     * new value is not in the current decade.
     */
    incrementFocusYearBy(value) {
        this._focusedYear = this._focusedYear + value;
        if (!this.yearRangeModel.inRange(this._focusedYear)) {
            if (value > 0) {
                this.yearRangeModel = this.yearRangeModel.nextDecade();
            }
            else {
                this.yearRangeModel = this.yearRangeModel.previousDecade();
            }
        }
        this._datepickerFocusService.focusCell(this._elRef);
    }
}
ClrYearpicker.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrYearpicker, deps: [{ token: i1.DateNavigationService }, { token: i2.ViewManagerService }, { token: i3.DatepickerFocusService }, { token: i0.ElementRef }, { token: i4.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrYearpicker.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrYearpicker, selector: "clr-yearpicker", host: { attributes: { "role": "application" }, listeners: { "keydown": "onKeyDown($event)" }, properties: { "class.yearpicker": "true" } }, ngImport: i0, template: `
    <div class="calendar-header">
      <div class="calendar-pickers">
        <button class="calendar-btn yearpicker-trigger year-range" type="button" (click)="changeToDayView()">
          {{ yearRangeModel.yearRange[0] }} - {{ yearRangeModel.yearRange[yearRangeModel.yearRange.length - 1] }}
        </button>
      </div>
      <div class="year-switchers">
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="previousDecade()"
          [attr.aria-label]="commonStrings.keys.datepickerPreviousDecade"
        >
          <cds-icon
            shape="angle"
            direction="left"
            [attr.title]="commonStrings.keys.datepickerPreviousDecade"
          ></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="currentDecade()"
          [attr.aria-label]="commonStrings.keys.datepickerCurrentDecade"
        >
          <cds-icon shape="event" [attr.title]="commonStrings.keys.datepickerCurrentDecade"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="nextDecade()"
          [attr.aria-label]="commonStrings.keys.datepickerNextDecade"
        >
          <cds-icon shape="angle" direction="right" [attr.title]="commonStrings.keys.datepickerNextDecade"></cds-icon>
        </button>
      </div>
    </div>

    <div class="years">
      <button
        *ngFor="let year of yearRangeModel.yearRange"
        type="button"
        class="calendar-btn year"
        [attr.tabindex]="getTabIndex(year)"
        [class.is-selected]="year === selectedStartYear || year === selectedEndYear"
        [class.is-start-range]="getIsRangeStartYear(year)"
        [class.is-end-range]="getIsRangeEndYear(year)"
        [class.in-range]="isInRange(year)"
        [class.is-today]="isCurrentCalendarYear(year)"
        (click)="changeYear(year)"
        (mouseenter)="onHover(year)"
      >
        {{ year }}
      </button>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i5.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i6.CdsIconCustomTag, selector: "cds-icon" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrYearpicker, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-yearpicker',
                    template: `
    <div class="calendar-header">
      <div class="calendar-pickers">
        <button class="calendar-btn yearpicker-trigger year-range" type="button" (click)="changeToDayView()">
          {{ yearRangeModel.yearRange[0] }} - {{ yearRangeModel.yearRange[yearRangeModel.yearRange.length - 1] }}
        </button>
      </div>
      <div class="year-switchers">
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="previousDecade()"
          [attr.aria-label]="commonStrings.keys.datepickerPreviousDecade"
        >
          <cds-icon
            shape="angle"
            direction="left"
            [attr.title]="commonStrings.keys.datepickerPreviousDecade"
          ></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="currentDecade()"
          [attr.aria-label]="commonStrings.keys.datepickerCurrentDecade"
        >
          <cds-icon shape="event" [attr.title]="commonStrings.keys.datepickerCurrentDecade"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="nextDecade()"
          [attr.aria-label]="commonStrings.keys.datepickerNextDecade"
        >
          <cds-icon shape="angle" direction="right" [attr.title]="commonStrings.keys.datepickerNextDecade"></cds-icon>
        </button>
      </div>
    </div>

    <div class="years">
      <button
        *ngFor="let year of yearRangeModel.yearRange"
        type="button"
        class="calendar-btn year"
        [attr.tabindex]="getTabIndex(year)"
        [class.is-selected]="year === selectedStartYear || year === selectedEndYear"
        [class.is-start-range]="getIsRangeStartYear(year)"
        [class.is-end-range]="getIsRangeEndYear(year)"
        [class.in-range]="isInRange(year)"
        [class.is-today]="isCurrentCalendarYear(year)"
        (click)="changeYear(year)"
        (mouseenter)="onHover(year)"
      >
        {{ year }}
      </button>
    </div>
  `,
                    host: {
                        '[class.yearpicker]': 'true',
                        role: 'application',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.DateNavigationService }, { type: i2.ViewManagerService }, { type: i3.DatepickerFocusService }, { type: i0.ElementRef }, { type: i4.ClrCommonStringsService }]; }, propDecorators: { onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWVhcnBpY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2RhdGVwaWNrZXIveWVhcnBpY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBaUIsU0FBUyxFQUFjLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVuRixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBRWhFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7Ozs7Ozs7QUFxRTFELE1BQU0sT0FBTyxhQUFhO0lBV3hCLFlBQ1Usc0JBQTZDLEVBQzdDLG1CQUF1QyxFQUN2Qyx1QkFBK0MsRUFDL0MsTUFBK0IsRUFDaEMsYUFBc0M7UUFKckMsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF1QjtRQUM3Qyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQW9CO1FBQ3ZDLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBd0I7UUFDL0MsV0FBTSxHQUFOLE1BQU0sQ0FBeUI7UUFDaEMsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBRTdDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztJQUN4QyxDQUFDO0lBRUQsSUFBSSxpQkFBaUI7UUFDbkIsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQztJQUN2RCxDQUFDO0lBRUQsSUFBSSxlQUFlO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUM7SUFDMUQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFB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TTt3QkFDNUIsSUFBSSxFQUFFLGFBQWE7cUJBQ3BCO2lCQUNGO2lQQTZEQyxTQUFTO3NCQURSLFlBQVk7dUJBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBLZXlzIH0gZnJvbSAnLi4vLi4vdXRpbHMvZW51bXMva2V5cy5lbnVtJztcbmltcG9ydCB7IG5vcm1hbGl6ZUtleSB9IGZyb20gJy4uLy4uL3V0aWxzL2ZvY3VzL2tleS1mb2N1cy91dGlsJztcbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IFllYXJSYW5nZU1vZGVsIH0gZnJvbSAnLi9tb2RlbC95ZWFyLXJhbmdlLm1vZGVsJztcbmltcG9ydCB7IERhdGVOYXZpZ2F0aW9uU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2RhdGUtbmF2aWdhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IERhdGVwaWNrZXJGb2N1c1NlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9kYXRlcGlja2VyLWZvY3VzLnNlcnZpY2UnO1xuaW1wb3J0IHsgVmlld01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvdmlldy1tYW5hZ2VyLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHIteWVhcnBpY2tlcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImNhbGVuZGFyLWhlYWRlclwiPlxuICAgICAgPGRpdiBjbGFzcz1cImNhbGVuZGFyLXBpY2tlcnNcIj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNhbGVuZGFyLWJ0biB5ZWFycGlja2VyLXRyaWdnZXIgeWVhci1yYW5nZVwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwiY2hhbmdlVG9EYXlWaWV3KClcIj5cbiAgICAgICAgICB7eyB5ZWFyUmFuZ2VNb2RlbC55ZWFyUmFuZ2VbMF0gfX0gLSB7eyB5ZWFyUmFuZ2VNb2RlbC55ZWFyUmFuZ2VbeWVhclJhbmdlTW9kZWwueWVhclJhbmdlLmxlbmd0aCAtIDFdIH19XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwieWVhci1zd2l0Y2hlcnNcIj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzPVwiY2FsZW5kYXItYnRuIHN3aXRjaGVyXCJcbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAoY2xpY2spPVwicHJldmlvdXNEZWNhZGUoKVwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJjb21tb25TdHJpbmdzLmtleXMuZGF0ZXBpY2tlclByZXZpb3VzRGVjYWRlXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxjZHMtaWNvblxuICAgICAgICAgICAgc2hhcGU9XCJhbmdsZVwiXG4gICAgICAgICAgICBkaXJlY3Rpb249XCJsZWZ0XCJcbiAgICAgICAgICAgIFthdHRyLnRpdGxlXT1cImNvbW1vblN0cmluZ3Mua2V5cy5kYXRlcGlja2VyUHJldmlvdXNEZWNhZGVcIlxuICAgICAgICAgID48L2Nkcy1pY29uPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzPVwiY2FsZW5kYXItYnRuIHN3aXRjaGVyXCJcbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAoY2xpY2spPVwiY3VycmVudERlY2FkZSgpXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZ3Mua2V5cy5kYXRlcGlja2VyQ3VycmVudERlY2FkZVwiXG4gICAgICAgID5cbiAgICAgICAgICA8Y2RzLWljb24gc2hhcGU9XCJldmVudFwiIFthdHRyLnRpdGxlXT1cImNvbW1vblN0cmluZ3Mua2V5cy5kYXRlcGlja2VyQ3VycmVudERlY2FkZVwiPjwvY2RzLWljb24+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3M9XCJjYWxlbmRhci1idG4gc3dpdGNoZXJcIlxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIChjbGljayk9XCJuZXh0RGVjYWRlKClcIlxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiY29tbW9uU3RyaW5ncy5rZXlzLmRhdGVwaWNrZXJOZXh0RGVjYWRlXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxjZHMtaWNvbiBzaGFwZT1cImFuZ2xlXCIgZGlyZWN0aW9uPVwicmlnaHRcIiBbYXR0ci50aXRsZV09XCJjb21tb25TdHJpbmdzLmtleXMuZGF0ZXBpY2tlck5leHREZWNhZGVcIj48L2Nkcy1pY29uPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cInllYXJzXCI+XG4gICAgICA8YnV0dG9uXG4gICAgICAgICpuZ0Zvcj1cImxldCB5ZWFyIG9mIHllYXJSYW5nZU1vZGVsLnllYXJSYW5nZVwiXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBjbGFzcz1cImNhbGVuZGFyLWJ0biB5ZWFyXCJcbiAgICAgICAgW2F0dHIudGFiaW5kZXhdPVwiZ2V0VGFiSW5kZXgoeWVhcilcIlxuICAgICAgICBbY2xhc3MuaXMtc2VsZWN0ZWRdPVwieWVhciA9PT0gc2VsZWN0ZWRTdGFydFllYXIgfHwgeWVhciA9PT0gc2VsZWN0ZWRFbmRZZWFyXCJcbiAgICAgICAgW2NsYXNzLmlzLXN0YXJ0LXJhbmdlXT1cImdldElzUmFuZ2VTdGFydFllYXIoeWVhcilcIlxuICAgICAgICBbY2xhc3MuaXMtZW5kLXJhbmdlXT1cImdldElzUmFuZ2VFbmRZZWFyKHllYXIpXCJcbiAgICAgICAgW2NsYXNzLmluLXJhbmdlXT1cImlzSW5SYW5nZSh5ZWFyKVwiXG4gICAgICAgIFtjbGFzcy5pcy10b2RheV09XCJpc0N1cnJlbnRDYWxlbmRhclllYXIoeWVhcilcIlxuICAgICAgICAoY2xpY2spPVwiY2hhbmdlWWVhcih5ZWFyKVwiXG4gICAgICAgIChtb3VzZWVudGVyKT1cIm9uSG92ZXIoeWVhcilcIlxuICAgICAgPlxuICAgICAgICB7eyB5ZWFyIH19XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MueWVhcnBpY2tlcl0nOiAndHJ1ZScsXG4gICAgcm9sZTogJ2FwcGxpY2F0aW9uJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyWWVhcnBpY2tlciBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuICAvKipcbiAgICogWWVhclJhbmdlTW9kZWwgd2hpY2ggaXMgdXNlZCB0byBidWlsZCB0aGUgWWVhclBpY2tlciB2aWV3LlxuICAgKi9cbiAgeWVhclJhbmdlTW9kZWw6IFllYXJSYW5nZU1vZGVsO1xuXG4gIC8qKlxuICAgKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudCBmb2N1c2VkIHllYXIuXG4gICAqL1xuICBwcml2YXRlIF9mb2N1c2VkWWVhcjogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2RhdGVOYXZpZ2F0aW9uU2VydmljZTogRGF0ZU5hdmlnYXRpb25TZXJ2aWNlLFxuICAgIHByaXZhdGUgX3ZpZXdNYW5hZ2VyU2VydmljZTogVmlld01hbmFnZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgX2RhdGVwaWNrZXJGb2N1c1NlcnZpY2U6IERhdGVwaWNrZXJGb2N1c1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBfZWxSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZVxuICApIHtcbiAgICB0aGlzLnllYXJSYW5nZU1vZGVsID0gbmV3IFllYXJSYW5nZU1vZGVsKHRoaXMuY2FsZW5kYXJZZWFyKTtcbiAgICB0aGlzLl9mb2N1c2VkWWVhciA9IHRoaXMuY2FsZW5kYXJZZWFyO1xuICB9XG5cbiAgZ2V0IHNlbGVjdGVkU3RhcnRZZWFyKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5zZWxlY3RlZERheT8ueWVhcjtcbiAgfVxuXG4gIGdldCBzZWxlY3RlZEVuZFllYXIoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRW5kRGF5Py55ZWFyO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHllYXIgd2hpY2ggdGhlIHVzZXIgaXMgY3VycmVudGx5IG9uLlxuICAgKi9cbiAgZ2V0IGNhbGVuZGFyWWVhcigpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UuZGlzcGxheWVkQ2FsZW5kYXIueWVhcjtcbiAgfVxuXG4gIGlzQ3VycmVudENhbGVuZGFyWWVhcih5ZWFyOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4geWVhciA9PT0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuICB9XG5cbiAgZ2V0SXNSYW5nZVN0YXJ0WWVhcih5ZWFyOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLmlzUmFuZ2VQaWNrZXIgJiYgeWVhciA9PT0gdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRGF5Py55ZWFyO1xuICB9XG5cbiAgZ2V0SXNSYW5nZUVuZFllYXIoeWVhcjogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5pc1JhbmdlUGlja2VyICYmIHllYXIgPT09IHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5zZWxlY3RlZEVuZERheT8ueWVhcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIG9uIHRoZSBjdXJyZW50IGNhbGVuZGFyIHllYXIgd2hlbiB0aGUgVmlldyBpcyBpbml0aWFsaXplZC5cbiAgICovXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9kYXRlcGlja2VyRm9jdXNTZXJ2aWNlLmZvY3VzQ2VsbCh0aGlzLl9lbFJlZik7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyB0aGUgS2V5Ym9hcmQgYXJyb3cgbmF2aWdhdGlvbiBmb3IgdGhlIHllYXJwaWNrZXIuXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgb25LZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgLy8gTk9URTogRGlkbid0IG1vdmUgdGhpcyB0byB0aGUgZGF0ZSBuYXZpZ2F0aW9uIHNlcnZpY2UgYmVjYXVzZVxuICAgIC8vIHRoZSBsb2dpYyBpcyBmYWlybHkgc2ltcGxlIGFuZCBpdCBkaWRuJ3QgbWFrZSBzZW5zZSBmb3IgbWVcbiAgICAvLyB0byBjcmVhdGUgZXh0cmEgb2JzZXJ2YWJsZXMganVzdCB0byBtb3ZlIHRoaXMgbG9naWMgdG8gdGhlIHNlcnZpY2UuXG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICBjb25zdCBrZXkgPSBub3JtYWxpemVLZXkoZXZlbnQua2V5KTtcbiAgICAgIGlmIChrZXkgPT09IEtleXMuQXJyb3dVcCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmluY3JlbWVudEZvY3VzWWVhckJ5KC0yKTtcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBLZXlzLkFycm93RG93bikge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmluY3JlbWVudEZvY3VzWWVhckJ5KDIpO1xuICAgICAgfSBlbHNlIGlmIChrZXkgPT09IEtleXMuQXJyb3dSaWdodCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmluY3JlbWVudEZvY3VzWWVhckJ5KDEpO1xuICAgICAgfSBlbHNlIGlmIChrZXkgPT09IEtleXMuQXJyb3dMZWZ0KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuaW5jcmVtZW50Rm9jdXNZZWFyQnkoLTEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyB0aGUgRGF0ZU5hdmlnYXRpb25TZXJ2aWNlIHRvIHVwZGF0ZSB0aGUgeWVhciB2YWx1ZSBvZiB0aGUgY2FsZW5kYXIuXG4gICAqIEFsc28gY2hhbmdlcyB0aGUgdmlldyB0byB0aGUgZGF5cGlja2VyLlxuICAgKi9cbiAgY2hhbmdlWWVhcih5ZWFyOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UuY2hhbmdlWWVhcih5ZWFyKTtcbiAgICB0aGlzLl92aWV3TWFuYWdlclNlcnZpY2UuY2hhbmdlVG9EYXlWaWV3KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbHMgdGhlIERhdGVOYXZpZ2F0aW9uU2VydmljZSB0byB1cGRhdGUgdGhlIGhvdmVyZWQgeWVhciB2YWx1ZSBvZiB0aGUgY2FsZW5kYXJcbiAgICovXG4gIG9uSG92ZXIoeWVhcjogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLmhvdmVyZWRZZWFyID0geWVhcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBZZWFyUmFuZ2VNb2RlbCB0byB0aGUgcHJldmlvdXMgZGVjYWRlLlxuICAgKi9cbiAgcHJldmlvdXNEZWNhZGUoKTogdm9pZCB7XG4gICAgdGhpcy55ZWFyUmFuZ2VNb2RlbCA9IHRoaXMueWVhclJhbmdlTW9kZWwucHJldmlvdXNEZWNhZGUoKTtcbiAgICAvLyBZZWFyIGluIHRoZSB5ZWFycGlja2VyIGlzIG5vdCBmb2N1c2VkIGJlY2F1c2Ugd2hpbGUgbmF2aWdhdGluZyB0byBhIGRpZmZlcmVudCBkZWNhZGUsXG4gICAgLy8geW91IHdhbnQgdGhlIGZvY3VzIHRvIHJlbWFpbiBvbiB0aGUgZGVjYWRlIHN3aXRjaGVyIGFycm93cy5cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBZZWFyUmFuZ2VNb2RlbCB0byB0aGUgY3VycmVudCBkZWNhZGUuXG4gICAqL1xuICBjdXJyZW50RGVjYWRlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy55ZWFyUmFuZ2VNb2RlbC5pblJhbmdlKHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS50b2RheS55ZWFyKSkge1xuICAgICAgdGhpcy55ZWFyUmFuZ2VNb2RlbCA9IHRoaXMueWVhclJhbmdlTW9kZWwuY3VycmVudERlY2FkZSgpO1xuICAgIH1cbiAgICB0aGlzLl9kYXRlcGlja2VyRm9jdXNTZXJ2aWNlLmZvY3VzQ2VsbCh0aGlzLl9lbFJlZik7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgWWVhclJhbmdlTW9kZWwgdG8gdGhlIG5leHQgZGVjYWRlLlxuICAgKi9cbiAgbmV4dERlY2FkZSgpOiB2b2lkIHtcbiAgICB0aGlzLnllYXJSYW5nZU1vZGVsID0gdGhpcy55ZWFyUmFuZ2VNb2RlbC5uZXh0RGVjYWRlKCk7XG4gICAgLy8gWWVhciBpbiB0aGUgeWVhcnBpY2tlciBpcyBub3QgZm9jdXNlZCBiZWNhdXNlIHdoaWxlIG5hdmlnYXRpbmcgdG8gYSBkaWZmZXJlbnQgZGVjYWRlLFxuICAgIC8vIHlvdSB3YW50IHRoZSBmb2N1cyB0byByZW1haW4gb24gdGhlIGRlY2FkZSBzd2l0Y2hlciBhcnJvd3MuXG4gIH1cblxuICAvKipcbiAgICogQ29tcGFyZXMgdGhlIHllYXIgcGFzc2VkIHRvIHRoZSBmb2N1c2VkIHllYXIgYW5kIHJldHVybnMgdGhlIHRhYiBpbmRleC5cbiAgICovXG4gIGdldFRhYkluZGV4KHllYXI6IG51bWJlcik6IG51bWJlciB7XG4gICAgaWYgKCF0aGlzLnllYXJSYW5nZU1vZGVsLmluUmFuZ2UodGhpcy5fZm9jdXNlZFllYXIpKSB7XG4gICAgICBpZiAodGhpcy55ZWFyUmFuZ2VNb2RlbC5pblJhbmdlKHRoaXMuY2FsZW5kYXJZZWFyKSkge1xuICAgICAgICB0aGlzLl9mb2N1c2VkWWVhciA9IHRoaXMuY2FsZW5kYXJZZWFyO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnllYXJSYW5nZU1vZGVsLmluUmFuZ2UodGhpcy5zZWxlY3RlZEVuZFllYXIpKSB7XG4gICAgICAgIHRoaXMuX2ZvY3VzZWRZZWFyID0gdGhpcy5zZWxlY3RlZEVuZFllYXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9mb2N1c2VkWWVhciA9IHRoaXMueWVhclJhbmdlTW9kZWwubWlkZGxlWWVhcjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2ZvY3VzZWRZZWFyID09PSB5ZWFyID8gMCA6IC0xO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGxpY2FibGUgb25seSB0byBkYXRlIHJhbmdlIHBpY2tlclxuICAgKiBDb21wYXJlcyB0aGUgeWVhciBwYXNzZWQgaXMgaW4gYmV0d2VlbiB0aGUgc3RhcnQgYW5kIGVuZCBkYXRlIHJhbmdlXG4gICAqL1xuICBpc0luUmFuZ2UoeWVhcjogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UuaXNSYW5nZVBpY2tlcikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRGF5Py55ZWFyICYmIHRoaXMuc2VsZWN0ZWRFbmRZZWFyKSB7XG4gICAgICByZXR1cm4geWVhciA+IHRoaXMuc2VsZWN0ZWRTdGFydFllYXIgJiYgeWVhciA8IHRoaXMuc2VsZWN0ZWRFbmRZZWFyO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRGF5Py55ZWFyICYmICF0aGlzLnNlbGVjdGVkRW5kWWVhcikge1xuICAgICAgcmV0dXJuIHllYXIgPiB0aGlzLnNlbGVjdGVkU3RhcnRZZWFyICYmIHllYXIgPCB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UuaG92ZXJlZFllYXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBjaGFuZ2VUb0RheVZpZXcoKSB7XG4gICAgdGhpcy5fdmlld01hbmFnZXJTZXJ2aWNlLmNoYW5nZVRvRGF5VmlldygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluY3JlbWVudHMgdGhlIGZvY3VzIHllYXIgYnkgdGhlIHZhbHVlIHBhc3NlZC4gVXBkYXRlcyB0aGUgWWVhclJhbmdlTW9kZWwgaWYgdGhlXG4gICAqIG5ldyB2YWx1ZSBpcyBub3QgaW4gdGhlIGN1cnJlbnQgZGVjYWRlLlxuICAgKi9cbiAgcHJpdmF0ZSBpbmNyZW1lbnRGb2N1c1llYXJCeSh2YWx1ZTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5fZm9jdXNlZFllYXIgPSB0aGlzLl9mb2N1c2VkWWVhciArIHZhbHVlO1xuICAgIGlmICghdGhpcy55ZWFyUmFuZ2VNb2RlbC5pblJhbmdlKHRoaXMuX2ZvY3VzZWRZZWFyKSkge1xuICAgICAgaWYgKHZhbHVlID4gMCkge1xuICAgICAgICB0aGlzLnllYXJSYW5nZU1vZGVsID0gdGhpcy55ZWFyUmFuZ2VNb2RlbC5uZXh0RGVjYWRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnllYXJSYW5nZU1vZGVsID0gdGhpcy55ZWFyUmFuZ2VNb2RlbC5wcmV2aW91c0RlY2FkZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9kYXRlcGlja2VyRm9jdXNTZXJ2aWNlLmZvY3VzQ2VsbCh0aGlzLl9lbFJlZik7XG4gIH1cbn1cbiJdfQ==