/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrContextSnapshotOptions, ClrPublishedContext } from './context.interface';
import { publishOnElement } from './publish';

/** Host element property through which a component publishes state the DOM cannot show. */
export const CLR_ELEMENT_CONTEXT_PROPERTY = 'clrElementContext';

/**
 * Returns context to merge into the host's description, or `null`. Untrusted consumers see only the state
 * keys listed in `publicKeys`, so user input stays private unless it is listed.
 */
export type ClrElementContextCallback = (
  options?: Required<ClrContextSnapshotOptions>
) => Partial<ClrPublishedContext> | null | undefined;

/** Publishes a context callback on the host element. The teardown only removes the callback it published. */
export function publishElementContext(host: Element, callback: ClrElementContextCallback): () => void {
  return publishOnElement(host, CLR_ELEMENT_CONTEXT_PROPERTY, callback);
}
