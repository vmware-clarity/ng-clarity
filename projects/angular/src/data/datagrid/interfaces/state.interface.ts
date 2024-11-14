/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridComparatorInterface } from './comparator.interface';

export interface ClrDatagridStateInterface<T = any> {
  page?: { from?: number; to?: number; size?: number; current?: number };
  sort?: { by: string | ClrDatagridComparatorInterface<T>; reverse: boolean };
  filters?: any[];
}
