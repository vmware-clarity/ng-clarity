/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/** Assigns `host[property]`; the teardown removes it only while it is still this value. */
export function publishOnElement<T>(host: Element, property: string, value: T): () => void {
  const carrier = host as unknown as Record<string, T | undefined>;
  carrier[property] = value;

  return () => {
    if (carrier[property] === value) {
      delete carrier[property];
    }
  };
}
