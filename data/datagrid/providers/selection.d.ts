import { IterableDiffers } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectionType } from '../enums/selection-type';
import { FiltersProvider } from './filters';
import { Items } from './items';
import * as i0 from "@angular/core";
export declare class Selection<T = any> {
    private _items;
    private differs;
    id: string;
    preserveSelection: boolean;
    /**
     * Last selection, for use in range selection.
     */
    rangeStart: T;
    /**
     * Shift key state, for use in range selection.
     */
    shiftPressed: boolean;
    /** @deprecated since 2.0, remove in 3.0 */
    rowSelectionMode: boolean;
    private lockedRefs;
    private _currentSelectionRefs;
    private valueCollector;
    private _selectionType;
    /**
     * The current selection
     */
    private _current;
    /**
     * The current selection in single selection type
     */
    private _currentSingle;
    /**
     * The Observable that lets other classes subscribe to selection changes
     */
    private _change;
    /**
     * Subscriptions to the other providers changes.
     */
    private subscriptions;
    /**
     * Differ to track changes of multi selection.
     */
    private _differ;
    private trackBy;
    constructor(_items: Items<T>, filters: FiltersProvider<T>, differs: IterableDiffers);
    get selectionType(): SelectionType;
    set selectionType(value: SelectionType);
    get current(): T[];
    set current(value: T[]);
    get currentSingle(): T;
    set currentSingle(value: T);
    get change(): Observable<T[] | T>;
    private get _selectable();
    private get currentSelectionRefs();
    private get currentSingleSelectionRef();
    checkForChanges(): void;
    clearSelection(): void;
    /**
     * Cleans up our subscriptions to other providers
     */
    destroy(): void;
    updateCurrent(value: T[], emit: boolean): void;
    /**
     * Checks if an item is currently selected
     */
    isSelected(item: T): boolean;
    /**
     * Selects or deselects an item
     */
    setSelected(item: T, selected: boolean): void;
    /**
     * Checks if all currently displayed items are selected
     */
    isAllSelected(): boolean;
    /**
     * Lock and unlock item
     */
    lockItem(item: T, lock: boolean): void;
    /**
     * Check is item locked or not by searching into lockedRefs for entry
     */
    isLocked(item: T): boolean;
    /**
     * Selects or deselects all currently displayed items
     */
    toggleAll(): void;
    /**
     * Selects an item
     */
    private selectItem;
    /**
     * Deselects an item
     */
    private deselectItem;
    /**
     * Make sure that it could be locked
     */
    private canItBeLocked;
    private emitChange;
    private updateCurrentSelectionRefs;
    static ɵfac: i0.ɵɵFactoryDeclaration<Selection<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Selection<any>>;
}
