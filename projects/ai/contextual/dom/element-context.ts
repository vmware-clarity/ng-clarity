/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext, ClrContextSnapshotOptions } from '../interfaces/context.interface';

/**
 * Name of the element property through which a component publishes instance state the
 * DOM cannot show — a combobox's options and selection model, lazily rendered choices,
 * anything living only inside the component.
 *
 * The property is the whole contract: a component assigns a function to
 * `element.clrElementContext` on its own host element (and removes it on destroy), and
 * the collector calls it while scraping, merging the result into what it extracted from
 * the DOM. Because it is a plain property with plain data, publishing requires no
 * dependency on this package — Clarity components, other UI libraries and application
 * components can all use it, and readers that do not know the property ignore it.
 */
export const CLR_ELEMENT_CONTEXT_PROPERTY = 'clrElementContext';

/**
 * The callback a component assigns to its host element. It receives the resolved
 * snapshot budgets — including `includeFormValues`, which the callback must honor
 * before exposing anything user-typed — and returns the context to merge, or
 * `null`/`undefined` when it currently has nothing to add.
 */
export type ClrElementContextCallback = (
  options: Required<ClrContextSnapshotOptions>
) => Partial<ClrComponentContext> | null | undefined;

/** Assigns (or, with `null`, removes) an element's context callback. */
export function setClrElementContext(element: Element, callback: ClrElementContextCallback | null): void {
  const carrier = element as Element & { [CLR_ELEMENT_CONTEXT_PROPERTY]?: ClrElementContextCallback };
  if (callback) {
    carrier[CLR_ELEMENT_CONTEXT_PROPERTY] = callback;
  } else {
    delete carrier[CLR_ELEMENT_CONTEXT_PROPERTY];
  }
}

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

/**
 * Finds the first element at or below `root` that publishes context. Used for form
 * fields, where the publishing component (e.g. a combobox) sits inside the field
 * container the collector describes.
 */
export function findPublishingElement(root: Element): Element | null {
  if (typeof (root as Element & Record<string, unknown>)[CLR_ELEMENT_CONTEXT_PROPERTY] === 'function') {
    return root;
  }
  for (const element of Array.from(root.querySelectorAll('*'))) {
    if (typeof (element as Element & Record<string, unknown>)[CLR_ELEMENT_CONTEXT_PROPERTY] === 'function') {
      return element;
    }
  }
  return null;
}
