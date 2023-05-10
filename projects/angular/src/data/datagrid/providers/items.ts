/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, TrackByFunction } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';

import { FiltersProvider } from './filters';
import { Page } from './page';
import { Sort } from './sort';

export type ClrDatagridItemsTrackByFunction<T> = (item: T) => any;

@Injectable()
export class Items<T = any> {
  /**
   * Indicates if the data is currently loading
   */
  loading = false;

  /**
   * New tracking function to identify objects. If provided, this will be used instead of `iteratorTrackBy`.
   */
  datagridTrackBy: ClrDatagridItemsTrackByFunction<T>;

  /**
   * Subscriptions to the other providers changes.
   */
  private _filtersSub: Subscription;
  private _sortSub: Subscription;
  private _pageSub: Subscription;

  /**
   * Whether we should use smart items for this datagrid or let the user handle
   * everything.
   */
  private _smart = false;

  /**
   * List of all items in the datagrid
   */
  private _all: T[];

  /**
   * Internal temporary step, which we preserve to avoid re-filtering or re-sorting if not necessary
   */
  private _filtered: T[];

  /**
   * List of items currently displayed
   */
  private _displayed: T[] = [];

  /**
   * The Observable that lets other classes subscribe to items changes
   */
  private _change = new Subject<T[]>();

  private _allChanges = new Subject<T[]>();

  constructor(private _filters: FiltersProvider<T>, private _sort: Sort<T>, private _page: Page) {}

  get smart(): boolean {
    return this._smart;
  }

  get all() {
    return this._all;
  }
  set all(items: T[]) {
    this._all = items;
    this.emitAllChanges(items);
    if (this.smart) {
      this._filterItems();
    } else {
      this._displayed = items;
      this.emitChange();
    }
  }

  get displayed(): T[] {
    // Ideally we could return an immutable array, but we don't have it in Clarity yet.
    return this._displayed;
  }

  // We do not want to expose the Subject itself, but the Observable which is read-only
  get change(): Observable<T[]> {
    return this._change.asObservable();
  }

  get allChanges(): Observable<T[]> {
    return this._allChanges.asObservable();
  }

  /**
   * Checks if we don't have data to process yet, to abort early operations
   */
  private get uninitialized() {
    return !this._all;
  }

  /**
   * Tracking function to identify objects. Default is reference equality.
   *
   * @deprecated in v15 and scheduled for removal in v17 (CDE-71)
   */
  iteratorTrackBy: TrackByFunction<T> = (_index, item) => item;

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
      } else {
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

  canTrackBy(): boolean {
    // all items are needed unless `datagridTrackBy` is set because `iteratorTrackBy` requires the item's index
    return !!this.datagridTrackBy || Array.isArray(this.all);
  }

  trackBy(item: T, index?: number) {
    if (this.datagridTrackBy) {
      return this.datagridTrackBy(item);
    } else if (Array.isArray(this.all)) {
      index = index ?? this.all.indexOf(item);
      return this.iteratorTrackBy(index, item);
    } else {
      throw new Error('improper call to Items#trackBy');
    }
  }

  private emitChange() {
    this._change.next(this.displayed);
  }

  private emitAllChanges(items: T[]): void {
    this._allChanges.next(items);
  }

  /**
   * FiltersProvider items from the raw list
   */
  private _filterItems() {
    if (this.uninitialized) {
      return;
    }
    if (this._filters.hasActiveFilters()) {
      this._filtered = this._all.filter(item => this._filters.accepts(item));
    } else {
      // Work on a shallow copy of the array, to not modify the user's model
      this._filtered = this._all.slice();
    }
    this._page.totalItems = this._filtered.length;
    this._sortItems();
  }

  /**
   * Sorts items in the filtered list
   */
  private _sortItems() {
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
  private _changePage() {
    // If we know we have pagination but the page size hasn't been set yet, we wait for it.
    if (this.uninitialized || (this._page.activated && this._page.size === 0)) {
      return;
    }
    if (this._page.size > 0) {
      this._displayed = this._filtered.slice(this._page.firstItem, this._page.lastItem + 1);
    } else {
      this._displayed = this._filtered;
    }
    this.emitChange();
  }
}
