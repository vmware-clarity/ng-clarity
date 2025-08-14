/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Optional, Self } from '@angular/core';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrRadioWrapper } from '../radio/radio-wrapper';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
export class ClrRadio extends WrappedFormControl {
    constructor(vcr, injector, control, renderer, el) {
        super(vcr, ClrRadioWrapper, injector, control, renderer, el);
    }
}
ClrRadio.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRadio, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrRadio.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrRadio, selector: "[clrRadio]", usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrRadio, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrRadio]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9yYWRpby9yYWRpby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQXdCLFFBQVEsRUFBYSxJQUFJLEVBQW9CLE1BQU0sZUFBZSxDQUFDO0FBRzdHLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7O0FBS3pELE1BQU0sT0FBTyxRQUFTLFNBQVEsa0JBQW1DO0lBQy9ELFlBQ0UsR0FBcUIsRUFDckIsUUFBa0IsRUFHbEIsT0FBa0IsRUFDbEIsUUFBbUIsRUFDbkIsRUFBZ0M7UUFFaEMsS0FBSyxDQUFDLEdBQUcsRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDL0QsQ0FBQzs7cUdBWFUsUUFBUTt5RkFBUixRQUFROzJGQUFSLFFBQVE7a0JBSHBCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLFlBQVk7aUJBQ3ZCOzswQkFLSSxJQUFJOzswQkFDSixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEluamVjdG9yLCBPcHRpb25hbCwgUmVuZGVyZXIyLCBTZWxmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ0NvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IFdyYXBwZWRGb3JtQ29udHJvbCB9IGZyb20gJy4uL2NvbW1vbi93cmFwcGVkLWNvbnRyb2wnO1xuaW1wb3J0IHsgQ2xyUmFkaW9XcmFwcGVyIH0gZnJvbSAnLi4vcmFkaW8vcmFkaW8td3JhcHBlcic7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjbHJSYWRpb10nLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJSYWRpbyBleHRlbmRzIFdyYXBwZWRGb3JtQ29udHJvbDxDbHJSYWRpb1dyYXBwZXI+IHtcbiAgY29uc3RydWN0b3IoXG4gICAgdmNyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBAU2VsZigpXG4gICAgQE9wdGlvbmFsKClcbiAgICBjb250cm9sOiBOZ0NvbnRyb2wsXG4gICAgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBlbDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PlxuICApIHtcbiAgICBzdXBlcih2Y3IsIENsclJhZGlvV3JhcHBlciwgaW5qZWN0b3IsIGNvbnRyb2wsIHJlbmRlcmVyLCBlbCk7XG4gIH1cbn1cbiJdfQ==