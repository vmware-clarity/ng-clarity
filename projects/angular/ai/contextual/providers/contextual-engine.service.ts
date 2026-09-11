/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, inject, Inject, Injectable, OnDestroy, Optional, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Route, Router } from '@angular/router';

import { CLR_CONTEXT_OPTIONS } from './context-options';
import { ClrContextRegistryService } from './context-registry.service';
import { ClrContextDomExtractor, collectClrDomContextTree } from '../dom/dom-context-collector';
import {
  ClrContextFrameHost,
  ClrContextFrameHostOptions,
  ClrContextFrameRequestOptions,
  requestClrContextFromHost,
} from '../iframe/context-frame-bridge';
import {
  ClrAvailableRoute,
  ClrContextSnapshotOptions,
  ClrPageContext,
  ClrRouteContext,
} from '../interfaces/context.interface';
import { capSnapshotOptions } from '../snapshot-options';
import { sanitizeUntrustedSnapshotOptions, withoutFormValues } from '../untrusted-options';

const DEFAULT_GLOBAL_PROPERTY = 'clrContext';

/**
 * What a global accessor may be called: a plain identifier. Anything else — a name with
 * a dot, an empty string, the name of something `window` already has — would either
 * fail to be reachable as `window.<name>()` or overwrite something the page relies on.
 */
const GLOBAL_PROPERTY_PATTERN = /^[A-Za-z_$][\w$]*$/;

/** How the engine should behave when exposed on `window`. */
export interface ClrContextGlobalAccessOptions extends ClrContextSnapshotOptions {
  /**
   * Include what the user has typed. Off by default, because any script on the page can
   * call the global accessor — including one the application did not write.
   */
  shareFormValues?: boolean;
}

/**
 * Builds on-demand snapshots of everything useful an AI agent can know about the current
 * page: the active route, and the components rendered right now with their state, as a
 * tree in which every control sits where it is on the page — plus whatever semantic
 * context the application registered.
 *
 * Snapshots are always computed at call time from the live application — nothing is
 * cached — so they can never contain obsolete information about UI that no longer exists.
 *
 * The engine only ever reads. It describes the page and never changes it.
 *
 * The engine can also serve snapshots across an iframe boundary (see
 * {@link enableFrameBridge} and {@link requestHostContext}), so embedded UI such as a
 * chat surface built with a different UI library can receive the hosting page's context.
 */
@Injectable({ providedIn: 'root' })
export class ClrContextualEngineService implements OnDestroy {
  private readonly customExtractors: ClrContextDomExtractor[] = [];
  // What the application configured once for every snapshot; see provideClrContextOptions.
  private readonly applicationOptions = inject(CLR_CONTEXT_OPTIONS, { optional: true });
  private frameHost: ClrContextFrameHost | null = null;
  private globalProperty: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: unknown,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly contextRegistry: ClrContextRegistryService,
    @Optional() private readonly router: Router | null
  ) {}

  ngOnDestroy(): void {
    this.disableFrameBridge();
    this.disableGlobalAccess();
  }

  /**
   * Takes a fresh snapshot of the page context. Options given here are applied over the
   * application-wide ones (see `provideClrContextOptions`).
   */
  getSnapshot(options?: ClrContextSnapshotOptions): ClrPageContext {
    const effective = this.effectiveOptions(options);
    const snapshot: ClrPageContext = {
      title: this.document.title,
      url: this.currentUrl(),
      regions: this.contextRegistry.collect(),
      components: [],
      collectedAt: new Date().toISOString(),
    };
    const route = this.routeContext();
    if (route) {
      snapshot.route = route;
    }
    if (effective.includeRoutes && this.router?.config.length) {
      snapshot.availableRoutes = availableRoutes(
        this.router.config,
        Math.max(effective.maxItemsPerCollection ?? 25, 50)
      );
    }
    if (isPlatformBrowser(this.platformId) && effective.includeDomComponents !== false) {
      const tree = collectClrDomContextTree(this.document, effective, this.customExtractors);
      snapshot.components = tree.components;
      if (tree.truncated) {
        snapshot.truncated = true;
      }
      if (tree.focus) {
        snapshot.focus = tree.focus;
      }
    }
    return snapshot;
  }

  /**
   * Registers an additional DOM extractor, letting other UI libraries on the page teach
   * the engine about their own components. Returns a function that removes it again.
   */
  registerDomExtractor(extractor: ClrContextDomExtractor): () => void {
    if (!this.customExtractors.includes(extractor)) {
      this.customExtractors.push(extractor);
    }
    return () => {
      const index = this.customExtractors.indexOf(extractor);
      if (index > -1) {
        this.customExtractors.splice(index, 1);
      }
    };
  }

  /**
   * Exposes the engine on `window` (as `window.clrContext()` by default) so AI agents
   * driving the browser can query the page context without an application API.
   *
   * Anything running on the page can call this, including a third-party script, so the
   * caller is treated as untrusted: its options are reduced to budgets, the
   * application's own budgets are applied over the top, and what the user has typed is
   * withheld unless {@link ClrContextGlobalAccessOptions.shareFormValues} says otherwise.
   */
  enableGlobalAccess(
    propertyName: string = DEFAULT_GLOBAL_PROPERTY,
    hostOptions: ClrContextGlobalAccessOptions = {}
  ): void {
    if (!GLOBAL_PROPERTY_PATTERN.test(propertyName)) {
      throw new Error(`ClrContextualEngineService: "${propertyName}" is not a valid name for a global accessor.`);
    }
    const window = this.browserWindow();
    if (!window) {
      return;
    }
    const { shareFormValues, ...budgets } = hostOptions;
    this.disableGlobalAccess();
    const host = window as unknown as Record<string, unknown>;
    if (propertyName in host) {
      throw new Error(`ClrContextualEngineService: window.${propertyName} already exists and will not be replaced.`);
    }
    this.globalProperty = propertyName;
    host[propertyName] = (options?: unknown) => {
      // The caller may ask for less than the application allows, never for more.
      const snapshot = this.getSnapshot(capSnapshotOptions(sanitizeUntrustedSnapshotOptions(options), budgets));
      return shareFormValues ? snapshot : withoutFormValues(snapshot);
    };
  }

  disableGlobalAccess(): void {
    const window = this.browserWindow();
    if (window && this.globalProperty) {
      delete (window as unknown as Record<string, unknown>)[this.globalProperty];
    }
    this.globalProperty = null;
  }

  /**
   * Starts answering context requests from embedded frames, so UI hosted in an iframe
   * (a chat surface, an embedded tool) can pull this page's context through
   * `postMessage`. Each request is answered with a freshly computed snapshot.
   *
   * By default only frames from the page's own origin are served; pass
   * `allowedOrigins` to serve trusted cross-origin frames.
   */
  enableFrameBridge(options?: ClrContextFrameHostOptions): void {
    const window = this.browserWindow();
    if (!window) {
      return;
    }
    this.disableFrameBridge();
    this.frameHost = new ClrContextFrameHost(snapshotOptions => this.getSnapshot(snapshotOptions), window, options);
    this.frameHost.start();
  }

  disableFrameBridge(): void {
    this.frameHost?.stop();
    this.frameHost = null;
  }

  /**
   * Requests the context of the page hosting this application, for applications that
   * themselves run inside an iframe. Resolves with `null` when there is no hosting
   * page or it does not serve context.
   */
  requestHostContext(options?: ClrContextFrameRequestOptions): Promise<ClrPageContext | null> {
    if (!this.browserWindow()) {
      return Promise.resolve(null);
    }
    return requestClrContextFromHost(options);
  }

  /** The call's options over the application's, ignoring keys a caller left undefined. */
  private effectiveOptions(options?: ClrContextSnapshotOptions): ClrContextSnapshotOptions {
    const effective: ClrContextSnapshotOptions = { ...this.applicationOptions };
    for (const [key, value] of Object.entries(options ?? {})) {
      if (value !== undefined) {
        (effective as Record<string, unknown>)[key] = value;
      }
    }
    return effective;
  }

  private browserWindow(): Window | null {
    return isPlatformBrowser(this.platformId) ? this.document.defaultView : null;
  }

  private currentUrl(): string | undefined {
    if (isPlatformBrowser(this.platformId) && this.document.location) {
      return this.document.location.href;
    }
    return this.router?.url;
  }

  private routeContext(): ClrRouteContext | undefined {
    // The router is root-provided even in applications that never configure routing;
    // an unconfigured router would only contribute a misleading `/` route.
    if (!this.router || this.router.config.length === 0) {
      return undefined;
    }
    const pathSegments: string[] = [];
    const params: Record<string, string> = {};
    const data: Record<string, unknown> = {};
    let route: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;
    while (route) {
      if (route.routeConfig?.path) {
        pathSegments.push(route.routeConfig.path);
      }
      Object.assign(params, route.params);
      for (const [key, value] of Object.entries(route.data)) {
        const serializable = jsonSafe(value, 2);
        if (serializable !== undefined) {
          data[key] = serializable;
        }
      }
      route = route.firstChild;
    }
    const context: ClrRouteContext = { url: this.router.url, path: pathSegments.join('/') };
    if (Object.keys(params).length) {
      context.params = params;
    }
    const queryParams = this.router.routerState.snapshot.root.queryParams;
    if (Object.keys(queryParams).length) {
      context.queryParams = { ...queryParams };
    }
    if (Object.keys(data).length) {
      context.data = data;
    }
    return context;
  }
}

/**
 * The navigable routes in a router configuration, flattened to path patterns: children
 * under their parent, wildcards and redirects left out, lazily loaded children listed
 * only once loaded (the router keeps them where a walk cannot see them until then).
 */
function availableRoutes(config: Route[], limit: number): ClrAvailableRoute[] {
  const routes: ClrAvailableRoute[] = [];
  const visit = (entries: Route[], prefix: string) => {
    for (const entry of entries) {
      if (routes.length >= limit) {
        return;
      }
      const segment = entry.path ?? '';
      if (segment === '**' || entry.redirectTo !== undefined) {
        continue;
      }
      const path = [prefix, segment].filter(Boolean).join('/');
      if (entry.component || entry.loadComponent || (!entry.children && !entry.loadChildren)) {
        const route: ClrAvailableRoute = { path: path || '/' };
        const title = entry.title ?? (entry.data as Record<string, unknown> | undefined)?.['title'];
        if (typeof title === 'string' && title) {
          route.title = title;
        }
        if (entry.loadChildren) {
          route.lazy = true;
        }
        routes.push(route);
      } else if (entry.loadChildren) {
        routes.push({ path: path || '/', lazy: true });
      }
      if (entry.children) {
        visit(entry.children, path);
      }
    }
  };
  visit(config, '');
  return routes;
}

/**
 * Reduces a route `data` value to its JSON-serializable subset, dropping functions,
 * class instances and anything nested too deeply. Route data commonly mixes plain
 * configuration (useful to an agent) with resolvers and component references (useless
 * and potentially huge), and only the former belongs in a snapshot.
 */
function jsonSafe(value: unknown, depth: number): unknown {
  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  if (depth <= 0) {
    return undefined;
  }
  if (Array.isArray(value)) {
    const items = value.map(item => jsonSafe(item, depth - 1)).filter(item => item !== undefined);
    return items.length ? items : undefined;
  }
  if (typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const result: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      const serializable = jsonSafe(entry, depth - 1);
      if (serializable !== undefined) {
        result[key] = serializable;
      }
    }
    return Object.keys(result).length ? result : undefined;
  }
  return undefined;
}
