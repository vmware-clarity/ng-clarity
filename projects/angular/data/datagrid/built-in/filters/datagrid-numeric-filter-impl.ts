/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable, Subject } from 'rxjs';

import { DatagridPropertyNumericFilter } from './datagrid-property-numeric-filter';
import { ClrDatagridFilterInterface } from '../../interfaces/filter.interface';
import { ClrDatagridNumericFilterInterface } from '../../interfaces/numeric-filter.interface';

export class DatagridNumericFilterImpl<T = any> implements ClrDatagridFilterInterface<T> {
  /**
   * The Observable required as part of the Filter interface
   */
  private _changes = new Subject<[number | null, number | null]>();

  /**
   * Internal values and accessor
   */
  private _low: number | null = null;
  private _high: number | null = null;

  constructor(public filterFn: ClrDatagridNumericFilterInterface<T>) {}

  // We do not want to expose the Subject itself, but the Observable which is read-only
  get changes(): Observable<[number | null, number | null]> {
    return this._changes.asObservable();
  }

  get value(): [number | null, number | null] {
    return [this._low, this._high];
  }
  set value(vals: [number | null, number | null]) {
    const low = vals[0];
    const high = vals[1];
    if (low !== this._low || high !== this._high) {
      this._low = low;
      this._high = high;
      this._changes.next([this._low, this._high]);
    }
  }

  get low() {
    return this._low;
  }
  set low(low: number | null) {
    if (low !== this._low) {
      this._low = low;
      this._changes.next([this._low, this._high]);
    }
  }

  get high() {
    return this._high;
  }
  set high(high: number | null) {
    if (high !== this._high) {
      this._high = high;
      this._changes.next([this._low, this._high]);
    }
  }

  get state(): { property: string; low: number | null; high: number | null } | this {
    if (this.filterFn instanceof DatagridPropertyNumericFilter) {
      return {
        property: this.filterFn.prop,
        low: this._low,
        high: this._high,
      };
    }
    return this;
  }

  /**
   * Indicates if the filter is currently active, (at least one input is set)
   */
  isActive(): boolean {
    return this._low !== null || this.high !== null;
  }

  /**
   * Tests if an item matches a search text
   */
  accepts(item: T): boolean {
    // We have a filter function in case someone wants to implement a numeric
    // filter that always passes nulls or similar
    return this.filterFn.accepts(item, this._low, this._high);
  }

  equals(other: ClrDatagridFilterInterface<T, any>): boolean {
    if (other instanceof DatagridNumericFilterImpl) {
      if (other.filterFn instanceof DatagridPropertyNumericFilter) {
        return (
          this.filterFn instanceof DatagridPropertyNumericFilter &&
          other.filterFn.prop === this.filterFn.prop &&
          other.low === this._low &&
          other.high === this._high
        );
      }
      return other === this;
    }
    return false;
  }
}
