/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/i18n/common-strings.service";
import * as i2 from "../../utils/popover/providers/popover-toggle.service";
import * as i3 from "./providers/date-navigation.service";
import * as i4 from "./providers/date-form-control.service";
export class ClrDatepickerActions {
    constructor(commonStrings, toggleService, dateNavigationService, dateFormControlService) {
        this.commonStrings = commonStrings;
        this.toggleService = toggleService;
        this.dateNavigationService = dateNavigationService;
        this.dateFormControlService = dateFormControlService;
    }
    apply() {
        if (this.dateNavigationService.isRangePicker &&
            this.dateNavigationService.selectedDay &&
            this.dateNavigationService.selectedEndDay) {
            this.dateNavigationService.notifySelectedDayChanged({
                startDate: this.dateNavigationService.selectedDay,
                endDate: this.dateNavigationService.selectedEndDay,
            });
            this.dateFormControlService.markAsDirty();
        }
        else if (!this.dateNavigationService.isRangePicker && this.dateNavigationService.selectedDay) {
            this.dateNavigationService.notifySelectedDayChanged(this.dateNavigationService.selectedDay);
            this.dateFormControlService.markAsDirty();
        }
        this.toggleService.open = false;
    }
    cancel() {
        this.dateNavigationService.resetSelectedDay();
        this.toggleService.open = false;
    }
}
ClrDatepickerActions.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatepickerActions, deps: [{ token: i1.ClrCommonStringsService }, { token: i2.ClrPopoverToggleService }, { token: i3.DateNavigationService }, { token: i4.DateFormControlService }], target: i0.ɵɵFactoryTarget.Component });
ClrDatepickerActions.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatepickerActions, selector: "clr-datepicker-actions", host: { properties: { "class.datepicker-actions": "true" } }, ngImport: i0, template: `
    <button class="btn btn-outline" (click)="cancel()">{{ commonStrings.keys.cancel }}</button>
    <button class="btn btn-primary" (click)="apply()">{{ commonStrings.keys.apply }}</button>
  `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatepickerActions, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-datepicker-actions',
                    template: `
    <button class="btn btn-outline" (click)="cancel()">{{ commonStrings.keys.cancel }}</button>
    <button class="btn btn-primary" (click)="apply()">{{ commonStrings.keys.apply }}</button>
  `,
                    host: {
                        '[class.datepicker-actions]': 'true',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.ClrCommonStringsService }, { type: i2.ClrPopoverToggleService }, { type: i3.DateNavigationService }, { type: i4.DateFormControlService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1hY3Rpb24tYnV0dG9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1hY3Rpb24tYnV0dG9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7OztBQWlCMUMsTUFBTSxPQUFPLG9CQUFvQjtJQUMvQixZQUNZLGFBQXNDLEVBQ3hDLGFBQXNDLEVBQ3RDLHFCQUE0QyxFQUM1QyxzQkFBOEM7UUFINUMsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBQ3hDLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQUN0QywwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBQzVDLDJCQUFzQixHQUF0QixzQkFBc0IsQ0FBd0I7SUFDckQsQ0FBQztJQUVNLEtBQUs7UUFDYixJQUNFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhO1lBQ3hDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXO1lBQ3RDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxjQUFjLEVBQ3pDO1lBQ0EsSUFBSSxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixDQUFDO2dCQUNsRCxTQUFTLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFdBQVc7Z0JBQ2pELE9BQU8sRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsY0FBYzthQUNuRCxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDM0M7YUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxFQUFFO1lBQzlGLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDNUYsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQzNDO1FBQ0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ2xDLENBQUM7SUFFUyxNQUFNO1FBQ2QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDOUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ2xDLENBQUM7O2lIQTdCVSxvQkFBb0I7cUdBQXBCLG9CQUFvQiw0SEFSckI7OztHQUdUOzJGQUtVLG9CQUFvQjtrQkFWaEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsd0JBQXdCO29CQUNsQyxRQUFRLEVBQUU7OztHQUdUO29CQUNELElBQUksRUFBRTt3QkFDSiw0QkFBNEIsRUFBRSxNQUFNO3FCQUNyQztpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wcm92aWRlcnMvcG9wb3Zlci10b2dnbGUuc2VydmljZSc7XG5pbXBvcnQgeyBEYXRlRm9ybUNvbnRyb2xTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGF0ZS1mb3JtLWNvbnRyb2wuc2VydmljZSc7XG5pbXBvcnQgeyBEYXRlTmF2aWdhdGlvblNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9kYXRlLW5hdmlnYXRpb24uc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci1kYXRlcGlja2VyLWFjdGlvbnMnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLW91dGxpbmVcIiAoY2xpY2spPVwiY2FuY2VsKClcIj57eyBjb21tb25TdHJpbmdzLmtleXMuY2FuY2VsIH19PC9idXR0b24+XG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIChjbGljayk9XCJhcHBseSgpXCI+e3sgY29tbW9uU3RyaW5ncy5rZXlzLmFwcGx5IH19PC9idXR0b24+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmRhdGVwaWNrZXItYWN0aW9uc10nOiAndHJ1ZScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsckRhdGVwaWNrZXJBY3Rpb25zIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlLFxuICAgIHByaXZhdGUgdG9nZ2xlU2VydmljZTogQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBkYXRlTmF2aWdhdGlvblNlcnZpY2U6IERhdGVOYXZpZ2F0aW9uU2VydmljZSxcbiAgICBwcml2YXRlIGRhdGVGb3JtQ29udHJvbFNlcnZpY2U6IERhdGVGb3JtQ29udHJvbFNlcnZpY2VcbiAgKSB7fVxuXG4gIHByb3RlY3RlZCBhcHBseSgpIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLmRhdGVOYXZpZ2F0aW9uU2VydmljZS5pc1JhbmdlUGlja2VyICYmXG4gICAgICB0aGlzLmRhdGVOYXZpZ2F0aW9uU2VydmljZS5zZWxlY3RlZERheSAmJlxuICAgICAgdGhpcy5kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWRFbmREYXlcbiAgICApIHtcbiAgICAgIHRoaXMuZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLm5vdGlmeVNlbGVjdGVkRGF5Q2hhbmdlZCh7XG4gICAgICAgIHN0YXJ0RGF0ZTogdGhpcy5kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWREYXksXG4gICAgICAgIGVuZERhdGU6IHRoaXMuZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRW5kRGF5LFxuICAgICAgfSk7XG4gICAgICB0aGlzLmRhdGVGb3JtQ29udHJvbFNlcnZpY2UubWFya0FzRGlydHkoKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmRhdGVOYXZpZ2F0aW9uU2VydmljZS5pc1JhbmdlUGlja2VyICYmIHRoaXMuZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnNlbGVjdGVkRGF5KSB7XG4gICAgICB0aGlzLmRhdGVOYXZpZ2F0aW9uU2VydmljZS5ub3RpZnlTZWxlY3RlZERheUNoYW5nZWQodGhpcy5kYXRlTmF2aWdhdGlvblNlcnZpY2Uuc2VsZWN0ZWREYXkpO1xuICAgICAgdGhpcy5kYXRlRm9ybUNvbnRyb2xTZXJ2aWNlLm1hcmtBc0RpcnR5KCk7XG4gICAgfVxuICAgIHRoaXMudG9nZ2xlU2VydmljZS5vcGVuID0gZmFsc2U7XG4gIH1cblxuICBwcm90ZWN0ZWQgY2FuY2VsKCkge1xuICAgIHRoaXMuZGF0ZU5hdmlnYXRpb25TZXJ2aWNlLnJlc2V0U2VsZWN0ZWREYXkoKTtcbiAgICB0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlbiA9IGZhbHNlO1xuICB9XG59XG4iXX0=