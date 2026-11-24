/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Route } from '@angular/router';

import { ClrAvailableRoute } from './interfaces/context.interface';

/**
 * The router configuration flattened to navigable path patterns, without wildcards, redirects or custom matchers.
 * An unloaded lazy route is reported as `lazy`.
 */
export function availableRoutes(config: Route[]): ClrAvailableRoute[] {
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

function loadedChildren(entry: Route): Route[] | null {
  if (!entry.loadChildren) {
    return null;
  }
  // TODO: use a public accessor once the router offers one; `_loadedRoutes` is private API.
  const loaded = (entry as Route & { _loadedRoutes?: unknown })._loadedRoutes;
  return Array.isArray(loaded) ? (loaded as Route[]) : null;
}
