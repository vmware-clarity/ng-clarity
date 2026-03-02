/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComboboxModel } from './combobox.model';

export class SingleSelectComboboxModel<T> extends ComboboxModel<T> {
  override model: T;

  containsItem(item: T): boolean {
    if (this.identityFn) {
      return this.model !== null && this.model !== undefined && this.identityFn(this.model) === this.identityFn(item);
    }
    return this.model === item;
  }

  select(item: T): void {
    this.model = item;
  }

  unselect(item: T): void {
    if (this.containsItem(item)) {
      this.model = null;
    }
  }

  isEmpty(): boolean {
    return !this.model;
  }

  pop(): T {
    const item = this.model;
    this.model = null;
    return item;
  }

  toString(displayField?: string): string {
    if (!this.model) {
      return '';
    }
    if (displayField && (this.model as any)[displayField]) {
      return (this.model as any)[displayField];
    } else {
      return this.model.toString();
    }
  }
}
