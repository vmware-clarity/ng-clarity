/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridComparatorInterface } from '@clr/angular';

function compareNumericValues(itemA: any, itemB: any, fieldName: string): number {
  const firstValue = Number(itemA[fieldName]);
  const secondValue = Number(itemB[fieldName]);

  if (isNaN(firstValue) && isNaN(secondValue)) {
    return 0;
  }
  if (isNaN(firstValue)) {
    return -1;
  }
  if (isNaN(secondValue)) {
    return 1;
  }

  return firstValue - secondValue;
}

export class SimpleNumericComparator<T> implements ClrDatagridComparatorInterface<T> {
  constructor(private readonly fieldName: string) {}

  compare(first: T, second: T): number {
    return compareNumericValues(first, second, this.fieldName);
  }
}
