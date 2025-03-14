/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "./state-debouncer.provider";
export class Sort {
    constructor(stateDebouncer) {
        this.stateDebouncer = stateDebouncer;
        /**
         * Ascending order if false, descending if true
         */
        this._reverse = false;
        /**
         * The Observable that lets other classes subscribe to sort changes
         */
        this._change = new Subject();
    }
    get comparator() {
        return this._comparator;
    }
    set comparator(value) {
        this.stateDebouncer.changeStart();
        this._comparator = value;
        this.emitChange();
        this.stateDebouncer.changeDone();
    }
    get reverse() {
        return this._reverse;
    }
    set reverse(value) {
        this.stateDebouncer.changeStart();
        this._reverse = value;
        this.emitChange();
        this.stateDebouncer.changeDone();
    }
    // We do not want to expose the Subject itself, but the Observable which is read-only
    get change() {
        return this._change.asObservable();
    }
    /**
     * Sets a comparator as the current one, or toggles reverse if the comparator is already used. The
     * optional forceReverse input parameter allows to override that toggling behavior by sorting in
     * reverse order if `true`.
     *
     * @memberof Sort
     */
    toggle(sortBy, forceReverse) {
        this.stateDebouncer.changeStart();
        // We modify private properties directly, to batch the change event
        if (this.comparator === sortBy) {
            this._reverse = typeof forceReverse !== 'undefined' ? forceReverse || !this._reverse : !this._reverse;
        }
        else {
            this._comparator = sortBy;
            this._reverse = typeof forceReverse !== 'undefined' ? forceReverse : false;
        }
        this.emitChange();
        this.stateDebouncer.changeDone();
    }
    /**
     * Clears the current sorting order
     */
    clear() {
        this.comparator = null;
    }
    /**
     * Compares two objects according to the current comparator
     */
    compare(a, b) {
        return (this.reverse ? -1 : 1) * this.comparator.compare(a, b);
    }
    emitChange() {
        this._change.next(this);
    }
}
Sort.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: Sort, deps: [{ token: i1.StateDebouncer }], target: i0.ɵɵFactoryTarget.Injectable });
Sort.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: Sort });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: Sort, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.StateDebouncer }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvcHJvdmlkZXJzL3NvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7OztBQU0vQixNQUFNLE9BQU8sSUFBSTtJQWdCZixZQUFvQixjQUE4QjtRQUE5QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFWbEQ7O1dBRUc7UUFDSyxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBRXpCOztXQUVHO1FBQ0ssWUFBTyxHQUFHLElBQUksT0FBTyxFQUFXLENBQUM7SUFFWSxDQUFDO0lBRXRELElBQUksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBQ0QsSUFBSSxVQUFVLENBQUMsS0FBd0M7UUFDckQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxJQUFJLE9BQU8sQ0FBQyxLQUFjO1FBQ3hCLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDdEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVELHFGQUFxRjtJQUNyRixJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILE1BQU0sQ0FBQyxNQUF5QyxFQUFFLFlBQXNCO1FBQ3RFLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbEMsbUVBQW1FO1FBQ25FLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxNQUFNLEVBQUU7WUFDOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLFlBQVksS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUN2RzthQUFNO1lBQ0wsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7WUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLFlBQVksS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1NBQzVFO1FBQ0QsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSztRQUNILElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7T0FFRztJQUNILE9BQU8sQ0FBQyxDQUFJLEVBQUUsQ0FBSTtRQUNoQixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRU8sVUFBVTtRQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixDQUFDOztpR0EvRVUsSUFBSTtxR0FBSixJQUFJOzJGQUFKLElBQUk7a0JBRGhCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQ2xyRGF0YWdyaWRDb21wYXJhdG9ySW50ZXJmYWNlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9jb21wYXJhdG9yLmludGVyZmFjZSc7XG5pbXBvcnQgeyBTdGF0ZURlYm91bmNlciB9IGZyb20gJy4vc3RhdGUtZGVib3VuY2VyLnByb3ZpZGVyJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNvcnQ8VCA9IGFueT4ge1xuICAvKipcbiAgICogQ3VycmVudGx5IGFjdGl2ZSBjb21wYXJhdG9yXG4gICAqL1xuICBwcml2YXRlIF9jb21wYXJhdG9yOiBDbHJEYXRhZ3JpZENvbXBhcmF0b3JJbnRlcmZhY2U8VD47XG5cbiAgLyoqXG4gICAqIEFzY2VuZGluZyBvcmRlciBpZiBmYWxzZSwgZGVzY2VuZGluZyBpZiB0cnVlXG4gICAqL1xuICBwcml2YXRlIF9yZXZlcnNlID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSBPYnNlcnZhYmxlIHRoYXQgbGV0cyBvdGhlciBjbGFzc2VzIHN1YnNjcmliZSB0byBzb3J0IGNoYW5nZXNcbiAgICovXG4gIHByaXZhdGUgX2NoYW5nZSA9IG5ldyBTdWJqZWN0PFNvcnQ8VD4+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzdGF0ZURlYm91bmNlcjogU3RhdGVEZWJvdW5jZXIpIHt9XG5cbiAgZ2V0IGNvbXBhcmF0b3IoKTogQ2xyRGF0YWdyaWRDb21wYXJhdG9ySW50ZXJmYWNlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5fY29tcGFyYXRvcjtcbiAgfVxuICBzZXQgY29tcGFyYXRvcih2YWx1ZTogQ2xyRGF0YWdyaWRDb21wYXJhdG9ySW50ZXJmYWNlPFQ+KSB7XG4gICAgdGhpcy5zdGF0ZURlYm91bmNlci5jaGFuZ2VTdGFydCgpO1xuICAgIHRoaXMuX2NvbXBhcmF0b3IgPSB2YWx1ZTtcbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgICB0aGlzLnN0YXRlRGVib3VuY2VyLmNoYW5nZURvbmUoKTtcbiAgfVxuXG4gIGdldCByZXZlcnNlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9yZXZlcnNlO1xuICB9XG4gIHNldCByZXZlcnNlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5zdGF0ZURlYm91bmNlci5jaGFuZ2VTdGFydCgpO1xuICAgIHRoaXMuX3JldmVyc2UgPSB2YWx1ZTtcbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgICB0aGlzLnN0YXRlRGVib3VuY2VyLmNoYW5nZURvbmUoKTtcbiAgfVxuXG4gIC8vIFdlIGRvIG5vdCB3YW50IHRvIGV4cG9zZSB0aGUgU3ViamVjdCBpdHNlbGYsIGJ1dCB0aGUgT2JzZXJ2YWJsZSB3aGljaCBpcyByZWFkLW9ubHlcbiAgZ2V0IGNoYW5nZSgpOiBPYnNlcnZhYmxlPFNvcnQ8VD4+IHtcbiAgICByZXR1cm4gdGhpcy5fY2hhbmdlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSBjb21wYXJhdG9yIGFzIHRoZSBjdXJyZW50IG9uZSwgb3IgdG9nZ2xlcyByZXZlcnNlIGlmIHRoZSBjb21wYXJhdG9yIGlzIGFscmVhZHkgdXNlZC4gVGhlXG4gICAqIG9wdGlvbmFsIGZvcmNlUmV2ZXJzZSBpbnB1dCBwYXJhbWV0ZXIgYWxsb3dzIHRvIG92ZXJyaWRlIHRoYXQgdG9nZ2xpbmcgYmVoYXZpb3IgYnkgc29ydGluZyBpblxuICAgKiByZXZlcnNlIG9yZGVyIGlmIGB0cnVlYC5cbiAgICpcbiAgICogQG1lbWJlcm9mIFNvcnRcbiAgICovXG4gIHRvZ2dsZShzb3J0Qnk6IENsckRhdGFncmlkQ29tcGFyYXRvckludGVyZmFjZTxUPiwgZm9yY2VSZXZlcnNlPzogYm9vbGVhbikge1xuICAgIHRoaXMuc3RhdGVEZWJvdW5jZXIuY2hhbmdlU3RhcnQoKTtcbiAgICAvLyBXZSBtb2RpZnkgcHJpdmF0ZSBwcm9wZXJ0aWVzIGRpcmVjdGx5LCB0byBiYXRjaCB0aGUgY2hhbmdlIGV2ZW50XG4gICAgaWYgKHRoaXMuY29tcGFyYXRvciA9PT0gc29ydEJ5KSB7XG4gICAgICB0aGlzLl9yZXZlcnNlID0gdHlwZW9mIGZvcmNlUmV2ZXJzZSAhPT0gJ3VuZGVmaW5lZCcgPyBmb3JjZVJldmVyc2UgfHwgIXRoaXMuX3JldmVyc2UgOiAhdGhpcy5fcmV2ZXJzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY29tcGFyYXRvciA9IHNvcnRCeTtcbiAgICAgIHRoaXMuX3JldmVyc2UgPSB0eXBlb2YgZm9yY2VSZXZlcnNlICE9PSAndW5kZWZpbmVkJyA/IGZvcmNlUmV2ZXJzZSA6IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgICB0aGlzLnN0YXRlRGVib3VuY2VyLmNoYW5nZURvbmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIGN1cnJlbnQgc29ydGluZyBvcmRlclxuICAgKi9cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5jb21wYXJhdG9yID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wYXJlcyB0d28gb2JqZWN0cyBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgY29tcGFyYXRvclxuICAgKi9cbiAgY29tcGFyZShhOiBULCBiOiBUKTogbnVtYmVyIHtcbiAgICByZXR1cm4gKHRoaXMucmV2ZXJzZSA/IC0xIDogMSkgKiB0aGlzLmNvbXBhcmF0b3IuY29tcGFyZShhLCBiKTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdENoYW5nZSgpIHtcbiAgICB0aGlzLl9jaGFuZ2UubmV4dCh0aGlzKTtcbiAgfVxufVxuIl19