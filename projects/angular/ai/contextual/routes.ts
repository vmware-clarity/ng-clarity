/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Route } from '@angular/router';

import { ClrAvailableRoute } from './interfaces/context.interface';

/**
 * The navigable routes in a router configuration, flattened to path patterns: children
 * under their parent, wildcards and redirects left out. A lazily loaded child
 * configuration is listed once the router has loaded it; until then its parent is
 * reported as `lazy`, meaning more paths exist beneath it than are listed. A route
 * matched by a custom `matcher` has no pattern to navigate by, so it and its children
 * are left out. Each path is listed once.
 */
export function availableRoutes(config: Route[], limit: number): ClrAvailableRoute[] {
  const routes: ClrAvailableRoute[] = [];
  const listed = new Set<string>();
  const add = (route: ClrAvailableRoute) => {
    if (!listed.has(route.path)) {
      listed.add(route.path);
      routes.push(route);
    }
  };
  const visit = (entries: Route[], prefix: string) => {
    for (const entry of entries) {
      if (routes.length >= limit) {
        return;
      }
      const segment = entry.path ?? '';
      if (segment === '**' || entry.redirectTo !== undefined || (entry.matcher && entry.path === undefined)) {
        continue;
      }
      const path = [prefix, segment].filter(Boolean).join('/');
      const loaded = loadedChildren(entry);
      const lazy = !!entry.loadChildren && !loaded;
      if (entry.component || entry.loadComponent || (!entry.children && !entry.loadChildren)) {
        const route: ClrAvailableRoute = { path: path || '/' };
        const title = entry.title ?? (entry.data as Record<string, unknown> | undefined)?.['title'];
        if (typeof title === 'string' && title) {
          route.title = title;
        }
        if (lazy) {
          route.lazy = true;
        }
        add(route);
      } else if (lazy) {
        add({ path: path || '/', lazy: true });
      }
      if (entry.children) {
        visit(entry.children, path);
      }
      if (loaded) {
        visit(loaded, path);
      }
    }
  };
  visit(config, '');
  return routes;
}

/**
 * The configured pattern a path matches — `clusters/:id` for `/clusters/42` — or `null`
 * when no route matches it. Describes a link to a caller the application does not trust
 * without the values its path carries. Segments below a lazy route that has not loaded,
 * or below a route with a custom `matcher`, are unknown and reported as `*`.
 */
export function routePatternFor(config: Route[], path: string): string | null {
  const match = (entries: Route[], rest: string[], prefix: string[]): string[] | null => {
    for (const entry of entries) {
      if (entry.redirectTo !== undefined) {
        continue;
      }
      if (entry.path === '**') {
        return [...prefix, '**'];
      }
      if (entry.matcher && entry.path === undefined) {
        if (rest.length) {
          return [...prefix, ...rest.map(() => '*')];
        }
        continue;
      }
      const own = (entry.path ?? '').split('/').filter(Boolean);
      if (own.length > rest.length || !own.every((part, index) => part.startsWith(':') || part === rest[index])) {
        continue;
      }
      const remaining = rest.slice(own.length);
      const pattern = [...prefix, ...own];
      const children = entry.children ?? loadedChildren(entry);
      const inner = children ? match(children, remaining, pattern) : null;
      if (inner) {
        return inner;
      }
      if (entry.loadChildren && !children && remaining.length) {
        return [...pattern, ...remaining.map(() => '*')];
      }
      if (!remaining.length && (entry.component || entry.loadComponent || entry.loadChildren)) {
        return pattern;
      }
    }
    return null;
  };
  const segments = path.split(/[?#]/)[0].split('/').filter(Boolean).map(decodeSegment);
  const pattern = match(config, segments, []);
  return pattern ? pattern.join('/') : null;
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/**
 * The child routes the router loaded for a `loadChildren` entry, once it has. The router
 * keeps them on the route object itself, where they are not part of its typed surface;
 * read defensively so that a router that keeps them elsewhere only means lazy children
 * stay unlisted.
 */
function loadedChildren(entry: Route): Route[] | null {
  if (!entry.loadChildren) {
    return null;
  }
  // TODO: read loaded children through a public accessor once the router offers one.
  // `_loadedRoutes` is not public API; the route listing spec for lazy modules fails if
  // the router stops keeping loaded children there.
  const loaded = (entry as Route & { _loadedRoutes?: unknown })._loadedRoutes;
  return Array.isArray(loaded) ? (loaded as Route[]) : null;
}
