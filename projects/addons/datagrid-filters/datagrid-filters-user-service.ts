/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

/**
 * User service that provides users for the datagrid users filter.
 *
 * ```
 * @NgModule({
 *    ...
 *    providers: [
 *       { provide: DatagridFiltersUserService, useClass: CustomUserService },
 *    ]
 * })
 * export class AppModule {}
 * ```
 */
@Injectable()
export class DatagridFiltersUserService {
  getDomains(): Observable<string[]> {
    return of([]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchUsers(searchTerm: string, domain: string): Observable<string[]> {
    return of([]);
  }
}
