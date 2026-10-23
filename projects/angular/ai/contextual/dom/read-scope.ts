/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { IdScope } from './shadow';

/** Per-walk cache of styles and labels; nothing outlives the walk, as jsdom styles go stale. */
interface ReadScope {
  styles: WeakMap<Element, CSSStyleDeclaration>;
  labels: WeakMap<IdScope, Map<Element, HTMLLabelElement>>;
}

let current: ReadScope | null = null;

export function withinReadScope<T>(read: () => T): T {
  if (current) {
    return read();
  }
  current = { styles: new WeakMap(), labels: new WeakMap() };
  try {
    return read();
  } finally {
    current = null;
  }
}

export function readScope(): ReadScope | null {
  return current;
}
