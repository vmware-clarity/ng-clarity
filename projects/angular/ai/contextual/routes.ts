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
 * under their parent, wildcards and redirects left out, lazily loaded children listed
 * only once loaded (the router keeps them where a walk cannot see them until then).
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
      if (entry.component || entry.loadComponent || (!entry.children && !entry.loadChildren)) {
        const route: ClrAvailableRoute = { path: path || '/' };
        const title = entry.title ?? (entry.data as Record<string, unknown> | undefined)?.['title'];
        if (typeof title === 'string' && title) {
          route.title = title;
        }
        if (entry.loadChildren) {
          route.lazy = true;
        }
        routes.push(route);
      } else if (entry.loadChildren) {
        routes.push({ path: path || '/', lazy: true });
      }
      if (entry.children) {
        visit(entry.children, path);
      }
    }
  };
  visit(config, '');
  return routes;
}
