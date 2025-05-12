/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "./filters";
import * as i2 from "./sort";
import * as i3 from "./page";
export class Items {
    constructor(_filters, _sort, _page) {
        this._filters = _filters;
        this._sort = _sort;
        this._page = _page;
        /**
         * Indicates if the data is currently loading
         */
        this.loading = false;
        /**
         * Whether we should use smart items for this datagrid or let the user handle
         * everything.
         */
        this._smart = false;
        /**
         * List of items currently displayed
         */
        this._displayed = [];
        /**
         * The Observable that lets other classes subscribe to items changes
         */
        this._change = new Subject();
        this._allChanges = new Subject();
        /**
         * Tracking function to identify objects.
         */
        this.trackBy = item => item;
    }
    get smart() {
        return this._smart;
    }
    get all() {
        return this._all;
    }
    set all(items) {
        this._all = items;
        this.emitAllChanges(items);
        if (this.smart) {
            this._filterItems();
        }
        else {
            this._displayed = items;
            this.emitChange();
        }
    }
    get displayed() {
        // Ideally we could return an immutable array, but we don't have it in Clarity yet.
        return this._displayed;
    }
    // We do not want to expose the Subject itself, but the Observable which is read-only
    get change() {
        return this._change.asObservable();
    }
    get allChanges() {
        return this._allChanges.asObservable();
    }
    /**
     * Checks if we don't have data to process yet, to abort early operations
     */
    get uninitialized() {
        return !this._all;
    }
    /**
     * Cleans up our subscriptions to other providers
     */
    destroy() {
        if (this._filtersSub) {
            this._filtersSub.unsubscribe();
        }
        if (this._sortSub) {
            this._sortSub.unsubscribe();
        }
        if (this._pageSub) {
            this._pageSub.unsubscribe();
        }
    }
    smartenDown() {
        this._smart = false;
        this.destroy();
    }
    smartenUp() {
        this._smart = true;
        /*
         * These observers trigger a chain of function: filter -> sort -> paginate
         * An observer up the chain re-triggers all the operations that follow it.
         */
        this._filtersSub = this._filters.change.subscribe(() => this._filterItems());
        this._sortSub = this._sort.change.subscribe(() => {
            // Special case, if the datagrid went from sorted to unsorted, we have to re-filter
            // to get the original order back
            if (!this._sort.comparator) {
                this._filterItems();
            }
            else {
                this._sortItems();
            }
        });
        this._pageSub = this._page.change.subscribe(() => this._changePage());
    }
    /**
     * Manually recompute the list of displayed items
     */
    refresh() {
        if (this.smart) {
            this._filterItems();
        }
    }
    emitChange() {
        this._change.next(this.displayed);
    }
    emitAllChanges(items) {
        this._allChanges.next(items);
    }
    /**
     * FiltersProvider items from the raw list
     */
    _filterItems() {
        if (this.uninitialized) {
            return;
        }
        if (this._filters.hasActiveFilters()) {
            this._filtered = this._all.filter(item => this._filters.accepts(item));
        }
        else {
            // Work on a shallow copy of the array, to not modify the user's model
            this._filtered = this._all.slice();
        }
        this._page.totalItems = this._filtered.length;
        this._sortItems();
    }
    /**
     * Sorts items in the filtered list
     */
    _sortItems() {
        if (this.uninitialized) {
            return;
        }
        if (this._sort.comparator) {
            this._filtered.sort((a, b) => this._sort.compare(a, b));
        }
        this._changePage();
    }
    /**
     * Extracts the current page from the sorted list
     */
    _changePage() {
        // If we know we have pagination but the page size hasn't been set yet, we wait for it.
        if (this.uninitialized || (this._page.activated && this._page.size === 0)) {
            return;
        }
        if (this._page.size > 0) {
            this._displayed = this._filtered.slice(this._page.firstItem, this._page.lastItem + 1);
        }
        else {
            this._displayed = this._filtered;
        }
        this.emitChange();
    }
}
Items.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: Items, deps: [{ token: i1.FiltersProvider }, { token: i2.Sort }, { token: i3.Page }], target: i0.ɵɵFactoryTarget.Injectable });
Items.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: Items });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: Items, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.FiltersProvider }, { type: i2.Sort }, { type: i3.Page }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyL3NyYy9kYXRhL2RhdGFncmlkL3Byb3ZpZGVycy9pdGVtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQzs7Ozs7QUFVL0IsTUFBTSxPQUFPLEtBQUs7SUF5Q2hCLFlBQW9CLFFBQTRCLEVBQVUsS0FBYyxFQUFVLEtBQVc7UUFBekUsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFTO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBTTtRQXhDN0Y7O1dBRUc7UUFDSCxZQUFPLEdBQUcsS0FBSyxDQUFDO1FBU2hCOzs7V0FHRztRQUNLLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFZdkI7O1dBRUc7UUFDSyxlQUFVLEdBQVEsRUFBRSxDQUFDO1FBRTdCOztXQUVHO1FBQ0ssWUFBTyxHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7UUFFN0IsZ0JBQVcsR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO1FBMkN6Qzs7V0FFRztRQUNILFlBQU8sR0FBdUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUE1Q3FDLENBQUM7SUFFakcsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxJQUFJLEdBQUc7UUFDTCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUNELElBQUksR0FBRyxDQUFDLEtBQVU7UUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7UUFDbEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQixJQUFJLElBQUksQ0FBQyxLQUFL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QztRQUNELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNwQixDQUFDOztrR0E1TFUsS0FBSztzR0FBTCxLQUFLOzJGQUFMLEtBQUs7a0JBRGpCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBGaWx0ZXJzUHJvdmlkZXIgfSBmcm9tICcuL2ZpbHRlcnMnO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gJy4vcGFnZSc7XG5pbXBvcnQgeyBTb3J0IH0gZnJvbSAnLi9zb3J0JztcblxuZXhwb3J0IHR5cGUgQ2xyRGF0YWdyaWRJdGVtc1RyYWNrQnlGdW5jdGlvbjxUPiA9IChpdGVtOiBUKSA9PiBhbnk7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBJdGVtczxUID0gYW55PiB7XG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgdGhlIGRhdGEgaXMgY3VycmVudGx5IGxvYWRpbmdcbiAgICovXG4gIGxvYWRpbmcgPSBmYWxzZTtcblxuICAvKipcbiAgICogU3Vic2NyaXB0aW9ucyB0byB0aGUgb3RoZXIgcHJvdmlkZXJzIGNoYW5nZXMuXG4gICAqL1xuICBwcml2YXRlIF9maWx0ZXJzU3ViOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgX3NvcnRTdWI6IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBfcGFnZVN1YjogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHdlIHNob3VsZCB1c2Ugc21hcnQgaXRlbXMgZm9yIHRoaXMgZGF0YWdyaWQgb3IgbGV0IHRoZSB1c2VyIGhhbmRsZVxuICAgKiBldmVyeXRoaW5nLlxuICAgKi9cbiAgcHJpdmF0ZSBfc21hcnQgPSBmYWxzZTtcblxuICAvKipcbiAgICogTGlzdCBvZiBhbGwgaXRlbXMgaW4gdGhlIGRhdGFncmlkXG4gICAqL1xuICBwcml2YXRlIF9hbGw6IFRbXTtcblxuICAvKipcbiAgICogSW50ZXJuYWwgdGVtcG9yYXJ5IHN0ZXAsIHdoaWNoIHdlIHByZXNlcnZlIHRvIGF2b2lkIHJlLWZpbHRlcmluZyBvciByZS1zb3J0aW5nIGlmIG5vdCBuZWNlc3NhcnlcbiAgICovXG4gIHByaXZhdGUgX2ZpbHRlcmVkOiBUW107XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgaXRlbXMgY3VycmVudGx5IGRpc3BsYXllZFxuICAgKi9cbiAgcHJpdmF0ZSBfZGlzcGxheWVkOiBUW10gPSBbXTtcblxuICAvKipcbiAgICogVGhlIE9ic2VydmFibGUgdGhhdCBsZXRzIG90aGVyIGNsYXNzZXMgc3Vic2NyaWJlIHRvIGl0ZW1zIGNoYW5nZXNcbiAgICovXG4gIHByaXZhdGUgX2NoYW5nZSA9IG5ldyBTdWJqZWN0PFRbXT4oKTtcblxuICBwcml2YXRlIF9hbGxDaGFuZ2VzID0gbmV3IFN1YmplY3Q8VFtdPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2ZpbHRlcnM6IEZpbHRlcnNQcm92aWRlcjxUPiwgcHJpdmF0ZSBfc29ydDogU29ydDxUPiwgcHJpdmF0ZSBfcGFnZTogUGFnZSkge31cblxuICBnZXQgc21hcnQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3NtYXJ0O1xuICB9XG5cbiAgZ2V0IGFsbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYWxsO1xuICB9XG4gIHNldCBhbGwoaXRlbXM6IFRbXSkge1xuICAgIHRoaXMuX2FsbCA9IGl0ZW1zO1xuICAgIHRoaXMuZW1pdEFsbENoYW5nZXMoaXRlbXMpO1xuICAgIGlmICh0aGlzLnNtYXJ0KSB7XG4gICAgICB0aGlzLl9maWx0ZXJJdGVtcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kaXNwbGF5ZWQgPSBpdGVtcztcbiAgICAgIHRoaXMuZW1pdENoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBkaXNwbGF5ZWQoKTogVFtdIHtcbiAgICAvLyBJZGVhbGx5IHdlIGNvdWxkIHJldHVybiBhbiBpbW11dGFibGUgYXJyYXksIGJ1dCB3ZSBkb24ndCBoYXZlIGl0IGluIENsYXJpdHkgeWV0LlxuICAgIHJldHVybiB0aGlzLl9kaXNwbGF5ZWQ7XG4gIH1cblxuICAvLyBXZSBkbyBub3Qgd2FudCB0byBleHBvc2UgdGhlIFN1YmplY3QgaXRzZWxmLCBidXQgdGhlIE9ic2VydmFibGUgd2hpY2ggaXMgcmVhZC1vbmx5XG4gIGdldCBjaGFuZ2UoKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICByZXR1cm4gdGhpcy5fY2hhbmdlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgZ2V0IGFsbENoYW5nZXMoKTogT2JzZXJ2YWJsZTxUW10+IHtcbiAgICByZXR1cm4gdGhpcy5fYWxsQ2hhbmdlcy5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgd2UgZG9uJ3QgaGF2ZSBkYXRhIHRvIHByb2Nlc3MgeWV0LCB0byBhYm9ydCBlYXJseSBvcGVyYXRpb25zXG4gICAqL1xuICBwcml2YXRlIGdldCB1bmluaXRpYWxpemVkKCkge1xuICAgIHJldHVybiAhdGhpcy5fYWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNraW5nIGZ1bmN0aW9uIHRvIGlkZW50aWZ5IG9iamVjdHMuXG4gICAqL1xuICB0cmFja0J5OiBDbHJEYXRhZ3JpZEl0ZW1zVHJhY2tCeUZ1bmN0aW9uPFQ+ID0gaXRlbSA9PiBpdGVtO1xuXG4gIC8qKlxuICAgKiBDbGVhbnMgdXAgb3VyIHN1YnNjcmlwdGlvbnMgdG8gb3RoZXIgcHJvdmlkZXJzXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9maWx0ZXJzU3ViKSB7XG4gICAgICB0aGlzLl9maWx0ZXJzU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9zb3J0U3ViKSB7XG4gICAgICB0aGlzLl9zb3J0U3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9wYWdlU3ViKSB7XG4gICAgICB0aGlzLl9wYWdlU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgc21hcnRlbkRvd24oKSB7XG4gICAgdGhpcy5fc21hcnQgPSBmYWxzZTtcblxuICAgIHRoaXMuZGVzdHJveSgpO1xuICB9XG5cbiAgc21hcnRlblVwKCkge1xuICAgIHRoaXMuX3NtYXJ0ID0gdHJ1ZTtcbiAgICAvKlxuICAgICAqIFRoZXNlIG9ic2VydmVycyB0cmlnZ2VyIGEgY2hhaW4gb2YgZnVuY3Rpb246IGZpbHRlciAtPiBzb3J0IC0+IHBhZ2luYXRlXG4gICAgICogQW4gb2JzZXJ2ZXIgdXAgdGhlIGNoYWluIHJlLXRyaWdnZXJzIGFsbCB0aGUgb3BlcmF0aW9ucyB0aGF0IGZvbGxvdyBpdC5cbiAgICAgKi9cbiAgICB0aGlzLl9maWx0ZXJzU3ViID0gdGhpcy5fZmlsdGVycy5jaGFuZ2Uuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2ZpbHRlckl0ZW1zKCkpO1xuICAgIHRoaXMuX3NvcnRTdWIgPSB0aGlzLl9zb3J0LmNoYW5nZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gU3BlY2lhbCBjYXNlLCBpZiB0aGUgZGF0YWdyaWQgd2VudCBmcm9tIHNvcnRlZCB0byB1bnNvcnRlZCwgd2UgaGF2ZSB0byByZS1maWx0ZXJcbiAgICAgIC8vIHRvIGdldCB0aGUgb3JpZ2luYWwgb3JkZXIgYmFja1xuICAgICAgaWYgKCF0aGlzLl9zb3J0LmNvbXBhcmF0b3IpIHtcbiAgICAgICAgdGhpcy5fZmlsdGVySXRlbXMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NvcnRJdGVtcygpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuX3BhZ2VTdWIgPSB0aGlzLl9wYWdlLmNoYW5nZS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fY2hhbmdlUGFnZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYW51YWxseSByZWNvbXB1dGUgdGhlIGxpc3Qgb2YgZGlzcGxheWVkIGl0ZW1zXG4gICAqL1xuICByZWZyZXNoKCkge1xuICAgIGlmICh0aGlzLnNtYXJ0KSB7XG4gICAgICB0aGlzLl9maWx0ZXJJdGVtcygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZW1pdENoYW5nZSgpIHtcbiAgICB0aGlzLl9jaGFuZ2UubmV4dCh0aGlzLmRpc3BsYXllZCk7XG4gIH1cblxuICBwcml2YXRlIGVtaXRBbGxDaGFuZ2VzKGl0ZW1zOiBUW10pOiB2b2lkIHtcbiAgICB0aGlzLl9hbGxDaGFuZ2VzLm5leHQoaXRlbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbHRlcnNQcm92aWRlciBpdGVtcyBmcm9tIHRoZSByYXcgbGlzdFxuICAgKi9cbiAgcHJpdmF0ZSBfZmlsdGVySXRlbXMoKSB7XG4gICAgaWYgKHRoaXMudW5pbml0aWFsaXplZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZmlsdGVycy5oYXNBY3RpdmVGaWx0ZXJzKCkpIHtcbiAgICAgIHRoaXMuX2ZpbHRlcmVkID0gdGhpcy5fYWxsLmZpbHRlcihpdGVtID0+IHRoaXMuX2ZpbHRlcnMuYWNjZXB0cyhpdGVtKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFdvcmsgb24gYSBzaGFsbG93IGNvcHkgb2YgdGhlIGFycmF5LCB0byBub3QgbW9kaWZ5IHRoZSB1c2VyJ3MgbW9kZWxcbiAgICAgIHRoaXMuX2ZpbHRlcmVkID0gdGhpcy5fYWxsLnNsaWNlKCk7XG4gICAgfVxuICAgIHRoaXMuX3BhZ2UudG90YWxJdGVtcyA9IHRoaXMuX2ZpbHRlcmVkLmxlbmd0aDtcbiAgICB0aGlzLl9zb3J0SXRlbXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTb3J0cyBpdGVtcyBpbiB0aGUgZmlsdGVyZWQgbGlzdFxuICAgKi9cbiAgcHJpdmF0ZSBfc29ydEl0ZW1zKCkge1xuICAgIGlmICh0aGlzLnVuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3NvcnQuY29tcGFyYXRvcikge1xuICAgICAgdGhpcy5fZmlsdGVyZWQuc29ydCgoYSwgYikgPT4gdGhpcy5fc29ydC5jb21wYXJlKGEsIGIpKTtcbiAgICB9XG4gICAgdGhpcy5fY2hhbmdlUGFnZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3RzIHRoZSBjdXJyZW50IHBhZ2UgZnJvbSB0aGUgc29ydGVkIGxpc3RcbiAgICovXG4gIHByaXZhdGUgX2NoYW5nZVBhZ2UoKSB7XG4gICAgLy8gSWYgd2Uga25vdyB3ZSBoYXZlIHBhZ2luYXRpb24gYnV0IHRoZSBwYWdlIHNpemUgaGFzbid0IGJlZW4gc2V0IHlldCwgd2Ugd2FpdCBmb3IgaXQuXG4gICAgaWYgKHRoaXMudW5pbml0aWFsaXplZCB8fCAodGhpcy5fcGFnZS5hY3RpdmF0ZWQgJiYgdGhpcy5fcGFnZS5zaXplID09PSAwKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5fcGFnZS5zaXplID4gMCkge1xuICAgICAgdGhpcy5fZGlzcGxheWVkID0gdGhpcy5fZmlsdGVyZWQuc2xpY2UodGhpcy5fcGFnZS5maXJzdEl0ZW0sIHRoaXMuX3BhZ2UubGFzdEl0ZW0gKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZGlzcGxheWVkID0gdGhpcy5fZmlsdGVyZWQ7XG4gICAgfVxuICAgIHRoaXMuZW1pdENoYW5nZSgpO1xuICB9XG59XG4iXX0=