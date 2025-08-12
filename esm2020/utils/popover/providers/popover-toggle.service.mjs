/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { preventArrowKeyScroll } from '../../focus/key-focus/util';
import * as i0 from "@angular/core";
// Popovers might need to ignore click events on an element
// (eg: popover opens on focus on an input field. Clicks should be ignored in this case)
export class ClrPopoverToggleService {
    constructor() {
        this._open = false;
        this._openChange = new Subject();
        this._openEventChange = new Subject();
        this._popoverAligned = new Subject();
        this._popoverVisible = new Subject();
    }
    get openChange() {
        return this._openChange.asObservable();
    }
    get popoverVisible() {
        return this._popoverVisible.asObservable();
    }
    get openEvent() {
        return this._openEvent;
    }
    set openEvent(event) {
        this._openEvent = event;
        this._openEventChange.next(event);
    }
    get open() {
        return this._open;
    }
    set open(value) {
        value = !!value;
        if (this._open !== value) {
            this._open = value;
            this._openChange.next(value);
        }
    }
    // For compatibility with legacy IfOpenService based implementations
    get originalEvent() {
        return this._openEvent;
    }
    get popoverAligned() {
        return this._popoverAligned.asObservable();
    }
    getEventChange() {
        return this._openEventChange.asObservable();
    }
    /**
     * Sometimes, we need to remember the event that triggered the toggling to avoid loops.
     * This is for instance the case of components that open on a click, but close on a click outside.
     */
    toggleWithEvent(event) {
        preventArrowKeyScroll(event);
        this.openEvent = event;
        this.open = !this.open;
    }
    popoverVisibleEmit(visible) {
        this._popoverVisible.next(visible);
    }
    popoverAlignedEmit(popoverNode) {
        this._popoverAligned.next(popoverNode);
    }
}
ClrPopoverToggleService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverToggleService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ClrPopoverToggleService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverToggleService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrPopoverToggleService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci10b2dnbGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL3V0aWxzL3BvcG92ZXIvcHJvdmlkZXJzL3BvcG92ZXItdG9nZ2xlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFM0MsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7O0FBRW5FLDJEQUEyRDtBQUMzRCx3RkFBd0Y7QUFHeEYsTUFBTSxPQUFPLHVCQUF1QjtJQURwQztRQUVVLFVBQUssR0FBRyxLQUFLLENBQUM7UUFDZCxnQkFBVyxHQUFHLElBQUksT0FBTyxFQUFXLENBQUM7UUFFckMscUJBQWdCLEdBQUcsSUFBSSxPQUFPLEVBQVMsQ0FBQztRQUN4QyxvQkFBZSxHQUFHLElBQUksT0FBTyxFQUFlLENBQUM7UUFDN0Msb0JBQWUsR0FBRyxJQUFJLE9BQU8sRUFBVyxDQUFDO0tBNERsRDtJQTFEQyxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVELElBQUksY0FBYztRQUNoQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDN0MsQ0FBQztJQUVELElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBQ0QsSUFBSSxTQUFTLENBQUMsS0FBWTtRQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxJQUFJLElBQUk7UUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUNELElBQUksSUFBSSxDQUFDLEtBQWM7UUFDckIsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDaEIsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUssRUFBRTtZQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM5QjtJQUNILENBQUM7SUFFRCxvRUFBb0U7SUFDcEUsSUFBSSxhQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFFRCxjQUFjO1FBQ1osT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDOUMsQ0FBQztJQUVEOzs7T0FHRztJQUNILGVBQWUsQ0FBQyxLQUFVO1FBQ3hCLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTdCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxPQUFnQjtRQUNqQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsa0JBQWtCLENBQUMsV0FBd0I7UUFDekMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDekMsQ0FBQzs7b0hBakVVLHVCQUF1Qjt3SEFBdkIsdUJBQXVCOzJGQUF2Qix1QkFBdUI7a0JBRG5DLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgcHJldmVudEFycm93S2V5U2Nyb2xsIH0gZnJvbSAnLi4vLi4vZm9jdXMva2V5LWZvY3VzL3V0aWwnO1xuXG4vLyBQb3BvdmVycyBtaWdodCBuZWVkIHRvIGlnbm9yZSBjbGljayBldmVudHMgb24gYW4gZWxlbWVudFxuLy8gKGVnOiBwb3BvdmVyIG9wZW5zIG9uIGZvY3VzIG9uIGFuIGlucHV0IGZpZWxkLiBDbGlja3Mgc2hvdWxkIGJlIGlnbm9yZWQgaW4gdGhpcyBjYXNlKVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2xyUG9wb3ZlclRvZ2dsZVNlcnZpY2Uge1xuICBwcml2YXRlIF9vcGVuID0gZmFsc2U7XG4gIHByaXZhdGUgX29wZW5DaGFuZ2UgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuICBwcml2YXRlIF9vcGVuRXZlbnQ6IEV2ZW50O1xuICBwcml2YXRlIF9vcGVuRXZlbnRDaGFuZ2UgPSBuZXcgU3ViamVjdDxFdmVudD4oKTtcbiAgcHJpdmF0ZSBfcG9wb3ZlckFsaWduZWQgPSBuZXcgU3ViamVjdDxIVE1MRWxlbWVudD4oKTtcbiAgcHJpdmF0ZSBfcG9wb3ZlclZpc2libGUgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gIGdldCBvcGVuQ2hhbmdlKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLl9vcGVuQ2hhbmdlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgZ2V0IHBvcG92ZXJWaXNpYmxlKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLl9wb3BvdmVyVmlzaWJsZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGdldCBvcGVuRXZlbnQoKTogRXZlbnQge1xuICAgIHJldHVybiB0aGlzLl9vcGVuRXZlbnQ7XG4gIH1cbiAgc2V0IG9wZW5FdmVudChldmVudDogRXZlbnQpIHtcbiAgICB0aGlzLl9vcGVuRXZlbnQgPSBldmVudDtcbiAgICB0aGlzLl9vcGVuRXZlbnRDaGFuZ2UubmV4dChldmVudCk7XG4gIH1cblxuICBnZXQgb3BlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fb3BlbjtcbiAgfVxuICBzZXQgb3Blbih2YWx1ZTogYm9vbGVhbikge1xuICAgIHZhbHVlID0gISF2YWx1ZTtcbiAgICBpZiAodGhpcy5fb3BlbiAhPT0gdmFsdWUpIHtcbiAgICAgIHRoaXMuX29wZW4gPSB2YWx1ZTtcbiAgICAgIHRoaXMuX29wZW5DaGFuZ2UubmV4dCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gRm9yIGNvbXBhdGliaWxpdHkgd2l0aCBsZWdhY3kgSWZPcGVuU2VydmljZSBiYXNlZCBpbXBsZW1lbnRhdGlvbnNcbiAgZ2V0IG9yaWdpbmFsRXZlbnQoKTogRXZlbnQge1xuICAgIHJldHVybiB0aGlzLl9vcGVuRXZlbnQ7XG4gIH1cblxuICBnZXQgcG9wb3ZlckFsaWduZWQoKTogT2JzZXJ2YWJsZTxIVE1MRWxlbWVudD4ge1xuICAgIHJldHVybiB0aGlzLl9wb3BvdmVyQWxpZ25lZC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGdldEV2ZW50Q2hhbmdlKCk6IE9ic2VydmFibGU8RXZlbnQ+IHtcbiAgICByZXR1cm4gdGhpcy5fb3BlbkV2ZW50Q2hhbmdlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNvbWV0aW1lcywgd2UgbmVlZCB0byByZW1lbWJlciB0aGUgZXZlbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIHRvZ2dsaW5nIHRvIGF2b2lkIGxvb3BzLlxuICAgKiBUaGlzIGlzIGZvciBpbnN0YW5jZSB0aGUgY2FzZSBvZiBjb21wb25lbnRzIHRoYXQgb3BlbiBvbiBhIGNsaWNrLCBidXQgY2xvc2Ugb24gYSBjbGljayBvdXRzaWRlLlxuICAgKi9cbiAgdG9nZ2xlV2l0aEV2ZW50KGV2ZW50OiBhbnkpIHtcbiAgICBwcmV2ZW50QXJyb3dLZXlTY3JvbGwoZXZlbnQpO1xuXG4gICAgdGhpcy5vcGVuRXZlbnQgPSBldmVudDtcbiAgICB0aGlzLm9wZW4gPSAhdGhpcy5vcGVuO1xuICB9XG5cbiAgcG9wb3ZlclZpc2libGVFbWl0KHZpc2libGU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9wb3BvdmVyVmlzaWJsZS5uZXh0KHZpc2libGUpO1xuICB9XG5cbiAgcG9wb3ZlckFsaWduZWRFbWl0KHBvcG92ZXJOb2RlOiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMuX3BvcG92ZXJBbGlnbmVkLm5leHQocG9wb3Zlck5vZGUpO1xuICB9XG59XG4iXX0=