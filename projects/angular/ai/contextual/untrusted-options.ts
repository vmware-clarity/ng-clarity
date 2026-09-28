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

/** The longest an enumeration value — `focus`, `collectionItems`, a role or category name — may be. */
const MAX_ENUM_LENGTH = 32;

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
 * query string, fragment, route parameters or route data; links to the application as
 * the route pattern they match, and links elsewhere and frames as their origin. Paths, parameters and queries routinely carry record identifiers,
 * tenant identifiers and occasionally credentials — a reset token, an invitation code,
 * a signed download — none of which a consumer the application does not control needs
 * to know where the user is.
 */
export function withoutUrlDetails(
  context: ClrPageContext,
  routePattern?: (path: string) => string | null
): ClrPageContext {
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
  // The same reasoning applies to the page's links and frames: an invitation, a reset
  // link, a record's page carry their secret in the path as often as in the query.
  const base = originOf(context.url);
  shared.components = context.components.map(node => withoutAddressDetails(node, base, routePattern));
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

function originOf(url: string | undefined): string | null {
  try {
    return url ? new URL(url).origin : null;
  } catch {
    return null;
  }
}

/**
 * A node's addresses as an untrusted caller may see them. A link to this application
 * becomes the route pattern it matches, and is dropped when it matches none; a link
 * elsewhere, and a frame, keep only their origin; a `mailto:` or `tel:` link keeps only
 * its scheme.
 */
function withoutAddressDetails(
  node: ClrComponentContext,
  base: string | null,
  routePattern?: (path: string) => string | null
): ClrComponentContext {
  let result = node;
  const state = node.state;
  if (state && (typeof state['href'] === 'string' || typeof state['url'] === 'string')) {
    const reduced: Record<string, unknown> = { ...state };
    for (const key of ['href', 'url']) {
      if (typeof reduced[key] === 'string') {
        const address = reducedAddress(reduced[key] as string, key === 'href', base, routePattern);
        if (address === null) {
          delete reduced[key];
        } else {
          reduced[key] = address;
        }
      }
    }
    result = { ...result, state: reduced };
    if (!Object.keys(reduced).length) {
      delete result.state;
    }
  }
  if (node.children?.length) {
    result = { ...result, children: node.children.map(child => withoutAddressDetails(child, base, routePattern)) };
  }
  return result;
}

function reducedAddress(
  address: string,
  isLink: boolean,
  base: string | null,
  routePattern?: (path: string) => string | null
): string | null {
  let url: URL;
  try {
    url = new URL(address, base ?? undefined);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return url.protocol;
  }
  if (!isLink || url.origin !== base) {
    return `${url.origin}/`;
  }
  const pattern = routePattern?.(url.pathname) ?? null;
  return pattern === null ? null : `/${pattern}`;
}
