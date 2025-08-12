/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
export class OutsideClick {
    constructor(host, renderer, ngZone) {
        this.strict = false;
        this.outsideClick = new EventEmitter(false);
        ngZone.runOutsideAngular(() => {
            this.documentClickListener = renderer.listen('document', 'click', (event) => {
                // Compare the element in the DOM on which the mouse was clicked
                // with the current actionMenu native HTML element.
                if (host.nativeElement === event.target) {
                    return;
                }
                if (!this.strict && host.nativeElement.contains(event.target)) {
                    return;
                }
                // We'll run change detection only if the click event actually happened outside of
                // the host element.
                ngZone.run(() => {
                    this.outsideClick.emit(event);
                });
            });
        });
    }
    ngOnDestroy() {
        this.documentClickListener();
    }
}
OutsideClick.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: OutsideClick, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
OutsideClick.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: OutsideClick, selector: "[clrOutsideClick]", inputs: { strict: ["clrStrict", "strict"] }, outputs: { outsideClick: "clrOutsideClick" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: OutsideClick, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrOutsideClick]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.NgZone }]; }, propDecorators: { strict: [{
                type: Input,
                args: ['clrStrict']
            }], outsideClick: [{
                type: Output,
                args: ['clrOutsideClick']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0c2lkZS1jbGljay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3V0aWxzL291dHNpZGUtY2xpY2svb3V0c2lkZS1jbGljay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFFLEtBQUssRUFBcUIsTUFBTSxFQUFhLE1BQU0sZUFBZSxDQUFDOztBQUtqSCxNQUFNLE9BQU8sWUFBWTtJQU92QixZQUFZLElBQTZCLEVBQUUsUUFBbUIsRUFBRSxNQUFjO1FBTjFELFdBQU0sR0FBRyxLQUFLLENBQUM7UUFFUixpQkFBWSxHQUFHLElBQUksWUFBWSxDQUFNLEtBQUssQ0FBQyxDQUFDO1FBS3JFLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDNUIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxDQUFDLEtBQWlCLEVBQUUsRUFBRTtnQkFDdEYsZ0VBQWdFO2dCQUNoRSxtREFBbUQ7Z0JBQ25ELElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxLQUFLLENBQUMsTUFBTSxFQUFFO29CQUN2QyxPQUFPO2lCQUNSO2dCQUVELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFxQixDQUFDLEVBQUU7b0JBQzVFLE9BQU87aUJBQ1I7Z0JBRUQsa0ZBQWtGO2dCQUNsRixvQkFBb0I7Z0JBQ3BCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFO29CQUNkLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNoQyxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQy9CLENBQUM7O3lHQS9CVSxZQUFZOzZGQUFaLFlBQVk7MkZBQVosWUFBWTtrQkFIeEIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsbUJBQW1CO2lCQUM5Qjs4SUFFcUIsTUFBTTtzQkFBekIsS0FBSzt1QkFBQyxXQUFXO2dCQUVTLFlBQVk7c0JBQXRDLE1BQU07dUJBQUMsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE5nWm9uZSwgT25EZXN0cm95LCBPdXRwdXQsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xyT3V0c2lkZUNsaWNrXScsXG59KVxuZXhwb3J0IGNsYXNzIE91dHNpZGVDbGljayBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgnY2xyU3RyaWN0Jykgc3RyaWN0ID0gZmFsc2U7XG5cbiAgQE91dHB1dCgnY2xyT3V0c2lkZUNsaWNrJykgb3V0c2lkZUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KGZhbHNlKTtcblxuICBwcml2YXRlIGRvY3VtZW50Q2xpY2tMaXN0ZW5lcjogVm9pZEZ1bmN0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKGhvc3Q6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCByZW5kZXJlcjogUmVuZGVyZXIyLCBuZ1pvbmU6IE5nWm9uZSkge1xuICAgIG5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IHJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAnY2xpY2snLCAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgLy8gQ29tcGFyZSB0aGUgZWxlbWVudCBpbiB0aGUgRE9NIG9uIHdoaWNoIHRoZSBtb3VzZSB3YXMgY2xpY2tlZFxuICAgICAgICAvLyB3aXRoIHRoZSBjdXJyZW50IGFjdGlvbk1lbnUgbmF0aXZlIEhUTUwgZWxlbWVudC5cbiAgICAgICAgaWYgKGhvc3QubmF0aXZlRWxlbWVudCA9PT0gZXZlbnQudGFyZ2V0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnN0cmljdCAmJiBob3N0Lm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdlJ2xsIHJ1biBjaGFuZ2UgZGV0ZWN0aW9uIG9ubHkgaWYgdGhlIGNsaWNrIGV2ZW50IGFjdHVhbGx5IGhhcHBlbmVkIG91dHNpZGUgb2ZcbiAgICAgICAgLy8gdGhlIGhvc3QgZWxlbWVudC5cbiAgICAgICAgbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5vdXRzaWRlQ2xpY2suZW1pdChldmVudCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICB9XG59XG4iXX0=