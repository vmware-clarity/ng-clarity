/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/*
 * This version of the DomAdapter is for use on non-browser platforms, where there are no
 * nativeElements to use for calculations.
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class NoopDomAdapter {
    userDefinedWidth(_element) {
        return 0;
    }
    scrollBarWidth(_element) {
        return 0;
    }
    scrollWidth(_element) {
        return 0;
    }
    computedHeight(_element) {
        return 0;
    }
    clientRect(_element) {
        return {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: 0,
            height: 0,
        };
    }
    minWidth(_element) {
        return 0;
    }
    focus(_element) {
        // Do nothing
    }
}
NoopDomAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: NoopDomAdapter, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NoopDomAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: NoopDomAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: NoopDomAdapter, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9vcC1kb20tYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvcmVuZGVyL25vb3AtZG9tLWFkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSDs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUszQyxNQUFNLE9BQU8sY0FBYztJQUN6QixnQkFBZ0IsQ0FBQyxRQUFhO1FBQzVCLE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELGNBQWMsQ0FBQyxRQUFhO1FBQzFCLE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELFdBQVcsQ0FBQyxRQUFhO1FBQ3ZCLE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELGNBQWMsQ0FBQyxRQUFhO1FBQzFCLE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELFVBQVUsQ0FBQyxRQUFhO1FBQ3RCLE9BQU87WUFDTCxHQUFHLEVBQUUsQ0FBQztZQUNOLE1BQU0sRUFBRSxDQUFDO1lBQ1QsSUFBSSxFQUFFLENBQUM7WUFDUCxLQUFLLEVBQUUsQ0FBQztZQUNSLEtBQUssRUFBRSxDQUFDO1lBQ1IsTUFBTSxFQUFFLENBQUM7U0FDQyxDQUFDO0lBQ2YsQ0FBQztJQUVELFFBQVEsQ0FBQyxRQUFhO1FBQ3BCLE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFhO1FBQ2pCLGFBQWE7SUFDZixDQUFDOzsyR0FsQ1UsY0FBYzsrR0FBZCxjQUFjOzJGQUFkLGNBQWM7a0JBRDFCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbi8qXG4gKiBUaGlzIHZlcnNpb24gb2YgdGhlIERvbUFkYXB0ZXIgaXMgZm9yIHVzZSBvbiBub24tYnJvd3NlciBwbGF0Zm9ybXMsIHdoZXJlIHRoZXJlIGFyZSBub1xuICogbmF0aXZlRWxlbWVudHMgdG8gdXNlIGZvciBjYWxjdWxhdGlvbnMuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEb21BZGFwdGVyIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvZG9tLWFkYXB0ZXIvZG9tLWFkYXB0ZXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTm9vcERvbUFkYXB0ZXIgaW1wbGVtZW50cyBEb21BZGFwdGVyIHtcbiAgdXNlckRlZmluZWRXaWR0aChfZWxlbWVudDogYW55KTogbnVtYmVyIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHNjcm9sbEJhcldpZHRoKF9lbGVtZW50OiBhbnkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHNjcm9sbFdpZHRoKF9lbGVtZW50OiBhbnkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGNvbXB1dGVkSGVpZ2h0KF9lbGVtZW50OiBhbnkpOiBudW1iZXIge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgY2xpZW50UmVjdChfZWxlbWVudDogYW55KTogRE9NUmVjdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcDogMCxcbiAgICAgIGJvdHRvbTogMCxcbiAgICAgIGxlZnQ6IDAsXG4gICAgICByaWdodDogMCxcbiAgICAgIHdpZHRoOiAwLFxuICAgICAgaGVpZ2h0OiAwLFxuICAgIH0gYXMgRE9NUmVjdDtcbiAgfVxuXG4gIG1pbldpZHRoKF9lbGVtZW50OiBhbnkpOiBudW1iZXIge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZm9jdXMoX2VsZW1lbnQ6IGFueSk6IHZvaWQge1xuICAgIC8vIERvIG5vdGhpbmdcbiAgfVxufVxuIl19