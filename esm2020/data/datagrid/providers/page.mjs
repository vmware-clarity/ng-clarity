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
export class Page {
    constructor(stateDebouncer) {
        this.stateDebouncer = stateDebouncer;
        this.activated = false;
        /**
         * Page size, a value of 0 means no pagination
         */
        this._size = 0;
        /**
         * Current page
         */
        this._current = 1;
        /**
         * The Observable that lets other classes subscribe to page changes
         */
        this._change = new Subject();
        this.preventEmit = false;
        this._sizeChange = new Subject();
    }
    get size() {
        return this._size;
    }
    set size(size) {
        const oldSize = this._size;
        if (size !== oldSize) {
            if (!this.preventEmit) {
                this.stateDebouncer.changeStart();
            }
            this._size = size;
            if (size === 0) {
                this._current = 1;
            }
            else {
                // Yeap. That's the formula to keep the first item from the old page still
                // displayed in the new one.
                this._current = Math.floor((oldSize / size) * (this._current - 1)) + 1;
            }
            // We always emit an event even if the current page index didn't change, because
            // the size changing means the items inside the page are different
            if (!this.preventEmit) {
                this._change.next(this._current);
                this._sizeChange.next(this._size);
                this.stateDebouncer.changeDone();
            }
        }
        this.preventEmit = false;
    }
    get totalItems() {
        return this._totalItems || 0; // remains 0 if not set to avoid breaking change
    }
    set totalItems(total) {
        this._totalItems = total;
        // If we have less items than before, we might need to change the current page
        if (this.current > this.last) {
            this.current = this.last;
        }
    }
    get last() {
        if (this._last) {
            return this._last;
        }
        // If the last page isn't known, we compute it from the last item's index
        if (this.size > 0 && this.totalItems) {
            return Math.ceil(this.totalItems / this.size);
        }
        return 1;
    }
    set last(page) {
        this._last = page;
    }
    // We do not want to expose the Subject itself, but the Observable which is read-only
    get change() {
        return this._change.asObservable();
    }
    get sizeChange() {
        return this._sizeChange.asObservable();
    }
    get current() {
        return this._current;
    }
    set current(page) {
        if (page !== this._current) {
            this.stateDebouncer.changeStart();
            this._current = page;
            this._change.next(page);
            this.stateDebouncer.changeDone();
        }
    }
    /**
     * Index of the first item displayed on the current page, starting at 0, -1 if none displayed
     */
    get firstItem() {
        if (this._totalItems === 0) {
            return -1;
        }
        if (this.size === 0) {
            return 0;
        }
        return (this.current - 1) * this.size;
    }
    /**
     * Index of the last item displayed on the current page, starting at 0, -1 if none displayed
     */
    get lastItem() {
        if (this._totalItems === 0) {
            return -1;
        }
        if (this.size === 0) {
            return this.totalItems - 1;
        }
        let lastInPage = this.current * this.size - 1;
        if (this.totalItems) {
            lastInPage = Math.min(lastInPage, this.totalItems - 1);
        }
        return lastInPage;
    }
    /**
     * Moves to the previous page if it exists
     */
    previous() {
        if (this.current > 1) {
            this.current--;
        }
    }
    /**
     * Moves to the next page if it exists
     */
    next() {
        if (this.current < this.last) {
            this.current++;
        }
    }
    /**
     * Resets the page size to 0
     */
    resetPageSize(preventEmit = false) {
        this.preventEmit = preventEmit;
        this.size = 0;
    }
}
Page.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: Page, deps: [{ token: i1.StateDebouncer }], target: i0.ɵɵFactoryTarget.Injectable });
Page.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: Page });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: Page, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.StateDebouncer }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvcHJvdmlkZXJzL3BhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7OztBQUsvQixNQUFNLE9BQU8sSUFBSTtJQStCZixZQUFvQixjQUE4QjtRQUE5QixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUE5QmxELGNBQVMsR0FBRyxLQUFLLENBQUM7UUFFbEI7O1dBRUc7UUFDSyxVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBWWxCOztXQUVHO1FBQ0ssYUFBUSxHQUFHLENBQUMsQ0FBQztRQUVyQjs7V0FFRztRQUNLLFlBQU8sR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFDO1FBRWhDLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLGdCQUFXLEdBQUcsSUFBSSxPQUFPLEVBQVUsQ0FBQztJQUVTLENBQUM7SUFFdEQsSUFBSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFDRCxJQUFJLElBQUksQ0FBQyxJQUFZO1FBQ25CLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDM0IsSUFBSSxJQUFJLEtBQUssT0FBTyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNyQixJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQ25DO1lBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDbEIsSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFO2dCQUNkLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO2FBQ25CO2lCQUFNO2dCQUNMLDBF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LEtBQUssQ0FBQyxFQUFFO1lBQzFCLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDWDtRQUVELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7WUFDbkIsT0FBTyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztTQUM1QjtRQUNELElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDOUMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ3hEO1FBQ0QsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLEVBQUU7WUFDcEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2hCO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSTtRQUNGLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQzVCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNoQjtJQUNILENBQUM7SUFFRDs7T0FFRztJQUNILGFBQWEsQ0FBQyxXQUFXLEdBQUcsS0FBSztRQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNoQixDQUFDOztpR0FuS1UsSUFBSTtxR0FBSixJQUFJOzJGQUFKLElBQUk7a0JBRGhCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgU3RhdGVEZWJvdW5jZXIgfSBmcm9tICcuL3N0YXRlLWRlYm91bmNlci5wcm92aWRlcic7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQYWdlIHtcbiAgYWN0aXZhdGVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFBhZ2Ugc2l6ZSwgYSB2YWx1ZSBvZiAwIG1lYW5zIG5vIHBhZ2luYXRpb25cbiAgICovXG4gIHByaXZhdGUgX3NpemUgPSAwO1xuXG4gIC8qKlxuICAgKiBUb3RhbCBpdGVtcyAobmVlZGVkIHRvIGd1ZXNzIHRoZSBsYXN0IHBhZ2UpXG4gICAqL1xuICBwcml2YXRlIF90b3RhbEl0ZW1zPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBMYXN0IHBhZ2VcbiAgICovXG4gIHByaXZhdGUgX2xhc3Q6IG51bWJlcjtcblxuICAvKipcbiAgICogQ3VycmVudCBwYWdlXG4gICAqL1xuICBwcml2YXRlIF9jdXJyZW50ID0gMTtcblxuICAvKipcbiAgICogVGhlIE9ic2VydmFibGUgdGhhdCBsZXRzIG90aGVyIGNsYXNzZXMgc3Vic2NyaWJlIHRvIHBhZ2UgY2hhbmdlc1xuICAgKi9cbiAgcHJpdmF0ZSBfY2hhbmdlID0gbmV3IFN1YmplY3Q8bnVtYmVyPigpO1xuXG4gIHByaXZhdGUgcHJldmVudEVtaXQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfc2l6ZUNoYW5nZSA9IG5ldyBTdWJqZWN0PG51bWJlcj4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHN0YXRlRGVib3VuY2VyOiBTdGF0ZURlYm91bmNlcikge31cblxuICBnZXQgc2l6ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9zaXplO1xuICB9XG4gIHNldCBzaXplKHNpemU6IG51bWJlcikge1xuICAgIGNvbnN0IG9sZFNpemUgPSB0aGlzLl9zaXplO1xuICAgIGlmIChzaXplICE9PSBvbGRTaXplKSB7XG4gICAgICBpZiAoIXRoaXMucHJldmVudEVtaXQpIHtcbiAgICAgICAgdGhpcy5zdGF0ZURlYm91bmNlci5jaGFuZ2VTdGFydCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5fc2l6ZSA9IHNpemU7XG4gICAgICBpZiAoc2l6ZSA9PT0gMCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50ID0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFllYXAuIFRoYXQncyB0aGUgZm9ybXVsYSB0byBrZWVwIHRoZSBmaXJzdCBpdGVtIGZyb20gdGhlIG9sZCBwYWdlIHN0aWxsXG4gICAgICAgIC8vIGRpc3BsYXllZCBpbiB0aGUgbmV3IG9uZS5cbiAgICAgICAgdGhpcy5fY3VycmVudCA9IE1hdGguZmxvb3IoKG9sZFNpemUgLyBzaXplKSAqICh0aGlzLl9jdXJyZW50IC0gMSkpICsgMTtcbiAgICAgIH1cbiAgICAgIC8vIFdlIGFsd2F5cyBlbWl0IGFuIGV2ZW50IGV2ZW4gaWYgdGhlIGN1cnJlbnQgcGFnZSBpbmRleCBkaWRuJ3QgY2hhbmdlLCBiZWNhdXNlXG4gICAgICAvLyB0aGUgc2l6ZSBjaGFuZ2luZyBtZWFucyB0aGUgaXRlbXMgaW5zaWRlIHRoZSBwYWdlIGFyZSBkaWZmZXJlbnRcbiAgICAgIGlmICghdGhpcy5wcmV2ZW50RW1pdCkge1xuICAgICAgICB0aGlzLl9jaGFuZ2UubmV4dCh0aGlzLl9jdXJyZW50KTtcbiAgICAgICAgdGhpcy5fc2l6ZUNoYW5nZS5uZXh0KHRoaXMuX3NpemUpO1xuICAgICAgICB0aGlzLnN0YXRlRGVib3VuY2VyLmNoYW5nZURvbmUoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wcmV2ZW50RW1pdCA9IGZhbHNlO1xuICB9XG5cbiAgZ2V0IHRvdGFsSXRlbXMoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fdG90YWxJdGVtcyB8fCAwOyAvLyByZW1haW5zIDAgaWYgbm90IHNldCB0byBhdm9pZCBicmVha2luZyBjaGFuZ2VcbiAgfVxuICBzZXQgdG90YWxJdGVtcyh0b3RhbDogbnVtYmVyKSB7XG4gICAgdGhpcy5fdG90YWxJdGVtcyA9IHRvdGFsO1xuICAgIC8vIElmIHdlIGhhdmUgbGVzcyBpdGVtcyB0aGFuIGJlZm9yZSwgd2UgbWlnaHQgbmVlZCB0byBjaGFuZ2UgdGhlIGN1cnJlbnQgcGFnZVxuICAgIGlmICh0aGlzLmN1cnJlbnQgPiB0aGlzLmxhc3QpIHtcbiAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMubGFzdDtcbiAgICB9XG4gIH1cblxuICBnZXQgbGFzdCgpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLl9sYXN0KSB7XG4gICAgICByZXR1cm4gdGhpcy5fbGFzdDtcbiAgICB9XG4gICAgLy8gSWYgdGhlIGxhc3QgcGFnZSBpc24ndCBrbm93biwgd2UgY29tcHV0ZSBpdCBmcm9tIHRoZSBsYXN0IGl0ZW0ncyBpbmRleFxuICAgIGlmICh0aGlzLnNpemUgPiAwICYmIHRoaXMudG90YWxJdGVtcykge1xuICAgICAgcmV0dXJuIE1hdGguY2VpbCh0aGlzLnRvdGFsSXRlbXMgLyB0aGlzLnNpemUpO1xuICAgIH1cbiAgICByZXR1cm4gMTtcbiAgfVxuICBzZXQgbGFzdChwYWdlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9sYXN0ID0gcGFnZTtcbiAgfVxuXG4gIC8vIFdlIGRvIG5vdCB3YW50IHRvIGV4cG9zZSB0aGUgU3ViamVjdCBpdHNlbGYsIGJ1dCB0aGUgT2JzZXJ2YWJsZSB3aGljaCBpcyByZWFkLW9ubHlcbiAgZ2V0IGNoYW5nZSgpOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xuICAgIHJldHVybiB0aGlzLl9jaGFuZ2UuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBnZXQgc2l6ZUNoYW5nZSgpOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xuICAgIHJldHVybiB0aGlzLl9zaXplQ2hhbmdlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudDtcbiAgfVxuICBzZXQgY3VycmVudChwYWdlOiBudW1iZXIpIHtcbiAgICBpZiAocGFnZSAhPT0gdGhpcy5fY3VycmVudCkge1xuICAgICAgdGhpcy5zdGF0ZURlYm91bmNlci5jaGFuZ2VTdGFydCgpO1xuICAgICAgdGhpcy5fY3VycmVudCA9IHBhZ2U7XG4gICAgICB0aGlzLl9jaGFuZ2UubmV4dChwYWdlKTtcbiAgICAgIHRoaXMuc3RhdGVEZWJvdW5jZXIuY2hhbmdlRG9uZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRleCBvZiB0aGUgZmlyc3QgaXRlbSBkaXNwbGF5ZWQgb24gdGhlIGN1cnJlbnQgcGFnZSwgc3RhcnRpbmcgYXQgMCwgLTEgaWYgbm9uZSBkaXNwbGF5ZWRcbiAgICovXG4gIGdldCBmaXJzdEl0ZW0oKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5fdG90YWxJdGVtcyA9PT0gMCkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICByZXR1cm4gKHRoaXMuY3VycmVudCAtIDEpICogdGhpcy5zaXplO1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGV4IG9mIHRoZSBsYXN0IGl0ZW0gZGlzcGxheWVkIG9uIHRoZSBjdXJyZW50IHBhZ2UsIHN0YXJ0aW5nIGF0IDAsIC0xIGlmIG5vbmUgZGlzcGxheWVkXG4gICAqL1xuICBnZXQgbGFzdEl0ZW0oKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5fdG90YWxJdGVtcyA9PT0gMCkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnRvdGFsSXRlbXMgLSAxO1xuICAgIH1cbiAgICBsZXQgbGFzdEluUGFnZSA9IHRoaXMuY3VycmVudCAqIHRoaXMuc2l6ZSAtIDE7XG4gICAgaWYgKHRoaXMudG90YWxJdGVtcykge1xuICAgICAgbGFzdEluUGFnZSA9IE1hdGgubWluKGxhc3RJblBhZ2UsIHRoaXMudG90YWxJdGVtcyAtIDEpO1xuICAgIH1cbiAgICByZXR1cm4gbGFzdEluUGFnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlcyB0byB0aGUgcHJldmlvdXMgcGFnZSBpZiBpdCBleGlzdHNcbiAgICovXG4gIHByZXZpb3VzKCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnQgPiAxKSB7XG4gICAgICB0aGlzLmN1cnJlbnQtLTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTW92ZXMgdG8gdGhlIG5leHQgcGFnZSBpZiBpdCBleGlzdHNcbiAgICovXG4gIG5leHQoKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudCA8IHRoaXMubGFzdCkge1xuICAgICAgdGhpcy5jdXJyZW50Kys7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgcGFnZSBzaXplIHRvIDBcbiAgICovXG4gIHJlc2V0UGFnZVNpemUocHJldmVudEVtaXQgPSBmYWxzZSk6IHZvaWQge1xuICAgIHRoaXMucHJldmVudEVtaXQgPSBwcmV2ZW50RW1pdDtcbiAgICB0aGlzLnNpemUgPSAwO1xuICB9XG59XG4iXX0=