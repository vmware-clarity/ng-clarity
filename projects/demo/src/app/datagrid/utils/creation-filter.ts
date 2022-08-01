/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridDateFilterInterface } from '@clr/angular';

export class CreationFilter implements ClrDatagridDateFilterInterface<any> {
  accepts(row: any, from: Date, to: Date): boolean {
    if (from !== null && row.creation < from) {
      return false;
    }
    if (to !== null && row.creation > to) {
      return false;
    }
    return true;
  }
}
