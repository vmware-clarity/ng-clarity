/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "./page";
import * as i2 from "./state-debouncer.provider";
export class FiltersProvider {
    constructor(_page, stateDebouncer) {
        this._page = _page;
        this.stateDebouncer = stateDebouncer;
        /**
         * This subject is the list of filters that changed last, not the whole list.
         * We emit a list rather than just one filter to allow batch changes to several at once.
         */
        this._change = new Subject();
        /**
         * List of all filters, whether they're active or not
         */
        this._all = [];
    }
    // We do not want to expose the Subject itself, but the Observable which is read-only
    get change() {
        return this._change.asObservable();
    }
    /**
     * Tests if at least one filter is currently active
     */
    hasActiveFilters() {
        // We do not use getActiveFilters() because this function will be called much more often
        // and stopping the loop early might be relevant.
        for (const { filter } of this._all) {
            if (filter && filter.isActive()) {
                return true;
            }
        }
        return false;
    }
    /**
     * Returns a list of all currently active filters
     */
    getActiveFilters() {
        const ret = [];
        for (const { filter } of this._all) {
            if (filter && filter.isActive()) {
                ret.push(filter);
            }
        }
        return ret;
    }
    /**
     * Registers a filter, and returns a deregistration function
     */
    add(filter) {
        const subscription = filter.changes.subscribe(() => this.resetPageAndEmitFilterChange([filter]));
        let hasUnregistered = false;
        const registered = new RegisteredFilter(filter, () => {
            if (hasUnregistered) {
                return;
            }
            subscription.unsubscribe();
            const matchIndex = this._all.findIndex(item => item.filter === filter);
            if (matchIndex >= 0) {
                this._all.splice(matchIndex, 1);
            }
            if (filter.isActive()) {
                this.resetPageAndEmitFilterChange([]);
            }
            hasUnregistered = true;
        });
        this._all.push(registered);
        if (filter.isActive()) {
            this.resetPageAndEmitFilterChange([filter]);
        }
        return registered;
    }
    /**
     * Accepts an item if it is accepted by all currently active filters
     */
    accepts(item) {
        for (const { filter } of this._all) {
            if (filter && filter.isActive() && !filter.accepts(item)) {
                return false;
            }
        }
        return true;
    }
    resetPageAndEmitFilterChange(filters) {
        this.stateDebouncer.changeStart();
        // filtering may change the page number such that current page number doesn't exist in the filtered dataset.
        // So here we always set the current page to 1 so that it'll fetch first page's data with the given filter.
        this._page.current = 1;
        this._change.next(filters);
        this.stateDebouncer.changeDone();
    }
}
FiltersProvider.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: FiltersProvider, deps: [{ token: i1.Page }, { token: i2.StateDebouncer }], target: i0.ɵɵFactoryTarget.Injectable });
FiltersProvider.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: FiltersProvider });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: FiltersProvider, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Page }, { type: i2.StateDebouncer }]; } });
export class RegisteredFilter {
    constructor(filter, unregister) {
        this.filter = filter;
        this.unregister = unregister;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvcHJvdmlkZXJzL2ZpbHRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7Ozs7QUFPL0IsTUFBTSxPQUFPLGVBQWU7SUFZMUIsWUFBb0IsS0FBVyxFQUFVLGNBQThCO1FBQW5ELFVBQUssR0FBTCxLQUFLLENBQU07UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFYdkU7OztXQUdHO1FBQ0ssWUFBTyxHQUFHLElBQUksT0FBTyxFQUFtQyxDQUFDO1FBRWpFOztXQUVHO1FBQ0ssU0FBSSxHQUF5RCxFQUFFLENBQUM7SUFFRSxDQUFDO0lBRTNFLHFGQUFxRjtJQUNyRixJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsZ0JBQWdCO1FBQ2Qsd0ZBQXdGO1FBQ3hGLGlEQUFpRDtRQUNqRCxLQUFLLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2xDLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFDL0IsT0FBTyxJQUFJLENBQUM7YUFDYjtTQUNGO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQ7O09BRUc7SUFDSCxnQkFBZ0I7UUFDZCxNQUFNLEdBQUcsR0FBb0MsRUFBRSxDQUFDO1FBQ2hELEtBQUssTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDbEMsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUMvQixHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2xCO1NBQ0Y7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRDs7T0FFRztJQUNILEdBQUcsQ0FBMEMsTUFBUztRQUNwRCxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakcsSUFBSSxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBQzVCLE1BQU0sVUFBVSxHQUFHLElBQUksZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtZQUNuRCxJQUFJLGVBQWUsRUFBRTtnQkFDbkIsT0FBTzthQUNSO1lBQ0QsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzNCLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsQ0FBQztZQUN2RSxJQUFJLFVBQVUsSUFBSSxDQUFDLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNqQztZQUNELElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUNyQixJQUFJLENBQUMsNEJBQTRCLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDdkM7WUFDRCxlQUFlLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDM0IsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDckIsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUM3QztRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7T0FFRztJQUNILE9BQU8sQ0FBQyxJQUFPO1FBQ2IsS0FBSyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNsQyxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN4RCxPQUFPLEtBQUssQ0FBQzthQUNkO1NBQ0Y7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyw0QkFBNEIsQ0FBQyxPQUF3QztRQUMzRSxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2xDLDRHQUE0RztRQUM1RywyR0FBMkc7UUFDM0csSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDbkMsQ0FBQzs7NEdBNUZVLGVBQWU7Z0hBQWYsZUFBZTsyRkFBZixlQUFlO2tCQUQzQixVQUFVOztBQWdHWCxNQUFNLE9BQU8sZ0JBQWdCO0lBQzNCLFlBQW1CLE1BQVMsRUFBUyxVQUFzQjtRQUF4QyxXQUFNLEdBQU4sTUFBTSxDQUFHO1FBQVMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtJQUFHLENBQUM7Q0FDaEUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQ2xyRGF0YWdyaWRGaWx0ZXJJbnRlcmZhY2UgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2ZpbHRlci5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gJy4vcGFnZSc7XG5pbXBvcnQgeyBTdGF0ZURlYm91bmNlciB9IGZyb20gJy4vc3RhdGUtZGVib3VuY2VyLnByb3ZpZGVyJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEZpbHRlcnNQcm92aWRlcjxUID0gYW55PiB7XG4gIC8qKlxuICAgKiBUaGlzIHN1YmplY3QgaXMgdGhlIGxpc3Qgb2YgZmlsdGVycyB0aGF0IGNoYW5nZWQgbGFzdCwgbm90IHRoZSB3aG9sZSBsaXN0LlxuICAgKiBXZSBlbWl0IGEgbGlzdCByYXRoZXIgdGhhbiBqdXN0IG9uZSBmaWx0ZXIgdG8gYWxsb3cgYmF0Y2ggY2hhbmdlcyB0byBzZXZlcmFsIGF0IG9uY2UuXG4gICAqL1xuICBwcml2YXRlIF9jaGFuZ2UgPSBuZXcgU3ViamVjdDxDbHJEYXRhZ3JpZEZpbHRlckludGVyZmFjZTxUPltdPigpO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGFsbCBmaWx0ZXJzLCB3aGV0aGVyIHRoZXkncmUgYWN0aXZlIG9yIG5vdFxuICAgKi9cbiAgcHJpdmF0ZSBfYWxsOiBSZWdpc3RlcmVkRmlsdGVyPFQsIENsckRhdGFncmlkRmlsdGVySW50ZXJmYWNlPFQ+PltdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcGFnZTogUGFnZSwgcHJpdmF0ZSBzdGF0ZURlYm91bmNlcjogU3RhdGVEZWJvdW5jZXIpIHt9XG5cbiAgLy8gV2UgZG8gbm90IHdhbnQgdG8gZXhwb3NlIHRoZSBTdWJqZWN0IGl0c2VsZiwgYnV0IHRoZSBPYnNlcnZhYmxlIHdoaWNoIGlzIHJlYWQtb25seVxuICBnZXQgY2hhbmdlKCk6IE9ic2VydmFibGU8Q2xyRGF0YWdyaWRGaWx0ZXJJbnRlcmZhY2U8VD5bXT4ge1xuICAgIHJldHVybiB0aGlzLl9jaGFuZ2UuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogVGVzdHMgaWYgYXQgbGVhc3Qgb25lIGZpbHRlciBpcyBjdXJyZW50bHkgYWN0aXZlXG4gICAqL1xuICBoYXNBY3RpdmVGaWx0ZXJzKCk6IGJvb2xlYW4ge1xuICAgIC8vIFdlIGRvIG5vdCB1c2UgZ2V0QWN0aXZlRmlsdGVycygpIGJlY2F1c2UgdGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBtdWNoIG1vcmUgb2Z0ZW5cbiAgICAvLyBhbmQgc3RvcHBpbmcgdGhlIGxvb3AgZWFybHkgbWlnaHQgYmUgcmVsZXZhbnQuXG4gICAgZm9yIChjb25zdCB7IGZpbHRlciB9IG9mIHRoaXMuX2FsbCkge1xuICAgICAgaWYgKGZpbHRlciAmJiBmaWx0ZXIuaXNBY3RpdmUoKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBsaXN0IG9mIGFsbCBjdXJyZW50bHkgYWN0aXZlIGZpbHRlcnNcbiAgICovXG4gIGdldEFjdGl2ZUZpbHRlcnMoKTogQ2xyRGF0YWdyaWRGaWx0ZXJJbnRlcmZhY2U8VD5bXSB7XG4gICAgY29uc3QgcmV0OiBDbHJEYXRhZ3JpZEZpbHRlckludGVyZmFjZTxUPltdID0gW107XG4gICAgZm9yIChjb25zdCB7IGZpbHRlciB9IG9mIHRoaXMuX2FsbCkge1xuICAgICAgaWYgKGZpbHRlciAmJiBmaWx0ZXIuaXNBY3RpdmUoKSkge1xuICAgICAgICByZXQucHVzaChmaWx0ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGZpbHRlciwgYW5kIHJldHVybnMgYSBkZXJlZ2lzdHJhdGlvbiBmdW5jdGlvblxuICAgKi9cbiAgYWRkPEYgZXh0ZW5kcyBDbHJEYXRhZ3JpZEZpbHRlckludGVyZmFjZTxUPj4oZmlsdGVyOiBGKTogUmVnaXN0ZXJlZEZpbHRlcjxULCBGPiB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gZmlsdGVyLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHRoaXMucmVzZXRQYWdlQW5kRW1pdEZpbHRlckNoYW5nZShbZmlsdGVyXSkpO1xuICAgIGxldCBoYXNVbnJlZ2lzdGVyZWQgPSBmYWxzZTtcbiAgICBjb25zdCByZWdpc3RlcmVkID0gbmV3IFJlZ2lzdGVyZWRGaWx0ZXIoZmlsdGVyLCAoKSA9PiB7XG4gICAgICBpZiAoaGFzVW5yZWdpc3RlcmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgY29uc3QgbWF0Y2hJbmRleCA9IHRoaXMuX2FsbC5maW5kSW5kZXgoaXRlbSA9PiBpdGVtLmZpbHRlciA9PT0gZmlsdGVyKTtcbiAgICAgIGlmIChtYXRjaEluZGV4ID49IDApIHtcbiAgICAgICAgdGhpcy5fYWxsLnNwbGljZShtYXRjaEluZGV4LCAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXIuaXNBY3RpdmUoKSkge1xuICAgICAgICB0aGlzLnJlc2V0UGFnZUFuZEVtaXRGaWx0ZXJDaGFuZ2UoW10pO1xuICAgICAgfVxuICAgICAgaGFzVW5yZWdpc3RlcmVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgICB0aGlzLl9hbGwucHVzaChyZWdpc3RlcmVkKTtcbiAgICBpZiAoZmlsdGVyLmlzQWN0aXZlKCkpIHtcbiAgICAgIHRoaXMucmVzZXRQYWdlQW5kRW1pdEZpbHRlckNoYW5nZShbZmlsdGVyXSk7XG4gICAgfVxuICAgIHJldHVybiByZWdpc3RlcmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEFjY2VwdHMgYW4gaXRlbSBpZiBpdCBpcyBhY2NlcHRlZCBieSBhbGwgY3VycmVudGx5IGFjdGl2ZSBmaWx0ZXJzXG4gICAqL1xuICBhY2NlcHRzKGl0ZW06IFQpOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IHsgZmlsdGVyIH0gb2YgdGhpcy5fYWxsKSB7XG4gICAgICBpZiAoZmlsdGVyICYmIGZpbHRlci5pc0FjdGl2ZSgpICYmICFmaWx0ZXIuYWNjZXB0cyhpdGVtKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSByZXNldFBhZ2VBbmRFbWl0RmlsdGVyQ2hhbmdlKGZpbHRlcnM6IENsckRhdGFncmlkRmlsdGVySW50ZXJmYWNlPFQ+W10pIHtcbiAgICB0aGlzLnN0YXRlRGVib3VuY2VyLmNoYW5nZVN0YXJ0KCk7XG4gICAgLy8gZmlsdGVyaW5nIG1heSBjaGFuZ2UgdGhlIHBhZ2UgbnVtYmVyIHN1Y2ggdGhhdCBjdXJyZW50IHBhZ2UgbnVtYmVyIGRvZXNuJ3QgZXhpc3QgaW4gdGhlIGZpbHRlcmVkIGRhdGFzZXQuXG4gICAgLy8gU28gaGVyZSB3ZSBhbHdheXMgc2V0IHRoZSBjdXJyZW50IHBhZ2UgdG8gMSBzbyB0aGF0IGl0J2xsIGZldGNoIGZpcnN0IHBhZ2UncyBkYXRhIHdpdGggdGhlIGdpdmVuIGZpbHRlci5cbiAgICB0aGlzLl9wYWdlLmN1cnJlbnQgPSAxO1xuICAgIHRoaXMuX2NoYW5nZS5uZXh0KGZpbHRlcnMpO1xuICAgIHRoaXMuc3RhdGVEZWJvdW5jZXIuY2hhbmdlRG9uZSgpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZWdpc3RlcmVkRmlsdGVyPFQsIEYgZXh0ZW5kcyBDbHJEYXRhZ3JpZEZpbHRlckludGVyZmFjZTxUPj4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZmlsdGVyOiBGLCBwdWJsaWMgdW5yZWdpc3RlcjogKCkgPT4gdm9pZCkge31cbn1cbiJdfQ==