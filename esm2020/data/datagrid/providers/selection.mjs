/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, delay } from 'rxjs/operators';
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
        this.subscriptions.push(_items.allChanges.pipe(delay(0)).subscribe(updatedItems => {
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
                    if (selectionUpdated) {
                        this.currentSingle = newSingle;
                    }
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
                        if (selectionUpdated) {
                            this.current = leftOver;
                        }
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
                if (selected) {
                    this.currentSingle = item;
                }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9wcm92aWRlcnMvc2VsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsT0FBTyxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUN6RCxPQUFPLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXJELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQzs7OztBQUl4RCxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFHcEIsTUFBTSxPQUFPLFNBQVM7SUEyQ3BCLFlBQW9CLE1BQWdCLEVBQUUsT0FBMkI7UUFBN0MsV0FBTSxHQUFOLE1BQU0sQ0FBVTtRQXpDcEMsc0JBQWlCLEdBQUcsS0FBSyxDQUFDO1FBTzFCOztXQUVHO1FBQ0gsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFFckIsMkNBQTJDO1FBQzNDLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQUVqQixzQkFBaUIsR0FBUSxFQUFFLENBQUMsQ0FBQyx5QkFBeUI7UUFFdEQsZUFBVSxHQUFRLEVBQUUsQ0FBQyxDQUFDLHNCQUFzQjtRQUM1QyxtQkFBYyxHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7UUFDcEMsbUJBQWMsR0FBa0IsYUFBYSxDQUFDLElBQUksQ0FBQztRQVkzRDs7V0FFRztRQUNLLFlBQU8sR0FBRyxJQUFJLE9BQU8sRUFBVyxDQUFDO1FBRXpDOztXQUVHO1FBQ0ssa0JBQWEsR0FBbUIsRUFBRSxDQUFDO1FBR3pDLElBQUksQ0FBQyxFQUFFLEdBQUcsa0JBQWtCLEdBQUcsV0FBVyxFQUFFLENBQUM7UUFFN0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENB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RU8sVUFBVTtRQUNoQixJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssYUFBYSxDQUFDLE1BQU0sRUFBRTtZQUNoRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDdkM7YUFBTSxJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssYUFBYSxDQUFDLEtBQUssRUFBRTtZQUN0RCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDakM7SUFDSCxDQUFDOztzR0FuWVUsU0FBUzswR0FBVCxTQUFTOzJGQUFULFNBQVM7a0JBRHJCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGVib3VuY2VUaW1lLCBkZWxheSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgU2VsZWN0aW9uVHlwZSB9IGZyb20gJy4uL2VudW1zL3NlbGVjdGlvbi10eXBlJztcbmltcG9ydCB7IEZpbHRlcnNQcm92aWRlciB9IGZyb20gJy4vZmlsdGVycyc7XG5pbXBvcnQgeyBJdGVtcyB9IGZyb20gJy4vaXRlbXMnO1xuXG5sZXQgbmJTZWxlY3Rpb24gPSAwO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2VsZWN0aW9uPFQgPSBhbnk+IHtcbiAgaWQ6IHN0cmluZztcbiAgcHJlc2VydmVTZWxlY3Rpb24gPSBmYWxzZTtcblxuICAvKipcbiAgICogTGFzdCBzZWxlY3Rpb24sIGZvciB1c2UgaW4gcmFuZ2Ugc2VsZWN0aW9uLlxuICAgKi9cbiAgcmFuZ2VTdGFydDogVDtcblxuICAvKipcbiAgICogU2hpZnQga2V5IHN0YXRlLCBmb3IgdXNlIGluIHJhbmdlIHNlbGVjdGlvbi5cbiAgICovXG4gIHNoaWZ0UHJlc3NlZCA9IGZhbHNlO1xuXG4gIC8qKiBAZGVwcmVjYXRlZCBzaW5jZSAyLjAsIHJlbW92ZSBpbiAzLjAgKi9cbiAgcm93U2VsZWN0aW9uTW9kZSA9IGZhbHNlO1xuXG4gIHByaXZhdGUgcHJldlNlbGVjdGlvblJlZnM6IFRbXSA9IFtdOyAvLyBSZWZzIG9mIHNlbGVjdGVkIGl0ZW1zXG4gIHByaXZhdGUgcHJldlNpbmdsZVNlbGVjdGlvblJlZjogVDsgLy8gUmVmIG9mIHNpbmdsZSBzZWxlY3RlZCBpdGVtXG4gIHByaXZhdGUgbG9ja2VkUmVmczogVFtdID0gW107IC8vIFJlZiBvZiBsb2NrZWQgaXRlbXNcbiAgcHJpdmF0ZSB2YWx1ZUNvbGxlY3RvciA9IG5ldyBTdWJqZWN0PFRbXT4oKTtcbiAgcHJpdmF0ZSBfc2VsZWN0aW9uVHlwZTogU2VsZWN0aW9uVHlwZSA9IFNlbGVjdGlvblR5cGUuTm9uZTtcblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgc2VsZWN0aW9uXG4gICAqL1xuICBwcml2YXRlIF9jdXJyZW50OiBUW107XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IHNlbGVjdGlvbiBpbiBzaW5nbGUgc2VsZWN0aW9uIHR5cGVcbiAgICovXG4gIHByaXZhdGUgX2N1cnJlbnRTaW5nbGU6IFQ7XG5cbiAgLyoqXG4gICAqIFRoZSBPYnNlcnZhYmxlIHRoYXQgbGV0cyBvdGhlciBjbGFzc2VzIHN1YnNjcmliZSB0byBzZWxlY3Rpb24gY2hhbmdlc1xuICAgKi9cbiAgcHJpdmF0ZSBfY2hhbmdlID0gbmV3IFN1YmplY3Q8VFtdIHwgVD4oKTtcblxuICAvKipcbiAgICogU3Vic2NyaXB0aW9ucyB0byB0aGUgb3RoZXIgcHJvdmlkZXJzIGNoYW5nZXMuXG4gICAqL1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfaXRlbXM6IEl0ZW1zPFQ+LCBmaWx0ZXJzOiBGaWx0ZXJzUHJvdmlkZXI8VD4pIHtcbiAgICB0aGlzLmlkID0gJ2Nsci1kZy1zZWxlY3Rpb24nICsgbmJTZWxlY3Rpb24rKztcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgZmlsdGVycy5jaGFuZ2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLl9zZWxlY3RhYmxlIHx8IHRoaXMucHJlc2VydmVTZWxlY3Rpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICBfaXRlbXMuYWxsQ2hhbmdlcy5waXBlKGRlbGF5KDApKS5zdWJzY3JpYmUodXBkYXRlZEl0ZW1zID0+IHtcbiAgICAgICAgLy8gUmVzZXQgdGhlIGxvY2tlZFJlZnM7XG4gICAgICAgIGNvbnN0IHVwZGF0ZUxvY2tlZFJlZjogVFtdID0gW107XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLnNlbGVjdGlvblR5cGUpIHtcbiAgICAgICAgICBjYXNlIFNlbGVjdGlvblR5cGUuTm9uZToge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSBTZWxlY3Rpb25UeXBlLlNpbmdsZToge1xuICAgICAgICAgICAgbGV0IG5ld1NpbmdsZTogYW55O1xuICAgICAgICAgICAgbGV0IHNlbGVjdGlvblVwZGF0ZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnRTaW5nbGUgaGFzIGJlZW4gc2V0IGJlZm9yZSBkYXRhIHdhcyBsb2FkZWQsIHdlIGxvb2sgdXAgYW5kIHNhdmUgdGhlIHJlZiBmcm9tIGN1cnJlbnQgZGF0YSBzZXRcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRTaW5nbGUgJiYgIXRoaXMucHJldlNpbmdsZVNlbGVjdGlvblJlZikge1xuICAgICAgICAgICAgICB0aGlzLnByZXZTaW5nbGVTZWxlY3Rpb25SZWYgPSBfaXRlbXMudHJhY2tCeSh0aGlzLmN1cnJlbnRTaW5nbGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1cGRhdGVkSXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgcmVmID0gX2l0ZW1zLnRyYWNrQnkoaXRlbSk7XG4gICAgICAgICAgICAgIC8vIElmIG9uZSBvZiB0aGUgdXBkYXRlZCBpdGVtcyBpcyB0aGUgcHJldmlvdXNseSBzZWxlY3RlZFNpbmdsZSwgc2V0IGl0IGFzIHRoZSBuZXcgb25lXG4gICAgICAgICAgICAgIGlmICh0aGlzLnByZXZTaW5nbGVTZWxlY3Rpb25SZWYgPT09IHJlZikge1xuICAgICAgICAgICAgICAgIG5ld1NpbmdsZSA9IGl0ZW07XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uVXBkYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHRoaXMubG9ja2VkUmVmcy5pbmRleE9mKHJlZikgPiAtMSkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZUxvY2tlZFJlZi5wdXNoKHJlZik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBJZiB3ZSdyZSB1c2luZyBzbWFydCBkYXRhZ3JpZHMsIHdlIGV4cGVjdCBhbGwgaXRlbXMgdG8gYmUgcHJlc2VudCBpbiB0aGUgdXBkYXRlZEl0ZW1zIGFycmF5LlxuICAgICAgICAgICAgLy8gVGhlcmVmb3JlLCB3ZSBzaG91bGQgZGVsZXRlIHRoZSBjdXJyZW50U2luZ2xlIGlmIGl0IHVzZWQgdG8gYmUgZGVmaW5lZCBidXQgZG9lc24ndCBleGlzdCBhbnltb3JlLlxuICAgICAgICAgICAgLy8gTm8gZXhwbGljaXQgXCJkZWxldGVcIiBpcyByZXF1aXJlZCwgc2luY2UgbmV3U2luZ2xlIHdvdWxkIGJlIHVuZGVmaW5lZCBhdCB0aGlzIHBvaW50LlxuICAgICAgICAgICAgLy8gTWFya2luZyBpdCBhcyBzZWxlY3Rpb25VcGRhdGVkIGhlcmUgd2lsbCBzZXQgY3VycmVudFNpbmdsZSB0byB1bmRlZmluZWQgYmVsb3cgaW4gdGhlIHNldFRpbWVvdXQuXG4gICAgICAgICAgICBpZiAoX2l0ZW1zLnNtYXJ0ICYmICFuZXdTaW5nbGUpIHtcbiAgICAgICAgICAgICAgc2VsZWN0aW9uVXBkYXRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWxlY3Rpb25VcGRhdGVkKSB7XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudFNpbmdsZSA9IG5ld1NpbmdsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgU2VsZWN0aW9uVHlwZS5NdWx0aToge1xuICAgICAgICAgICAgbGV0IGxlZnRPdmVyOiBhbnlbXSA9IHRoaXMuY3VycmVudC5zbGljZSgpO1xuICAgICAgICAgICAgbGV0IHNlbGVjdGlvblVwZGF0ZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnQgaGFzIGJlZW4gc2V0IGJlZm9yZSBkYXRhIHdhcyBsb2FkZWQsIHdlIGxvb2sgdXAgYW5kIHNhdmUgdGhlIHJlZiBmcm9tIGN1cnJlbnQgZGF0YSBzZXRcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnQubGVuZ3RoID4gMCAmJiB0aGlzLnByZXZTZWxlY3Rpb25SZWZzLmxlbmd0aCAhPT0gdGhpcy5jdXJyZW50Lmxlbmd0aCkge1xuICAgICAgICAgICAgICB0aGlzLnByZXZTZWxlY3Rpb25SZWZzID0gW107XG4gICAgICAgICAgICAgIHRoaXMuY3VycmVudC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucHJldlNlbGVjdGlvblJlZnMucHVzaChfaXRlbXMudHJhY2tCeShpdGVtKSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEdXBsaWNhdGUgbG9vcCwgd2hlbiB0aGUgaXNzdWUgaXMgaXNzdWUjMjM0MiBpcyByZXZpc2l0ZWQga2VlcCBpbiBtaW5kIHRoYXRcbiAgICAgICAgICAgIC8vIHdlIG5lZWQgdG8gZ28gb3ZlciBldmVyeSB1cGRhdGVkIGl0ZW0gYW5kIGNoZWNrIHRvIHNlZSBpZiB0aGVyZSBhcmUgdmFsaWQgdG8gYmVcbiAgICAgICAgICAgIC8vIGxvY2tlZCBvciBub3QgYW5kIHVwZGF0ZSBpdC4gV2hlbiBvbmx5IGFkZCBpdGVtcyB0aGF0IGFyZSBmb3VuZCBpbiB0aGUgbG9ja2VkUmVmcyBiYWNrLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIFRoZSBib3RoIGxvb3BzIGJlbG93IHRoYXQgZ29lcyBvdmVyIHVwZGF0ZWRJdGVtcyBjb3VsZCBiZSBjb21iaW5lZCBpbnRvIG9uZS5cbiAgICAgICAgICAgIHVwZGF0ZWRJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICBjb25zdCByZWYgPSBfaXRlbXMudHJhY2tCeShpdGVtKTtcbiAgICAgICAgICAgICAgaWYgKHRoaXMubG9ja2VkUmVmcy5pbmRleE9mKHJlZikgPiAtMSkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZUxvY2tlZFJlZi5wdXNoKHJlZik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBUT0RPOiByZXZpc2l0IHRoaXMgd2hlbiB3ZSB3b3JrIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS92bXdhcmUvY2xhcml0eS9pc3N1ZXMvMjM0MlxuICAgICAgICAgICAgLy8gY3VycmVudGx5LCB0aGUgc2VsZWN0aW9uIGlzIGNsZWFyZWQgd2hlbiBmaWx0ZXIgaXMgYXBwbGllZCwgc28gdGhlIGxvZ2ljIGluc2lkZVxuICAgICAgICAgICAgLy8gdGhlIGlmIHN0YXRlbWVudCBiZWxvdyByZXN1bHRzIGluIGJyb2tlbiBiZWhhdmlvci5cbiAgICAgICAgICAgIGlmIChsZWZ0T3Zlci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHVwZGF0ZWRJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlZiA9IF9pdGVtcy50cmFja0J5KGl0ZW0pO1xuICAgICAgICAgICAgICAgIC8vIExvb2sgaW4gY3VycmVudCBzZWxlY3RlZCByZWZzIGFycmF5IGlmIGl0ZW0gaXMgc2VsZWN0ZWQsIGFuZCB1cGRhdGUgYWN0dWFsIHZhbHVlXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRJbmRleCA9IHRoaXMucHJldlNlbGVjdGlvblJlZnMuaW5kZXhPZihyZWYpO1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgIGxlZnRPdmVyW3NlbGVjdGVkSW5kZXhdID0gaXRlbTtcbiAgICAgICAgICAgICAgICAgIHNlbGVjdGlvblVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgLy8gRmlsdGVyIG91dCBhbnkgdW5tYXRjaGVkIGl0ZW1zIGlmIHdlJ3JlIHVzaW5nIHNtYXJ0IGRhdGFncmlkcyB3aGVyZSB3ZSBleHBlY3QgYWxsIGl0ZW1zIHRvIGJlXG4gICAgICAgICAgICAgIC8vIHByZXNlbnRcbiAgICAgICAgICAgICAgaWYgKF9pdGVtcy5zbWFydCkge1xuICAgICAgICAgICAgICAgIGxlZnRPdmVyID0gbGVmdE92ZXIuZmlsdGVyKHNlbGVjdGVkID0+IHVwZGF0ZWRJdGVtcy5pbmRleE9mKHNlbGVjdGVkKSA+IC0xKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Lmxlbmd0aCAhPT0gbGVmdE92ZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICBzZWxlY3Rpb25VcGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uVXBkYXRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IGxlZnRPdmVyO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gU3luYyBsb2NrZWQgaXRlbXNcbiAgICAgICAgdGhpcy5sb2NrZWRSZWZzID0gdXBkYXRlTG9ja2VkUmVmO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2godGhpcy52YWx1ZUNvbGxlY3Rvci5waXBlKGRlYm91bmNlVGltZSgwKSkuc3Vic2NyaWJlKCgpID0+IHRoaXMuZW1pdENoYW5nZSgpKSk7XG4gIH1cblxuICBnZXQgc2VsZWN0aW9uVHlwZSgpOiBTZWxlY3Rpb25UeXBlIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uVHlwZTtcbiAgfVxuICBzZXQgc2VsZWN0aW9uVHlwZSh2YWx1ZTogU2VsZWN0aW9uVHlwZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5zZWxlY3Rpb25UeXBlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX3NlbGVjdGlvblR5cGUgPSB2YWx1ZTtcbiAgICBpZiAodmFsdWUgPT09IFNlbGVjdGlvblR5cGUuTm9uZSkge1xuICAgICAgZGVsZXRlIHRoaXMuY3VycmVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cGRhdGVDdXJyZW50KFtdLCBmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGN1cnJlbnQoKTogVFtdIHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudDtcbiAgfVxuICBzZXQgY3VycmVudCh2YWx1ZTogVFtdKSB7XG4gICAgdGhpcy51cGRhdGVDdXJyZW50KHZhbHVlLCB0cnVlKTtcbiAgfVxuXG4gIGdldCBjdXJyZW50U2luZ2xlKCk6IFQge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50U2luZ2xlO1xuICB9XG4gIHNldCBjdXJyZW50U2luZ2xlKHZhbHVlOiBUKSB7XG4gICAgaWYgKHZhbHVlID09PSB0aGlzLl9jdXJyZW50U2luZ2xlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2N1cnJlbnRTaW5nbGUgPSB2YWx1ZTtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMucHJldlNpbmdsZVNlbGVjdGlvblJlZiA9IHRoaXMuX2l0ZW1zLnRyYWNrQnkodmFsdWUpO1xuICAgIH1cbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIC8vIFdlIGRvIG5vdCB3YW50IHRvIGV4cG9zZSB0aGUgU3ViamVjdCBpdHNlbGYsIGJ1dCB0aGUgT2JzZXJ2YWJsZSB3aGljaCBpcyByZWFkLW9ubHlcbiAgZ2V0IGNoYW5nZSgpOiBPYnNlcnZhYmxlPFRbXSB8IFQ+IHtcbiAgICByZXR1cm4gdGhpcy5fY2hhbmdlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgX3NlbGVjdGFibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuTXVsdGkgfHwgdGhpcy5fc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5TaW5nbGU7XG4gIH1cblxuICBjbGVhclNlbGVjdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLl9jdXJyZW50ID0gW107XG4gICAgdGhpcy5wcmV2U2VsZWN0aW9uUmVmcyA9IFtdO1xuICAgIHRoaXMucHJldlNpbmdsZVNlbGVjdGlvblJlZiA9IG51bGw7XG4gICAgdGhpcy5fY3VycmVudFNpbmdsZSA9IG51bGw7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYW5zIHVwIG91ciBzdWJzY3JpcHRpb25zIHRvIG90aGVyIHByb3ZpZGVyc1xuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgdXBkYXRlQ3VycmVudCh2YWx1ZTogVFtdLCBlbWl0OiBib29sZWFuKSB7XG4gICAgdGhpcy5fY3VycmVudCA9IHZhbHVlO1xuXG4gICAgaWYgKGVtaXQpIHtcbiAgICAgIHRoaXMudmFsdWVDb2xsZWN0b3IubmV4dCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhbiBpdGVtIGlzIGN1cnJlbnRseSBzZWxlY3RlZFxuICAgKi9cbiAgaXNTZWxlY3RlZChpdGVtOiBUKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuU2luZ2xlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50U2luZ2xlID09PSBpdGVtO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5NdWx0aSkge1xuICAgICAgcmV0dXJuIHRoaXMuY3VycmVudC5pbmRleE9mKGl0ZW0pID49IDA7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIG9yIGRlc2VsZWN0cyBhbiBpdGVtXG4gICAqL1xuICBzZXRTZWxlY3RlZChpdGVtOiBULCBzZWxlY3RlZDogYm9vbGVhbikge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jdXJyZW50ID8gdGhpcy5jdXJyZW50LmluZGV4T2YoaXRlbSkgOiAtMTtcblxuICAgIHN3aXRjaCAodGhpcy5fc2VsZWN0aW9uVHlwZSkge1xuICAgICAgY2FzZSBTZWxlY3Rpb25UeXBlLk5vbmU6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTZWxlY3Rpb25UeXBlLlNpbmdsZTpcbiAgICAgICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50U2luZ2xlID0gaXRlbTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpbiBzaW5nbGUgc2VsZWN0aW9uLCBzZXQgY3VycmVudFNpbmdsZSBtZXRob2Qgc2hvdWxkIGJlIHVzZWRcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNlbGVjdGlvblR5cGUuTXVsdGk6XG4gICAgICAgIGlmIChpbmRleCA+PSAwICYmICFzZWxlY3RlZCkge1xuICAgICAgICAgIHRoaXMuZGVzZWxlY3RJdGVtKGluZGV4KTtcbiAgICAgICAgfSBlbHNlIGlmIChpbmRleCA8IDAgJiYgc2VsZWN0ZWQpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdEl0ZW0oaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGFsbCBjdXJyZW50bHkgZGlzcGxheWVkIGl0ZW1zIGFyZSBzZWxlY3RlZFxuICAgKi9cbiAgaXNBbGxTZWxlY3RlZCgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uVHlwZSAhPT0gU2VsZWN0aW9uVHlwZS5NdWx0aSB8fCAhdGhpcy5faXRlbXMuZGlzcGxheWVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIG1ha2Ugc3VyZSB0byBleGNsdWRlIHRoZSBsb2NrZWQgaXRlbXMgZnJvbSB0aGUgbGlzdCB3aGVuIGNvdW50aW5nXG4gICAgY29uc3QgZGlzcGxheWVkSXRlbXM6IFRbXSA9IHRoaXMuX2l0ZW1zLmRpc3BsYXllZC5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5pc0xvY2tlZChpdGVtKSA9PT0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICBjb25zdCBuYkRpc3BsYXllZCA9IGRpc3BsYXllZEl0ZW1zLmxlbmd0aDtcbiAgICBpZiAobmJEaXNwbGF5ZWQgPCAxKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHRlbXA6IFRbXSA9IGRpc3BsYXllZEl0ZW1zLmZpbHRlcihpdGVtID0+IHRoaXMuY3VycmVudC5pbmRleE9mKGl0ZW0pID4gLTEpO1xuICAgIHJldHVybiB0ZW1wLmxlbmd0aCA9PT0gZGlzcGxheWVkSXRlbXMubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIExvY2sgYW5kIHVubG9jayBpdGVtXG4gICAqL1xuICBsb2NrSXRlbShpdGVtOiBULCBsb2NrOiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMuY2FuSXRCZUxvY2tlZCgpKSB7XG4gICAgICBjb25zdCByZWYgPSB0aGlzLl9pdGVtcy50cmFja0J5KGl0ZW0pO1xuICAgICAgaWYgKGxvY2sgPT09IHRydWUpIHtcbiAgICAgICAgLy8gQWRkIHRvIGxvY2tlZFJlZlxuICAgICAgICB0aGlzLmxvY2tlZFJlZnMucHVzaChyZWYpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUmVtb3ZlIGZyb20gbG9ja2VkUmVmXG4gICAgICAgIHRoaXMubG9ja2VkUmVmcyA9IHRoaXMubG9ja2VkUmVmcy5maWx0ZXIobG9ja2VkSXRlbSA9PiByZWYgIT09IGxvY2tlZEl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpcyBpdGVtIGxvY2tlZCBvciBub3QgYnkgc2VhcmNoaW5nIGludG8gbG9ja2VkUmVmcyBmb3IgZW50cnlcbiAgICovXG4gIGlzTG9ja2VkKGl0ZW06IFQpOiBib29sZWFuIHtcbiAgICAvKipcbiAgICAgKiBUaGUgY2hlY2sgZm9yIHNlbGVjdGlvblR5cGUgd2lsbCBib29zdCB0aGUgcGVyZm9ybWFuY2UgYnkgTk9UIHNlYXJjaGluZ1xuICAgICAqIGludG8gdGhlIGFycmF5IHdoZW4gdGhlcmUgaXMgbm8gbmVlZCBmb3IgdGhhdC5cbiAgICAgKi9cbiAgICBpZiAodGhpcy5jYW5JdEJlTG9ja2VkKCkpIHtcbiAgICAgIGNvbnN0IHJlZiA9IHRoaXMuX2l0ZW1zLnRyYWNrQnkoaXRlbSk7XG4gICAgICByZXR1cm4gdGhpcy5sb2NrZWRSZWZzLmluZGV4T2YocmVmKSA+IC0xO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIG9yIGRlc2VsZWN0cyBhbGwgY3VycmVudGx5IGRpc3BsYXllZCBpdGVtc1xuICAgKi9cbiAgdG9nZ2xlQWxsKCkge1xuICAgIGlmICh0aGlzLl9zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLk5vbmUgfHwgdGhpcy5fc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5TaW5nbGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSWYgZXZlcnkgY3VycmVudGx5IGRpc3BsYXllZCBpdGVtIGlzIGFscmVhZHkgc2VsZWN0ZWQsIHdlIGNsZWFyIHRoZW0uXG4gICAgICogSWYgYXQgbGVhc3Qgb25lIGl0ZW0gaXNuJ3Qgc2VsZWN0ZWQsIHdlIHNlbGVjdCBldmVyeSBjdXJyZW50bHkgZGlzcGxheWVkIGl0ZW0uXG4gICAgICovXG4gICAgaWYgKHRoaXMuaXNBbGxTZWxlY3RlZCgpKSB7XG4gICAgICB0aGlzLl9pdGVtcy5kaXNwbGF5ZWQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gdGhpcy5jdXJyZW50LmluZGV4T2YoaXRlbSk7XG4gICAgICAgIGlmIChjdXJyZW50SW5kZXggPiAtMSAmJiB0aGlzLmlzTG9ja2VkKGl0ZW0pID09PSBmYWxzZSkge1xuICAgICAgICAgIHRoaXMuZGVzZWxlY3RJdGVtKGN1cnJlbnRJbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9pdGVtcy5kaXNwbGF5ZWQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudC5pbmRleE9mKGl0ZW0pIDwgMCAmJiB0aGlzLmlzTG9ja2VkKGl0ZW0pID09PSBmYWxzZSkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0SXRlbShpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgYW4gaXRlbVxuICAgKi9cbiAgcHJpdmF0ZSBzZWxlY3RJdGVtKGl0ZW06IFQpOiB2b2lkIHtcbiAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLmN1cnJlbnQuY29uY2F0KGl0ZW0pO1xuICAgIC8vIFB1c2ggc2VsZWN0ZWQgcmVmIG9udG8gYXJyYXlcbiAgICB0aGlzLnByZXZTZWxlY3Rpb25SZWZzLnB1c2godGhpcy5faXRlbXMudHJhY2tCeShpdGVtKSk7XG4gIH1cblxuICAvKipcbiAgICogRGVzZWxlY3RzIGFuIGl0ZW1cbiAgICovXG4gIHByaXZhdGUgZGVzZWxlY3RJdGVtKGluZGV4T2ZJdGVtOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLmN1cnJlbnQuc2xpY2UoMCwgaW5kZXhPZkl0ZW0pLmNvbmNhdCh0aGlzLmN1cnJlbnQuc2xpY2UoaW5kZXhPZkl0ZW0gKyAxKSk7XG4gICAgaWYgKGluZGV4T2ZJdGVtIDwgdGhpcy5wcmV2U2VsZWN0aW9uUmVmcy5sZW5ndGgpIHtcbiAgICAgIC8vIEtlZXAgc2VsZWN0ZWQgcmVmcyBhcnJheSBpbiBzeW5jXG4gICAgICBjb25zdCByZW1vdmVkSXRlbXMgPSB0aGlzLnByZXZTZWxlY3Rpb25SZWZzLnNwbGljZShpbmRleE9mSXRlbSwgMSk7XG4gICAgICAvLyBsb2NrZWQgcmVmZXJlbmNlIGlzIG5vIGxvbmdlciBuZWVkZWQgKGlmIGFueSlcbiAgICAgIHRoaXMubG9ja2VkUmVmcyA9IHRoaXMubG9ja2VkUmVmcy5maWx0ZXIobG9ja2VkID0+IGxvY2tlZCAhPT0gcmVtb3ZlZEl0ZW1zWzBdKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBzdXJlIHRoYXQgaXQgY291bGQgYmUgbG9ja2VkXG4gICAqL1xuICBwcml2YXRlIGNhbkl0QmVMb2NrZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvblR5cGUgIT09IFNlbGVjdGlvblR5cGUuTm9uZTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdENoYW5nZSgpIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5TaW5nbGUpIHtcbiAgICAgIHRoaXMuX2NoYW5nZS5uZXh0KHRoaXMuY3VycmVudFNpbmdsZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLk11bHRpKSB7XG4gICAgICB0aGlzLl9jaGFuZ2UubmV4dCh0aGlzLmN1cnJlbnQpO1xuICAgIH1cbiAgfVxufVxuIl19