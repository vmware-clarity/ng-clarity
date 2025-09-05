/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, HostListener } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./dropdown";
import * as i2 from "../../utils/popover/providers/popover-toggle.service";
import * as i3 from "./providers/dropdown-focus-handler.service";
export class ClrDropdownTrigger {
    constructor(dropdown, toggleService, el, focusHandler, renderer) {
        this.toggleService = toggleService;
        this.el = el;
        this.renderer = renderer;
        this.isRootLevelToggle = true;
        // if the containing dropdown has a parent, then this is not the root level one
        if (dropdown.parent) {
            this.isRootLevelToggle = false;
        }
        focusHandler.trigger = el.nativeElement;
    }
    get active() {
        return this.toggleService.open;
    }
    onDropdownTriggerClick(event) {
        this.toggleService.toggleWithEvent(event);
    }
}
ClrDropdownTrigger.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDropdownTrigger, deps: [{ token: i1.ClrDropdown }, { token: i2.ClrPopoverToggleService }, { token: i0.ElementRef }, { token: i3.DropdownFocusHandler }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
ClrDropdownTrigger.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrDropdownTrigger, selector: "[clrDropdownTrigger],[clrDropdownToggle]", host: { listeners: { "click": "onDropdownTriggerClick($event)" }, properties: { "class.dropdown-toggle": "isRootLevelToggle", "class.dropdown-item": "!isRootLevelToggle", "class.expandable": "!isRootLevelToggle", "class.active": "active", "attr.aria-haspopup": "\"menu\"", "attr.aria-expanded": "active" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDropdownTrigger, decorators: [{
            type: Directive,
            args: [{
                    // We support both selectors for legacy reasons
                    selector: '[clrDropdownTrigger],[clrDropdownToggle]',
                    host: {
                        '[class.dropdown-toggle]': 'isRootLevelToggle',
                        '[class.dropdown-item]': '!isRootLevelToggle',
                        '[class.expandable]': '!isRootLevelToggle',
                        '[class.active]': 'active',
                        '[attr.aria-haspopup]': '"menu"',
                        '[attr.aria-expanded]': 'active',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.ClrDropdown }, { type: i2.ClrPopoverToggleService }, { type: i0.ElementRef }, { type: i3.DropdownFocusHandler }, { type: i0.Renderer2 }]; }, propDecorators: { onDropdownTriggerClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24tdHJpZ2dlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3BvcG92ZXIvZHJvcGRvd24vZHJvcGRvd24tdHJpZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFhLE1BQU0sZUFBZSxDQUFDOzs7OztBQWlCL0UsTUFBTSxPQUFPLGtCQUFrQjtJQUc3QixZQUNFLFFBQXFCLEVBQ2IsYUFBc0MsRUFDdEMsRUFBMkIsRUFDbkMsWUFBa0MsRUFDMUIsUUFBbUI7UUFIbkIsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBQ3RDLE9BQUUsR0FBRixFQUFFLENBQXlCO1FBRTNCLGFBQVEsR0FBUixRQUFRLENBQVc7UUFQN0Isc0JBQWlCLEdBQUcsSUFBSSxDQUFDO1FBU3ZCLCtFQUErRTtRQUMvRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDbkIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztTQUNoQztRQUNELFlBQVksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQztJQUMxQyxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztJQUNqQyxDQUFDO0lBR0Qsc0JBQXNCLENBQUMsS0FBVTtRQUMvQixJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QyxDQUFDOzsrR0F4QlUsa0JBQWtCO21HQUFsQixrQkFBa0I7MkZBQWxCLGtCQUFrQjtrQkFaOUIsU0FBUzttQkFBQztvQkFDVCwrQ0FBK0M7b0JBQy9DLFFBQVEsRUFBRSwwQ0FBMEM7b0JBQ3BELElBQUksRUFBRTt3QkFDSix5QkFBeUIsRUFBRSxtQkFBbUI7d0JBQzlDLHVCQUF1QixFQUFFLG9CQUFvQjt3QkFDN0Msb0JBQW9CLEVBQUUsb0JBQW9CO3dCQUMxQyxnQkFBZ0IsRUFBRSxRQUFRO3dCQUMxQixzQkFBc0IsRUFBRSxRQUFRO3dCQUNoQyxzQkFBc0IsRUFBRSxRQUFRO3FCQUNqQztpQkFDRjs0TkF1QkMsc0JBQXNCO3NCQURyQixZQUFZO3VCQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvcHJvdmlkZXJzL3BvcG92ZXItdG9nZ2xlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyRHJvcGRvd24gfSBmcm9tICcuL2Ryb3Bkb3duJztcbmltcG9ydCB7IERyb3Bkb3duRm9jdXNIYW5kbGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvZHJvcGRvd24tZm9jdXMtaGFuZGxlci5zZXJ2aWNlJztcbkBEaXJlY3RpdmUoe1xuICAvLyBXZSBzdXBwb3J0IGJvdGggc2VsZWN0b3JzIGZvciBsZWdhY3kgcmVhc29uc1xuICBzZWxlY3RvcjogJ1tjbHJEcm9wZG93blRyaWdnZXJdLFtjbHJEcm9wZG93blRvZ2dsZV0nLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5kcm9wZG93bi10b2dnbGVdJzogJ2lzUm9vdExldmVsVG9nZ2xlJyxcbiAgICAnW2NsYXNzLmRyb3Bkb3duLWl0ZW1dJzogJyFpc1Jvb3RMZXZlbFRvZ2dsZScsXG4gICAgJ1tjbGFzcy5leHBhbmRhYmxlXSc6ICchaXNSb290TGV2ZWxUb2dnbGUnLFxuICAgICdbY2xhc3MuYWN0aXZlXSc6ICdhY3RpdmUnLFxuICAgICdbYXR0ci5hcmlhLWhhc3BvcHVwXSc6ICdcIm1lbnVcIicsXG4gICAgJ1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ2FjdGl2ZScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsckRyb3Bkb3duVHJpZ2dlciB7XG4gIGlzUm9vdExldmVsVG9nZ2xlID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBkcm9wZG93bjogQ2xyRHJvcGRvd24sXG4gICAgcHJpdmF0ZSB0b2dnbGVTZXJ2aWNlOiBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSxcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBmb2N1c0hhbmRsZXI6IERyb3Bkb3duRm9jdXNIYW5kbGVyLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMlxuICApIHtcbiAgICAvLyBpZiB0aGUgY29udGFpbmluZyBkcm9wZG93biBoYXMgYSBwYXJlbnQsIHRoZW4gdGhpcyBpcyBub3QgdGhlIHJvb3QgbGV2ZWwgb25lXG4gICAgaWYgKGRyb3Bkb3duLnBhcmVudCkge1xuICAgICAgdGhpcy5pc1Jvb3RMZXZlbFRvZ2dsZSA9IGZhbHNlO1xuICAgIH1cbiAgICBmb2N1c0hhbmRsZXIudHJpZ2dlciA9IGVsLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBnZXQgYWN0aXZlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlbjtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgb25Ecm9wZG93blRyaWdnZXJDbGljayhldmVudDogYW55KTogdm9pZCB7XG4gICAgdGhpcy50b2dnbGVTZXJ2aWNlLnRvZ2dsZVdpdGhFdmVudChldmVudCk7XG4gIH1cbn1cbiJdfQ==