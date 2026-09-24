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
 * reported as `lazy`, meaning more paths exist beneath it than are listed.
 */
export function availableRoutes(config: Route[], limit: number): ClrAvailableRoute[] {
  const routes: ClrAvailableRoute[] = [];
  const visit = (entries: Route[], prefix: string) => {
    for (const entry of entries) {
      if (routes.length >= limit) {
        return;
      }
      const segment = entry.path ?? '';
      if (segment === '**' || entry.redirectTo !== undefined) {
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
        routes.push(route);
      } else if (lazy) {
        routes.push({ path: path || '/', lazy: true });
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
 * The child routes the router loaded for a `loadChildren` entry, once it has. The router
 * keeps them on the route object itself, where they are not part of its typed surface;
 * read defensively so that a router that keeps them elsewhere only means lazy children
 * stay unlisted.
 */
function loadedChildren(entry: Route): Route[] | null {
  if (!entry.loadChildren) {
    return null;
  }
  const loaded = (entry as Route & { _loadedRoutes?: unknown })._loadedRoutes;
  return Array.isArray(loaded) ? (loaded as Route[]) : null;
}
