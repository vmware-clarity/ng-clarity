/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HashLocationStrategy, isPlatformBrowser, LocationStrategy } from '@angular/common';
import { DOCUMENT, inject, Injectable, isDevMode, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { CLR_CONTEXT_IGNORE_SELECTOR, CLR_CONTEXT_REDACT_SELECTOR, usableSelectors } from '@clr/angular/utils';

import { ContextMetadataLoader } from './context-metadata-loader';
import { ClrContextRegistryService } from './context-registry.service';
import { attempt, usableTimeout } from '../attempt';
import { charged } from '../budget';
import {
  annotationContext,
  annotationFrom,
  CLR_CONTEXT_URL_ATTRIBUTE,
  isRecord,
  viewAnnotationHosts,
} from '../dom/annotations';
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
  ClrRouteContext,
} from '../interfaces/context.interface';
import { jsonSafe, REGION_DEPTH, ROUTE_DATA_DEPTH } from '../json-safe';
import { ContextRefRegistryService } from '../mutation/context-ref-registry.service';
import { CLR_MUTATION_POLICY } from '../mutation/mutation.interface';
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

/** The application's identity, and where its view id and metadata come from. */
export interface ClrContextApplicationOptions extends ClrApplicationContext {
  /** The current view's id; checked before the route's `data.viewId`. */
  viewId?: () => string | null | undefined;
  /** Metadata about the current view, as a small serializable object. */
  metadata?: () => Record<string, unknown> | null | undefined;
}

/** How one view is identified and described, without editing its HTML or code. */
export interface ClrContextViewConfig {
  /** The route pattern, as `route.path` reports it, e.g. `'hosts/:id'`. */
  route?: string;
  /** Matches while an element matching this selector is on the page. */
  selector?: string;
  /** The view's id, used when nothing on the page or the route names one. */
  viewId?: string;
  /** Metadata about the view; the page's own metadata wins. */
  metadata?: Record<string, unknown>;
  /** `false` keeps the view from being read; `true` reads it with `views: 'enabled'` even without metadata. */
  enabled?: boolean;
}

/** How the application wants its context read; set once with `ClrContextService.configure`. */
export interface ClrContextConfig {
  /** The application every snapshot describes. Default: the page's host name. */
  application?: ClrContextApplicationOptions;
  /**
   * Which views are read: `'all'` (the default) reads every view; `'enabled'` reads only views with metadata and
   * reports the others as `enabled: false`, with nothing about the page.
   */
  views?: 'all' | 'enabled';
  /**
   * Views described from outside the application, matched in order (the first match applies), or the URL of
   * a JSON file holding them as `{ "views": [...] }`.
   */
  viewConfig?: ClrContextViewConfig[] | string;
  /**
   * Origins other than the page's own that `data-clr-context-url` and a `viewConfig` URL may load from,
   * e.g. `['https://help.example.com']`.
   */
  metadataOrigins?: string[];
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
  // Refs are handed out only under a policy, so readers who never write pay nothing.
  private readonly mutationPolicy = inject(CLR_MUTATION_POLICY, { optional: true });
  private readonly refs = inject(ContextRefRegistryService);
  private readonly locationStrategy = inject(LocationStrategy, { optional: true });
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly contextRegistry = inject(ClrContextRegistryService);
  private readonly router = inject(Router, { optional: true });
  private readonly zone = inject(NgZone);
  private frameHost: ClrContextFrameHost | null = null;
  private readonly metadataLoader = new ContextMetadataLoader(this.document, () => this.config.metadataOrigins ?? []);

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

  /** A fresh snapshot of the page, with `options` applied over the configured scope. */
  snapshot(options?: ClrContextSnapshotOptions): Promise<ClrPageContext> {
    return this.readAsync(options);
  }

  /** @internal The scope snapshots are read in, with `options` over it; the mutation engine writes in the same one. */
  resolveScope(options?: ClrContextSnapshotOptions): ResolvedSnapshotOptions {
    return resolveSnapshotOptions(withCallOptions(this.scope, options));
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
      snapshotOptions => this.readAsync(capSnapshotOptions(snapshotOptions, ceiling), true, FRAME_SOURCE_TIMEOUT_MS),
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
   * The application and view, with nothing about the page yet. A view is not read when a configured view
   * disables it, while a `viewConfig` URL has not loaded, or, with `views: 'enabled'`, when nothing gives it
   * metadata. Once `settled`, a metadata URL that has not loaded is reported as unavailable.
   */
  private viewSnapshot(options: ResolvedSnapshotOptions, settled: boolean): ClrPageContext {
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
    const loads = this.metadataUrls(options).map(url => this.metadataLoader.read(url));
    if (loads.includes(undefined) || loads.includes(null)) {
      snapshot.metadataState = settled || loads.includes(null) ? 'unavailable' : 'loading';
    }
    const source = this.config.viewConfig;
    // A configuration that has not loaded may disable this view, so the view is not read until it has.
    if (typeof source === 'string' && !this.metadataLoader.read(source)) {
      snapshot.enabled = false;
      return snapshot;
    }
    const config = this.matchingView(route);
    const provided = attempt(() => this.config.application?.metadata?.(), undefined);
    const fromPage = this.pageMetadata(options);
    // A copy, so a consumer cannot change the configuration or the loaded metadata, and a cycle cannot break it.
    const viewMetadata = (page: Record<string, unknown>) =>
      recordOrEmpty(
        jsonSafe({ ...recordOrEmpty(config?.metadata), ...recordOrEmpty(provided), ...page }, REGION_DEPTH, true)
      );
    const metadata = viewMetadata(fromPage);
    const enabled =
      typeof config?.enabled === 'boolean'
        ? config.enabled
        : // An empty object from the application still enables the view.
          !readsEnabledViewsOnly(this.config.views) ||
          Object.keys(viewMetadata(fromPage)).length > 0 ||
          isRecord(provided);
    const viewId = [fromPage['viewId'], this.providedViewId(), this.routedViewId(), config?.viewId].find(
      id => typeof id === 'string' && id
    );
    if (viewId) {
      snapshot.viewId = viewId as string;
    }
    // A disabled view says which view it is, and nothing more.
    if (!enabled) {
      snapshot.enabled = false;
      return snapshot;
    }
    if (Object.keys(metadata).length || isRecord(provided)) {
      snapshot.metadata = metadata;
    }
    if (route) {
      snapshot.route = route;
    }
    return snapshot;
  }

  /**
   * The annotations on the view's roots and their ancestors, inner winning: their state is the view's metadata,
   * with `label` when one is given.
   */
  private pageMetadata(options: ResolvedSnapshotOptions): Record<string, unknown> {
    const metadata: Record<string, unknown> = {};
    for (const host of this.metadataHosts(options)) {
      const url = host.getAttribute(CLR_CONTEXT_URL_ATTRIBUTE);
      for (const annotation of [url ? annotationFrom(this.metadataLoader.read(url)) : null, annotationContext(host)]) {
        Object.assign(metadata, annotation?.label ? { label: annotation.label } : null, annotation?.state);
      }
    }
    return metadata;
  }

  private metadataHosts(options: ResolvedSnapshotOptions): Element[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }
    const roots = engineScope(this.document, options).roots ?? [this.document.body ?? this.document.documentElement];
    const excludeSelector = usableSelectors(this.document, options.excludeSelectors);
    // Metadata in a region kept from agents is kept with it.
    return viewAnnotationHosts(roots.filter(Boolean)).filter(
      host =>
        !closestAcrossShadow(host, `${CLR_CONTEXT_IGNORE_SELECTOR}, ${CLR_CONTEXT_REDACT_SELECTOR}`) &&
        !(excludeSelector && closestAcrossShadow(host, excludeSelector))
    );
  }

  /** The configuration and metadata URLs the view's description depends on. */
  private metadataUrls(options: ResolvedSnapshotOptions): string[] {
    const urls = this.metadataHosts(options)
      .map(host => host.getAttribute(CLR_CONTEXT_URL_ATTRIBUTE))
      .filter((url): url is string => !!url);
    const source = this.config.viewConfig;
    return typeof source === 'string' ? [source, ...urls] : urls;
  }

  /** The first configured view matching the route and the page. */
  private matchingView(route: ClrRouteContext | undefined): ClrContextViewConfig | undefined {
    const source = this.config.viewConfig;
    const loaded = typeof source === 'string' ? this.metadataLoader.read(source)?.['views'] : source;
    const views: unknown[] = Array.isArray(loaded) ? loaded : [];
    return views.find((view): view is ClrContextViewConfig => {
      if (!isRecord(view)) {
        return false;
      }
      const { route: pattern, selector } = view;
      return (
        (typeof pattern === 'string' || typeof selector === 'string') &&
        (typeof pattern !== 'string' || pattern.replace(/^\//, '') === route?.path) &&
        (typeof selector !== 'string' || attempt(() => !!this.document.querySelector(selector), false))
      );
    });
  }

  /** With `untrusted`, for a caller the application does not control, no refs are handed out. */
  private read(options: ClrContextSnapshotOptions | undefined, untrusted = false): ClrPageContext {
    this.snapshotTaken = true;
    const resolved = this.resolveScope(options);
    const snapshot = this.viewSnapshot(resolved, false);
    if (!snapshot.enabled) {
      return snapshot;
    }
    const regions = this.contextRegistry.collect({ limits: resolved });
    return this.describePage(snapshot, resolved, regions, untrusted);
  }

  /**
   * Like `read`, awaiting asynchronous providers and metadata URLs for up to `timeoutMs` each. After a navigation, the new view's
   * providers are awaited once more; then it settles for a snapshot that reports them as loading.
   */
  private async readAsync(
    options: ClrContextSnapshotOptions | undefined,
    untrusted = false,
    timeoutMs = this.config.timeoutMs,
    retries = 1
  ): Promise<ClrPageContext> {
    this.snapshotTaken = true;
    const resolved = this.resolveScope(options);
    const urls = this.metadataUrls(resolved);
    const waitMs = usableTimeout(timeoutMs, DEFAULT_SOURCE_TIMEOUT_MS);
    if (urls.length) {
      await this.metadataLoader.settle(urls, waitMs);
    }
    const view = this.viewSnapshot(resolved, true);
    if (!view.enabled) {
      return view;
    }
    const address = this.address();
    const regions = await this.contextRegistry.collectAsync({
      timeoutMs: waitMs,
      limits: resolved,
    });
    const snapshot = this.viewSnapshot(resolved, true);
    // The answers are the old view's: a view id is optional, so the address is compared too.
    if (snapshot.viewId !== view.viewId || snapshot.enabled !== view.enabled || this.address() !== address) {
      return retries > 0 ? this.readAsync(options, untrusted, timeoutMs, retries - 1) : this.read(options, untrusted);
    }
    // The page is read once providers have answered, so a region redacted meanwhile is read as it is now.
    return this.describePage(snapshot, resolved, regions, untrusted);
  }

  private describePage(
    snapshot: ClrPageContext,
    resolved: ResolvedSnapshotOptions,
    regions: ClrComponentContext[],
    untrusted: boolean
  ): ClrPageContext {
    snapshot.title = this.document.title;
    snapshot.url = this.currentUrl();
    setRegions(snapshot, regions, resolved);
    if (this.config.routes && this.router?.config.length) {
      const limit = Math.max(resolved.maxItemsPerCollection, MIN_ROUTE_LIMIT);
      snapshot.availableRoutes = availableRoutes(this.router.config, limit);
    }
    if (isPlatformBrowser(this.platformId)) {
      // Untrusted callers never get refs: they cannot write.
      const refs = !untrusted && this.mutationPolicy ? this.refs.begin() : null;
      const tree = collectContextTreeWithin(this.document, resolved, this.config.extractors ?? [], refs);
      refs?.commit(tree.components);
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

  private providedViewId(): unknown {
    return attempt(() => this.config.application?.viewId?.(), undefined);
  }

  /** The deepest route's own `data.viewId`: a child route does not inherit its parent's view. */
  private routedViewId(): unknown {
    let route = this.router?.config.length ? this.router.routerState.snapshot.root : null;
    while (route?.firstChild) {
      route = route.firstChild;
    }
    return route?.routeConfig?.data?.['viewId'];
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

function recordOrEmpty(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
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
