/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/view-manager.service";
import * as i2 from "./providers/date-navigation.service";
import * as i3 from "./providers/locale-helper.service";
import * as i4 from "../../utils/i18n/common-strings.service";
import * as i5 from "../../icon/icon";
import * as i6 from "./calendar";
export class ClrDaypicker {
    constructor(_viewManagerService, _dateNavigationService, _localeHelperService, commonStrings) {
        this._viewManagerService = _viewManagerService;
        this._dateNavigationService = _dateNavigationService;
        this._localeHelperService = _localeHelperService;
        this.commonStrings = commonStrings;
    }
    get monthAttrString() {
        return this.commonStrings.parse(this.commonStrings.keys.datepickerSelectMonthText, {
            CALENDAR_MONTH: this.calendarMonth,
        });
    }
    get yearAttrString() {
        return this.commonStrings.parse(this.commonStrings.keys.datepickerSelectYearText, {
            CALENDAR_YEAR: this.calendarYear.toString(),
        });
    }
    /**
     * Returns the month value of the calendar in the TranslationWidth.Abbreviated format.
     */
    get calendarMonth() {
        return this._localeHelperService.localeMonthsAbbreviated[this._dateNavigationService.displayedCalendar.month];
    }
    /**
     * Returns the year value of the calendar.
     */
    get calendarYear() {
        return this._dateNavigationService.displayedCalendar.year;
    }
    /**
     * Calls the ViewManagerService to change to the monthpicker view.
     */
    changeToMonthView() {
        this._viewManagerService.changeToMonthView();
    }
    /**
     * Calls the ViewManagerService to change to the yearpicker view.
     */
    changeToYearView() {
        this._viewManagerService.changeToYearView();
    }
    /**
     * Calls the DateNavigationService to move to the next month.
     */
    nextMonth() {
        this._dateNavigationService.moveToNextMonth();
    }
    /**
     * Calls the DateNavigationService to move to the previous month.
     */
    previousMonth() {
        this._dateNavigationService.moveToPreviousMonth();
    }
    /**
     * Calls the DateNavigationService to move to the current month.
     */
    currentMonth() {
        this._dateNavigationService.moveToCurrentMonth();
    }
}
ClrDaypicker.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDaypicker, deps: [{ token: i1.ViewManagerService }, { token: i2.DateNavigationService }, { token: i3.LocaleHelperService }, { token: i4.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrDaypicker.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDaypicker, selector: "clr-daypicker", host: { attributes: { "role": "application" }, properties: { "class.daypicker": "true" } }, ngImport: i0, template: "<div class=\"clr-sr-only\">{{commonStrings.keys.modalContentStart}}</div>\n<div class=\"calendar-header\">\n  <div class=\"calendar-pickers\">\n    <button\n      class=\"calendar-btn monthpicker-trigger\"\n      type=\"button\"\n      (click)=\"changeToMonthView()\"\n      [attr.aria-label]=\"monthAttrString\"\n      [attr.title]=\"monthAttrString\"\n    >\n      {{calendarMonth}}\n    </button>\n    <button\n      class=\"calendar-btn yearpicker-trigger\"\n      type=\"button\"\n      (click)=\"changeToYearView()\"\n      [attr.aria-label]=\"yearAttrString\"\n      [attr.title]=\"yearAttrString\"\n    >\n      {{calendarYear}}\n    </button>\n  </div>\n  <div class=\"calendar-switchers\">\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"previousMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerPreviousMonth\"\n    >\n      <cds-icon shape=\"angle\" direction=\"left\" [attr.title]=\"commonStrings.keys.datepickerPreviousMonth\"></cds-icon>\n    </button>\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"currentMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerCurrentMonth\"\n    >\n      <cds-icon shape=\"event\" [attr.title]=\"commonStrings.keys.datepickerCurrentMonth\"></cds-icon>\n    </button>\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"nextMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerNextMonth\"\n    >\n      <cds-icon shape=\"angle\" direction=\"right\" [attr.title]=\"commonStrings.keys.datepickerNextMonth\"></cds-icon>\n    </button>\n  </div>\n</div>\n<clr-calendar></clr-calendar>\n<div class=\"clr-sr-only\">{{commonStrings.keys.modalContentEnd}}</div>\n", dependencies: [{ kind: "directive", type: i5.CdsIconCustomTag, selector: "cds-icon" }, { kind: "component", type: i6.ClrCalendar, selector: "clr-calendar" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDaypicker, decorators: [{
            type: Component,
            args: [{ selector: 'clr-daypicker', host: { '[class.daypicker]': 'true', role: 'application' }, template: "<div class=\"clr-sr-only\">{{commonStrings.keys.modalContentStart}}</div>\n<div class=\"calendar-header\">\n  <div class=\"calendar-pickers\">\n    <button\n      class=\"calendar-btn monthpicker-trigger\"\n      type=\"button\"\n      (click)=\"changeToMonthView()\"\n      [attr.aria-label]=\"monthAttrString\"\n      [attr.title]=\"monthAttrString\"\n    >\n      {{calendarMonth}}\n    </button>\n    <button\n      class=\"calendar-btn yearpicker-trigger\"\n      type=\"button\"\n      (click)=\"changeToYearView()\"\n      [attr.aria-label]=\"yearAttrString\"\n      [attr.title]=\"yearAttrString\"\n    >\n      {{calendarYear}}\n    </button>\n  </div>\n  <div class=\"calendar-switchers\">\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"previousMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerPreviousMonth\"\n    >\n      <cds-icon shape=\"angle\" direction=\"left\" [attr.title]=\"commonStrings.keys.datepickerPreviousMonth\"></cds-icon>\n    </button>\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"currentMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerCurrentMonth\"\n    >\n      <cds-icon shape=\"event\" [attr.title]=\"commonStrings.keys.datepickerCurrentMonth\"></cds-icon>\n    </button>\n    <button\n      class=\"calendar-btn switcher\"\n      type=\"button\"\n      (click)=\"nextMonth()\"\n      [attr.aria-label]=\"commonStrings.keys.datepickerNextMonth\"\n    >\n      <cds-icon shape=\"angle\" direction=\"right\" [attr.title]=\"commonStrings.keys.datepickerNextMonth\"></cds-icon>\n    </button>\n  </div>\n</div>\n<clr-calendar></clr-calendar>\n<div class=\"clr-sr-only\">{{commonStrings.keys.modalContentEnd}}</div>\n" }]
        }], ctorParameters: function () { return [{ type: i1.ViewManagerService }, { type: i2.DateNavigationService }, { type: i3.LocaleHelperService }, { type: i4.ClrCommonStringsService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5cGlja2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvZGF0ZXBpY2tlci9kYXlwaWNrZXIudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9kYXRlcGlja2VyL2RheXBpY2tlci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7Ozs7QUFZMUMsTUFBTSxPQUFPLFlBQVk7SUFDdkIsWUFDVSxtQkFBdUMsRUFDdkMsc0JBQTZDLEVBQzdDLG9CQUF5QyxFQUMxQyxhQUFzQztRQUhyQyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQW9CO1FBQ3ZDLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBdUI7UUFDN0MseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFxQjtRQUMxQyxrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7SUFDNUMsQ0FBQztJQUVKLElBQUksZUFBZTtRQUNqQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFO1lBQ2pGLGNBQWMsRUFBRSxJQUFJLENBQUMsYUFBYTtTQUNuQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSSxjQUFjO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUU7WUFDaEYsYUFBYSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFO1NBQzVDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksYUFBYTtRQUNmLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoSCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJLFlBQVk7UUFDZCxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUM7SUFDNUQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsaUJBQWlCO1FBQ2YsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDL0MsQ0FBQztJQUVEOztPQUVHO0lBQ0gsZ0JBQWdCO1FBQ2QsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDOUMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsU0FBUztRQUNQLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUNoRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxhQUFhO1FBQ1gsSUFBSSxDQUFDLHNCQUFzQixDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDcEQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsWUFBWTtRQUNWLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQ25ELENBQUM7O3lHQW5FVSxZQUFZOzZGQUFaLFlBQVksaUpDbkJ6QixndkRBbURBOzJGRGhDYSxZQUFZO2tCQUx4QixTQUFTOytCQUNFLGVBQWUsUUFFbkIsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IERhdGVOYXZpZ2F0aW9uU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2RhdGUtbmF2aWdhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IExvY2FsZUhlbHBlclNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9sb2NhbGUtaGVscGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgVmlld01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvdmlldy1tYW5hZ2VyLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZGF5cGlja2VyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2RheXBpY2tlci5odG1sJyxcbiAgaG9zdDogeyAnW2NsYXNzLmRheXBpY2tlcl0nOiAndHJ1ZScsIHJvbGU6ICdhcHBsaWNhdGlvbicgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF5cGlja2VyIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfdmlld01hbmFnZXJTZXJ2aWNlOiBWaWV3TWFuYWdlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBfZGF0ZU5hdmlnYXRpb25TZXJ2aWNlOiBEYXRlTmF2aWdhdGlvblNlcnZpY2UsXG4gICAgcHJpdmF0ZSBfbG9jYWxlSGVscGVyU2VydmljZTogTG9jYWxlSGVscGVyU2VydmljZSxcbiAgICBwdWJsaWMgY29tbW9uU3RyaW5nczogQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2VcbiAgKSB7fVxuXG4gIGdldCBtb250aEF0dHJTdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5jb21tb25TdHJpbmdzLnBhcnNlKHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmRhdGVwaWNrZXJTZWxlY3RNb250aFRleHQsIHtcbiAgICAgIENBTEVOREFSX01PTlRIOiB0aGlzLmNhbGVuZGFyTW9udGgsXG4gICAgfSk7XG4gIH1cblxuICBnZXQgeWVhckF0dHJTdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5jb21tb25TdHJpbmdzLnBhcnNlKHRoaXMuY29tbW9uU3RyaW5ncy5rZXlzLmRhdGVwaWNrZXJTZWxlY3RZZWFyVGV4dCwge1xuICAgICAgQ0FMRU5EQVJfWUVBUjogdGhpcy5jYWxlbmRhclllYXIudG9TdHJpbmcoKSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtb250aCB2YWx1ZSBvZiB0aGUgY2FsZW5kYXIgaW4gdGhlIFRyYW5zbGF0aW9uV2lkdGguQWJicmV2aWF0ZWQgZm9ybWF0LlxuICAgKi9cbiAgZ2V0IGNhbGVuZGFyTW9udGgoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbG9jYWxlSGVscGVyU2VydmljZS5sb2NhbGVNb250aHNBYmJyZXZpYXRlZFt0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UuZGlzcGxheWVkQ2FsZW5kYXIubW9udGhdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHllYXIgdmFsdWUgb2YgdGhlIGNhbGVuZGFyLlxuICAgKi9cbiAgZ2V0IGNhbGVuZGFyWWVhcigpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UuZGlzcGxheWVkQ2FsZW5kYXIueWVhcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyB0aGUgVmlld01hbmFnZXJTZXJ2aWNlIHRvIGNoYW5nZSB0byB0aGUgbW9udGhwaWNrZXIgdmlldy5cbiAgICovXG4gIGNoYW5nZVRvTW9udGhWaWV3KCk6IHZvaWQge1xuICAgIHRoaXMuX3ZpZXdNYW5hZ2VyU2VydmljZS5jaGFuZ2VUb01vbnRoVmlldygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxzIHRoZSBWaWV3TWFuYWdlclNlcnZpY2UgdG8gY2hhbmdlIHRvIHRoZSB5ZWFycGlja2VyIHZpZXcuXG4gICAqL1xuICBjaGFuZ2VUb1llYXJWaWV3KCk6IHZvaWQge1xuICAgIHRoaXMuX3ZpZXdNYW5hZ2VyU2VydmljZS5jaGFuZ2VUb1llYXJWaWV3KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbHMgdGhlIERhdGVOYXZpZ2F0aW9uU2VydmljZSB0byBtb3ZlIHRvIHRoZSBuZXh0IG1vbnRoLlxuICAgKi9cbiAgbmV4dE1vbnRoKCk6IHZvaWQge1xuICAgIHRoaXMuX2RhdGVOYXZpZ2F0aW9uU2VydmljZS5tb3ZlVG9OZXh0TW9udGgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyB0aGUgRGF0ZU5hdmlnYXRpb25TZXJ2aWNlIHRvIG1vdmUgdG8gdGhlIHByZXZpb3VzIG1vbnRoLlxuICAgKi9cbiAgcHJldmlvdXNNb250aCgpOiB2b2lkIHtcbiAgICB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UubW92ZVRvUHJldmlvdXNNb250aCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxzIHRoZSBEYXRlTmF2aWdhdGlvblNlcnZpY2UgdG8gbW92ZSB0byB0aGUgY3VycmVudCBtb250aC5cbiAgICovXG4gIGN1cnJlbnRNb250aCgpOiB2b2lkIHtcbiAgICB0aGlzLl9kYXRlTmF2aWdhdGlvblNlcnZpY2UubW92ZVRvQ3VycmVudE1vbnRoKCk7XG4gIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJjbHItc3Itb25seVwiPnt7Y29tbW9uU3RyaW5ncy5rZXlzLm1vZGFsQ29udGVudFN0YXJ0fX08L2Rpdj5cbjxkaXYgY2xhc3M9XCJjYWxlbmRhci1oZWFkZXJcIj5cbiAgPGRpdiBjbGFzcz1cImNhbGVuZGFyLXBpY2tlcnNcIj5cbiAgICA8YnV0dG9uXG4gICAgICBjbGFzcz1cImNhbGVuZGFyLWJ0biBtb250aHBpY2tlci10cmlnZ2VyXCJcbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgKGNsaWNrKT1cImNoYW5nZVRvTW9udGhWaWV3KClcIlxuICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJtb250aEF0dHJTdHJpbmdcIlxuICAgICAgW2F0dHIudGl0bGVdPVwibW9udGhBdHRyU3RyaW5nXCJcbiAgICA+XG4gICAgICB7e2NhbGVuZGFyTW9udGh9fVxuICAgIDwvYnV0dG9uPlxuICAgIDxidXR0b25cbiAgICAgIGNsYXNzPVwiY2FsZW5kYXItYnRuIHllYXJwaWNrZXItdHJpZ2dlclwiXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIChjbGljayk9XCJjaGFuZ2VUb1llYXJWaWV3KClcIlxuICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJ5ZWFyQXR0clN0cmluZ1wiXG4gICAgICBbYXR0ci50aXRsZV09XCJ5ZWFyQXR0clN0cmluZ1wiXG4gICAgPlxuICAgICAge3tjYWxlbmRhclllYXJ9fVxuICAgIDwvYnV0dG9uPlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cImNhbGVuZGFyLXN3aXRjaGVyc1wiPlxuICAgIDxidXR0b25cbiAgICAgIGNsYXNzPVwiY2FsZW5kYXItYnRuIHN3aXRjaGVyXCJcbiAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgKGNsaWNrKT1cInByZXZpb3VzTW9udGgoKVwiXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZ3Mua2V5cy5kYXRlcGlja2VyUHJldmlvdXNNb250aFwiXG4gICAgPlxuICAgICAgPGNkcy1pY29uIHNoYXBlPVwiYW5nbGVcIiBkaXJlY3Rpb249XCJsZWZ0XCIgW2F0dHIudGl0bGVdPVwiY29tbW9uU3RyaW5ncy5rZXlzLmRhdGVwaWNrZXJQcmV2aW91c01vbnRoXCI+PC9jZHMtaWNvbj5cbiAgICA8L2J1dHRvbj5cbiAgICA8YnV0dG9uXG4gICAgICBjbGFzcz1cImNhbGVuZGFyLWJ0biBzd2l0Y2hlclwiXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIChjbGljayk9XCJjdXJyZW50TW9udGgoKVwiXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZ3Mua2V5cy5kYXRlcGlja2VyQ3VycmVudE1vbnRoXCJcbiAgICA+XG4gICAgICA8Y2RzLWljb24gc2hhcGU9XCJldmVudFwiIFthdHRyLnRpdGxlXT1cImNvbW1vblN0cmluZ3Mua2V5cy5kYXRlcGlja2VyQ3VycmVudE1vbnRoXCI+PC9jZHMtaWNvbj5cbiAgICA8L2J1dHRvbj5cbiAgICA8YnV0dG9uXG4gICAgICBjbGFzcz1cImNhbGVuZGFyLWJ0biBzd2l0Y2hlclwiXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgIChjbGljayk9XCJuZXh0TW9udGgoKVwiXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZ3Mua2V5cy5kYXRlcGlja2VyTmV4dE1vbnRoXCJcbiAgICA+XG4gICAgICA8Y2RzLWljb24gc2hhcGU9XCJhbmdsZVwiIGRpcmVjdGlvbj1cInJpZ2h0XCIgW2F0dHIudGl0bGVdPVwiY29tbW9uU3RyaW5ncy5rZXlzLmRhdGVwaWNrZXJOZXh0TW9udGhcIj48L2Nkcy1pY29uPlxuICAgIDwvYnV0dG9uPlxuICA8L2Rpdj5cbjwvZGl2PlxuPGNsci1jYWxlbmRhcj48L2Nsci1jYWxlbmRhcj5cbjxkaXYgY2xhc3M9XCJjbHItc3Itb25seVwiPnt7Y29tbW9uU3RyaW5ncy5rZXlzLm1vZGFsQ29udGVudEVuZH19PC9kaXY+XG4iXX0=