/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Route } from '@angular/router';

import { attempt } from './attempt';
import { ClrAvailableRoute } from './interfaces/context.interface';
import { stripQueryAndFragment } from './url';

/**
 * The router configuration flattened to navigable path patterns, without wildcards, redirects or custom matchers.
 * An unloaded lazy route is reported as `lazy`.
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
 * The configured pattern a path matches (`clusters/:id` for `/clusters/42`), or `null`.
 * Unknown segments below a lazy route or custom matcher are `*`.
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
  const segments = stripQueryAndFragment(path).split('/').filter(Boolean).map(decodeSegment);
  const pattern = match(config, segments, []);
  return pattern ? pattern.join('/') : null;
}

function decodeSegment(segment: string): string {
  return attempt(() => decodeURIComponent(segment), segment);
}

function loadedChildren(entry: Route): Route[] | null {
  if (!entry.loadChildren) {
    return null;
  }
  // TODO: use a public accessor once the router offers one; `_loadedRoutes` is private API.
  const loaded = (entry as Route & { _loadedRoutes?: unknown })._loadedRoutes;
  return Array.isArray(loaded) ? (loaded as Route[]) : null;
}
