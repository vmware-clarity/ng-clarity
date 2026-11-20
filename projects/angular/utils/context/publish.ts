/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Stores `value` for `host` in `store`; the teardown removes it only while it is still this value.
 * Kept in a `WeakMap` rather than on the element, so nothing is readable from the DOM.
 */
export function publishFor<T>(store: WeakMap<Element, T>, host: Element, value: T): () => void {
  store.set(host, value);
  return () => {
    if (store.get(host) === value) {
      store.delete(host);
    }
  };
}
