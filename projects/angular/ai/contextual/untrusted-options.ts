/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrContextSnapshotOptions } from './interfaces/context.interface';

/**
 * Snapshot budgets a caller the application does not control — an embedded frame, a
 * script calling the global accessor — is allowed to set.
 *
 * `includeFormValues` is deliberately absent. Exposing what a user has typed is a
 * decision only the hosting application can make, so it can never be turned on by
 * whoever is asking.
 */
export const CLR_CONTEXT_UNTRUSTED_OPTION_KEYS: (keyof ClrContextSnapshotOptions)[] = [
  'maxTextLength',
  'maxItemsPerCollection',
  'maxComponents',
  'includeDomComponents',
  'includeActions',
];

/**
 * Reduces whatever an untrusted caller passed to the budgets it is allowed to set,
 * discarding everything else. Anything that is not a number or a boolean is dropped, so
 * a caller cannot smuggle a getter or an object through.
 */
export function sanitizeUntrustedSnapshotOptions(options?: unknown): ClrContextSnapshotOptions | undefined {
  if (!options || typeof options !== 'object') {
    return undefined;
  }
  const candidate = options as Record<string, unknown>;
  const sanitized: ClrContextSnapshotOptions = {};
  for (const key of CLR_CONTEXT_UNTRUSTED_OPTION_KEYS) {
    const value = candidate[key];
    if (typeof value === 'number' || typeof value === 'boolean') {
      (sanitized as Record<string, unknown>)[key] = value;
    }
  }
  return sanitized;
}
