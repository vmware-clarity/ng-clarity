/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HashLocationStrategy, isPlatformBrowser, LocationStrategy } from '@angular/common';
import { DOCUMENT, inject, Injectable, isDevMode, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import {
  CLR_CONTEXT_IGNORE_SELECTOR,
  CLR_CONTEXT_REDACT_SELECTOR,
  publishElementContext,
  usableSelectors,
} from '@clr/angular/utils';

import { ClrContextRegistryService } from './context-registry.service';
import { usableTimeout } from '../attempt';
import { charged } from '../budget';
import { annotationContext, viewAnnotationHosts } from '../dom/annotations';
import { ClrContextDomExtractor } from '../dom/dom-context-collector';
import { closestAcrossShadow } from '../dom/shadow';
import { collectContextTreeWithin, engineScope } from '../dom/walk';
import {
  ClrContextFrameHost,
  ClrContextFrameHostOptions,
  ClrContextFrameRequestOptions,
  clrRequestHostContext,
} from '../iframe/context-frame-bridge';
import {
  ClrApplicationContext,
  ClrComponentContext,
  ClrContextSnapshotOptions,
  ClrPageContext,
  ClrPublishedContext,
  ClrRouteContext,
} from '../interfaces/context.interface';
import { jsonSafe, REGION_DEPTH, ROUTE_DATA_DEPTH } from '../json-safe';
import { availableRoutes, routePatternFor } from '../routes';
import { CLR_PAGE_CONTEXT_SCHEMA_VERSION } from '../schema';
import {
  capSnapshotOptions,
  ClrContextPreset,
  presetOrOptions,
  ResolvedSnapshotOptions,
  resolveSnapshotOptions,
  withCallOptions,
} from '../snapshot-options';

/** How long a snapshot waits for each asynchronous provider by default. */
const DEFAULT_SOURCE_TIMEOUT_MS = 2000;

/** Shorter than a frame waits for its answer, so a slow provider is reported rather than the request lost. */
const FRAME_SOURCE_TIMEOUT_MS = 1000;

/** A route map cut to a handful of entries would misdescribe where the app can go. */
const MIN_ROUTE_LIMIT = 50;

/** How the application wants its context read; set once with `ClrContextService.configure`. */
export interface ClrContextConfig {
  /** The application every snapshot describes. Default: the page's host name. */
  application?: ClrApplicationContext;
  /**
   * Which views are read: `'all'` (the default) reads every view; `'enabled'` reads only views whose root has a
   * `[clrContext]`, and reports the others as `enabled: false`, with nothing about the page.
   */
  views?: 'all' | 'enabled';
  /** What every snapshot reads: a preset name, or snapshot options. Default: the whole page. */
  scope?: ClrContextPreset | ClrContextSnapshotOptions;
  /** List the router's routes in `availableRoutes`. Default `false`. */
  routes?: boolean;
  /** Describe markup with neither a role nor an accessible name, such as other libraries' components. */
  extractors?: ClrContextDomExtractor[];
  /** How long `snapshot()` waits for each provider that answers with a promise. Default `2000`. */
  timeoutMs?: number;
}

/** Reads the current page for an AI agent: route, rendered components and registered context. */
@Injectable({ providedIn: 'root' })
export class ClrContextService implements OnDestroy {
  private config: ClrContextConfig = {};
  private scope: ClrContextSnapshotOptions = {};
  private configured = false;
  private snapshotTaken = false;
  private readonly locationStrategy = inject(LocationStrategy, { optional: true });
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly contextRegistry = inject(ClrContextRegistryService);
  private readonly router = inject(Router, { optional: true });
  private readonly zone = inject(NgZone);
  private frameHost: ClrContextFrameHost | null = null;

  ngOnDestroy(): void {
    this.disableFrameBridge();
  }

  /**
   * Sets how the application wants its context read. Call it once, at startup: a snapshot taken before uses the
   * defaults, and a second call replaces the whole configuration.
   */
  configure(config: ClrContextConfig): void {
    if (isDevMode() && (this.configured || this.snapshotTaken)) {
      console.warn(
        this.configured
          ? 'ClrContextService.configure: called again; the new configuration replaces the previous one.'
          : 'ClrContextService.configure: called after a snapshot was taken; that snapshot used the defaults.'
      );
    }
    if (isDevMode() && config.views !== undefined && config.views !== 'all' && config.views !== 'enabled') {
      console.warn(
        `ClrContextService.configure: views "${config.views}" is neither 'all' nor 'enabled'; only enabled views are read.`
      );
    }
    this.config = { ...config };
    this.scope = presetOrOptions(config.scope);
    this.configured = true;
  }

  /**
   * Publishes what the DOM cannot show about `element`, such as a component's own host: `read` is called on every
   * snapshot and merged into the element's node. A `[clrContext]` on the element merges on top. Returns the teardown.
   */
  publish(element: Element, read: () => Partial<ClrPublishedContext> | null | undefined): () => void {
    return publishElementContext(element, () => read());
  }

  /** A fresh snapshot of the page, with `options` applied over the configured scope. */
  snapshot(options?: ClrContextSnapshotOptions): Promise<ClrPageContext> {
    return this.readAsync(options);
  }

  /** Answers context requests from embedded frames over `postMessage`; by default only same-origin frames. */
  enableFrameBridge(options?: ClrContextFrameHostOptions): void {
    const window = this.browserWindow();
    if (!window) {
      return;
    }
    // The application's options cap what the host allows, so a frame cannot undo them either.
    const ceiling = this.untrustedCeiling(options?.snapshot);
    // Built before the running bridge stops, so a refused configuration leaves current frames served.
    const frameHost = new ClrContextFrameHost(
      snapshotOptions => this.readAsync(capSnapshotOptions(snapshotOptions, ceiling), FRAME_SOURCE_TIMEOUT_MS),
      window,
      options,
      url => this.routePattern(url)
    );
    this.disableFrameBridge();
    this.frameHost = frameHost;
    // Every `message` on the page reaches the listener, and answering renders nothing.
    this.zone.runOutsideAngular(() => frameHost.start());
  }

  /** Stops answering embedded frames. */
  disableFrameBridge(): void {
    this.frameHost?.stop();
    this.frameHost = null;
  }

  /** Requests the hosting page's context from inside an iframe; `null` when there is none or it does not answer. */
  requestHostContext(options?: ClrContextFrameRequestOptions): Promise<ClrPageContext | null> {
    if (!this.browserWindow()) {
      return Promise.resolve(null);
    }
    return clrRequestHostContext(options);
  }

  /**
   * The application and view, with nothing about the page yet. The `[clrContext]` on the view root describes the
   * view; with `views: 'enabled'`, a view without one is reported as not enabled and nothing else is read.
   */
  private viewSnapshot(options: ResolvedSnapshotOptions): ClrPageContext {
    const route = this.routeContext();
    const snapshot: ClrPageContext = {
      schemaVersion: CLR_PAGE_CONTEXT_SCHEMA_VERSION,
      application: this.applicationContext(),
      enabled: true,
      title: '',
      regions: [],
      components: [],
      collectedAt: new Date().toISOString(),
    };
    const metadata = this.viewMetadata(options);
    // A disabled view says nothing about itself.
    if (!metadata && readsEnabledViewsOnly(this.config.views)) {
      snapshot.enabled = false;
      return snapshot;
    }
    if (metadata) {
      snapshot.metadata = metadata;
    }
    if (route) {
      snapshot.route = route;
    }
    return snapshot;
  }

  /**
   * What the annotations on the view's roots and their ancestors say, inner winning: their state, with `label`
   * when one is given. A copy, so a consumer cannot change the application's value, and a cycle cannot break it.
   */
  private viewMetadata(options: ResolvedSnapshotOptions): Record<string, unknown> | undefined {
    const hosts = this.viewAnnotationHosts(options);
    if (!hosts.length) {
      return undefined;
    }
    const metadata: Record<string, unknown> = {};
    for (const host of hosts) {
      const annotation = annotationContext(host);
      Object.assign(metadata, annotation?.label ? { label: annotation.label } : null, annotation?.state);
    }
    const safe = jsonSafe(metadata, REGION_DEPTH, true);
    return safe && typeof safe === 'object' && !Array.isArray(safe) ? (safe as Record<string, unknown>) : {};
  }

  private viewAnnotationHosts(options: ResolvedSnapshotOptions): Element[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }
    const roots = engineScope(this.document, options).roots ?? [this.document.body ?? this.document.documentElement];
    const excludeSelector = usableSelectors(this.document, options.excludeSelectors);
    // An annotation in a region kept from agents is kept with it.
    return viewAnnotationHosts(roots.filter(Boolean)).filter(
      host =>
        !closestAcrossShadow(host, `${CLR_CONTEXT_IGNORE_SELECTOR}, ${CLR_CONTEXT_REDACT_SELECTOR}`) &&
        !(excludeSelector && closestAcrossShadow(host, excludeSelector))
    );
  }

  private read(options: ClrContextSnapshotOptions | undefined): ClrPageContext {
    this.snapshotTaken = true;
    const resolved = resolveSnapshotOptions(withCallOptions(this.scope, options));
    const snapshot = this.viewSnapshot(resolved);
    if (!snapshot.enabled) {
      return snapshot;
    }
    const regions = this.contextRegistry.collect({ limits: resolved });
    return this.describePage(snapshot, resolved, regions);
  }

  /**
   * Like `read`, awaiting asynchronous providers for up to `timeoutMs` each. After a navigation, the new view's
   * providers are awaited once more; then it settles for a snapshot that reports them as loading.
   */
  private async readAsync(
    options: ClrContextSnapshotOptions | undefined,
    timeoutMs = this.config.timeoutMs,
    retries = 1
  ): Promise<ClrPageContext> {
    this.snapshotTaken = true;
    const resolved = resolveSnapshotOptions(withCallOptions(this.scope, options));
    const view = this.viewSnapshot(resolved);
    if (!view.enabled) {
      return view;
    }
    const address = this.address();
    const regions = await this.contextRegistry.collectAsync({
      timeoutMs: usableTimeout(timeoutMs, DEFAULT_SOURCE_TIMEOUT_MS),
      limits: resolved,
    });
    const snapshot = this.viewSnapshot(resolved);
    // The answers are the old view's when the address or the view's description changed meanwhile.
    if (
      this.address() !== address ||
      snapshot.enabled !== view.enabled ||
      JSON.stringify(snapshot.metadata) !== JSON.stringify(view.metadata)
    ) {
      return retries > 0 ? this.readAsync(options, timeoutMs, retries - 1) : this.read(options);
    }
    // The page is read once providers have answered, so a region redacted meanwhile is read as it is now.
    return this.describePage(snapshot, resolved, regions);
  }

  private describePage(
    snapshot: ClrPageContext,
    resolved: ResolvedSnapshotOptions,
    regions: ClrComponentContext[]
  ): ClrPageContext {
    snapshot.title = this.document.title;
    snapshot.url = this.currentUrl();
    setRegions(snapshot, regions, resolved);
    if (this.config.routes && this.router?.config.length) {
      const limit = Math.max(resolved.maxItemsPerCollection, MIN_ROUTE_LIMIT);
      snapshot.availableRoutes = availableRoutes(this.router.config, limit);
    }
    if (isPlatformBrowser(this.platformId)) {
      const tree = collectContextTreeWithin(this.document, resolved, this.config.extractors ?? []);
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

  private applicationContext(): ClrApplicationContext {
    const application = this.config.application;
    if (!application) {
      return { id: this.document.location?.hostname ?? '' };
    }
    const { id, version } = application;
    return version ? { id, version } : { id };
  }

  /** The most an untrusted caller may get: the host can narrow the application's options, never widen them. */
  private untrustedCeiling(hostCeiling?: ClrContextSnapshotOptions): ClrContextSnapshotOptions {
    return resolveSnapshotOptions(capSnapshotOptions(withCallOptions(this.scope, hostCeiling), this.scope));
  }

  private browserWindow(): Window | null {
    return isPlatformBrowser(this.platformId) ? this.document.defaultView : null;
  }

  /** Where the application is, as its router sees it. */
  private address(): string | undefined {
    return this.router?.url ?? this.currentUrl();
  }

  private currentUrl(): string | undefined {
    if (isPlatformBrowser(this.platformId) && this.document.location) {
      return this.document.location.href;
    }
    return this.router?.url;
  }

  private routePattern(url: URL): string | null {
    if (!this.router || !this.router.config.length) {
      return null;
    }
    if (this.locationStrategy instanceof HashLocationStrategy) {
      const page = this.document.location?.pathname;
      return page !== undefined && url.pathname === page && url.hash.startsWith('#/')
        ? routePatternFor(this.router.config, url.hash.slice(1))
        : null;
    }
    const base = this.basePath();
    return url.pathname.startsWith(base)
      ? routePatternFor(this.router.config, url.pathname.slice(base.length - 1))
      : null;
  }

  private basePath(): string {
    try {
      const href = this.locationStrategy?.getBaseHref() || new URL('.', this.document.baseURI).href;
      const path = new URL(href, this.document.baseURI).pathname;
      return path.endsWith('/') ? path : `${path}/`;
    } catch {
      return '/';
    }
  }

  private routeContext(): ClrRouteContext | undefined {
    // The router is root-provided even without routing; an empty config would only add a misleading `/`.
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
      } else if (route.routeConfig?.matcher) {
        // A custom matcher has no pattern; report its segments as `*`, never their values.
        pathSegments.push(...route.url.map(() => '*'));
      }
      Object.assign(params, route.params);
      // `route.data` on the snapshot also carries resolver results, which are application data.
      for (const [key, value] of Object.entries(route.routeConfig?.data ?? {})) {
        const serializable = jsonSafe(value, ROUTE_DATA_DEPTH);
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

/** Whether only enabled views are read; an unrecognised `views` value reads only those, failing closed. */
function readsEnabledViewsOnly(views: string | undefined): boolean {
  return views !== undefined && views !== 'all';
}

/** Regions are not walked, so they get a component budget of their own. */
function setRegions(snapshot: ClrPageContext, regions: ClrComponentContext[], options: ResolvedSnapshotOptions): void {
  const budget = { remaining: options.maxComponents, truncated: false };
  snapshot.regions = charged(regions, budget);
  if (budget.truncated) {
    snapshot.truncated = true;
  }
}
