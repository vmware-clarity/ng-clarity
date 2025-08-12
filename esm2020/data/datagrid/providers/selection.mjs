/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SelectionType } from '../enums/selection-type';
import * as i0 from "@angular/core";
import * as i1 from "./items";
import * as i2 from "./filters";
let nbSelection = 0;
export class Selection {
    constructor(_items, filters) {
        this._items = _items;
        this.preserveSelection = false;
        /**
         * Shift key state, for use in range selection.
         */
        this.shiftPressed = false;
        /** @deprecated since 2.0, remove in 3.0 */
        this.rowSelectionMode = false;
        this.prevSelectionRefs = []; // Refs of selected items
        this.lockedRefs = []; // Ref of locked items
        this.valueCollector = new Subject();
        this._selectionType = SelectionType.None;
        /**
         * The Observable that lets other classes subscribe to selection changes
         */
        this._change = new Subject();
        /**
         * Subscriptions to the other providers changes.
         */
        this.subscriptions = [];
        this.id = 'clr-dg-selection' + nbSelection++;
        this.subscriptions.push(filters.change.subscribe(() => {
            if (!this._selectable || this.preserveSelection) {
                return;
            }
            this.clearSelection();
        }));
        this.subscriptions.push(_items.allChanges.subscribe(updatedItems => {
            // Reset the lockedRefs;
            const updateLockedRef = [];
            switch (this.selectionType) {
                case SelectionType.None: {
                    break;
                }
                case SelectionType.Single: {
                    let newSingle;
                    let selectionUpdated = false;
                    // if the currentSingle has been set before data was loaded, we look up and save the ref from current data set
                    if (this.currentSingle && !this.prevSingleSelectionRef) {
                        this.prevSingleSelectionRef = _items.trackBy(this.currentSingle);
                    }
                    updatedItems.forEach(item => {
                        const ref = _items.trackBy(item);
                        // If one of the updated items is the previously selectedSingle, set it as the new one
                        if (this.prevSingleSelectionRef === ref) {
                            newSingle = item;
                            selectionUpdated = true;
                        }
                        if (this.lockedRefs.indexOf(ref) > -1) {
                            updateLockedRef.push(ref);
                        }
                    });
                    // If we're using smart datagrids, we expect all items to be present in the updatedItems array.
                    // Therefore, we should delete the currentSingle if it used to be defined but doesn't exist anymore.
                    // No explicit "delete" is required, since newSingle would be undefined at this point.
                    // Marking it as selectionUpdated here will set currentSingle to undefined below in the setTimeout.
                    if (_items.smart && !newSingle) {
                        selectionUpdated = true;
                    }
                    // TODO: Discussed this with Eudes and this is fine for now.
                    // But we need to figure out a different pattern for the
                    // child triggering the parent change detection problem.
                    // Using setTimeout for now to fix this.
                    setTimeout(() => {
                        if (selectionUpdated) {
                            this.currentSingle = newSingle;
                        }
                    }, 0);
                    break;
                }
                case SelectionType.Multi: {
                    let leftOver = this.current.slice();
                    let selectionUpdated = false;
                    // if the current has been set before data was loaded, we look up and save the ref from current data set
                    if (this.current.length > 0 && this.prevSelectionRefs.length !== this.current.length) {
                        this.prevSelectionRefs = [];
                        this.current.forEach(item => {
                            this.prevSelectionRefs.push(_items.trackBy(item));
                        });
                    }
                    // Duplicate loop, when the issue is issue#2342 is revisited keep in mind that
                    // we need to go over every updated item and check to see if there are valid to be
                    // locked or not and update it. When only add items that are found in the lockedRefs back.
                    //
                    // The both loops below that goes over updatedItems could be combined into one.
                    updatedItems.forEach(item => {
                        const ref = _items.trackBy(item);
                        if (this.lockedRefs.indexOf(ref) > -1) {
                            updateLockedRef.push(ref);
                        }
                    });
                    // TODO: revisit this when we work on https://github.com/vmware/clarity/issues/2342
                    // currently, the selection is cleared when filter is applied, so the logic inside
                    // the if statement below results in broken behavior.
                    if (leftOver.length > 0) {
                        updatedItems.forEach(item => {
                            const ref = _items.trackBy(item);
                            // Look in current selected refs array if item is selected, and update actual value
                            const selectedIndex = this.prevSelectionRefs.indexOf(ref);
                            if (selectedIndex > -1) {
                                leftOver[selectedIndex] = item;
                                selectionUpdated = true;
                            }
                        });
                        // Filter out any unmatched items if we're using smart datagrids where we expect all items to be
                        // present
                        if (_items.smart) {
                            leftOver = leftOver.filter(selected => updatedItems.indexOf(selected) > -1);
                            if (this.current.length !== leftOver.length) {
                                selectionUpdated = true;
                            }
                        }
                        // TODO: Discussed this with Eudes and this is fine for now.
                        // But we need to figure out a different pattern for the
                        // child triggering the parent change detection problem.
                        // Using setTimeout for now to fix this.
                        setTimeout(() => {
                            if (selectionUpdated) {
                                this.current = leftOver;
                            }
                        }, 0);
                    }
                    break;
                }
                default: {
                    break;
                }
            }
            // Sync locked items
            this.lockedRefs = updateLockedRef;
        }));
        this.subscriptions.push(this.valueCollector.pipe(debounceTime(0)).subscribe(() => this.emitChange()));
    }
    get selectionType() {
        return this._selectionType;
    }
    set selectionType(value) {
        if (value === this.selectionType) {
            return;
        }
        this._selectionType = value;
        if (value === SelectionType.None) {
            delete this.current;
        }
        else {
            this.updateCurrent([], false);
        }
    }
    get current() {
        return this._current;
    }
    set current(value) {
        this.updateCurrent(value, true);
    }
    get currentSingle() {
        return this._currentSingle;
    }
    set currentSingle(value) {
        if (value === this._currentSingle) {
            return;
        }
        this._currentSingle = value;
        if (value) {
            this.prevSingleSelectionRef = this._items.trackBy(value);
        }
        this.emitChange();
    }
    // We do not want to expose the Subject itself, but the Observable which is read-only
    get change() {
        return this._change.asObservable();
    }
    get _selectable() {
        return this._selectionType === SelectionType.Multi || this._selectionType === SelectionType.Single;
    }
    clearSelection() {
        this._current = [];
        this.prevSelectionRefs = [];
        this.prevSingleSelectionRef = null;
        this._currentSingle = null;
        this.emitChange();
    }
    /**
     * Cleans up our subscriptions to other providers
     */
    destroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    updateCurrent(value, emit) {
        this._current = value;
        if (emit) {
            this.valueCollector.next(value);
        }
    }
    /**
     * Checks if an item is currently selected
     */
    isSelected(item) {
        if (this._selectionType === SelectionType.Single) {
            return this.currentSingle === item;
        }
        else if (this._selectionType === SelectionType.Multi) {
            return this.current.indexOf(item) >= 0;
        }
        return false;
    }
    /**
     * Selects or deselects an item
     */
    setSelected(item, selected) {
        const index = this.current ? this.current.indexOf(item) : -1;
        switch (this._selectionType) {
            case SelectionType.None:
                break;
            case SelectionType.Single:
                // in single selection, set currentSingle method should be used
                break;
            case SelectionType.Multi:
                if (index >= 0 && !selected) {
                    this.deselectItem(index);
                }
                else if (index < 0 && selected) {
                    this.selectItem(item);
                }
                break;
            default:
                break;
        }
    }
    /**
     * Checks if all currently displayed items are selected
     */
    isAllSelected() {
        if (this._selectionType !== SelectionType.Multi || !this._items.displayed) {
            return false;
        }
        // make sure to exclude the locked items from the list when counting
        const displayedItems = this._items.displayed.filter(item => {
            return this.isLocked(item) === false;
        });
        const nbDisplayed = displayedItems.length;
        if (nbDisplayed < 1) {
            return false;
        }
        const temp = displayedItems.filter(item => this.current.indexOf(item) > -1);
        return temp.length === displayedItems.length;
    }
    /**
     * Lock and unlock item
     */
    lockItem(item, lock) {
        if (this.canItBeLocked()) {
            const ref = this._items.trackBy(item);
            if (lock === true) {
                // Add to lockedRef
                this.lockedRefs.push(ref);
            }
            else {
                // Remove from lockedRef
                this.lockedRefs = this.lockedRefs.filter(lockedItem => ref !== lockedItem);
            }
        }
    }
    /**
     * Check is item locked or not by searching into lockedRefs for entry
     */
    isLocked(item) {
        /**
         * The check for selectionType will boost the performance by NOT searching
         * into the array when there is no need for that.
         */
        if (this.canItBeLocked()) {
            const ref = this._items.trackBy(item);
            return this.lockedRefs.indexOf(ref) > -1;
        }
        return false;
    }
    /**
     * Selects or deselects all currently displayed items
     */
    toggleAll() {
        if (this._selectionType === SelectionType.None || this._selectionType === SelectionType.Single) {
            return;
        }
        /**
         * If every currently displayed item is already selected, we clear them.
         * If at least one item isn't selected, we select every currently displayed item.
         */
        if (this.isAllSelected()) {
            this._items.displayed.forEach(item => {
                const currentIndex = this.current.indexOf(item);
                if (currentIndex > -1 && this.isLocked(item) === false) {
                    this.deselectItem(currentIndex);
                }
            });
        }
        else {
            this._items.displayed.forEach(item => {
                if (this.current.indexOf(item) < 0 && this.isLocked(item) === false) {
                    this.selectItem(item);
                }
            });
        }
    }
    /**
     * Selects an item
     */
    selectItem(item) {
        this.current = this.current.concat(item);
        // Push selected ref onto array
        this.prevSelectionRefs.push(this._items.trackBy(item));
    }
    /**
     * Deselects an item
     */
    deselectItem(indexOfItem) {
        this.current = this.current.slice(0, indexOfItem).concat(this.current.slice(indexOfItem + 1));
        if (indexOfItem < this.prevSelectionRefs.length) {
            // Keep selected refs array in sync
            const removedItems = this.prevSelectionRefs.splice(indexOfItem, 1);
            // locked reference is no longer needed (if any)
            this.lockedRefs = this.lockedRefs.filter(locked => locked !== removedItems[0]);
        }
    }
    /**
     * Make sure that it could be locked
     */
    canItBeLocked() {
        return this._selectionType !== SelectionType.None;
    }
    emitChange() {
        if (this._selectionType === SelectionType.Single) {
            this._change.next(this.currentSingle);
        }
        else if (this._selectionType === SelectionType.Multi) {
            this._change.next(this.current);
        }
    }
}
Selection.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: Selection, deps: [{ token: i1.Items }, { token: i2.FiltersProvider }], target: i0.ɵɵFactoryTarget.Injectable });
Selection.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: Selection });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: Selection, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Items }, { type: i2.FiltersProvider }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9wcm92aWRlcnMvc2VsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsT0FBTyxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUN6RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFOUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHlCQUF5QixDQUFDOzs7O0FBSXhELElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztBQUdwQixNQUFNLE9BQU8sU0FBUztJQTJDcEIsWUFBb0IsTUFBZ0IsRUFBRSxPQUEyQjtRQUE3QyxXQUFNLEdBQU4sTUFBTSxDQUFVO1FBekNwQyxzQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFPMUI7O1dBRUc7UUFDSCxpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUVyQiwyQ0FBMkM7UUFDM0MscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBRWpCLHNCQUFpQixHQUFRLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QjtRQUV0RCxlQUFVLEdBQVEsRUFBRSxDQUFDLENBQUMsc0JBQXNCO1FBQzVDLG1CQUFjLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztRQUNwQyxtQkFBYyxHQUFrQixhQUFhLENBQUMsSUFBSSxDQUFDO1FBWTNEOztXQUVHO1FBQ0ssWUFBTyxHQUFHLElBQUksT0FBTyxFQUFXLENBQUM7UUFFekM7O1dBRUc7UUFDSyxrQkFBYSxHQUFtQixFQUFFLENBQUM7UUFHekMsSUFBSSxDQUFDLEVBQUUsR0FBRyxrQkFBa0IsR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUU3QyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDckIsT0FBTyxD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LENBQUMsQ0FBQztTQUNoRjtJQUNILENBQUM7SUFFRDs7T0FFRztJQUNLLGFBQWE7UUFDbkIsT0FBTyxJQUFJLENBQUMsY0FBYyxLQUFLLGFBQWEsQ0FBQyxJQUFJLENBQUM7SUFDcEQsQ0FBQztJQUVPLFVBQVU7UUFDaEIsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLGFBQWEsQ0FBQyxNQUFNLEVBQUU7WUFDaEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3ZDO2FBQU0sSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLGFBQWEsQ0FBQyxLQUFLLEVBQUU7WUFDdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2pDO0lBQ0gsQ0FBQzs7c0dBN1lVLFNBQVM7MEdBQVQsU0FBUzsyRkFBVCxTQUFTO2tCQURyQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgU2VsZWN0aW9uVHlwZSB9IGZyb20gJy4uL2VudW1zL3NlbGVjdGlvbi10eXBlJztcbmltcG9ydCB7IEZpbHRlcnNQcm92aWRlciB9IGZyb20gJy4vZmlsdGVycyc7XG5pbXBvcnQgeyBJdGVtcyB9IGZyb20gJy4vaXRlbXMnO1xuXG5sZXQgbmJTZWxlY3Rpb24gPSAwO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2VsZWN0aW9uPFQgPSBhbnk+IHtcbiAgaWQ6IHN0cmluZztcbiAgcHJlc2VydmVTZWxlY3Rpb24gPSBmYWxzZTtcblxuICAvKipcbiAgICogTGFzdCBzZWxlY3Rpb24sIGZvciB1c2UgaW4gcmFuZ2Ugc2VsZWN0aW9uLlxuICAgKi9cbiAgcmFuZ2VTdGFydDogVDtcblxuICAvKipcbiAgICogU2hpZnQga2V5IHN0YXRlLCBmb3IgdXNlIGluIHJhbmdlIHNlbGVjdGlvbi5cbiAgICovXG4gIHNoaWZ0UHJlc3NlZCA9IGZhbHNlO1xuXG4gIC8qKiBAZGVwcmVjYXRlZCBzaW5jZSAyLjAsIHJlbW92ZSBpbiAzLjAgKi9cbiAgcm93U2VsZWN0aW9uTW9kZSA9IGZhbHNlO1xuXG4gIHByaXZhdGUgcHJldlNlbGVjdGlvblJlZnM6IFRbXSA9IFtdOyAvLyBSZWZzIG9mIHNlbGVjdGVkIGl0ZW1zXG4gIHByaXZhdGUgcHJldlNpbmdsZVNlbGVjdGlvblJlZjogVDsgLy8gUmVmIG9mIHNpbmdsZSBzZWxlY3RlZCBpdGVtXG4gIHByaXZhdGUgbG9ja2VkUmVmczogVFtdID0gW107IC8vIFJlZiBvZiBsb2NrZWQgaXRlbXNcbiAgcHJpdmF0ZSB2YWx1ZUNvbGxlY3RvciA9IG5ldyBTdWJqZWN0PFRbXT4oKTtcbiAgcHJpdmF0ZSBfc2VsZWN0aW9uVHlwZTogU2VsZWN0aW9uVHlwZSA9IFNlbGVjdGlvblR5cGUuTm9uZTtcblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgc2VsZWN0aW9uXG4gICAqL1xuICBwcml2YXRlIF9jdXJyZW50OiBUW107XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IHNlbGVjdGlvbiBpbiBzaW5nbGUgc2VsZWN0aW9uIHR5cGVcbiAgICovXG4gIHByaXZhdGUgX2N1cnJlbnRTaW5nbGU6IFQ7XG5cbiAgLyoqXG4gICAqIFRoZSBPYnNlcnZhYmxlIHRoYXQgbGV0cyBvdGhlciBjbGFzc2VzIHN1YnNjcmliZSB0byBzZWxlY3Rpb24gY2hhbmdlc1xuICAgKi9cbiAgcHJpdmF0ZSBfY2hhbmdlID0gbmV3IFN1YmplY3Q8VFtdIHwgVD4oKTtcblxuICAvKipcbiAgICogU3Vic2NyaXB0aW9ucyB0byB0aGUgb3RoZXIgcHJvdmlkZXJzIGNoYW5nZXMuXG4gICAqL1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfaXRlbXM6IEl0ZW1zPFQ+LCBmaWx0ZXJzOiBGaWx0ZXJzUHJvdmlkZXI8VD4pIHtcbiAgICB0aGlzLmlkID0gJ2Nsci1kZy1zZWxlY3Rpb24nICsgbmJTZWxlY3Rpb24rKztcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgZmlsdGVycy5jaGFuZ2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLl9zZWxlY3RhYmxlIHx8IHRoaXMucHJlc2VydmVTZWxlY3Rpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICBfaXRlbXMuYWxsQ2hhbmdlcy5zdWJzY3JpYmUodXBkYXRlZEl0ZW1zID0+IHtcbiAgICAgICAgLy8gUmVzZXQgdGhlIGxvY2tlZFJlZnM7XG4gICAgICAgIGNvbnN0IHVwZGF0ZUxvY2tlZFJlZjogVFtdID0gW107XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLnNlbGVjdGlvblR5cGUpIHtcbiAgICAgICAgICBjYXNlIFNlbGVjdGlvblR5cGUuTm9uZToge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSBTZWxlY3Rpb25UeXBlLlNpbmdsZToge1xuICAgICAgICAgICAgbGV0IG5ld1NpbmdsZTogYW55O1xuICAgICAgICAgICAgbGV0IHNlbGVjdGlvblVwZGF0ZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnRTaW5nbGUgaGFzIGJlZW4gc2V0IGJlZm9yZSBkYXRhIHdhcyBsb2FkZWQsIHdlIGxvb2sgdXAgYW5kIHNhdmUgdGhlIHJlZiBmcm9tIGN1cnJlbnQgZGF0YSBzZXRcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRTaW5nbGUgJiYgIXRoaXMucHJldlNpbmdsZVNlbGVjdGlvblJlZikge1xuICAgICAgICAgICAgICB0aGlzLnByZXZTaW5nbGVTZWxlY3Rpb25SZWYgPSBfaXRlbXMudHJhY2tCeSh0aGlzLmN1cnJlbnRTaW5nbGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1cGRhdGVkSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgcmVmID0gX2l0ZW1zLnRyYWNrQnkoaXRlbSk7XG4gICAgICAgICAgICAgIC8vIElmIG9uZSBvZiB0aGUgdXBkYXRlZCBpdGVtcyBpcyB0aGUgcHJldmlvdXNseSBzZWxlY3RlZFNpbmdsZSwgc2V0IGl0IGFzIHRoZSBuZXcgb25lXG4gICAgICAgICAgICAgIGlmICh0aGlzLnByZXZTaW5nbGVTZWxlY3Rpb25SZWYgPT09IHJlZikge1xuICAgICAgICAgICAgICAgIG5ld1NpbmdsZSA9IGl0ZW07XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uVXBkYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHRoaXMubG9ja2VkUmVmcy5pbmRleE9mKHJlZikgPiAtMSkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZUxvY2tlZFJlZi5wdXNoKHJlZik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBJZiB3ZSdyZSB1c2luZyBzbWFydCBkYXRhZ3JpZHMsIHdlIGV4cGVjdCBhbGwgaXRlbXMgdG8gYmUgcHJlc2VudCBpbiB0aGUgdXBkYXRlZEl0ZW1zIGFycmF5LlxuICAgICAgICAgICAgLy8gVGhlcmVmb3JlLCB3ZSBzaG91bGQgZGVsZXRlIHRoZSBjdXJyZW50U2luZ2xlIGlmIGl0IHVzZWQgdG8gYmUgZGVmaW5lZCBidXQgZG9lc24ndCBleGlzdCBhbnltb3JlLlxuICAgICAgICAgICAgLy8gTm8gZXhwbGljaXQgXCJkZWxldGVcIiBpcyByZXF1aXJlZCwgc2luY2UgbmV3U2luZ2xlIHdvdWxkIGJlIHVuZGVmaW5lZCBhdCB0aGlzIHBvaW50LlxuICAgICAgICAgICAgLy8gTWFya2luZyBpdCBhcyBzZWxlY3Rpb25VcGRhdGVkIGhlcmUgd2lsbCBzZXQgY3VycmVudFNpbmdsZSB0byB1bmRlZmluZWQgYmVsb3cgaW4gdGhlIHNldFRpbWVvdXQuXG4gICAgICAgICAgICBpZiAoX2l0ZW1zLnNtYXJ0ICYmICFuZXdTaW5nbGUpIHtcbiAgICAgICAgICAgICAgc2VsZWN0aW9uVXBkYXRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRPRE86IERpc2N1c3NlZCB0aGlzIHdpdGggRXVkZXMgYW5kIHRoaXMgaXMgZmluZSBmb3Igbm93LlxuICAgICAgICAgICAgLy8gQnV0IHdlIG5lZWQgdG8gZmlndXJlIG91dCBhIGRpZmZlcmVudCBwYXR0ZXJuIGZvciB0aGVcbiAgICAgICAgICAgIC8vIGNoaWxkIHRyaWdnZXJpbmcgdGhlIHBhcmVudCBjaGFuZ2UgZGV0ZWN0aW9uIHByb2JsZW0uXG4gICAgICAgICAgICAvLyBVc2luZyBzZXRUaW1lb3V0IGZvciBub3cgdG8gZml4IHRoaXMuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvblVwZGF0ZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTaW5nbGUgPSBuZXdTaW5nbGU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSBTZWxlY3Rpb25UeXBlLk11bHRpOiB7XG4gICAgICAgICAgICBsZXQgbGVmdE92ZXI6IGFueVtdID0gdGhpcy5jdXJyZW50LnNsaWNlKCk7XG4gICAgICAgICAgICBsZXQgc2VsZWN0aW9uVXBkYXRlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyBpZiB0aGUgY3VycmVudCBoYXMgYmVlbiBzZXQgYmVmb3JlIGRhdGEgd2FzIGxvYWRlZCwgd2UgbG9vayB1cCBhbmQgc2F2ZSB0aGUgcmVmIGZyb20gY3VycmVudCBkYXRhIHNldFxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudC5sZW5ndGggPiAwICYmIHRoaXMucHJldlNlbGVjdGlvblJlZnMubGVuZ3RoICE9PSB0aGlzLmN1cnJlbnQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHRoaXMucHJldlNlbGVjdGlvblJlZnMgPSBbXTtcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2U2VsZWN0aW9uUmVmcy5wdXNoKF9pdGVtcy50cmFja0J5KGl0ZW0pKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIER1cGxpY2F0ZSBsb29wLCB3aGVuIHRoZSBpc3N1ZSBpcyBpc3N1ZSMyMzQyIGlzIHJldmlzaXRlZCBrZWVwIGluIG1pbmQgdGhhdFxuICAgICAgICAgICAgLy8gd2UgbmVlZCB0byBnbyBvdmVyIGV2ZXJ5IHVwZGF0ZWQgaXRlbSBhbmQgY2hlY2sgdG8gc2VlIGlmIHRoZXJlIGFyZSB2YWxpZCB0byBiZVxuICAgICAgICAgICAgLy8gbG9ja2VkIG9yIG5vdCBhbmQgdXBkYXRlIGl0LiBXaGVuIG9ubHkgYWRkIGl0ZW1zIHRoYXQgYXJlIGZvdW5kIGluIHRoZSBsb2NrZWRSZWZzIGJhY2suXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gVGhlIGJvdGggbG9vcHMgYmVsb3cgdGhhdCBnb2VzIG92ZXIgdXBkYXRlZEl0ZW1zIGNvdWxkIGJlIGNvbWJpbmVkIGludG8gb25lLlxuICAgICAgICAgICAgdXBkYXRlZEl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlZiA9IF9pdGVtcy50cmFja0J5KGl0ZW0pO1xuICAgICAgICAgICAgICBpZiAodGhpcy5sb2NrZWRSZWZzLmluZGV4T2YocmVmKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlTG9ja2VkUmVmLnB1c2gocmVmKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFRPRE86IHJldmlzaXQgdGhpcyB3aGVuIHdlIHdvcmsgb24gaHR0cHM6Ly9naXRodWIuY29tL3Ztd2FyZS9jbGFyaXR5L2lzc3Vlcy8yMzQyXG4gICAgICAgICAgICAvLyBjdXJyZW50bHksIHRoZSBzZWxlY3Rpb24gaXMgY2xlYXJlZCB3aGVuIGZpbHRlciBpcyBhcHBsaWVkLCBzbyB0aGUgbG9naWMgaW5zaWRlXG4gICAgICAgICAgICAvLyB0aGUgaWYgc3RhdGVtZW50IGJlbG93IHJlc3VsdHMgaW4gYnJva2VuIGJlaGF2aW9yLlxuICAgICAgICAgICAgaWYgKGxlZnRPdmVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgdXBkYXRlZEl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVmID0gX2l0ZW1zLnRyYWNrQnkoaXRlbSk7XG4gICAgICAgICAgICAgICAgLy8gTG9vayBpbiBjdXJyZW50IHNlbGVjdGVkIHJlZnMgYXJyYXkgaWYgaXRlbSBpcyBzZWxlY3RlZCwgYW5kIHVwZGF0ZSBhY3R1YWwgdmFsdWVcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RlZEluZGV4ID0gdGhpcy5wcmV2U2VsZWN0aW9uUmVmcy5pbmRleE9mKHJlZik7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgbGVmdE92ZXJbc2VsZWN0ZWRJbmRleF0gPSBpdGVtO1xuICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uVXBkYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAvLyBGaWx0ZXIgb3V0IGFueSB1bm1hdGNoZWQgaXRlbXMgaWYgd2UncmUgdXNpbmcgc21hcnQgZGF0YWdyaWRzIHdoZXJlIHdlIGV4cGVjdCBhbGwgaXRlbXMgdG8gYmVcbiAgICAgICAgICAgICAgLy8gcHJlc2VudFxuICAgICAgICAgICAgICBpZiAoX2l0ZW1zLnNtYXJ0KSB7XG4gICAgICAgICAgICAgICAgbGVmdE92ZXIgPSBsZWZ0T3Zlci5maWx0ZXIoc2VsZWN0ZWQgPT4gdXBkYXRlZEl0ZW1zLmluZGV4T2Yoc2VsZWN0ZWQpID4gLTEpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnQubGVuZ3RoICE9PSBsZWZ0T3Zlci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgIHNlbGVjdGlvblVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIC8vIFRPRE86IERpc2N1c3NlZCB0aGlzIHdpdGggRXVkZXMgYW5kIHRoaXMgaXMgZmluZSBmb3Igbm93LlxuICAgICAgICAgICAgICAvLyBCdXQgd2UgbmVlZCB0byBmaWd1cmUgb3V0IGEgZGlmZmVyZW50IHBhdHRlcm4gZm9yIHRoZVxuICAgICAgICAgICAgICAvLyBjaGlsZCB0cmlnZ2VyaW5nIHRoZSBwYXJlbnQgY2hhbmdlIGRldGVjdGlvbiBwcm9ibGVtLlxuICAgICAgICAgICAgICAvLyBVc2luZyBzZXRUaW1lb3V0IGZvciBub3cgdG8gZml4IHRoaXMuXG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rpb25VcGRhdGVkKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSBsZWZ0T3ZlcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFN5bmMgbG9ja2VkIGl0ZW1zXG4gICAgICAgIHRoaXMubG9ja2VkUmVmcyA9IHVwZGF0ZUxvY2tlZFJlZjtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHRoaXMudmFsdWVDb2xsZWN0b3IucGlwZShkZWJvdW5jZVRpbWUoMCkpLnN1YnNjcmliZSgoKSA9PiB0aGlzLmVtaXRDaGFuZ2UoKSkpO1xuICB9XG5cbiAgZ2V0IHNlbGVjdGlvblR5cGUoKTogU2VsZWN0aW9uVHlwZSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvblR5cGU7XG4gIH1cbiAgc2V0IHNlbGVjdGlvblR5cGUodmFsdWU6IFNlbGVjdGlvblR5cGUpIHtcbiAgICBpZiAodmFsdWUgPT09IHRoaXMuc2VsZWN0aW9uVHlwZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9zZWxlY3Rpb25UeXBlID0gdmFsdWU7XG4gICAgaWYgKHZhbHVlID09PSBTZWxlY3Rpb25UeXBlLk5vbmUpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmN1cnJlbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudXBkYXRlQ3VycmVudChbXSwgZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBjdXJyZW50KCk6IFRbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnQ7XG4gIH1cbiAgc2V0IGN1cnJlbnQodmFsdWU6IFRbXSkge1xuICAgIHRoaXMudXBkYXRlQ3VycmVudCh2YWx1ZSwgdHJ1ZSk7XG4gIH1cblxuICBnZXQgY3VycmVudFNpbmdsZSgpOiBUIHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFNpbmdsZTtcbiAgfVxuICBzZXQgY3VycmVudFNpbmdsZSh2YWx1ZTogVCkge1xuICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5fY3VycmVudFNpbmdsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2N1cnJlbnRTaW5nbGUgPSB2YWx1ZTtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMucHJldlNpbmdsZVNlbGVjdGlvblJlZiA9IHRoaXMuX2l0ZW1zLnRyYWNrQnkodmFsdWUpO1xuICAgIH1cbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIC8vIFdlIGRvIG5vdCB3YW50IHRvIGV4cG9zZSB0aGUgU3ViamVjdCBpdHNlbGYsIGJ1dCB0aGUgT2JzZXJ2YWJsZSB3aGljaCBpcyByZWFkLW9ubHlcbiAgZ2V0IGNoYW5nZSgpOiBPYnNlcnZhYmxlPFRbXSB8IFQ+IHtcbiAgICByZXR1cm4gdGhpcy5fY2hhbmdlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgX3NlbGVjdGFibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuTXVsdGkgfHwgdGhpcy5fc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5TaW5nbGU7XG4gIH1cblxuICBjbGVhclNlbGVjdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLl9jdXJyZW50ID0gW107XG4gICAgdGhpcy5wcmV2U2VsZWN0aW9uUmVmcyA9IFtdO1xuICAgIHRoaXMucHJldlNpbmdsZVNlbGVjdGlvblJlZiA9IG51bGw7XG4gICAgdGhpcy5fY3VycmVudFNpbmdsZSA9IG51bGw7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYW5zIHVwIG91ciBzdWJzY3JpcHRpb25zIHRvIG90aGVyIHByb3ZpZGVyc1xuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgdXBkYXRlQ3VycmVudCh2YWx1ZTogVFtdLCBlbWl0OiBib29sZWFuKSB7XG4gICAgdGhpcy5fY3VycmVudCA9IHZhbHVlO1xuXG4gICAgaWYgKGVtaXQpIHtcbiAgICAgIHRoaXMudmFsdWVDb2xsZWN0b3IubmV4dCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhbiBpdGVtIGlzIGN1cnJlbnRseSBzZWxlY3RlZFxuICAgKi9cbiAgaXNTZWxlY3RlZChpdGVtOiBUKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuU2luZ2xlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50U2luZ2xlID09PSBpdGVtO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5NdWx0aSkge1xuICAgICAgcmV0dXJuIHRoaXMuY3VycmVudC5pbmRleE9mKGl0ZW0pID49IDA7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIG9yIGRlc2VsZWN0cyBhbiBpdGVtXG4gICAqL1xuICBzZXRTZWxlY3RlZChpdGVtOiBULCBzZWxlY3RlZDogYm9vbGVhbikge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jdXJyZW50ID8gdGhpcy5jdXJyZW50LmluZGV4T2YoaXRlbSkgOiAtMTtcblxuICAgIHN3aXRjaCAodGhpcy5fc2VsZWN0aW9uVHlwZSkge1xuICAgICAgY2FzZSBTZWxlY3Rpb25UeXBlLk5vbmU6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTZWxlY3Rpb25UeXBlLlNpbmdsZTpcbiAgICAgICAgLy8gaW4gc2luZ2xlIHNlbGVjdGlvbiwgc2V0IGN1cnJlbnRTaW5nbGUgbWV0aG9kIHNob3VsZCBiZSB1c2VkXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTZWxlY3Rpb25UeXBlLk11bHRpOlxuICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiAhc2VsZWN0ZWQpIHtcbiAgICAgICAgICB0aGlzLmRlc2VsZWN0SXRlbShpbmRleCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPCAwICYmIHNlbGVjdGVkKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RJdGVtKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhbGwgY3VycmVudGx5IGRpc3BsYXllZCBpdGVtcyBhcmUgc2VsZWN0ZWRcbiAgICovXG4gIGlzQWxsU2VsZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvblR5cGUgIT09IFNlbGVjdGlvblR5cGUuTXVsdGkgfHwgIXRoaXMuX2l0ZW1zLmRpc3BsYXllZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBtYWtlIHN1cmUgdG8gZXhjbHVkZSB0aGUgbG9ja2VkIGl0ZW1zIGZyb20gdGhlIGxpc3Qgd2hlbiBjb3VudGluZ1xuICAgIGNvbnN0IGRpc3BsYXllZEl0ZW1zOiBUW10gPSB0aGlzLl9pdGVtcy5kaXNwbGF5ZWQuZmlsdGVyKGl0ZW0gPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaXNMb2NrZWQoaXRlbSkgPT09IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgY29uc3QgbmJEaXNwbGF5ZWQgPSBkaXNwbGF5ZWRJdGVtcy5sZW5ndGg7XG4gICAgaWYgKG5iRGlzcGxheWVkIDwgMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCB0ZW1wOiBUW10gPSBkaXNwbGF5ZWRJdGVtcy5maWx0ZXIoaXRlbSA9PiB0aGlzLmN1cnJlbnQuaW5kZXhPZihpdGVtKSA+IC0xKTtcbiAgICByZXR1cm4gdGVtcC5sZW5ndGggPT09IGRpc3BsYXllZEl0ZW1zLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2NrIGFuZCB1bmxvY2sgaXRlbVxuICAgKi9cbiAgbG9ja0l0ZW0oaXRlbTogVCwgbG9jazogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLmNhbkl0QmVMb2NrZWQoKSkge1xuICAgICAgY29uc3QgcmVmID0gdGhpcy5faXRlbXMudHJhY2tCeShpdGVtKTtcbiAgICAgIGlmIChsb2NrID09PSB0cnVlKSB7XG4gICAgICAgIC8vIEFkZCB0byBsb2NrZWRSZWZcbiAgICAgICAgdGhpcy5sb2NrZWRSZWZzLnB1c2gocmVmKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFJlbW92ZSBmcm9tIGxvY2tlZFJlZlxuICAgICAgICB0aGlzLmxvY2tlZFJlZnMgPSB0aGlzLmxvY2tlZFJlZnMuZmlsdGVyKGxvY2tlZEl0ZW0gPT4gcmVmICE9PSBsb2NrZWRJdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaXMgaXRlbSBsb2NrZWQgb3Igbm90IGJ5IHNlYXJjaGluZyBpbnRvIGxvY2tlZFJlZnMgZm9yIGVudHJ5XG4gICAqL1xuICBpc0xvY2tlZChpdGVtOiBUKTogYm9vbGVhbiB7XG4gICAgLyoqXG4gICAgICogVGhlIGNoZWNrIGZvciBzZWxlY3Rpb25UeXBlIHdpbGwgYm9vc3QgdGhlIHBlcmZvcm1hbmNlIGJ5IE5PVCBzZWFyY2hpbmdcbiAgICAgKiBpbnRvIHRoZSBhcnJheSB3aGVuIHRoZXJlIGlzIG5vIG5lZWQgZm9yIHRoYXQuXG4gICAgICovXG4gICAgaWYgKHRoaXMuY2FuSXRCZUxvY2tlZCgpKSB7XG4gICAgICBjb25zdCByZWYgPSB0aGlzLl9pdGVtcy50cmFja0J5KGl0ZW0pO1xuICAgICAgcmV0dXJuIHRoaXMubG9ja2VkUmVmcy5pbmRleE9mKHJlZikgPiAtMTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0cyBvciBkZXNlbGVjdHMgYWxsIGN1cnJlbnRseSBkaXNwbGF5ZWQgaXRlbXNcbiAgICovXG4gIHRvZ2dsZUFsbCgpIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5Ob25lIHx8IHRoaXMuX3NlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuU2luZ2xlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8qKlxuICAgICAqIElmIGV2ZXJ5IGN1cnJlbnRseSBkaXNwbGF5ZWQgaXRlbSBpcyBhbHJlYWR5IHNlbGVjdGVkLCB3ZSBjbGVhciB0aGVtLlxuICAgICAqIElmIGF0IGxlYXN0IG9uZSBpdGVtIGlzbid0IHNlbGVjdGVkLCB3ZSBzZWxlY3QgZXZlcnkgY3VycmVudGx5IGRpc3BsYXllZCBpdGVtLlxuICAgICAqL1xuICAgIGlmICh0aGlzLmlzQWxsU2VsZWN0ZWQoKSkge1xuICAgICAgdGhpcy5faXRlbXMuZGlzcGxheWVkLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHRoaXMuY3VycmVudC5pbmRleE9mKGl0ZW0pO1xuICAgICAgICBpZiAoY3VycmVudEluZGV4ID4gLTEgJiYgdGhpcy5pc0xvY2tlZChpdGVtKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICB0aGlzLmRlc2VsZWN0SXRlbShjdXJyZW50SW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faXRlbXMuZGlzcGxheWVkLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnQuaW5kZXhPZihpdGVtKSA8IDAgJiYgdGhpcy5pc0xvY2tlZChpdGVtKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdEl0ZW0oaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIGFuIGl0ZW1cbiAgICovXG4gIHByaXZhdGUgc2VsZWN0SXRlbShpdGVtOiBUKTogdm9pZCB7XG4gICAgdGhpcy5jdXJyZW50ID0gdGhpcy5jdXJyZW50LmNvbmNhdChpdGVtKTtcbiAgICAvLyBQdXNoIHNlbGVjdGVkIHJlZiBvbnRvIGFycmF5XG4gICAgdGhpcy5wcmV2U2VsZWN0aW9uUmVmcy5wdXNoKHRoaXMuX2l0ZW1zLnRyYWNrQnkoaXRlbSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc2VsZWN0cyBhbiBpdGVtXG4gICAqL1xuICBwcml2YXRlIGRlc2VsZWN0SXRlbShpbmRleE9mSXRlbTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5jdXJyZW50ID0gdGhpcy5jdXJyZW50LnNsaWNlKDAsIGluZGV4T2ZJdGVtKS5jb25jYXQodGhpcy5jdXJyZW50LnNsaWNlKGluZGV4T2ZJdGVtICsgMSkpO1xuICAgIGlmIChpbmRleE9mSXRlbSA8IHRoaXMucHJldlNlbGVjdGlvblJlZnMubGVuZ3RoKSB7XG4gICAgICAvLyBLZWVwIHNlbGVjdGVkIHJlZnMgYXJyYXkgaW4gc3luY1xuICAgICAgY29uc3QgcmVtb3ZlZEl0ZW1zID0gdGhpcy5wcmV2U2VsZWN0aW9uUmVmcy5zcGxpY2UoaW5kZXhPZkl0ZW0sIDEpO1xuICAgICAgLy8gbG9ja2VkIHJlZmVyZW5jZSBpcyBubyBsb25nZXIgbmVlZGVkIChpZiBhbnkpXG4gICAgICB0aGlzLmxvY2tlZFJlZnMgPSB0aGlzLmxvY2tlZFJlZnMuZmlsdGVyKGxvY2tlZCA9PiBsb2NrZWQgIT09IHJlbW92ZWRJdGVtc1swXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1ha2Ugc3VyZSB0aGF0IGl0IGNvdWxkIGJlIGxvY2tlZFxuICAgKi9cbiAgcHJpdmF0ZSBjYW5JdEJlTG9ja2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb25UeXBlICE9PSBTZWxlY3Rpb25UeXBlLk5vbmU7XG4gIH1cblxuICBwcml2YXRlIGVtaXRDaGFuZ2UoKSB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuU2luZ2xlKSB7XG4gICAgICB0aGlzLl9jaGFuZ2UubmV4dCh0aGlzLmN1cnJlbnRTaW5nbGUpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5NdWx0aSkge1xuICAgICAgdGhpcy5fY2hhbmdlLm5leHQodGhpcy5jdXJyZW50KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==