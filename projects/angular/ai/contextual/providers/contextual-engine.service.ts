/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import {
  DOCUMENT,
  inject,
  Injectable,
  Injector,
  isDevMode,
  OnDestroy,
  PLATFORM_ID,
  runInInjectionContext,
} from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { defer, map, Observable } from 'rxjs';

import { ClrContextRegistryService } from './context-registry.service';
import { attempt, usableTimeout } from '../attempt';
import { ContextTracker } from './context-tracker';
import { charged } from '../budget';
import { ClrContextChange, clrDiffContext } from '../diff';
import { ClrContextDomExtractor } from '../dom/dom-context-collector';
import { collectContextTreeWithin } from '../dom/walk';
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

/** How the application wants its context read; set once with `ClrContextService.configure`. */
export interface ClrContextConfig {
  /** The application every snapshot describes. Default: the page's host name. */
  application?: ClrContextApplicationOptions;
  /**
   * Which views are read: `'all'` (the default) reads every view; `'enabled'` reads only views with metadata and
   * reports the others as `enabled: false`, with nothing about the page.
   */
  views?: 'all' | 'enabled';
  /** What every snapshot reads: a preset name, or snapshot options. Default: the whole page. */
  scope?: ClrContextPreset | ClrContextSnapshotOptions;
  /** List the router's routes in `availableRoutes`. Default `false`. */
  routes?: boolean;
  /** Describe markup with neither a role nor an accessible name, such as other libraries' components. */
  extractors?: ClrContextDomExtractor[];
  /** How long `snapshot()` and `watch()` wait for each provider that answers with a promise. Default `2000`. */
  timeoutMs?: number;
  /** For `watch()`: milliseconds of quiet after the last change before the page is read again. Default `300`. */
  debounceMs?: number;
  /** For `watch()`: the longest a change waits to be read while the page never goes quiet. Default `2000`. */
  maxWaitMs?: number;
}

/** Reads the current page for an AI agent: route, rendered components and registered context. */
@Injectable({ providedIn: 'root' })
export class ClrContextService implements OnDestroy {
  private config: ClrContextConfig = {};
  private scope: ClrContextSnapshotOptions = {};
  private configured = false;
  private snapshotTaken = false;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly contextRegistry = inject(ClrContextRegistryService);
  private readonly router = inject(Router, { optional: true });
  private readonly injector = inject(Injector);
  private tracker: ContextTracker | null = null;

  ngOnDestroy(): void {
    this.tracker?.destroy();
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
    return this.readAsync(options, false);
  }

  /**
   * The page as it changes: a snapshot now, and another after each change to the DOM, a value, an annotation or
   * the route. The page is watched while anyone subscribes, and every subscriber shares one watcher, so `options`
   * given here apply to all of them.
   */
  watch(options?: ClrContextSnapshotOptions): Observable<ClrPageContext> {
    return defer(() => this.contextTracker().track(options && { ...this.pacing(), snapshot: options }));
  }

  /** What changed with each `watch()` snapshot: the first lists everything as added. */
  changes(options?: ClrContextSnapshotOptions): Observable<ClrContextChange> {
    return defer(() => {
      let previous: ClrPageContext | null = null;
      return this.watch(options).pipe(
        map(current => {
          const change = clrDiffContext(previous, current);
          previous = current;
          return change;
        })
      );
    });
  }

  private contextTracker(): ContextTracker {
    this.tracker ??= runInInjectionContext(
      this.injector,
      () =>
        new ContextTracker(
          options => this.read(options, false),
          options => this.readAsync(options, false),
          () => this.pacing()
        )
    );
    return this.tracker;
  }

  private pacing() {
    return { debounceMs: this.config.debounceMs, maxWaitMs: this.config.maxWaitMs };
  }

  /**
   * The application and view, with nothing about the page yet; with `views: 'enabled'`, a view
   * without metadata is reported as not enabled and nothing else is read.
   */
  private viewSnapshot(): ClrPageContext {
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
    const viewId = this.viewId();
    if (viewId) {
      snapshot.viewId = viewId;
    }
    const provided = attempt(() => this.config.application?.metadata?.(), undefined);
    // An empty object still enables the view.
    const metadata = provided === null || provided === undefined ? undefined : jsonSafe(provided, REGION_DEPTH, true);
    if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
      snapshot.metadata = metadata as Record<string, unknown>;
    } else if (readsEnabledViewsOnly(this.config.views)) {
      snapshot.enabled = false;
      return snapshot;
    }
    if (route) {
      snapshot.route = route;
    }
    return snapshot;
  }

  /** With `untrusted`, what application code published is cut to the state keys it marks public. */
  private read(options: ClrContextSnapshotOptions | undefined, untrusted: boolean): ClrPageContext {
    this.snapshotTaken = true;
    const snapshot = this.viewSnapshot();
    if (!snapshot.enabled) {
      return snapshot;
    }
    const resolved = resolveSnapshotOptions(withCallOptions(this.scope, options));
    const regions = this.contextRegistry.collect({ limits: resolved, untrusted });
    return this.describePage(snapshot, resolved, regions, untrusted);
  }

  /**
   * Like `read`, awaiting asynchronous providers for up to `timeoutMs` each. After a navigation, the new view's
   * providers are awaited once more; then it settles for a snapshot that reports them as loading.
   */
  private async readAsync(
    options: ClrContextSnapshotOptions | undefined,
    untrusted: boolean,
    retries = 1
  ): Promise<ClrPageContext> {
    this.snapshotTaken = true;
    const view = this.viewSnapshot();
    if (!view.enabled) {
      return view;
    }
    const address = this.address();
    const resolved = resolveSnapshotOptions(withCallOptions(this.scope, options));
    const regions = await this.contextRegistry.collectAsync({
      timeoutMs: usableTimeout(this.config.timeoutMs, DEFAULT_SOURCE_TIMEOUT_MS),
      limits: resolved,
      untrusted,
    });
    const snapshot = this.viewSnapshot();
    // The answers are the old view's: a view id is optional, so the address is compared too.
    if (snapshot.viewId !== view.viewId || snapshot.enabled !== view.enabled || this.address() !== address) {
      return retries > 0 ? this.readAsync(options, untrusted, retries - 1) : this.read(options, untrusted);
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
      const tree = collectContextTreeWithin(this.document, resolved, this.config.extractors ?? [], untrusted);
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

  /** The application's own view id first, then the deepest route's `data.viewId`. */
  private viewId(): string | undefined {
    const provided = attempt(() => this.config.application?.viewId?.(), undefined);
    if (typeof provided === 'string' && provided) {
      return provided;
    }
    // The deepest route's own data only: a child route does not inherit its parent's view.
    let route = this.router?.config.length ? this.router.routerState.snapshot.root : null;
    while (route?.firstChild) {
      route = route.firstChild;
    }
    const routed = route?.routeConfig?.data?.['viewId'];
    return typeof routed === 'string' && routed ? routed : undefined;
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
