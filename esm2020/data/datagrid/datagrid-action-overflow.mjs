/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { isPlatformBrowser } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { ClrKeyFocus } from '../../utils/focus/key-focus';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrAlignment } from '../../utils/popover/enums/alignment.enum';
import { ClrAxis } from '../../utils/popover/enums/axis.enum';
import { ClrSide } from '../../utils/popover/enums/side.enum';
import { ClrPopoverHostDirective } from '../../utils/popover/popover-host.directive';
import * as i0 from "@angular/core";
import * as i1 from "./providers/row-action-service";
import * as i2 from "../../utils/i18n/common-strings.service";
import * as i3 from "../../utils/popover/providers/popover-toggle.service";
import * as i4 from "../../utils/popover/popover-host.directive";
import * as i5 from "../../utils/cdk/cdk-trap-focus.module";
import * as i6 from "../../icon/icon";
import * as i7 from "../../utils/popover/popover-anchor";
import * as i8 from "../../utils/popover/popover-open-close-button";
import * as i9 from "../../utils/popover/popover-content";
import * as i10 from "../../utils/focus/key-focus/key-focus";
let clrDgActionId = 0;
export class ClrDatagridActionOverflow {
    constructor(rowActionService, commonStrings, platformId, smartToggleService) {
        this.rowActionService = rowActionService;
        this.commonStrings = commonStrings;
        this.platformId = platformId;
        this.smartToggleService = smartToggleService;
        this.openChange = new EventEmitter(false);
        this.popoverId = uniqueIdFactory();
        this.smartPosition = {
            axis: ClrAxis.HORIZONTAL,
            side: ClrSide.AFTER,
            anchor: ClrAlignment.CENTER,
            content: ClrAlignment.CENTER,
        };
        this._open = false;
        this.subscriptions = [];
        rowActionService.register();
        this.subscriptions.push(smartToggleService.openChange.subscribe(openState => {
            this.open = openState;
        }), smartToggleService.popoverVisible.subscribe(visible => {
            if (visible) {
                this.initializeFocus();
            }
        }));
        this.popoverId = 'clr-action-menu' + clrDgActionId++;
    }
    get open() {
        return this._open;
    }
    set open(open) {
        const openState = !!open;
        if (!!openState !== this.open) {
            // prevents chocolate mess
            this.smartToggleService.open = openState;
            this.openChange.emit(openState);
            this._open = openState;
        }
    }
    ngOnDestroy() {
        this.rowActionService.unregister();
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    closeOverflowContent(event) {
        this.smartToggleService.toggleWithEvent(event);
    }
    initializeFocus() {
        if (isPlatformBrowser(this.platformId)) {
            const buttons = Array.from(document.querySelectorAll('button.action-item'));
            if (buttons.length) {
                this.keyFocus.current = 0;
                this.keyFocus.focusableItems = buttons;
                this.keyFocus.focusCurrent();
            }
        }
    }
}
ClrDatagridActionOverflow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridActionOverflow, deps: [{ token: i1.RowActionService }, { token: i2.ClrCommonStringsService }, { token: PLATFORM_ID }, { token: i3.ClrPopoverToggleService }], target: i0.ɵɵFactoryTarget.Component });
ClrDatagridActionOverflow.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridActionOverflow, selector: "clr-dg-action-overflow", inputs: { buttonLabel: ["clrDgActionOverflowButtonLabel", "buttonLabel"], open: ["clrDgActionOverflowOpen", "open"] }, outputs: { openChange: "clrDgActionOverflowOpenChange" }, viewQueries: [{ propertyName: "keyFocus", first: true, predicate: ClrKeyFocus, descendants: true }], hostDirectives: [{ directive: i4.ClrPopoverHostDirective }], ngImport: i0, template: `
    <button
      tabindex="-1"
      class="datagrid-action-toggle"
      type="button"
      role="button"
      aria-haspopup="true"
      #anchor
      [attr.aria-controls]="popoverId"
      [attr.aria-expanded]="open"
      [attr.aria-label]="buttonLabel || commonStrings.keys.rowActions"
      clrPopoverAnchor
      clrPopoverOpenCloseButton
    >
      <cds-icon shape="ellipsis-vertical" [attr.title]="buttonLabel || commonStrings.keys.rowActions"></cds-icon>
    </button>

    <div
      class="datagrid-action-overflow"
      [id]="popoverId"
      [attr.aria-hidden]="!open"
      [attr.id]="popoverId"
      clrKeyFocus
      cdkTrapFocus
      (click)="closeOverflowContent($event)"
      *clrPopoverContent="open; at: smartPosition; outsideClickToClose: true; scrollToClose: true"
    >
      <ng-content></ng-content>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i5.CdkTrapFocusModule_CdkTrapFocus, selector: "[cdkTrapFocus]" }, { kind: "directive", type: i6.CdsIconCustomTag, selector: "cds-icon" }, { kind: "directive", type: i7.ClrPopoverAnchor, selector: "[clrPopoverAnchor]" }, { kind: "directive", type: i8.ClrPopoverOpenCloseButton, selector: "[clrPopoverOpenCloseButton]", outputs: ["clrPopoverOpenCloseChange"] }, { kind: "directive", type: i9.ClrPopoverContent, selector: "[clrPopoverContent]", inputs: ["clrPopoverContent", "clrPopoverContentAt", "clrPopoverContentOutsideClickToClose", "clrPopoverContentScrollToClose"] }, { kind: "component", type: i10.ClrKeyFocus, selector: "[clrKeyFocus]", inputs: ["clrDirection", "clrFocusOnLoad", "clrKeyFocus"], outputs: ["clrFocusChange"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridActionOverflow, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-action-overflow',
                    hostDirectives: [ClrPopoverHostDirective],
                    template: `
    <button
      tabindex="-1"
      class="datagrid-action-toggle"
      type="button"
      role="button"
      aria-haspopup="true"
      #anchor
      [attr.aria-controls]="popoverId"
      [attr.aria-expanded]="open"
      [attr.aria-label]="buttonLabel || commonStrings.keys.rowActions"
      clrPopoverAnchor
      clrPopoverOpenCloseButton
    >
      <cds-icon shape="ellipsis-vertical" [attr.title]="buttonLabel || commonStrings.keys.rowActions"></cds-icon>
    </button>

    <div
      class="datagrid-action-overflow"
      [id]="popoverId"
      [attr.aria-hidden]="!open"
      [attr.id]="popoverId"
      clrKeyFocus
      cdkTrapFocus
      (click)="closeOverflowContent($event)"
      *clrPopoverContent="open; at: smartPosition; outsideClickToClose: true; scrollToClose: true"
    >
      <ng-content></ng-content>
    </div>
  `,
                }]
        }], ctorParameters: function () { return [{ type: i1.RowActionService }, { type: i2.ClrCommonStringsService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i3.ClrPopoverToggleService }]; }, propDecorators: { buttonLabel: [{
                type: Input,
                args: ['clrDgActionOverflowButtonLabel']
            }], openChange: [{
                type: Output,
                args: ['clrDgActionOverflowOpenChange']
            }], keyFocus: [{
                type: ViewChild,
                args: [ClrKeyFocus]
            }], open: [{
                type: Input,
                args: ['clrDgActionOverflowOpen']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtYWN0aW9uLW92ZXJmbG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC1hY3Rpb24tb3ZlcmZsb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFhLE1BQU0sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR2xILE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUUxRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDaEYsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUM5RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFFOUQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNENBQTRDLENBQUM7Ozs7Ozs7Ozs7OztBQUlyRixJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFvQ3RCLE1BQU0sT0FBTyx5QkFBeUI7SUFtQnBDLFlBQ1UsZ0JBQWtDLEVBQ25DLGFBQXNDLEVBQ2hCLFVBQWUsRUFDcEMsa0JBQTJDO1FBSDNDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbkMsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBQ2hCLGVBQVUsR0FBVixVQUFVLENBQUs7UUFDcEMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUF5QjtRQXBCWixlQUFVLEdBQUcsSUFBSSxZQUFZLENBQVUsS0FBSyxDQUFDLENBQUM7UUFFdkYsY0FBUyxHQUFHLGVBQWUsRUFBRSxDQUFDO1FBRTlCLGtCQUFhLEdBQXVCO1lBQ2xDLElBQUksRUFBRSxPQUFPLENBQUMsVUFBVTtZQUN4QixJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUs7WUFDbkIsTUFBTSxFQUFFLFlBQVksQ0FBQyxNQUFNO1lBQzNCLE9BQU8sRUFBRSxZQUFZLENBQUMsTUFBTTtTQUM3QixDQUFDO1FBSU0sVUFBSyxHQUFHLEtBQUssQ0FBQztRQUNkLGtCQUFhLEdBQW1CLEVBQUUsQ0FBQztRQVF6QyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDckIsa0JBQWtCLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNsRCxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztRQUN4QixDQUFDLENBQUMsRUFDRixrQkFBa0IsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3BELElBQUksT0FBTyxFQUFFO2dCQUNYLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQzthQUN4QjtRQUNILENBQUMsQ0FBQyxDQUNILENBQUM7UUFDRixJQUFJLENBQUMsU0FBUyxHQUFHLGlCQUFpQixHQUFHLGFBQWEsRUFBRSxDQUFDO0lBQ3ZELENBQUM7SUFFRCxJQUNJLElBQUk7UUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUNELElBQUksSUFBSSxDQUFDLElBQWE7UUFDcEIsTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUMsQ0FBQyxTQUFTLEtBQUssSUFBSSxDQUFDLElBQUksRUFBRTtZQUM3QiwwQkFBMEI7WUFDMUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7WUFDekMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxvQkFBb0IsQ0FBQyxLQUFZO1FBQy9CLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVPLGVBQWU7UUFDckIsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDdEMsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQW9CLG9CQUFvQixDQUFDLENBQUMsQ0FBQztZQUUvRixJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDO2dCQUV2QyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO2FBQzlCO1NBQ0Y7SUFDSCxDQUFDOztzSEF6RVUseUJBQXlCLHlGQXNCMUIsV0FBVzswR0F0QlYseUJBQXlCLHlSQWN6QixXQUFXLDZHQTdDWjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2QlQ7MkZBRVUseUJBQXlCO2tCQWxDckMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsd0JBQXdCO29CQUNsQyxjQUFjLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztvQkFDekMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTZCVDtpQkFDRjs7MEJBdUJJLE1BQU07MkJBQUMsV0FBVztrRkFyQm9CLFdBQVc7c0JBQW5ELEtBQUs7dUJBQUMsZ0NBQWdDO2dCQUVFLFVBQVU7c0JBQWxELE1BQU07dUJBQUMsK0JBQStCO2dCQVdFLFFBQVE7c0JBQWhELFNBQVM7dUJBQUMsV0FBVztnQkEwQmxCLElBQUk7c0JBRFAsS0FBSzt1QkFBQyx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE91dHB1dCwgUExBVEZPUk1fSUQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENscktleUZvY3VzIH0gZnJvbSAnLi4vLi4vdXRpbHMvZm9jdXMva2V5LWZvY3VzJztcbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IHVuaXF1ZUlkRmFjdG9yeSB9IGZyb20gJy4uLy4uL3V0aWxzL2lkLWdlbmVyYXRvci9pZC1nZW5lcmF0b3Iuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJBbGlnbm1lbnQgfSBmcm9tICcuLi8uLi91dGlscy9wb3BvdmVyL2VudW1zL2FsaWdubWVudC5lbnVtJztcbmltcG9ydCB7IENsckF4aXMgfSBmcm9tICcuLi8uLi91dGlscy9wb3BvdmVyL2VudW1zL2F4aXMuZW51bSc7XG5pbXBvcnQgeyBDbHJTaWRlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9lbnVtcy9zaWRlLmVudW0nO1xuaW1wb3J0IHsgQ2xyUG9wb3ZlclBvc2l0aW9uIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9pbnRlcmZhY2VzL3BvcG92ZXItcG9zaXRpb24uaW50ZXJmYWNlJztcbmltcG9ydCB7IENsclBvcG92ZXJIb3N0RGlyZWN0aXZlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wb3BvdmVyLWhvc3QuZGlyZWN0aXZlJztcbmltcG9ydCB7IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wcm92aWRlcnMvcG9wb3Zlci10b2dnbGUuc2VydmljZSc7XG5pbXBvcnQgeyBSb3dBY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvcm93LWFjdGlvbi1zZXJ2aWNlJztcblxubGV0IGNsckRnQWN0aW9uSWQgPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZGctYWN0aW9uLW92ZXJmbG93JyxcbiAgaG9zdERpcmVjdGl2ZXM6IFtDbHJQb3BvdmVySG9zdERpcmVjdGl2ZV0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGJ1dHRvblxuICAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgICBjbGFzcz1cImRhdGFncmlkLWFjdGlvbi10b2dnbGVcIlxuICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICByb2xlPVwiYnV0dG9uXCJcbiAgICAgIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCJcbiAgICAgICNhbmNob3JcbiAgICAgIFthdHRyLmFyaWEtY29udHJvbHNdPVwicG9wb3ZlcklkXCJcbiAgICAgIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwib3BlblwiXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImJ1dHRvbkxhYmVsIHx8IGNvbW1vblN0cmluZ3Mua2V5cy5yb3dBY3Rpb25zXCJcbiAgICAgIGNsclBvcG92ZXJBbmNob3JcbiAgICAgIGNsclBvcG92ZXJPcGVuQ2xvc2VCdXR0b25cbiAgICA+XG4gICAgICA8Y2RzLWljb24gc2hhcGU9XCJlbGxpcHNpcy12ZXJ0aWNhbFwiIFthdHRyLnRpdGxlXT1cImJ1dHRvbkxhYmVsIHx8IGNvbW1vblN0cmluZ3Mua2V5cy5yb3dBY3Rpb25zXCI+PC9jZHMtaWNvbj5cbiAgICA8L2J1dHRvbj5cblxuICAgIDxkaXZcbiAgICAgIGNsYXNzPVwiZGF0YWdyaWQtYWN0aW9uLW92ZXJmbG93XCJcbiAgICAgIFtpZF09XCJwb3BvdmVySWRcIlxuICAgICAgW2F0dHIuYXJpYS1oaWRkZW5dPVwiIW9wZW5cIlxuICAgICAgW2F0dHIuaWRdPVwicG9wb3ZlcklkXCJcbiAgICAgIGNscktleUZvY3VzXG4gICAgICBjZGtUcmFwRm9jdXNcbiAgICAgIChjbGljayk9XCJjbG9zZU92ZXJmbG93Q29udGVudCgkZXZlbnQpXCJcbiAgICAgICpjbHJQb3BvdmVyQ29udGVudD1cIm9wZW47IGF0OiBzbWFydFBvc2l0aW9uOyBvdXRzaWRlQ2xpY2tUb0Nsb3NlOiB0cnVlOyBzY3JvbGxUb0Nsb3NlOiB0cnVlXCJcbiAgICA+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG4gIGAsXG59KVxuZXhwb3J0IGNsYXNzIENsckRhdGFncmlkQWN0aW9uT3ZlcmZsb3cgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBASW5wdXQoJ2NsckRnQWN0aW9uT3ZlcmZsb3dCdXR0b25MYWJlbCcpIGJ1dHRvbkxhYmVsOiBzdHJpbmc7XG5cbiAgQE91dHB1dCgnY2xyRGdBY3Rpb25PdmVyZmxvd09wZW5DaGFuZ2UnKSBvcGVuQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPihmYWxzZSk7XG5cbiAgcG9wb3ZlcklkID0gdW5pcXVlSWRGYWN0b3J5KCk7XG5cbiAgc21hcnRQb3NpdGlvbjogQ2xyUG9wb3ZlclBvc2l0aW9uID0ge1xuICAgIGF4aXM6IENsckF4aXMuSE9SSVpPTlRBTCxcbiAgICBzaWRlOiBDbHJTaWRlLkFGVEVSLFxuICAgIGFuY2hvcjogQ2xyQWxpZ25tZW50LkNFTlRFUixcbiAgICBjb250ZW50OiBDbHJBbGlnbm1lbnQuQ0VOVEVSLFxuICB9O1xuXG4gIEBWaWV3Q2hpbGQoQ2xyS2V5Rm9jdXMpIHByaXZhdGUgcmVhZG9ubHkga2V5Rm9jdXM6IENscktleUZvY3VzO1xuXG4gIHByaXZhdGUgX29wZW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcm93QWN0aW9uU2VydmljZTogUm93QWN0aW9uU2VydmljZSxcbiAgICBwdWJsaWMgY29tbW9uU3RyaW5nczogQ2xyQ29tbW9uU3RyaW5nc1NlcnZpY2UsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBhbnksXG4gICAgcHJpdmF0ZSBzbWFydFRvZ2dsZVNlcnZpY2U6IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlXG4gICkge1xuICAgIHJvd0FjdGlvblNlcnZpY2UucmVnaXN0ZXIoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHNtYXJ0VG9nZ2xlU2VydmljZS5vcGVuQ2hhbmdlLnN1YnNjcmliZShvcGVuU3RhdGUgPT4ge1xuICAgICAgICB0aGlzLm9wZW4gPSBvcGVuU3RhdGU7XG4gICAgICB9KSxcbiAgICAgIHNtYXJ0VG9nZ2xlU2VydmljZS5wb3BvdmVyVmlzaWJsZS5zdWJzY3JpYmUodmlzaWJsZSA9PiB7XG4gICAgICAgIGlmICh2aXNpYmxlKSB7XG4gICAgICAgICAgdGhpcy5pbml0aWFsaXplRm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICAgIHRoaXMucG9wb3ZlcklkID0gJ2Nsci1hY3Rpb24tbWVudScgKyBjbHJEZ0FjdGlvbklkKys7XG4gIH1cblxuICBASW5wdXQoJ2NsckRnQWN0aW9uT3ZlcmZsb3dPcGVuJylcbiAgZ2V0IG9wZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuX29wZW47XG4gIH1cbiAgc2V0IG9wZW4ob3BlbjogYm9vbGVhbikge1xuICAgIGNvbnN0IG9wZW5TdGF0ZSA9ICEhb3BlbjtcbiAgICBpZiAoISFvcGVuU3RhdGUgIT09IHRoaXMub3Blbikge1xuICAgICAgLy8gcHJldmVudHMgY2hvY29sYXRlIG1lc3NcbiAgICAgIHRoaXMuc21hcnRUb2dnbGVTZXJ2aWNlLm9wZW4gPSBvcGVuU3RhdGU7XG4gICAgICB0aGlzLm9wZW5DaGFuZ2UuZW1pdChvcGVuU3RhdGUpO1xuICAgICAgdGhpcy5fb3BlbiA9IG9wZW5TdGF0ZTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnJvd0FjdGlvblNlcnZpY2UudW5yZWdpc3RlcigpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICBjbG9zZU92ZXJmbG93Q29udGVudChldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLnNtYXJ0VG9nZ2xlU2VydmljZS50b2dnbGVXaXRoRXZlbnQoZXZlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplRm9jdXMoKTogdm9pZCB7XG4gICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEJ1dHRvbkVsZW1lbnQ+KCdidXR0b24uYWN0aW9uLWl0ZW0nKSk7XG5cbiAgICAgIGlmIChidXR0b25zLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmtleUZvY3VzLmN1cnJlbnQgPSAwO1xuICAgICAgICB0aGlzLmtleUZvY3VzLmZvY3VzYWJsZUl0ZW1zID0gYnV0dG9ucztcblxuICAgICAgICB0aGlzLmtleUZvY3VzLmZvY3VzQ3VycmVudCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19