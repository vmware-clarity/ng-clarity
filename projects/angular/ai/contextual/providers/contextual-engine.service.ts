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
import { ContextTracker } from './context-tracker';
import { charged } from '../budget';
import { ClrContextChange, clrDiffContext } from '../diff';
import { ClrContextDomExtractor } from '../dom/dom-context-collector';
import { collectContextTreeWithin } from '../dom/walk';
import {
  ClrComponentContext,
  ClrContextSnapshotOptions,
  ClrPageContext,
  ClrRouteContext,
} from '../interfaces/context.interface';
import { jsonSafe, ROUTE_DATA_DEPTH } from '../json-safe';
import { availableRoutes } from '../routes';
import {
  ClrContextPreset,
  presetOrOptions,
  ResolvedSnapshotOptions,
  resolveSnapshotOptions,
  withCallOptions,
} from '../snapshot-options';

/** A route map cut to a handful of entries would misdescribe where the app can go. */
const MIN_ROUTE_LIMIT = 50;

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
    const regions = this.contextRegistry.collect({ limits: resolved, untrusted });
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

/** Regions are not walked, so they get a component budget of their own. */
function setRegions(snapshot: ClrPageContext, regions: ClrComponentContext[], options: ResolvedSnapshotOptions): void {
  const budget = { remaining: options.maxComponents, truncated: false };
  snapshot.regions = charged(regions, budget);
  if (budget.truncated) {
    snapshot.truncated = true;
  }
}
