/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class DateFormControlService {
    constructor() {
        this._touchedChange = new Subject();
        this._dirtyChange = new Subject();
    }
    get touchedChange() {
        return this._touchedChange.asObservable();
    }
    get dirtyChange() {
        return this._dirtyChange.asObservable();
    }
    markAsTouched() {
        this._touchedChange.next();
    }
    markAsDirty() {
        this._dirtyChange.next();
    }
    // friendly wrapper
    setDisabled(state) {
        this.disabled = state;
    }
}
DateFormControlService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DateFormControlService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
DateFormControlService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DateFormControlService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: DateFormControlService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1mb3JtLWNvbnRyb2wuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2Zvcm1zL2RhdGVwaWNrZXIvcHJvdmlkZXJzL2RhdGUtZm9ybS1jb250cm9sLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBRzNDLE1BQU0sT0FBTyxzQkFBc0I7SUFEbkM7UUFJVSxtQkFBYyxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFDckMsaUJBQVksR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO0tBc0I1QztJQXBCQyxJQUFJLGFBQWE7UUFDZixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDNUMsQ0FBQztJQUVELElBQUksV0FBVztRQUNiLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQsYUFBYTtRQUNYLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxtQkFBbUI7SUFDbkIsV0FBVyxDQUFDLEtBQWM7UUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDeEIsQ0FBQzs7bUhBekJVLHNCQUFzQjt1SEFBdEIsc0JBQXNCOzJGQUF0QixzQkFBc0I7a0JBRGxDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERhdGVGb3JtQ29udHJvbFNlcnZpY2Uge1xuICBkaXNhYmxlZDogYm9vbGVhbjtcblxuICBwcml2YXRlIF90b3VjaGVkQ2hhbmdlID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSBfZGlydHlDaGFuZ2UgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGdldCB0b3VjaGVkQ2hhbmdlKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl90b3VjaGVkQ2hhbmdlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgZ2V0IGRpcnR5Q2hhbmdlKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLl9kaXJ0eUNoYW5nZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIG1hcmtBc1RvdWNoZWQoKTogdm9pZCB7XG4gICAgdGhpcy5fdG91Y2hlZENoYW5nZS5uZXh0KCk7XG4gIH1cblxuICBtYXJrQXNEaXJ0eSgpOiB2b2lkIHtcbiAgICB0aGlzLl9kaXJ0eUNoYW5nZS5uZXh0KCk7XG4gIH1cblxuICAvLyBmcmllbmRseSB3cmFwcGVyXG4gIHNldERpc2FibGVkKHN0YXRlOiBib29sZWFuKSB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IHN0YXRlO1xuICB9XG59XG4iXX0=