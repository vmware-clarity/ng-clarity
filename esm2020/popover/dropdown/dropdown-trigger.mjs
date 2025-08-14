/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, HostListener } from '@angular/core';
import { wrapHostContentInsideSpan } from './utils/content-wrapping';
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
    ngAfterViewInit() {
        if (!this.isRootLevelToggle) {
            wrapHostContentInsideSpan(this.el.nativeElement, this.renderer, 'dropdown-item-content');
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24tdHJpZ2dlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3BvcG92ZXIvZHJvcGRvd24vZHJvcGRvd24tdHJpZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBSy9FLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDOzs7OztBQWNyRSxNQUFNLE9BQU8sa0JBQWtCO0lBRzdCLFlBQ0UsUUFBcUIsRUFDYixhQUFzQyxFQUN0QyxFQUEyQixFQUNuQyxZQUFrQyxFQUMxQixRQUFtQjtRQUhuQixrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7UUFDdEMsT0FBRSxHQUFGLEVBQUUsQ0FBeUI7UUFFM0IsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQVA3QixzQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFTdkIsK0VBQStFO1FBQy9FLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUNuQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO1NBQ2hDO1FBQ0QsWUFBWSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDO0lBQzFDLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO0lBQ2pDLENBQUM7SUFHRCxzQkFBc0IsQ0FBQyxLQUFVO1FBQy9CLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUMzQix5QkFBeUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLHVCQUF1QixDQUFDLENBQUM7U0FDMUY7SUFDSCxDQUFDOzsrR0E5QlUsa0JBQWtCO21HQUFsQixrQkFBa0I7MkZBQWxCLGtCQUFrQjtrQkFaOUIsU0FBUzttQkFBQztvQkFDVCwrQ0FBK0M7b0JBQy9DLFFBQVEsRUFBRSwwQ0FBMEM7b0JBQ3BELElBQUksRUFBRTt3QkFDSix5QkFBeUIsRUFBRSxtQkFBbUI7d0JBQzlDLHVCQUF1QixFQUFFLG9CQUFvQjt3QkFDN0Msb0JBQW9CLEVBQUUsb0JBQW9CO3dCQUMxQyxnQkFBZ0IsRUFBRSxRQUFRO3dCQUMxQixzQkFBc0IsRUFBRSxRQUFRO3dCQUNoQyxzQkFBc0IsRUFBRSxRQUFRO3FCQUNqQztpQkFDRjs0TkF1QkMsc0JBQXNCO3NCQURyQixZQUFZO3VCQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvcHJvdmlkZXJzL3BvcG92ZXItdG9nZ2xlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2xyRHJvcGRvd24gfSBmcm9tICcuL2Ryb3Bkb3duJztcbmltcG9ydCB7IERyb3Bkb3duRm9jdXNIYW5kbGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvZHJvcGRvd24tZm9jdXMtaGFuZGxlci5zZXJ2aWNlJztcbmltcG9ydCB7IHdyYXBIb3N0Q29udGVudEluc2lkZVNwYW4gfSBmcm9tICcuL3V0aWxzL2NvbnRlbnQtd3JhcHBpbmcnO1xuXG5ARGlyZWN0aXZlKHtcbiAgLy8gV2Ugc3VwcG9ydCBib3RoIHNlbGVjdG9ycyBmb3IgbGVnYWN5IHJlYXNvbnNcbiAgc2VsZWN0b3I6ICdbY2xyRHJvcGRvd25UcmlnZ2VyXSxbY2xyRHJvcGRvd25Ub2dnbGVdJyxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuZHJvcGRvd24tdG9nZ2xlXSc6ICdpc1Jvb3RMZXZlbFRvZ2dsZScsXG4gICAgJ1tjbGFzcy5kcm9wZG93bi1pdGVtXSc6ICchaXNSb290TGV2ZWxUb2dnbGUnLFxuICAgICdbY2xhc3MuZXhwYW5kYWJsZV0nOiAnIWlzUm9vdExldmVsVG9nZ2xlJyxcbiAgICAnW2NsYXNzLmFjdGl2ZV0nOiAnYWN0aXZlJyxcbiAgICAnW2F0dHIuYXJpYS1oYXNwb3B1cF0nOiAnXCJtZW51XCInLFxuICAgICdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdhY3RpdmUnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEcm9wZG93blRyaWdnZXIge1xuICBpc1Jvb3RMZXZlbFRvZ2dsZSA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZHJvcGRvd246IENsckRyb3Bkb3duLFxuICAgIHByaXZhdGUgdG9nZ2xlU2VydmljZTogQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgZm9jdXNIYW5kbGVyOiBEcm9wZG93bkZvY3VzSGFuZGxlcixcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjJcbiAgKSB7XG4gICAgLy8gaWYgdGhlIGNvbnRhaW5pbmcgZHJvcGRvd24gaGFzIGEgcGFyZW50LCB0aGVuIHRoaXMgaXMgbm90IHRoZSByb290IGxldmVsIG9uZVxuICAgIGlmIChkcm9wZG93bi5wYXJlbnQpIHtcbiAgICAgIHRoaXMuaXNSb290TGV2ZWxUb2dnbGUgPSBmYWxzZTtcbiAgICB9XG4gICAgZm9jdXNIYW5kbGVyLnRyaWdnZXIgPSBlbC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgZ2V0IGFjdGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW47XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gIG9uRHJvcGRvd25UcmlnZ2VyQ2xpY2soZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMudG9nZ2xlU2VydmljZS50b2dnbGVXaXRoRXZlbnQoZXZlbnQpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICghdGhpcy5pc1Jvb3RMZXZlbFRvZ2dsZSkge1xuICAgICAgd3JhcEhvc3RDb250ZW50SW5zaWRlU3Bhbih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIHRoaXMucmVuZGVyZXIsICdkcm9wZG93bi1pdGVtLWNvbnRlbnQnKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==