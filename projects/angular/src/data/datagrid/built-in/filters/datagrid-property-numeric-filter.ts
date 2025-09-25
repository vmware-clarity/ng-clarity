/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridNumericFilterInterface } from '../../interfaces/numeric-filter.interface';
import { NestedProperty } from '../nested-property';

export class DatagridPropertyNumericFilter<T = any> implements ClrDatagridNumericFilterInterface<T> {
  private nestedProp: NestedProperty<T>;

  constructor(
    public prop: string,
    public exact = false
  ) {
    this.nestedProp = new NestedProperty(prop);
  }

  accepts(item: T, low: number, high: number): boolean {
    const propValue = this.nestedProp.getPropValue(item);
    if (propValue === undefined) {
      return false;
    }
    if (low !== null && (typeof propValue !== 'number' || propValue < low)) {
      return false;
    }
    if (high !== null && (typeof propValue !== 'number' || propValue > high)) {
      return false;
    }
    return true;
  }
}
