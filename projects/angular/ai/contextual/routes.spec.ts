/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { Route, UrlSegment } from '@angular/router';

import { routePatternFor } from './routes';

@Component({ template: '', standalone: true })
class Page {}

describe('routePatternFor', () => {
  const config: Route[] = [
    { path: '', component: Page },
    { path: 'old', redirectTo: 'clusters' },
    { path: 'clusters/:id', component: Page },
    {
      path: 'teams/:team',
      children: [
        { path: '', component: Page },
        { path: 'members/:member', component: Page },
      ],
    },
    { path: 'billing', loadChildren: () => Promise.resolve([{ path: 'invoices/:id', component: Page }]) },
    {
      matcher: (segments: UrlSegment[]) => (segments[0]?.path === 'x' ? { consumed: segments } : null),
      component: Page,
    },
  ];

  it('names the pattern a path matches, without its query or fragment', () => {
    expect(routePatternFor(config, '/clusters/42?tab=hosts#top')).toBe('clusters/:id');
    expect(routePatternFor(config, '/')).toBe('');
  });

  it('follows child routes', () => {
    expect(routePatternFor(config, '/teams/7')).toBe('teams/:team');
    expect(routePatternFor(config, '/teams/7/members/ada')).toBe('teams/:team/members/:member');
  });

  it('does not treat a redirect as a destination', () => {
    expect(routePatternFor([{ path: 'old', redirectTo: 'new' }], '/old')).toBeNull();
  });

  it('reports what lies below a lazy route that has not loaded, or a custom matcher, as unknown', () => {
    expect(routePatternFor(config, '/billing')).toBe('billing');
    expect(routePatternFor(config, '/billing/invoices/9')).toBe('billing/*/*');
    expect(routePatternFor(config, '/x/secret')).toBe('*/*');
  });

  it('names a wildcard route by its pattern, and nothing when no route matches', () => {
    expect(
      routePatternFor(
        [
          { path: 'a', component: Page },
          { path: '**', component: Page },
        ],
        '/no/such/page'
      )
    ).toBe('**');
    expect(routePatternFor([{ path: 'a', component: Page }], '/no/such/page')).toBeNull();
  });
});
