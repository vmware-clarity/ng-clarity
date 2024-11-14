/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable } from 'rxjs';

export interface ClrDatagridFilterInterface<T, S = any> {
  readonly state?: S;

  changes: Observable<any>;

  isActive(): boolean;

  accepts(item: T): boolean;

  equals?(other: ClrDatagridFilterInterface<T, any>): boolean;
}
