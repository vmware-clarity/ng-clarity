/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { signal } from '@angular/core';

export type ClrComboboxIdentityFunction<T> = (item: T) => any;

export type ClrComboboxResolverFunction<T> = (input: string) => T;

export abstract class ComboboxModel<T, M = T | T[] | null | undefined> {
  displayField?: string;
  // Every write notifies, because the multi-select model changes its array in place.
  private readonly value = signal<M>(undefined, { equal: () => false });

  get model(): M {
    return this.value();
  }
  set model(model: M) {
    this.value.set(model);
  }

  identityFn: ClrComboboxIdentityFunction<T> = (item: T) => item;

  abstract containsItem(item: T): boolean;
  abstract select(item: T): void;
  abstract unselect(item: T): void;
  abstract toString(displayField?: string, index?: number): string;
  abstract isEmpty(): boolean;
  abstract pop(): T | null | undefined; // pops the last item
}
