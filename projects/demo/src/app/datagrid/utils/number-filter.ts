/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridNumericFilterInterface } from '@clr/angular';

export class NumberFilter implements ClrDatagridNumericFilterInterface<any> {
  accepts(row: any, low: number, high: number): boolean {
    if (low !== null && row.number < low) {
      return false;
    }
    if (high !== null && row.number > high) {
      return false;
    }
    return true;
  }
}
