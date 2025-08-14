/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChild, Input } from '@angular/core';
import { ClrPopoverHostDirective } from '../../utils/popover/popover-host.directive';
import { SignpostFocusManager } from './providers/signpost-focus-manager.service';
import { SignpostIdService } from './providers/signpost-id.service';
import { ClrSignpostTrigger } from './signpost-trigger';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/i18n/common-strings.service";
import * as i2 from "../../utils/popover/popover-host.directive";
import * as i3 from "@angular/common";
import * as i4 from "../../icon/icon";
import * as i5 from "./signpost-trigger";
/*********
 *
 * @class ClrSignpost
 *
 * @description
 * Class used to configure and control the state of a ClrSignpost and its associated ClrSignpostContent.
 * It supports the clrPosition with a 'right-middle' default.
 *
 */
export class ClrSignpost {
    constructor(commonStrings) {
        this.commonStrings = commonStrings;
        /**********
         * @property useCustomTrigger
         *
         * @description
         * Flag used to determine if we need to use the default trigger or a user supplied trigger element.
         *
         */
        this.useCustomTrigger = false;
    }
    /**********
     * @property signPostTrigger
     *
     * @description
     * Uses ContentChild to check for a user supplied element with the ClrSignpostTrigger on it.
     *
     */
    set customTrigger(trigger) {
        this.useCustomTrigger = !!trigger;
    }
}
ClrSignpost.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSignpost, deps: [{ token: i1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrSignpost.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrSignpost, selector: "clr-signpost", inputs: { signpostTriggerAriaLabel: ["clrSignpostTriggerAriaLabel", "signpostTriggerAriaLabel"] }, host: { properties: { "class.signpost": "true" } }, providers: [SignpostFocusManager, SignpostIdService], queries: [{ propertyName: "customTrigger", first: true, predicate: ClrSignpostTrigger, descendants: true }], hostDirectives: [{ directive: i2.ClrPopoverHostDirective }], ngImport: i0, template: `
    <ng-container *ngIf="!useCustomTrigger">
      <button
        type="button"
        class="signpost-action btn btn-sm btn-icon btn-link"
        clrSignpostTrigger
        [attr.aria-label]="signpostTriggerAriaLabel || commonStrings.keys.signpostToggle"
      >
        <cds-icon shape="info-circle" [attr.title]="commonStrings.keys.info"></cds-icon>
      </button>
    </ng-container>

    <ng-content></ng-content>
  `, isInline: true, dependencies: [{ kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i4.CdsIconCustomTag, selector: "cds-icon" }, { kind: "directive", type: i5.ClrSignpostTrigger, selector: "[clrSignpostTrigger]" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSignpost, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-signpost',
                    template: `
    <ng-container *ngIf="!useCustomTrigger">
      <button
        type="button"
        class="signpost-action btn btn-sm btn-icon btn-link"
        clrSignpostTrigger
        [attr.aria-label]="signpostTriggerAriaLabel || commonStrings.keys.signpostToggle"
      >
        <cds-icon shape="info-circle" [attr.title]="commonStrings.keys.info"></cds-icon>
      </button>
    </ng-container>

    <ng-content></ng-content>
  `,
                    host: { '[class.signpost]': 'true' },
                    providers: [SignpostFocusManager, SignpostIdService],
                    hostDirectives: [ClrPopoverHostDirective],
                }]
        }], ctorParameters: function () { return [{ type: i1.ClrCommonStringsService }]; }, propDecorators: { signpostTriggerAriaLabel: [{
                type: Input,
                args: ['clrSignpostTriggerAriaLabel']
            }], customTrigger: [{
                type: ContentChild,
                args: [ClrSignpostTrigger]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbnBvc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9wb3BvdmVyL3NpZ25wb3N0L3NpZ25wb3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRy9ELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDOzs7Ozs7O0FBdUJ4RDs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sT0FBTyxXQUFXO0lBWXRCLFlBQW1CLGFBQXNDO1FBQXRDLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQVh6RDs7Ozs7O1dBTUc7UUFDSCxxQkFBZ0IsR0FBRyxLQUFLLENBQUM7SUFJbUMsQ0FBQztJQUU3RDs7Ozs7O09BTUc7SUFDSCxJQUNJLGFBQWEsQ0FBQyxPQUEyQjtRQUMzQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUNwQyxDQUFDOzt3R0F4QlUsV0FBVzs0RkFBWCxXQUFXLDhMQWJYLENBQUMsb0JBQW9CLEVBQUUsaUJBQWlCLENBQUMscUVBa0N0QyxrQkFBa0IsNkdBakR0Qjs7Ozs7Ozs7Ozs7OztHQWFUOzJGQWVVLFdBQVc7a0JBOUJ2QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxjQUFjO29CQUN4QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7R0FhVDtvQkFDRCxJQUFJLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLEVBQUU7b0JBQ3BDLFNBQVMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLGlCQUFpQixDQUFDO29CQUNwRCxjQUFjLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztpQkFDMUM7OEdBcUJ1Qyx3QkFBd0I7c0JBQTdELEtBQUs7dUJBQUMsNkJBQTZCO2dCQVloQyxhQUFhO3NCQURoQixZQUFZO3VCQUFDLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50LCBDb250ZW50Q2hpbGQsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IENsclBvcG92ZXJIb3N0RGlyZWN0aXZlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wb3BvdmVyLWhvc3QuZGlyZWN0aXZlJztcbmltcG9ydCB7IFNpZ25wb3N0Rm9jdXNNYW5hZ2VyIH0gZnJvbSAnLi9wcm92aWRlcnMvc2lnbnBvc3QtZm9jdXMtbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7IFNpZ25wb3N0SWRTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvc2lnbnBvc3QtaWQuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJTaWducG9zdFRyaWdnZXIgfSBmcm9tICcuL3NpZ25wb3N0LXRyaWdnZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItc2lnbnBvc3QnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhdXNlQ3VzdG9tVHJpZ2dlclwiPlxuICAgICAgPGJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgY2xhc3M9XCJzaWducG9zdC1hY3Rpb24gYnRuIGJ0bi1zbSBidG4taWNvbiBidG4tbGlua1wiXG4gICAgICAgIGNsclNpZ25wb3N0VHJpZ2dlclxuICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cInNpZ25wb3N0VHJpZ2dlckFyaWFMYWJlbCB8fCBjb21tb25TdHJpbmdzLmtleXMuc2lnbnBvc3RUb2dnbGVcIlxuICAgICAgPlxuICAgICAgICA8Y2RzLWljb24gc2hhcGU9XCJpbmZvLWNpcmNsZVwiIFthdHRyLnRpdGxlXT1cImNvbW1vblN0cmluZ3Mua2V5cy5pbmZvXCI+PC9jZHMtaWNvbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvbmctY29udGFpbmVyPlxuXG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICBgLFxuICBob3N0OiB7ICdbY2xhc3Muc2lnbnBvc3RdJzogJ3RydWUnIH0sXG4gIHByb3ZpZGVyczogW1NpZ25wb3N0Rm9jdXNNYW5hZ2VyLCBTaWducG9zdElkU2VydmljZV0sXG4gIGhvc3REaXJlY3RpdmVzOiBbQ2xyUG9wb3Zlckhvc3REaXJlY3RpdmVdLFxufSlcblxuLyoqKioqKioqKlxuICpcbiAqIEBjbGFzcyBDbHJTaWducG9zdFxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogQ2xhc3MgdXNlZCB0byBjb25maWd1cmUgYW5kIGNvbnRyb2wgdGhlIHN0YXRlIG9mIGEgQ2xyU2lnbnBvc3QgYW5kIGl0cyBhc3NvY2lhdGVkIENsclNpZ25wb3N0Q29udGVudC5cbiAqIEl0IHN1cHBvcnRzIHRoZSBjbHJQb3NpdGlvbiB3aXRoIGEgJ3JpZ2h0LW1pZGRsZScgZGVmYXVsdC5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBDbHJTaWducG9zdCB7XG4gIC8qKioqKioqKioqXG4gICAqIEBwcm9wZXJ0eSB1c2VDdXN0b21UcmlnZ2VyXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBGbGFnIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIHdlIG5lZWQgdG8gdXNlIHRoZSBkZWZhdWx0IHRyaWdnZXIgb3IgYSB1c2VyIHN1cHBsaWVkIHRyaWdnZXIgZWxlbWVudC5cbiAgICpcbiAgICovXG4gIHVzZUN1c3RvbVRyaWdnZXIgPSBmYWxzZTtcblxuICBASW5wdXQoJ2NsclNpZ25wb3N0VHJpZ2dlckFyaWFMYWJlbCcpIHNpZ25wb3N0VHJpZ2dlckFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSkge31cblxuICAvKioqKioqKioqKlxuICAgKiBAcHJvcGVydHkgc2lnblBvc3RUcmlnZ2VyXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBVc2VzIENvbnRlbnRDaGlsZCB0byBjaGVjayBmb3IgYSB1c2VyIHN1cHBsaWVkIGVsZW1lbnQgd2l0aCB0aGUgQ2xyU2lnbnBvc3RUcmlnZ2VyIG9uIGl0LlxuICAgKlxuICAgKi9cbiAgQENvbnRlbnRDaGlsZChDbHJTaWducG9zdFRyaWdnZXIpXG4gIHNldCBjdXN0b21UcmlnZ2VyKHRyaWdnZXI6IENsclNpZ25wb3N0VHJpZ2dlcikge1xuICAgIHRoaXMudXNlQ3VzdG9tVHJpZ2dlciA9ICEhdHJpZ2dlcjtcbiAgfVxufVxuIl19