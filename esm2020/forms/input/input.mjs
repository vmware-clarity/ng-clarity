/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Optional, Self } from '@angular/core';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrInputContainer } from './input-container';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
export class ClrInput extends WrappedFormControl {
    constructor(vcr, injector, control, renderer, el) {
        super(vcr, ClrInputContainer, injector, control, renderer, el);
        this.index = 1;
        if (this.el.nativeElement.getAttribute('type') === 'number') {
            console.warn(`Warning: Inputs of type "number" should utilize the number-input component for proper handling.\n
  Example usage:
  <clr-number-input-container>
    <label>Number Input</label>
    <input clrNumberInput type="number"/>
  </clr-number-input-container>
      `);
        }
    }
}
ClrInput.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrInput, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrInput.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrInput, selector: "[clrInput]", host: { properties: { "class.clr-input": "true" } }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrInput, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrInput]',
                    host: { '[class.clr-input]': 'true' },
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9pbnB1dC9pbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQXdCLFFBQVEsRUFBYSxJQUFJLEVBQW9CLE1BQU0sZUFBZSxDQUFDO0FBRzdHLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDOzs7QUFNdEQsTUFBTSxPQUFPLFFBQVMsU0FBUSxrQkFBcUM7SUFHakUsWUFDRSxHQUFxQixFQUNyQixRQUFrQixFQUdsQixPQUFrQixFQUNsQixRQUFtQixFQUNuQixFQUFnQztRQUVoQyxLQUFLLENBQUMsR0FBRyxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBWDlDLFVBQUssR0FBRyxDQUFDLENBQUM7UUFZM0IsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQzNELE9BQU8sQ0FBQyxJQUFJLENBQUM7Ozs7OztPQU1aLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQzs7cUdBdEJVLFFBQVE7eUZBQVIsUUFBUTsyRkFBUixRQUFRO2tCQUpwQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxZQUFZO29CQUN0QixJQUFJLEVBQUUsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLEVBQUU7aUJBQ3RDOzswQkFPSSxJQUFJOzswQkFDSixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEluamVjdG9yLCBPcHRpb25hbCwgUmVuZGVyZXIyLCBTZWxmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ0NvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IFdyYXBwZWRGb3JtQ29udHJvbCB9IGZyb20gJy4uL2NvbW1vbi93cmFwcGVkLWNvbnRyb2wnO1xuaW1wb3J0IHsgQ2xySW5wdXRDb250YWluZXIgfSBmcm9tICcuL2lucHV0LWNvbnRhaW5lcic7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjbHJJbnB1dF0nLFxuICBob3N0OiB7ICdbY2xhc3MuY2xyLWlucHV0XSc6ICd0cnVlJyB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJJbnB1dCBleHRlbmRzIFdyYXBwZWRGb3JtQ29udHJvbDxDbHJJbnB1dENvbnRhaW5lcj4ge1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgaW5kZXggPSAxO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHZjcjogVmlld0NvbnRhaW5lclJlZixcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQFNlbGYoKVxuICAgIEBPcHRpb25hbCgpXG4gICAgY29udHJvbDogTmdDb250cm9sLFxuICAgIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgZWw6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD5cbiAgKSB7XG4gICAgc3VwZXIodmNyLCBDbHJJbnB1dENvbnRhaW5lciwgaW5qZWN0b3IsIGNvbnRyb2wsIHJlbmRlcmVyLCBlbCk7XG4gICAgaWYgKHRoaXMuZWwubmF0aXZlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGNvbnNvbGUud2FybihgV2FybmluZzogSW5wdXRzIG9mIHR5cGUgXCJudW1iZXJcIiBzaG91bGQgdXRpbGl6ZSB0aGUgbnVtYmVyLWlucHV0IGNvbXBvbmVudCBmb3IgcHJvcGVyIGhhbmRsaW5nLlxcblxuICBFeGFtcGxlIHVzYWdlOlxuICA8Y2xyLW51bWJlci1pbnB1dC1jb250YWluZXI+XG4gICAgPGxhYmVsPk51bWJlciBJbnB1dDwvbGFiZWw+XG4gICAgPGlucHV0IGNsck51bWJlcklucHV0IHR5cGU9XCJudW1iZXJcIi8+XG4gIDwvY2xyLW51bWJlci1pbnB1dC1jb250YWluZXI+XG4gICAgICBgKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==