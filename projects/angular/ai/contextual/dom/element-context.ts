/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_ELEMENT_CONTEXT_PROPERTY, ClrComponentContext, ClrContextSnapshotOptions } from '@clr/angular/utils';

import { jsonSafe } from '../json-safe';

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
  // Only the walk hands out refs: a publisher cannot claim one, for itself or its children.
  const own = withoutRefs(published as ClrComponentContext);
  const merged: ClrComponentContext = { ...base, ...own, state: { ...base.state } };
  if (base.ref) {
    merged.ref = base.ref;
  } else {
    delete merged.ref;
  }
  if (typeof own.type !== 'string' || !own.type) {
    merged.type = base.type;
  }
  if (own.label !== undefined && typeof own.label !== 'string') {
    merged.label = base.label;
  }
  // Published state is whatever the component holds, which may be a class instance or
  // something circular; only its plain, serialisable part reaches a snapshot.
  for (const [key, value] of Object.entries(own.state ?? {})) {
    const safe = jsonSafe(value, 3, true);
    if (safe !== undefined) {
      (merged.state as Record<string, unknown>)[key] = Array.isArray(safe)
        ? safe.slice(0, options.maxItemsPerCollection)
        : safe;
    }
  }
  // Children a component publishes are not walked, so they are not counted against the
  // component budget either; the collection budget bounds them instead.
  if (Array.isArray(merged.children)) {
    merged.children = merged.children.slice(0, options.maxItemsPerCollection);
  }
  return merged;
}

/**
 * The same node without any `ref`, recursively. Refs are handed out by the walk alone;
 * a node that arrives from a publisher or an extractor is application code's say about
 * what it is, and must not be able to point at, or take over, another node's ref.
 */
export function withoutRefs(node: ClrComponentContext): ClrComponentContext {
  if (!node || typeof node !== 'object') {
    return node;
  }
  let result = node;
  if ('ref' in node) {
    result = { ...node };
    delete result.ref;
  }
  if (Array.isArray(node.children)) {
    const children = node.children.map(withoutRefs);
    if (children.some((child, index) => child !== node.children?.[index])) {
      result = { ...result, children };
    }
  }
  return result;
}
