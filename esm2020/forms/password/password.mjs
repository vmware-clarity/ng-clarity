/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, HostListener, Inject, Optional, Self, } from '@angular/core';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrPasswordContainer, TOGGLE_SERVICE } from './password-container';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../common/providers/focus.service";
import * as i3 from "rxjs";
export class ClrPassword extends WrappedFormControl {
    constructor(vcr, injector, control, renderer, el, focusService, toggleService) {
        super(vcr, ClrPasswordContainer, injector, control, renderer, el);
        this.focusService = focusService;
        this.index = 1;
        if (!focusService) {
            throw new Error('clrPassword requires being wrapped in <clr-password-container>');
        }
        this.subscriptions.push(toggleService.subscribe(toggle => {
            renderer.setProperty(el.nativeElement, 'type', toggle ? 'text' : 'password');
        }));
    }
    triggerFocus() {
        if (this.focusService) {
            this.focusService.focused = true;
        }
    }
    triggerValidation() {
        super.triggerValidation();
        if (this.focusService) {
            this.focusService.focused = false;
        }
    }
}
ClrPassword.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPassword, deps: [{ token: i0.ViewContainerRef }, { token: i0.Injector }, { token: i1.NgControl, optional: true, self: true }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i2.FocusService, optional: true }, { token: TOGGLE_SERVICE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
ClrPassword.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrPassword, selector: "[clrPassword]", host: { listeners: { "focus": "triggerFocus()", "blur": "triggerValidation()" }, properties: { "class.clr-input": "true" } }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPassword, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrPassword]',
                    host: { '[class.clr-input]': 'true' },
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }, { type: i0.Injector }, { type: i1.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i2.FocusService, decorators: [{
                    type: Optional
                }] }, { type: i3.BehaviorSubject, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [TOGGLE_SERVICE]
                }] }]; }, propDecorators: { triggerFocus: [{
                type: HostListener,
                args: ['focus']
            }], triggerValidation: [{
                type: HostListener,
                args: ['blur']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc3dvcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9mb3Jtcy9wYXNzd29yZC9wYXNzd29yZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBRVQsWUFBWSxFQUNaLE1BQU0sRUFJTixRQUFRLEVBRVIsSUFBSSxHQUVMLE1BQU0sZUFBZSxDQUFDO0FBS3ZCLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxjQUFjLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7Ozs7QUFNNUUsTUFBTSxPQUFPLFdBQVksU0FBUSxrQkFBd0M7SUFHdkUsWUFDRSxHQUFxQixFQUNyQixRQUFrQixFQUdsQixPQUFrQixFQUNsQixRQUFtQixFQUNuQixFQUFnQyxFQUNaLFlBQTBCLEVBRzlDLGFBQXVDO1FBRXZDLEtBQUssQ0FBQyxHQUFHLEVBQUUsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFMOUMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFWN0IsVUFBSyxHQUFHLENBQUMsQ0FBQztRQWlCM0IsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLGdFQUFnRSxDQUFDLENBQUM7U0FDbkY7UUFFRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDckIsYUFBYSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUMvQixRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvRSxDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUdELFlBQVk7UUFDVixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQztJQUdRLGlCQUFpQjtRQUN4QixLQUFLLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUMxQixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQzs7d0dBMUNVLFdBQVcsOE5BYVosY0FBYzs0RkFiYixXQUFXOzJGQUFYLFdBQVc7a0JBSnZCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGVBQWU7b0JBQ3pCLElBQUksRUFBRSxFQUFFLG1CQUFtQixFQUFFLE1BQU0sRUFBRTtpQkFDdEM7OzBCQU9JLElBQUk7OzBCQUNKLFFBQVE7OzBCQUlSLFFBQVE7OzBCQUNSLFFBQVE7OzBCQUNSLE1BQU07MkJBQUMsY0FBYzs0Q0FpQnhCLFlBQVk7c0JBRFgsWUFBWTt1QkFBQyxPQUFPO2dCQVFaLGlCQUFpQjtzQkFEekIsWUFBWTt1QkFBQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBSZW5kZXJlcjIsXG4gIFNlbGYsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmdDb250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEZvY3VzU2VydmljZSB9IGZyb20gJy4uL2NvbW1vbi9wcm92aWRlcnMvZm9jdXMuc2VydmljZSc7XG5pbXBvcnQgeyBXcmFwcGVkRm9ybUNvbnRyb2wgfSBmcm9tICcuLi9jb21tb24vd3JhcHBlZC1jb250cm9sJztcbmltcG9ydCB7IENsclBhc3N3b3JkQ29udGFpbmVyLCBUT0dHTEVfU0VSVklDRSB9IGZyb20gJy4vcGFzc3dvcmQtY29udGFpbmVyJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsclBhc3N3b3JkXScsXG4gIGhvc3Q6IHsgJ1tjbGFzcy5jbHItaW5wdXRdJzogJ3RydWUnIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsclBhc3N3b3JkIGV4dGVuZHMgV3JhcHBlZEZvcm1Db250cm9sPENsclBhc3N3b3JkQ29udGFpbmVyPiBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGluZGV4ID0gMTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICB2Y3I6IFZpZXdDb250YWluZXJSZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBTZWxmKClcbiAgICBAT3B0aW9uYWwoKVxuICAgIGNvbnRyb2w6IE5nQ29udHJvbCxcbiAgICByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIGVsOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgZm9jdXNTZXJ2aWNlOiBGb2N1c1NlcnZpY2UsXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KFRPR0dMRV9TRVJWSUNFKVxuICAgIHRvZ2dsZVNlcnZpY2U6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPlxuICApIHtcbiAgICBzdXBlcih2Y3IsIENsclBhc3N3b3JkQ29udGFpbmVyLCBpbmplY3RvciwgY29udHJvbCwgcmVuZGVyZXIsIGVsKTtcblxuICAgIGlmICghZm9jdXNTZXJ2aWNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsclBhc3N3b3JkIHJlcXVpcmVzIGJlaW5nIHdyYXBwZWQgaW4gPGNsci1wYXNzd29yZC1jb250YWluZXI+Jyk7XG4gICAgfVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0b2dnbGVTZXJ2aWNlLnN1YnNjcmliZSh0b2dnbGUgPT4ge1xuICAgICAgICByZW5kZXJlci5zZXRQcm9wZXJ0eShlbC5uYXRpdmVFbGVtZW50LCAndHlwZScsIHRvZ2dsZSA/ICd0ZXh0JyA6ICdwYXNzd29yZCcpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZm9jdXMnKVxuICB0cmlnZ2VyRm9jdXMoKSB7XG4gICAgaWYgKHRoaXMuZm9jdXNTZXJ2aWNlKSB7XG4gICAgICB0aGlzLmZvY3VzU2VydmljZS5mb2N1c2VkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdibHVyJylcbiAgb3ZlcnJpZGUgdHJpZ2dlclZhbGlkYXRpb24oKSB7XG4gICAgc3VwZXIudHJpZ2dlclZhbGlkYXRpb24oKTtcbiAgICBpZiAodGhpcy5mb2N1c1NlcnZpY2UpIHtcbiAgICAgIHRoaXMuZm9jdXNTZXJ2aWNlLmZvY3VzZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==