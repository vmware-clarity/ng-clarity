/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, HostListener, Optional, Self, } from '@angular/core';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrNumberInputContainer } from './number-input-container';
import * as i0 from "@angular/core";
import * as i1 from "../common/providers/focus.service";
import * as i2 from "@angular/forms";
export class ClrNumberInput extends WrappedFormControl {
    constructor(focusService, vcr, injector, control, renderer, el) {
        super(vcr, ClrNumberInputContainer, injector, control, renderer, el);
        this.focusService = focusService;
        this.control = control;
        this.el = el;
        this.index = 1;
        if (!focusService) {
            throw new Error('clrNumberInput requires being wrapped in <clr-number-input-container>');
        }
    }
    get readonly() {
        return this.el.nativeElement.getAttribute('readonly') !== null;
    }
    triggerFocus() {
        if (!this.readonly && this.focusService) {
            this.focusService.focused = true;
        }
    }
    triggerValidation() {
        if (!this.readonly) {
            super.triggerValidation();
            if (this.focusService) {
                this.focusService.focused = false;
            }
        }
    }
    stepUp() {
        this.el.nativeElement.stepUp();
        this.dispatchStepChangeEvents();
        this.control.control.markAllAsTouched();
    }
    stepDown() {
        this.el.nativeElement.stepDown();
        this.dispatchStepChangeEvents();
        this.control.control.markAllAsTouched();
    }
    dispatchBlur() {
        this.el.nativeElement.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));
    }
    dispatchStepChangeEvents() {
        this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        this.el.nativeElement.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
    }
}
ClrNumberInput.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrNumberInput, deps: [{ token: i1.FocusService, optional: true }, { token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i2.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ClrNumberInput.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrNumberInput, selector: "input[type=\"number\"][clrNumberInput]", host: { listeners: { "focus": "triggerFocus()", "blur": "triggerValidation()" }, properties: { "class.clr-input": "true", "class.clr-number-input": "true" } }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrNumberInput, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type="number"][clrNumberInput]',
                    host: { '[class.clr-input]': 'true', '[class.clr-number-input]': 'true' },
                }]
        }], ctorParameters: function () { return [{ type: i1.FocusService, decorators: [{
                    type: Optional
                }] }, { type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i2.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }]; }, propDecorators: { triggerFocus: [{
                type: HostListener,
                args: ['focus']
            }], triggerValidation: [{
                type: HostListener,
                args: ['blur']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyLWlucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvbnVtYmVyLWlucHV0L251bWJlci1pbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBRVQsWUFBWSxFQUVaLFFBQVEsRUFFUixJQUFJLEdBRUwsTUFBTSxlQUFlLENBQUM7QUFJdkIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDL0QsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sMEJBQTBCLENBQUM7Ozs7QUFNbkUsTUFBTSxPQUFPLGNBQWUsU0FBUSxrQkFBMkM7SUFHN0UsWUFDc0IsWUFBMEIsRUFDOUMsR0FBcUIsRUFDckIsUUFBa0IsRUFHVixPQUFrQixFQUMxQixRQUFtQixFQUNBLEVBQWdDO1FBRW5ELEtBQUssQ0FBQyxHQUFHLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFUakQsaUJBQVksR0FBWixZQUFZLENBQWM7UUFLdEMsWUFBTyxHQUFQLE9BQU8sQ0FBVztRQUVQLE9BQUUsR0FBRixFQUFFLENBQThCO1FBVmxDLFVBQUssR0FBRyxDQUFDLENBQUM7UUFjM0IsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLHVFQUF1RSxDQUFDLENBQUM7U0FDMUY7SUFDSCxDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEtBQUssSUFBSSxDQUFDO0lBQ2pFLENBQUM7SUFHRCxZQUFZO1FBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN2QyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDbEM7SUFDSCxDQUFDO0lBR1EsaUJBQWlCO1FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xCLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQzFCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDckIsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO2FBQ25DO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDMUMsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFFRCxZQUFZO1FBQ1YsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRU8sd0JBQXdCO1FBQzlCLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0YsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNoRyxDQUFDOzsyR0E1RFUsY0FBYzsrRkFBZCxjQUFjOzJGQUFkLGNBQWM7a0JBSjFCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHNDQUFzQztvQkFDaEQsSUFBSSxFQUFFLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxFQUFFLDBCQUEwQixFQUFFLE1BQU0sRUFBRTtpQkFDMUU7OzBCQUtJLFFBQVE7OzBCQUdSLElBQUk7OzBCQUNKLFFBQVE7NkZBaUJYLFlBQVk7c0JBRFgsWUFBWTt1QkFBQyxPQUFPO2dCQVFaLGlCQUFpQjtzQkFEekIsWUFBWTt1QkFBQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5qZWN0b3IsXG4gIE9wdGlvbmFsLFxuICBSZW5kZXJlcjIsXG4gIFNlbGYsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBGb2N1c1NlcnZpY2UgfSBmcm9tICcuLi9jb21tb24vcHJvdmlkZXJzL2ZvY3VzLnNlcnZpY2UnO1xuaW1wb3J0IHsgV3JhcHBlZEZvcm1Db250cm9sIH0gZnJvbSAnLi4vY29tbW9uL3dyYXBwZWQtY29udHJvbCc7XG5pbXBvcnQgeyBDbHJOdW1iZXJJbnB1dENvbnRhaW5lciB9IGZyb20gJy4vbnVtYmVyLWlucHV0LWNvbnRhaW5lcic7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W3R5cGU9XCJudW1iZXJcIl1bY2xyTnVtYmVySW5wdXRdJyxcbiAgaG9zdDogeyAnW2NsYXNzLmNsci1pbnB1dF0nOiAndHJ1ZScsICdbY2xhc3MuY2xyLW51bWJlci1pbnB1dF0nOiAndHJ1ZScgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyTnVtYmVySW5wdXQgZXh0ZW5kcyBXcmFwcGVkRm9ybUNvbnRyb2w8Q2xyTnVtYmVySW5wdXRDb250YWluZXI+IHtcbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGluZGV4ID0gMTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGZvY3VzU2VydmljZTogRm9jdXNTZXJ2aWNlLFxuICAgIHZjcjogVmlld0NvbnRhaW5lclJlZixcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQFNlbGYoKVxuICAgIEBPcHRpb25hbCgpXG4gICAgcHJpdmF0ZSBjb250cm9sOiBOZ0NvbnRyb2wsXG4gICAgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcm90ZWN0ZWQgb3ZlcnJpZGUgZWw6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD5cbiAgKSB7XG4gICAgc3VwZXIodmNyLCBDbHJOdW1iZXJJbnB1dENvbnRhaW5lciwgaW5qZWN0b3IsIGNvbnRyb2wsIHJlbmRlcmVyLCBlbCk7XG5cbiAgICBpZiAoIWZvY3VzU2VydmljZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjbHJOdW1iZXJJbnB1dCByZXF1aXJlcyBiZWluZyB3cmFwcGVkIGluIDxjbHItbnVtYmVyLWlucHV0LWNvbnRhaW5lcj4nKTtcbiAgICB9XG4gIH1cblxuICBnZXQgcmVhZG9ubHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWwubmF0aXZlRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3JlYWRvbmx5JykgIT09IG51bGw7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdmb2N1cycpXG4gIHRyaWdnZXJGb2N1cygpIHtcbiAgICBpZiAoIXRoaXMucmVhZG9ubHkgJiYgdGhpcy5mb2N1c1NlcnZpY2UpIHtcbiAgICAgIHRoaXMuZm9jdXNTZXJ2aWNlLmZvY3VzZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2JsdXInKVxuICBvdmVycmlkZSB0cmlnZ2VyVmFsaWRhdGlvbigpIHtcbiAgICBpZiAoIXRoaXMucmVhZG9ubHkpIHtcbiAgICAgIHN1cGVyLnRyaWdnZXJWYWxpZGF0aW9uKCk7XG4gICAgICBpZiAodGhpcy5mb2N1c1NlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5mb2N1c1NlcnZpY2UuZm9jdXNlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0ZXBVcCgpOiB2b2lkIHtcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3RlcFVwKCk7XG4gICAgdGhpcy5kaXNwYXRjaFN0ZXBDaGFuZ2VFdmVudHMoKTtcbiAgICB0aGlzLmNvbnRyb2wuY29udHJvbC5tYXJrQWxsQXNUb3VjaGVkKCk7XG4gIH1cblxuICBzdGVwRG93bigpOiB2b2lkIHtcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3RlcERvd24oKTtcbiAgICB0aGlzLmRpc3BhdGNoU3RlcENoYW5nZUV2ZW50cygpO1xuICAgIHRoaXMuY29udHJvbC5jb250cm9sLm1hcmtBbGxBc1RvdWNoZWQoKTtcbiAgfVxuXG4gIGRpc3BhdGNoQmx1cigpIHtcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2JsdXInLCB7IGJ1YmJsZXM6IHRydWUsIGNhbmNlbGFibGU6IHRydWUgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFN0ZXBDaGFuZ2VFdmVudHMoKSB7XG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcsIHsgYnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogdHJ1ZSB9KSk7XG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnLCB7IGJ1YmJsZXM6IHRydWUsIGNhbmNlbGFibGU6IHRydWUgfSkpO1xuICB9XG59XG4iXX0=