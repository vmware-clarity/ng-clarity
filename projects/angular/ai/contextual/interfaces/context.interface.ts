/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext, ClrPublishedContext } from '@clr/angular/utils';

/** Re-exported from `@clr/angular/utils`, so components can publish without depending on this entry point. */
export type {
  ClrComponentContext,
  ClrContextCategory,
  ClrContextSnapshotOptions,
  ClrPublishedContext,
} from '@clr/angular/utils';

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
  /** The application, from `configure({ application })`; the page's host name when none is configured. */
  application: ClrApplicationContext;
  /**
   * The view the user is on: `viewId` in the state of the view root's annotation, then `application.viewId`,
   * the route's `data.viewId` and the configured views.
   */
  viewId?: string;
  /**
   * Metadata about the current view, merged from the configured views, `application.metadata` and the
   * `[clrContext]` annotation on the view root, later ones winning.
   */
  metadata?: Record<string, unknown>;
  /** Set while the `viewConfig` URL is loading, or when it could not be loaded. */
  metadataState?: 'loading' | 'unavailable';
  /**
   * Whether the engine reads this view: `false` when a configured view disables it, or the application
   * reads only enabled views and this one has no metadata, and then nothing else is read. It gates this engine
   * only, not what the page renders.
   */
  enabled: boolean;
  /** The document title; empty for an untrusted caller unless it shares the full URL. */
  title: string;
  /** The current URL (browser location, or router URL when available). */
  url?: string;
  /** Route information, present when the application uses the Angular router. */
  route?: ClrRouteContext;
  /** Routable paths, when configured with `routes: true`; at least 50 entries, without wildcards or redirects. */
  availableRoutes?: ClrAvailableRoute[];
  /** Context that no element shows, from the providers registered with `ClrContextRegistryService`. */
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
 * A promise is awaited by `snapshot()`.
 * While it is pending, later snapshots wait for it instead of asking again. A promise that rejects or
 * outlasts the timeout is reported as `{ type: 'clr-unavailable' }`.
 */
export interface ClrContextProvider {
  /** The provider's context as it is now, or `null` when it has nothing to report. */
  getClrContext(): ClrPublishedContext | null | Promise<ClrPublishedContext | null>;
}
