/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Optional, Self } from '@angular/core';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrSelectContainer } from './select-container';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
export class ClrSelect extends WrappedFormControl {
    constructor(vcr, injector, control, renderer, el) {
        super(vcr, ClrSelectContainer, injector, control, renderer, el);
        this.index = 1;
    }
}
ClrSelect.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSelect, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrSelect.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrSelect, selector: "[clrSelect]", host: { properties: { "class.clr-select": "true" } }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrSelect, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrSelect]',
                    host: { '[class.clr-select]': 'true' },
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvc2VsZWN0L3NlbGVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQXdCLFFBQVEsRUFBYSxJQUFJLEVBQW9CLE1BQU0sZUFBZSxDQUFDO0FBRzdHLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDOzs7QUFNeEQsTUFBTSxPQUFPLFNBQVUsU0FBUSxrQkFBc0M7SUFHbkUsWUFDRSxHQUFxQixFQUNyQixRQUFrQixFQUdsQixPQUFrQixFQUNsQixRQUFtQixFQUNuQixFQUFpQztRQUVqQyxLQUFLLENBQUMsR0FBRyxFQUFFLGtCQUFrQixFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBWC9DLFVBQUssR0FBRyxDQUFDLENBQUM7SUFZN0IsQ0FBQzs7c0dBYlUsU0FBUzswRkFBVCxTQUFTOzJGQUFULFNBQVM7a0JBSnJCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLElBQUksRUFBRSxFQUFFLG9CQUFvQixFQUFFLE1BQU0sRUFBRTtpQkFDdkM7OzBCQU9JLElBQUk7OzBCQUNKLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0b3IsIE9wdGlvbmFsLCBSZW5kZXJlcjIsIFNlbGYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgV3JhcHBlZEZvcm1Db250cm9sIH0gZnJvbSAnLi4vY29tbW9uL3dyYXBwZWQtY29udHJvbCc7XG5pbXBvcnQgeyBDbHJTZWxlY3RDb250YWluZXIgfSBmcm9tICcuL3NlbGVjdC1jb250YWluZXInO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xyU2VsZWN0XScsXG4gIGhvc3Q6IHsgJ1tjbGFzcy5jbHItc2VsZWN0XSc6ICd0cnVlJyB9LFxufSlcbmV4cG9ydCBjbGFzcyBDbHJTZWxlY3QgZXh0ZW5kcyBXcmFwcGVkRm9ybUNvbnRyb2w8Q2xyU2VsZWN0Q29udGFpbmVyPiB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBpbmRleCA9IDE7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgdmNyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBAU2VsZigpXG4gICAgQE9wdGlvbmFsKClcbiAgICBjb250cm9sOiBOZ0NvbnRyb2wsXG4gICAgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBlbDogRWxlbWVudFJlZjxIVE1MU2VsZWN0RWxlbWVudD5cbiAgKSB7XG4gICAgc3VwZXIodmNyLCBDbHJTZWxlY3RDb250YWluZXIsIGluamVjdG9yLCBjb250cm9sLCByZW5kZXJlciwgZWwpO1xuICB9XG59XG4iXX0=