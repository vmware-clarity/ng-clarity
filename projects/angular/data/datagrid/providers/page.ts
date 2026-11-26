/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { StateDebouncer } from './state-debouncer.provider';

@Injectable()
export class Page {
  activated = false;

  /*
   * The page is held in signals, so that every view showing it is refreshed when it changes, also when the
   * application changes it from outside the datagrid.
   */

  /**
   * Page size, a value of 0 means no pagination
   */
  private readonly _size = signal(0);

  /**
   * Total items (needed to guess the last page)
   */
  private readonly _totalItems = signal<number | undefined>(undefined);

  /**
   * Last page
   */
  private readonly _last = signal<number | undefined>(undefined);

  /**
   * Current page
   */
  private readonly _current = signal(1);

  /**
   * The Observable that lets other classes subscribe to page changes
   */
  private _change = new Subject<number>();

  private preventEmit = false;
  private _sizeChange = new Subject<number>();

  constructor(private stateDebouncer: StateDebouncer) {}

  get size(): number {
    return this._size();
  }
  set size(size: number) {
    const oldSize = this._size();
    if (size !== oldSize) {
      if (!this.preventEmit) {
        this.stateDebouncer.changeStart();
      }
      this._size.set(size);
      if (size === 0) {
        this._current.set(1);
      } else {
        // Yeap. That's the formula to keep the first item from the old page still
        // displayed in the new one.
        this._current.update(current => Math.floor((oldSize / size) * (current - 1)) + 1);
      }
      // We always emit an event even if the current page index didn't change, because
      // the size changing means the items inside the page are different
      if (!this.preventEmit) {
        this._change.next(this._current());
        this._sizeChange.next(size);
        this.stateDebouncer.changeDone();
      }
    }
    this.preventEmit = false;
  }

  get totalItems(): number {
    return this._totalItems() || 0; // remains 0 if not set to avoid breaking change
  }
  set totalItems(total: number) {
    this._totalItems.set(total);
    // If we have less items than before, we might need to change the current page
    if (this.current > this.last) {
      this.current = this.last;
    }
  }

  get last(): number {
    const last = this._last();
    if (last) {
      return last;
    }
    // If the last page isn't known, we compute it from the last item's index
    if (this.size > 0 && this.totalItems) {
      return Math.ceil(this.totalItems / this.size);
    }
    return 1;
  }
  set last(page: number) {
    this._last.set(page);
  }

  // We do not want to expose the Subject itself, but the Observable which is read-only
  get change(): Observable<number> {
    return this._change.asObservable();
  }

  get sizeChange(): Observable<number> {
    return this._sizeChange.asObservable();
  }

  get current(): number {
    return this._current();
  }
  set current(page: number) {
    if (page !== this._current()) {
      this.stateDebouncer.changeStart();
      this._current.set(page);
      this._change.next(page);
      this.stateDebouncer.changeDone();
    }
  }

  /**
   * Index of the first item displayed on the current page, starting at 0, -1 if none displayed
   */
  get firstItem(): number {
    if (this._totalItems() === 0) {
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
  get lastItem(): number {
    if (this._totalItems() === 0) {
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
  resetPageSize(preventEmit = false): void {
    this.preventEmit = preventEmit;
    this.size = 0;
  }
}
