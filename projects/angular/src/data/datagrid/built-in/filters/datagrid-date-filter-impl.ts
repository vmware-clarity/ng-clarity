/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable, Subject } from 'rxjs';

import { ClrDatagridDateFilterInterface } from '../../interfaces/date-filter.interface';
import { ClrDatagridFilterInterface } from '../../interfaces/filter.interface';
import { DatagridPropertyDateFilter } from './datagrid-property-date-filter';

export class DatagridDateFilterImpl<T = any> implements ClrDatagridFilterInterface<T> {
  constructor(public filterFn: ClrDatagridDateFilterInterface<T>) {}

  /**
   * The Observable required as part of the Filter interface
   */
  private _changes = new Subject<[Date, Date]>();
  // We do not want to expose the Subject itself, but the Observable which is read-only
  public get changes(): Observable<[Date, Date]> {
    return this._changes.asObservable();
  }

  /**
   * Internal values and accessor
   */
  private _from: Date | null = null;
  private _to: Date | null = null;

  /**
   * Common setters for the input values, including individual limits and
   * both at the same time.  Value is singular to make the interface similar
   * to the built-in string filter.
   */

  public get value(): [Date, Date] {
    return [this._from, this._to];
  }

  public set value(vals: [Date, Date]) {
    const from = vals[0];
    const to = vals[1];
    if (from !== this._from || to !== this._to) {
      this._from = from;
      this._to = to;
      this._changes.next([this._from, this._to]);
    }
  }

  public get from() {
    return this._from;
  }
  public set from(from: Date) {
    if (from !== this._from) {
      this._from = from;
      this._changes.next([this._from, this._to]);
    }
  }

  public get to() {
    return this._to;
  }
  public set to(to: Date) {
    if (to !== this._to) {
      this._to = to;
      this._changes.next([this._from, this._to]);
    }
  }

  /**
   * Indicates if the filter is currently active, (at least one input is set)
   */
  public isActive(): boolean {
    return this._from !== null || this._to !== null;
  }

  accepts(item: T): boolean {
    return this.filterFn.accepts(item, this._from, this._to);
  }

  public clear(): void {
    this._from = null;
    this._to = null;
  }

  public get state() {
    if (this.filterFn instanceof DatagridPropertyDateFilter) {
      return {
        property: this.filterFn.prop,
        from: this._from,
        to: this._to,
      };
    }
    return this;
  }

  public equals(other: ClrDatagridFilterInterface<T, any>): boolean {
    if (other instanceof DatagridDateFilterImpl) {
      if (other.filterFn instanceof DatagridPropertyDateFilter) {
        return (
          this.filterFn instanceof DatagridPropertyDateFilter &&
          other.filterFn.prop === this.filterFn.prop &&
          other.from === this._from &&
          other.to === this._to
        );
      }
      return other === this;
    }
    return false;
  }
}
