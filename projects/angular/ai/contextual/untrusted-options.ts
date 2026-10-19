/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { withoutStateKeys, withoutValues } from './dom/aria-state';
import { UNTRUSTED_WITHHELD_STATE_KEYS } from './dom/tables/aria';
import { ClrComponentContext, ClrContextSnapshotOptions, ClrPageContext } from './interfaces/context.interface';
import { BUDGET_KEYS, MAX_LIST_ENTRIES, SWITCH_KEYS } from './snapshot-options';

/** Snapshot budgets a caller the application does not control may set; content rules are not negotiable. */
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

const MAX_ENUM_LENGTH = 32;

const ENUM_KEYS: readonly string[] = ['focus', 'collectionItems'];

const UNTRUSTED_LIST_KEYS: readonly string[] = ['excludeCategories', 'excludeRoles'];

/** Reduces an untrusted caller's options to typed budgets, so no getter, object, `NaN` or selector gets through. */
export function sanitizeUntrustedSnapshotOptions(options?: unknown): ClrContextSnapshotOptions | undefined {
  if (!options || typeof options !== 'object') {
    return undefined;
  }
  const candidate = options as Record<string, unknown>;
  const sanitized: Record<string, unknown> = {};
  for (const key of CLR_CONTEXT_UNTRUSTED_OPTION_KEYS) {
    const value = acceptedValue(key, candidate[key]);
    if (value !== undefined) {
      sanitized[key] = value;
    }
  }
  return sanitized as ClrContextSnapshotOptions;
}

function acceptedValue(key: string, value: unknown): unknown {
  if (typeof value === 'number') {
    return Number.isFinite(value) && (BUDGET_KEYS as readonly string[]).includes(key) ? value : undefined;
  }
  if (typeof value === 'boolean') {
    return (SWITCH_KEYS as readonly string[]).includes(key) ? value : undefined;
  }
  if (typeof value === 'string') {
    return value.length <= MAX_ENUM_LENGTH && ENUM_KEYS.includes(key) ? value : undefined;
  }
  if (Array.isArray(value) && UNTRUSTED_LIST_KEYS.includes(key)) {
    return value
      .filter(entry => typeof entry === 'string' && entry.length <= MAX_ENUM_LENGTH)
      .slice(0, MAX_LIST_ENTRIES);
  }
  return undefined;
}

/**
 * The context without what the user entered, for a consumer the application does not control.
 * Fields keep their shape and are marked `withheld: true`; annotation regions are left as published.
 */
export function withoutFormValues(context: ClrPageContext): ClrPageContext {
  return {
    ...context,
    components: context.components.map(node =>
      withoutStateKeys(withoutValues(node, true), () => UNTRUSTED_WITHHELD_STATE_KEYS, true)
    ),
  };
}

/**
 * The context with only the route pattern of its address, origins for links and frames, and no title,
 * for an untrusted consumer: paths and queries carry ids, tokens and signed links.
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
  const origin = originOf(context.url);
  // A base on another origin is not this page's: relative links resolve against the page.
  const resolveAgainst = baseUrl && originOf(baseUrl) === origin ? baseUrl : (context.url ?? null);
  shared.components = context.components.map(node =>
    withoutAddressDetails(node, { origin, resolveAgainst, routePattern })
  );
  return shared;
}

interface AddressScope {
  origin: string | null;
  resolveAgainst: string | null;
  routePattern?: (url: URL) => string | null;
}

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

function withoutAddressDetails(node: ClrComponentContext, scope: AddressScope): ClrComponentContext {
  let result = node;
  const state = node.state;
  // A frame whose document is an editing host reads as a textbox, so match on the element too.
  const frame = node.type === 'frame' || node.element === 'iframe' || node.element === 'frame';
  if (state && (typeof state['href'] === 'string' || typeof state['url'] === 'string' || (frame && 'title' in state))) {
    const reduced: Record<string, unknown> = { ...state };
    if (frame) {
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
