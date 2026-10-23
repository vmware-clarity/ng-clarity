/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HashLocationStrategy, isPlatformBrowser, LocationStrategy } from '@angular/common';
import { DOCUMENT, inject, Inject, Injectable, OnDestroy, Optional, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { CLR_CONTEXT_REDACT_SELECTOR, usableSelectors } from '@clr/angular/utils';

import { CLR_CONTEXT_OPTIONS } from './context-options';
import { ClrContextRegionFilter, ClrContextRegistryService } from './context-registry.service';
import { ClrContextDomExtractor } from '../dom/dom-context-collector';
import { collectContextTreeWithin, engineScope, isHiddenFromEngine } from '../dom/walk';
import { ClrContextSnapshotOptions, ClrPageContext, ClrRouteContext } from '../interfaces/context.interface';
import { jsonSafe, ROUTE_DATA_DEPTH } from '../json-safe';
import { availableRoutes, routePatternFor } from '../routes';
import { capSnapshotOptions, resolveSnapshotOptions, withCallOptions } from '../snapshot-options';
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

/** Builds on-demand, read-only snapshots of the current page: route, rendered components and registered context. */
@Injectable({ providedIn: 'root' })
export class ClrContextEngineService implements OnDestroy {
  private readonly customExtractors: ClrContextDomExtractor[] = [];
  private readonly applicationOptions = inject(CLR_CONTEXT_OPTIONS, { optional: true });
  private readonly locationStrategy = inject(LocationStrategy, { optional: true });
  private globalProperty: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: unknown,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly contextRegistry: ClrContextRegistryService,
    @Optional() private readonly router: Router | null
  ) {}

  ngOnDestroy(): void {
    this.disableGlobalAccess();
  }

  /** Takes a fresh snapshot, applying `options` over the application-wide ones. */
  getSnapshot(options?: ClrContextSnapshotOptions): ClrPageContext {
    const resolved = resolveSnapshotOptions(withCallOptions(this.applicationOptions, options));
    const snapshot: ClrPageContext = {
      title: this.document.title,
      url: this.currentUrl(),
      regions: this.contextRegistry.collect(this.regionFilter(resolved)),
      components: [],
      collectedAt: new Date().toISOString(),
    };
    const route = this.routeContext();
    if (route) {
      snapshot.route = route;
    }
    if (resolved.includeRoutes && this.router?.config.length) {
      const limit = Math.max(resolved.maxItemsPerCollection, MIN_ROUTE_LIMIT);
      snapshot.availableRoutes = availableRoutes(this.router.config, limit);
    }
    if (isPlatformBrowser(this.platformId) && resolved.includeDomComponents) {
      const tree = collectContextTreeWithin(this.document, resolved, this.customExtractors);
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
      const snapshot = this.getSnapshot(capSnapshotOptions(sanitizeUntrustedSnapshotOptions(options), ceiling));
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
      if (scope.roots && !scope.roots.some(root => root.contains(element) || element.contains(root))) {
        return 'drop';
      }
      return element.closest(CLR_CONTEXT_REDACT_SELECTOR) ? 'redact' : 'keep';
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
