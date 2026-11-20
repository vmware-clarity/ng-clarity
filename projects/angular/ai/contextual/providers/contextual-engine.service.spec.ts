/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { publishElementContext } from '@clr/angular/utils';

import { ClrContextRegistryService } from './context-registry.service';
import { ClrContextConfig, ClrContextService } from './contextual-engine.service';
import { ClrComponentContext, ClrPageContext } from '../interfaces/context.interface';
import { CLR_CONTEXT_DEFAULT_OPTIONS, CLR_CONTEXT_PRESETS } from '../snapshot-options';
import { untrustedSnapshot } from '../untrusted-snapshot.mock';

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

describe('ClrContextService, what a caller the application does not control is told about fields', () => {
  let engine: ClrContextService;
  let form: HTMLElement;

  function reportedValue(snapshot: ClrPageContext): unknown {
    return snapshot.components.find(component => component.type === 'textbox')?.state?.['value'];
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    engine = TestBed.inject(ClrContextService);
    form = document.createElement('div');
    form.innerHTML = '<label for="secret">Token</label><input id="secret" value="user-typed-secret" />';
    document.body.appendChild(form);
  });

  afterEach(() => form.remove());

  it('withholds what the user typed, even when the caller asks for it', () => {
    expect(reportedValue(untrustedSnapshot(engine, { shareFormValues: true }))).toBeUndefined();
  });

  it('still describes the field whose value it withholds', () => {
    expect(untrustedSnapshot(engine).components.some(component => component.type === 'textbox')).toBe(true);
  });

  it('withholds what the user chose or ticked as much as what they typed', () => {
    form.innerHTML +=
      '<select multiple aria-label="Roles"><option selected>admin</option><option>viewer</option></select>' +
      '<input type="checkbox" aria-label="Remember" checked />';

    const json = JSON.stringify(untrustedSnapshot(engine));
    expect(json).not.toContain('"selected"');
    expect(json).not.toContain('"checked"');
    expect(json).toContain('"optionCount":2');
  });

  it('withholds which toggle buttons the user pressed, a choice like a ticked box', async () => {
    form.innerHTML +=
      '<button type="button" aria-pressed="true">Pay anonymously</button>' +
      '<div role="group" aria-label="Billing"><button type="button" aria-pressed="false">Monthly</button>' +
      '<button type="button" aria-pressed="true">Annual</button></div>';

    const json = JSON.stringify(untrustedSnapshot(engine));
    expect(json).toContain('Pay anonymously');
    expect(json).not.toContain('"pressed"');
    expect(JSON.stringify(await engine.snapshot())).toContain('"pressed":true');
  });

  it('still honours a smaller budget the caller asks for', () => {
    expect(untrustedSnapshot(engine, { maxComponents: 1 }).components.length).toBe(1);
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

  it('holds a caller the application does not control to the application options', () => {
    const engine = engineWith({
      scope: { excludeCategories: ['text', 'layout'], root: 'main, nav', maxComponents: 5 },
    });
    const snapshot = untrustedSnapshot(engine, { excludeCategories: [], root: 'page', maxComponents: 10_000 });
    expect(types(snapshot)).toEqual(['main']);
    expect(snapshot.components[0].children?.map(node => node.type)).toEqual(['button']);
  });

  it('does not let an untrusted caller set off a warning about the application’s options', () => {
    const engine = engineWith({ scope: { excludeCategories: ['layout'], root: 'main, nav' } });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(types(untrustedSnapshot(engine, { excludeCategories: true, excludeSelectors: 1 }))).toEqual(['main']);
    expect(warn).not.toHaveBeenCalled();
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

describe('ClrContextService, what a caller the application does not control is told about published state', () => {
  let engine: ClrContextService;
  let page: HTMLElement;

  function find(nodes: ClrComponentContext[], match: (node: ClrComponentContext) => boolean): ClrComponentContext[] {
    return nodes.flatMap(node => [...(match(node) ? [node] : []), ...find(node.children ?? [], match)]);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    engine = TestBed.inject(ClrContextService);
    // The snapshot describes the whole page, and fixtures are not torn down after each
    // spec here (`destroyAfterEach: false`): an earlier spec's root would be described too.
    document.querySelectorAll('body > [ng-version]').forEach(root => root.remove());
    page = document.createElement('div');
    page.innerHTML = '<a href="/clusters/7">Cluster seven</a>';
    document.body.appendChild(page);
  });

  afterEach(() => page.remove());

  it('withholds a selection as much as a typed value', () => {
    engine.configure({
      extractors: [
        {
          selector: 'a',
          extract: () => ({
            type: 'grid',
            label: 'Users',
            state: { selection: ['Ada'], rowCount: 3 },
            publicKeys: ['rowCount', 'selection'],
          }),
        },
      ],
    });

    const grid = find(untrustedSnapshot(engine).components, node => node.type === 'grid')[0];
    expect(grid.state).toEqual({ rowCount: 3, withheld: true });
  });

  it('withholds published state its publisher did not mark public', async () => {
    page.innerHTML = '<div class="search">Find hosts</div>';
    const search = page.querySelector('.search') as HTMLElement;
    const unpublish = publishElementContext(search, () => ({
      type: 'search',
      state: { query: '4111 1111', resultCount: 2 },
      publicKeys: ['resultCount'],
      children: [{ type: 'group', label: 'Filter', state: { filter: 's3cr3t' } }],
    }));
    const registry = TestBed.inject(ClrContextRegistryService);
    const annotation = {
      getClrContext: () => ({ type: 'region', label: 'Cart', state: { coupon: 's3cr3t', items: 2 } }),
    };
    const unregister = registry.register(annotation);

    try {
      const shared = untrustedSnapshot(engine);
      expect(find(shared.components, node => node.type === 'search')[0].state).toEqual({
        resultCount: 2,
        withheld: true,
      });
      expect(find(shared.components, node => node.label === 'Filter')[0].state).toEqual({ withheld: true });
      expect(shared.regions).toEqual([{ type: 'region', label: 'Cart', state: { withheld: true } }]);
      expect(JSON.stringify(shared)).not.toContain('s3cr3t');
      expect(JSON.stringify(shared)).not.toContain('4111');

      const trusted = await engine.snapshot();
      expect(find(trusted.components, node => node.type === 'search')[0].state?.['query']).toBe('4111 1111');
      expect(trusted.regions[0].state).toEqual({ coupon: 's3cr3t', items: 2 });
    } finally {
      unpublish();
      unregister();
    }
  });

  it('redacts a node its publisher marks redacted, without listing the key', () => {
    page.innerHTML = '<div class="card"><label>Card <input value="4111" /></label></div>';
    const unpublish = publishElementContext(page.querySelector('.card') as HTMLElement, () => ({
      type: 'group',
      label: 'Card 4111',
      state: { redacted: true },
    }));

    try {
      expect(JSON.stringify(untrustedSnapshot(engine).components)).not.toContain('4111');
    } finally {
      unpublish();
    }
  });

  it('shares the state keys an annotation marks public', () => {
    const registry = TestBed.inject(ClrContextRegistryService);
    const unregister = registry.register({
      getClrContext: () => ({
        type: 'region',
        label: 'Cart',
        state: { coupon: 's3cr3t', items: 2 },
        publicKeys: ['items'],
      }),
    });

    try {
      expect(untrustedSnapshot(engine).regions).toEqual([
        { type: 'region', label: 'Cart', state: { items: 2, withheld: true } },
      ]);
    } finally {
      unregister();
    }
  });

  it('reads the scope only as the page or the modal, never as a selector', () => {
    expect(untrustedSnapshot(engine, { root: 'main' }).components.length).toBeGreaterThan(0);
    expect(untrustedSnapshot(engine, { root: 7 }).components.length).toBeGreaterThan(0);
  });

  it('does not let a caller raise a budget past the default', () => {
    page.innerHTML = Array.from({ length: 320 }, (_, index) => `<button>Button ${index}</button>`).join('');

    const snapshot = untrustedSnapshot(engine, { maxComponents: 5000 });

    expect(find(snapshot.components, () => true).length).toBeLessThanOrEqual(CLR_CONTEXT_DEFAULT_OPTIONS.maxComponents);
    expect(snapshot.truncated).toBe(true);
  });
});
