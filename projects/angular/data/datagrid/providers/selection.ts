/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, IterableDiffer, IterableDiffers, signal, TrackByFunction } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, delay } from 'rxjs/operators';

import { FiltersProvider } from './filters';
import { ClrDatagridItemsIdentityFunction, Items } from './items';
import { SelectionType } from '../enums/selection-type';

let nbSelection = 0;

@Injectable()
export class Selection<T = any> {
  id: string;
  preserveSelection = false;

  /**
   * Last selection, for use in range selection.
   */
  rangeStart: T;

  /**
   * Shift key state, for use in range selection.
   */
  shiftPressed = false;

  /*
   * The state that the datagrid renders is held in signals, so that every view showing it is refreshed when it
   * changes, also from outside the datagrid, e.g. through `[clrDgSelected]` or `clrDgSelected.push()`.
   */

  /**
   * The current selection. The application can change the array in place, so setting the same array again
   * counts as a change.
   */
  private readonly _current = signal<T[]>([], { equal: () => false });

  /** Identities of the selected items, in the order of the selection. */
  private readonly selectedRefs = signal<unknown[]>([]);

  /** Identities of the items that can't be selected or deselected. */
  private readonly lockedRefs = signal<unknown[]>([]);

  private readonly _selectionType = signal(SelectionType.None);
  private readonly _rowSelectionMode = signal(false);
  private valueCollector = new Subject<T[]>();

  /**
   * The Observable that lets other classes subscribe to selection changes
   */
  private _change = new Subject<T[]>();

  /**
   * Subscriptions to the other providers changes.
   */
  private subscriptions: Subscription[] = [];

  /**
   * Differ to track changes of multi selection.
   */
  private _differ!: IterableDiffer<T>;
  private identifyBy: ClrDatagridItemsIdentityFunction<T>;

  constructor(
    private _items: Items<T>,
    filters: FiltersProvider<T>,
    differs: IterableDiffers
  ) {
    this.id = 'clr-dg-selection' + nbSelection++;
    this.identifyBy = _items.identifyBy;
    this._differ = differs.find(this._current()).create<T>(this.identifyBy as TrackByFunction<T>);

    this.subscriptions.push(
      filters.change.subscribe(() => {
        if (!this.selectable || this.preserveSelection) {
          return;
        }
        this.clearSelection();
      })
    );

    this.subscriptions.push(
      _items.allChanges.pipe(delay(0)).subscribe(updatedItems => {
        // Reset the lockedRefs;
        const updateLockedRef: unknown[] = [];

        switch (this.selectionType) {
          case SelectionType.None: {
            break;
          }

          case SelectionType.Single: {
            let newSingle: any;
            let selectionUpdated = false;

            updatedItems.forEach(item => {
              if (item === null || item === undefined) {
                // Virtual scroll may emit a dense array of undefined slot placeholders. Those must
                // never match the empty single-selection ref (see virtual-scroll + Single).
                return;
              }
              const ref = _items.identifyBy(item);
              // If one of the updated items is the previously selectedSingle, set it as the new one
              if (this.selectedRefs()[0] === ref) {
                newSingle = item;
                selectionUpdated = true;
              }
              if (this.lockedRefs().includes(ref)) {
                updateLockedRef.push(ref);
              }
            });

            if (selectionUpdated) {
              this.current = [newSingle];
            }
            break;
          }

          case SelectionType.Multi: {
            let leftOver: any[] = this.current.slice();
            let selectionUpdated = false;

            // Duplicate loop, when the issue is issue#2342 is revisited keep in mind that
            // we need to go over every updated item and check to see if there are valid to be
            // locked or not and update it. When only add items that are found in the lockedRefs back.
            //
            // The both loops below that goes over updatedItems could be combined into one.
            updatedItems.forEach(item => {
              if (item === null || item === undefined) {
                return;
              }
              const ref = _items.identifyBy(item);
              if (this.lockedRefs().includes(ref)) {
                updateLockedRef.push(ref);
              }
            });

            // TODO: revisit this when we work on https://github.com/vmware/clarity/issues/2342
            // currently, the selection is cleared when filter is applied, so the logic inside
            // the if statement below results in broken behavior.
            if (leftOver.length > 0) {
              updatedItems.forEach(item => {
                if (item === null || item === undefined) {
                  return;
                }
                const ref = _items.identifyBy(item);
                // Look in current selected refs array if item is selected, and update actual value
                const selectedIndex = this.selectedRefs().indexOf(ref);
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
        this.lockedRefs.set(updateLockedRef);
      })
    );

    this.subscriptions.push(this.valueCollector.pipe(debounceTime(0)).subscribe(() => this.emitChange()));
  }

  get selectionType(): SelectionType {
    return this._selectionType();
  }
  set selectionType(value: SelectionType) {
    this._selectionType.set(value ?? SelectionType.None);
  }

  /** @deprecated since 2.0, remove in 3.0 */
  get rowSelectionMode(): boolean {
    return this._rowSelectionMode();
  }
  set rowSelectionMode(value: boolean) {
    this._rowSelectionMode.set(value);
  }

  get current(): T[] {
    return this._current();
  }
  set current(value: T[]) {
    this.updateCurrent(value, true);
    this.updateCurrentSelectionRefs();
  }

  get currentSingle(): T {
    const current = this._current();
    return current.length ? current[0] : undefined;
  }

  // We do not want to expose the Subject itself, but the Observable which is read-only
  get change(): Observable<T[]> {
    return this._change.asObservable();
  }

  get selectable(): boolean {
    return this._selectionType() !== SelectionType.None;
  }

  /**
   * Picks up the changes the application made to the selection array in place, e.g. `clrDgSelected.push(item)`.
   */
  checkForChanges(): void {
    const current = this._current();
    const changes = this._differ.diff(current);
    // @TODO move the identifyBy from items to selection as it's used only here and is not needed in items
    if (this.identifyBy !== this._items.identifyBy) {
      this.identifyBy = this._items.identifyBy;
    }
    if (changes) {
      this.updateCurrentSelectionRefs();
      // The array is the same, so it is set again to tell the views that show it.
      this._current.set(current);
    }
  }

  clearSelection(): void {
    this._current.set([]);
    this.selectedRefs.set([]);
    this.emitChange();
  }

  /**
   * Cleans up our subscriptions to other providers
   */
  destroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  updateCurrent(value: T[], emit: boolean) {
    this._current.set(value);
    if (emit) {
      this.valueCollector.next(value);
    }
  }

  /**
   * Checks if an item is currently selected
   */
  isSelected(item: T): boolean {
    const refIndex = this.selectedRefs().indexOf(this._items.identifyBy(item));
    const selectionType = this._selectionType();
    if (selectionType === SelectionType.Single) {
      return refIndex === 0;
    } else if (selectionType === SelectionType.Multi) {
      return refIndex >= 0;
    }

    return false;
  }

  /**
   * Selects or deselects an item
   */
  setSelected(item: T, selected: boolean) {
    const ref = this._items.identifyBy(item);
    const index = this.selectedRefs().indexOf(ref);

    switch (this._selectionType()) {
      case SelectionType.None:
        break;
      case SelectionType.Single:
        if (selected) {
          this.current = [item];
        }
        // in single selection, set currentSingle method should be used
        break;
      case SelectionType.Multi:
        if (index >= 0 && !selected) {
          this.deselectItem(index);
        } else if (index < 0 && selected) {
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
  isAllSelected(): boolean {
    if (this._selectionType() !== SelectionType.Multi || !this._items.displayed) {
      return false;
    }
    // make sure to exclude the locked items from the list when counting
    const displayedItems: T[] = this._items.displayed.filter(item => {
      return this.isLocked(item) === false;
    });

    const nbDisplayed = displayedItems.length;
    if (nbDisplayed < 1) {
      return false;
    }
    const selectedRefs = this.selectedRefs();
    const temp: T[] = displayedItems.filter(item => selectedRefs.includes(this._items.identifyBy(item)));
    return temp.length === displayedItems.length;
  }

  /**
   * Lock and unlock item
   */
  lockItem(item: T, lock: boolean) {
    if (this.canItBeLocked()) {
      const ref = this._items.identifyBy(item);
      if (lock === true) {
        // Add to lockedRef
        this.lockedRefs.update(lockedRefs => [...lockedRefs, ref]);
      } else {
        // Remove from lockedRef
        this.lockedRefs.update(lockedRefs => lockedRefs.filter(lockedItem => ref !== lockedItem));
      }
    }
  }

  /**
   * Check is item locked or not by searching into lockedRefs for entry
   */
  isLocked(item: T): boolean {
    /**
     * The check for selectionType will boost the performance by NOT searching
     * into the array when there is no need for that.
     */
    if (this.canItBeLocked()) {
      const ref = this._items.identifyBy(item);
      return this.lockedRefs().includes(ref);
    }

    return false;
  }

  /**
   * Selects or deselects all currently displayed items
   */
  toggleAll() {
    if (this._selectionType() !== SelectionType.Multi) {
      return;
    }
    /**
     * If every currently displayed item is already selected, we clear them.
     * If at least one item isn't selected, we select every currently displayed item.
     */
    if (this.isAllSelected()) {
      this._items.displayed.forEach(item => {
        const ref = this._items.identifyBy(item);
        const currentIndex = this.selectedRefs().indexOf(ref);
        if (currentIndex > -1 && this.isLocked(item) === false) {
          this.deselectItem(currentIndex);
        }
      });
    } else {
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
  private selectItem(item: T): void {
    this.current = this.current.concat(item);
  }

  /**
   * Deselects an item
   */
  private deselectItem(indexOfItem: number): void {
    this.current = this.current.slice(0, indexOfItem).concat(this.current.slice(indexOfItem + 1));
    if (indexOfItem < this.selectedRefs().length) {
      // Keep selected refs array in sync
      const removedItems = this.selectedRefs()[indexOfItem] as ArrayLike<T>;
      // locked reference is no longer needed (if any)
      this.lockedRefs.update(lockedRefs => lockedRefs.filter(locked => locked !== removedItems[0]));
    }
  }

  /**
   * Make sure that it could be locked
   */
  private canItBeLocked(): boolean {
    return this._selectionType() !== SelectionType.None;
  }

  private emitChange() {
    this._change.next(this.current);
  }

  private updateCurrentSelectionRefs() {
    this.selectedRefs.set(this._current().map(item => this._items.identifyBy(item)));
  }
}
