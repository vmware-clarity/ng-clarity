/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, Optional, Self } from '@angular/core';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrTextareaContainer } from './textarea-container';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
export class ClrTextarea extends WrappedFormControl {
    constructor(vcr, injector, control, renderer, el) {
        super(vcr, ClrTextareaContainer, injector, control, renderer, el);
        this.index = 1;
    }
}
ClrTextarea.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTextarea, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrTextarea.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrTextarea, selector: "[clrTextarea]", host: { properties: { "class.clr-textarea": "true" } }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrTextarea, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrTextarea]',
                    host: { '[class.clr-textarea]': 'true' },
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dGFyZWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy90ZXh0YXJlYS90ZXh0YXJlYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQXdCLFFBQVEsRUFBYSxJQUFJLEVBQW9CLE1BQU0sZUFBZSxDQUFDO0FBRzdHLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDOzs7QUFNNUQsTUFBTSxPQUFPLFdBQVksU0FBUSxrQkFBd0M7SUFHdkUsWUFDRSxHQUFxQixFQUNyQixRQUFrQixFQUdsQixPQUFrQixFQUNsQixRQUFtQixFQUNuQixFQUFtQztRQUVuQyxLQUFLLENBQUMsR0FBRyxFQUFFLG9CQUFvQixFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBWGpELFVBQUssR0FBRyxDQUFDLENBQUM7SUFZN0IsQ0FBQzs7d0dBYlUsV0FBVzs0RkFBWCxXQUFXOzJGQUFYLFdBQVc7a0JBSnZCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGVBQWU7b0JBQ3pCLElBQUksRUFBRSxFQUFFLHNCQUFzQixFQUFFLE1BQU0sRUFBRTtpQkFDekM7OzBCQU9JLElBQUk7OzBCQUNKLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0b3IsIE9wdGlvbmFsLCBSZW5kZXJlcjIsIFNlbGYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgV3JhcHBlZEZvcm1Db250cm9sIH0gZnJvbSAnLi4vY29tbW9uL3dyYXBwZWQtY29udHJvbCc7XG5pbXBvcnQgeyBDbHJUZXh0YXJlYUNvbnRhaW5lciB9IGZyb20gJy4vdGV4dGFyZWEtY29udGFpbmVyJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsclRleHRhcmVhXScsXG4gIGhvc3Q6IHsgJ1tjbGFzcy5jbHItdGV4dGFyZWFdJzogJ3RydWUnIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsclRleHRhcmVhIGV4dGVuZHMgV3JhcHBlZEZvcm1Db250cm9sPENsclRleHRhcmVhQ29udGFpbmVyPiB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBpbmRleCA9IDE7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgdmNyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBAU2VsZigpXG4gICAgQE9wdGlvbmFsKClcbiAgICBjb250cm9sOiBOZ0NvbnRyb2wsXG4gICAgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBlbDogRWxlbWVudFJlZjxIVE1MVGV4dEFyZWFFbGVtZW50PlxuICApIHtcbiAgICBzdXBlcih2Y3IsIENsclRleHRhcmVhQ29udGFpbmVyLCBpbmplY3RvciwgY29udHJvbCwgcmVuZGVyZXIsIGVsKTtcbiAgfVxufVxuIl19