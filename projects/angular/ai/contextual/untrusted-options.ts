/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { withoutValues } from './dom/aria-state';
import { ClrComponentContext, ClrContextSnapshotOptions, ClrPageContext } from './interfaces/context.interface';
import { MAX_LIST_ENTRIES } from './snapshot-options';
import { stripQueryAndFragment } from './url';

/**
 * Snapshot budgets a caller the application does not control — an embedded frame, a
 * script calling the global accessor — is allowed to set.
 *
 * Budgets are all a caller may influence. What a snapshot is allowed to contain is not
 * negotiable from the outside — see {@link withoutFormValues}.
 */
export const CLR_CONTEXT_UNTRUSTED_OPTION_KEYS: readonly (keyof ClrContextSnapshotOptions)[] = Object.freeze([
  'maxTextLength',
  'maxItemsPerCollection',
  'maxComponents',
  'maxDepth',
  'includeDomComponents',
  'includeText',
  'includeFrames',
  'includeRoutes',
  'excludeCategories',
  'excludeRoles',
  'focus',
  'collectionItems',
] as const);

/**
 * Reduces whatever an untrusted caller passed to the budgets it is allowed to set,
 * discarding everything else. Anything that is not a finite number, a boolean, a short
 * string or a list of strings is dropped, so a caller cannot smuggle a getter or an
 * object through — nor a `NaN` or an `Infinity`, which a budget check would never see as
 * exhausted. What survives is still held to its range when the snapshot is built.
 * Selectors are not accepted from an untrusted caller at all.
 */
/** The longest an enumeration value — `focus`, `collectionItems`, a role or category name — may be. */
const MAX_ENUM_LENGTH = 32;

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
    } else if (typeof value === 'string' && value.length <= MAX_ENUM_LENGTH) {
      // Enumerations; anything that is not one of the values is dropped when resolved.
      (sanitized as Record<string, unknown>)[key] = value;
    } else if (Array.isArray(value)) {
      (sanitized as Record<string, unknown>)[key] = value
        .filter(entry => typeof entry === 'string')
        .slice(0, MAX_LIST_ENTRIES);
    }
  }
  return sanitized;
}

/**
 * The same context with everything the user entered taken out — what they typed, which
 * options they chose, which boxes they ticked — for a consumer the application does not
 * control: an embedded frame, a script calling the global accessor.
 *
 * Fields keep their label, type, constraints and validation state, so such a consumer
 * still learns the shape of a form; it just does not learn its contents.
 *
 * Regions are left as they are: those come from the application's own `clrContext`
 * annotations, so whatever is in them was put there deliberately.
 */
export function withoutFormValues(context: ClrPageContext): ClrPageContext {
  return { ...context, components: context.components.map(withoutValues) };
}

/**
 * The same context with only as much of the address as says which page this is: the
 * route's pattern (`reset/:token`) rather than the path it matched (`reset/4f9c…`), no
 * query string, fragment, route parameters or route data, and links without their
 * query strings. Paths, parameters and queries routinely carry record identifiers,
 * tenant identifiers and occasionally credentials — a reset token, an invitation code,
 * a signed download — none of which a consumer the application does not control needs
 * to know where the user is.
 */
export function withoutUrlDetails(context: ClrPageContext): ClrPageContext {
  const shared: ClrPageContext = { ...context };
  const pattern = context.route?.path;
  if (typeof shared.url === 'string') {
    shared.url = pattern !== undefined ? withPath(shared.url, pattern) : stripQueryAndFragment(shared.url);
  }
  if (context.route) {
    shared.route = { url: pattern !== undefined ? `/${pattern}` : stripQueryAndFragment(context.route.url) };
    if (pattern !== undefined) {
      shared.route.path = pattern;
    }
  }
  // The same reasoning applies to the page's links: a signed download, an invitation,
  // a reset link all carry their secret in the query string.
  shared.components = context.components.map(withoutLinkQueries);
  return shared;
}

/** The URL's origin with `path` in place of its own path, query and fragment. */
function withPath(url: string, path: string): string {
  try {
    return `${new URL(url).origin}/${path}`;
  } catch {
    return `/${path}`;
  }
}

function withoutLinkQueries(node: ClrComponentContext): ClrComponentContext {
  let result = node;
  const href = node.state?.['href'];
  if (typeof href === 'string') {
    result = { ...result, state: { ...node.state, href: stripQueryAndFragment(href) } };
  }
  if (node.children?.length) {
    result = { ...result, children: node.children.map(withoutLinkQueries) };
  }
  return result;
}
