/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../utils/popover/providers/popover-toggle.service";
export class TooltipMouseService {
    constructor(toggleService) {
        this.toggleService = toggleService;
    }
    onMouseEnterTrigger() {
        this.mouseOverTrigger = true;
        this.toggleService.open = true;
    }
    onMouseLeaveTrigger() {
        this.mouseOverTrigger = false;
        this.hideIfMouseOut();
    }
    onMouseEnterContent() {
        this.mouseOverContent = true;
    }
    onMouseLeaveContent() {
        this.mouseOverContent = false;
        this.hideIfMouseOut();
    }
    hideIfMouseOut() {
        // A zero timeout is used so that the code has a chance to update
        // the `mouseOverContent` property after the user moves the mouse from the trigger to the content.
        setTimeout(() => {
            if (!this.mouseOverTrigger && !this.mouseOverContent) {
                this.toggleService.open = false;
            }
        }, 0);
    }
}
TooltipMouseService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: TooltipMouseService, deps: [{ token: i1.ClrPopoverToggleService }], target: i0.ɵɵFactoryTarget.Injectable });
TooltipMouseService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: TooltipMouseService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: TooltipMouseService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.ClrPopoverToggleService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1tb3VzZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvcG9wb3Zlci90b29sdGlwL3Byb3ZpZGVycy90b29sdGlwLW1vdXNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFLM0MsTUFBTSxPQUFPLG1CQUFtQjtJQUk5QixZQUE2QixhQUFzQztRQUF0QyxrQkFBYSxHQUFiLGFBQWEsQ0FBeUI7SUFBRyxDQUFDO0lBRXZFLG1CQUFtQjtRQUNqQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQzdCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNqQyxDQUFDO0lBRUQsbUJBQW1CO1FBQ2pCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDOUIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxtQkFBbUI7UUFDakIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztJQUMvQixDQUFDO0lBRUQsbUJBQW1CO1FBQ2pCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDOUIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFTyxjQUFjO1FBQ3BCLGlFQUFpRTtRQUNqRSxrR0FBa0c7UUFDbEcsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ3BELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQzthQUNqQztRQUNILENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7O2dIQWpDVSxtQkFBbUI7b0hBQW5CLG1CQUFtQjsyRkFBbkIsbUJBQW1CO2tCQUQvQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsclBvcG92ZXJUb2dnbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvcG9wb3Zlci9wcm92aWRlcnMvcG9wb3Zlci10b2dnbGUuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBUb29sdGlwTW91c2VTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBtb3VzZU92ZXJUcmlnZ2VyOiBib29sZWFuO1xuICBwcml2YXRlIG1vdXNlT3ZlckNvbnRlbnQ6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB0b2dnbGVTZXJ2aWNlOiBDbHJQb3BvdmVyVG9nZ2xlU2VydmljZSkge31cblxuICBvbk1vdXNlRW50ZXJUcmlnZ2VyKCkge1xuICAgIHRoaXMubW91c2VPdmVyVHJpZ2dlciA9IHRydWU7XG4gICAgdGhpcy50b2dnbGVTZXJ2aWNlLm9wZW4gPSB0cnVlO1xuICB9XG5cbiAgb25Nb3VzZUxlYXZlVHJpZ2dlcigpIHtcbiAgICB0aGlzLm1vdXNlT3ZlclRyaWdnZXIgPSBmYWxzZTtcbiAgICB0aGlzLmhpZGVJZk1vdXNlT3V0KCk7XG4gIH1cblxuICBvbk1vdXNlRW50ZXJDb250ZW50KCkge1xuICAgIHRoaXMubW91c2VPdmVyQ29udGVudCA9IHRydWU7XG4gIH1cblxuICBvbk1vdXNlTGVhdmVDb250ZW50KCkge1xuICAgIHRoaXMubW91c2VPdmVyQ29udGVudCA9IGZhbHNlO1xuICAgIHRoaXMuaGlkZUlmTW91c2VPdXQoKTtcbiAgfVxuXG4gIHByaXZhdGUgaGlkZUlmTW91c2VPdXQoKSB7XG4gICAgLy8gQSB6ZXJvIHRpbWVvdXQgaXMgdXNlZCBzbyB0aGF0IHRoZSBjb2RlIGhhcyBhIGNoYW5jZSB0byB1cGRhdGVcbiAgICAvLyB0aGUgYG1vdXNlT3ZlckNvbnRlbnRgIHByb3BlcnR5IGFmdGVyIHRoZSB1c2VyIG1vdmVzIHRoZSBtb3VzZSBmcm9tIHRoZSB0cmlnZ2VyIHRvIHRoZSBjb250ZW50LlxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLm1vdXNlT3ZlclRyaWdnZXIgJiYgIXRoaXMubW91c2VPdmVyQ29udGVudCkge1xuICAgICAgICB0aGlzLnRvZ2dsZVNlcnZpY2Uub3BlbiA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0sIDApO1xuICB9XG59XG4iXX0=