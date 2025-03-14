/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, Optional, PLATFORM_ID } from '@angular/core';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { AbstractPopover } from '../common/abstract-popover';
import { POPOVER_HOST_ANCHOR } from '../common/popover-host-anchor.token';
import { SIGNPOST_POSITIONS } from './signpost-positions';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/i18n/common-strings.service";
import * as i2 from "./providers/signpost-id.service";
import * as i3 from "./providers/signpost-focus-manager.service";
import * as i4 from "../../icon/icon";
// aka where the arrow / pointer is at in relation to the anchor
const POSITIONS = [
    'top-left',
    'top-middle',
    'top-right',
    'right-top',
    'right-middle',
    'right-bottom',
    'bottom-right',
    'bottom-middle',
    'bottom-left',
    'left-bottom',
    'left-middle',
    'left-top',
];
export class ClrSignpostContent extends AbstractPopover {
    constructor(injector, parentHost, commonStrings, signpostIdService, signpostFocusManager, platformId, document) {
        super(injector, parentHost);
        this.commonStrings = commonStrings;
        this.signpostFocusManager = signpostFocusManager;
        this.platformId = platformId;
        this.signpostContentId = uniqueIdFactory();
        if (!parentHost) {
            throw new Error('clr-signpost-content should only be used inside of a clr-signpost');
        }
        // Defaults
        this.position = 'right-middle';
        this.closeOnOutsideClick = true;
        signpostIdService.setId(this.signpostContentId);
        this.document = document;
    }
    /*********
     *
     * @description
     * A setter for the position of the ClrSignpostContent popover. This is a combination of the following:
     * - anchorPoint - where on the trigger to anchor the ClrSignpostContent
     * - popoverPoint - where on the ClrSignpostContent container to align with the anchorPoint
     * - offsetY - where on the Y axis to align the ClrSignpostContent so it meets specs
     * - offsetX - where on the X axis to align the ClrSignpostContent so it meets specs
     * There are 12 possible positions to place a ClrSignpostContent container:
     * - top-left
     * - top-middle
     * - top-right
     * - right-top
     * - right-middle
     * - right-bottom
     * - bottom-right
     * - bottom-middle
     * - bottom-left
     * - left-bottom
     * - left-middle
     * - left-top
     *
     * I think of it as follows for 'top-left' -> CONTAINER_SIDE-SIDE_POSITION. In this case CONTAINER_SIDE is 'top'
     * meaning the top of the trigger icon (above the icon that hides/shows) the ClrSignpostContent. And, SIDE_POSITION
     * is 'left' meaning two things: 1) the ClrSignpostContent container extends to the left and 2) the 'arrow/pointer'
     * linking the SingpostContent to the trigger points down at the horizontal center of the trigger icon.
     *
     * @param newPosition
     */
    get position() {
        return this._position;
    }
    set position(position) {
        // Ugh
        this.renderer.removeClass(this.el.nativeElement, this.position);
        if (position && POSITIONS.indexOf(position) > -1) {
            this._position = position;
        }
        else {
            this._position = 'right-middle';
        }
        // Ugh
        this.renderer.addClass(this.el.nativeElement, this.position);
        const setPosition = SIGNPOST_POSITIONS[this.position];
        this.anchorPoint = setPosition.anchorPoint;
        this.popoverPoint = setPosition.popoverPoint;
        this.popoverOptions.offsetY = setPosition.offsetY;
        this.popoverOptions.offsetX = setPosition.offsetX;
    }
    /**********
     *
     * @description
     * Close function that uses the signpost instance to toggle the state of the content popover.
     *
     */
    close() {
        this.toggleService.open = false;
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        if (isPlatformBrowser(this.platformId) && this.el.nativeElement.contains(this.document.activeElement)) {
            this.signpostFocusManager.focusTrigger();
        }
    }
}
ClrSignpostContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSignpostContent, deps: [{ token: i0.Injector }, { token: POPOVER_HOST_ANCHOR, optional: true }, { token: i1.ClrCommonStringsService }, { token: i2.SignpostIdService }, { token: i3.SignpostFocusManager }, { token: PLATFORM_ID }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component });
ClrSignpostContent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrSignpostContent, selector: "clr-signpost-content", inputs: { signpostCloseAriaLabel: ["clrSignpostCloseAriaLabel", "signpostCloseAriaLabel"], position: ["clrPosition", "position"] }, host: { properties: { "class.signpost-content": "true", "id": "signpostContentId" } }, usesInheritance: true, ngImport: i0, template: `
    <div class="signpost-wrap">
      <div class="popover-pointer"></div>
      <div class="signpost-content-header">
        <ng-content select="clr-signpost-title"></ng-content>
        <button
          type="button"
          [attr.aria-label]="signpostCloseAriaLabel || commonStrings.keys.signpostClose"
          class="signpost-action close"
          (click)="close()"
          [attr.aria-controls]="signpostContentId"
        >
          <cds-icon shape="window-close" [attr.title]="commonStrings.keys.close"></cds-icon>
        </button>
      </div>
      <div class="signpost-content-body" tabindex="0">
        <ng-content></ng-content>
      </div>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i4.CdsIconCustomTag, selector: "cds-icon" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSignpostContent, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-signpost-content',
                    template: `
    <div class="signpost-wrap">
      <div class="popover-pointer"></div>
      <div class="signpost-content-header">
        <ng-content select="clr-signpost-title"></ng-content>
        <button
          type="button"
          [attr.aria-label]="signpostCloseAriaLabel || commonStrings.keys.signpostClose"
          class="signpost-action close"
          (click)="close()"
          [attr.aria-controls]="signpostContentId"
        >
          <cds-icon shape="window-close" [attr.title]="commonStrings.keys.close"></cds-icon>
        </button>
      </div>
      <div class="signpost-content-body" tabindex="0">
        <ng-content></ng-content>
      </div>
    </div>
  `,
                    host: { '[class.signpost-content]': 'true', '[id]': 'signpostContentId' },
                }]
        }], ctorParameters: function () { return [{ type: i0.Injector }, { type: i0.ElementRef, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [POPOVER_HOST_ANCHOR]
                }] }, { type: i1.ClrCommonStringsService }, { type: i2.SignpostIdService }, { type: i3.SignpostFocusManager }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { signpostCloseAriaLabel: [{
                type: Input,
                args: ['clrSignpostCloseAriaLabel']
            }], position: [{
                type: Input,
                args: ['clrPosition']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbnBvc3QtY29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3BvcG92ZXIvc2lnbnBvc3Qvc2lnbnBvc3QtY29udGVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsU0FBUyxFQUFjLE1BQU0sRUFBWSxLQUFLLEVBQWEsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUdqSCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDaEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzdELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRzFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7Ozs7QUFFMUQsZ0VBQWdFO0FBQ2hFLE1BQU0sU0FBUyxHQUFhO0lBQzFCLFVBQVU7SUFDVixZQUFZO0lBQ1osV0FBVztJQUNYLFdBQVc7SUFDWCxjQUFjO0lBQ2QsY0FBYztJQUNkLGNBQWM7SUFDZCxlQUFlO0lBQ2YsYUFBYTtJQUNiLGFBQWE7SUFDYixhQUFhO0lBQ2IsVUFBVTtDQUNYLENBQUM7QUEwQkYsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGVBQWU7SUFRckQsWUFDRSxRQUFrQixFQUdsQixVQUFtQyxFQUM1QixhQUFzQyxFQUM3QyxpQkFBb0MsRUFDNUIsb0JBQTBDLEVBQ3JCLFVBQWUsRUFDMUIsUUFBYTtRQUUvQixLQUFLLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBTnJCLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQUVyQyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQXNCO1FBQ3JCLGVBQVUsR0FB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bnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBET0NVTUVOVCwgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbmplY3QsIEluamVjdG9yLCBJbnB1dCwgT25EZXN0cm95LCBPcHRpb25hbCwgUExBVEZPUk1fSUQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy9pMThuL2NvbW1vbi1zdHJpbmdzLnNlcnZpY2UnO1xuaW1wb3J0IHsgdW5pcXVlSWRGYWN0b3J5IH0gZnJvbSAnLi4vLi4vdXRpbHMvaWQtZ2VuZXJhdG9yL2lkLWdlbmVyYXRvci5zZXJ2aWNlJztcbmltcG9ydCB7IEFic3RyYWN0UG9wb3ZlciB9IGZyb20gJy4uL2NvbW1vbi9hYnN0cmFjdC1wb3BvdmVyJztcbmltcG9ydCB7IFBPUE9WRVJfSE9TVF9BTkNIT1IgfSBmcm9tICcuLi9jb21tb24vcG9wb3Zlci1ob3N0LWFuY2hvci50b2tlbic7XG5pbXBvcnQgeyBTaWducG9zdEZvY3VzTWFuYWdlciB9IGZyb20gJy4vcHJvdmlkZXJzL3NpZ25wb3N0LWZvY3VzLW1hbmFnZXIuc2VydmljZSc7XG5pbXBvcnQgeyBTaWducG9zdElkU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3NpZ25wb3N0LWlkLnNlcnZpY2UnO1xuaW1wb3J0IHsgU0lHTlBPU1RfUE9TSVRJT05TIH0gZnJvbSAnLi9zaWducG9zdC1wb3NpdGlvbnMnO1xuXG4vLyBha2Egd2hlcmUgdGhlIGFycm93IC8gcG9pbnRlciBpcyBhdCBpbiByZWxhdGlvbiB0byB0aGUgYW5jaG9yXG5jb25zdCBQT1NJVElPTlM6IHN0cmluZ1tdID0gW1xuICAndG9wLWxlZnQnLFxuICAndG9wLW1pZGRsZScsXG4gICd0b3AtcmlnaHQnLFxuICAncmlnaHQtdG9wJyxcbiAgJ3JpZ2h0LW1pZGRsZScsIC8vIGRlZmF1bHRcbiAgJ3JpZ2h0LWJvdHRvbScsXG4gICdib3R0b20tcmlnaHQnLFxuICAnYm90dG9tLW1pZGRsZScsXG4gICdib3R0b20tbGVmdCcsXG4gICdsZWZ0LWJvdHRvbScsXG4gICdsZWZ0LW1pZGRsZScsXG4gICdsZWZ0LXRvcCcsXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItc2lnbnBvc3QtY29udGVudCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cInNpZ25wb3N0LXdyYXBcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJwb3BvdmVyLXBvaW50ZXJcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzaWducG9zdC1jb250ZW50LWhlYWRlclwiPlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItc2lnbnBvc3QtdGl0bGVcIj48L25nLWNvbnRlbnQ+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cInNpZ25wb3N0Q2xvc2VBcmlhTGFiZWwgfHwgY29tbW9uU3RyaW5ncy5rZXlzLnNpZ25wb3N0Q2xvc2VcIlxuICAgICAgICAgIGNsYXNzPVwic2lnbnBvc3QtYWN0aW9uIGNsb3NlXCJcbiAgICAgICAgICAoY2xpY2spPVwiY2xvc2UoKVwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1jb250cm9sc109XCJzaWducG9zdENvbnRlbnRJZFwiXG4gICAgICAgID5cbiAgICAgICAgICA8Y2RzLWljb24gc2hhcGU9XCJ3aW5kb3ctY2xvc2VcIiBbYXR0ci50aXRsZV09XCJjb21tb25TdHJpbmdzLmtleXMuY2xvc2VcIj48L2Nkcy1pY29uPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNpZ25wb3N0LWNvbnRlbnQtYm9keVwiIHRhYmluZGV4PVwiMFwiPlxuICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgaG9zdDogeyAnW2NsYXNzLnNpZ25wb3N0LWNvbnRlbnRdJzogJ3RydWUnLCAnW2lkXSc6ICdzaWducG9zdENvbnRlbnRJZCcgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyU2lnbnBvc3RDb250ZW50IGV4dGVuZHMgQWJzdHJhY3RQb3BvdmVyIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgQElucHV0KCdjbHJTaWducG9zdENsb3NlQXJpYUxhYmVsJykgc2lnbnBvc3RDbG9zZUFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIHNpZ25wb3N0Q29udGVudElkID0gdW5pcXVlSWRGYWN0b3J5KCk7XG5cbiAgcHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnQ7XG4gIHByaXZhdGUgX3Bvc2l0aW9uOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChQT1BPVkVSX0hPU1RfQU5DSE9SKVxuICAgIHBhcmVudEhvc3Q6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSxcbiAgICBzaWducG9zdElkU2VydmljZTogU2lnbnBvc3RJZFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBzaWducG9zdEZvY3VzTWFuYWdlcjogU2lnbnBvc3RGb2N1c01hbmFnZXIsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnksXG4gICAgQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQ6IGFueVxuICApIHtcbiAgICBzdXBlcihpbmplY3RvciwgcGFyZW50SG9zdCk7XG4gICAgaWYgKCFwYXJlbnRIb3N0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nsci1zaWducG9zdC1jb250ZW50IHNob3VsZCBvbmx5IGJlIHVzZWQgaW5zaWRlIG9mIGEgY2xyLXNpZ25wb3N0Jyk7XG4gICAgfVxuICAgIC8vIERlZmF1bHRzXG4gICAgdGhpcy5wb3NpdGlvbiA9ICdyaWdodC1taWRkbGUnO1xuICAgIHRoaXMuY2xvc2VPbk91dHNpZGVDbGljayA9IHRydWU7XG4gICAgc2lnbnBvc3RJZFNlcnZpY2Uuc2V0SWQodGhpcy5zaWducG9zdENvbnRlbnRJZCk7XG5cbiAgICB0aGlzLmRvY3VtZW50ID0gZG9jdW1lbnQ7XG4gIH1cblxuICAvKioqKioqKioqXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBIHNldHRlciBmb3IgdGhlIHBvc2l0aW9uIG9mIHRoZSBDbHJTaWducG9zdENvbnRlbnQgcG9wb3Zlci4gVGhpcyBpcyBhIGNvbWJpbmF0aW9uIG9mIHRoZSBmb2xsb3dpbmc6XG4gICAqIC0gYW5jaG9yUG9pbnQgLSB3aGVyZSBvbiB0aGUgdHJpZ2dlciB0byBhbmNob3IgdGhlIENsclNpZ25wb3N0Q29udGVudFxuICAgKiAtIHBvcG92ZXJQb2ludCAtIHdoZXJlIG9uIHRoZSBDbHJTaWducG9zdENvbnRlbnQgY29udGFpbmVyIHRvIGFsaWduIHdpdGggdGhlIGFuY2hvclBvaW50XG4gICAqIC0gb2Zmc2V0WSAtIHdoZXJlIG9uIHRoZSBZIGF4aXMgdG8gYWxpZ24gdGhlIENsclNpZ25wb3N0Q29udGVudCBzbyBpdCBtZWV0cyBzcGVjc1xuICAgKiAtIG9mZnNldFggLSB3aGVyZSBvbiB0aGUgWCBheGlzIHRvIGFsaWduIHRoZSBDbHJTaWducG9zdENvbnRlbnQgc28gaXQgbWVldHMgc3BlY3NcbiAgICogVGhlcmUgYXJlIDEyIHBvc3NpYmxlIHBvc2l0aW9ucyB0byBwbGFjZSBhIENsclNpZ25wb3N0Q29udGVudCBjb250YWluZXI6XG4gICAqIC0gdG9wLWxlZnRcbiAgICogLSB0b3AtbWlkZGxlXG4gICAqIC0gdG9wLXJpZ2h0XG4gICAqIC0gcmlnaHQtdG9wXG4gICAqIC0gcmlnaHQtbWlkZGxlXG4gICAqIC0gcmlnaHQtYm90dG9tXG4gICAqIC0gYm90dG9tLXJpZ2h0XG4gICAqIC0gYm90dG9tLW1pZGRsZVxuICAgKiAtIGJvdHRvbS1sZWZ0XG4gICAqIC0gbGVmdC1ib3R0b21cbiAgICogLSBsZWZ0LW1pZGRsZVxuICAgKiAtIGxlZnQtdG9wXG4gICAqXG4gICAqIEkgdGhpbmsgb2YgaXQgYXMgZm9sbG93cyBmb3IgJ3RvcC1sZWZ0JyAtPiBDT05UQUlORVJfU0lERS1TSURFX1BPU0lUSU9OLiBJbiB0aGlzIGNhc2UgQ09OVEFJTkVSX1NJREUgaXMgJ3RvcCdcbiAgICogbWVhbmluZyB0aGUgdG9wIG9mIHRoZSB0cmlnZ2VyIGljb24gKGFib3ZlIHRoZSBpY29uIHRoYXQgaGlkZXMvc2hvd3MpIHRoZSBDbHJTaWducG9zdENvbnRlbnQuIEFuZCwgU0lERV9QT1NJVElPTlxuICAgKiBpcyAnbGVmdCcgbWVhbmluZyB0d28gdGhpbmdzOiAxKSB0aGUgQ2xyU2lnbnBvc3RDb250ZW50IGNvbnRhaW5lciBleHRlbmRzIHRvIHRoZSBsZWZ0IGFuZCAyKSB0aGUgJ2Fycm93L3BvaW50ZXInXG4gICAqIGxpbmtpbmcgdGhlIFNpbmdwb3N0Q29udGVudCB0byB0aGUgdHJpZ2dlciBwb2ludHMgZG93biBhdCB0aGUgaG9yaXpvbnRhbCBjZW50ZXIgb2YgdGhlIHRyaWdnZXIgaWNvbi5cbiAgICpcbiAgICogQHBhcmFtIG5ld1Bvc2l0aW9uXG4gICAqL1xuICBASW5wdXQoJ2NsclBvc2l0aW9uJylcbiAgZ2V0IHBvc2l0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcbiAgfVxuICBzZXQgcG9zaXRpb24ocG9zaXRpb246IHN0cmluZykge1xuICAgIC8vIFVnaFxuICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCB0aGlzLnBvc2l0aW9uKTtcbiAgICBpZiAocG9zaXRpb24gJiYgUE9TSVRJT05TLmluZGV4T2YocG9zaXRpb24pID4gLTEpIHtcbiAgICAgIHRoaXMuX3Bvc2l0aW9uID0gcG9zaXRpb247XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3Bvc2l0aW9uID0gJ3JpZ2h0LW1pZGRsZSc7XG4gICAgfVxuICAgIC8vIFVnaFxuICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCB0aGlzLnBvc2l0aW9uKTtcblxuICAgIGNvbnN0IHNldFBvc2l0aW9uID0gU0lHTlBPU1RfUE9TSVRJT05TW3RoaXMucG9zaXRpb25dO1xuICAgIHRoaXMuYW5jaG9yUG9pbnQgPSBzZXRQb3NpdGlvbi5hbmNob3JQb2ludDtcbiAgICB0aGlzLnBvcG92ZXJQb2ludCA9IHNldFBvc2l0aW9uLnBvcG92ZXJQb2ludDtcbiAgICB0aGlzLnBvcG92ZXJPcHRpb25zLm9mZnNldFkgPSBzZXRQb3NpdGlvbi5vZmZzZXRZO1xuICAgIHRoaXMucG9wb3Zlck9wdGlvbnMub2Zmc2V0WCA9IHNldFBvc2l0aW9uLm9mZnNldFg7XG4gIH1cblxuICAvKioqKioqKioqKlxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ2xvc2UgZnVuY3Rpb24gdGhhdCB1c2VzIHRoZSBzaWducG9zdCBpbnN0YW5jZSB0byB0b2dnbGUgdGhlIHN0YXRlIG9mIHRoZSBjb250ZW50IHBvcG92ZXIuXG4gICAqXG4gICAqL1xuICBjbG9zZSgpIHtcbiAgICB0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlbiA9IGZhbHNlO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKSB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcblxuICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpICYmIHRoaXMuZWwubmF0aXZlRWxlbWVudC5jb250YWlucyh0aGlzLmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICB0aGlzLnNpZ25wb3N0Rm9jdXNNYW5hZ2VyLmZvY3VzVHJpZ2dlcigpO1xuICAgIH1cbiAgfVxufVxuIl19