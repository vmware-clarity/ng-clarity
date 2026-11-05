/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_ELEMENT_CONTEXT_PROPERTY, ClrContextSnapshotOptions, ClrElementContextCallback } from '@clr/angular/utils';

/**
 * Calls the context callback a component published on `element`, and fails when there is
 * none. Options left out fall back to the defaults, as the callback contract requires.
 */
export function publishedOn(
  element: Element,
  options: ClrContextSnapshotOptions = {}
): ReturnType<ClrElementContextCallback> {
  const callback = (element as Element & { [CLR_ELEMENT_CONTEXT_PROPERTY]?: ClrElementContextCallback })[
    CLR_ELEMENT_CONTEXT_PROPERTY
  ];
  if (!callback) {
    throw new Error(`expected <${element.tagName.toLowerCase()}> to publish an element context callback`);
  }
  return callback(options as Required<ClrContextSnapshotOptions>);
}

/** The state a component published on `element`, or `{}` when it published none. */
export function publishedState(element: Element, options: ClrContextSnapshotOptions = {}): Record<string, unknown> {
  return (publishedOn(element, options)?.state ?? {}) as Record<string, unknown>;
}
