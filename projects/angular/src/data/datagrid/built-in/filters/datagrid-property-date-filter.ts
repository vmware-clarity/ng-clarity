/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridDateFilterInterface } from '../../interfaces/date-filter.interface';
import { NestedProperty } from '../nested-property';

export class DatagridPropertyDateFilter<T = any> implements ClrDatagridDateFilterInterface<T> {
  private nestedProp: NestedProperty<T>;

  constructor(public prop: string, public exact = false) {
    this.nestedProp = new NestedProperty(prop);
  }

  accepts(item: T, from: Date, to: Date): boolean {
    const propValue = this.nestedProp.getPropValue(item);
    if (from !== null && propValue < from) {
      return false;
    }
    if (to !== null && propValue > to) {
      return false;
    }
    return true;
  }
}
