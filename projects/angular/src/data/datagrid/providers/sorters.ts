/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

import { ClrDatagridComparatorInterface } from '../interfaces/comparator.interface';

@Injectable()
export class Sorters<T = any> {
  private _comparators: ClrDatagridComparatorInterface<T>[] = [];

  addComparator(value: ClrDatagridComparatorInterface<T>): number {
    this._comparators.push(value);

    return this._comparators.length - 1;
  }

  removeComparator(value: ClrDatagridComparatorInterface<T>) {
    const index = this._comparators.indexOf(value);
    if (index > -1) {
      // only splice array when item is found
      this._comparators.splice(index, 1);
    }
  }

  compare(a: T, b: T, index = 0): number {
    console.log('1');
    const result = this._comparators[index].compare(a, b);

    index = index++;
    if (result === 0 && this._comparators.length > index) {
      return this.compare(a, b, index);
    }

    return result;
  }
}
