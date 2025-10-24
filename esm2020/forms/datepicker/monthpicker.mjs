/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, HostListener } from '@angular/core';
import { Keys } from '../../utils/enums/keys.enum';
import { normalizeKey } from '../../utils/focus/key-focus/util';
import * as i0 from "@angular/core";
import * as i1 from "./providers/locale-helper.service";
import * as i2 from "./providers/date-navigation.service";
import * as i3 from "./providers/datepicker-focus.service";
import * as i4 from "./providers/view-manager.service";
import * as i5 from "../../utils";
import * as i6 from "@angular/common";
import * as i7 from "../../icon/icon";
export class ClrMonthpicker {
    constructor(_localeHelperService, _dateNavigationService, _datepickerFocusService, _elRef, _viewManagerService, commonStrings) {
        this._localeHelperService = _localeHelperService;
        this._dateNavigationService = _dateNavigationService;
        this._datepickerFocusService = _datepickerFocusService;
        this._elRef = _elRef;
        this._viewManagerService = _viewManagerService;
        this.commonStrings = commonStrings;
        this._focusedMonthIndex = this.calendarMonthIndex;
    }
    /**
     * Gets the months array which is used to rendered the monthpicker view.
     * Months are in the TranslationWidth.Wide format.
     */
    get monthNames() {
        return this._localeHelperService.localeMonthsWide;
    }
    /**
     * Gets the month value of the Calendar.
     */
    get calendarMonthIndex() {
        return this._dateNavigationService.displayedCalendar.month;
    }
    /**
     * Gets the year which the user is currently on.
     */
    get calendarEndMonthIndex() {
        return this._dateNavigationService.selectedEndDay?.month;
    }
    get yearAttrString() {
        return this.commonStrings.parse(this.commonStrings.keys.datepickerSelectYearText, {
            CALENDAR_YEAR: this.calendarYear.toString(),
        });
    }
    /**
     * Returns the year value of the calendar.
     */
    get calendarYear() {
        return this._dateNavigationService.displayedCalendar.year;
    }
    get currentCalendarYear() {
        return new Date().getFullYear();
    }
    get currentCalendarMonth() {
        return new Date().getMonth();
    }
    getIsRangeStartMonth(monthIndex) {
        return (this._dateNavigationService.isRangePicker &&
            this.calendarYear === this._dateNavigationService.selectedDay?.year &&
            monthIndex === this._dateNavigationService.selectedDay?.month);
    }
    getIsRangeEndMonth(monthIndex) {
        return (this._dateNavigationService.isRangePicker &&
            this.calendarYear === this._dateNavigationService.selectedEndDay?.year &&
            monthIndex === this._dateNavigationService.selectedEndDay?.month);
    }
    /**
     * Calls the ViewManagerService to change to the yearpicker view.
     */
    changeToYearView() {
        this._viewManagerService.changeToYearView();
    }
    /**
     * Focuses on the current calendar month when the View is initialized.
     */
    ngAfterViewInit() {
        this._datepickerFocusService.focusCell(this._elRef);
    }
    /**
     * Handles the Keyboard arrow navigation for the monthpicker.
     */
    onKeyDown(event) {
        // NOTE: Didn't move this to the date navigation service because
        // the logic is fairly simple and it didn't make sense for me
        // to create extra observables just to move this logic to the service.
        if (event) {
            const key = normalizeKey(event.key);
            if (key === Keys.ArrowUp && this._focusedMonthIndex > 1) {
                event.preventDefault();
                this._focusedMonthIndex -= 2;
                this._datepickerFocusService.focusCell(this._elRef);
            }
            else if (key === Keys.ArrowDown && this._focusedMonthIndex < 10) {
                event.preventDefault();
                this._focusedMonthIndex += 2;
                this._datepickerFocusService.focusCell(this._elRef);
            }
            else if (key === Keys.ArrowRight && this._focusedMonthIndex < 11) {
                event.preventDefault();
                this._focusedMonthIndex++;
                this._datepickerFocusService.focusCell(this._elRef);
            }
            else if (key === Keys.ArrowLeft && this._focusedMonthIndex > 0) {
                event.preventDefault();
                this._focusedMonthIndex--;
                this._datepickerFocusService.focusCell(this._elRef);
            }
        }
    }
    isSelected(monthIndex) {
        return ((this._dateNavigationService.selectedDay?.year === this.calendarYear &&
            monthIndex === this._dateNavigationService.selectedDay?.month) ||
            (this._dateNavigationService.selectedEndDay?.year === this.calendarYear &&
                monthIndex === this.calendarEndMonthIndex));
    }
    /**
     * Calls the DateNavigationService to update the hovered month value of the calendar
     */
    onHover(monthIndex) {
        this._dateNavigationService.hoveredMonth = monthIndex;
    }
    /**
     * Calls the DateNavigationService to update the month value of the calendar.
     * Also changes the view to the daypicker.
     */
    changeMonth(monthIndex) {
        this._dateNavigationService.changeMonth(monthIndex);
        this._viewManagerService.changeToDayView();
    }
    /**
     * Compares the month passed to the focused month and returns the tab index.
     */
    getTabIndex(monthIndex) {
        return monthIndex === this._focusedMonthIndex ? 0 : -1;
    }
    /**
     * Calls the DateNavigationService to move to the next month.
     */
    nextYear() {
        this._dateNavigationService.moveToNextYear();
    }
    /**
     * Calls the DateNavigationService to move to the previous month.
     */
    previousYear() {
        this._dateNavigationService.moveToPreviousYear();
    }
    /**
     * Calls the DateNavigationService to move to the current month.
     */
    currentYear() {
        this._dateNavigationService.moveToCurrentMonth();
    }
    /**
     * Applicable only to date range picker
     * Compares the month passed is in between the start and end date range
     */
    isInRange(monthIndex) {
        if (!this._dateNavigationService.isRangePicker) {
            return false;
        }
        if (this._dateNavigationService.selectedDay && this._dateNavigationService.selectedEndDay) {
            return ((this.calendarYear === this._dateNavigationService.selectedDay.year &&
                monthIndex > this._dateNavigationService.selectedDay.month &&
                this.calendarYear === this._dateNavigationService.selectedEndDay.year &&
                monthIndex < this._dateNavigationService.selectedEndDay.month) ||
                (this._dateNavigationService.selectedDay.year !== this._dateNavigationService.selectedEndDay.year &&
                    this.calendarYear === this._dateNavigationService.selectedDay.year &&
                    monthIndex > this._dateNavigationService.selectedDay.month) ||
                (this._dateNavigationService.selectedDay.year !== this._dateNavigationService.selectedEndDay.year &&
                    this.calendarYear === this._dateNavigationService.selectedEndDay.year &&
                    monthIndex < this._dateNavigationService.selectedEndDay.month) ||
                (this.calendarYear > this._dateNavigationService.selectedDay.year &&
                    this.calendarYear < this._dateNavigationService.selectedEndDay.year));
        }
        else if (this._dateNavigationService.selectedDay && !this._dateNavigationService.selectedEndDay) {
            return ((this.calendarYear === this._dateNavigationService.selectedDay.year &&
                monthIndex > this._dateNavigationService.selectedDay.month &&
                monthIndex < this._dateNavigationService.hoveredMonth) ||
                (this.calendarYear > this._dateNavigationService.selectedDay.year &&
                    monthIndex < this._dateNavigationService.hoveredMonth));
        }
        else {
            return false;
        }
    }
}
ClrMonthpicker.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrMonthpicker, deps: [{ token: i1.LocaleHelperService }, { token: i2.DateNavigationService }, { token: i3.DatepickerFocusService }, { token: i0.ElementRef }, { token: i4.ViewManagerService }, { token: i5.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrMonthpicker.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrMonthpicker, selector: "clr-monthpicker", host: { attributes: { "role": "application" }, listeners: { "keydown": "onKeyDown($event)" }, properties: { "class.monthpicker": "true" } }, ngImport: i0, template: `
    <div class="calendar-header in-monthpicker">
      <div class="year-view-switcher">
        <button
          class="calendar-btn yearpicker-trigger"
          type="button"
          (click)="changeToYearView()"
          [attr.aria-label]="yearAttrString"
          [attr.title]="yearAttrString"
        >
          {{ calendarYear }}
        </button>
      </div>
      <div class="calendar-switchers">
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="previousYear()"
          [attr.aria-label]="commonStrings.keys.datepickerPreviousMonth"
        >
          <cds-icon shape="angle" direction="left" [attr.title]="commonStrings.keys.datepickerPreviousMonth"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="currentYear()"
          [attr.aria-label]="commonStrings.keys.datepickerCurrentMonth"
        >
          <cds-icon shape="event" [attr.title]="commonStrings.keys.datepickerCurrentMonth"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="nextYear()"
          [attr.aria-label]="commonStrings.keys.datepickerNextMonth"
        >
          <cds-icon shape="angle" direction="right" [attr.title]="commonStrings.keys.datepickerNextMonth"></cds-icon>
        </button>
      </div>
    </div>
    <div class="months">
      <button
        type="button"
        class="calendar-btn month"
        *ngFor="let month of monthNames; let monthIndex = index"
        (click)="changeMonth(monthIndex)"
        [class.is-selected]="isSelected(monthIndex)"
        [class.is-start-range]="getIsRangeStartMonth(monthIndex)"
        [class.is-end-range]="getIsRangeEndMonth(monthIndex)"
        [class.in-range]="isInRange(monthIndex)"
        [attr.tabindex]="getTabIndex(monthIndex)"
        [class.is-today]="calendarYear === currentCalendarYear && monthIndex === currentCalendarMonth"
        (mouseenter)="onHover(monthIndex)"
      >
        {{ month }}
      </button>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i6.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i7.CdsIconCustomTag, selector: "cds-icon" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrMonthpicker, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-monthpicker',
                    template: `
    <div class="calendar-header in-monthpicker">
      <div class="year-view-switcher">
        <button
          class="calendar-btn yearpicker-trigger"
          type="button"
          (click)="changeToYearView()"
          [attr.aria-label]="yearAttrString"
          [attr.title]="yearAttrString"
        >
          {{ calendarYear }}
        </button>
      </div>
      <div class="calendar-switchers">
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="previousYear()"
          [attr.aria-label]="commonStrings.keys.datepickerPreviousMonth"
        >
          <cds-icon shape="angle" direction="left" [attr.title]="commonStrings.keys.datepickerPreviousMonth"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="currentYear()"
          [attr.aria-label]="commonStrings.keys.datepickerCurrentMonth"
        >
          <cds-icon shape="event" [attr.title]="commonStrings.keys.datepickerCurrentMonth"></cds-icon>
        </button>
        <button
          class="calendar-btn switcher"
          type="button"
          (click)="nextYear()"
          [attr.aria-label]="commonStrings.keys.datepickerNextMonth"
        >
          <cds-icon shape="angle" direction="right" [attr.title]="commonStrings.keys.datepickerNextMonth"></cds-icon>
        </button>
      </div>
    </div>
    <div class="months">
      <button
        type="button"
        class="calendar-btn month"
        *ngFor="let month of monthNames; let monthIndex = index"
        (click)="changeMonth(monthIndex)"
        [class.is-selected]="isSelected(monthIndex)"
        [class.is-start-range]="getIsRangeStartMonth(monthIndex)"
        [class.is-end-range]="getIsRangeEndMonth(monthIndex)"
        [class.in-range]="isInRange(monthIndex)"
        [attr.tabindex]="getTabIndex(monthIndex)"
        [class.is-today]="calendarYear === currentCalendarYear && monthIndex === currentCalendarMonth"
        (mouseenter)="onHover(monthIndex)"
      >
        {{ month }}
      </button>
    </div>
  `,
                    host: {
                        '[class.monthpicker]': 'true',
                        role: 'application',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.LocaleHelperService }, { type: i2.DateNavigationService }, { type: i3.DatepickerFocusService }, { type: i0.ElementRef }, { type: i4.ViewManagerService }, { type: i5.ClrCommonStringsService }]; }, propDecorators: { onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9udGhwaWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9kYXRlcGlja2VyL21vbnRocGlja2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFpQixTQUFTLEVBQWMsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR25GLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7Ozs7Ozs7OztBQXNFaEUsTUFBTSxPQUFPLGNBQWM7SUFNekIsWUFDVSxvQkFBeUMsRUFDekMsc0JBQTZDLEVBQzdDLHVCQUErQyxFQUMvQyxNQUFrQixFQUNsQixtQkFBdUMsRUFDeEMsYUFBc0M7UUFMckMseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFxQjtRQUN6QywyQkFBc0IsR0FBdEIsc0JBQXNCLENBQXVCO1FBQzdDLDRCQUF1QixHQUF2Qix1QkFBdUIsQ0FBd0I7UUFDL0MsV0FBTSxHQUFOLE1BQU0sQ0FBWTtRQUNsQix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQW9CO1FBQ3hDLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQUU3QyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO0lBQ3BELENBQUM7SUFDRDs7O09BR0c7SUFDSCxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxnQkFBZ0IsQ0FBQztJQUNwRCxDQUFDO0lBQ0Q7O09BRUc7SUFDSCxJQUFJLGtCQUFrQjtRQUNwQixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7SUFDN0QsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSSxxQkFBcUI7UUFDdkIsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMs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QzNCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeURUO29CQUNELElBQUksRUFBRTt3QkFDSixxQkFBcUIsRUFBRSxNQUFNO3dCQUM3QixJQUFJLEVBQUUsYUFBYTtxQkFDcEI7aUJBQ0Y7bVJBNkZDLFNBQVM7c0JBRFIsWUFBWTt1QkFBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgS2V5cyB9IGZyb20gJy4uLy4uL3V0aWxzL2VudW1zL2tleXMuZW51bSc7XG5pbXBvcnQgeyBub3JtYWxpemVLZXkgfSBmcm9tICcuLi8uLi91dGlscy9mb2N1cy9rZXktZm9jdXMvdXRpbCc7XG5pbXBvcnQgeyBEYXRlTmF2aWdhdGlvblNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9kYXRlLW5hdmlnYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBEYXRlcGlja2VyRm9jdXNTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGF0ZXBpY2tlci1mb2N1cy5zZXJ2aWNlJztcbmltcG9ydCB7IExvY2FsZUhlbHBlclNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9sb2NhbGUtaGVscGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgVmlld01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvdmlldy1tYW5hZ2VyLnNlcnZpY2UnO1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLW1vbnRocGlja2VyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiY2FsZW5kYXItaGVhZGVyIGluLW1vbnRocGlja2VyXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwieWVhci12aWV3LXN3aXRjaGVyXCI+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzcz1cImNhbGVuZGFyLWJ0biB5ZWFycGlja2VyLXRyaWdnZXJcIlxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIChjbGljayk9XCJjaGFuZ2VUb1llYXJWaWV3KClcIlxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwieWVhckF0dHJTdHJpbmdcIlxuICAgICAgICAgIFthdHRyLnRpdGxlXT1cInllYXJBdHRyU3RyaW5nXCJcbiAgICAgICAgPlxuICAgICAgICAgIHt7IGNhbGVuZGFyWWVhciB9fVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImNhbGVuZGFyLXN3aXRjaGVyc1wiPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3M9XCJjYWxlbmRhci1idG4gc3dpdGNoZXJcIlxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIChjbGljayk9XCJwcmV2aW91c1llYXIoKVwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJjb21tb25TdHJpbmdzLmtleXMuZGF0ZXBpY2tlclByZXZpb3VzTW9udGhcIlxuICAgICAgICA+XG4gICAgICAgICAgPGNkcy1pY29uIHNoYXBlPVwiYW5nbGVcIiBkaXJlY3Rpb249XCJsZWZ0XCIgW2F0dHIudGl0bGVdPVwiY29tbW9uU3RyaW5ncy5rZXlzLmRhdGVwaWNrZXJQcmV2aW91c01vbnRoXCI+PC9jZHMtaWNvbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzcz1cImNhbGVuZGFyLWJ0biBzd2l0Y2hlclwiXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgKGNsaWNrKT1cImN1cnJlbnRZZWFyKClcIlxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiY29tbW9uU3RyaW5ncy5rZXlzLmRhdGVwaWNrZXJDdXJyZW50TW9udGhcIlxuICAgICAgICA+XG4gICAgICAgICAgPGNkcy1pY29uIHNoYXBlPVwiZXZlbnRcIiBbYXR0ci50aXRsZV09XCJjb21tb25TdHJpbmdzLmtleXMuZGF0ZXBpY2tlckN1cnJlbnRNb250aFwiPjwvY2RzLWljb24+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3M9XCJjYWxlbmRhci1idG4gc3dpdGNoZXJcIlxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIChjbGljayk9XCJuZXh0WWVhcigpXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZ3Mua2V5cy5kYXRlcGlja2VyTmV4dE1vbnRoXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxjZHMtaWNvbiBzaGFwZT1cImFuZ2xlXCIgZGlyZWN0aW9uPVwicmlnaHRcIiBbYXR0ci50aXRsZV09XCJjb21tb25TdHJpbmdzLmtleXMuZGF0ZXBpY2tlck5leHRNb250aFwiPjwvY2RzLWljb24+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cIm1vbnRoc1wiPlxuICAgICAgPGJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgY2xhc3M9XCJjYWxlbmRhci1idG4gbW9udGhcIlxuICAgICAgICAqbmdGb3I9XCJsZXQgbW9udGggb2YgbW9udGhOYW1lczsgbGV0IG1vbnRoSW5kZXggPSBpbmRleFwiXG4gICAgICAgIChjbGljayk9XCJjaGFuZ2VNb250aChtb250aEluZGV4KVwiXG4gICAgICAgIFtjbGFzcy5pcy1zZWxlY3RlZF09XCJpc1NlbGVjdGVkKG1vbnRoSW5kZXgpXCJcbiAgICAgICAgW2NsYXNzLmlzLXN0YXJ0LXJhbmdlXT1cImdldElzUmFuZ2VTdGFydE1vbnRoKG1vbnRoSW5kZXgpXCJcbiAgICAgICAgW2NsYXNzLmlzLWVuZC1yYW5nZV09XCJnZXRJc1JhbmdlRW5kTW9udGgobW9udGhJbmRleClcIlxuICAgICAgICBbY2xhc3MuaW4tcmFuZ2VdPVwiaXNJblJhbmdlKG1vbnRoSW5kZXgpXCJcbiAgICAgICAgW2F0dHIudGFiaW5kZXhdPVwiZ2V0VGFiSW5kZXgobW9udGhJbmRleClcIlxuICAgICAgICBbY2xhc3MuaXMtdG9kYXldPVwiY2FsZW5kYXJZZWFyID09PSBjdXJyZW50Q2FsZW5kYXJZZWFyICYmIG1vbnRoSW5kZXggPT09IGN1cnJlbnRDYWxlbmRhck1vbnRoXCJcbiAgICAgICAgKG1vdXNlZW50ZXIpPVwib25Ib3Zlcihtb250aEluZGV4KVwiXG4gICAgICA+XG4gICAgICAgIHt7IG1vbnRoIH19XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MubW9udGhwaWNrZXJdJzogJ3RydWUnLFxuICAgIHJvbGU6ICdhcHBsaWNhdGlvbicsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsck1vbnRocGlja2VyIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gIC8qKlxuICAgKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudCBmb2N1c2VkIG1vbnRoLlxuICAgKi9cbiAgcHJpdmF0ZSBfZm9jdXNlZE1vbnRoSW5kZXg6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9sb2NhbGVIZWxwZXJTZXJ2aWNlOiBMb2NhbGVIZWxwZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgX2RhdGVOYXZpZ2F0aW9uU2VydmljZTogRGF0ZU5hdmlnYXRpb25TZXJ2aWNlLFxuICAgIHByaXZhdGUgX2RhdGVwaWNrZXJGb2N1c1NlcnZpY2U6IERhdGVwaWNrZXJGb2N1c1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBfZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfdmlld01hbmFnZXJTZXJ2aWNlOiBWaWV3TWFuYWdlclNlcnZpY2UsXG4gICAgcHVibGljIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlXG4gICkge1xuICAgIHRoaXMuX2ZvY3VzZWRNb250aEluZGV4ID0gdGhpcy5jYWxlbmRhck1vbnRoSW5kZXg7XG4gIH1cbiAgLyoqXG4gICAqIEdldHMgdGhlIG1vbnRocyBhcnJheSB3aGljaCBpcyB1c2VkIHRvIHJlbmRlcmVkIHRoZSBtb250aHBpY2tlciB2aWV3LlxuICAgKiBNb250aHMgYXJlIGluIHRoZSBUcmFuc2xhdGlvbldpZHRoLldpZGUgZm9ybWF0LlxuICAgKi9cbiAgZ2V0IG1vbnRoTmFtZXMoKTogUmVhZG9ubHlBcnJheTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5fbG9jYWxlSGVscGVyU2VydmljZS5sb2NhbGVNb250aHNXaWRlO1xuICB9XG4gIC8qKlxuICAgKiBHZXRzIHRoZSBtb250aCB2YWx1ZSBvZiB0aGUgQ2FsZW5kYXIuXG4gICAqL1xuICBnZXQgY2FsZW5kYXJNb250aEluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5kaXNwbGF5ZWRDYWxlbmRhci5tb250aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSB5ZWFyIHdoaWNoIHRoZSB1c2VyIGlzIGN1cnJlbnRseSBvbi5cbiAgICovXG4gIGdldCBjYWxlbmRhckVuZE1vbnRoSW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRW5kRGF5Py5tb250aDtcbiAgfVxuXG4gIGdldCB5ZWFyQXR0clN0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmNvbW1vblN0cmluZ3MucGFyc2UodGhpcy5jb21tb25TdHJpbmdzLmtleXMuZGF0ZXBpY2tlclNlbGVjdFllYXJUZXh0LCB7XG4gICAgICBDQUxFTkRBUl9ZRUFSOiB0aGlzLmNhbGVuZGFyWWVhci50b1N0cmluZygpLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHllYXIgdmFsdWUgb2YgdGhlIGNhbGVuZGFyLlxuICAgKi9cbiAgZ2V0IGNhbGVuZGFyWWVhcigpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UuZGlzcGxheWVkQ2FsZW5kYXIueWVhcjtcbiAgfVxuXG4gIGdldCBjdXJyZW50Q2FsZW5kYXJZZWFyKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcbiAgfVxuXG4gIGdldCBjdXJyZW50Q2FsZW5kYXJNb250aCgpOiBudW1iZXIge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldE1vbnRoKCk7XG4gIH1cblxuICBnZXRJc1JhbmdlU3RhcnRNb250aChtb250aEluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLmlzUmFuZ2VQaWNrZXIgJiZcbiAgICAgIHRoaXMuY2FsZW5kYXJZZWFyID09PSB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWREYXk/LnllYXIgJiZcbiAgICAgIG1vbnRoSW5kZXggPT09IHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5zZWxlY3RlZERheT8ubW9udGhcbiAgICApO1xuICB9XG5cbiAgZ2V0SXNSYW5nZUVuZE1vbnRoKG1vbnRoSW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UuaXNSYW5nZVBpY2tlciAmJlxuICAgICAgdGhpcy5jYWxlbmRhclllYXIgPT09IHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5zZWxlY3RlZEVuZERheT8ueWVhciAmJlxuICAgICAgbW9udGhJbmRleCA9PT0gdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRW5kRGF5Py5tb250aFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbHMgdGhlIFZpZXdNYW5hZ2VyU2VydmljZSB0byBjaGFuZ2UgdG8gdGhlIHllYXJwaWNrZXIgdmlldy5cbiAgICovXG4gIGNoYW5nZVRvWWVhclZpZXcoKTogdm9pZCB7XG4gICAgdGhpcy5fdmlld01hbmFnZXJTZXJ2aWNlLmNoYW5nZVRvWWVhclZpZXcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb2N1c2VzIG9uIHRoZSBjdXJyZW50IGNhbGVuZGFyIG1vbnRoIHdoZW4gdGhlIFZpZXcgaXMgaW5pdGlhbGl6ZWQuXG4gICAqL1xuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fZGF0ZXBpY2tlckZvY3VzU2VydmljZS5mb2N1c0NlbGwodGhpcy5fZWxSZWYpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgdGhlIEtleWJvYXJkIGFycm93IG5hdmlnYXRpb24gZm9yIHRoZSBtb250aHBpY2tlci5cbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxuICBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAvLyBOT1RFOiBEaWRuJ3QgbW92ZSB0aGlzIHRvIHRoZSBkYXRlIG5hdmlnYXRpb24gc2VydmljZSBiZWNhdXNlXG4gICAgLy8gdGhlIGxvZ2ljIGlzIGZhaXJseSBzaW1wbGUgYW5kIGl0IGRpZG4ndCBtYWtlIHNlbnNlIGZvciBtZVxuICAgIC8vIHRvIGNyZWF0ZSBleHRyYSBvYnNlcnZhYmxlcyBqdXN0IHRvIG1vdmUgdGhpcyBsb2dpYyB0byB0aGUgc2VydmljZS5cbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIGNvbnN0IGtleSA9IG5vcm1hbGl6ZUtleShldmVudC5rZXkpO1xuICAgICAgaWYgKGtleSA9PT0gS2V5cy5BcnJvd1VwICYmIHRoaXMuX2ZvY3VzZWRNb250aEluZGV4ID4gMSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLl9mb2N1c2VkTW9udGhJbmRleCAtPSAyO1xuICAgICAgICB0aGlzLl9kYXRlcGlja2VyRm9jdXNTZXJ2aWNlLmZvY3VzQ2VsbCh0aGlzLl9lbFJlZik7XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gS2V5cy5BcnJvd0Rvd24gJiYgdGhpcy5fZm9jdXNlZE1vbnRoSW5kZXggPCAxMCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLl9mb2N1c2VkTW9udGhJbmRleCArPSAyO1xuICAgICAgICB0aGlzLl9kYXRlcGlja2VyRm9jdXNTZXJ2aWNlLmZvY3VzQ2VsbCh0aGlzLl9lbFJlZik7XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gS2V5cy5BcnJvd1JpZ2h0ICYmIHRoaXMuX2ZvY3VzZWRNb250aEluZGV4IDwgMTEpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5fZm9jdXNlZE1vbnRoSW5kZXgrKztcbiAgICAgICAgdGhpcy5fZGF0ZXBpY2tlckZvY3VzU2VydmljZS5mb2N1c0NlbGwodGhpcy5fZWxSZWYpO1xuICAgICAgfSBlbHNlIGlmIChrZXkgPT09IEtleXMuQXJyb3dMZWZ0ICYmIHRoaXMuX2ZvY3VzZWRNb250aEluZGV4ID4gMCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLl9mb2N1c2VkTW9udGhJbmRleC0tO1xuICAgICAgICB0aGlzLl9kYXRlcGlja2VyRm9jdXNTZXJ2aWNlLmZvY3VzQ2VsbCh0aGlzLl9lbFJlZik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNTZWxlY3RlZChtb250aEluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgKHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5zZWxlY3RlZERheT8ueWVhciA9PT0gdGhpcy5jYWxlbmRhclllYXIgJiZcbiAgICAgICAgbW9udGhJbmRleCA9PT0gdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRGF5Py5tb250aCkgfHxcbiAgICAgICh0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWRFbmREYXk/LnllYXIgPT09IHRoaXMuY2FsZW5kYXJZZWFyICYmXG4gICAgICAgIG1vbnRoSW5kZXggPT09IHRoaXMuY2FsZW5kYXJFbmRNb250aEluZGV4KVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbHMgdGhlIERhdGVOYXZpZ2F0aW9uU2VydmljZSB0byB1cGRhdGUgdGhlIGhvdmVyZWQgbW9udGggdmFsdWUgb2YgdGhlIGNhbGVuZGFyXG4gICAqL1xuICBvbkhvdmVyKG1vbnRoSW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5ob3ZlcmVkTW9udGggPSBtb250aEluZGV4O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxzIHRoZSBEYXRlTmF2aWdhdGlvblNlcnZpY2UgdG8gdXBkYXRlIHRoZSBtb250aCB2YWx1ZSBvZiB0aGUgY2FsZW5kYXIuXG4gICAqIEFsc28gY2hhbmdlcyB0aGUgdmlldyB0byB0aGUgZGF5cGlja2VyLlxuICAgKi9cbiAgY2hhbmdlTW9udGgobW9udGhJbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLmNoYW5nZU1vbnRoKG1vbnRoSW5kZXgpO1xuICAgIHRoaXMuX3ZpZXdNYW5hZ2VyU2VydmljZS5jaGFuZ2VUb0RheVZpZXcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wYXJlcyB0aGUgbW9udGggcGFzc2VkIHRvIHRoZSBmb2N1c2VkIG1vbnRoIGFuZCByZXR1cm5zIHRoZSB0YWIgaW5kZXguXG4gICAqL1xuICBnZXRUYWJJbmRleChtb250aEluZGV4OiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiBtb250aEluZGV4ID09PSB0aGlzLl9mb2N1c2VkTW9udGhJbmRleCA/IDAgOiAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyB0aGUgRGF0ZU5hdmlnYXRpb25TZXJ2aWNlIHRvIG1vdmUgdG8gdGhlIG5leHQgbW9udGguXG4gICAqL1xuICBuZXh0WWVhcigpOiB2b2lkIHtcbiAgICB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UubW92ZVRvTmV4dFllYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyB0aGUgRGF0ZU5hdmlnYXRpb25TZXJ2aWNlIHRvIG1vdmUgdG8gdGhlIHByZXZpb3VzIG1vbnRoLlxuICAgKi9cbiAgcHJldmlvdXNZZWFyKCk6IHZvaWQge1xuICAgIHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5tb3ZlVG9QcmV2aW91c1llYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyB0aGUgRGF0ZU5hdmlnYXRpb25TZXJ2aWNlIHRvIG1vdmUgdG8gdGhlIGN1cnJlbnQgbW9udGguXG4gICAqL1xuICBjdXJyZW50WWVhcigpOiB2b2lkIHtcbiAgICB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UubW92ZVRvQ3VycmVudE1vbnRoKCk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbGljYWJsZSBvbmx5IHRvIGRhdGUgcmFuZ2UgcGlja2VyXG4gICAqIENvbXBhcmVzIHRoZSBtb250aCBwYXNzZWQgaXMgaW4gYmV0d2VlbiB0aGUgc3RhcnQgYW5kIGVuZCBkYXRlIHJhbmdlXG4gICAqL1xuICBpc0luUmFuZ2UobW9udGhJbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UuaXNSYW5nZVBpY2tlcikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRGF5ICYmIHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5zZWxlY3RlZEVuZERheSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgKHRoaXMuY2FsZW5kYXJZZWFyID09PSB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWREYXkueWVhciAmJlxuICAgICAgICAgIG1vbnRoSW5kZXggPiB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWREYXkubW9udGggJiZcbiAgICAgICAgICB0aGlzLmNhbGVuZGFyWWVhciA9PT0gdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRW5kRGF5LnllYXIgJiZcbiAgICAgICAgICBtb250aEluZGV4IDwgdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRW5kRGF5Lm1vbnRoKSB8fFxuICAgICAgICAodGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRGF5LnllYXIgIT09IHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5zZWxlY3RlZEVuZERheS55ZWFyICYmXG4gICAgICAgICAgdGhpcy5jYWxlbmRhclllYXIgPT09IHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5zZWxlY3RlZERheS55ZWFyICYmXG4gICAgICAgICAgbW9udGhJbmRleCA+IHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5zZWxlY3RlZERheS5tb250aCkgfHxcbiAgICAgICAgKHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5zZWxlY3RlZERheS55ZWFyICE9PSB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWRFbmREYXkueWVhciAmJlxuICAgICAgICAgIHRoaXMuY2FsZW5kYXJZZWFyID09PSB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWRFbmREYXkueWVhciAmJlxuICAgICAgICAgIG1vbnRoSW5kZXggPCB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWRFbmREYXkubW9udGgpIHx8XG4gICAgICAgICh0aGlzLmNhbGVuZGFyWWVhciA+IHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5zZWxlY3RlZERheS55ZWFyICYmXG4gICAgICAgICAgdGhpcy5jYWxlbmRhclllYXIgPCB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWRFbmREYXkueWVhcilcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWREYXkgJiYgIXRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5zZWxlY3RlZEVuZERheSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgKHRoaXMuY2FsZW5kYXJZZWFyID09PSB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWREYXkueWVhciAmJlxuICAgICAgICAgIG1vbnRoSW5kZXggPiB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWREYXkubW9udGggJiZcbiAgICAgICAgICBtb250aEluZGV4IDwgdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLmhvdmVyZWRNb250aCkgfHxcbiAgICAgICAgKHRoaXMuY2FsZW5kYXJZZWFyID4gdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRGF5LnllYXIgJiZcbiAgICAgICAgICBtb250aEluZGV4IDwgdGhpcy5fZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLmhvdmVyZWRNb250aClcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==