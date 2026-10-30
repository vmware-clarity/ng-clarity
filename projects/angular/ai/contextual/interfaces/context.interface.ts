/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext, ClrContextSnapshotOptions, ClrPublishedContext } from '@clr/angular/utils';

/** Re-exported from `@clr/angular/utils`, so components can publish without depending on this entry point. */
export type {
  ClrComponentContext,
  ClrContextCategory,
  ClrContextSnapshotOptions,
  ClrPublishedContext,
} from '@clr/angular/utils';

/** Options for `getSnapshotAsync`: the snapshot's, and how long to wait for each asynchronous provider. */
export interface ClrContextAsyncSnapshotOptions extends ClrContextSnapshotOptions {
  /** Milliseconds to wait for each asynchronous provider. Default `2000`. */
  timeoutMs?: number;
}

/** The active route, when the application uses the Angular router. */
export interface ClrRouteContext {
  /** The current router URL, e.g. `/users/42?tab=details`. */
  url: string;
  /** The configured route path pattern, e.g. `users/:id`. */
  path?: string;
  /** Route parameters of the active route chain. */
  params?: Record<string, string>;
  /** Query parameters of the current URL. */
  queryParams?: Record<string, string | string[]>;
  /** JSON-serializable subset of the route `data` of the active route chain. */
  data?: Record<string, unknown>;
}

/** A route the application can navigate to, from its router configuration. */
export interface ClrAvailableRoute {
  /** The configured path pattern, e.g. `clusters/:id/hosts`. */
  path: string;
  /** The route's title, when the configuration names one. */
  title?: string;
  /** Present when the route's children load lazily and are not listed until visited. */
  lazy?: boolean;
}

/** A snapshot of the page context, always computed on demand from the live application. */
export interface ClrPageContext {
  /** The document title; empty for an untrusted caller unless it shares the full URL. */
  title: string;
  /** The current URL (browser location, or router URL when available). */
  url?: string;
  /** Route information, present when the application uses the Angular router. */
  route?: ClrRouteContext;
  /** Routable paths, when `includeRoutes` is set; at least 50 entries, without wildcards or redirects. */
  availableRoutes?: ClrAvailableRoute[];
  /** Application-provided contexts from the `clrContext` directive or a {@link ClrContextProvider}. */
  regions: ClrComponentContext[];
  /** Everything rendered with a role, name or text, as a tree; collections are summarised. */
  components: ClrComponentContext[];
  /** `true` when something was left out for size; raise the budget or narrow the scope. */
  truncated?: boolean;
  /** `'modal'` when only the open modal dialog is described. */
  focus?: 'modal';
  /** ISO timestamp of the moment the snapshot was taken. */
  collectedAt: string;
}

/**
 * Contributes context to snapshots. Asked once per snapshot; return `null` when there is nothing to report.
 * A promise is awaited by `getSnapshotAsync` and reported as `{ type: 'clr-loading' }` by `getSnapshot`;
 * while it is pending, later snapshots wait for it instead of asking again. A promise that rejects or
 * outlasts the timeout is reported as `{ type: 'clr-unavailable' }`. Untrusted consumers see only the
 * state keys listed in `publicKeys`.
 */
export interface ClrContextProvider {
  /** The provider's context as it is now, or `null` when it has nothing to report. */
  getClrContext(): ClrPublishedContext | null | Promise<ClrPublishedContext | null>;
}
