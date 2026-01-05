/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridComparatorInterface } from '@clr/angular';

// Handle sorting on 'null | undefined | ""' value on the property
export class FieldComparator<T> implements ClrDatagridComparatorInterface<T> {
  field: string;

  constructor(compareField: string) {
    this.field = compareField;
  }

  compare(a: any, b: any): number {
    if (!a[this.field] && !b[this.field]) {
      return 0;
    } else if (!a[this.field] && b[this.field]) {
      return 1;
    } else if (a[this.field] && !b[this.field]) {
      return -1;
    } else {
      if (a[this.field] > b[this.field]) {
        return 1;
      } else if (a[this.field] < b[this.field]) {
        return -1;
      } else {
        return 0;
      }
    }
  }
}

// Handle sorting on field that is a list
export class ListComparator<T> implements ClrDatagridComparatorInterface<T> {
  field: string;

  constructor(compareField: string) {
    this.field = compareField;
  }

  compare(a: any, b: any): number {
    if (!a[this.field] && !b[this.field]) {
      return 0;
    } else if (!a[this.field] && b[this.field]) {
      return 1;
    } else if (a[this.field] && !b[this.field]) {
      return -1;
    } else {
      return a[this.field].length > b[this.field].length ? -1 : 1;
    }
  }
}
