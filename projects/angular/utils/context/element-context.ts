/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext, ClrContextSnapshotOptions } from './context.interface';
import { publishOnElement } from './publish';

/** Host element property through which a component publishes state the DOM cannot show. */
export const CLR_ELEMENT_CONTEXT_PROPERTY = 'clrElementContext';

/**
 * Returns context to merge into the host's description, or `null`. User input must be reported under
 * `value`, `selected`, `checked`, `pressed`, `selection`, `selectedRows`, `rows`, `filteredColumns`, `hiddenColumns`,
 * `fileCount` or `matchingOption*` keys, which untrusted consumers never see; any other key is shared with everyone.
 */
export type ClrElementContextCallback = (
  options?: Required<ClrContextSnapshotOptions>
) => Partial<ClrComponentContext> | null | undefined;

/** Publishes a context callback on the host element. The teardown only removes the callback it published. */
export function publishElementContext(host: Element, callback: ClrElementContextCallback): () => void {
  return publishOnElement(host, CLR_ELEMENT_CONTEXT_PROPERTY, callback);
}
