/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ALL_COLUMN_CHANGES } from '../enums/column-changes.enum';
import { ColumnState, ColumnStateDiff } from '../interfaces/column-state.interface';

@Injectable()
export class ColumnsService {
  columns: BehaviorSubject<ColumnState>[] = [];
  columnsStateChange: BehaviorSubject<ColumnState> = new BehaviorSubject(null);

  private _cache: ColumnState[] = [];

  get columnStates(): ColumnState[] {
    return this.columns.map(column => column.value);
  }

  get hasHideableColumns(): boolean {
    return this.columnStates.filter(state => state.hideable).length > 0;
  }

  get visibleColumns(): ColumnState[] {
    return this.columnStates.filter(state => !state.hidden);
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
      this.columnsStateChange.next(cachedState);
    });
    this._cache = [];
  }

  // Helper method to emit a change to a column only when there is an actual diff to process for that column
  emitStateChangeAt(columnIndex: number, diff: ColumnStateDiff) {
    if (!this.columns[columnIndex]) {
      return;
    }
    this.emitStateChange(this.columns[columnIndex], diff);
  }

  emitStateChange(column: BehaviorSubject<ColumnState>, diff: ColumnStateDiff) {
    const changedState = { ...column.value, ...diff };
    column.next(changedState);
    this.columnsStateChange.next(changedState);
  }
}
