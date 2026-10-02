/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { withoutValues } from './dom/aria-state';
import { ClrComponentContext, ClrContextSnapshotOptions, ClrPageContext } from './interfaces/context.interface';
import { MAX_LIST_ENTRIES } from './snapshot-options';

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
      // Roles and categories; a selector is not accepted from here at all.
      (sanitized as Record<string, unknown>)[key] = value
        .filter(entry => typeof entry === 'string' && entry.length <= MAX_ENUM_LENGTH)
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
 * still learns the shape of a form; it just does not learn its contents. The rows a
 * selectable grid lists, which exist to name a selection, go with the selection.
 *
 * Regions are left as they are, state included: those come from the application's own
 * `clrContext` annotations, so whatever is in them was put there deliberately, for every
 * consumer.
 */
export function withoutFormValues(context: ClrPageContext): ClrPageContext {
  return { ...context, components: context.components.map(node => withoutRowContents(withoutValues(node))) };
}

/**
 * A node without the rows a selectable grid lists so that a row can be named for
 * selection: that is the grid's content, cell by cell, where any other grid tells such a
 * consumer only its columns and how many rows it has.
 */
function withoutRowContents(node: ClrComponentContext): ClrComponentContext {
  let result = node;
  if (node.state && 'rows' in node.state) {
    const kept: Record<string, unknown> = { ...node.state };
    delete kept['rows'];
    result = { ...result, state: kept };
  }
  const children = node.children;
  if (children?.length) {
    const reduced = children.map(withoutRowContents);
    if (reduced.some((child, index) => child !== children[index])) {
      result = { ...result, children: reduced };
    }
  }
  return result;
}

/**
 * The same context with only as much of the address as says which page this is: the
 * route's pattern (`reset/:token`) rather than the path it matched (`reset/4f9c…`), no
 * query string, fragment, route parameters or route data; links to the application as
 * the route pattern they match, and links elsewhere and frames as their origin. Paths,
 * parameters and queries routinely carry record identifiers, tenant identifiers and
 * occasionally credentials — a reset token, an invitation code, a signed download — none
 * of which a consumer the application does not control needs to know where the user is.
 * The document title goes too: it names the record on screen as often as the page.
 *
 * A page that matches no configured route — or an application without a router — has no
 * pattern to stand for its path, so only the origin is left of its address.
 *
 * `baseUrl` is what the page's relative links resolve against — the document's base URI,
 * which a `<base href>` moves away from the page's own address. It defaults to the page's
 * address.
 */
export function withoutUrlDetails(
  context: ClrPageContext,
  routePattern?: (url: URL) => string | null,
  baseUrl: string | undefined = context.url
): ClrPageContext {
  const shared: ClrPageContext = { ...context, title: '' };
  const pattern = context.route?.path;
  if (typeof shared.url === 'string') {
    shared.url = withPath(shared.url, pattern ?? '');
  }
  if (pattern !== undefined) {
    shared.route = { url: `/${pattern}`, path: pattern };
  } else {
    delete shared.route;
  }
  // The same reasoning applies to the page's links and frames: an invitation, a reset
  // link, a record's page carry their secret in the path as often as in the query.
  const origin = originOf(context.url);
  // A base on another origin is not this page's: relative links resolve against the page.
  const resolveAgainst = baseUrl && originOf(baseUrl) === origin ? baseUrl : (context.url ?? null);
  shared.components = context.components.map(node =>
    withoutAddressDetails(node, { origin, resolveAgainst, routePattern })
  );
  return shared;
}

/** What reducing an address needs to know about the page it is on. */
interface AddressScope {
  /** The page's origin: a link elsewhere keeps only its own. */
  origin: string | null;
  /** What a relative address resolves against. */
  resolveAgainst: string | null;
  /** The configured pattern an address on this origin leads to, or `null`. */
  routePattern?: (url: URL) => string | null;
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
 * its scheme. A frame's document title is dropped.
 */
function withoutAddressDetails(node: ClrComponentContext, scope: AddressScope): ClrComponentContext {
  let result = node;
  const state = node.state;
  if (
    state &&
    (typeof state['href'] === 'string' ||
      typeof state['url'] === 'string' ||
      (node.type === 'frame' && 'title' in state))
  ) {
    const reduced: Record<string, unknown> = { ...state };
    // A frame's document title goes with the page's own.
    if (node.type === 'frame') {
      delete reduced['title'];
    }
    for (const key of ['href', 'url']) {
      if (typeof reduced[key] === 'string') {
        const address = reducedAddress(reduced[key] as string, key === 'href', scope);
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
    result = { ...result, children: node.children.map(child => withoutAddressDetails(child, scope)) };
  }
  return result;
}

function reducedAddress(address: string, isLink: boolean, scope: AddressScope): string | null {
  let url: URL;
  try {
    url = new URL(address, scope.resolveAgainst ?? undefined);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return url.protocol;
  }
  if (!isLink || url.origin !== scope.origin) {
    return `${url.origin}/`;
  }
  const pattern = scope.routePattern?.(url) ?? null;
  return pattern === null ? null : `/${pattern}`;
}
