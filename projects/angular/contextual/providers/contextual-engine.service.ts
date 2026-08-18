/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, Inject, Injectable, OnDestroy, Optional, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { ClrContextRegistryService } from './context-registry.service';
import { ClrContextDomExtractor, collectClrDomActions, collectClrDomContexts } from '../dom/dom-context-collector';
import {
  ClrContextFrameHost,
  ClrContextFrameHostOptions,
  ClrContextFrameRequestOptions,
  requestClrContextFromHost,
} from '../iframe/context-frame-bridge';
import { ClrContextSnapshotOptions, ClrPageContext, ClrRouteContext } from '../interfaces/context.interface';

const DEFAULT_GLOBAL_PROPERTY = 'clrContext';

/**
 * Builds on-demand snapshots of everything useful an AI agent can know about the current
 * page: the active route, the components rendered right now and their state, the actions
 * currently available, and whatever semantic context the application registered.
 *
 * Snapshots are always computed at call time from the live application — nothing is
 * cached — so they can never contain obsolete information about UI that no longer exists.
 *
 * The engine can also serve snapshots across an iframe boundary (see
 * {@link enableFrameBridge} and {@link requestHostContext}), so embedded UI such as a
 * chat surface built with a different UI library can receive the hosting page's context.
 */
@Injectable({ providedIn: 'root' })
export class ClrContextualEngineService implements OnDestroy {
  private readonly customExtractors: ClrContextDomExtractor[] = [];
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
   * Takes a fresh snapshot of the page context.
   */
  getSnapshot(options?: ClrContextSnapshotOptions): ClrPageContext {
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
    if (isPlatformBrowser(this.platformId)) {
      if (options?.includeDomComponents !== false) {
        snapshot.components = collectClrDomContexts(this.document, options, this.customExtractors);
      }
      if (options?.includeActions !== false) {
        const actions = collectClrDomActions(this.document, options);
        if (actions.length) {
          snapshot.actions = actions;
        }
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
   */
  enableGlobalAccess(propertyName: string = DEFAULT_GLOBAL_PROPERTY): void {
    const window = this.browserWindow();
    if (!window) {
      return;
    }
    this.disableGlobalAccess();
    this.globalProperty = propertyName;
    (window as unknown as Record<string, unknown>)[propertyName] = (options?: ClrContextSnapshotOptions) =>
      this.getSnapshot(options);
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
