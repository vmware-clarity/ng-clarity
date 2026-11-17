/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HashLocationStrategy, isPlatformBrowser, LocationStrategy } from '@angular/common';
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
import { CLR_CONTEXT_REDACT_SELECTOR, usableSelectors } from '@clr/angular/utils';
import { defer, map, Observable } from 'rxjs';

import { ClrContextRegionFilter, ClrContextRegistryService } from './context-registry.service';
import { ContextTracker } from './context-tracker';
import { charged } from '../budget';
import { ClrContextChange, clrDiffContext } from '../diff';
import { ClrContextDomExtractor } from '../dom/dom-context-collector';
import { collectContextTreeWithin, engineScope, isHiddenFromEngine } from '../dom/walk';
import {
  ClrComponentContext,
  ClrContextSnapshotOptions,
  ClrPageContext,
  ClrRouteContext,
} from '../interfaces/context.interface';
import { jsonSafe, ROUTE_DATA_DEPTH } from '../json-safe';
import { availableRoutes, routePatternFor } from '../routes';
import {
  capSnapshotOptions,
  ClrContextPreset,
  presetOrOptions,
  ResolvedSnapshotOptions,
  resolveSnapshotOptions,
  withCallOptions,
} from '../snapshot-options';
import { sanitizeUntrustedSnapshotOptions, withoutFormValues, withoutUrlDetails } from '../untrusted-options';

const DEFAULT_GLOBAL_PROPERTY = 'clrContext';

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

/** How the application wants its context read; set once with `ClrContextService.configure`. */
export interface ClrContextConfig {
  /** What every snapshot reads: a preset name, or snapshot options. Default: the whole page. */
  scope?: ClrContextPreset | ClrContextSnapshotOptions;
  /** List the router's routes in `availableRoutes`. Default `false`. */
  routes?: boolean;
  /** Describe markup with neither a role nor an accessible name, such as other libraries' components. */
  extractors?: ClrContextDomExtractor[];
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
  private readonly locationStrategy = inject(LocationStrategy, { optional: true });
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly contextRegistry = inject(ClrContextRegistryService);
  private readonly router = inject(Router, { optional: true });
  private readonly injector = inject(Injector);
  private globalProperty: string | null = null;
  private tracker: ContextTracker | null = null;

  ngOnDestroy(): void {
    this.disableGlobalAccess();
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
    this.config = { ...config };
    this.scope = presetOrOptions(config.scope);
    this.configured = true;
  }

  /** A fresh snapshot of the page, with `options` applied over the configured scope. */
  snapshot(options?: ClrContextSnapshotOptions): Promise<ClrPageContext> {
    return Promise.resolve(this.read(options, false));
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

  /**
   * Exposes the engine on `window` (`window.clrContext()` by default) for agents driving the browser.
   * Any script on the page can call it, so form values and the full URL are withheld unless allowed.
   */
  enableGlobalAccess(
    propertyName: string = DEFAULT_GLOBAL_PROPERTY,
    hostOptions: ClrContextGlobalAccessOptions = {}
  ): void {
    if (!GLOBAL_PROPERTY_PATTERN.test(propertyName)) {
      throw new Error(`ClrContextService: "${propertyName}" is not a valid name for a global accessor.`);
    }
    const window = this.browserWindow();
    if (!window) {
      return;
    }
    const { shareFormValues, shareFullUrl, ...budgets } = hostOptions;
    const host = window as unknown as Record<string, unknown>;
    // A refused name leaves the existing accessor in place.
    if (propertyName in host && propertyName !== this.globalProperty) {
      throw new Error(`ClrContextService: window.${propertyName} already exists and will not be replaced.`);
    }
    this.disableGlobalAccess();
    this.globalProperty = propertyName;
    const ceiling = this.untrustedCeiling(budgets);
    const accessor = (options?: unknown) => {
      // The caller may ask for less than the application allows, never for more.
      const snapshot = this.read(capSnapshotOptions(sanitizeUntrustedSnapshotOptions(options), ceiling), true);
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

  private contextTracker(): ContextTracker {
    this.tracker ??= runInInjectionContext(
      this.injector,
      () =>
        new ContextTracker(
          options => this.read(options, false),
          () => this.pacing()
        )
    );
    return this.tracker;
  }

  private pacing() {
    return { debounceMs: this.config.debounceMs, maxWaitMs: this.config.maxWaitMs };
  }

  /** The route, with nothing about the page yet. */
  private emptySnapshot(): ClrPageContext {
    const snapshot: ClrPageContext = {
      title: '',
      regions: [],
      components: [],
      collectedAt: new Date().toISOString(),
    };
    const route = this.routeContext();
    if (route) {
      snapshot.route = route;
    }
    return snapshot;
  }

  /** With `untrusted`, what application code published is cut to the state keys it marks public. */
  private read(options: ClrContextSnapshotOptions | undefined, untrusted: boolean): ClrPageContext {
    this.snapshotTaken = true;
    const snapshot = this.emptySnapshot();
    const resolved = resolveSnapshotOptions(withCallOptions(this.scope, options));
    const regions = this.contextRegistry.collect({ filter: this.regionFilter(resolved), limits: resolved, untrusted });
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

  /** Annotations follow their element: left out where it would be, stateless inside a redacted region. */
  private regionFilter(options: ResolvedSnapshotOptions): ClrContextRegionFilter {
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
      if (scope.roots && !scope.roots.some(root => root.contains(element) || element.contains(root))) {
        return 'drop';
      }
      return element.closest(CLR_CONTEXT_REDACT_SELECTOR) ? 'redact' : 'keep';
    };
  }

  /** The most an untrusted caller may get: the host can narrow the application's options, never widen them. */
  private untrustedCeiling(hostCeiling?: ClrContextSnapshotOptions): ClrContextSnapshotOptions {
    return resolveSnapshotOptions(capSnapshotOptions(withCallOptions(this.scope, hostCeiling), this.scope));
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

/** Regions are not walked, so they get a component budget of their own. */
function setRegions(snapshot: ClrPageContext, regions: ClrComponentContext[], options: ResolvedSnapshotOptions): void {
  const budget = { remaining: options.maxComponents, truncated: false };
  snapshot.regions = charged(regions, budget);
  if (budget.truncated) {
    snapshot.truncated = true;
  }
}
