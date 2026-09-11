/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext, ClrContextSnapshotOptions, ClrPageContext } from './interfaces/context.interface';

/**
 * Snapshot budgets a caller the application does not control — an embedded frame, a
 * script calling the global accessor — is allowed to set.
 *
 * Budgets are all a caller may influence. What a snapshot is allowed to contain is not
 * negotiable from the outside — see {@link withoutFormValues}.
 */
export const CLR_CONTEXT_UNTRUSTED_OPTION_KEYS: (keyof ClrContextSnapshotOptions)[] = [
  'maxTextLength',
  'maxItemsPerCollection',
  'maxComponents',
  'maxDepth',
  'includeDomComponents',
  'includeText',
  'includeFrames',
  'excludeCategories',
  'excludeRoles',
  'focus',
  'collectionItems',
];

/**
 * Reduces whatever an untrusted caller passed to the budgets it is allowed to set,
 * discarding everything else. Anything that is not a finite number, a boolean, a short
 * string or a list of strings is dropped, so a caller cannot smuggle a getter or an
 * object through — nor a `NaN` or an `Infinity`, which a budget check would never see as
 * exhausted. What survives is still held to its range when the snapshot is built.
 * Selectors are not accepted from an untrusted caller at all.
 */
export function sanitizeUntrustedSnapshotOptions(options?: unknown): ClrContextSnapshotOptions | undefined {
  if (!options || typeof options !== 'object') {
    return undefined;
  }
  const candidate = options as Record<string, unknown>;
  const sanitized: ClrContextSnapshotOptions = {};
  for (const key of CLR_CONTEXT_UNTRUSTED_OPTION_KEYS) {
    const value = candidate[key];
    if ((typeof value === 'number' && Number.isFinite(value)) || typeof value === 'boolean') {
      (sanitized as Record<string, unknown>)[key] = value;
    } else if (typeof value === 'string' && value.length <= 32) {
      // Enumerations; anything that is not one of the values is dropped when resolved.
      (sanitized as Record<string, unknown>)[key] = value;
    } else if (Array.isArray(value)) {
      (sanitized as Record<string, unknown>)[key] = value.filter(entry => typeof entry === 'string').slice(0, 50);
    }
  }
  return sanitized;
}

/**
 * The same context with everything the user typed taken out, for a consumer the
 * application does not control — an embedded frame, a script calling the global
 * accessor.
 *
 * Fields keep their label, type, constraints and validation state, so such a consumer
 * still learns the shape of a form; it just does not learn its contents.
 *
 * Regions are left as they are: those come from the application's own `clrContext`
 * annotations, so whatever is in them was put there deliberately.
 */
export function withoutFormValues(context: ClrPageContext): ClrPageContext {
  return { ...context, components: context.components.map(withoutValue) };
}

function withoutValue(component: ClrComponentContext): ClrComponentContext {
  const reduced: ClrComponentContext = { ...component };

  if (reduced.state && 'value' in reduced.state) {
    const state = { ...reduced.state };
    delete state.value;
    if (Object.keys(state).length) {
      reduced.state = state;
    } else {
      delete reduced.state;
    }
  }
  if (reduced.children?.length) {
    reduced.children = reduced.children.map(withoutValue);
  }
  return reduced;
}
