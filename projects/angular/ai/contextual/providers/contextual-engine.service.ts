/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, inject, Injectable, isDevMode, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { CLR_CONTEXT_IGNORE_SELECTOR, CLR_CONTEXT_REDACT_SELECTOR, usableSelectors } from '@clr/angular/utils';

import { ContextMetadataLoader } from './context-metadata-loader';
import { ClrContextRegistryService } from './context-registry.service';
import { attempt, usableTimeout } from '../attempt';
import { charged } from '../budget';
import { annotationContext, isRecord, viewAnnotationHosts } from '../dom/annotations';
import { ClrContextDomExtractor } from '../dom/dom-context-collector';
import { closestAcrossShadow } from '../dom/shadow';
import { collectContextTreeWithin, engineScope } from '../dom/walk';
import {
  ClrApplicationContext,
  ClrComponentContext,
  ClrContextSnapshotOptions,
  ClrPageContext,
  ClrRouteContext,
} from '../interfaces/context.interface';
import { jsonSafe, REGION_DEPTH, ROUTE_DATA_DEPTH } from '../json-safe';
import { availableRoutes } from '../routes';
import { CLR_PAGE_CONTEXT_SCHEMA_VERSION } from '../schema';
import {
  ClrContextPreset,
  presetOrOptions,
  ResolvedSnapshotOptions,
  resolveSnapshotOptions,
  withCallOptions,
} from '../snapshot-options';

/** How long a snapshot waits for each asynchronous provider by default. */
const DEFAULT_SOURCE_TIMEOUT_MS = 2000;

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
   * Origins other than the page's own that a `viewConfig` URL may load from,
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
export class ClrContextService {
  private config: ClrContextConfig = {};
  private scope: ClrContextSnapshotOptions = {};
  private configured = false;
  private snapshotTaken = false;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly contextRegistry = inject(ClrContextRegistryService);
  private readonly router = inject(Router, { optional: true });
  private readonly metadataLoader = new ContextMetadataLoader(this.document, () => this.config.metadataOrigins ?? []);

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

  /**
   * The application and view, with nothing about the page yet. A view is not read when a configured view
   * disables it, while a `viewConfig` URL has not loaded, or, with `views: 'enabled'`, when nothing gives it
   * metadata. Once `settled`, a `viewConfig` URL that has not loaded is reported as unavailable.
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
    const loads = this.metadataUrls().map(url => this.metadataLoader.read(url));
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
      const annotation = annotationContext(host);
      Object.assign(metadata, annotation?.label ? { label: annotation.label } : null, annotation?.state);
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

  /** The configuration URL the view's description depends on. */
  private metadataUrls(): string[] {
    const source = this.config.viewConfig;
    return typeof source === 'string' ? [source] : [];
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

  private read(options: ClrContextSnapshotOptions | undefined): ClrPageContext {
    this.snapshotTaken = true;
    const resolved = resolveSnapshotOptions(withCallOptions(this.scope, options));
    const snapshot = this.viewSnapshot(resolved, false);
    if (!snapshot.enabled) {
      return snapshot;
    }
    const regions = this.contextRegistry.collect({ limits: resolved });
    return this.describePage(snapshot, resolved, regions);
  }

  /**
   * Like `read`, awaiting asynchronous providers and the `viewConfig` URL for up to `timeoutMs` each. After a navigation, the new view's
   * providers are awaited once more; then it settles for a snapshot that reports them as loading.
   */
  private async readAsync(options: ClrContextSnapshotOptions | undefined, retries = 1): Promise<ClrPageContext> {
    this.snapshotTaken = true;
    const resolved = resolveSnapshotOptions(withCallOptions(this.scope, options));
    const urls = this.metadataUrls();
    const waitMs = usableTimeout(this.config.timeoutMs, DEFAULT_SOURCE_TIMEOUT_MS);
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
      return retries > 0 ? this.readAsync(options, retries - 1) : this.read(options);
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
