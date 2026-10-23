/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext } from '@clr/angular/utils';

/** Re-exported from `@clr/angular/utils`, so components can publish without depending on this entry point. */
export type { ClrComponentContext, ClrContextCategory, ClrContextSnapshotOptions } from '@clr/angular/utils';

/** The active route, when the application uses the Angular router. */
export interface ClrRouteContext {
  /** The current router URL, e.g. `/users/42?tab=details`. */
  url: string;
  /** The configured route path pattern, e.g. `users/:id`. */
  path?: string;
  /** Route parameters of the active route chain. */
  params?: Record<string, string>;
  /** Query parameters of the current URL. */
  queryParams?: Record<string, string>;
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

/** Identifies the application a snapshot describes. */
export interface ClrApplicationContext {
  /** A stable id for the application, e.g. `vcenter-ui`. */
  id: string;
  /** The application's version, when it reports one. */
  version?: string;
}

/** A snapshot of the page context, always computed on demand from the live application. */
export interface ClrPageContext {
  /** Version of the snapshot format; it changes when a field changes meaning. */
  schemaVersion: string;
  /** The application, from `provideClrContextApplication`; the page's host name when none is provided. */
  application: ClrApplicationContext;
  /** The view the user is on, from the application provider or the route's `data.viewId`. */
  viewId?: string;
  /** Application metadata about the current view, from the application provider. */
  metadata?: Record<string, unknown>;
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
 * Contributes context to snapshots. Polled at snapshot time; return `null` when there is nothing to report.
 * A promise is awaited by `getSnapshotAsync` and reported as loading by `getSnapshot`.
 */
export interface ClrContextProvider {
  /** The provider's context as it is now, or `null` when it has nothing to report. */
  getClrContext(): ClrComponentContext | null | Promise<ClrComponentContext | null>;
}
