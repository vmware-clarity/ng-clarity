/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ClrPublishedContext, markContext } from '@clr/angular/utils';
import { onTestFinished } from 'vitest';

import { ClrContextRegistryService } from './context-registry.service';
import { ClrContextConfig, ClrContextService } from './contextual-engine.service';
import { annotate } from '../dom/annotations';
import {
  ClrComponentContext,
  ClrContextCategory,
  ClrContextSnapshotOptions,
  ClrPageContext,
} from '../interfaces/context.interface';
import { CLR_CONTEXT_CATEGORIES, CLR_CONTEXT_PRESETS } from '../snapshot-options';

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

  it('lets a call override the application’s depth', async () => {
    const engine = engineWith({ scope: { root: 'main', depth: 1 } });
    expect((await engine.snapshot()).components[0].children).toBeUndefined();
    expect((await engine.snapshot({ depth: 2 })).components[0].children?.length).toBe(2);
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
    expect(snapshot.modal).toBe(true);
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

  it('lists the root path as "/", and every route', async () => {
    const many = Array.from({ length: 70 }, (_, index) => ({ path: `page-${index}`, component: RoutedComponent }));
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '', component: RoutedComponent, title: 'Home' }, ...many])],
    });
    const engine = TestBed.inject(ClrContextService);
    engine.configure({ routes: true });

    const snapshot = await engine.snapshot();
    expect(snapshot.availableRoutes?.[0]).toEqual({ path: '/', title: 'Home' });
    expect(snapshot.availableRoutes?.length).toBe(71);
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

/** The service, configured with `config` once the testing module is set up. */
function configuredService(config: ClrContextConfig): ClrContextService {
  const service = TestBed.inject(ClrContextService);
  service.configure(config);
  return service;
}

describe('ClrContextService, identifying the application and view', () => {
  const quiet = { excludeCategories: Object.keys(CLR_CONTEXT_CATEGORIES) as ClrContextCategory[] };
  const annotations: (() => void)[] = [];
  let page: HTMLElement;

  /** What `[clrContext]` on the element would say. */
  function annotateWith(element: Element, context: () => Partial<ClrPublishedContext> | null): void {
    annotations.push(annotate(element, context));
  }

  beforeEach(() => {
    page = document.createElement('main');
    page.className = 'test-page';
    document.body.appendChild(page);
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    page.remove();
    annotations.splice(0).forEach(remove => remove());
  });

  it('versions every snapshot and names the host when no application is configured', async () => {
    const snapshot = await TestBed.inject(ClrContextService).snapshot(quiet);

    expect(snapshot.schemaVersion).toBe('2');
    expect(snapshot.application).toEqual({ id: document.location.hostname });
    expect(snapshot.metadata).toBeUndefined();
  });

  it('reports the configured application, and the view from the annotation on the view root', async () => {
    annotateWith(page, () => ({
      label: 'Host list',
      state: { purpose: 'Lists hosts', load: () => 'not serializable' },
    }));
    const snapshot = await configuredService({
      application: { id: 'inventory', version: '2.4.0' },
      scope: { root: '.test-page' },
    }).snapshot(quiet);

    expect(snapshot.application).toEqual({ id: 'inventory', version: '2.4.0' });
    expect(snapshot.metadata).toEqual({ label: 'Host list', purpose: 'Lists hosts' });
  });

  it('merges the view root and its ancestors, inner winning', async () => {
    annotateWith(document.body, () => ({ state: { purpose: 'Page', owner: 'core' } }));
    annotateWith(page, () => ({ state: { purpose: 'Hosts' } }));

    const snapshot = await configuredService({ scope: { root: '.test-page' } }).snapshot(quiet);

    expect(snapshot.metadata).toEqual({ purpose: 'Hosts', owner: 'core' });
  });

  it('reports an annotation inside the view on its node, not as the view metadata', async () => {
    page.innerHTML = '<nav aria-label="Hosts"><a href="#">h1</a></nav>';
    annotateWith(page.querySelector('nav')!, () => ({ state: { purpose: 'Pick a host' } }));

    const snapshot = await configuredService({}).snapshot();

    expect(snapshot.metadata).toBeUndefined();
    expect(JSON.stringify(snapshot.components)).toContain('Pick a host');
  });

  it('leaves out view metadata in an ignored, redacted or excluded region', async () => {
    annotateWith(page, () => ({ state: { accountSecret: 's3cr3t' } }));
    const engine = configuredService({ scope: { root: '.test-page' } });
    for (const mark of ['ignore', 'redact'] as const) {
      const unmark = markContext(document.body, mark);
      try {
        expect(JSON.stringify(await engine.snapshot(quiet)), mark).not.toContain('s3cr3t');
      } finally {
        unmark();
      }
    }
    expect(JSON.stringify(await engine.snapshot({ ...quiet, excludeSelectors: ['.test-page'] }))).not.toContain(
      's3cr3t'
    );
  });

  it('gives each snapshot its own copy of the metadata, so a consumer cannot change the next one', async () => {
    const settings: Record<string, unknown> = { allowed: true };
    settings['self'] = settings;
    annotateWith(page, () => ({ state: { settings } }));
    const engine = configuredService({ scope: { root: '.test-page' } });

    const snapshot = await engine.snapshot(quiet);
    (snapshot.metadata?.['settings'] as Record<string, unknown>)['allowed'] = false;

    expect(() => JSON.stringify(snapshot)).not.toThrow();
    expect(settings['allowed']).toBe(true);
    expect(((await engine.snapshot(quiet)).metadata?.['settings'] as Record<string, unknown>)['allowed']).toBe(true);
  });

  it('survives an annotation callback that throws', async () => {
    annotateWith(page, () => {
      throw new Error('broken');
    });

    const snapshot = await configuredService({ scope: { root: '.test-page' } }).snapshot(quiet);

    expect(snapshot.metadata).toBeUndefined();
  });
});

describe('ClrContextService, reading only enabled views', () => {
  let annotation: Partial<ClrPublishedContext> | null;
  let removeAnnotation: () => void;
  let engine: ClrContextService;
  let registry: ClrContextRegistryService;

  beforeEach(() => {
    annotation = null;
    removeAnnotation = annotate(document.body, () => annotation);
    TestBed.configureTestingModule({});
    engine = configuredService({ application: { id: 'inventory' }, views: 'enabled' });
    registry = TestBed.inject(ClrContextRegistryService);
  });

  afterEach(() => removeAnnotation());

  it('reports a view whose root has no annotation as not enabled, with nothing about the page', async () => {
    const provider = vi.fn().mockReturnValue({ type: 'region', label: 'Hosts' });
    registry.register({ getClrContext: provider });

    const snapshot = await engine.snapshot();
    expect(snapshot).toEqual({
      schemaVersion: '2',
      application: { id: 'inventory' },
      enabled: false,
      title: '',
      regions: [],
      components: [],
      collectedAt: expect.any(String),
    });
    expect(provider).not.toHaveBeenCalled();
  });

  it('reads a view once its root is annotated', async () => {
    annotation = { state: { purpose: 'Lists hosts' } };
    registry.register({ getClrContext: () => ({ type: 'region', label: 'Hosts' }) });

    const snapshot = await engine.snapshot();

    expect(snapshot.enabled).toBe(true);
    expect(snapshot.metadata).toEqual({ purpose: 'Lists hosts' });
    expect(snapshot.title).toBe(document.title);
    expect(snapshot.regions).toEqual([{ type: 'region', label: 'Hosts' }]);
  });
});

describe('ClrContextService, a view that changes while providers answer', () => {
  const quiet = { excludeCategories: Object.keys(CLR_CONTEXT_CATEGORIES) as ClrContextCategory[] };

  it('describes the new view instead of mixing answers from the old one into it', async () => {
    let view = 'hosts';
    const removeAnnotation = annotate(document.body, () => ({ state: { view } }));
    onTestFinished(removeAnnotation);
    TestBed.configureTestingModule({});
    const engine = configuredService({ application: { id: 'inventory' } });
    let answer: (context: ClrComponentContext) => void = () => undefined;
    TestBed.inject(ClrContextRegistryService).register({
      getClrContext: () =>
        view === 'hosts' ? new Promise(resolve => (answer = resolve)) : { type: 'region', label: 'VMs' },
    });

    const snapshot = engine.snapshot(quiet);
    view = 'vms';
    answer({ type: 'region', label: 'Hosts' });

    expect((await snapshot).metadata).toEqual({ view: 'vms' });
  });

  it('awaits the new view’s providers after a navigation between routes', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'hosts', children: [] },
          { path: 'vms', children: [] },
        ]),
      ],
    });
    const engine = TestBed.inject(ClrContextService);
    const router = TestBed.inject(Router);
    const answers: ((context: ClrComponentContext) => void)[] = [];
    TestBed.inject(ClrContextRegistryService).register({
      getClrContext: () => new Promise(resolve => answers.push(resolve)),
    });
    await router.navigateByUrl('/hosts');

    const snapshot = engine.snapshot(quiet);
    await router.navigateByUrl('/vms');
    answers[0]({ type: 'region', label: 'Hosts' });
    for (let wait = 0; answers.length < 2 && wait < 50; wait++) {
      await new Promise(resolve => setTimeout(resolve));
    }
    answers[1]?.({ type: 'region', label: 'VMs' });

    const result = await snapshot;
    expect(result.route?.url).toBe('/vms');
    expect(result.regions).toEqual([{ type: 'region', label: 'VMs' }]);
  });
});

describe('ClrContextService, an unrecognised views setting', () => {
  it('reads only enabled views, with a dev-mode warning', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    TestBed.configureTestingModule({});
    const engine = configuredService({
      application: { id: 'inventory' },
      views: 'enable' as unknown as ClrContextConfig['views'],
    });

    expect((await engine.snapshot()).enabled).toBe(false);
    expect(console.warn).toHaveBeenCalled();
  });
});

describe('ClrContextService, asynchronous providers', () => {
  let engine: ClrContextService;
  let registry: ClrContextRegistryService;
  const quiet = { excludeCategories: Object.keys(CLR_CONTEXT_CATEGORIES) as ClrContextCategory[] };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    engine = TestBed.inject(ClrContextService);
    registry = TestBed.inject(ClrContextRegistryService);
  });

  /** A snapshot taken at once, reporting pending providers as loading. */
  function readNow(options: ClrContextSnapshotOptions): ClrPageContext {
    return engine['read'](options);
  }

  it('reports a pending provider as loading in a synchronous snapshot', () => {
    registry.register({ getClrContext: () => new Promise<null>(() => undefined) });

    expect(readNow(quiet).regions).toEqual([{ type: 'clr-loading' }]);
  });

  it('merges what an asynchronous provider resolves to', async () => {
    registry.register({ getClrContext: () => ({ type: 'region', label: 'sync' }) });
    registry.register({ getClrContext: async () => ({ type: 'region', label: 'async' }) });

    const snapshot = await engine.snapshot(quiet);

    expect(snapshot.regions).toEqual([
      { type: 'region', label: 'sync' },
      { type: 'region', label: 'async' },
    ]);
  });

  it('reports a provider that does not answer in time as unavailable', async () => {
    engine.configure({ timeoutMs: 10 });
    registry.register({ getClrContext: () => new Promise<null>(() => undefined) });

    const snapshot = await engine.snapshot(quiet);

    expect(snapshot.regions).toEqual([{ type: 'clr-unavailable' }]);
  });

  it('cuts long text in what providers report', () => {
    const rows = Array.from({ length: 3 }, (_, index) => ({ type: 'row', label: `${index} ${'x'.repeat(2000)}` }));
    registry.register({ getClrContext: () => ({ type: 'region', label: 'Hosts', children: rows }) });

    const snapshot = readNow(quiet);

    expect(snapshot.regions[0].children?.length).toBe(3);
    expect(snapshot.regions[0].children?.[0].label?.length).toBeLessThanOrEqual(100);
  });

  it('stops at a cycle in what a provider reports', () => {
    const region: Record<string, unknown> = { type: 'region', label: 'Hosts', state: { count: 1 } };
    (region['state'] as Record<string, unknown>)['parent'] = region;
    region['children'] = [{ type: 'row', label: 'esx-01', state: { owner: region } }];
    registry.register({ getClrContext: () => region as unknown as ClrComponentContext });

    expect(readNow(quiet).regions).toEqual([
      { type: 'region', label: 'Hosts', state: { count: 1 }, children: [{ type: 'row', label: 'esx-01' }] },
    ]);
  });

  it('asks again a provider whose answer did not arrive in time', async () => {
    engine.configure({ timeoutMs: 10 });
    const getClrContext = vi.fn().mockReturnValue(new Promise<null>(() => undefined));
    registry.register({ getClrContext });

    await engine.snapshot(quiet);
    await engine.snapshot(quiet);

    expect(getClrContext).toHaveBeenCalledTimes(2);
  });

  it('asks again a provider that rejected', async () => {
    const getClrContext = vi.fn().mockImplementation(() => Promise.reject(new Error('down')));
    registry.register({ getClrContext });

    await engine.snapshot(quiet);
    await engine.snapshot(quiet);

    expect(getClrContext).toHaveBeenCalledTimes(2);
  });

  it('forgets a pending answer when its provider is unregistered', () => {
    const getClrContext = vi.fn().mockReturnValue(new Promise<null>(() => undefined));
    const provider = { getClrContext };
    registry.register(provider);
    readNow(quiet);

    registry.unregister(provider);
    registry.register(provider);
    readNow(quiet);

    expect(getClrContext).toHaveBeenCalledTimes(2);
  });

  it('reports a provider that rejects as unavailable, like one that does not answer in time', async () => {
    registry.register({ getClrContext: () => Promise.reject(new Error('offline')) });

    expect((await engine.snapshot(quiet)).regions).toEqual([{ type: 'clr-unavailable' }]);
  });

  it('accepts thenables without catch, and ignores a provider whose then throws', async () => {
    const thenable = { then: (resolve: (value: unknown) => void) => resolve({ type: 'region', label: 'thenable' }) };
    const broken = Object.defineProperty({}, 'then', {
      get: () => {
        throw new Error('broken');
      },
    });
    registry.register({ getClrContext: () => thenable as unknown as Promise<ClrComponentContext> });
    registry.register({ getClrContext: () => broken as Promise<ClrComponentContext> });

    expect(() => readNow(quiet)).not.toThrow();
    expect((await engine.snapshot(quiet)).regions).toContainEqual({ type: 'region', label: 'thenable' });
  });

  it('asks a pending provider once, however many snapshots wait for it', async () => {
    const getClrContext = vi.fn(
      () =>
        new Promise<ClrPublishedContext>(resolve => setTimeout(() => resolve({ type: 'region', label: 'late' }), 10))
    );
    registry.register({ getClrContext });

    readNow(quiet);
    const [first, second] = await Promise.all([engine.snapshot(quiet), engine.snapshot(quiet)]);

    expect(getClrContext).toHaveBeenCalledTimes(1);
    expect(first.regions).toEqual([{ type: 'region', label: 'late' }]);
    expect(second.regions).toEqual(first.regions);
  });

  it('reads the page once providers have answered, so a region redacted meanwhile is withheld', async () => {
    const page = document.createElement('section');
    page.innerHTML = '<label>Card <input value="4111" /></label>';
    document.body.appendChild(page);
    let answer: (context: ClrComponentContext | null) => void = () => undefined;
    registry.register({ getClrContext: () => new Promise(resolve => (answer = resolve)) });
    try {
      engine.configure({ timeoutMs: 1000 });
      const snapshot = engine.snapshot();
      markContext(page, 'redact');
      answer(null);

      expect(JSON.stringify((await snapshot).components)).not.toContain('4111');
    } finally {
      page.remove();
    }
  });

  it('does not let a late answer forget a newer one that is still pending', async () => {
    engine.configure({ timeoutMs: 10 });
    let resolveFirst: (context: ClrComponentContext | null) => void = () => undefined;
    const getClrContext = vi
      .fn()
      .mockReturnValueOnce(new Promise(resolve => (resolveFirst = resolve)))
      .mockReturnValueOnce(new Promise<null>(() => undefined))
      .mockReturnValueOnce(new Promise<null>(() => undefined));
    registry.register({ getClrContext });

    await engine.snapshot(quiet);
    readNow(quiet);
    resolveFirst(null);
    await new Promise(resolve => setTimeout(resolve));
    readNow(quiet);

    expect(getClrContext).toHaveBeenCalledTimes(2);
  });

  it('keeps only the fields a component context has', () => {
    registry.register({
      getClrContext: () =>
        ({
          type: 'region',
          label: 'Hosts',
          extra: true,
          children: [{ type: 'button', label: 'Add', onClick: 'x' }],
        }) as unknown as ClrComponentContext,
    });

    expect(readNow(quiet).regions).toEqual([
      { type: 'region', label: 'Hosts', children: [{ type: 'button', label: 'Add' }] },
    ]);
  });

  it('treats a timeout that is not a usable delay as the longest one or the default', async () => {
    registry.register({
      getClrContext: () => new Promise(resolve => setTimeout(() => resolve({ type: 'region', label: 'late' }), 20)),
    });

    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    for (const timeoutMs of [Infinity, NaN, 2 ** 40]) {
      engine.configure({ timeoutMs });
      expect((await engine.snapshot(quiet)).regions, String(timeoutMs)).toEqual([{ type: 'region', label: 'late' }]);
    }
  });
});

describe('ClrContextService, slotted content', () => {
  let page: HTMLElement;

  beforeEach(() => {
    page = document.createElement('main');
    page.innerHTML = '<card-host><input aria-label="Card number" value="4111111111111111" /></card-host>';
    document.body.appendChild(page);
    const root = (page.querySelector('card-host') as HTMLElement).attachShadow({ mode: 'open' });
    root.innerHTML = '<div><slot></slot></div><button>Pay</button>';
    markContext(root.querySelector('div') as Element, 'redact');
  });

  afterEach(() => page.remove());

  it('withholds what a redacted wrapper in a shadow root shows', async () => {
    const snapshot = await TestBed.inject(ClrContextService).snapshot();
    const text = JSON.stringify(snapshot.components);

    expect(text).toContain('Pay');
    expect(text).not.toContain('4111111111111111');
  });
});
