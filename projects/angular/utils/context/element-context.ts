/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext, ClrContextSnapshotOptions } from './interfaces';

/**
 * Name of the element property through which a component publishes instance state the
 * DOM cannot show — a combobox's options and selection model, a datagrid's total row
 * count while paginated, anything living only inside the component.
 *
 * The property is the whole contract: a component assigns a function to
 * `element.clrElementContext` on its own host element and removes it on destroy, and
 * page-context tooling calls it while scraping, merging the result into what it read
 * from the DOM. Because it is a plain property carrying plain data, publishing costs a
 * component nothing but this one import, and readers that do not know the property
 * simply ignore it.
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

/**
 * Publishes a component's context callback on its host element and returns the teardown
 * to call on destroy.
 *
 * The teardown only removes the callback it published. A component that republishes
 * (for example after its host element is re-created) can therefore let a stale teardown
 * run without silently unpublishing the newer callback.
 */
export function publishElementContext(host: Element, callback: ClrElementContextCallback): () => void {
  const carrier = host as Element & { [CLR_ELEMENT_CONTEXT_PROPERTY]?: ClrElementContextCallback };
  carrier[CLR_ELEMENT_CONTEXT_PROPERTY] = callback;

  return () => {
    if (carrier[CLR_ELEMENT_CONTEXT_PROPERTY] === callback) {
      delete carrier[CLR_ELEMENT_CONTEXT_PROPERTY];
    }
  };
}
