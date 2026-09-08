/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_ELEMENT_CONTEXT_PROPERTY, ClrComponentContext, ClrContextSnapshotOptions } from '@clr/angular/utils';

/**
 * Re-exported so readers of page context can import the whole contract from
 * `@clr/angular/ai`. Components that *publish* context import `publishElementContext`
 * from `@clr/angular/utils` instead, which keeps them free of this entry point.
 */
export { CLR_ELEMENT_CONTEXT_PROPERTY, publishElementContext } from '@clr/angular/utils';
export type { ClrElementContextCallback } from '@clr/angular/utils';

/**
 * Reads an element's published context, if any. A callback that throws is treated as
 * having nothing to say — one broken publisher must not break the snapshot.
 */
export function readClrElementContext(
  element: Element,
  options: Required<ClrContextSnapshotOptions>
): Partial<ClrComponentContext> | null {
  const callback = (element as Element & { [CLR_ELEMENT_CONTEXT_PROPERTY]?: unknown })[CLR_ELEMENT_CONTEXT_PROPERTY];
  if (typeof callback !== 'function') {
    return null;
  }
  try {
    const published = callback(options);
    return published && typeof published === 'object' ? (published as Partial<ClrComponentContext>) : null;
  } catch {
    return null;
  }
}

/**
 * Merges an element's published context over a DOM-extracted one. Published values win
 * — the component knows itself better than the markup does — and states are merged
 * key-wise. Arrays inside the published state are capped to the collection budget.
 */
export function mergeElementContext(
  base: ClrComponentContext,
  element: Element,
  options: Required<ClrContextSnapshotOptions>
): ClrComponentContext {
  const published = readClrElementContext(element, options);
  if (!published) {
    return base;
  }
  const merged: ClrComponentContext = { ...base, ...published, state: { ...base.state, ...published.state } };
  for (const [key, value] of Object.entries(merged.state ?? {})) {
    if (Array.isArray(value)) {
      (merged.state as Record<string, unknown>)[key] = value.slice(0, options.maxItemsPerCollection);
    }
  }
  return merged;
}
