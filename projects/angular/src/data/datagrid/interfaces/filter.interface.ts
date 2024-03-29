/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
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
