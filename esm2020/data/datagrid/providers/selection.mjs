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
    constructor(_items, filters, differs) {
        this._items = _items;
        this.differs = differs;
        this.preserveSelection = false;
        /**
         * Shift key state, for use in range selection.
         */
        this.shiftPressed = false;
        /** @deprecated since 2.0, remove in 3.0 */
        this.rowSelectionMode = false;
        this.lockedRefs = []; // Ref of locked items
        this._currentSelectionRefs = [];
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
        this.trackBy = _items.trackBy;
        this._differ = differs.find(this._current || []).create(this.trackBy);
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
                    updatedItems.forEach(item => {
                        const ref = _items.trackBy(item);
                        // If one of the updated items is the previously selectedSingle, set it as the new one
                        if (this.currentSingleSelectionRef === ref) {
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
                            const selectedIndex = this.currentSelectionRefs.indexOf(ref);
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
        this.updateCurrentSelectionRefs();
    }
    get currentSingle() {
        return this._currentSingle;
    }
    set currentSingle(value) {
        if (value === this._currentSingle) {
            return;
        }
        this._currentSingle = value;
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
        return this._currentSelectionRefs;
    }
    // Ref of currently selected item
    get currentSingleSelectionRef() {
        return this._currentSingle && this._items.trackBy(this._currentSingle);
    }
    checkForChanges() {
        const changes = this._differ.diff(this._current);
        // @TODO move the trackBy from items to selection as it's used only here and is not needed in items
        if (this.trackBy !== this._items.trackBy) {
            this.trackBy = this._items.trackBy;
        }
        if (changes) {
            this.updateCurrentSelectionRefs();
        }
    }
    clearSelection() {
        this._current = [];
        this._currentSelectionRefs = [];
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
    }
    /**
     * Deselects an item
     */
    deselectItem(indexOfItem) {
        this.current = this.current.slice(0, indexOfItem).concat(this.current.slice(indexOfItem + 1));
        if (indexOfItem < this.currentSelectionRefs.length) {
            // Keep selected refs array in sync
            const removedItems = this.currentSelectionRefs[indexOfItem];
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
    updateCurrentSelectionRefs() {
        this._currentSelectionRefs = this._current?.map(item => this._items.trackBy(item)) || [];
    }
}
Selection.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: Selection, deps: [{ token: i1.Items }, { token: i2.FiltersProvider }, { token: i0.IterableDiffers }], target: i0.ɵɵFactoryTarget.Injectable });
Selection.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: Selection });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: Selection, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Items }, { type: i2.FiltersProvider }, { type: i0.IterableDiffers }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9wcm92aWRlcnMvc2VsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBb0QsTUFBTSxlQUFlLENBQUM7QUFDN0YsT0FBTyxFQUFjLE9BQU8sRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFDekQsT0FBTyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0seUJBQXlCLENBQUM7Ozs7QUFJeEQsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBR3BCLE1BQU0sT0FBTyxTQUFTO0lBZ0RwQixZQUFvQixNQUFnQixFQUFFLE9BQTJCLEVBQVUsT0FBd0I7UUFBL0UsV0FBTSxHQUFOLE1BQU0sQ0FBVTtRQUF1QyxZQUFPLEdBQVAsT0FBTyxDQUFpQjtRQTlDbkcsc0JBQWlCLEdBQUcsS0FBSyxDQUFDO1FBTzFCOztXQUVHO1FBQ0gsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFFckIsMkNBQTJDO1FBQzNDLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQUVqQixlQUFVLEdBQVEsRUFBRSxDQUFDLENBQUMsc0JBQXNCO1FBQzVDLDBCQUFxQixHQUFRLEVBQUUsQ0FBQztRQUNoQyxtQkFBYyxHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7UUFDcEMsbUJBQWMsR0FBa0IsYUFBYSxDQUFDLElBQUksQ0FBQztRQVkzRDs7V0FFRztRQUNLLFlBQU8sR0FBRyxJQUFJLE9BQU8sRUFBVyxDQUFDO1FBRXpDOztXQUVHO1FBQ0ssa0JBQWEsR0FBbUIsRUFBRSxDQUFDO1FBU3pDLElBQUksQ0FBQyxFQUFFLEdBQUcsa0JBQWtCLEdBQUcsV0FBVyxFQUFFLENBQUM7UUFDN0Ms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RUFBRTtZQUNsRCxtQ0FBbUM7WUFDbkMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzVELGdEQUFnRDtZQUNoRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2hGO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0ssYUFBYTtRQUNuQixPQUFPLElBQUksQ0FBQyxjQUFjLEtBQUssYUFBYSxDQUFDLElBQUksQ0FBQztJQUNwRCxDQUFDO0lBRU8sVUFBVTtRQUNoQixJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssYUFBYSxDQUFDLE1BQU0sRUFBRTtZQUNoRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDdkM7YUFBTSxJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssYUFBYSxDQUFDLEtBQUssRUFBRTtZQUN0RCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDakM7SUFDSCxDQUFDO0lBRU8sMEJBQTBCO1FBQ2hDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNGLENBQUM7O3NHQXRaVSxTQUFTOzBHQUFULFNBQVM7MkZBQVQsU0FBUztrQkFEckIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSXRlcmFibGVEaWZmZXIsIEl0ZXJhYmxlRGlmZmVycywgVHJhY2tCeUZ1bmN0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgZGVsYXkgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IFNlbGVjdGlvblR5cGUgfSBmcm9tICcuLi9lbnVtcy9zZWxlY3Rpb24tdHlwZSc7XG5pbXBvcnQgeyBGaWx0ZXJzUHJvdmlkZXIgfSBmcm9tICcuL2ZpbHRlcnMnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRJdGVtc1RyYWNrQnlGdW5jdGlvbiwgSXRlbXMgfSBmcm9tICcuL2l0ZW1zJztcblxubGV0IG5iU2VsZWN0aW9uID0gMDtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNlbGVjdGlvbjxUID0gYW55PiB7XG4gIGlkOiBzdHJpbmc7XG4gIHByZXNlcnZlU2VsZWN0aW9uID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIExhc3Qgc2VsZWN0aW9uLCBmb3IgdXNlIGluIHJhbmdlIHNlbGVjdGlvbi5cbiAgICovXG4gIHJhbmdlU3RhcnQ6IFQ7XG5cbiAgLyoqXG4gICAqIFNoaWZ0IGtleSBzdGF0ZSwgZm9yIHVzZSBpbiByYW5nZSBzZWxlY3Rpb24uXG4gICAqL1xuICBzaGlmdFByZXNzZWQgPSBmYWxzZTtcblxuICAvKiogQGRlcHJlY2F0ZWQgc2luY2UgMi4wLCByZW1vdmUgaW4gMy4wICovXG4gIHJvd1NlbGVjdGlvbk1vZGUgPSBmYWxzZTtcblxuICBwcml2YXRlIGxvY2tlZFJlZnM6IFRbXSA9IFtdOyAvLyBSZWYgb2YgbG9ja2VkIGl0ZW1zXG4gIHByaXZhdGUgX2N1cnJlbnRTZWxlY3Rpb25SZWZzOiBUW10gPSBbXTtcbiAgcHJpdmF0ZSB2YWx1ZUNvbGxlY3RvciA9IG5ldyBTdWJqZWN0PFRbXT4oKTtcbiAgcHJpdmF0ZSBfc2VsZWN0aW9uVHlwZTogU2VsZWN0aW9uVHlwZSA9IFNlbGVjdGlvblR5cGUuTm9uZTtcblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgc2VsZWN0aW9uXG4gICAqL1xuICBwcml2YXRlIF9jdXJyZW50OiBUW107XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IHNlbGVjdGlvbiBpbiBzaW5nbGUgc2VsZWN0aW9uIHR5cGVcbiAgICovXG4gIHByaXZhdGUgX2N1cnJlbnRTaW5nbGU6IFQ7XG5cbiAgLyoqXG4gICAqIFRoZSBPYnNlcnZhYmxlIHRoYXQgbGV0cyBvdGhlciBjbGFzc2VzIHN1YnNjcmliZSB0byBzZWxlY3Rpb24gY2hhbmdlc1xuICAgKi9cbiAgcHJpdmF0ZSBfY2hhbmdlID0gbmV3IFN1YmplY3Q8VFtdIHwgVD4oKTtcblxuICAvKipcbiAgICogU3Vic2NyaXB0aW9ucyB0byB0aGUgb3RoZXIgcHJvdmlkZXJzIGNoYW5nZXMuXG4gICAqL1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgLyoqXG4gICAqIERpZmZlciB0byB0cmFjayBjaGFuZ2VzIG9mIG11bHRpIHNlbGVjdGlvbi5cbiAgICovXG4gIHByaXZhdGUgX2RpZmZlciE6IEl0ZXJhYmxlRGlmZmVyPFQ+O1xuICBwcml2YXRlIHRyYWNrQnk6IENsckRhdGFncmlkSXRlbXNUcmFja0J5RnVuY3Rpb248VD47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfaXRlbXM6IEl0ZW1zPFQ+LCBmaWx0ZXJzOiBGaWx0ZXJzUHJvdmlkZXI8VD4sIHByaXZhdGUgZGlmZmVyczogSXRlcmFibGVEaWZmZXJzKSB7XG4gICAgdGhpcy5pZCA9ICdjbHItZGctc2VsZWN0aW9uJyArIG5iU2VsZWN0aW9uKys7XG4gICAgdGhpcy50cmFja0J5ID0gX2l0ZW1zLnRyYWNrQnk7XG4gICAgdGhpcy5fZGlmZmVyID0gZGlmZmVycy5maW5kKHRoaXMuX2N1cnJlbnQgfHwgW10pLmNyZWF0ZTxUPih0aGlzLnRyYWNrQnkgYXMgVHJhY2tCeUZ1bmN0aW9uPFQ+KTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgZmlsdGVycy5jaGFuZ2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLl9zZWxlY3RhYmxlIHx8IHRoaXMucHJlc2VydmVTZWxlY3Rpb24pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICBfaXRlbXMuYWxsQ2hhbmdlcy5waXBlKGRlbGF5KDApKS5zdWJzY3JpYmUodXBkYXRlZEl0ZW1zID0+IHtcbiAgICAgICAgLy8gUmVzZXQgdGhlIGxvY2tlZFJlZnM7XG4gICAgICAgIGNvbnN0IHVwZGF0ZUxvY2tlZFJlZjogVFtdID0gW107XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLnNlbGVjdGlvblR5cGUpIHtcbiAgICAgICAgICBjYXNlIFNlbGVjdGlvblR5cGUuTm9uZToge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSBTZWxlY3Rpb25UeXBlLlNpbmdsZToge1xuICAgICAgICAgICAgbGV0IG5ld1NpbmdsZTogYW55O1xuICAgICAgICAgICAgbGV0IHNlbGVjdGlvblVwZGF0ZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgdXBkYXRlZEl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlZiA9IF9pdGVtcy50cmFja0J5KGl0ZW0pO1xuICAgICAgICAgICAgICAvLyBJZiBvbmUgb2YgdGhlIHVwZGF0ZWQgaXRlbXMgaXMgdGhlIHByZXZpb3VzbHkgc2VsZWN0ZWRTaW5nbGUsIHNldCBpdCBhcyB0aGUgbmV3IG9uZVxuICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50U2luZ2xlU2VsZWN0aW9uUmVmID09PSByZWYpIHtcbiAgICAgICAgICAgICAgICBuZXdTaW5nbGUgPSBpdGVtO1xuICAgICAgICAgICAgICAgIHNlbGVjdGlvblVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICh0aGlzLmxvY2tlZFJlZnMuaW5kZXhPZihyZWYpID4gLTEpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVMb2NrZWRSZWYucHVzaChyZWYpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gSWYgd2UncmUgdXNpbmcgc21hcnQgZGF0YWdyaWRzLCB3ZSBleHBlY3QgYWxsIGl0ZW1zIHRvIGJlIHByZXNlbnQgaW4gdGhlIHVwZGF0ZWRJdGVtcyBhcnJheS5cbiAgICAgICAgICAgIC8vIFRoZXJlZm9yZSwgd2Ugc2hvdWxkIGRlbGV0ZSB0aGUgY3VycmVudFNpbmdsZSBpZiBpdCB1c2VkIHRvIGJlIGRlZmluZWQgYnV0IGRvZXNuJ3QgZXhpc3QgYW55bW9yZS5cbiAgICAgICAgICAgIC8vIE5vIGV4cGxpY2l0IFwiZGVsZXRlXCIgaXMgcmVxdWlyZWQsIHNpbmNlIG5ld1NpbmdsZSB3b3VsZCBiZSB1bmRlZmluZWQgYXQgdGhpcyBwb2ludC5cbiAgICAgICAgICAgIC8vIE1hcmtpbmcgaXQgYXMgc2VsZWN0aW9uVXBkYXRlZCBoZXJlIHdpbGwgc2V0IGN1cnJlbnRTaW5nbGUgdG8gdW5kZWZpbmVkIGJlbG93IGluIHRoZSBzZXRUaW1lb3V0LlxuICAgICAgICAgICAgaWYgKF9pdGVtcy5zbWFydCAmJiAhbmV3U2luZ2xlKSB7XG4gICAgICAgICAgICAgIHNlbGVjdGlvblVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2VsZWN0aW9uVXBkYXRlZCkge1xuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTaW5nbGUgPSBuZXdTaW5nbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlIFNlbGVjdGlvblR5cGUuTXVsdGk6IHtcbiAgICAgICAgICAgIGxldCBsZWZ0T3ZlcjogYW55W10gPSB0aGlzLmN1cnJlbnQuc2xpY2UoKTtcbiAgICAgICAgICAgIGxldCBzZWxlY3Rpb25VcGRhdGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIER1cGxpY2F0ZSBsb29wLCB3aGVuIHRoZSBpc3N1ZSBpcyBpc3N1ZSMyMzQyIGlzIHJldmlzaXRlZCBrZWVwIGluIG1pbmQgdGhhdFxuICAgICAgICAgICAgLy8gd2UgbmVlZCB0byBnbyBvdmVyIGV2ZXJ5IHVwZGF0ZWQgaXRlbSBhbmQgY2hlY2sgdG8gc2VlIGlmIHRoZXJlIGFyZSB2YWxpZCB0byBiZVxuICAgICAgICAgICAgLy8gbG9ja2VkIG9yIG5vdCBhbmQgdXBkYXRlIGl0LiBXaGVuIG9ubHkgYWRkIGl0ZW1zIHRoYXQgYXJlIGZvdW5kIGluIHRoZSBsb2NrZWRSZWZzIGJhY2suXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gVGhlIGJvdGggbG9vcHMgYmVsb3cgdGhhdCBnb2VzIG92ZXIgdXBkYXRlZEl0ZW1zIGNvdWxkIGJlIGNvbWJpbmVkIGludG8gb25lLlxuICAgICAgICAgICAgdXBkYXRlZEl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHJlZiA9IF9pdGVtcy50cmFja0J5KGl0ZW0pO1xuICAgICAgICAgICAgICBpZiAodGhpcy5sb2NrZWRSZWZzLmluZGV4T2YocmVmKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlTG9ja2VkUmVmLnB1c2gocmVmKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFRPRE86IHJldmlzaXQgdGhpcyB3aGVuIHdlIHdvcmsgb24gaHR0cHM6Ly9naXRodWIuY29tL3Ztd2FyZS9jbGFyaXR5L2lzc3Vlcy8yMzQyXG4gICAgICAgICAgICAvLyBjdXJyZW50bHksIHRoZSBzZWxlY3Rpb24gaXMgY2xlYXJlZCB3aGVuIGZpbHRlciBpcyBhcHBsaWVkLCBzbyB0aGUgbG9naWMgaW5zaWRlXG4gICAgICAgICAgICAvLyB0aGUgaWYgc3RhdGVtZW50IGJlbG93IHJlc3VsdHMgaW4gYnJva2VuIGJlaGF2aW9yLlxuICAgICAgICAgICAgaWYgKGxlZnRPdmVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgdXBkYXRlZEl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVmID0gX2l0ZW1zLnRyYWNrQnkoaXRlbSk7XG4gICAgICAgICAgICAgICAgLy8gTG9vayBpbiBjdXJyZW50IHNlbGVjdGVkIHJlZnMgYXJyYXkgaWYgaXRlbSBpcyBzZWxlY3RlZCwgYW5kIHVwZGF0ZSBhY3R1YWwgdmFsdWVcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RlZEluZGV4ID0gdGhpcy5jdXJyZW50U2VsZWN0aW9uUmVmcy5pbmRleE9mKHJlZik7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgbGVmdE92ZXJbc2VsZWN0ZWRJbmRleF0gPSBpdGVtO1xuICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uVXBkYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAvLyBGaWx0ZXIgb3V0IGFueSB1bm1hdGNoZWQgaXRlbXMgaWYgd2UncmUgdXNpbmcgc21hcnQgZGF0YWdyaWRzIHdoZXJlIHdlIGV4cGVjdCBhbGwgaXRlbXMgdG8gYmVcbiAgICAgICAgICAgICAgLy8gcHJlc2VudFxuICAgICAgICAgICAgICBpZiAoX2l0ZW1zLnNtYXJ0KSB7XG4gICAgICAgICAgICAgICAgbGVmdE92ZXIgPSBsZWZ0T3Zlci5maWx0ZXIoc2VsZWN0ZWQgPT4gdXBkYXRlZEl0ZW1zLmluZGV4T2Yoc2VsZWN0ZWQpID4gLTEpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnQubGVuZ3RoICE9PSBsZWZ0T3Zlci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgIHNlbGVjdGlvblVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChzZWxlY3Rpb25VcGRhdGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gbGVmdE92ZXI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBTeW5jIGxvY2tlZCBpdGVtc1xuICAgICAgICB0aGlzLmxvY2tlZFJlZnMgPSB1cGRhdGVMb2NrZWRSZWY7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaCh0aGlzLnZhbHVlQ29sbGVjdG9yLnBpcGUoZGVib3VuY2VUaW1lKDApKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5lbWl0Q2hhbmdlKCkpKTtcbiAgfVxuXG4gIGdldCBzZWxlY3Rpb25UeXBlKCk6IFNlbGVjdGlvblR5cGUge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb25UeXBlO1xuICB9XG4gIHNldCBzZWxlY3Rpb25UeXBlKHZhbHVlOiBTZWxlY3Rpb25UeXBlKSB7XG4gICAgaWYgKHZhbHVlID09PSB0aGlzLnNlbGVjdGlvblR5cGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fc2VsZWN0aW9uVHlwZSA9IHZhbHVlO1xuICAgIGlmIChbU2VsZWN0aW9uVHlwZS5Ob25lLCBTZWxlY3Rpb25UeXBlLlNpbmdsZV0uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgICBkZWxldGUgdGhpcy5jdXJyZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVwZGF0ZUN1cnJlbnQoW10sIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBnZXQgY3VycmVudCgpOiBUW10ge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50O1xuICB9XG4gIHNldCBjdXJyZW50KHZhbHVlOiBUW10pIHtcbiAgICB0aGlzLnVwZGF0ZUN1cnJlbnQodmFsdWUsIHRydWUpO1xuICAgIHRoaXMudXBkYXRlQ3VycmVudFNlbGVjdGlvblJlZnMoKTtcbiAgfVxuXG4gIGdldCBjdXJyZW50U2luZ2xlKCk6IFQge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50U2luZ2xlO1xuICB9XG4gIHNldCBjdXJyZW50U2luZ2xlKHZhbHVlOiBUKSB7XG4gICAgaWYgKHZhbHVlID09PSB0aGlzLl9jdXJyZW50U2luZ2xlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2N1cnJlbnRTaW5nbGUgPSB2YWx1ZTtcbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIC8vIFdlIGRvIG5vdCB3YW50IHRvIGV4cG9zZSB0aGUgU3ViamVjdCBpdHNlbGYsIGJ1dCB0aGUgT2JzZXJ2YWJsZSB3aGljaCBpcyByZWFkLW9ubHlcbiAgZ2V0IGNoYW5nZSgpOiBPYnNlcnZhYmxlPFRbXSB8IFQ+IHtcbiAgICByZXR1cm4gdGhpcy5fY2hhbmdlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgX3NlbGVjdGFibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuTXVsdGkgfHwgdGhpcy5fc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5TaW5nbGU7XG4gIH1cblxuICAvLyBSZWZzIG9mIGN1cnJlbnRseSBzZWxlY3RlZCBpdGVtc1xuICBwcml2YXRlIGdldCBjdXJyZW50U2VsZWN0aW9uUmVmcygpOiBUW10ge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50U2VsZWN0aW9uUmVmcztcbiAgfVxuXG4gIC8vIFJlZiBvZiBjdXJyZW50bHkgc2VsZWN0ZWQgaXRlbVxuICBwcml2YXRlIGdldCBjdXJyZW50U2luZ2xlU2VsZWN0aW9uUmVmKCk6IFQge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50U2luZ2xlICYmIHRoaXMuX2l0ZW1zLnRyYWNrQnkodGhpcy5fY3VycmVudFNpbmdsZSk7XG4gIH1cblxuICBjaGVja0ZvckNoYW5nZXMoKTogdm9pZCB7XG4gICAgY29uc3QgY2hhbmdlcyA9IHRoaXMuX2RpZmZlci5kaWZmKHRoaXMuX2N1cnJlbnQpO1xuICAgIC8vIEBUT0RPIG1vdmUgdGhlIHRyYWNrQnkgZnJvbSBpdGVtcyB0byBzZWxlY3Rpb24gYXMgaXQncyB1c2VkIG9ubHkgaGVyZSBhbmQgaXMgbm90IG5lZWRlZCBpbiBpdGVtc1xuICAgIGlmICh0aGlzLnRyYWNrQnkgIT09IHRoaXMuX2l0ZW1zLnRyYWNrQnkpIHtcbiAgICAgIHRoaXMudHJhY2tCeSA9IHRoaXMuX2l0ZW1zLnRyYWNrQnk7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzKSB7XG4gICAgICB0aGlzLnVwZGF0ZUN1cnJlbnRTZWxlY3Rpb25SZWZzKCk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXJTZWxlY3Rpb24oKTogdm9pZCB7XG4gICAgdGhpcy5fY3VycmVudCA9IFtdO1xuICAgIHRoaXMuX2N1cnJlbnRTZWxlY3Rpb25SZWZzID0gW107XG4gICAgdGhpcy5fY3VycmVudFNpbmdsZSA9IG51bGw7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYW5zIHVwIG91ciBzdWJzY3JpcHRpb25zIHRvIG90aGVyIHByb3ZpZGVyc1xuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICB9XG5cbiAgdXBkYXRlQ3VycmVudCh2YWx1ZTogVFtdLCBlbWl0OiBib29sZWFuKSB7XG4gICAgdGhpcy5fY3VycmVudCA9IHZhbHVlO1xuICAgIGlmIChlbWl0KSB7XG4gICAgICB0aGlzLnZhbHVlQ29sbGVjdG9yLm5leHQodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYW4gaXRlbSBpcyBjdXJyZW50bHkgc2VsZWN0ZWRcbiAgICovXG4gIGlzU2VsZWN0ZWQoaXRlbTogVCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHJlZiA9IHRoaXMuX2l0ZW1zLnRyYWNrQnkoaXRlbSk7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuU2luZ2xlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50U2luZ2xlU2VsZWN0aW9uUmVmID09PSByZWY7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLk11bHRpKSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50U2VsZWN0aW9uUmVmcy5pbmRleE9mKHJlZikgPj0gMDtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgb3IgZGVzZWxlY3RzIGFuIGl0ZW1cbiAgICovXG4gIHNldFNlbGVjdGVkKGl0ZW06IFQsIHNlbGVjdGVkOiBib29sZWFuKSB7XG4gICAgY29uc3QgcmVmID0gdGhpcy5faXRlbXMudHJhY2tCeShpdGVtKTtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuY3VycmVudFNlbGVjdGlvblJlZnMgPyB0aGlzLmN1cnJlbnRTZWxlY3Rpb25SZWZzLmluZGV4T2YocmVmKSA6IC0xO1xuXG4gICAgc3dpdGNoICh0aGlzLl9zZWxlY3Rpb25UeXBlKSB7XG4gICAgICBjYXNlIFNlbGVjdGlvblR5cGUuTm9uZTpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNlbGVjdGlvblR5cGUuU2luZ2xlOlxuICAgICAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRTaW5nbGUgPSBpdGVtO1xuICAgICAgICB9XG4gICAgICAgIC8vIGluIHNpbmdsZSBzZWxlY3Rpb24sIHNldCBjdXJyZW50U2luZ2xlIG1ldGhvZCBzaG91bGQgYmUgdXNlZFxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU2VsZWN0aW9uVHlwZS5NdWx0aTpcbiAgICAgICAgaWYgKGluZGV4ID49IDAgJiYgIXNlbGVjdGVkKSB7XG4gICAgICAgICAgdGhpcy5kZXNlbGVjdEl0ZW0oaW5kZXgpO1xuICAgICAgICB9IGVsc2UgaWYgKGluZGV4IDwgMCAmJiBzZWxlY3RlZCkge1xuICAgICAgICAgIHRoaXMuc2VsZWN0SXRlbShpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYWxsIGN1cnJlbnRseSBkaXNwbGF5ZWQgaXRlbXMgYXJlIHNlbGVjdGVkXG4gICAqL1xuICBpc0FsbFNlbGVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLl9zZWxlY3Rpb25UeXBlICE9PSBTZWxlY3Rpb25UeXBlLk11bHRpIHx8ICF0aGlzLl9pdGVtcy5kaXNwbGF5ZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gbWFrZSBzdXJlIHRvIGV4Y2x1ZGUgdGhlIGxvY2tlZCBpdGVtcyBmcm9tIHRoZSBsaXN0IHdoZW4gY291bnRpbmdcbiAgICBjb25zdCBkaXNwbGF5ZWRJdGVtczogVFtdID0gdGhpcy5faXRlbXMuZGlzcGxheWVkLmZpbHRlcihpdGVtID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmlzTG9ja2VkKGl0ZW0pID09PSBmYWxzZTtcbiAgICB9KTtcblxuICAgIGNvbnN0IG5iRGlzcGxheWVkID0gZGlzcGxheWVkSXRlbXMubGVuZ3RoO1xuICAgIGlmIChuYkRpc3BsYXllZCA8IDEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgdGVtcDogVFtdID0gZGlzcGxheWVkSXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgcmVmID0gdGhpcy5faXRlbXMudHJhY2tCeShpdGVtKTtcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTZWxlY3Rpb25SZWZzLmluZGV4T2YocmVmKSA+IC0xO1xuICAgIH0pO1xuICAgIHJldHVybiB0ZW1wLmxlbmd0aCA9PT0gZGlzcGxheWVkSXRlbXMubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIExvY2sgYW5kIHVubG9jayBpdGVtXG4gICAqL1xuICBsb2NrSXRlbShpdGVtOiBULCBsb2NrOiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMuY2FuSXRCZUxvY2tlZCgpKSB7XG4gICAgICBjb25zdCByZWYgPSB0aGlzLl9pdGVtcy50cmFja0J5KGl0ZW0pO1xuICAgICAgaWYgKGxvY2sgPT09IHRydWUpIHtcbiAgICAgICAgLy8gQWRkIHRvIGxvY2tlZFJlZlxuICAgICAgICB0aGlzLmxvY2tlZFJlZnMucHVzaChyZWYpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUmVtb3ZlIGZyb20gbG9ja2VkUmVmXG4gICAgICAgIHRoaXMubG9ja2VkUmVmcyA9IHRoaXMubG9ja2VkUmVmcy5maWx0ZXIobG9ja2VkSXRlbSA9PiByZWYgIT09IGxvY2tlZEl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpcyBpdGVtIGxvY2tlZCBvciBub3QgYnkgc2VhcmNoaW5nIGludG8gbG9ja2VkUmVmcyBmb3IgZW50cnlcbiAgICovXG4gIGlzTG9ja2VkKGl0ZW06IFQpOiBib29sZWFuIHtcbiAgICAvKipcbiAgICAgKiBUaGUgY2hlY2sgZm9yIHNlbGVjdGlvblR5cGUgd2lsbCBib29zdCB0aGUgcGVyZm9ybWFuY2UgYnkgTk9UIHNlYXJjaGluZ1xuICAgICAqIGludG8gdGhlIGFycmF5IHdoZW4gdGhlcmUgaXMgbm8gbmVlZCBmb3IgdGhhdC5cbiAgICAgKi9cbiAgICBpZiAodGhpcy5jYW5JdEJlTG9ja2VkKCkpIHtcbiAgICAgIGNvbnN0IHJlZiA9IHRoaXMuX2l0ZW1zLnRyYWNrQnkoaXRlbSk7XG4gICAgICByZXR1cm4gdGhpcy5sb2NrZWRSZWZzLmluZGV4T2YocmVmKSA+IC0xO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIG9yIGRlc2VsZWN0cyBhbGwgY3VycmVudGx5IGRpc3BsYXllZCBpdGVtc1xuICAgKi9cbiAgdG9nZ2xlQWxsKCkge1xuICAgIGlmICh0aGlzLl9zZWxlY3Rpb25UeXBlID09PSBTZWxlY3Rpb25UeXBlLk5vbmUgfHwgdGhpcy5fc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5TaW5nbGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSWYgZXZlcnkgY3VycmVudGx5IGRpc3BsYXllZCBpdGVtIGlzIGFscmVhZHkgc2VsZWN0ZWQsIHdlIGNsZWFyIHRoZW0uXG4gICAgICogSWYgYXQgbGVhc3Qgb25lIGl0ZW0gaXNuJ3Qgc2VsZWN0ZWQsIHdlIHNlbGVjdCBldmVyeSBjdXJyZW50bHkgZGlzcGxheWVkIGl0ZW0uXG4gICAgICovXG4gICAgaWYgKHRoaXMuaXNBbGxTZWxlY3RlZCgpKSB7XG4gICAgICB0aGlzLl9pdGVtcy5kaXNwbGF5ZWQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgY29uc3QgcmVmID0gdGhpcy5faXRlbXMudHJhY2tCeShpdGVtKTtcbiAgICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gdGhpcy5jdXJyZW50U2VsZWN0aW9uUmVmcy5pbmRleE9mKHJlZik7XG4gICAgICAgIGlmIChjdXJyZW50SW5kZXggPiAtMSAmJiB0aGlzLmlzTG9ja2VkKGl0ZW0pID09PSBmYWxzZSkge1xuICAgICAgICAgIHRoaXMuZGVzZWxlY3RJdGVtKGN1cnJlbnRJbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9pdGVtcy5kaXNwbGF5ZWQuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmlzU2VsZWN0ZWQoaXRlbSkgJiYgdGhpcy5pc0xvY2tlZChpdGVtKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdEl0ZW0oaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIGFuIGl0ZW1cbiAgICovXG4gIHByaXZhdGUgc2VsZWN0SXRlbShpdGVtOiBUKTogdm9pZCB7XG4gICAgdGhpcy5jdXJyZW50ID0gdGhpcy5jdXJyZW50LmNvbmNhdChpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXNlbGVjdHMgYW4gaXRlbVxuICAgKi9cbiAgcHJpdmF0ZSBkZXNlbGVjdEl0ZW0oaW5kZXhPZkl0ZW06IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuY3VycmVudCA9IHRoaXMuY3VycmVudC5zbGljZSgwLCBpbmRleE9mSXRlbSkuY29uY2F0KHRoaXMuY3VycmVudC5zbGljZShpbmRleE9mSXRlbSArIDEpKTtcbiAgICBpZiAoaW5kZXhPZkl0ZW0gPCB0aGlzLmN1cnJlbnRTZWxlY3Rpb25SZWZzLmxlbmd0aCkge1xuICAgICAgLy8gS2VlcCBzZWxlY3RlZCByZWZzIGFycmF5IGluIHN5bmNcbiAgICAgIGNvbnN0IHJlbW92ZWRJdGVtcyA9IHRoaXMuY3VycmVudFNlbGVjdGlvblJlZnNbaW5kZXhPZkl0ZW1dO1xuICAgICAgLy8gbG9ja2VkIHJlZmVyZW5jZSBpcyBubyBsb25nZXIgbmVlZGVkIChpZiBhbnkpXG4gICAgICB0aGlzLmxvY2tlZFJlZnMgPSB0aGlzLmxvY2tlZFJlZnMuZmlsdGVyKGxvY2tlZCA9PiBsb2NrZWQgIT09IHJlbW92ZWRJdGVtc1swXSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1ha2Ugc3VyZSB0aGF0IGl0IGNvdWxkIGJlIGxvY2tlZFxuICAgKi9cbiAgcHJpdmF0ZSBjYW5JdEJlTG9ja2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb25UeXBlICE9PSBTZWxlY3Rpb25UeXBlLk5vbmU7XG4gIH1cblxuICBwcml2YXRlIGVtaXRDaGFuZ2UoKSB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvblR5cGUgPT09IFNlbGVjdGlvblR5cGUuU2luZ2xlKSB7XG4gICAgICB0aGlzLl9jaGFuZ2UubmV4dCh0aGlzLmN1cnJlbnRTaW5nbGUpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fc2VsZWN0aW9uVHlwZSA9PT0gU2VsZWN0aW9uVHlwZS5NdWx0aSkge1xuICAgICAgdGhpcy5fY2hhbmdlLm5leHQodGhpcy5jdXJyZW50KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUN1cnJlbnRTZWxlY3Rpb25SZWZzKCkge1xuICAgIHRoaXMuX2N1cnJlbnRTZWxlY3Rpb25SZWZzID0gdGhpcy5fY3VycmVudD8ubWFwKGl0ZW0gPT4gdGhpcy5faXRlbXMudHJhY2tCeShpdGVtKSkgfHwgW107XG4gIH1cbn1cbiJdfQ==