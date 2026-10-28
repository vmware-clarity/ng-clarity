/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HashLocationStrategy, isPlatformBrowser, LocationStrategy } from '@angular/common';
import { DOCUMENT, inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { CLR_CONTEXT_REDACT_SELECTOR, usableSelectors } from '@clr/angular/utils';

import { ClrContextMetadataLoader } from './context-metadata-loader.service';
import {
  CLR_CONTEXT_APPLICATION,
  CLR_CONTEXT_CONFIG,
  CLR_CONTEXT_OPTIONS,
  ClrContextViewConfig,
} from './context-options';
import { ClrContextRegionFilter, ClrContextRegistryService } from './context-registry.service';
import { attempt, usableTimeout } from '../attempt';
import {
  CLR_AI_METADATA_ATTRIBUTE,
  CLR_AI_METADATA_URL_ATTRIBUTE,
  isRecord,
  parseJsonObject,
  viewMetadataHosts,
} from '../dom/annotations';
import { charged } from '../budget';
import { ClrContextDomExtractor } from '../dom/dom-context-collector';
import { closestAcrossShadow, containsAcrossShadow } from '../dom/shadow';
import { collectContextTreeWithin, engineScope, isHiddenFromEngine } from '../dom/walk';
import {
  ClrApplicationContext,
  ClrComponentContext,
  ClrContextAsyncSnapshotOptions,
  ClrContextSnapshotOptions,
  ClrPageContext,
  ClrRouteContext,
} from '../interfaces/context.interface';
import { jsonSafe, REGION_DEPTH, ROUTE_DATA_DEPTH } from '../json-safe';
import { availableRoutes, routePatternFor } from '../routes';
import { CLR_PAGE_CONTEXT_SCHEMA_VERSION } from '../schema';
import { capSnapshotOptions, resolveSnapshotOptions, withCallOptions } from '../snapshot-options';
import { sanitizeUntrustedSnapshotOptions, withoutFormValues, withoutUrlDetails } from '../untrusted-options';

const DEFAULT_GLOBAL_PROPERTY = 'clrContext';

/** How long `getSnapshotAsync` waits for each asynchronous provider by default. */
const DEFAULT_SOURCE_TIMEOUT_MS = 2000;

/** A route map cut to a handful of entries would misdescribe where the app can go. */
const MIN_ROUTE_LIMIT = 50;

/** A plain identifier, so it is reachable as `window.<name>()`. */
const GLOBAL_PROPERTY_PATTERN = /^[A-Za-z_$][\w$]*$/;

/** How the engine should behave when exposed on `window`. */
export interface ClrContextGlobalAccessOptions extends ClrContextSnapshotOptions {
  /** Include what the user has typed. Off by default. */
  shareFormValues?: boolean;
  /** Include the full URL, route parameters and data, and the document title. Off by default. */
  shareFullUrl?: boolean;
}

/** Builds on-demand, read-only snapshots of the current page: route, rendered components and registered context. */
@Injectable({ providedIn: 'root' })
export class ClrContextEngineService implements OnDestroy {
  private readonly customExtractors: ClrContextDomExtractor[] = [];
  private readonly applicationOptions = inject(CLR_CONTEXT_OPTIONS, { optional: true });
  private readonly application = inject(CLR_CONTEXT_APPLICATION, { optional: true });
  private readonly config = inject(CLR_CONTEXT_CONFIG, { optional: true });
  private readonly metadataLoader = inject(ClrContextMetadataLoader);
  private readonly locationStrategy = inject(LocationStrategy, { optional: true });
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly contextRegistry = inject(ClrContextRegistryService);
  private readonly router = inject(Router, { optional: true });
  private globalProperty: string | null = null;

  ngOnDestroy(): void {
    this.disableGlobalAccess();
  }

  /** Takes a fresh snapshot, applying `options` over the application-wide ones; pending sources are reported as loading. */
  getSnapshot(options?: ClrContextSnapshotOptions): ClrPageContext {
    return this.snapshot(options, false);
  }

  /**
   * Like {@link getSnapshot}, awaiting asynchronous providers and metadata URLs for up to `timeoutMs` each
   * (2 seconds by default). When the view changes while they answer, the new view is snapshotted instead.
   */
  getSnapshotAsync(asyncOptions?: ClrContextAsyncSnapshotOptions): Promise<ClrPageContext> {
    return this.snapshotAsync(asyncOptions, false);
  }

  /** Registers a DOM extractor for other libraries' components. Returns a function that removes it. */
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
   * Exposes the engine on `window` (`window.clrContext()` by default) for agents driving the browser.
   * Any script on the page can call it, so form values and the full URL are withheld unless allowed.
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
    const { shareFormValues, shareFullUrl, ...budgets } = hostOptions;
    const host = window as unknown as Record<string, unknown>;
    // A refused name leaves the existing accessor in place.
    if (propertyName in host && propertyName !== this.globalProperty) {
      throw new Error(`ClrContextEngineService: window.${propertyName} already exists and will not be replaced.`);
    }
    this.disableGlobalAccess();
    this.globalProperty = propertyName;
    const ceiling = this.untrustedCeiling(budgets);
    const accessor = (options?: unknown) => {
      // The caller may ask for less than the application allows, never for more.
      const snapshot = this.snapshot(capSnapshotOptions(sanitizeUntrustedSnapshotOptions(options), ceiling), true);
      const shared = shareFormValues ? snapshot : withoutFormValues(snapshot);
      return shareFullUrl ? shared : withoutUrlDetails(shared, url => this.routePattern(url), this.document.baseURI);
    };
    // Read-only so assignment cannot replace it; configurable so `disableGlobalAccess` can delete it.
    Object.defineProperty(host, propertyName, {
      value: accessor,
      writable: false,
      enumerable: true,
      configurable: true,
    });
  }

  /** Removes the accessor added by `enableGlobalAccess`. */
  disableGlobalAccess(): void {
    const window = this.browserWindow();
    if (window && this.globalProperty) {
      delete (window as unknown as Record<string, unknown>)[this.globalProperty];
    }
    this.globalProperty = null;
  }

  /**
   * The application and view, with nothing about the page yet. A view is not read when its
   * configuration disables it, or, with `views: 'enabled'`, when nothing gives it metadata.
   * Once `settled`, a metadata URL that has not loaded is reported as unavailable.
   */
  private viewSnapshot(options: Required<ClrContextSnapshotOptions>, settled: boolean): ClrPageContext {
    const route = this.routeContext();
    const snapshot: ClrPageContext = {
      schemaVersion: CLR_PAGE_CONTEXT_SCHEMA_VERSION,
      application: this.applicationContext(),
      title: '',
      regions: [],
      components: [],
      collectedAt: new Date().toISOString(),
    };
    const config = this.viewConfig(route);
    const provided = attempt(() => this.application?.metadata?.(), undefined);
    const fromPage = this.pageMetadata(options);
    const fromApplication = isRecord(provided) ? jsonSafe(provided, REGION_DEPTH, true) : undefined;
    const metadata = { ...recordOrEmpty(config?.metadata), ...recordOrEmpty(fromApplication), ...fromPage };
    const viewId = [fromPage['viewId'], this.providedViewId(), this.routedViewId(), config?.viewId].find(
      id => typeof id === 'string' && id
    );
    if (viewId) {
      snapshot.viewId = viewId as string;
    }
    // An empty object from the application still enables the view.
    if (Object.keys(metadata).length || isRecord(fromApplication)) {
      snapshot.metadata = metadata;
    }
    const loads = this.metadataUrls(options).map(url => this.metadataLoader.read(url));
    if (loads.includes(undefined) || loads.includes(null)) {
      snapshot.metadataState = settled || loads.includes(null) ? 'unavailable' : 'loading';
    }
    const enabled =
      typeof config?.enabled === 'boolean'
        ? config.enabled
        : !readsEnabledViewsOnly(this.application?.views) || snapshot.metadata !== undefined;
    if (!enabled) {
      snapshot.enabled = false;
      return snapshot;
    }
    if (route) {
      snapshot.route = route;
    }
    return snapshot;
  }

  /** Metadata from `data-ai-metadata` and `data-ai-metadata-url` on the view's roots and their ancestors, inner winning. */
  private pageMetadata(options: Required<ClrContextSnapshotOptions>): Record<string, unknown> {
    const metadata: Record<string, unknown> = {};
    for (const host of this.metadataHosts(options)) {
      const url = host.getAttribute(CLR_AI_METADATA_URL_ATTRIBUTE);
      const inline = parseJsonObject(host.getAttribute(CLR_AI_METADATA_ATTRIBUTE), CLR_AI_METADATA_ATTRIBUTE);
      Object.assign(metadata, url ? this.metadataLoader.read(url) : null, inline);
    }
    return metadata;
  }

  private metadataHosts(options: Required<ClrContextSnapshotOptions>): Element[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }
    const roots = engineScope(this.document, options).roots ?? [this.document.body ?? this.document.documentElement];
    return viewMetadataHosts(roots.filter(Boolean));
  }

  /** The configuration and metadata URLs the view's description depends on. */
  private metadataUrls(options: Required<ClrContextSnapshotOptions>): string[] {
    const urls = this.metadataHosts(options)
      .map(host => host.getAttribute(CLR_AI_METADATA_URL_ATTRIBUTE))
      .filter((url): url is string => !!url);
    return typeof this.config === 'string' ? [this.config, ...urls] : urls;
  }

  /** The first configured view matching the route and the page. */
  private viewConfig(route: ClrRouteContext | undefined): ClrContextViewConfig | undefined {
    const config = typeof this.config === 'string' ? this.metadataLoader.read(this.config) : this.config;
    const views: unknown[] = Array.isArray(config?.['views']) ? config['views'] : [];
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

  /** With `untrusted`, what application code published is cut to the state keys it marks public. */
  private snapshot(options: ClrContextSnapshotOptions | undefined, untrusted: boolean): ClrPageContext {
    const resolved = resolveSnapshotOptions(withCallOptions(this.applicationOptions, options));
    const snapshot = this.viewSnapshot(resolved, false);
    if (snapshot.enabled === false) {
      return snapshot;
    }
    const regions = this.contextRegistry.collect({ filter: this.regionFilter(resolved), limits: resolved, untrusted });
    return this.describePage(snapshot, resolved, regions, untrusted);
  }

  private async snapshotAsync(
    asyncOptions: ClrContextAsyncSnapshotOptions | undefined,
    untrusted: boolean
  ): Promise<ClrPageContext> {
    const { timeoutMs, ...options } = asyncOptions ?? {};
    const resolved = resolveSnapshotOptions(withCallOptions(this.applicationOptions, options));
    const urls = this.metadataUrls(resolved);
    const waitMs = usableTimeout(timeoutMs, DEFAULT_SOURCE_TIMEOUT_MS);
    if (urls.length) {
      await this.metadataLoader.settle(urls, waitMs);
    }
    const snapshot = this.viewSnapshot(resolved, true);
    if (snapshot.enabled === false) {
      return snapshot;
    }
    // Started first, so providers work while the page is walked.
    const regions = this.contextRegistry.collectAsync({
      filter: this.regionFilter(resolved),
      timeoutMs: waitMs,
      limits: resolved,
      untrusted,
    });
    this.describePage(snapshot, resolved, [], untrusted);
    setRegions(snapshot, await regions, resolved);
    const now = this.viewSnapshot(resolved, true);
    return now.viewId === snapshot.viewId && now.enabled === snapshot.enabled
      ? snapshot
      : this.snapshot(options, untrusted);
  }

  private describePage(
    snapshot: ClrPageContext,
    resolved: Required<ClrContextSnapshotOptions>,
    regions: ClrComponentContext[],
    untrusted: boolean
  ): ClrPageContext {
    snapshot.title = this.document.title;
    snapshot.url = this.currentUrl();
    setRegions(snapshot, regions, resolved);
    if (resolved.includeRoutes && this.router?.config.length) {
      const limit = Math.max(resolved.maxItemsPerCollection, MIN_ROUTE_LIMIT);
      snapshot.availableRoutes = availableRoutes(this.router.config, limit);
    }
    if (isPlatformBrowser(this.platformId) && resolved.includeDomComponents) {
      const tree = collectContextTreeWithin(this.document, resolved, this.customExtractors, untrusted);
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
    if (!this.application) {
      return { id: this.document.location?.hostname ?? '' };
    }
    const { id, version } = this.application;
    return version ? { id, version } : { id };
  }

  private providedViewId(): unknown {
    return attempt(() => this.application?.viewId?.(), undefined);
  }

  /** The deepest route's own `data.viewId`: a child route does not inherit its parent's view. */
  private routedViewId(): unknown {
    let route = this.router?.config.length ? this.router.routerState.snapshot.root : null;
    while (route?.firstChild) {
      route = route.firstChild;
    }
    return route?.routeConfig?.data?.['viewId'];
  }

  /** Annotations follow their element: left out where it would be, stateless inside a redacted region. */
  private regionFilter(options: Required<ClrContextSnapshotOptions>): ClrContextRegionFilter {
    if (!isPlatformBrowser(this.platformId)) {
      return () => 'keep';
    }
    const scope = engineScope(this.document, options);
    const excludeSelector = usableSelectors(this.document, options.excludeSelectors);
    return element => {
      if (!element) {
        return 'keep';
      }
      if (isHiddenFromEngine(element, excludeSelector)) {
        return 'drop';
      }
      if (
        scope.roots &&
        !scope.roots.some(root => containsAcrossShadow(root, element) || containsAcrossShadow(element, root))
      ) {
        return 'drop';
      }
      return closestAcrossShadow(element, CLR_CONTEXT_REDACT_SELECTOR) ? 'redact' : 'keep';
    };
  }

  /** The most an untrusted caller may get: the host can narrow the application's options, never widen them. */
  private untrustedCeiling(hostCeiling?: ClrContextSnapshotOptions): ClrContextSnapshotOptions {
    const application = this.applicationOptions ?? undefined;
    return resolveSnapshotOptions(capSnapshotOptions(withCallOptions(application, hostCeiling), application));
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
function setRegions(
  snapshot: ClrPageContext,
  regions: ClrComponentContext[],
  options: Required<ClrContextSnapshotOptions>
): void {
  const budget = { remaining: options.maxComponents, truncated: false };
  snapshot.regions = charged(regions, budget);
  if (budget.truncated) {
    snapshot.truncated = true;
  }
}
