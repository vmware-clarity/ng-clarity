/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/popover-events.service";
export class ClrPopoverAnchor {
    constructor(smartEventService, element) {
        smartEventService.anchorButtonRef = element;
    }
}
ClrPopoverAnchor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverAnchor, deps: [{ token: i1.ClrPopoverEventsService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrPopoverAnchor.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrPopoverAnchor, selector: "[clrPopoverAnchor]", host: { properties: { "class.clr-anchor": "true" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverAnchor, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrPopoverAnchor]',
                    host: {
                        '[class.clr-anchor]': 'true',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i1.ClrPopoverEventsService }, { type: i0.ElementRef }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1hbmNob3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy91dGlscy9wb3BvdmVyL3BvcG92ZXItYW5jaG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBYyxNQUFNLGVBQWUsQ0FBQzs7O0FBVXRELE1BQU0sT0FBTyxnQkFBZ0I7SUFDM0IsWUFBWSxpQkFBMEMsRUFBRSxPQUFzQztRQUM1RixpQkFBaUIsQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDO0lBQzlDLENBQUM7OzZHQUhVLGdCQUFnQjtpR0FBaEIsZ0JBQWdCOzJGQUFoQixnQkFBZ0I7a0JBTjVCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtvQkFDOUIsSUFBSSxFQUFFO3dCQUNKLG9CQUFvQixFQUFFLE1BQU07cUJBQzdCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2xyUG9wb3ZlckV2ZW50c1NlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9wb3BvdmVyLWV2ZW50cy5zZXJ2aWNlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsclBvcG92ZXJBbmNob3JdJyxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuY2xyLWFuY2hvcl0nOiAndHJ1ZScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsclBvcG92ZXJBbmNob3Ige1xuICBjb25zdHJ1Y3RvcihzbWFydEV2ZW50U2VydmljZTogQ2xyUG9wb3ZlckV2ZW50c1NlcnZpY2UsIGVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEJ1dHRvbkVsZW1lbnQ+KSB7XG4gICAgc21hcnRFdmVudFNlcnZpY2UuYW5jaG9yQnV0dG9uUmVmID0gZWxlbWVudDtcbiAgfVxufVxuIl19