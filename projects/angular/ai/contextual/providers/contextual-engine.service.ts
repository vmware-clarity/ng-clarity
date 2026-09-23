/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, inject, Inject, Injectable, OnDestroy, Optional, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { CLR_CONTEXT_OPTIONS } from './context-options';
import { ClrContextRegistryService } from './context-registry.service';
import { ClrContextDomExtractor, collectClrDomContextTree } from '../dom/dom-context-collector';
import {
  ClrContextFrameHost,
  ClrContextFrameHostOptions,
  ClrContextFrameRequestOptions,
  requestClrContextFromHost,
} from '../iframe/context-frame-bridge';
import { ClrContextSnapshotOptions, ClrPageContext, ClrRouteContext } from '../interfaces/context.interface';
import { jsonSafe } from '../json-safe';
import { CLR_MUTATION_POLICY } from '../mutation/mutation.interface';
import { ClrContextRefRegistry } from '../mutation/ref-registry';
import { availableRoutes } from '../routes';
import { capSnapshotOptions, resolveSnapshotOptions } from '../snapshot-options';
import { sanitizeUntrustedSnapshotOptions, withoutFormValues } from '../untrusted-options';

const DEFAULT_GLOBAL_PROPERTY = 'clrContext';

/**
 * The fewest routes `availableRoutes` lists, whatever the collection budget: a route
 * map cut to a handful of entries would misdescribe where the application can go.
 */
const MIN_ROUTE_LIMIT = 50;

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
 * The engine only ever reads. It describes the page and never changes it; changing it
 * is the mutation engine's job (`ClrMutationEngineService`), which works from the refs
 * these snapshots carry once the application has provided a `ClrMutationPolicy`.
 *
 * The engine can also serve snapshots across an iframe boundary (see
 * {@link enableFrameBridge} and {@link requestHostContext}), so embedded UI such as a
 * chat surface built with a different UI library can receive the hosting page's context.
 */
@Injectable({ providedIn: 'root' })
export class ClrContextEngineService implements OnDestroy {
  private readonly customExtractors: ClrContextDomExtractor[] = [];
  // What the application configured once for every snapshot; see provideClrContextOptions.
  private readonly applicationOptions = inject(CLR_CONTEXT_OPTIONS, { optional: true });
  // Refs are handed out only while there is a policy to write under: readers who never
  // write pay nothing for them.
  private readonly mutationPolicy = inject(CLR_MUTATION_POLICY, { optional: true });
  private readonly refs = inject(ClrContextRefRegistry);
  private frameHost: ClrContextFrameHost | null = null;
  private globalProperty: string | null = null;
  private _latestSnapshot: ClrPageContext | null = null;
  private _latestSnapshotOptions: ClrContextSnapshotOptions | null = null;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: unknown,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly contextRegistry: ClrContextRegistryService,
    @Optional() private readonly router: Router | null
  ) {}

  /**
   * The last snapshot the application took (through {@link getSnapshot}; not one served
   * to a frame or through the global accessor), or `null` before the first. It is what
   * the mutation engine's refs refer to and what its report's changes are measured from.
   */
  get latestSnapshot(): ClrPageContext | null {
    return this._latestSnapshot;
  }

  /** The options {@link latestSnapshot} was taken with, so it can be retaken alike. */
  get latestSnapshotOptions(): ClrContextSnapshotOptions | null {
    return this._latestSnapshotOptions;
  }

  ngOnDestroy(): void {
    this.disableFrameBridge();
    this.disableGlobalAccess();
  }

  /**
   * Takes a fresh snapshot of the page context. Options given here are applied over the
   * application-wide ones (see `provideClrContextOptions`).
   *
   * While the application has provided a `ClrMutationPolicy`, every node the mutation
   * engine could write to carries a `ref`, and the snapshot becomes the one those refs
   * are valid against: a ref from an earlier snapshot that this one no longer lists is
   * refused from here on.
   */
  getSnapshot(options?: ClrContextSnapshotOptions): ClrPageContext {
    const snapshot = this.snapshot(options, !!this.mutationPolicy);
    this._latestSnapshot = snapshot;
    this._latestSnapshotOptions = options ? { ...options } : null;
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
      throw new Error(`ClrContextEngineService: "${propertyName}" is not a valid name for a global accessor.`);
    }
    const window = this.browserWindow();
    if (!window) {
      return;
    }
    const { shareFormValues, ...budgets } = hostOptions;
    const host = window as unknown as Record<string, unknown>;
    // Checked before anything is torn down, so a refused name leaves the existing
    // accessor in place; the engine's own accessor may be re-registered under its name.
    if (propertyName in host && propertyName !== this.globalProperty) {
      throw new Error(`ClrContextEngineService: window.${propertyName} already exists and will not be replaced.`);
    }
    this.disableGlobalAccess();
    this.globalProperty = propertyName;
    const ceiling = this.untrustedCeiling(budgets);
    host[propertyName] = (options?: unknown) => {
      // The caller may ask for less than the application allows, never for more.
      const snapshot = this.snapshot(capSnapshotOptions(sanitizeUntrustedSnapshotOptions(options), ceiling), false);
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
    // The host caps each frame's request against `options.snapshot`; the application's
    // own options are the ceiling above that, so a frame cannot undo them either.
    const ceiling = this.untrustedCeiling(options?.snapshot);
    this.frameHost = new ClrContextFrameHost(
      snapshotOptions => this.snapshot(capSnapshotOptions(snapshotOptions, ceiling), false),
      window,
      options
    );
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

  private snapshot(options: ClrContextSnapshotOptions | undefined, withRefs: boolean): ClrPageContext {
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
      // Bounded by the resolved budget, so an out-of-range request is clamped here too.
      const limit = Math.max(resolveSnapshotOptions(effective).maxItemsPerCollection, MIN_ROUTE_LIMIT);
      snapshot.availableRoutes = availableRoutes(this.router.config, limit);
    }
    if (isPlatformBrowser(this.platformId) && effective.includeDomComponents !== false) {
      const refs = withRefs ? this.refs.begin() : null;
      const tree = collectClrDomContextTree(this.document, effective, this.customExtractors, refs);
      refs?.commit();
      snapshot.components = tree.components;
      if (tree.truncated) {
        snapshot.truncated = true;
      }
      if (tree.focus) {
        snapshot.focus = tree.focus;
      }
    } else if (withRefs) {
      // Nothing was described, so nothing from before may be written to either.
      this.refs.clear();
    }
    return snapshot;
  }

  /**
   * What a caller the application does not control may at most be given: the host's
   * own ceiling for that caller, held to the application-wide options above it.
   */
  private untrustedCeiling(hostCeiling?: ClrContextSnapshotOptions): ClrContextSnapshotOptions {
    return capSnapshotOptions(hostCeiling, this.applicationOptions ?? undefined);
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
      // Only the route's static configuration: `route.data` on the activated snapshot
      // also carries what resolvers fetched — user records, entitlements, API payloads —
      // which is application data, not a description of the page.
      for (const [key, value] of Object.entries(route.routeConfig?.data ?? {})) {
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
