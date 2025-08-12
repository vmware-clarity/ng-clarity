/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Optional, Self } from '@angular/core';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrRangeContainer } from './range-container';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
export class ClrRange extends WrappedFormControl {
    constructor(vcr, injector, control, renderer, el) {
        super(vcr, ClrRangeContainer, injector, control, renderer, el);
    }
}
ClrRange.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRange, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrRange.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrRange, selector: "[clrRange]", host: { properties: { "class.clr-range": "true" } }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRange, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrRange]',
                    host: { '[class.clr-range]': 'true' },
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9yYW5nZS9yYW5nZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQXdCLFFBQVEsRUFBYSxJQUFJLEVBQW9CLE1BQU0sZUFBZSxDQUFDO0FBRzdHLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDOzs7QUFNdEQsTUFBTSxPQUFPLFFBQVMsU0FBUSxrQkFBcUM7SUFDakUsWUFDRSxHQUFxQixFQUNyQixRQUFrQixFQUdsQixPQUFrQixFQUNsQixRQUFtQixFQUNuQixFQUFnQztRQUVoQyxLQUFLLENBQUMsR0FBRyxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7O3FHQVhVLFFBQVE7eUZBQVIsUUFBUTsyRkFBUixRQUFRO2tCQUpwQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxZQUFZO29CQUN0QixJQUFJLEVBQUUsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLEVBQUU7aUJBQ3RDOzswQkFLSSxJQUFJOzswQkFDSixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEluamVjdG9yLCBPcHRpb25hbCwgUmVuZGVyZXIyLCBTZWxmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ0NvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IFdyYXBwZWRGb3JtQ29udHJvbCB9IGZyb20gJy4uL2NvbW1vbi93cmFwcGVkLWNvbnRyb2wnO1xuaW1wb3J0IHsgQ2xyUmFuZ2VDb250YWluZXIgfSBmcm9tICcuL3JhbmdlLWNvbnRhaW5lcic7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjbHJSYW5nZV0nLFxuICBob3N0OiB7ICdbY2xhc3MuY2xyLXJhbmdlXSc6ICd0cnVlJyB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJSYW5nZSBleHRlbmRzIFdyYXBwZWRGb3JtQ29udHJvbDxDbHJSYW5nZUNvbnRhaW5lcj4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICB2Y3I6IFZpZXdDb250YWluZXJSZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBTZWxmKClcbiAgICBAT3B0aW9uYWwoKVxuICAgIGNvbnRyb2w6IE5nQ29udHJvbCxcbiAgICByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIGVsOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+XG4gICkge1xuICAgIHN1cGVyKHZjciwgQ2xyUmFuZ2VDb250YWluZXIsIGluamVjdG9yLCBjb250cm9sLCByZW5kZXJlciwgZWwpO1xuICB9XG5cbiAgLy8gTm90ZXM6IFdlIG5lZWQgYW4gb3V0cHV0IGhlcmUgRXZlbnRFbWl0dGVyIGZvciB0aGUgdmFsdWVcbiAgLy8gRG9lcyB0aGlzIGltcGxlbWVudGF0aW9uIGFsc28gbmVlZCBhIGRpc3BsYXkgZm9yIHRoZSB2YWx1ZT9cbn1cbiJdfQ==