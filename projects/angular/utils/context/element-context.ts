/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrContextSnapshotOptions, ClrPublishedContext } from './context.interface';
import { publishFor } from './publish';

const published = new WeakMap<Element, ClrElementContextCallback>();

/** Returns context to merge into the host's description, or `null`. */
export type ClrElementContextCallback = (
  options?: Required<ClrContextSnapshotOptions>
) => Partial<ClrPublishedContext> | null | undefined;

/**
 * Publishes state the DOM cannot show for the host element. The callback is kept off the element, so other scripts
 * on the page can neither read nor replace it. The teardown only removes the callback it published.
 */
export function publishElementContext(host: Element, callback: ClrElementContextCallback): () => void {
  return publishFor(published, host, callback);
}

/** The context callback published for the element, if any. */
export function elementContextOf(host: Element): ClrElementContextCallback | undefined {
  return published.get(host);
}
