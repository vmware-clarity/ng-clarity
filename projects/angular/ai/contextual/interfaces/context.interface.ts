/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext, ClrContextAction } from '@clr/angular/utils';

/**
 * Re-exported so `@clr/angular/ai` remains a complete public surface. The shared context
 * contracts live in `@clr/angular/utils` because components publish through them and must
 * not depend on this entry point — see `publishElementContext`.
 */
export type { ClrComponentContext, ClrContextAction, ClrContextSnapshotOptions } from '@clr/angular/utils';

/**
 * Information about the currently active route, when the application uses the Angular router.
 */
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

/**
 * A full snapshot of the page context. This is always computed on demand from the live
 * application state and the rendered DOM — it is never cached, so it cannot contain
 * information about UI that no longer exists.
 */
export interface ClrPageContext {
  /** The document title. */
  title: string;
  /** The current URL (browser location, or router URL when available). */
  url?: string;
  /** Route information, present when the application uses the Angular router. */
  route?: ClrRouteContext;
  /**
   * Application-provided contexts, registered through the `clrContext` directive or a
   * custom {@link ClrContextProvider}. These carry the semantic knowledge only the
   * application has, e.g. "this section manages firewall rules".
   */
  regions: ClrComponentContext[];
  /** Clarity components discovered in the rendered DOM, with their current state. */
  components: ClrComponentContext[];
  /** Page-level actions (buttons and links) currently available to the user. */
  actions?: ClrContextAction[];
  /** ISO timestamp of the moment the snapshot was taken. */
  collectedAt: string;
}

/**
 * Implemented by anything that wants to contribute context to snapshots — Clarity
 * components, application components or the `clrContext` directive.
 *
 * Providers are polled when a snapshot is requested (pull model). They must describe
 * their state as it is at that moment and should return `null` when they currently
 * have nothing useful to report, which keeps snapshots free of noise.
 */
export interface ClrContextProvider {
  getClrContext(): ClrComponentContext | null;
}
