/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { isPlatformBrowser } from '@angular/common';
import { Component, ContentChild, ElementRef, Inject, Input, PLATFORM_ID } from '@angular/core';
import { ClrTimelineStepState } from './enums/timeline-step-state.enum';
import { ClrTimelineStepTitle } from './timeline-step-title';
import * as i0 from "@angular/core";
import * as i1 from "./providers/timeline-icon-attribute.service";
import * as i2 from "@angular/common";
import * as i3 from "../icon/icon";
import * as i4 from "../progress/spinner/spinner";
export class ClrTimelineStep {
    constructor(iconAttributeService, platformId) {
        this.iconAttributeService = iconAttributeService;
        this.platformId = platformId;
        this.state = ClrTimelineStepState.NOT_STARTED;
    }
    get iconAriaLabel() {
        return this.iconAttributeService.getAriaLabel(this.state);
    }
    get iconShape() {
        return this.iconAttributeService.getIconShape(this.state);
    }
    get iconStatus() {
        return this.iconAttributeService.getIconStatus(this.state);
    }
    get isProcessing() {
        return this.state === ClrTimelineStepState.PROCESSING;
    }
    ngAfterContentInit() {
        if (this.stepTitle && isPlatformBrowser(this.platformId)) {
            this.stepTitleText = this.stepTitle.nativeElement.innerText;
        }
    }
}
ClrTimelineStep.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTimelineStep, deps: [{ token: i1.TimelineIconAttributeService }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
ClrTimelineStep.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrTimelineStep, selector: "clr-timeline-step", inputs: { state: ["clrState", "state"] }, host: { properties: { "class.clr-timeline-step": "true", "attr.role": "\"listitem\"" } }, queries: [{ propertyName: "stepTitle", first: true, predicate: ClrTimelineStepTitle, descendants: true, read: ElementRef }], ngImport: i0, template: `
    <ng-content select="clr-timeline-step-header"></ng-content>
    <span class="clr-sr-only">{{ stepTitleText }}</span>
    <ng-container *ngIf="!isProcessing; else processing">
      <cds-icon
        [attr.status]="iconStatus"
        [attr.shape]="iconShape"
        [attr.aria-label]="iconAriaLabel"
        role="img"
      ></cds-icon>
    </ng-container>
    <div class="clr-timeline-step-body">
      <ng-content select="clr-timeline-step-title"></ng-content>
      <ng-content select="clr-timeline-step-description"></ng-content>
    </div>

    <ng-template #processing>
      <clr-spinner clrMedium [attr.aria-label]="iconAriaLabel"></clr-spinner>
    </ng-template>
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.CdsIconCustomTag, selector: "cds-icon" }, { kind: "component", type: i4.ClrSpinner, selector: "clr-spinner", inputs: ["clrInline", "clrInverse", "clrSmall", "clrMedium"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTimelineStep, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-timeline-step',
                    template: `
    <ng-content select="clr-timeline-step-header"></ng-content>
    <span class="clr-sr-only">{{ stepTitleText }}</span>
    <ng-container *ngIf="!isProcessing; else processing">
      <cds-icon
        [attr.status]="iconStatus"
        [attr.shape]="iconShape"
        [attr.aria-label]="iconAriaLabel"
        role="img"
      ></cds-icon>
    </ng-container>
    <div class="clr-timeline-step-body">
      <ng-content select="clr-timeline-step-title"></ng-content>
      <ng-content select="clr-timeline-step-description"></ng-content>
    </div>

    <ng-template #processing>
      <clr-spinner clrMedium [attr.aria-label]="iconAriaLabel"></clr-spinner>
    </ng-template>
  `,
                    host: { '[class.clr-timeline-step]': 'true', '[attr.role]': '"listitem"' },
                }]
        }], ctorParameters: function () { return [{ type: i1.TimelineIconAttributeService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; }, propDecorators: { state: [{
                type: Input,
                args: ['clrState']
            }], stepTitle: [{
                type: ContentChild,
                args: [ClrTimelineStepTitle, { read: ElementRef }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZWxpbmUtc3RlcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3RpbWVsaW5lL3RpbWVsaW5lLXN0ZXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFaEcsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFFeEUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7Ozs7OztBQTBCN0QsTUFBTSxPQUFPLGVBQWU7SUFPMUIsWUFDVSxvQkFBa0QsRUFDN0IsVUFBZTtRQURwQyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQThCO1FBQzdCLGVBQVUsR0FBVixVQUFVLENBQUs7UUFSM0IsVUFBSyxHQUF5QixvQkFBb0IsQ0FBQyxXQUFXLENBQUM7SUFTL0UsQ0FBQztJQUVKLElBQUksYUFBYTtRQUNmLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVELElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVELElBQUksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELElBQUksWUFBWTtRQUNkLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxvQkFBb0IsQ0FBQyxVQUFVLENBQUM7SUFDeEQsQ0FBQztJQUVELGtCQUFrQjtRQUNoQixJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3hELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDO1NBQzdEO0lBQ0gsQ0FBQzs7NEdBaENVLGVBQWUsOERBU2hCLFdBQVc7Z0dBVFYsZUFBZSxvT0FHWixvQkFBb0IsMkJBQVUsVUFBVSw2QkF6QjVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUJUOzJGQUdVLGVBQWU7a0JBeEIzQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1CVDtvQkFDRCxJQUFJLEVBQUUsRUFBRSwyQkFBMkIsRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRTtpQkFDM0U7OzBCQVVJLE1BQU07MkJBQUMsV0FBVzs0Q0FSRixLQUFLO3NCQUF2QixLQUFLO3VCQUFDLFVBQVU7Z0JBRXlDLFNBQVM7c0JBQWxFLFlBQVk7dUJBQUMsb0JBQW9CLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgRWxlbWVudFJlZiwgSW5qZWN0LCBJbnB1dCwgUExBVEZPUk1fSUQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyVGltZWxpbmVTdGVwU3RhdGUgfSBmcm9tICcuL2VudW1zL3RpbWVsaW5lLXN0ZXAtc3RhdGUuZW51bSc7XG5pbXBvcnQgeyBUaW1lbGluZUljb25BdHRyaWJ1dGVTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvdGltZWxpbmUtaWNvbi1hdHRyaWJ1dGUuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJUaW1lbGluZVN0ZXBUaXRsZSB9IGZyb20gJy4vdGltZWxpbmUtc3RlcC10aXRsZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci10aW1lbGluZS1zdGVwJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItdGltZWxpbmUtc3RlcC1oZWFkZXJcIj48L25nLWNvbnRlbnQ+XG4gICAgPHNwYW4gY2xhc3M9XCJjbHItc3Itb25seVwiPnt7IHN0ZXBUaXRsZVRleHQgfX08L3NwYW4+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFpc1Byb2Nlc3Npbmc7IGVsc2UgcHJvY2Vzc2luZ1wiPlxuICAgICAgPGNkcy1pY29uXG4gICAgICAgIFthdHRyLnN0YXR1c109XCJpY29uU3RhdHVzXCJcbiAgICAgICAgW2F0dHIuc2hhcGVdPVwiaWNvblNoYXBlXCJcbiAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJpY29uQXJpYUxhYmVsXCJcbiAgICAgICAgcm9sZT1cImltZ1wiXG4gICAgICA+PC9jZHMtaWNvbj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8ZGl2IGNsYXNzPVwiY2xyLXRpbWVsaW5lLXN0ZXAtYm9keVwiPlxuICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLXRpbWVsaW5lLXN0ZXAtdGl0bGVcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItdGltZWxpbmUtc3RlcC1kZXNjcmlwdGlvblwiPjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cblxuICAgIDxuZy10ZW1wbGF0ZSAjcHJvY2Vzc2luZz5cbiAgICAgIDxjbHItc3Bpbm5lciBjbHJNZWRpdW0gW2F0dHIuYXJpYS1sYWJlbF09XCJpY29uQXJpYUxhYmVsXCI+PC9jbHItc3Bpbm5lcj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICBgLFxuICBob3N0OiB7ICdbY2xhc3MuY2xyLXRpbWVsaW5lLXN0ZXBdJzogJ3RydWUnLCAnW2F0dHIucm9sZV0nOiAnXCJsaXN0aXRlbVwiJyB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJUaW1lbGluZVN0ZXAge1xuICBASW5wdXQoJ2NsclN0YXRlJykgc3RhdGU6IENsclRpbWVsaW5lU3RlcFN0YXRlID0gQ2xyVGltZWxpbmVTdGVwU3RhdGUuTk9UX1NUQVJURUQ7XG5cbiAgQENvbnRlbnRDaGlsZChDbHJUaW1lbGluZVN0ZXBUaXRsZSwgeyByZWFkOiBFbGVtZW50UmVmIH0pIHN0ZXBUaXRsZTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgc3RlcFRpdGxlVGV4dDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaWNvbkF0dHJpYnV0ZVNlcnZpY2U6IFRpbWVsaW5lSWNvbkF0dHJpYnV0ZVNlcnZpY2UsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnlcbiAgKSB7fVxuXG4gIGdldCBpY29uQXJpYUxhYmVsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaWNvbkF0dHJpYnV0ZVNlcnZpY2UuZ2V0QXJpYUxhYmVsKHRoaXMuc3RhdGUpO1xuICB9XG5cbiAgZ2V0IGljb25TaGFwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmljb25BdHRyaWJ1dGVTZXJ2aWNlLmdldEljb25TaGFwZSh0aGlzLnN0YXRlKTtcbiAgfVxuXG4gIGdldCBpY29uU3RhdHVzKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaWNvbkF0dHJpYnV0ZVNlcnZpY2UuZ2V0SWNvblN0YXR1cyh0aGlzLnN0YXRlKTtcbiAgfVxuXG4gIGdldCBpc1Byb2Nlc3NpbmcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENsclRpbWVsaW5lU3RlcFN0YXRlLlBST0NFU1NJTkc7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgaWYgKHRoaXMuc3RlcFRpdGxlICYmIGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHRoaXMuc3RlcFRpdGxlVGV4dCA9IHRoaXMuc3RlcFRpdGxlLm5hdGl2ZUVsZW1lbnQuaW5uZXJUZXh0O1xuICAgIH1cbiAgfVxufVxuIl19