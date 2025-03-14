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
    constructor(dropdown, toggleService, el, focusHandler) {
        this.toggleService = toggleService;
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
ClrDropdownTrigger.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDropdownTrigger, deps: [{ token: i1.ClrDropdown }, { token: i2.ClrPopoverToggleService }, { token: i0.ElementRef }, { token: i3.DropdownFocusHandler }], target: i0.ɵɵFactoryTarget.Directive });
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
        }], ctorParameters: function () { return [{ type: i1.ClrDropdown }, { type: i2.ClrPopoverToggleService }, { type: i0.ElementRef }, { type: i3.DropdownFocusHandler }]; }, propDecorators: { onDropdownTriggerClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24tdHJpZ2dlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3BvcG92ZXIvZHJvcGRvd24vZHJvcGRvd24tdHJpZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7OztBQWtCcEUsTUFBTSxPQUFPLGtCQUFrQjtJQUc3QixZQUNFLFFBQXFCLEVBQ2IsYUFBc0MsRUFDOUMsRUFBMkIsRUFDM0IsWUFBa0M7UUFGMUIsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBSmhELHNCQUFpQixHQUFHLElBQUksQ0FBQztRQVF2QiwrRUFBK0U7UUFDL0UsSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFO1lBQ25CLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7U0FDaEM7UUFDRCxZQUFZLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUM7SUFDMUMsQ0FBQztJQUVELElBQUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUM7SUFDakMsQ0FBQztJQUdELHNCQUFzQixDQUFDLEtBQVU7UUFDL0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUMsQ0FBQzs7K0dBdkJVLGtCQUFrQjttR0FBbEIsa0JBQWtCOzJGQUFsQixrQkFBa0I7a0JBWjlCLFNBQVM7bUJBQUM7b0JBQ1QsK0NBQStDO29CQUMvQyxRQUFRLEVBQUUsMENBQTBDO29CQUNwRCxJQUFJLEVBQUU7d0JBQ0oseUJBQXlCLEVBQUUsbUJBQW1CO3dCQUM5Qyx1QkFBdUIsRUFBRSxvQkFBb0I7d0JBQzdDLG9CQUFvQixFQUFFLG9CQUFvQjt3QkFDMUMsZ0JBQWdCLEVBQUUsUUFBUTt3QkFDMUIsc0JBQXNCLEVBQUUsUUFBUTt3QkFDaEMsc0JBQXNCLEVBQUUsUUFBUTtxQkFDakM7aUJBQ0Y7b01Bc0JDLHNCQUFzQjtzQkFEckIsWUFBWTt1QkFBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcG9wb3Zlci9wcm92aWRlcnMvcG9wb3Zlci10b2dnbGUuc2VydmljZSc7XG5pbXBvcnQgeyBDbHJEcm9wZG93biB9IGZyb20gJy4vZHJvcGRvd24nO1xuaW1wb3J0IHsgRHJvcGRvd25Gb2N1c0hhbmRsZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9kcm9wZG93bi1mb2N1cy1oYW5kbGVyLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgLy8gV2Ugc3VwcG9ydCBib3RoIHNlbGVjdG9ycyBmb3IgbGVnYWN5IHJlYXNvbnNcbiAgc2VsZWN0b3I6ICdbY2xyRHJvcGRvd25UcmlnZ2VyXSxbY2xyRHJvcGRvd25Ub2dnbGVdJyxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuZHJvcGRvd24tdG9nZ2xlXSc6ICdpc1Jvb3RMZXZlbFRvZ2dsZScsXG4gICAgJ1tjbGFzcy5kcm9wZG93bi1pdGVtXSc6ICchaXNSb290TGV2ZWxUb2dnbGUnLFxuICAgICdbY2xhc3MuZXhwYW5kYWJsZV0nOiAnIWlzUm9vdExldmVsVG9nZ2xlJyxcbiAgICAnW2NsYXNzLmFjdGl2ZV0nOiAnYWN0aXZlJyxcbiAgICAnW2F0dHIuYXJpYS1oYXNwb3B1cF0nOiAnXCJtZW51XCInLFxuICAgICdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdhY3RpdmUnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEcm9wZG93blRyaWdnZXIge1xuICBpc1Jvb3RMZXZlbFRvZ2dsZSA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZHJvcGRvd246IENsckRyb3Bkb3duLFxuICAgIHByaXZhdGUgdG9nZ2xlU2VydmljZTogQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2UsXG4gICAgZWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIGZvY3VzSGFuZGxlcjogRHJvcGRvd25Gb2N1c0hhbmRsZXJcbiAgKSB7XG4gICAgLy8gaWYgdGhlIGNvbnRhaW5pbmcgZHJvcGRvd24gaGFzIGEgcGFyZW50LCB0aGVuIHRoaXMgaXMgbm90IHRoZSByb290IGxldmVsIG9uZVxuICAgIGlmIChkcm9wZG93bi5wYXJlbnQpIHtcbiAgICAgIHRoaXMuaXNSb290TGV2ZWxUb2dnbGUgPSBmYWxzZTtcbiAgICB9XG4gICAgZm9jdXNIYW5kbGVyLnRyaWdnZXIgPSBlbC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgZ2V0IGFjdGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW47XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gIG9uRHJvcGRvd25UcmlnZ2VyQ2xpY2soZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMudG9nZ2xlU2VydmljZS50b2dnbGVXaXRoRXZlbnQoZXZlbnQpO1xuICB9XG59XG4iXX0=