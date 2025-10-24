/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Attribute, Directive, Optional, Self } from '@angular/core';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrCheckboxWrapper, IS_TOGGLE } from './checkbox-wrapper';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
/**
 * This implements both the clrCheckbox and clrToggle functionality, since they are both just checkboxes with different
 * visual styling. The challenge is that the container needs to know which selector was used, which the @Attribute
 * decorator gets for us to determine if the toggle is used, and emits a value to the wrapper container to tell it
 * there is a toggle switch instead.
 */
export class ClrCheckbox extends WrappedFormControl {
    constructor(vcr, injector, control, renderer, el, toggle) {
        super(vcr, ClrCheckboxWrapper, injector, control, renderer, el);
        this.control = control;
        this.toggle = toggle;
    }
    get controlDisabled() {
        return this.control?.disabled;
    }
    ngOnInit() {
        super.ngOnInit();
        const toggleService = this.getProviderFromContainer(IS_TOGGLE, null);
        if (toggleService && this.toggle !== null) {
            toggleService.next(true);
        }
    }
}
ClrCheckbox.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCheckbox, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: 'clrToggle', attribute: true }], target: i0.ɵɵFactoryTarget.Directive });
ClrCheckbox.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrCheckbox, selector: "[clrCheckbox],[clrToggle]", host: { properties: { "attr.role": "toggle !== null ? \"switch\" : null" } }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCheckbox, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrCheckbox],[clrToggle]',
                    host: {
                        '[attr.role]': 'toggle !== null ? "switch" : null',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['clrToggle']
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9jaGVja2JveC9jaGVja2JveC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUF3QixRQUFRLEVBQWEsSUFBSSxFQUFvQixNQUFNLGVBQWUsQ0FBQztBQUl4SCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7OztBQUVuRTs7Ozs7R0FLRztBQU9ILE1BQU0sT0FBTyxXQUFZLFNBQVEsa0JBQXNDO0lBQ3JFLFlBQ0UsR0FBcUIsRUFDckIsUUFBa0IsRUFHVixPQUFrQixFQUMxQixRQUFtQixFQUNuQixFQUFnQyxFQUNBLE1BQWM7UUFFOUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUx4RCxZQUFPLEdBQVAsT0FBTyxDQUFXO1FBR00sV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUdoRCxDQUFDO0lBRUQsSUFBSSxlQUFlO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUM7SUFDaEMsQ0FBQztJQUVRLFFBQVE7UUFDZixLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFakIsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUEyQixTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFL0YsSUFBSSxhQUFhLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUU7WUFDekMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxQjtJQUNILENBQUM7O3dHQTFCVSxXQUFXLGtMQVNULFdBQVc7NEZBVGIsV0FBVzsyRkFBWCxXQUFXO2tCQU52QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSwyQkFBMkI7b0JBQ3JDLElBQUksRUFBRTt3QkFDSixhQUFhLEVBQUUsbUNBQW1DO3FCQUNuRDtpQkFDRjs7MEJBS0ksSUFBSTs7MEJBQ0osUUFBUTs7MEJBSVIsU0FBUzsyQkFBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBBdHRyaWJ1dGUsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0b3IsIE9wdGlvbmFsLCBSZW5kZXJlcjIsIFNlbGYsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBXcmFwcGVkRm9ybUNvbnRyb2wgfSBmcm9tICcuLi9jb21tb24vd3JhcHBlZC1jb250cm9sJztcbmltcG9ydCB7IENsckNoZWNrYm94V3JhcHBlciwgSVNfVE9HR0xFIH0gZnJvbSAnLi9jaGVja2JveC13cmFwcGVyJztcblxuLyoqXG4gKiBUaGlzIGltcGxlbWVudHMgYm90aCB0aGUgY2xyQ2hlY2tib3ggYW5kIGNsclRvZ2dsZSBmdW5jdGlvbmFsaXR5LCBzaW5jZSB0aGV5IGFyZSBib3RoIGp1c3QgY2hlY2tib3hlcyB3aXRoIGRpZmZlcmVudFxuICogdmlzdWFsIHN0eWxpbmcuIFRoZSBjaGFsbGVuZ2UgaXMgdGhhdCB0aGUgY29udGFpbmVyIG5lZWRzIHRvIGtub3cgd2hpY2ggc2VsZWN0b3Igd2FzIHVzZWQsIHdoaWNoIHRoZSBAQXR0cmlidXRlXG4gKiBkZWNvcmF0b3IgZ2V0cyBmb3IgdXMgdG8gZGV0ZXJtaW5lIGlmIHRoZSB0b2dnbGUgaXMgdXNlZCwgYW5kIGVtaXRzIGEgdmFsdWUgdG8gdGhlIHdyYXBwZXIgY29udGFpbmVyIHRvIHRlbGwgaXRcbiAqIHRoZXJlIGlzIGEgdG9nZ2xlIHN3aXRjaCBpbnN0ZWFkLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xyQ2hlY2tib3hdLFtjbHJUb2dnbGVdJyxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5yb2xlXSc6ICd0b2dnbGUgIT09IG51bGwgPyBcInN3aXRjaFwiIDogbnVsbCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsckNoZWNrYm94IGV4dGVuZHMgV3JhcHBlZEZvcm1Db250cm9sPENsckNoZWNrYm94V3JhcHBlcj4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICB2Y3I6IFZpZXdDb250YWluZXJSZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBTZWxmKClcbiAgICBAT3B0aW9uYWwoKVxuICAgIHByaXZhdGUgY29udHJvbDogTmdDb250cm9sLFxuICAgIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgZWw6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgQEF0dHJpYnV0ZSgnY2xyVG9nZ2xlJykgcHJpdmF0ZSB0b2dnbGU6IHN0cmluZ1xuICApIHtcbiAgICBzdXBlcih2Y3IsIENsckNoZWNrYm94V3JhcHBlciwgaW5qZWN0b3IsIGNvbnRyb2wsIHJlbmRlcmVyLCBlbCk7XG4gIH1cblxuICBnZXQgY29udHJvbERpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2w/LmRpc2FibGVkO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkluaXQoKSB7XG4gICAgc3VwZXIubmdPbkluaXQoKTtcblxuICAgIGNvbnN0IHRvZ2dsZVNlcnZpY2UgPSB0aGlzLmdldFByb3ZpZGVyRnJvbUNvbnRhaW5lcjxCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4+KElTX1RPR0dMRSwgbnVsbCk7XG5cbiAgICBpZiAodG9nZ2xlU2VydmljZSAmJiB0aGlzLnRvZ2dsZSAhPT0gbnVsbCkge1xuICAgICAgdG9nZ2xlU2VydmljZS5uZXh0KHRydWUpO1xuICAgIH1cbiAgfVxufVxuIl19