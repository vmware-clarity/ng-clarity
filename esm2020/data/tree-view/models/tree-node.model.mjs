/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { BehaviorSubject } from 'rxjs';
import { ClrSelectedState } from './selected-state.enum';
export class TreeNodeModel {
    constructor() {
        this.loading$ = new BehaviorSubject(false);
        this.selected = new BehaviorSubject(ClrSelectedState.UNSELECTED);
        /*
         * Being able to push this down to the RecursiveTreeNodeModel would require too much work on the angular components
         * right now for them to know which kind of model they are using. So I'm lifting the public properties to this
         * abstract parent class for now and we can revisit it later, when we're not facing such a close deadline.
         */
        this._loading = false;
    }
    get loading() {
        return this._loading;
    }
    set loading(isLoading) {
        this._loading = isLoading;
        this.loading$.next(isLoading);
    }
    get disabled() {
        // when both parameters are undefined, double negative is needed to cast to false, otherwise will return undefined.
        return !!(this._disabled || this.parent?.disabled);
    }
    set disabled(value) {
        this._disabled = value;
    }
    destroy() {
        // Just to be safe
        this.selected.complete();
    }
    // Propagate by default when eager, don't propagate in the lazy-loaded tree.
    setSelected(state, propagateUp, propagateDown) {
        if (state === this.selected.value) {
            return;
        }
        this.selected.next(state);
        if (propagateDown && state !== ClrSelectedState.INDETERMINATE && this.children) {
            this.children.forEach(child => {
                if (!child.disabled) {
                    child.setSelected(state, false, true);
                }
            });
        }
        if (propagateUp && this.parent) {
            this.parent._updateSelectionFromChildren();
        }
    }
    toggleSelection(propagate) {
        if (this.disabled) {
            return;
        }
        // Both unselected and indeterminate toggle to selected
        const newState = this.selected.value === ClrSelectedState.SELECTED ? ClrSelectedState.UNSELECTED : ClrSelectedState.SELECTED;
        // NOTE: we always propagate selection up in this method because it is only called when the user takes an action.
        // It should never be called from lifecycle hooks or app-provided inputs.
        this.setSelected(newState, true, propagate);
    }
    /*
     * Internal, but needs to be called by other nodes
     */
    _updateSelectionFromChildren() {
        const newState = this.computeSelectionStateFromChildren();
        if (newState === this.selected.value) {
            return;
        }
        this.selected.next(newState);
        if (this.parent) {
            this.parent._updateSelectionFromChildren();
        }
    }
    computeSelectionStateFromChildren() {
        let oneSelected = false;
        let oneUnselected = false;
        // Using a good old for loop to exit as soon as we can tell, for better performance on large trees.
        for (const child of this.children) {
            switch (child.selected.value) {
                case ClrSelectedState.INDETERMINATE:
                    if (child.disabled) {
                        continue;
                    }
                    return ClrSelectedState.INDETERMINATE;
                case ClrSelectedState.SELECTED:
                    oneSelected = true;
                    if (oneUnselected) {
                        return ClrSelectedState.INDETERMINATE;
                    }
                    break;
                case ClrSelectedState.UNSELECTED:
                default:
                    // Default is the same as unselected, in case an undefined somehow made it all the way here.
                    oneUnselected = true;
                    if (oneSelected) {
                        return ClrSelectedState.INDETERMINATE;
                    }
                    break;
            }
        }
        if (!oneSelected) {
            return ClrSelectedState.UNSELECTED;
        }
        else if (!oneUnselected) {
            return ClrSelectedState.SELECTED;
        }
        else {
            return ClrSelectedState.UNSELECTED;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1ub2RlLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS90cmVlLXZpZXcvbW9kZWxzL3RyZWUtbm9kZS5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFdkMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFekQsTUFBTSxPQUFnQixhQUFhO0lBQW5DO1FBS0UsYUFBUSxHQUFHLElBQUksZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLGFBQVEsR0FBRyxJQUFJLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUU1RDs7OztXQUlHO1FBQ0ssYUFBUSxHQUFHLEtBQUssQ0FBQztJQWtIM0IsQ0FBQztJQXJHQyxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUNELElBQUksT0FBTyxDQUFDLFNBQWtCO1FBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1FBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDVixtSEFBbUg7UUFDbkgsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUNELElBQUksUUFBUSxDQUFDLEtBQWM7UUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQUVELE9BQU87UUFDTCxrQkFBa0I7UUFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQixDQUFD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QkFBZ0IsQ0FBQyxRQUFRLENBQUM7U0FDbEM7YUFBTTtZQUNMLE9BQU8sZ0JBQWdCLENBQUMsVUFBVSxDQUFDO1NBQ3BDO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQ2xyU2VsZWN0ZWRTdGF0ZSB9IGZyb20gJy4vc2VsZWN0ZWQtc3RhdGUuZW51bSc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUcmVlTm9kZU1vZGVsPFQ+IHtcbiAgbm9kZUlkOiBzdHJpbmc7XG4gIGV4cGFuZGVkOiBib29sZWFuO1xuICBtb2RlbDogVCB8IG51bGw7XG4gIHRleHRDb250ZW50OiBzdHJpbmc7XG4gIGxvYWRpbmckID0gbmV3IEJlaGF2aW9yU3ViamVjdChmYWxzZSk7XG4gIHNlbGVjdGVkID0gbmV3IEJlaGF2aW9yU3ViamVjdChDbHJTZWxlY3RlZFN0YXRlLlVOU0VMRUNURUQpO1xuXG4gIC8qXG4gICAqIEJlaW5nIGFibGUgdG8gcHVzaCB0aGlzIGRvd24gdG8gdGhlIFJlY3Vyc2l2ZVRyZWVOb2RlTW9kZWwgd291bGQgcmVxdWlyZSB0b28gbXVjaCB3b3JrIG9uIHRoZSBhbmd1bGFyIGNvbXBvbmVudHNcbiAgICogcmlnaHQgbm93IGZvciB0aGVtIHRvIGtub3cgd2hpY2gga2luZCBvZiBtb2RlbCB0aGV5IGFyZSB1c2luZy4gU28gSSdtIGxpZnRpbmcgdGhlIHB1YmxpYyBwcm9wZXJ0aWVzIHRvIHRoaXNcbiAgICogYWJzdHJhY3QgcGFyZW50IGNsYXNzIGZvciBub3cgYW5kIHdlIGNhbiByZXZpc2l0IGl0IGxhdGVyLCB3aGVuIHdlJ3JlIG5vdCBmYWNpbmcgc3VjaCBhIGNsb3NlIGRlYWRsaW5lLlxuICAgKi9cbiAgcHJpdmF0ZSBfbG9hZGluZyA9IGZhbHNlO1xuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbjtcblxuICAvKlxuICAgKiBJZGVhbGx5LCBJIHdvdWxkIGxpa2UgdG8gdXNlIGEgcG9seW1vcnBoaWMgdGhpcyB0eXBlIGhlcmUgdG8gZW5zdXJlIGhvbW9nZW5laXR5IG9mIHRoZSB0cmVlLCBzb21ldGhpbmcgbGlrZTpcbiAgICogYWJzdHJhY3QgcGFyZW50OiB0aGlzPFQ+IHwgbnVsbDtcbiAgICogYWJzdHJhY3QgY2hpbGRyZW46IHRoaXM8VD5bXTtcbiAgICogQnV0IEknbSBoaXR0aW5nIGxpbWl0YXRpb25zIG9uIHR5cGVzY3JpcHQgbm90IGFsbG93aW5nIHRoYXQgdHlwZSBpbiBjb25zdHJ1Y3RvcnMgb3Igc3RhdGljIG1ldGhvZHMuXG4gICAqIFNvIEknbSByZXNvcnRpbmcgdG8gZm9yY2luZyBvdmVycmlkZSB3aXRoIG1vcmUgcHJlY2lzZSB0eXBlcyBieSBtYXJraW5nIHRoZXNlIGFic3RyYWN0LlxuICAgKi9cbiAgYWJzdHJhY3QgcGFyZW50OiBUcmVlTm9kZU1vZGVsPFQ+IHwgbnVsbDtcbiAgYWJzdHJhY3QgY2hpbGRyZW46IFRyZWVOb2RlTW9kZWw8VD5bXTtcblxuICBnZXQgbG9hZGluZygpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9hZGluZztcbiAgfVxuICBzZXQgbG9hZGluZyhpc0xvYWRpbmc6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9sb2FkaW5nID0gaXNMb2FkaW5nO1xuICAgIHRoaXMubG9hZGluZyQubmV4dChpc0xvYWRpbmcpO1xuICB9XG5cbiAgZ2V0IGRpc2FibGVkKCkge1xuICAgIC8vIHdoZW4gYm90aCBwYXJhbWV0ZXJzIGFyZSB1bmRlZmluZWQsIGRvdWJsZSBuZWdhdGl2ZSBpcyBuZWVkZWQgdG8gY2FzdCB0byBmYWxzZSwgb3RoZXJ3aXNlIHdpbGwgcmV0dXJuIHVuZGVmaW5lZC5cbiAgICByZXR1cm4gISEodGhpcy5fZGlzYWJsZWQgfHwgdGhpcy5wYXJlbnQ/LmRpc2FibGVkKTtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICAvLyBKdXN0IHRvIGJlIHNhZmVcbiAgICB0aGlzLnNlbGVjdGVkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvLyBQcm9wYWdhdGUgYnkgZGVmYXVsdCB3aGVuIGVhZ2VyLCBkb24ndCBwcm9wYWdhdGUgaW4gdGhlIGxhenktbG9hZGVkIHRyZWUuXG4gIHNldFNlbGVjdGVkKHN0YXRlOiBDbHJTZWxlY3RlZFN0YXRlLCBwcm9wYWdhdGVVcDogYm9vbGVhbiwgcHJvcGFnYXRlRG93bjogYm9vbGVhbikge1xuICAgIGlmIChzdGF0ZSA9PT0gdGhpcy5zZWxlY3RlZC52YWx1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnNlbGVjdGVkLm5leHQoc3RhdGUpO1xuICAgIGlmIChwcm9wYWdhdGVEb3duICYmIHN0YXRlICE9PSBDbHJTZWxlY3RlZFN0YXRlLklOREVURVJNSU5BVEUgJiYgdGhpcy5jaGlsZHJlbikge1xuICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgaWYgKCFjaGlsZC5kaXNhYmxlZCkge1xuICAgICAgICAgIGNoaWxkLnNldFNlbGVjdGVkKHN0YXRlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAocHJvcGFnYXRlVXAgJiYgdGhpcy5wYXJlbnQpIHtcbiAgICAgIHRoaXMucGFyZW50Ll91cGRhdGVTZWxlY3Rpb25Gcm9tQ2hpbGRyZW4oKTtcbiAgICB9XG4gIH1cblxuICB0b2dnbGVTZWxlY3Rpb24ocHJvcGFnYXRlOiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBCb3RoIHVuc2VsZWN0ZWQgYW5kIGluZGV0ZXJtaW5hdGUgdG9nZ2xlIHRvIHNlbGVjdGVkXG4gICAgY29uc3QgbmV3U3RhdGUgPVxuICAgICAgdGhpcy5zZWxlY3RlZC52YWx1ZSA9PT0gQ2xyU2VsZWN0ZWRTdGF0ZS5TRUxFQ1RFRCA/IENsclNlbGVjdGVkU3RhdGUuVU5TRUxFQ1RFRCA6IENsclNlbGVjdGVkU3RhdGUuU0VMRUNURUQ7XG4gICAgLy8gTk9URTogd2UgYWx3YXlzIHByb3BhZ2F0ZSBzZWxlY3Rpb24gdXAgaW4gdGhpcyBtZXRob2QgYmVjYXVzZSBpdCBpcyBvbmx5IGNhbGxlZCB3aGVuIHRoZSB1c2VyIHRha2VzIGFuIGFjdGlvbi5cbiAgICAvLyBJdCBzaG91bGQgbmV2ZXIgYmUgY2FsbGVkIGZyb20gbGlmZWN5Y2xlIGhvb2tzIG9yIGFwcC1wcm92aWRlZCBpbnB1dHMuXG4gICAgdGhpcy5zZXRTZWxlY3RlZChuZXdTdGF0ZSwgdHJ1ZSwgcHJvcGFnYXRlKTtcbiAgfVxuXG4gIC8qXG4gICAqIEludGVybmFsLCBidXQgbmVlZHMgdG8gYmUgY2FsbGVkIGJ5IG90aGVyIG5vZGVzXG4gICAqL1xuICBfdXBkYXRlU2VsZWN0aW9uRnJvbUNoaWxkcmVuKCkge1xuICAgIGNvbnN0IG5ld1N0YXRlID0gdGhpcy5jb21wdXRlU2VsZWN0aW9uU3RhdGVGcm9tQ2hpbGRyZW4oKTtcbiAgICBpZiAobmV3U3RhdGUgPT09IHRoaXMuc2VsZWN0ZWQudmFsdWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3RlZC5uZXh0KG5ld1N0YXRlKTtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIHRoaXMucGFyZW50Ll91cGRhdGVTZWxlY3Rpb25Gcm9tQ2hpbGRyZW4oKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNvbXB1dGVTZWxlY3Rpb25TdGF0ZUZyb21DaGlsZHJlbigpIHtcbiAgICBsZXQgb25lU2VsZWN0ZWQgPSBmYWxzZTtcbiAgICBsZXQgb25lVW5zZWxlY3RlZCA9IGZhbHNlO1xuICAgIC8vIFVzaW5nIGEgZ29vZCBvbGQgZm9yIGxvb3AgdG8gZXhpdCBhcyBzb29uIGFzIHdlIGNhbiB0ZWxsLCBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlIG9uIGxhcmdlIHRyZWVzLlxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgc3dpdGNoIChjaGlsZC5zZWxlY3RlZC52YWx1ZSkge1xuICAgICAgICBjYXNlIENsclNlbGVjdGVkU3RhdGUuSU5ERVRFUk1JTkFURTpcbiAgICAgICAgICBpZiAoY2hpbGQuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gQ2xyU2VsZWN0ZWRTdGF0ZS5JTkRFVEVSTUlOQVRFO1xuICAgICAgICBjYXNlIENsclNlbGVjdGVkU3RhdGUuU0VMRUNURUQ6XG4gICAgICAgICAgb25lU2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgIGlmIChvbmVVbnNlbGVjdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gQ2xyU2VsZWN0ZWRTdGF0ZS5JTkRFVEVSTUlOQVRFO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBDbHJTZWxlY3RlZFN0YXRlLlVOU0VMRUNURUQ6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgLy8gRGVmYXVsdCBpcyB0aGUgc2FtZSBhcyB1bnNlbGVjdGVkLCBpbiBjYXNlIGFuIHVuZGVmaW5lZCBzb21laG93IG1hZGUgaXQgYWxsIHRoZSB3YXkgaGVyZS5cbiAgICAgICAgICBvbmVVbnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAob25lU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBDbHJTZWxlY3RlZFN0YXRlLklOREVURVJNSU5BVEU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIW9uZVNlbGVjdGVkKSB7XG4gICAgICByZXR1cm4gQ2xyU2VsZWN0ZWRTdGF0ZS5VTlNFTEVDVEVEO1xuICAgIH0gZWxzZSBpZiAoIW9uZVVuc2VsZWN0ZWQpIHtcbiAgICAgIHJldHVybiBDbHJTZWxlY3RlZFN0YXRlLlNFTEVDVEVEO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gQ2xyU2VsZWN0ZWRTdGF0ZS5VTlNFTEVDVEVEO1xuICAgIH1cbiAgfVxufVxuIl19