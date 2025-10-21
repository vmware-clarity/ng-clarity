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
        if ([SelectionType.None, SelectionType.Single].includes(value)) {
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
    // Refs of currently selected items
    get currentSelectionRefs() {
        return this._current?.map(item => this._items.trackBy(item)) || [];
    }
    // Ref of currently selected item
    get currentSingleSelectionRef() {
        return this._currentSingle && this._items.trackBy(this._currentSingle);
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
        const ref = this._items.trackBy(item);
        if (this._selectionType === SelectionType.Single) {
            return this.currentSingleSelectionRef === ref;
        }
        else if (this._selectionType === SelectionType.Multi) {
            return this.currentSelectionRefs.indexOf(ref) >= 0;
        }
        return false;
    }
    /**
     * Selects or deselects an item
     */
    setSelected(item, selected) {
        const ref = this._items.trackBy(item);
        const index = this.currentSelectionRefs ? this.currentSelectionRefs.indexOf(ref) : -1;
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
        const temp = displayedItems.filter(item => {
            const ref = this._items.trackBy(item);
            return this.currentSelectionRefs.indexOf(ref) > -1;
        });
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
                const ref = this._items.trackBy(item);
                const currentIndex = this.currentSelectionRefs.indexOf(ref);
                if (currentIndex > -1 && this.isLocked(item) === false) {
                    this.deselectItem(currentIndex);
                }
            });
        }
        else {
            this._items.displayed.forEach(item => {
                if (!this.isSelected(item) && this.isLocked(item) === false) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9wcm92aWRlcnMvc2VsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQWMsT0FBTyxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUN6RCxPQUFPLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXJELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQzs7OztBQUl4RCxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFHcEIsTUFBTSxPQUFPLFNBQVM7SUEyQ3BCLFlBQW9CLE1BQWdCLEVBQUUsT0FBMkI7UUFBN0MsV0FBTSxHQUFOLE1BQU0sQ0FBVTtRQXpDcEMsc0JBQWlCLEdBQUcsS0FBSyxDQUFDO1FBTzFCOztXQUVHO1FBQ0gsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFFckIsMkNBQTJDO1FBQzNDLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQUVqQixzQkFBaUIsR0FBUSxFQUFFLENBQUMsQ0FBQyx5QkFBeUI7UUFFdEQsZUFBVSxHQUFRLEVBQUUsQ0FBQyxDQUFDLHNCQUFzQjtRQUM1QyxtQkFBYyxHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7UUFDcEMsbUJBQWMsR0FBa0IsYUFBYSxDQUFDLElBQUksQ0FBQztRQVkzRDs7V0FFRztRQUNLLFlBQU8sR0FBRyxJQUFJLE9BQU8sRUFBVyxDQUFDO1FBRXpDOztXQUVHO1FBQ0ssa0JBQWEsR0FBbUIsRUFBRSxDQUFDO1FBR3pDLElBQUksQ0FBQyxFQUFFLEdBQUcsa0JBQWtCLEdBQUcsV0FBVyxFQUFFLENBQUM7UUFFN0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENB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U0FBUztrQkFEckIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUsIGRlbGF5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBTZWxlY3Rpb25UeXBlIH0gZnJvbSAnLi4vZW51bXMvc2VsZWN0aW9uLXR5cGUnO1xuaW1wb3J0IHsgRmlsdGVyc1Byb3ZpZGVyIH0gZnJvbSAnLi9maWx0ZXJzJztcbmltcG9ydCB7IEl0ZW1zIH0gZnJvbSAnLi9pdGVtcyc7XG5cbmxldCBuYlNlbGVjdGlvbiA9IDA7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTZWxlY3Rpb248VCA9IGFueT4ge1xuICBpZDogc3RyaW5nO1xuICBwcmVzZXJ2ZVNlbGVjdGlvbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBMYXN0IHNlbGVjdGlvbiwgZm9yIHVzZSBpbiByYW5nZSBzZWxlY3Rpb24uXG4gICAqL1xuICByYW5nZVN0YXJ0OiBUO1xuXG4gIC8qKlxuICAgKiBTaGlmdCBrZXkgc3RhdGUsIGZvciB1c2UgaW4gcmFuZ2Ugc2VsZWN0aW9uLlxuICAgKi9cbiAgc2hpZnRQcmVzc2VkID0gZmFsc2U7XG5cbiAgLyoqIEBkZXByZWNhdGVkIHNpbmNlIDIuMCwgcmVtb3ZlIGluIDMuMCAqL1xuICByb3dTZWxlY3Rpb25Nb2RlID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBwcmV2U2VsZWN0aW9uUmVmczogVFtdID0gW107IC8vIFJlZnMgb2Ygc2VsZWN0ZWQgaXRlbXNcbiAgcHJpdmF0ZSBwcmV2U2luZ2xlU2VsZWN0aW9uUmVmOiBUOyAvLyBSZWYgb2Ygc2luZ2xlIHNlbGVjdGVkIGl0ZW1cbiAgcHJpdmF0ZSBsb2NrZWRSZWZzOiBUW10gPSBbXTsgLy8gUmVmIG9mIGxvY2tlZCBpdGVtc1xuICBwcml2YXRlIHZhbHVlQ29sbGVjdG9yID0gbmV3IFN1YmplY3Q8VFtdPigpO1xuICBwcml2YXRlIF9zZWxlY3Rpb25UeXBlOiBTZWxlY3Rpb25UeXBlID0gU2VsZWN0aW9uVHlwZS5Ob25lO1xuXG4gIC8qKlxuICAgKiBUaGUgY3VycmVudCBzZWxlY3Rpb25cbiAgICovXG4gIHByaXZhdGUgX2N1cnJlbnQ6IFRbXTtcblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgc2VsZWN0aW9uIGluIHNpbmdsZSBzZWxlY3Rpb24gdHlwZVxuICAgKi9cbiAgcHJpdmF0ZSBfY3VycmVudFNpbmdsZTogVDtcblxuICAvKipcbiAgICogVGhlIE9ic2VydmFibGUgdGhhdCBsZXRzIG90aGVyIGNsYXNzZXMgc3Vic2NyaWJlIHRvIHNlbGVjdGlvbiBjaGFuZ2VzXG4gICAqL1xuICBwcml2YXRlIF9jaGFuZ2UgPSBuZXcgU3ViamVjdDxUW10gfCBUPigpO1xuXG4gIC8qKlxuICAgKiBTdWJzY3JpcHRpb25zIHRvIHRoZSBvdGhlciBwcm92aWRlcnMgY2hhbmdlcy5cbiAgICovXG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9pdGVtczogSXRlbXM8VD4sIGZpbHRlcnM6IEZpbHRlcnNQcm92aWRlcjxUPikge1xuICAgIHRoaXMuaWQgPSAnY2xyLWRnLXNlbGVjdGlvbicgKyBuYlNlbGVjdGlvbisrO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICBmaWx0ZXJzLmNoYW5nZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuX3NlbGVjdGFibGUgfHwgdGhpcy5wcmVzZXJ2ZVNlbGVjdGlvbikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIF9pdGVtcy5hbGxDaGFuZ2VzLnBpcGUoZGVsYXkoMCkpLnN1YnNjcmliZSh1cGRhdGVkSXRlbXMgPT4ge1xuICAgICAgICAvLyBSZXNldCB0aGUgbG9ja2VkUmVmcztcbiAgICAgICAgY29uc3QgdXBkYXRlTG9ja2VkUmVmOiBUW10gPSBbXTtcblxuICAgICAgICBzd2l0Y2ggKHRoaXMuc2VsZWN0aW9uVHlwZSkge1xuICAgICAgICAgIGNhc2UgU2VsZWN0aW9uVHlwZS5Ob25lOiB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlIFNlbGVjdGlvblR5cGUuU2luZ2xlOiB7XG4gICAgICAgICAgICBsZXQgbmV3U2luZ2xlOiBhbnk7XG4gICAgICAgICAgICBsZXQgc2VsZWN0aW9uVXBkYXRlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyBpZiB0aGUgY3VycmVudFNpbmdsZSBoYXMgYmVlbiBzZXQgYmVmb3JlIGRhdGEgd2FzIGxvYWRlZCwgd2UgbG9vayB1cCBhbmQgc2F2ZSB0aGUgcmVmIGZyb20gY3VycmVudCBkYXRhIHNldFxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFNpbmdsZSAmJiAhdGhpcy5wcmV2U2luZ2xlU2VsZWN0aW9uUmVmKSB7XG4gICAgICAgICAgICAgIHRoaXMucHJldlNpbmdsZVNlbGVjdGlvblJlZiA9IF9pdGVtcy50cmFja0J5KHRoaXMuY3VycmVudFNpbmdsZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHVwZGF0ZWRJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICBjb25zdCByZWYgPSBfaXRlbXMudHJhY2tCeShpdGVtKTtcbiAgICAgICAgICAgICAgLy8gSWYgb25lIG9mIHRoZSB1cGRhdGVkIGl0ZW1zIGlzIHRoZSBwcmV2aW91c2x5IHNlbGVjdGVkU2luZ2xlLCBzZXQgaXQgYXMgdGhlIG5ldyBvbmVcbiAgICAgICAgICAgICAgaWYgKHRoaXMucHJldlNpbmdsZVNlbGVjdGlvblJlZiA9PT0gcmVmKSB7XG4gICAgICAgICAgICAgICAgbmV3U2luZ2xlID0gaXRlbTtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25VcGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAodGhpcy5sb2NrZWRSZWZzLmluZGV4T2YocmVmKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlTG9ja2VkUmVmLnB1c2gocmVmKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIElmIHdlJ3JlIHVzaW5nIHNtYXJ0IGRhdGFncmlkcywgd2UgZXhwZWN0IGFsbCBpdGVtcyB0byBiZSBwcmVzZW50IGluIHRoZSB1cGRhdGVkSXRlbXMgYXJyYXkuXG4gICAgICAgICAgICAvLyBUaGVyZWZvcmUsIHdlIHNob3VsZCBkZWxldGUgdGhlIGN1cnJlbnRTaW5nbGUgaWYgaXQgdXNlZCB0byBiZSBkZWZpbmVkIGJ1dCBkb2Vzbid0IGV4aXN0IGFueW1vcmUuXG4gICAgICAgICAgICAvLyBObyBleHBsaWNpdCBcImRlbGV0ZVwiIGlzIHJlcXVpcmVkLCBzaW5jZSBuZXdTaW5nbGUgd291bGQgYmUgdW5kZWZpbmVkIGF0IHRoaXMgcG9pbnQuXG4gICAgICAgICAgICAvLyBNYXJraW5nIGl0IGFzIHNlbGVjdGlvblVwZGF0ZWQgaGVyZSB3aWxsIHNldCBjdXJyZW50U2luZ2xlIHRvIHVuZGVmaW5lZCBiZWxvdyBpbiB0aGUgc2V0VGltZW91dC5cbiAgICAgICAgICAgIGlmIChfaXRlbXMuc21hcnQgJiYgIW5ld1NpbmdsZSkge1xuICAgICAgICAgICAgICBzZWxlY3Rpb25VcGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlbGVjdGlvblVwZGF0ZWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2luZ2xlID0gbmV3U2luZ2xlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSBTZWxlY3Rpb25UeXBlLk11bHRpOiB7XG4gICAgICAgICAgICBsZXQgbGVmdE92ZXI6IGFueVtdID0gdGhpcy5jdXJyZW50LnNsaWNlKCk7XG4gICAgICAgICAgICBsZXQgc2VsZWN0aW9uVXBkYXRlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyBpZiB0aGUgY3VycmVudCBoYXMgYmVlbiBzZXQgYmVmb3JlIGRhdGEgd2FzIGxvYWRlZCwgd2UgbG9vayB1cCBhbmQgc2F2ZSB0aGUgcmVmIGZyb20gY3VycmVudCBkYXRhIHNldFxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudC5sZW5ndGggPiAwICYmIHRoaXMucHJldlNlbGVjdGlvblJlZnMubGVuZ3RoICE9PSB0aGlzLmN1cnJlbnQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHRoaXMucHJldlNlbGVjdGlvblJlZnMgPSBbXTtcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50LmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2U2VsZWN0aW9uUmVmcy5wdXNoKF9pdGVtcy50cmFja0J5KGl0ZW0pKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIER1cGxpY2F0ZSBsb29wLCB3aGVuIHRoZSBpc3N1ZSBpcyBpc3N1ZSMyMzQyIGlzIHJldmlzaXRlZCBrZWVwIGluIG1pbmQgdGhhdFxuICAgICAgICAgICAgLy8gd2UgbmVlZCB0byBnbyBvdmVyIGV2ZXJ5IHVwZGF0ZWQgaXRlbSBhbmQgY2hlY2sgdG8gc2VlIGlmIHRoZXJlIGFyZSB2YWxpZCB0byBiZVxuICAgICAgICAgICAgLy8gbG9ja2VkIG9yIG5vdCBhbmQgdXBkYXRlIGl0LiBXaGVuIG9ubHkgYWRkIGl0ZW1zIHRoYXQgYXJlIGZvdW5kIGluIHRoZSBsb2NrZWRSZWZzIGJhY2suXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gVGhlIGJvdGggbG9vcHMgYmVsb3cgdGhhdCBnb2VzIG92ZXIgdXBkYXRlZEl0ZW1zIGNvdWxkIGJlIGNvbWJpbmVkIGludG8gb25lLlxuICAgICAgICAgICAgdXBkYXRlZEl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlZiA9IF9pdGVtcy50cmFja0J5KGl0ZW0pO1xuICAgICAgICAgICAgICBpZiAodGhpcy5sb2NrZWRSZWZzLmluZGV4T2YocmVmKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlTG9ja2VkUmVmLnB1c2gocmVmKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFRPRE86IHJldmlzaXQgdGhpcyB3aGVuIHdlIHdvcmsgb24gaHR0cHM6Ly9naXRodWIuY29tL3Ztd2FyZS9jbGFyaXR5L2lzc3Vlcy8yMzQyXG4gICAgICAgICAgICAvLyBjdXJyZW50bHksIHRoZSBzZWxlY3Rpb24gaXMgY2xlYXJlZCB3aGVuIGZpbHRlciBpcyBhcHBsaWVkLCBzbyB0aGUgbG9naWMgaW5zaWRlXG4gICAgICAgICAgICAvLyB0aGUgaWYgc3RhdGVtZW50IGJlbG93IHJlc3VsdHMgaW4gYnJva2VuIGJlaGF2aW9yLlxuICAgICAgICAgICAgaWYgKGxlZnRPdmVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgdXBkYXRlZEl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVmID0gX2l0ZW1zLnRyYWNrQnkoaXRlbSk7XG4gICAgICAgICAgICAgICAgLy8gTG9vayBpbiBjdXJyZW50IHNlbGVjdGVkIHJlZnMgYXJyYXkgaWYgaXRlbSBpcyBzZWxlY3RlZCwgYW5kIHVwZGF0ZSBhY3R1YWwgdmFsdWVcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RlZEluZGV4ID0gdGhpcy5wcmV2U2VsZWN0aW9uUmVmcy5pbmRleE9mKHJlZik7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgbGVmdE92ZXJbc2VsZWN0ZWRJbmRleF0gPSBpdGVtO1xuICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uVXBkYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAvLyBGaWx0ZXIgb3V0IGFueSB1bm1hdGNoZWQgaXRlbXMgaWYgd2UncmUgdXNpbmcgc21hcnQgZGF0YWdyaWRzIHdoZXJlIHdlIGV4cGVjdCBhbGwgaXRlbXMgdG8gYmVcbiAgICAgICAgICAgICAgLy8gcHJlc2VudFxuICAgICAgICAgICAgICBpZiAoX2l0ZW1zLnNtYXJ0KSB7XG4gICAgICAgICAgICAgICAgbGVmdE92ZXIgPSBsZWZ0T3Zlci5maWx0ZXIoc2VsZWN0ZWQgPT4gdXBkYXRlZEl0ZW1zLmluZGV4T2Yoc2VsZWN0ZWQpID4gLTEpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnQubGVuZ3RoICE9PSBsZWZ0T3Zlci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgIHNlbGVjdGlvblVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChzZWxlY3Rpb25VcGRhdGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gbGVmdE92ZXI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBTeW5jIGxvY2tlZCBpdGVtc1xuICAgICAgICB0aGlzLmxvY2tlZFJlZnMgPSB1cGRhdGVMb2NrZWRSZWY7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaCh0aGlzLnZhbHVlQ29sbGVjdG9yLnBpcGUoZGVib3VuY2VUaW1lKDApKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5lbWl0Q2hhbmdlKCkpKTtcbiAgfVxuXG4gIGdldCBzZWxlY3Rpb25UeXBlKCk6IFNlbGVjdGlvblR5cGUge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb25UeXBlO1xuICB9XG4gIHNldCBzZWxlY3Rpb25UeXBlKHZhbHVlOiBTZWxlY3Rpb25UeXBlKSB7XG4gICAgaWYgKHZhbHVlID09PSB0aGlzLnNlbGVjdGlvblR5cGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fc2VsZWN0aW9uVHlwZSA9IHZhbHVlO1xuICAgIGlmIChbU2VsZWN0aW9uVHlwZS5Ob25lLCBTZWxlY3Rpb25UeXBlLlNpbmdsZV0uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgICBkZWxldGUgdGhpcy5jdXJyZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVwZGF0ZUN1cnJlbnQoW10sIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBnZXQgY3VycmVudCgpOiBUW10ge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50O1xuICB9XG4gIHNldCBjdXJyZW50KHZhbHVlOiBUW10pIHtcbiAgICB0aGlzLnVwZGF0ZUN1cnJlbnQodmFsdWUsIHRydWUpO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRTaW5nbGUoKTogVCB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRTaW5nbGU7XG4gIH1cbiAgc2V0IGN1cnJlbnRTaW5nbGUodmFsdWU6IFQpIHtcbiAgICBpZiAodmFsdWUgPT09IHRoaXMuX2N1cnJlbnRTaW5nbGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fY3VycmVudFNpbmdsZSA9IHZhbHVlO1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5wcmV2U2luZ2xlU2VsZWN0aW9uUmVmID0gdGhpcy5faXRlbXMudHJhY2tCeSh2YWx1ZSk7XG4gICAgfVxuICAgIHRoaXMuZW1pdENoYW5nZSgpO1xuICB9XG5cbiAgLy8gV2UgZG8gbm90IHdhbnQgdG8gZXhwb3NlIHRoZSBTdWJqZWN0IGl0c2VsZiwgYnV0IHRoZSBPYnNlcnZhYmxlIHdoaWNoIGlzIHJlYWQtb25seVxuICBnZXQgY2hhbmdlKCk6IE9ic2VydmFibGU8VFtdIHwgVD4ge1xuICAgIHJldHVybiB0aGlzLl9jaGFuZ2UuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBwcml2YXRlIGdldCBfc2VsZWN0YWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5NdWx0aSB8fCB0aGlzLl9zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLlNpbmdsZTtcbiAgfVxuXG4gIC8vIFJlZnMgb2YgY3VycmVudGx5IHNlbGVjdGVkIGl0ZW1zXG4gIHByaXZhdGUgZ2V0IGN1cnJlbnRTZWxlY3Rpb25SZWZzKCk6IFRbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnQ/Lm1hcChpdGVtID0+IHRoaXMuX2l0ZW1zLnRyYWNrQnkoaXRlbSkpIHx8IFtdO1xuICB9XG5cbiAgLy8gUmVmIG9mIGN1cnJlbnRseSBzZWxlY3RlZCBpdGVtXG4gIHByaXZhdGUgZ2V0IGN1cnJlbnRTaW5nbGVTZWxlY3Rpb25SZWYoKTogVCB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRTaW5nbGUgJiYgdGhpcy5faXRlbXMudHJhY2tCeSh0aGlzLl9jdXJyZW50U2luZ2xlKTtcbiAgfVxuXG4gIGNsZWFyU2VsZWN0aW9uKCk6IHZvaWQge1xuICAgIHRoaXMuX2N1cnJlbnQgPSBbXTtcbiAgICB0aGlzLnByZXZTZWxlY3Rpb25SZWZzID0gW107XG4gICAgdGhpcy5wcmV2U2luZ2xlU2VsZWN0aW9uUmVmID0gbnVsbDtcbiAgICB0aGlzLl9jdXJyZW50U2luZ2xlID0gbnVsbDtcbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhbnMgdXAgb3VyIHN1YnNjcmlwdGlvbnMgdG8gb3RoZXIgcHJvdmlkZXJzXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICB1cGRhdGVDdXJyZW50KHZhbHVlOiBUW10sIGVtaXQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9jdXJyZW50ID0gdmFsdWU7XG4gICAgaWYgKGVtaXQpIHtcbiAgICAgIHRoaXMudmFsdWVDb2xsZWN0b3IubmV4dCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhbiBpdGVtIGlzIGN1cnJlbnRseSBzZWxlY3RlZFxuICAgKi9cbiAgaXNTZWxlY3RlZChpdGVtOiBUKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcmVmID0gdGhpcy5faXRlbXMudHJhY2tCeShpdGVtKTtcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5TaW5nbGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTaW5nbGVTZWxlY3Rpb25SZWYgPT09IHJlZjtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3NlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuTXVsdGkpIHtcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTZWxlY3Rpb25SZWZzLmluZGV4T2YocmVmKSA+PSAwO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0cyBvciBkZXNlbGVjdHMgYW4gaXRlbVxuICAgKi9cbiAgc2V0U2VsZWN0ZWQoaXRlbTogVCwgc2VsZWN0ZWQ6IGJvb2xlYW4pIHtcbiAgICBjb25zdCByZWYgPSB0aGlzLl9pdGVtcy50cmFja0J5KGl0ZW0pO1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jdXJyZW50U2VsZWN0aW9uUmVmcyA/IHRoaXMuY3VycmVudFNlbGVjdGlvblJlZnMuaW5kZXhPZihyZWYpIDogLTE7XG5cbiAgICBzd2l0Y2ggKHRoaXMuX3NlbGVjdGlvblR5cGUpIHtcbiAgICAgIGNhc2UgU2VsZWN0aW9uVHlwZS5Ob25lOlxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU2VsZWN0aW9uVHlwZS5TaW5nbGU6XG4gICAgICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgICAgIHRoaXMuY3VycmVudFNpbmdsZSA9IGl0ZW07XG4gICAgICAgIH1cbiAgICAgICAgLy8gaW4gc2luZ2xlIHNlbGVjdGlvbiwgc2V0IGN1cnJlbnRTaW5nbGUgbWV0aG9kIHNob3VsZCBiZSB1c2VkXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTZWxlY3Rpb25UeXBlLk11bHRpOlxuICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiAhc2VsZWN0ZWQpIHtcbiAgICAgICAgICB0aGlzLmRlc2VsZWN0SXRlbShpbmRleCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPCAwICYmIHNlbGVjdGVkKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RJdGVtKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhbGwgY3VycmVudGx5IGRpc3BsYXllZCBpdGVtcyBhcmUgc2VsZWN0ZWRcbiAgICovXG4gIGlzQWxsU2VsZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvblR5cGUgIT09IFNlbGVjdGlvblR5cGUuTXVsdGkgfHwgIXRoaXMuX2l0ZW1zLmRpc3BsYXllZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBtYWtlIHN1cmUgdG8gZXhjbHVkZSB0aGUgbG9ja2VkIGl0ZW1zIGZyb20gdGhlIGxpc3Qgd2hlbiBjb3VudGluZ1xuICAgIGNvbnN0IGRpc3BsYXllZEl0ZW1zOiBUW10gPSB0aGlzLl9pdGVtcy5kaXNwbGF5ZWQuZmlsdGVyKGl0ZW0gPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaXNMb2NrZWQoaXRlbSkgPT09IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgY29uc3QgbmJEaXNwbGF5ZWQgPSBkaXNwbGF5ZWRJdGVtcy5sZW5ndGg7XG4gICAgaWYgKG5iRGlzcGxheWVkIDwgMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCB0ZW1wOiBUW10gPSBkaXNwbGF5ZWRJdGVtcy5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICBjb25zdCByZWYgPSB0aGlzLl9pdGVtcy50cmFja0J5KGl0ZW0pO1xuICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFNlbGVjdGlvblJlZnMuaW5kZXhPZihyZWYpID4gLTE7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRlbXAubGVuZ3RoID09PSBkaXNwbGF5ZWRJdGVtcy5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogTG9jayBhbmQgdW5sb2NrIGl0ZW1cbiAgICovXG4gIGxvY2tJdGVtKGl0ZW06IFQsIGxvY2s6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5jYW5JdEJlTG9ja2VkKCkpIHtcbiAgICAgIGNvbnN0IHJlZiA9IHRoaXMuX2l0ZW1zLnRyYWNrQnkoaXRlbSk7XG4gICAgICBpZiAobG9jayA9PT0gdHJ1ZSkge1xuICAgICAgICAvLyBBZGQgdG8gbG9ja2VkUmVmXG4gICAgICAgIHRoaXMubG9ja2VkUmVmcy5wdXNoKHJlZik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBSZW1vdmUgZnJvbSBsb2NrZWRSZWZcbiAgICAgICAgdGhpcy5sb2NrZWRSZWZzID0gdGhpcy5sb2NrZWRSZWZzLmZpbHRlcihsb2NrZWRJdGVtID0+IHJlZiAhPT0gbG9ja2VkSXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlzIGl0ZW0gbG9ja2VkIG9yIG5vdCBieSBzZWFyY2hpbmcgaW50byBsb2NrZWRSZWZzIGZvciBlbnRyeVxuICAgKi9cbiAgaXNMb2NrZWQoaXRlbTogVCk6IGJvb2xlYW4ge1xuICAgIC8qKlxuICAgICAqIFRoZSBjaGVjayBmb3Igc2VsZWN0aW9uVHlwZSB3aWxsIGJvb3N0IHRoZSBwZXJmb3JtYW5jZSBieSBOT1Qgc2VhcmNoaW5nXG4gICAgICogaW50byB0aGUgYXJyYXkgd2hlbiB0aGVyZSBpcyBubyBuZWVkIGZvciB0aGF0LlxuICAgICAqL1xuICAgIGlmICh0aGlzLmNhbkl0QmVMb2NrZWQoKSkge1xuICAgICAgY29uc3QgcmVmID0gdGhpcy5faXRlbXMudHJhY2tCeShpdGVtKTtcbiAgICAgIHJldHVybiB0aGlzLmxvY2tlZFJlZnMuaW5kZXhPZihyZWYpID4gLTE7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgb3IgZGVzZWxlY3RzIGFsbCBjdXJyZW50bHkgZGlzcGxheWVkIGl0ZW1zXG4gICAqL1xuICB0b2dnbGVBbGwoKSB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuTm9uZSB8fCB0aGlzLl9zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLlNpbmdsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJZiBldmVyeSBjdXJyZW50bHkgZGlzcGxheWVkIGl0ZW0gaXMgYWxyZWFkeSBzZWxlY3RlZCwgd2UgY2xlYXIgdGhlbS5cbiAgICAgKiBJZiBhdCBsZWFzdCBvbmUgaXRlbSBpc24ndCBzZWxlY3RlZCwgd2Ugc2VsZWN0IGV2ZXJ5IGN1cnJlbnRseSBkaXNwbGF5ZWQgaXRlbS5cbiAgICAgKi9cbiAgICBpZiAodGhpcy5pc0FsbFNlbGVjdGVkKCkpIHtcbiAgICAgIHRoaXMuX2l0ZW1zLmRpc3BsYXllZC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBjb25zdCByZWYgPSB0aGlzLl9pdGVtcy50cmFja0J5KGl0ZW0pO1xuICAgICAgICBjb25zdCBjdXJyZW50SW5kZXggPSB0aGlzLmN1cnJlbnRTZWxlY3Rpb25SZWZzLmluZGV4T2YocmVmKTtcbiAgICAgICAgaWYgKGN1cnJlbnRJbmRleCA+IC0xICYmIHRoaXMuaXNMb2NrZWQoaXRlbSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgdGhpcy5kZXNlbGVjdEl0ZW0oY3VycmVudEluZGV4KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2l0ZW1zLmRpc3BsYXllZC5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBpZiAoIXRoaXMuaXNTZWxlY3RlZChpdGVtKSAmJiB0aGlzLmlzTG9ja2VkKGl0ZW0pID09PSBmYWxzZSkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0SXRlbShpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgYW4gaXRlbVxuICAgKi9cbiAgcHJpdmF0ZSBzZWxlY3RJdGVtKGl0ZW06IFQpOiB2b2lkIHtcbiAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLmN1cnJlbnQuY29uY2F0KGl0ZW0pO1xuICAgIC8vIFB1c2ggc2VsZWN0ZWQgcmVmIG9udG8gYXJyYXlcbiAgICB0aGlzLnByZXZTZWxlY3Rpb25SZWZzLnB1c2godGhpcy5faXRlbXMudHJhY2tCeShpdGVtKSk7XG4gIH1cblxuICAvKipcbiAgICogRGVzZWxlY3RzIGFuIGl0ZW1cbiAgICovXG4gIHByaXZhdGUgZGVzZWxlY3RJdGVtKGluZGV4T2ZJdGVtOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLmN1cnJlbnQuc2xpY2UoMCwgaW5kZXhPZkl0ZW0pLmNvbmNhdCh0aGlzLmN1cnJlbnQuc2xpY2UoaW5kZXhPZkl0ZW0gKyAxKSk7XG4gICAgaWYgKGluZGV4T2ZJdGVtIDwgdGhpcy5wcmV2U2VsZWN0aW9uUmVmcy5sZW5ndGgpIHtcbiAgICAgIC8vIEtlZXAgc2VsZWN0ZWQgcmVmcyBhcnJheSBpbiBzeW5jXG4gICAgICBjb25zdCByZW1vdmVkSXRlbXMgPSB0aGlzLnByZXZTZWxlY3Rpb25SZWZzLnNwbGljZShpbmRleE9mSXRlbSwgMSk7XG4gICAgICAvLyBsb2NrZWQgcmVmZXJlbmNlIGlzIG5vIGxvbmdlciBuZWVkZWQgKGlmIGFueSlcbiAgICAgIHRoaXMubG9ja2VkUmVmcyA9IHRoaXMubG9ja2VkUmVmcy5maWx0ZXIobG9ja2VkID0+IGxvY2tlZCAhPT0gcmVtb3ZlZEl0ZW1zWzBdKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBzdXJlIHRoYXQgaXQgY291bGQgYmUgbG9ja2VkXG4gICAqL1xuICBwcml2YXRlIGNhbkl0QmVMb2NrZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvblR5cGUgIT09IFNlbGVjdGlvblR5cGUuTm9uZTtcbiAgfVxuXG4gIHByaXZhdGUgZW1pdENoYW5nZSgpIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5TaW5nbGUpIHtcbiAgICAgIHRoaXMuX2NoYW5nZS5uZXh0KHRoaXMuY3VycmVudFNpbmdsZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLk11bHRpKSB7XG4gICAgICB0aGlzLl9jaGFuZ2UubmV4dCh0aGlzLmN1cnJlbnQpO1xuICAgIH1cbiAgfVxufVxuIl19