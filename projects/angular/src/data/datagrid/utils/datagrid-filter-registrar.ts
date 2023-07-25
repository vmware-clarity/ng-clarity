/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, OnDestroy } from '@angular/core';

import { ClrDatagridFilterInterface } from '../interfaces/filter.interface';
import { FiltersProvider, RegisteredFilter } from '../providers/filters';

@Directive()
export abstract class DatagridFilterRegistrar<T, F extends ClrDatagridFilterInterface<T>> implements OnDestroy {
  /**
   * @NOTEe Type `any` is set here to be able to pass templateStrictMode
   */
  registered: any;

  constructor(private filters: FiltersProvider<T>) {}

  get filter(): F {
    return this.registered && this.registered.filter;
  }

  ngOnDestroy(): void {
    this.deleteFilter();
  }

  setFilter(filter: F | RegisteredFilter<T, F>) {
    // If we previously had another filter, we unregister it
    this.deleteFilter();
    if (filter instanceof RegisteredFilter) {
      this.registered = filter;
    } else if (filter) {
      this.registered = this.filters.add(filter);
    }
  }

  deleteFilter() {
    if (this.registered) {
      this.registered.unregister();
      delete this.registered;
    }
  }
}
