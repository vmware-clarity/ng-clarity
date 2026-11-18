/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable } from 'rxjs';

/**
 * Fetches the children of `item`: an array, or a Promise or an Observable of one. Called when a row
 * is expanded for the first time, and again after `ClrDatagrid.reloadTreeChildren()`. Only the first
 * value of an Observable is used; one that ends without a value fails like a request that fails.
 * The datagrid waits for the results outside the Angular zone and applies those of the same frame
 * together, so many rows expanded at once don't run change detection once per result.
 */
export type ClrDatagridTreeChildrenFunction<T> = (
  item: T
) => T[] | null | undefined | PromiseLike<T[] | null | undefined> | Observable<T[] | null | undefined>;
