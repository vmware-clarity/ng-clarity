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
ClrCheckbox.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrCheckbox, selector: "[clrCheckbox],[clrToggle]", usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrCheckbox, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrCheckbox],[clrToggle]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['clrToggle']
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9jaGVja2JveC9jaGVja2JveC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUF3QixRQUFRLEVBQWEsSUFBSSxFQUFvQixNQUFNLGVBQWUsQ0FBQztBQUl4SCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7OztBQUVuRTs7Ozs7R0FLRztBQUlILE1BQU0sT0FBTyxXQUFZLFNBQVEsa0JBQXNDO0lBQ3JFLFlBQ0UsR0FBcUIsRUFDckIsUUFBa0IsRUFHVixPQUFrQixFQUMxQixRQUFtQixFQUNuQixFQUFnQyxFQUNBLE1BQWM7UUFFOUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUx4RCxZQUFPLEdBQVAsT0FBTyxDQUFXO1FBR00sV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUdoRCxDQUFDO0lBRUQsSUFBSSxlQUFlO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUM7SUFDaEMsQ0FBQztJQUVRLFFBQVE7UUFDZixLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFakIsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUEyQixTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFL0YsSUFBSSxhQUFhLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUU7WUFDekMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxQjtJQUNILENBQUM7O3dHQTFCVSxXQUFXLGtMQVNULFdBQVc7NEZBVGIsV0FBVzsyRkFBWCxXQUFXO2tCQUh2QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSwyQkFBMkI7aUJBQ3RDOzswQkFLSSxJQUFJOzswQkFDSixRQUFROzswQkFJUixTQUFTOzJCQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEF0dHJpYnV0ZSwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3RvciwgT3B0aW9uYWwsIFJlbmRlcmVyMiwgU2VsZiwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IFdyYXBwZWRGb3JtQ29udHJvbCB9IGZyb20gJy4uL2NvbW1vbi93cmFwcGVkLWNvbnRyb2wnO1xuaW1wb3J0IHsgQ2xyQ2hlY2tib3hXcmFwcGVyLCBJU19UT0dHTEUgfSBmcm9tICcuL2NoZWNrYm94LXdyYXBwZXInO1xuXG4vKipcbiAqIFRoaXMgaW1wbGVtZW50cyBib3RoIHRoZSBjbHJDaGVja2JveCBhbmQgY2xyVG9nZ2xlIGZ1bmN0aW9uYWxpdHksIHNpbmNlIHRoZXkgYXJlIGJvdGgganVzdCBjaGVja2JveGVzIHdpdGggZGlmZmVyZW50XG4gKiB2aXN1YWwgc3R5bGluZy4gVGhlIGNoYWxsZW5nZSBpcyB0aGF0IHRoZSBjb250YWluZXIgbmVlZHMgdG8ga25vdyB3aGljaCBzZWxlY3RvciB3YXMgdXNlZCwgd2hpY2ggdGhlIEBBdHRyaWJ1dGVcbiAqIGRlY29yYXRvciBnZXRzIGZvciB1cyB0byBkZXRlcm1pbmUgaWYgdGhlIHRvZ2dsZSBpcyB1c2VkLCBhbmQgZW1pdHMgYSB2YWx1ZSB0byB0aGUgd3JhcHBlciBjb250YWluZXIgdG8gdGVsbCBpdFxuICogdGhlcmUgaXMgYSB0b2dnbGUgc3dpdGNoIGluc3RlYWQuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjbHJDaGVja2JveF0sW2NsclRvZ2dsZV0nLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJDaGVja2JveCBleHRlbmRzIFdyYXBwZWRGb3JtQ29udHJvbDxDbHJDaGVja2JveFdyYXBwZXI+IHtcbiAgY29uc3RydWN0b3IoXG4gICAgdmNyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBAU2VsZigpXG4gICAgQE9wdGlvbmFsKClcbiAgICBwcml2YXRlIGNvbnRyb2w6IE5nQ29udHJvbCxcbiAgICByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIGVsOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgIEBBdHRyaWJ1dGUoJ2NsclRvZ2dsZScpIHByaXZhdGUgdG9nZ2xlOiBzdHJpbmdcbiAgKSB7XG4gICAgc3VwZXIodmNyLCBDbHJDaGVja2JveFdyYXBwZXIsIGluamVjdG9yLCBjb250cm9sLCByZW5kZXJlciwgZWwpO1xuICB9XG5cbiAgZ2V0IGNvbnRyb2xEaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9sPy5kaXNhYmxlZDtcbiAgfVxuXG4gIG92ZXJyaWRlIG5nT25Jbml0KCkge1xuICAgIHN1cGVyLm5nT25Jbml0KCk7XG5cbiAgICBjb25zdCB0b2dnbGVTZXJ2aWNlID0gdGhpcy5nZXRQcm92aWRlckZyb21Db250YWluZXI8QmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+PihJU19UT0dHTEUsIG51bGwpO1xuXG4gICAgaWYgKHRvZ2dsZVNlcnZpY2UgJiYgdGhpcy50b2dnbGUgIT09IG51bGwpIHtcbiAgICAgIHRvZ2dsZVNlcnZpY2UubmV4dCh0cnVlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==