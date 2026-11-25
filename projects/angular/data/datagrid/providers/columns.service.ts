/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ALL_COLUMN_CHANGES } from '../enums/column-changes.enum';
import { ColumnState, ColumnStateDiff } from '../interfaces/column-state.interface';

@Injectable()
export class ColumnsService {
  /**
   * One subject per column, which the renderers of that column listen to. Changed through this service only, so
   * that `columnStates` follows.
   */
  columns: BehaviorSubject<ColumnState>[] = [];
  columnsStateChange = new BehaviorSubject<ColumnState | null>(null);

  private _cache: ColumnState[] = [];

  /** The state of every column, for the views that show it. */
  private readonly states = signal<ColumnState[]>([]);

  /**
   * Which column is where, and whether it is hidden and pinned. Unlike the states, it doesn't change when a column is
   * resized.
   */
  private readonly layout = computed(
    () =>
      this.states().map((state, index) => ({
        column: this.columns[index],
        hidden: !!state.hidden,
        pinned: !!state.pinned,
      })),
    {
      equal: (a, b) =>
        a.length === b.length &&
        a.every(
          (entry, i) => entry.column === b[i].column && entry.hidden === b[i].hidden && entry.pinned === b[i].pinned
        ),
    }
  );

  private readonly _hasHideableColumns = computed(() => this.states().some(state => state.hideable));

  get columnStates(): ColumnState[] {
    return this.states();
  }

  get hasHideableColumns(): boolean {
    return this._hasHideableColumns();
  }

  get visibleColumns(): ColumnState[] {
    return this.columnStates.filter(state => !state.hidden);
  }

  get hasPinnedColumns(): boolean {
    return this.layout().some(column => column.pinned);
  }

  /**
   * Tells whether the column at the given index is pinned (static). Columns and cells are
   * matched by their declaration index, so this is what the header, the rows and a column aligned
   * row detail use to decide which views belong in the static container.
   */
  isPinned(columnIndex: number): boolean {
    return !!this.layout()[columnIndex]?.pinned;
  }

  isHidden(columnIndex: number): boolean {
    return !!this.layout()[columnIndex]?.hidden;
  }

  /** The column at the given index, for the views that have to follow when the columns are reordered. */
  columnAt(columnIndex: number): BehaviorSubject<ColumnState> | undefined {
    return this.layout()[columnIndex]?.column;
  }

  setColumn(index: number, column: BehaviorSubject<ColumnState>) {
    this.columns[index] = column;
    this.publish();
  }

  /** Drops the columns from `length` on. */
  trim(length: number) {
    this.columns.splice(length);
    this.publish();
  }

  cache() {
    this._cache = this.columns.map(subject => {
      const value = { ...subject.value };
      delete value.changes;
      return value;
    });
  }

  hasCache() {
    return !!this._cache.length;
  }

  resetToLastCache() {
    this._cache.forEach((state, index) => {
      // Just emit the exact value from the cache
      const cachedState = { ...state, changes: ALL_COLUMN_CHANGES };
      this.columns[index].next(cachedState);
      this.publish();
      this.columnsStateChange.next(cachedState);
    });
    this._cache = [];
  }

  // Helper method to emit a change to a column only when there is an actual diff to process for that column
  emitStateChangeAt(columnIndex: number | undefined, diff: ColumnStateDiff) {
    if (columnIndex === undefined || !this.columns[columnIndex]) {
      return;
    }
    this.emitStateChange(this.columns[columnIndex], diff);
  }

  emitStateChange(column: BehaviorSubject<ColumnState>, diff: ColumnStateDiff) {
    const changedState = { ...column.value, ...diff };
    column.next(changedState);
    this.publish();
    this.columnsStateChange.next(changedState);
  }

  private publish() {
    this.states.set(this.columns.map(column => column.value));
  }
}
