/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { onTestFinished } from 'vitest';

import { ClrContextRegistryService } from './context-registry.service';
import { ClrContextConfig, ClrContextService } from './contextual-engine.service';
import { ClrPageContext } from '../interfaces/context.interface';
import { CLR_CONTEXT_PRESETS } from '../snapshot-options';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.Eager })
class RoutedComponent {}

describe('ClrContextService', () => {
  describe('without configured routes', () => {
    let engine: ClrContextService;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      engine = TestBed.inject(ClrContextService);
    });

    it('snapshots the document and reports no route for an unconfigured router', async () => {
      const snapshot = await engine.snapshot();

      expect(snapshot.title).toBe(document.title);
      expect(snapshot.url).toBe(document.location.href);
      expect(snapshot.route).toBeUndefined();
      expect(new Date(snapshot.collectedAt).getTime()).not.toBeNaN();
    });

    it('includes application-registered regions', async () => {
      const registry = TestBed.inject(ClrContextRegistryService);
      const unregister = registry.register({ getClrContext: () => ({ type: 'region', label: 'inventory' }) });

      expect((await engine.snapshot()).regions).toEqual([{ type: 'region', label: 'inventory' }]);

      unregister();
      expect((await engine.snapshot()).regions).toEqual([]);
    });

    it('merges what a component publishes on its host into the node of its host, until it unpublishes', async () => {
      const host = document.createElement('app-cluster-picker');
      host.setAttribute('role', 'radiogroup');
      host.setAttribute('aria-label', 'Cluster');
      document.body.appendChild(host);
      onTestFinished(() => host.remove());
      const unpublish = engine.publish(host, () => ({ state: { help: 'Where new hosts go' } }));

      expect((await engine.snapshot()).components).toContainEqual(
        expect.objectContaining({ type: 'radiogroup', label: 'Cluster', state: { help: 'Where new hosts go' } })
      );

      unpublish();
      expect((await engine.snapshot()).components.find(node => node.label === 'Cluster')?.state).toBeUndefined();
    });

    it('lets other UI libraries register their own DOM extractors', async () => {
      const widget = document.createElement('div');
      widget.className = 'chat-widget';
      document.body.appendChild(widget);
      engine.configure({
        extractors: [{ selector: '.chat-widget', extract: () => ({ type: 'chat', label: 'Support chat' }) }],
      });

      try {
        expect((await engine.snapshot()).components).toContainEqual(expect.objectContaining({ type: 'chat' }));

        engine.configure({});
        expect((await engine.snapshot()).components).not.toContainEqual(expect.objectContaining({ type: 'chat' }));
      } finally {
        widget.remove();
      }
    });
  });

  describe('with a router', () => {
    it('describes the active route, dropping non-serializable route data', async () => {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([
            {
              path: 'items/:id',
              component: RoutedComponent,
              data: {
                section: 'items',
                tags: ['inventory', () => 'not serializable'],
                meta: { owner: 'core-team', load: () => 'not serializable' },
                empty: { load: () => 'not serializable' },
                resolver: () => 'not serializable',
              },
            },
          ]),
        ],
      });
      const engine = TestBed.inject(ClrContextService);

      await TestBed.inject(Router).navigateByUrl('/items/42?tab=general');
      const route = (await engine.snapshot()).route;

      expect(route?.url).toBe('/items/42?tab=general');
      expect(route?.path).toBe('items/:id');
      expect(route?.params).toEqual({ id: '42' });
      expect(route?.queryParams).toEqual({ tab: 'general' });
      expect(route?.data).toEqual({ section: 'items', tags: ['inventory'], meta: { owner: 'core-team' } });
    });

    it('reports the route’s static data, never what a resolver fetched', async () => {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([
            {
              path: 'account',
              component: RoutedComponent,
              data: { section: 'account' },
              resolve: { user: () => ({ email: 'someone@example.test', token: 'secret' }) },
            },
          ]),
        ],
      });
      const engine = TestBed.inject(ClrContextService);

      await TestBed.inject(Router).navigateByUrl('/account');
      const snapshot = await engine.snapshot();

      expect(snapshot.route?.data).toEqual({ section: 'account' });
      expect(JSON.stringify(snapshot.route)).not.toContain('secret');
    });
  });
});

describe('ClrContextService, saying when a snapshot is cut off', () => {
  let engine: ClrContextService;
  let widgets: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    engine = TestBed.inject(ClrContextService);
    widgets = document.createElement('div');
    widgets.innerHTML = '<button>one</button><button>two</button><button>three</button>';
    document.body.appendChild(widgets);
  });

  afterEach(() => widgets.remove());

  it('flags a snapshot whose component budget ran out', async () => {
    expect((await engine.snapshot({ maxComponents: 1 })).truncated).toBe(true);
  });

  it('carries no flag when everything fit', async () => {
    expect('truncated' in (await engine.snapshot({ maxComponents: 5000 }))).toBe(false);
  });
});

describe('ClrContextService, configured once for the application', () => {
  let widgets: HTMLElement;

  beforeEach(() => {
    widgets = document.createElement('div');
    widgets.innerHTML =
      '<nav aria-label="Main"><a href="/a">A</a></nav><main><p>Prose</p><button>Go</button></main>' +
      '<div role="dialog" aria-modal="true" aria-label="Confirm"><button>Yes</button></div>';
    document.body.appendChild(widgets);
  });

  afterEach(() => widgets.remove());

  function engineWith(config: ClrContextConfig): ClrContextService {
    TestBed.configureTestingModule({});
    const engine = TestBed.inject(ClrContextService);
    engine.configure(config);
    return engine;
  }

  function types(snapshot: ClrPageContext): string[] {
    return snapshot.components.map(node => node.type);
  }

  it('applies a preset configured for the whole application', async () => {
    const engine = engineWith({ scope: 'interactive' });
    const snapshot = await engine.snapshot({ root: 'main, nav' });
    expect(types(snapshot)).toEqual(['main']);
    expect(snapshot.components[0].children?.map(node => node.type)).toEqual(['button']);
  });

  it('lets a call override the application’s budgets', async () => {
    const engine = engineWith({ scope: { root: 'main', maxComponents: 1 } });
    expect((await engine.snapshot()).truncated).toBe(true);
    expect((await engine.snapshot({ maxComponents: 50 })).truncated).toBeUndefined();
  });

  it('adds a call’s exclusions to the application’s rather than replacing them', async () => {
    const engine = engineWith({
      scope: { ...CLR_CONTEXT_PRESETS.interactive, root: 'main, nav', excludeSelectors: ['nav'] },
    });
    expect(types(await engine.snapshot({ excludeCategories: [], excludeSelectors: [] }))).toEqual(['main']);
    expect((await engine.snapshot({ excludeCategories: ['actions'] })).components[0].children).toBeUndefined();
  });

  it('narrows to the open modal and says so', async () => {
    const engine = engineWith({ scope: 'minimal' });
    const snapshot = await engine.snapshot();
    expect(snapshot.focus).toBe('modal');
    expect(types(snapshot)).toEqual(['dialog']);
  });

  it('accepts the options themselves, not only a preset name', async () => {
    const engine = engineWith({ scope: { root: 'main', excludeCategories: ['text'] } });
    const snapshot = await engine.snapshot();
    expect(types(snapshot)).toEqual(['main']);
    expect(snapshot.components[0].children?.map(node => node.type)).toEqual(['button']);
  });

  it('warns when configured again, or after a snapshot used the defaults', async () => {
    TestBed.configureTestingModule({});
    const engine = TestBed.inject(ClrContextService);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    await engine.snapshot();
    engine.configure({ scope: 'interactive' });
    engine.configure({ scope: 'minimal' });

    expect(warn.mock.calls).toEqual([
      ['ClrContextService.configure: called after a snapshot was taken; that snapshot used the defaults.'],
      ['ClrContextService.configure: called again; the new configuration replaces the previous one.'],
    ]);
  });

  it('warns about an unknown preset and reads the whole page', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const engine = engineWith({ scope: 'everything' as never });

    expect(warn).toHaveBeenCalledExactlyOnceWith(
      'Clarity context options: "everything" is not a preset; use one of full, interactive, minimal.'
    );
    expect(types(await engine.snapshot())).toContain('main');
  });
});

describe('ClrContextService, the routes an application can navigate to', () => {
  it('lists configured paths with their titles, leaving wildcards and redirects out', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', redirectTo: 'hosts', pathMatch: 'full' },
          { path: 'hosts', component: RoutedComponent, title: 'Hosts' },
          {
            path: 'clusters/:id',
            component: RoutedComponent,
            data: { title: 'Cluster' },
            children: [{ path: 'hosts', component: RoutedComponent }],
          },
          { path: 'billing', loadChildren: () => Promise.resolve([]) },
          { path: '**', component: RoutedComponent },
        ]),
      ],
    });
    const engine = TestBed.inject(ClrContextService);
    engine.configure({ routes: true });

    const routes = (await engine.snapshot()).availableRoutes;

    expect(routes).toEqual([
      { path: 'hosts', title: 'Hosts' },
      { path: 'clusters/:id', title: 'Cluster' },
      { path: 'clusters/:id/hosts' },
      { path: 'billing', lazy: true },
    ]);
  });

  it('lists the root path as "/", and never fewer than fifty routes however small the collection budget', async () => {
    const many = Array.from({ length: 70 }, (_, index) => ({ path: `page-${index}`, component: RoutedComponent }));
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '', component: RoutedComponent, title: 'Home' }, ...many])],
    });
    const engine = TestBed.inject(ClrContextService);
    engine.configure({ routes: true });

    const few = await engine.snapshot({ maxItemsPerCollection: 5 });
    expect(few.availableRoutes?.[0]).toEqual({ path: '/', title: 'Home' });
    expect(few.availableRoutes?.length).toBe(50);
    const more = await engine.snapshot({ maxItemsPerCollection: 60 });
    expect(more.availableRoutes?.length).toBe(60);
  });

  it('leaves out routes matched by a custom matcher, which have no pattern to navigate by, and lists each path once', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'docs',
            children: [
              { matcher: segments => (segments.length ? { consumed: segments } : null), component: RoutedComponent },
              { matcher: () => null, loadChildren: () => Promise.resolve([]) },
              { path: 'intro', component: RoutedComponent },
            ],
          },
          { path: 'hosts', component: RoutedComponent },
          { path: 'hosts', component: RoutedComponent, title: 'Duplicate' },
        ]),
      ],
    });
    const engine = TestBed.inject(ClrContextService);
    engine.configure({ routes: true });

    const routes = (await engine.snapshot()).availableRoutes;

    expect(routes).toEqual([{ path: 'docs/intro' }, { path: 'hosts' }]);
  });

  it('reports the segments a custom matcher consumed as wildcards, never as the values they held', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'docs',
            children: [{ matcher: segments => ({ consumed: segments }), component: RoutedComponent }],
          },
        ]),
      ],
    });
    const engine = TestBed.inject(ClrContextService);
    engine.configure({ routes: true });

    await TestBed.inject(Router).navigateByUrl('/docs/contextual-engine/code');

    expect((await engine.snapshot()).route?.path).toBe('docs/*/*');
  });

  it('lists nothing unless asked', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([{ path: 'hosts', component: RoutedComponent }])] });
    const engine = TestBed.inject(ClrContextService);
    expect('availableRoutes' in (await engine.snapshot())).toBe(false);
  });

  it('lists the routes of a lazy module once it has loaded', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'billing',
            loadChildren: () => Promise.resolve([{ path: 'invoices', component: RoutedComponent, title: 'Invoices' }]),
          },
        ]),
      ],
    });
    const engine = TestBed.inject(ClrContextService);
    engine.configure({ routes: true });
    const before = (await engine.snapshot()).availableRoutes;
    expect(before).toContainEqual({ path: 'billing', lazy: true });

    await TestBed.inject(Router).navigateByUrl('/billing/invoices');

    const after = (await engine.snapshot()).availableRoutes;
    expect(after).toContainEqual({ path: 'billing/invoices', title: 'Invoices' });
    expect(after?.some(route => route.lazy)).toBe(false);
  });
});
