/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, IterableDiffer, IterableDiffers, TrackByFunction } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, delay } from 'rxjs/operators';

import { SelectionType } from '../enums/selection-type';
import { FiltersProvider } from './filters';
import { ClrDatagridItemsTrackByFunction, Items } from './items';

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

  /** @deprecated since 2.0, remove in 3.0 */
  rowSelectionMode = false;

  private lockedRefs: T[] = []; // Ref of locked items
  private _currentSelectionRefs: T[] = [];
  private valueCollector = new Subject<T[]>();
  private _selectionType: SelectionType = SelectionType.None;

  /**
   * The current selection
   */
  private _current: T[];

  /**
   * The current selection in single selection type
   */
  private _currentSingle: T;

  /**
   * The Observable that lets other classes subscribe to selection changes
   */
  private _change = new Subject<T[] | T>();

  /**
   * Subscriptions to the other providers changes.
   */
  private subscriptions: Subscription[] = [];

  /**
   * Differ to track changes of multi selection.
   */
  private _differ!: IterableDiffer<T>;
  private trackBy: ClrDatagridItemsTrackByFunction<T>;

  constructor(private _items: Items<T>, filters: FiltersProvider<T>, private differs: IterableDiffers) {
    this.id = 'clr-dg-selection' + nbSelection++;
    this.trackBy = _items.trackBy;
    this._differ = differs.find(this._current || []).create<T>(this.trackBy as TrackByFunction<T>);

    this.subscriptions.push(
      filters.change.subscribe(() => {
        if (!this._selectable || this.preserveSelection) {
          return;
        }
        this.clearSelection();
      })
    );

    this.subscriptions.push(
      _items.allChanges.pipe(delay(0)).subscribe(updatedItems => {
        // Reset the lockedRefs;
        const updateLockedRef: T[] = [];

        switch (this.selectionType) {
          case SelectionType.None: {
            break;
          }

          case SelectionType.Single: {
            let newSingle: any;
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
            let leftOver: any[] = this.current.slice();
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
      })
    );

    this.subscriptions.push(this.valueCollector.pipe(debounceTime(0)).subscribe(() => this.emitChange()));
  }

  get selectionType(): SelectionType {
    return this._selectionType;
  }
  set selectionType(value: SelectionType) {
    if (value === this.selectionType) {
      return;
    }
    this._selectionType = value;
    if ([SelectionType.None, SelectionType.Single].includes(value)) {
      delete this.current;
    } else {
      this.updateCurrent([], false);
    }
  }

  get current(): T[] {
    return this._current;
  }
  set current(value: T[]) {
    this.updateCurrent(value, true);
    this.updateCurrentSelectionRefs();
  }

  get currentSingle(): T {
    return this._currentSingle;
  }
  set currentSingle(value: T) {
    if (value === this._currentSingle) {
      return;
    }
    this._currentSingle = value;
    this.emitChange();
  }

  // We do not want to expose the Subject itself, but the Observable which is read-only
  get change(): Observable<T[] | T> {
    return this._change.asObservable();
  }

  private get _selectable(): boolean {
    return this._selectionType === SelectionType.Multi || this._selectionType === SelectionType.Single;
  }

  // Refs of currently selected items
  private get currentSelectionRefs(): T[] {
    return this._currentSelectionRefs;
  }

  // Ref of currently selected item
  private get currentSingleSelectionRef(): T {
    return this._currentSingle && this._items.trackBy(this._currentSingle);
  }

  checkForChanges(): void {
    const changes = this._differ.diff(this._current);
    // @TODO move the trackBy from items to selection as it's used only here and is not needed in items
    if (this.trackBy !== this._items.trackBy) {
      this.trackBy = this._items.trackBy;
    }
    if (changes) {
      this.updateCurrentSelectionRefs();
    }
  }

  clearSelection(): void {
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

  updateCurrent(value: T[], emit: boolean) {
    this._current = value;
    if (emit) {
      this.valueCollector.next(value);
    }
  }

  /**
   * Checks if an item is currently selected
   */
  isSelected(item: T): boolean {
    const ref = this._items.trackBy(item);
    if (this._selectionType === SelectionType.Single) {
      return this.currentSingleSelectionRef === ref;
    } else if (this._selectionType === SelectionType.Multi) {
      return this.currentSelectionRefs.indexOf(ref) >= 0;
    }
    return false;
  }

  /**
   * Selects or deselects an item
   */
  setSelected(item: T, selected: boolean) {
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
    if (this._selectionType !== SelectionType.Multi || !this._items.displayed) {
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
    const temp: T[] = displayedItems.filter(item => {
      const ref = this._items.trackBy(item);
      return this.currentSelectionRefs.indexOf(ref) > -1;
    });
    return temp.length === displayedItems.length;
  }

  /**
   * Lock and unlock item
   */
  lockItem(item: T, lock: boolean) {
    if (this.canItBeLocked()) {
      const ref = this._items.trackBy(item);
      if (lock === true) {
        // Add to lockedRef
        this.lockedRefs.push(ref);
      } else {
        // Remove from lockedRef
        this.lockedRefs = this.lockedRefs.filter(lockedItem => ref !== lockedItem);
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
    this.current = this.current.filter((_, index) => index !== indexOfItem);
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
  private canItBeLocked(): boolean {
    return this._selectionType !== SelectionType.None;
  }

  private emitChange() {
    if (this._selectionType === SelectionType.Single) {
      this._change.next(this.currentSingle);
    } else if (this._selectionType === SelectionType.Multi) {
      this._change.next(this.current);
    }
  }

  private updateCurrentSelectionRefs() {
    this._currentSelectionRefs = this._current?.map(item => this._items.trackBy(item)) || [];
  }
}
