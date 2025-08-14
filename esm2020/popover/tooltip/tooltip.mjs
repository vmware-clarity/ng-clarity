/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from '@angular/core';
import { ClrPopoverHostDirective } from '../../utils/popover/popover-host.directive';
import { TooltipIdService } from './providers/tooltip-id.service';
import { TooltipMouseService } from './providers/tooltip-mouse.service';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/popover/popover-host.directive";
export class ClrTooltip {
}
ClrTooltip.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTooltip, deps: [], target: i0.ɵɵFactoryTarget.Component });
ClrTooltip.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrTooltip, selector: "clr-tooltip", host: { properties: { "class.tooltip": "true" } }, providers: [TooltipIdService, TooltipMouseService], hostDirectives: [{ directive: i1.ClrPopoverHostDirective }], ngImport: i0, template: `<ng-content></ng-content>`, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTooltip, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tooltip',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.tooltip]': 'true',
                    },
                    providers: [TooltipIdService, TooltipMouseService],
                    hostDirectives: [ClrPopoverHostDirective],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3BvcG92ZXIvdG9vbHRpcC90b29sdGlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUxQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNyRixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNsRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQzs7O0FBV3hFLE1BQU0sT0FBTyxVQUFVOzt1R0FBVixVQUFVOzJGQUFWLFVBQVUseUZBSFYsQ0FBQyxnQkFBZ0IsRUFBRSxtQkFBbUIsQ0FBQyx1RkFKeEMsMkJBQTJCOzJGQU8xQixVQUFVO2tCQVR0QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxhQUFhO29CQUN2QixRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0osaUJBQWlCLEVBQUUsTUFBTTtxQkFDMUI7b0JBQ0QsU0FBUyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsbUJBQW1CLENBQUM7b0JBQ2xELGNBQWMsRUFBRSxDQUFDLHVCQUF1QixDQUFDO2lCQUMxQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsclBvcG92ZXJIb3N0RGlyZWN0aXZlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wb3BvdmVyLWhvc3QuZGlyZWN0aXZlJztcbmltcG9ydCB7IFRvb2x0aXBJZFNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy90b29sdGlwLWlkLnNlcnZpY2UnO1xuaW1wb3J0IHsgVG9vbHRpcE1vdXNlU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL3Rvb2x0aXAtbW91c2Uuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Nsci10b29sdGlwJyxcbiAgdGVtcGxhdGU6IGA8bmctY29udGVudD48L25nLWNvbnRlbnQ+YCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MudG9vbHRpcF0nOiAndHJ1ZScsXG4gIH0sXG4gIHByb3ZpZGVyczogW1Rvb2x0aXBJZFNlcnZpY2UsIFRvb2x0aXBNb3VzZVNlcnZpY2VdLFxuICBob3N0RGlyZWN0aXZlczogW0NsclBvcG92ZXJIb3N0RGlyZWN0aXZlXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyVG9vbHRpcCB7fVxuIl19