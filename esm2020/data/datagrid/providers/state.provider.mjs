/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DatagridPropertyComparator } from '../built-in/comparators/datagrid-property-comparator';
import * as i0 from "@angular/core";
import * as i1 from "./filters";
import * as i2 from "./sort";
import * as i3 from "./page";
import * as i4 from "./state-debouncer.provider";
/**
 * This provider aggregates state changes from the various providers of the Datagrid
 */
export class StateProvider {
    constructor(filters, sort, page, debouncer) {
        this.filters = filters;
        this.sort = sort;
        this.page = page;
        this.debouncer = debouncer;
        /**
         * The Observable that lets other classes subscribe to global state changes
         */
        this.change = this.debouncer.change.pipe(map(() => this.state));
    }
    /*
     * By making this a getter, we open the possibility for a setter in the future.
     * It's been requested a couple times.
     */
    get state() {
        const state = {};
        if (this.page.size > 0) {
            state.page = {
                from: this.page.firstItem,
                to: this.page.lastItem,
                size: this.page.size,
                current: this.page.current,
            };
        }
        if (this.sort.comparator) {
            if (this.sort.comparator instanceof DatagridPropertyComparator) {
                /*
                 * Special case for the default object property comparator,
                 * we give the property name instead of the actual comparator.
                 */
                state.sort = { by: this.sort.comparator.prop, reverse: this.sort.reverse };
            }
            else {
                state.sort = { by: this.sort.comparator, reverse: this.sort.reverse };
            }
        }
        const activeFilters = this.filters.getActiveFilters();
        if (activeFilters.length > 0) {
            state.filters = [];
            for (const filter of activeFilters) {
                if (filter.state) {
                    state.filters.push(filter.state);
                }
                else {
                    state.filters.push(filter);
                }
            }
        }
        return state;
    }
}
StateProvider.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: StateProvider, deps: [{ token: i1.FiltersProvider }, { token: i2.Sort }, { token: i3.Page }, { token: i4.StateDebouncer }], target: i0.ɵɵFactoryTarget.Injectable });
StateProvider.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: StateProvider });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: StateProvider, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.FiltersProvider }, { type: i2.Sort }, { type: i3.Page }, { type: i4.StateDebouncer }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUucHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL3Byb3ZpZGVycy9zdGF0ZS5wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXJDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHNEQUFzRCxDQUFDOzs7Ozs7QUFPbEc7O0dBRUc7QUFFSCxNQUFNLE9BQU8sYUFBYTtJQU14QixZQUNVLE9BQTJCLEVBQzNCLElBQWEsRUFDYixJQUFVLEVBQ1YsU0FBeUI7UUFIekIsWUFBTyxHQUFQLE9BQU8sQ0FBb0I7UUFDM0IsU0FBSSxHQUFKLElBQUksQ0FBUztRQUNiLFNBQUksR0FBSixJQUFJLENBQU07UUFDVixjQUFTLEdBQVQsU0FBUyxDQUFnQjtRQVRuQzs7V0FFRztRQUNILFdBQU0sR0FBNkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQU9sRyxDQUFDO0lBRUo7OztPQUdHO0lBQ0gsSUFBSSxLQUFLO1FBQ1AsTUFBTSxLQUFLLEdBQWlDLEVBQUUsQ0FBQztRQUMvQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRTtZQUN0QixLQUFLLENBQUMsSUFBSSxHQUFHO2dCQUNYLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVM7Z0JBQ3pCLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7Z0JBQ3RCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7Z0JBQ3BCLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU87YUFDM0IsQ0FBQztTQUNIO1FBQ0QsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUN4QixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxZQUFZLDBCQUEwQixFQUFFO2dCQUM5RDs7O21CQUdHO2dCQUNILEtBQUssQ0FBQyxJQUFJLEdBQUcsRUFBRSxFQUFFLEVBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUE0QyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUMvRztpQkFBTTtnQkFDTCxLQUFLLENBQUMsSUFBSSxHQUFHLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ3ZFO1NBQ0Y7UUFFRCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDdEQsSUFBSSxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM1QixLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNuQixLQUFLLE1BQU0sTUFBTSxJQUFJLGFBQWEsRUFBRTtnQkFDbEMsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO29CQUNoQixLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2xDO3FCQUFNO29CQUNMLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUM1QjthQUNGO1NBQ0Y7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7OzBHQW5EVSxhQUFhOzhHQUFiLGFBQWE7MkZBQWIsYUFBYTtrQkFEekIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBEYXRhZ3JpZFByb3BlcnR5Q29tcGFyYXRvciB9IGZyb20gJy4uL2J1aWx0LWluL2NvbXBhcmF0b3JzL2RhdGFncmlkLXByb3BlcnR5LWNvbXBhcmF0b3InO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRTdGF0ZUludGVyZmFjZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvc3RhdGUuaW50ZXJmYWNlJztcbmltcG9ydCB7IEZpbHRlcnNQcm92aWRlciB9IGZyb20gJy4vZmlsdGVycyc7XG5pbXBvcnQgeyBQYWdlIH0gZnJvbSAnLi9wYWdlJztcbmltcG9ydCB7IFNvcnQgfSBmcm9tICcuL3NvcnQnO1xuaW1wb3J0IHsgU3RhdGVEZWJvdW5jZXIgfSBmcm9tICcuL3N0YXRlLWRlYm91bmNlci5wcm92aWRlcic7XG5cbi8qKlxuICogVGhpcyBwcm92aWRlciBhZ2dyZWdhdGVzIHN0YXRlIGNoYW5nZXMgZnJvbSB0aGUgdmFyaW91cyBwcm92aWRlcnMgb2YgdGhlIERhdGFncmlkXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdGF0ZVByb3ZpZGVyPFQ+IHtcbiAgLyoqXG4gICAqIFRoZSBPYnNlcnZhYmxlIHRoYXQgbGV0cyBvdGhlciBjbGFzc2VzIHN1YnNjcmliZSB0byBnbG9iYWwgc3RhdGUgY2hhbmdlc1xuICAgKi9cbiAgY2hhbmdlOiBPYnNlcnZhYmxlPENsckRhdGFncmlkU3RhdGVJbnRlcmZhY2U8VD4+ID0gdGhpcy5kZWJvdW5jZXIuY2hhbmdlLnBpcGUobWFwKCgpID0+IHRoaXMuc3RhdGUpKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGZpbHRlcnM6IEZpbHRlcnNQcm92aWRlcjxUPixcbiAgICBwcml2YXRlIHNvcnQ6IFNvcnQ8VD4sXG4gICAgcHJpdmF0ZSBwYWdlOiBQYWdlLFxuICAgIHByaXZhdGUgZGVib3VuY2VyOiBTdGF0ZURlYm91bmNlclxuICApIHt9XG5cbiAgLypcbiAgICogQnkgbWFraW5nIHRoaXMgYSBnZXR0ZXIsIHdlIG9wZW4gdGhlIHBvc3NpYmlsaXR5IGZvciBhIHNldHRlciBpbiB0aGUgZnV0dXJlLlxuICAgKiBJdCdzIGJlZW4gcmVxdWVzdGVkIGEgY291cGxlIHRpbWVzLlxuICAgKi9cbiAgZ2V0IHN0YXRlKCk6IENsckRhdGFncmlkU3RhdGVJbnRlcmZhY2U8VD4ge1xuICAgIGNvbnN0IHN0YXRlOiBDbHJEYXRhZ3JpZFN0YXRlSW50ZXJmYWNlPFQ+ID0ge307XG4gICAgaWYgKHRoaXMucGFnZS5zaXplID4gMCkge1xuICAgICAgc3RhdGUucGFnZSA9IHtcbiAgICAgICAgZnJvbTogdGhpcy5wYWdlLmZpcnN0SXRlbSxcbiAgICAgICAgdG86IHRoaXMucGFnZS5sYXN0SXRlbSxcbiAgICAgICAgc2l6ZTogdGhpcy5wYWdlLnNpemUsXG4gICAgICAgIGN1cnJlbnQ6IHRoaXMucGFnZS5jdXJyZW50LFxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc29ydC5jb21wYXJhdG9yKSB7XG4gICAgICBpZiAodGhpcy5zb3J0LmNvbXBhcmF0b3IgaW5zdGFuY2VvZiBEYXRhZ3JpZFByb3BlcnR5Q29tcGFyYXRvcikge1xuICAgICAgICAvKlxuICAgICAgICAgKiBTcGVjaWFsIGNhc2UgZm9yIHRoZSBkZWZhdWx0IG9iamVjdCBwcm9wZXJ0eSBjb21wYXJhdG9yLFxuICAgICAgICAgKiB3ZSBnaXZlIHRoZSBwcm9wZXJ0eSBuYW1lIGluc3RlYWQgb2YgdGhlIGFjdHVhbCBjb21wYXJhdG9yLlxuICAgICAgICAgKi9cbiAgICAgICAgc3RhdGUuc29ydCA9IHsgYnk6ICh0aGlzLnNvcnQuY29tcGFyYXRvciBhcyBEYXRhZ3JpZFByb3BlcnR5Q29tcGFyYXRvcjxUPikucHJvcCwgcmV2ZXJzZTogdGhpcy5zb3J0LnJldmVyc2UgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlLnNvcnQgPSB7IGJ5OiB0aGlzLnNvcnQuY29tcGFyYXRvciwgcmV2ZXJzZTogdGhpcy5zb3J0LnJldmVyc2UgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBhY3RpdmVGaWx0ZXJzID0gdGhpcy5maWx0ZXJzLmdldEFjdGl2ZUZpbHRlcnMoKTtcbiAgICBpZiAoYWN0aXZlRmlsdGVycy5sZW5ndGggPiAwKSB7XG4gICAgICBzdGF0ZS5maWx0ZXJzID0gW107XG4gICAgICBmb3IgKGNvbnN0IGZpbHRlciBvZiBhY3RpdmVGaWx0ZXJzKSB7XG4gICAgICAgIGlmIChmaWx0ZXIuc3RhdGUpIHtcbiAgICAgICAgICBzdGF0ZS5maWx0ZXJzLnB1c2goZmlsdGVyLnN0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdGF0ZS5maWx0ZXJzLnB1c2goZmlsdGVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cbiJdfQ==