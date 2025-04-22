/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, HostListener } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./providers/selection";
export class ClrDatagridSelectionCellDirective {
    constructor(selection) {
        this.selection = selection;
    }
    onSelectionCellClick(event) {
        // We want to effectively expand the selection click target to the entire selection cell.
        // If row selection is enabled, do nothing because the entire selection cell is already clickable.
        if (this.selection.rowSelectionMode) {
            return;
        }
        // If click was outside the label/input, forward the click to the input.
        if (event.target.tagName !== 'LABEL' && event.target.tagName !== 'INPUT') {
            event.target.querySelector('input')?.click();
        }
    }
}
ClrDatagridSelectionCellDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridSelectionCellDirective, deps: [{ token: i1.Selection }], target: i0.ɵɵFactoryTarget.Directive });
ClrDatagridSelectionCellDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridSelectionCellDirective, selector: ".datagrid-select", host: { listeners: { "click": "onSelectionCellClick($event)" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridSelectionCellDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '.datagrid-select',
                }]
        }], ctorParameters: function () { return [{ type: i1.Selection }]; }, propDecorators: { onSelectionCellClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtc2VsZWN0aW9uLWNlbGwuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC1zZWxlY3Rpb24tY2VsbC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBT3hELE1BQU0sT0FBTyxpQ0FBaUM7SUFDNUMsWUFBNkIsU0FBb0I7UUFBcEIsY0FBUyxHQUFULFNBQVMsQ0FBVztJQUFHLENBQUM7SUFHN0Msb0JBQW9CLENBQUMsS0FBMkM7UUFDdEUseUZBQXlGO1FBRXpGLGtHQUFrRztRQUNsRyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEVBQUU7WUFDbkMsT0FBTztTQUNSO1FBRUQsd0VBQXdFO1FBQ3hFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEtBQUssT0FBTyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxLQUFLLE9BQU8sRUFBRTtZQUN4RSxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQztTQUM5QztJQUNILENBQUM7OzhIQWhCVSxpQ0FBaUM7a0hBQWpDLGlDQUFpQzsyRkFBakMsaUNBQWlDO2tCQUg3QyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxrQkFBa0I7aUJBQzdCO2dHQUtTLG9CQUFvQjtzQkFEM0IsWUFBWTt1QkFBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFNlbGVjdGlvbiB9IGZyb20gJy4vcHJvdmlkZXJzL3NlbGVjdGlvbic7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJy5kYXRhZ3JpZC1zZWxlY3QnLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEYXRhZ3JpZFNlbGVjdGlvbkNlbGxEaXJlY3RpdmUge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHNlbGVjdGlvbjogU2VsZWN0aW9uKSB7fVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgcHJpdmF0ZSBvblNlbGVjdGlvbkNlbGxDbGljayhldmVudDogTW91c2VFdmVudCAmIHsgdGFyZ2V0OiBIVE1MRWxlbWVudCB9KSB7XG4gICAgLy8gV2Ugd2FudCB0byBlZmZlY3RpdmVseSBleHBhbmQgdGhlIHNlbGVjdGlvbiBjbGljayB0YXJnZXQgdG8gdGhlIGVudGlyZSBzZWxlY3Rpb24gY2VsbC5cblxuICAgIC8vIElmIHJvdyBzZWxlY3Rpb24gaXMgZW5hYmxlZCwgZG8gbm90aGluZyBiZWNhdXNlIHRoZSBlbnRpcmUgc2VsZWN0aW9uIGNlbGwgaXMgYWxyZWFkeSBjbGlja2FibGUuXG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uLnJvd1NlbGVjdGlvbk1vZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiBjbGljayB3YXMgb3V0c2lkZSB0aGUgbGFiZWwvaW5wdXQsIGZvcndhcmQgdGhlIGNsaWNrIHRvIHRoZSBpbnB1dC5cbiAgICBpZiAoZXZlbnQudGFyZ2V0LnRhZ05hbWUgIT09ICdMQUJFTCcgJiYgZXZlbnQudGFyZ2V0LnRhZ05hbWUgIT09ICdJTlBVVCcpIHtcbiAgICAgIGV2ZW50LnRhcmdldC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpPy5jbGljaygpO1xuICAgIH1cbiAgfVxufVxuIl19