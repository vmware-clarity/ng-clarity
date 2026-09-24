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
import { ClrContextRegionFilter, ClrContextRegistryService } from './context-registry.service';
import { CLR_CONTEXT_REDACT_ATTRIBUTE } from '../dom/aria-state';
import { ClrContextDomExtractor } from '../dom/dom-context-collector';
import { collectContextTreeWithin, engineScope, isHiddenFromEngine } from '../dom/walk';
import {
  ClrContextFrameHost,
  ClrContextFrameHostOptions,
  ClrContextFrameRequestOptions,
  requestClrContextFromHost,
} from '../iframe/context-frame-bridge';
import { ClrContextSnapshotOptions, ClrPageContext, ClrRouteContext } from '../interfaces/context.interface';
import { jsonSafe } from '../json-safe';
import { ContextRefRegistryService } from '../mutation/context-ref-registry.service';
import { CLR_MUTATION_POLICY } from '../mutation/mutation.interface';
import { availableRoutes } from '../routes';
import { capSnapshotOptions, resolveSnapshotOptions } from '../snapshot-options';
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
   * Include the full URL — path, query string and fragment — and the route's parameters,
   * query parameters and data. Off by default, when a caller learns only the route's
   * pattern (`reset/:token`): addresses routinely carry identifiers and occasionally
   * credentials, and any script on the page can call the accessor.
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
  private readonly refs = inject(ContextRefRegistryService);
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
   *
   * While the application has provided a `ClrMutationPolicy`, every node the mutation
   * engine could write to carries a `ref`: the same ref for the same element in every
   * snapshot, for as long as the element is on the page.
   */
  getSnapshot(options?: ClrContextSnapshotOptions): ClrPageContext {
    return this.snapshot(options, !!this.mutationPolicy);
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
    const ceiling = this.untrustedCeiling(budgets);
    host[propertyName] = (options?: unknown) => {
      // The caller may ask for less than the application allows, never for more.
      const snapshot = this.snapshot(capSnapshotOptions(sanitizeUntrustedSnapshotOptions(options), ceiling), false);
      const shared = shareFormValues ? snapshot : withoutFormValues(snapshot);
      return shareFullUrl ? shared : withoutUrlDetails(shared);
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
    if (effective.includeRoutes && this.router?.config.length) {
      // Bounded by the resolved budget, so an out-of-range request is clamped here too.
      const limit = Math.max(resolved.maxItemsPerCollection, MIN_ROUTE_LIMIT);
      snapshot.availableRoutes = availableRoutes(this.router.config, limit);
    }
    if (isPlatformBrowser(this.platformId) && effective.includeDomComponents !== false) {
      const refs = withRefs ? this.refs.begin() : null;
      const tree = collectContextTreeWithin(this.document, resolved, this.customExtractors, refs);
      refs?.commit();
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
    const excludeSelector = options.excludeSelectors.filter(usableSelector(this.document)).join(', ');
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
      return element.closest(`[${CLR_CONTEXT_REDACT_ATTRIBUTE}]`) ? 'redact' : 'keep';
    };
  }

  /**
   * What a caller the application does not control may at most be given: the host's
   * own ceiling for that caller, held to the application-wide options above it, and
   * the defaults wherever neither says. A budget or switch nobody set is the default,
   * not "unlimited": an untrusted caller cannot turn on `includeRoutes` or raise
   * `maxComponents` past what the application itself would get.
   */
  private untrustedCeiling(hostCeiling?: ClrContextSnapshotOptions): ClrContextSnapshotOptions {
    return resolveSnapshotOptions(capSnapshotOptions(hostCeiling, this.applicationOptions ?? undefined));
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

/** A predicate for `Array.filter`: whether the document accepts the selector. */
function usableSelector(document: Document): (selector: string) => boolean {
  return selector => {
    try {
      document.querySelector(selector);
      return true;
    } catch {
      return false;
    }
  };
}
