/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable, Subject } from 'rxjs';

import { ClrDatagridFilterInterface } from '../../interfaces/filter.interface';
import { ClrDatagridStringFilterInterface } from '../../interfaces/string-filter.interface';
import { DatagridPropertyStringFilter } from './datagrid-property-string-filter';

export class DatagridStringFilterImpl<T = any> implements ClrDatagridFilterInterface<T> {
  /**
   * The Observable required as part of the Filter interface
   */
  private _changes = new Subject<string>();

  /**
   * Input value converted to lowercase
   */
  private _lowerCaseValue = '';

  /**
   * Raw input value
   */
  private _rawValue = '';

  constructor(public filterFn: ClrDatagridStringFilterInterface<T>) {}

  // We do not want to expose the Subject itself, but the Observable which is read-only
  get changes(): Observable<string> {
    return this._changes.asObservable();
  }

  get lowerCaseValue() {
    return this._lowerCaseValue;
  }

  get state() {
    if (this.filterFn instanceof DatagridPropertyStringFilter) {
      return {
        property: this.filterFn.prop,
        value: this.value,
      };
    }
    return this;
  }

  get value(): string {
    return this._rawValue;
  }
  /**
   * Common setter for the input value
   */
  set value(value: string) {
    if (!value) {
      value = '';
    }
    if (value !== this._rawValue) {
      this._rawValue = value;
      this._lowerCaseValue = value.toLowerCase().trim();
      this._changes.next(value);
    }
  }

  /**
   * Indicates if the filter is currently active, meaning the input is not empty
   */
  isActive(): boolean {
    return !!this.value;
  }

  /**
   * Tests if an item matches a search text
   */
  accepts(item: T): boolean {
    // We always test with the lowercase value of the input, to stay case insensitive
    return this.filterFn.accepts(item, this.lowerCaseValue);
  }

  equals(other: ClrDatagridFilterInterface<T, any>): boolean {
    if (other instanceof DatagridStringFilterImpl) {
      if (other.filterFn instanceof DatagridPropertyStringFilter) {
        return (
          this.filterFn instanceof DatagridPropertyStringFilter &&
          other.filterFn.prop === this.filterFn.prop &&
          other.value === this.value
        );
      }
      return other === this;
    }
    return false;
  }
}
