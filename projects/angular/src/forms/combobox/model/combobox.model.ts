/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export abstract class ComboboxModel<T> {
  model: T | T[];
  displayField: string;
  abstract containsItem(item: T): boolean;
  abstract select(item: T): void;
  abstract unselect(item: T): void;
  abstract toString(displayField?: string, index?: number): string;
  abstract isEmpty(): boolean;
  abstract pop(): T; // pops the last item
}
