/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HashLocationStrategy, isPlatformBrowser, LocationStrategy } from '@angular/common';
import { DOCUMENT, inject, Inject, Injectable, NgZone, OnDestroy, Optional, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { CLR_CONTEXT_REDACT_SELECTOR, clrUsableSelectors } from '@clr/angular/utils';

import { CLR_CONTEXT_OPTIONS } from './context-options';
import { ClrContextRegionFilter, ClrContextRegistryService } from './context-registry.service';
import { ClrContextDomExtractor } from '../dom/dom-context-collector';
import { collectContextTreeWithin, engineScope, isHiddenFromEngine } from '../dom/walk';
import {
  ClrContextFrameHost,
  ClrContextFrameHostOptions,
  ClrContextFrameRequestOptions,
  clrRequestHostContext,
} from '../iframe/context-frame-bridge';
import { ClrContextSnapshotOptions, ClrPageContext, ClrRouteContext } from '../interfaces/context.interface';
import { jsonSafe, ROUTE_DATA_DEPTH } from '../json-safe';
import { availableRoutes, routePatternFor } from '../routes';
import { capSnapshotOptions, resolveSnapshotOptions, withCallOptions } from '../snapshot-options';
import { sanitizeUntrustedSnapshotOptions, withoutFormValues, withoutUrlDetails } from '../untrusted-options';

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
  /**
   * Include the full URL — path, query string and fragment — the route's parameters,
   * query parameters and data, and the document title. Off by default, when a caller
   * learns only the route's pattern (`reset/:token`) and an empty title: addresses and
   * titles routinely carry identifiers and occasionally credentials, and any script on
   * the page can call the accessor.
   */
  shareFullUrl?: boolean;
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
export class ClrContextEngineService implements OnDestroy {
  private readonly customExtractors: ClrContextDomExtractor[] = [];
  // What the application configured once for every snapshot; see provideClrContextOptions.
  private readonly applicationOptions = inject(CLR_CONTEXT_OPTIONS, { optional: true });
  /** How the router maps addresses to routes; there is none without a router. */
  private readonly locationStrategy = inject(LocationStrategy, { optional: true });
  private readonly zone = inject(NgZone);
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
    return this.snapshot(options);
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
   * caller is treated as untrusted: its options are reduced to budgets and held to what
   * the host and the application allow — the defaults, where neither says — and what the
   * user has typed and the page's full address are withheld unless
   * {@link ClrContextGlobalAccessOptions} says otherwise.
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
    // Checked before anything is torn down, so a refused name leaves the existing
    // accessor in place; the engine's own accessor may be re-registered under its name.
    if (propertyName in host && propertyName !== this.globalProperty) {
      throw new Error(`ClrContextEngineService: window.${propertyName} already exists and will not be replaced.`);
    }
    this.disableGlobalAccess();
    this.globalProperty = propertyName;
    // An exclusion list in the ceiling that is not a list is reported as the ceiling is
    // laid over the application's options.
    const ceiling = this.untrustedCeiling(budgets);
    host[propertyName] = (options?: unknown) => {
      // The caller may ask for less than the application allows, never for more.
      const snapshot = this.snapshot(capSnapshotOptions(sanitizeUntrustedSnapshotOptions(options), ceiling));
      const shared = shareFormValues ? snapshot : withoutFormValues(snapshot);
      return shareFullUrl ? shared : withoutUrlDetails(shared, url => this.routePattern(url), this.document.baseURI);
    };
  }

  /** Removes the global accessor, if this engine installed it. */
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
    // The host caps each frame's request against `options.snapshot`; the application's
    // own options are the ceiling above that, so a frame cannot undo them either.
    const ceiling = this.untrustedCeiling(options?.snapshot);
    // Built before the running bridge is stopped: the constructor refuses a configuration
    // that is not usable, and a refused one should leave the frames already served as
    // they were rather than silently cut off.
    const frameHost = new ClrContextFrameHost(
      snapshotOptions => this.snapshot(capSnapshotOptions(snapshotOptions, ceiling)),
      window,
      options,
      url => this.routePattern(url)
    );
    this.disableFrameBridge();
    this.frameHost = frameHost;
    // Outside the zone: every `message` on the page reaches the listener, and answering
    // one changes nothing the application renders, so none should check the application.
    this.zone.runOutsideAngular(() => frameHost.start());
  }

  /** Stops answering embedded frames. */
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
    return clrRequestHostContext(options);
  }

  private snapshot(options: ClrContextSnapshotOptions | undefined): ClrPageContext {
    const effective = this.effectiveOptions(options);
    const resolved = resolveSnapshotOptions(effective);
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
      // Bounded by the resolved budget, so an out-of-range request is clamped here too.
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

  /**
   * Which annotations a snapshot with these options reports, and how. An annotation sits
   * on an element and follows the element's fate: left out when the walk would leave the
   * element out — hidden, ignored, excluded, outside the root or the open modal — and
   * reported without its state inside a region marked `data-clr-context-redact`.
   * Annotations that did not say where they sit are always reported.
   */
  private regionFilter(options: Required<ClrContextSnapshotOptions>): ClrContextRegionFilter {
    if (!isPlatformBrowser(this.platformId)) {
      return () => 'keep';
    }
    const scope = engineScope(this.document, options);
    const excludeSelector = clrUsableSelectors(this.document, options.excludeSelectors);
    return element => {
      if (!element) {
        return 'keep';
      }
      if (isHiddenFromEngine(element, excludeSelector)) {
        return 'drop';
      }
      // An annotation on an ancestor of the scope describes a region that includes it.
      if (scope.roots && !scope.roots.some(root => root.contains(element) || element.contains(root))) {
        return 'drop';
      }
      return element.closest(CLR_CONTEXT_REDACT_SELECTOR) ? 'redact' : 'keep';
    };
  }

  /**
   * What a caller the application does not control may at most be given: the
   * application-wide options with the host's own ceiling for that caller over them,
   * held to the application-wide options, and the defaults wherever neither says. The
   * host can narrow what the application turned on and add exclusions, never turn on
   * what the application turned off or raise a budget past it. A budget or switch
   * nobody set is the default, not "unlimited": an untrusted caller cannot turn on
   * `includeRoutes` or raise `maxComponents` past what the application itself would get.
   */
  private untrustedCeiling(hostCeiling?: ClrContextSnapshotOptions): ClrContextSnapshotOptions {
    const application = this.applicationOptions ?? undefined;
    return resolveSnapshotOptions(capSnapshotOptions(withCallOptions(application, hostCeiling), application));
  }

  /** The call's options over the application's; see {@link withCallOptions}. */
  private effectiveOptions(options?: ClrContextSnapshotOptions): ClrContextSnapshotOptions {
    return withCallOptions(this.applicationOptions, options);
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

  /**
   * The configured pattern an address on this origin leads to, or `null`; see
   * `routePatternFor`. Routes are read as the router reads them: below the application's
   * base href — under `/app/` the path `/app/hosts` is the route `hosts`, and a path
   * outside `/app/` is no route at all — or, with hash routing, from the fragment of an
   * address to this very page.
   */
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

  /**
   * The path the application's base href names, ending in `/`: the router's own, which
   * `APP_BASE_HREF` sets as well as a `<base>` element, or else the document's base.
   */
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
      } else if (route.routeConfig?.matcher) {
        // A custom matcher has no pattern: the segments it consumed are reported as `*`,
        // never as the values they held.
        pathSegments.push(...route.url.map(() => '*'));
      }
      Object.assign(params, route.params);
      // Only the route's static configuration: `route.data` on the activated snapshot
      // also carries what resolvers fetched — user records, entitlements, API payloads —
      // which is application data, not a description of the page.
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
