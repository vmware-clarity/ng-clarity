/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Assigns `value` to `host[property]` and returns a teardown that removes it only while
 * it is still the value assigned here, so a component that republishes (for example
 * after its host is re-created) can let a stale teardown run without unpublishing the
 * newer value. Shared by the element context and element mutator contracts.
 */
export function publishOnElement<T>(host: Element, property: string, value: T): () => void {
  const carrier = host as unknown as Record<string, T | undefined>;
  carrier[property] = value;

  return () => {
    if (carrier[property] === value) {
      delete carrier[property];
    }
  };
}
