/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { APP_BASE_HREF } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withHashLocation } from '@angular/router';
import { publishElementContext } from '@clr/angular/utils';

import {
  CLR_CONTEXT_OPTIONS,
  ClrContextApplicationOptions,
  provideClrContextApplication,
  provideClrContextOptions,
} from './context-options';
import { ClrContextRegistryService } from './context-registry.service';
import { ClrContextEngineService } from './contextual-engine.service';
import { ClrComponentContext, ClrContextSnapshotOptions, ClrPageContext } from '../interfaces/context.interface';
import { CLR_CONTEXT_DEFAULT_OPTIONS } from '../snapshot-options';

@Component({ template: '' })
class RoutedComponent {}

type Accessor = (options?: unknown) => ClrPageContext;

/** The global accessor an engine installed on `window` under `name`. */
function globalAccessor(name = 'testClrContext'): Accessor {
  return (window as unknown as Record<string, Accessor>)[name];
}

function removeGlobal(name: string): void {
  delete (window as unknown as Record<string, unknown>)[name];
}

describe('ClrContextEngineService', () => {
  describe('without configured routes', () => {
    let engine: ClrContextEngineService;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      engine = TestBed.inject(ClrContextEngineService);
    });

    afterEach(() => {
      removeGlobal('testClrContext');
    });

    it('snapshots the document and reports no route for an unconfigured router', () => {
      const snapshot = engine.getSnapshot();

      expect(snapshot.title).toBe(document.title);
      expect(snapshot.url).toBe(document.location.href);
      expect(snapshot.route).toBeUndefined();
      expect(new Date(snapshot.collectedAt).getTime()).not.toBeNaN();
    });

    it('includes application-registered regions', () => {
      const registry = TestBed.inject(ClrContextRegistryService);
      const unregister = registry.register({ getClrContext: () => ({ type: 'region', label: 'inventory' }) });

      expect(engine.getSnapshot().regions).toEqual([{ type: 'region', label: 'inventory' }]);

      unregister();
      expect(engine.getSnapshot().regions).toEqual([]);
    });

    it('can skip DOM collection entirely', () => {
      const snapshot = engine.getSnapshot({ includeDomComponents: false });

      expect(snapshot.components).toEqual([]);
    });

    it('lets other UI libraries register their own DOM extractors', () => {
      const widget = document.createElement('div');
      widget.className = 'chat-widget';
      document.body.appendChild(widget);
      const unregister = engine.registerDomExtractor({
        selector: '.chat-widget',
        extract: () => ({ type: 'chat', label: 'Support chat' }),
      });

      try {
        expect(engine.getSnapshot().components).toContain(jasmine.objectContaining({ type: 'chat' }));

        unregister();
        expect(engine.getSnapshot().components).not.toContain(jasmine.objectContaining({ type: 'chat' }));
      } finally {
        widget.remove();
      }
    });

    it('exposes and removes a global accessor for browser-driving agents', () => {
      engine.enableGlobalAccess('testClrContext');

      const accessor = globalAccessor();
      expect(typeof accessor).toBe('function');
      // Withheld with the address unless the application shares the full URL.
      expect(accessor().title).toBe('');

      engine.disableGlobalAccess();
      expect(globalAccessor()).toBeUndefined();
    });

    describe('the global accessor', () => {
      let form: HTMLElement;

      function snapshotVia(options?: unknown) {
        return globalAccessor()(options);
      }

      function reportedValue(snapshot: { components: { type: string; state?: Record<string, unknown> }[] }) {
        return snapshot.components.find(component => component.type === 'textbox')?.state?.value;
      }

      beforeEach(() => {
        form = document.createElement('div');
        form.innerHTML = '<label for="secret">Token</label><input id="secret" value="user-typed-secret" />';
        document.body.appendChild(form);
      });

      afterEach(() => {
        engine.disableGlobalAccess();
        form.remove();
      });

      it('withholds what the user typed, because any script on the page can call it', () => {
        // Including a third-party tag, so this cannot be the caller's decision.
        engine.enableGlobalAccess('testClrContext');

        expect(reportedValue(snapshotVia({ shareFormValues: true }))).toBeUndefined();
      });

      it('still describes the field whose value it withholds', () => {
        engine.enableGlobalAccess('testClrContext');

        expect(snapshotVia().components.some(component => component.type === 'textbox')).toBe(true);
      });

      it('withholds what the user chose or ticked as much as what they typed', () => {
        form.innerHTML +=
          '<select multiple aria-label="Roles"><option selected>admin</option><option>viewer</option></select>' +
          '<input type="checkbox" aria-label="Remember" checked />';
        engine.enableGlobalAccess('testClrContext');

        const json = JSON.stringify(snapshotVia());
        expect(json).not.toContain('"selected"');
        expect(json).not.toContain('"checked"');
        expect(json).toContain('"optionCount":2');
      });

      it('withholds which toggle buttons the user pressed, a choice like a ticked box', () => {
        form.innerHTML +=
          '<button type="button" aria-pressed="true">Pay anonymously</button>' +
          '<div role="group" aria-label="Billing"><button type="button" aria-pressed="false">Monthly</button>' +
          '<button type="button" aria-pressed="true">Annual</button></div>';
        engine.enableGlobalAccess('testClrContext');

        const json = JSON.stringify(snapshotVia());
        expect(json).toContain('Pay anonymously');
        expect(json).not.toContain('"pressed"');
        expect(JSON.stringify(engine.getSnapshot())).toContain('"pressed":true');
      });

      it('shares what the user typed only when the application says so', () => {
        engine.enableGlobalAccess('testClrContext', { shareFormValues: true });

        expect(reportedValue(snapshotVia())).toBe('user-typed-secret');
      });

      it('still honours a caller budget the host left open', () => {
        engine.enableGlobalAccess('testClrContext');

        expect(snapshotVia({ maxComponents: 1 }).components.length).toBe(1);
      });
    });

    it('defines the global accessor so that assigning to it does not replace it, and still removes it', () => {
      engine.enableGlobalAccess('testClrContext');
      const installed = globalAccessor();
      const host = window as unknown as Record<string, unknown>;

      // Specs run as modules, in strict mode, where assigning to a read-only property throws.
      expect(() => (host['testClrContext'] = () => ({ components: [] }))).toThrowError(TypeError);
      expect(globalAccessor()).toBe(installed);

      engine.disableGlobalAccess();
      expect(globalAccessor()).toBeUndefined();
      engine.enableGlobalAccess('testClrContext');
      expect(globalAccessor()).toEqual(jasmine.any(Function));
      engine.disableGlobalAccess();
    });

    it('removes the global accessor when destroyed', () => {
      engine.enableGlobalAccess('testClrContext');
      engine.ngOnDestroy();

      expect(globalAccessor()).toBeUndefined();
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
      const engine = TestBed.inject(ClrContextEngineService);

      await TestBed.inject(Router).navigateByUrl('/items/42?tab=general');
      const route = engine.getSnapshot({ includeDomComponents: false }).route;

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
      const engine = TestBed.inject(ClrContextEngineService);

      await TestBed.inject(Router).navigateByUrl('/account');
      const snapshot = engine.getSnapshot({ includeDomComponents: false });

      expect(snapshot.route?.data).toEqual({ section: 'account' });
      expect(JSON.stringify(snapshot)).not.toContain('secret');
    });
  });
});

describe('ClrContextEngineService, the global accessor as a boundary', () => {
  let engine: ClrContextEngineService;
  let form: HTMLElement;

  function snapshotVia(options?: unknown): ClrPageContext {
    return globalAccessor()(options);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    engine = TestBed.inject(ClrContextEngineService);
    form = document.createElement('div');
    form.innerHTML = '<button>one</button><button>two</button><button>three</button>';
    document.body.appendChild(form);
  });

  afterEach(() => {
    engine.disableGlobalAccess();
    removeGlobal('testClrContext');
    removeGlobal('testClrContextTaken');
    form.remove();
  });

  it('refuses a name that is not a plain identifier', () => {
    expect(() => engine.enableGlobalAccess('clr.context')).toThrowError(/not a valid name/);
    expect(() => engine.enableGlobalAccess('')).toThrowError(/not a valid name/);
  });

  it('refuses to overwrite something the page already has under that name', () => {
    (window as unknown as Record<string, unknown>)['testClrContextTaken'] = () => 'someone else';

    expect(() => engine.enableGlobalAccess('testClrContextTaken')).toThrowError(/already exists/);
  });

  it('can be re-enabled under the same name, replacing only its own accessor', () => {
    engine.enableGlobalAccess('testClrContext');
    expect(() => engine.enableGlobalAccess('testClrContext')).not.toThrow();
    expect(typeof globalAccessor()).toBe('function');
  });

  function nodeCount(snapshot: ClrPageContext): number {
    const count = (nodes: ClrComponentContext[]): number =>
      nodes.reduce((total, node) => total + 1 + count(node.children ?? []), 0);
    return count(snapshot.components);
  }

  it('lets a caller ask for less than the application allows, never for more', () => {
    engine.enableGlobalAccess('testClrContext', { maxComponents: 2 });

    expect(nodeCount(snapshotVia({ maxComponents: 1 }))).toBe(1);
    expect(nodeCount(snapshotVia({ maxComponents: 50 }))).toBe(2);
  });

  it('drops a budget that is not a finite number rather than walking without bound', () => {
    engine.enableGlobalAccess('testClrContext', { maxComponents: 2 });

    expect(nodeCount(snapshotVia({ maxComponents: Number.NaN }))).toBe(2);
  });
});

describe('ClrContextEngineService, saying when a snapshot is cut off', () => {
  let engine: ClrContextEngineService;
  let widgets: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    engine = TestBed.inject(ClrContextEngineService);
    widgets = document.createElement('div');
    widgets.innerHTML = '<button>one</button><button>two</button><button>three</button>';
    document.body.appendChild(widgets);
  });

  afterEach(() => widgets.remove());

  it('flags a snapshot whose component budget ran out', () => {
    expect(engine.getSnapshot({ maxComponents: 1 }).truncated).toBe(true);
  });

  it('carries no flag when everything fit', () => {
    expect('truncated' in engine.getSnapshot({ maxComponents: 5000 })).toBe(false);
  });
});

describe('ClrContextEngineService, configured once for the application', () => {
  let widgets: HTMLElement;

  beforeEach(() => {
    widgets = document.createElement('div');
    widgets.innerHTML =
      '<nav aria-label="Main"><a href="/a">A</a></nav><main><p>Prose</p><button>Go</button></main>' +
      '<div role="dialog" aria-modal="true" aria-label="Confirm"><button>Yes</button></div>';
    document.body.appendChild(widgets);
  });

  afterEach(() => widgets.remove());

  function engineWith(...providers: unknown[]): ClrContextEngineService {
    TestBed.configureTestingModule({ providers: providers as never[] });
    return TestBed.inject(ClrContextEngineService);
  }

  function types(snapshot: ClrPageContext): string[] {
    return snapshot.components.map(node => node.type);
  }

  it('applies a preset provided for the whole application', () => {
    const engine = engineWith(provideClrContextOptions('interactive'));
    const snapshot = engine.getSnapshot({ rootSelector: 'main, nav' });
    expect(types(snapshot)).toEqual(['main']);
    expect(snapshot.components[0].children?.map(node => node.type)).toEqual(['button']);
  });

  it('lets a call override the application’s budgets and switches', () => {
    const engine = engineWith(provideClrContextOptions({ rootSelector: 'main', includeText: false }));
    const [main] = engine.getSnapshot({ includeText: true }).components;
    expect(main.children?.map(node => node.type)).toEqual(['text', 'button']);
  });

  it('adds the overrides’ exclusions to explicit options, as it does to a preset', () => {
    const engine = engineWith(
      provideClrContextOptions({ rootSelector: 'main, nav', excludeSelectors: ['nav'] }, { excludeRoles: ['button'] })
    );
    expect(TestBed.inject(CLR_CONTEXT_OPTIONS)).toEqual(
      jasmine.objectContaining({ excludeSelectors: ['nav'], excludeRoles: ['button'] })
    );
    expect(types(engine.getSnapshot())).toEqual(['main']);

    TestBed.resetTestingModule();
    engineWith(provideClrContextOptions({ excludeSelectors: ['nav'] }, { excludeSelectors: ['aside'] }));
    expect(TestBed.inject(CLR_CONTEXT_OPTIONS).excludeSelectors).toEqual(['nav', 'aside']);
  });

  it('adds a call’s exclusions to the application’s rather than replacing them', () => {
    const engine = engineWith(
      provideClrContextOptions('interactive', { rootSelector: 'main, nav', excludeSelectors: ['nav'] })
    );
    expect(types(engine.getSnapshot({ excludeCategories: [], excludeSelectors: [] }))).toEqual(['main']);
    expect(engine.getSnapshot({ excludeRoles: ['button'] }).components[0].children).toBeUndefined();
  });

  it('narrows to the open modal and says so', () => {
    const engine = engineWith(provideClrContextOptions('minimal'));
    const snapshot = engine.getSnapshot();
    expect(snapshot.focus).toBe('modal');
    expect(types(snapshot)).toEqual(['dialog']);
  });

  it('accepts the options themselves, not only a preset name', () => {
    const engine = engineWith(provideClrContextOptions({ rootSelector: 'main' }, { includeText: false }));
    const snapshot = engine.getSnapshot();
    expect(types(snapshot)).toEqual(['main']);
    expect(snapshot.components[0].children?.map(node => node.type)).toEqual(['button']);
  });

  it('holds a caller the application does not control to the application options', () => {
    const engine = engineWith(
      provideClrContextOptions({
        includeText: false,
        excludeRoles: ['navigation'],
        rootSelector: 'main, nav',
        maxComponents: 5,
      })
    );
    engine.enableGlobalAccess('testClrContextCeiling');
    try {
      const accessor = globalAccessor('testClrContextCeiling');
      const snapshot = accessor({ includeText: true, excludeRoles: [], maxComponents: 10_000 });
      expect(types(snapshot)).toEqual(['main']);
      expect(snapshot.components[0].children?.map(node => node.type)).toEqual(['button']);
    } finally {
      engine.disableGlobalAccess();
    }
  });

  it('keeps the application exclusions when an untrusted caller sends as many of its own as a list may hold', () => {
    const engine = engineWith(provideClrContextOptions({ excludeRoles: ['navigation'], rootSelector: 'main, nav' }));
    engine.enableGlobalAccess('testClrContextPadding', { excludeCategories: ['dialogs'] });
    try {
      const accessor = globalAccessor('testClrContextPadding');
      const junk = Array.from({ length: 60 }, (_, index) => `junk-${index}`);

      expect(types(accessor({ excludeRoles: junk, excludeCategories: junk }))).toEqual(['main']);
    } finally {
      engine.disableGlobalAccess();
    }
  });

  it('ignores an exclusion list an untrusted caller sends as a string, rather than failing', () => {
    const engine = engineWith(provideClrContextOptions({ excludeRoles: ['navigation'], rootSelector: 'main, nav' }));
    engine.enableGlobalAccess('testClrContextStringList', { excludeCategories: ['dialogs'] });
    try {
      const accessor = globalAccessor('testClrContextStringList');

      expect(types(accessor({ excludeRoles: 'main', excludeCategories: 'text' }))).toEqual(['main']);
    } finally {
      engine.disableGlobalAccess();
    }
  });

  it('does not let an untrusted caller set off a warning about the application’s options', () => {
    const engine = engineWith(provideClrContextOptions({ excludeRoles: ['navigation'], rootSelector: 'main, nav' }));
    engine.enableGlobalAccess('testClrContextWrongKinds');
    const warn = spyOn(console, 'warn');
    try {
      const accessor = globalAccessor('testClrContextWrongKinds');

      expect(types(accessor({ excludeRoles: 7, excludeCategories: true, excludeSelectors: 1 }))).toEqual(['main']);
      expect(warn).not.toHaveBeenCalled();
    } finally {
      engine.disableGlobalAccess();
    }
  });

  it('says when the global accessor’s own ceiling has an exclusion list that is not one', () => {
    const engine = engineWith(provideClrContextOptions({}));
    const warn = spyOn(console, 'warn');
    engine.enableGlobalAccess('testClrContextBadCeiling', { excludeRoles: 'grid' } as unknown as Parameters<
      typeof engine.enableGlobalAccess
    >[1]);
    engine.disableGlobalAccess();

    expect(warn).toHaveBeenCalledOnceWith(
      'Clarity context options: excludeRoles must be a list, so "grid" was ignored.'
    );
  });
});

describe('ClrContextEngineService, the routes an application can navigate to', () => {
  it('lists configured paths with their titles, leaving wildcards and redirects out', () => {
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
    const engine = TestBed.inject(ClrContextEngineService);

    const routes = engine.getSnapshot({ includeDomComponents: false, includeRoutes: true }).availableRoutes;

    expect(routes).toEqual([
      { path: 'hosts', title: 'Hosts' },
      { path: 'clusters/:id', title: 'Cluster' },
      { path: 'clusters/:id/hosts' },
      { path: 'billing', lazy: true },
    ]);
  });

  it('lists the root path as "/", and never fewer than fifty routes however small the collection budget', () => {
    const many = Array.from({ length: 70 }, (_, index) => ({ path: `page-${index}`, component: RoutedComponent }));
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '', component: RoutedComponent, title: 'Home' }, ...many])],
    });
    const engine = TestBed.inject(ClrContextEngineService);

    const few = engine.getSnapshot({ includeDomComponents: false, includeRoutes: true, maxItemsPerCollection: 5 });
    expect(few.availableRoutes?.[0]).toEqual({ path: '/', title: 'Home' });
    expect(few.availableRoutes?.length).toBe(50);
    const more = engine.getSnapshot({ includeDomComponents: false, includeRoutes: true, maxItemsPerCollection: 60 });
    expect(more.availableRoutes?.length).toBe(60);
  });

  it('leaves out routes matched by a custom matcher, which have no pattern to navigate by, and lists each path once', () => {
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
    const engine = TestBed.inject(ClrContextEngineService);

    const routes = engine.getSnapshot({ includeDomComponents: false, includeRoutes: true }).availableRoutes;

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
    const engine = TestBed.inject(ClrContextEngineService);

    await TestBed.inject(Router).navigateByUrl('/docs/contextual-engine/code');

    expect(engine.getSnapshot({ includeDomComponents: false }).route?.path).toBe('docs/*/*');
  });

  it('lists nothing unless asked', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([{ path: 'hosts', component: RoutedComponent }])] });
    const engine = TestBed.inject(ClrContextEngineService);
    expect('availableRoutes' in engine.getSnapshot({ includeDomComponents: false })).toBe(false);
  });

  describe('for the global accessor', () => {
    function accessorWith(applicationOptions: ClrContextSnapshotOptions, hostOptions = {}): Accessor {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([{ path: 'hosts', component: RoutedComponent }]),
          provideClrContextOptions(applicationOptions),
        ],
      });
      TestBed.inject(ClrContextEngineService).enableGlobalAccess('testClrContextRoutes', hostOptions);
      return globalAccessor('testClrContextRoutes');
    }

    afterEach(() => TestBed.inject(ClrContextEngineService).disableGlobalAccess());

    it('lists the routes when the application turned them on, and the host said nothing', () => {
      const accessor = accessorWith({ includeRoutes: true, includeDomComponents: false });

      expect(accessor().availableRoutes).toEqual([{ path: 'hosts' }]);
      expect(accessor({ includeRoutes: false }).availableRoutes).toBeUndefined();
    });

    it('does not let the host or a caller turn on routes the application turned off', () => {
      const accessor = accessorWith({ includeRoutes: false, includeDomComponents: false }, { includeRoutes: true });

      expect(accessor({ includeRoutes: true }).availableRoutes).toBeUndefined();
    });
  });
});

describe('ClrContextEngineService, links for the global accessor under other routing setups', () => {
  let page: HTMLElement;

  function hrefs(engine: ClrContextEngineService): unknown[] {
    engine.enableGlobalAccess('testClrContext');
    const snapshot = globalAccessor()();
    engine.disableGlobalAccess();
    return snapshot.components.filter(node => node.type === 'link').map(node => node.state?.['href']);
  }

  beforeEach(() => {
    document.querySelectorAll('body > [ng-version]').forEach(root => root.remove());
    page = document.createElement('div');
    document.body.appendChild(page);
  });

  afterEach(() => page.remove());

  it('reads routes below the base href the router uses, without a <base> element', () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'clusters/:id', component: RoutedComponent }]),
        { provide: APP_BASE_HREF, useValue: '/app/' },
      ],
    });
    page.innerHTML = '<a href="/app/clusters/7?token=x">In the app</a><a href="/clusters/7">Outside it</a>';

    expect(hrefs(TestBed.inject(ClrContextEngineService))).toEqual(['/clusters/:id', undefined]);
  });

  it('reads routes from the fragment with hash routing', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'clusters/:id', component: RoutedComponent }], withHashLocation())],
    });
    page.innerHTML = '<a href="#/clusters/7?token=x">Cluster</a><a href="#/nowhere/at/all">Nowhere</a>';

    expect(hrefs(TestBed.inject(ClrContextEngineService))).toEqual(['/clusters/:id', undefined]);
  });
});

describe('ClrContextEngineService, what the global accessor keeps back', () => {
  let engine: ClrContextEngineService;
  let page: HTMLElement;

  function accessor(): Accessor {
    return globalAccessor();
  }

  function find(nodes: ClrComponentContext[], match: (node: ClrComponentContext) => boolean): ClrComponentContext[] {
    return nodes.flatMap(node => [...(match(node) ? [node] : []), ...find(node.children ?? [], match)]);
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'clusters/:id', component: RoutedComponent },
          {
            path: 'billing',
            loadChildren: () => Promise.resolve([{ path: 'invoices', component: RoutedComponent, title: 'Invoices' }]),
          },
        ]),
      ],
    });
    engine = TestBed.inject(ClrContextEngineService);
    // The accessor describes the whole page, and fixtures are not torn down after each
    // spec here (`destroyAfterEach: false`): an earlier spec's root would be described too.
    document.querySelectorAll('body > [ng-version]').forEach(root => root.remove());
    page = document.createElement('div');
    page.innerHTML =
      '<a href="/download?signature=s3cr3t#part">Download</a><a href="/clusters/7?token=s3cr3t">Cluster seven</a>' +
      '<a href="/billing/invoices/2026-s3cr3t">Invoice</a>';
    document.body.appendChild(page);
    await TestBed.inject(Router).navigateByUrl('/clusters/42?token=s3cr3t');
  });

  afterEach(() => {
    engine.disableGlobalAccess();
    page.remove();
  });

  it('reports the route pattern instead of the address, and links as the route they lead to', () => {
    engine.enableGlobalAccess('testClrContext');

    const snapshot = accessor()();

    expect(snapshot.route).toEqual({ url: '/clusters/:id', path: 'clusters/:id' });
    expect(snapshot.url).toBe(`${location.origin}/clusters/:id`);
    expect(find(snapshot.components, node => node.type === 'link').map(link => link.state?.['href'])).toEqual([
      undefined,
      '/clusters/:id',
      '/billing/*/*',
    ]);
    expect(JSON.stringify(snapshot)).not.toContain('s3cr3t');
    expect(JSON.stringify({ url: snapshot.url, route: snapshot.route })).not.toContain('42');
  });

  it('shares the full address only when the application says so', () => {
    engine.enableGlobalAccess('testClrContext', { shareFullUrl: true });

    const snapshot = accessor()();

    expect(snapshot.route?.url).toBe('/clusters/42?token=s3cr3t');
    expect(JSON.stringify(snapshot.components)).toContain('signature=s3cr3t');
    expect(snapshot.title).toBe(document.title);
  });

  it('withholds a selection as much as a typed value', () => {
    const unregister = engine.registerDomExtractor({
      selector: 'a',
      extract: () => ({
        type: 'grid',
        label: 'Users',
        state: { selection: ['Ada'], rowCount: 3 },
        publicKeys: ['rowCount', 'selection'],
      }),
    });
    engine.enableGlobalAccess('testClrContext');

    try {
      const grid = find(accessor()().components, node => node.type === 'grid')[0];
      expect(grid.state).toEqual({ rowCount: 3, withheld: true });
    } finally {
      unregister();
    }
  });

  it('withholds published state its publisher did not mark public', () => {
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
    engine.enableGlobalAccess('testClrContext');

    try {
      const shared = accessor()();
      expect(find(shared.components, node => node.type === 'search')[0].state).toEqual({
        resultCount: 2,
        withheld: true,
      });
      expect(find(shared.components, node => node.label === 'Filter')[0].state).toEqual({ withheld: true });
      expect(shared.regions).toEqual([{ type: 'region', label: 'Cart', state: { withheld: true } }]);
      expect(JSON.stringify(shared)).not.toContain('s3cr3t');
      expect(JSON.stringify(shared)).not.toContain('4111');

      const trusted = engine.getSnapshot();
      expect(find(trusted.components, node => node.type === 'search')[0].state?.['query']).toBe('4111 1111');
      expect(trusted.regions[0].state).toEqual({ coupon: 's3cr3t', items: 2 });
    } finally {
      unpublish();
      unregister();
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
    engine.enableGlobalAccess('testClrContext');

    try {
      expect(accessor()().regions).toEqual([{ type: 'region', label: 'Cart', state: { items: 2, withheld: true } }]);
    } finally {
      unregister();
    }
  });

  it('does not let a caller turn on what the application left at its default', () => {
    engine.enableGlobalAccess('testClrContext');

    expect(accessor()({ includeRoutes: true }).availableRoutes).toBeUndefined();
  });

  it('lets a caller turn on what the application allowed', () => {
    engine.enableGlobalAccess('testClrContext', { includeRoutes: true });

    expect(accessor()({ includeRoutes: true }).availableRoutes?.length).toBeGreaterThan(0);
  });

  it('reads a switch only as a boolean', () => {
    engine.enableGlobalAccess('testClrContext', { includeRoutes: true });

    expect(accessor()({ includeRoutes: 'yes' }).availableRoutes).toBeUndefined();
    expect(accessor()({ includeDomComponents: 0 }).components.length).toBeGreaterThan(0);
  });

  it('does not let a caller raise a budget past the default', () => {
    page.innerHTML = Array.from({ length: 320 }, (_, index) => `<button>Button ${index}</button>`).join('');
    engine.enableGlobalAccess('testClrContext');

    const snapshot = accessor()({ maxComponents: 5000 });

    expect(find(snapshot.components, () => true).length).toBeLessThanOrEqual(CLR_CONTEXT_DEFAULT_OPTIONS.maxComponents);
    expect(snapshot.truncated).toBe(true);
  });

  it('lists the routes of a lazy module once it has loaded', async () => {
    const before = engine.getSnapshot({ includeDomComponents: false, includeRoutes: true }).availableRoutes;
    expect(before).toContain({ path: 'billing', lazy: true });

    await TestBed.inject(Router).navigateByUrl('/billing/invoices');

    const after = engine.getSnapshot({ includeDomComponents: false, includeRoutes: true }).availableRoutes;
    expect(after).toContain({ path: 'billing/invoices', title: 'Invoices' });
    expect(after?.some(route => route.lazy)).toBe(false);
  });
});

describe('ClrContextEngineService, identifying the application and view', () => {
  const quiet = { includeDomComponents: false };

  afterEach(() => removeGlobal('testClrContext'));

  it('versions every snapshot and names the host when no application is provided', () => {
    TestBed.configureTestingModule({});
    const snapshot = TestBed.inject(ClrContextEngineService).getSnapshot(quiet);

    expect(snapshot.schemaVersion).toBe('1');
    expect(snapshot.application).toEqual({ id: document.location.hostname });
    expect(snapshot.viewId).toBeUndefined();
    expect(snapshot.metadata).toBeUndefined();
  });

  it('reports the provided application, view id and serializable metadata', () => {
    TestBed.configureTestingModule({
      providers: [
        provideClrContextApplication({
          id: 'inventory',
          version: '2.4.0',
          viewId: () => 'host-list',
          metadata: () => ({ purpose: 'Lists hosts', load: () => 'not serializable' }),
        }),
      ],
    });
    const snapshot = TestBed.inject(ClrContextEngineService).getSnapshot(quiet);

    expect(snapshot.application).toEqual({ id: 'inventory', version: '2.4.0' });
    expect(snapshot.viewId).toBe('host-list');
    expect(snapshot.metadata).toEqual({ purpose: 'Lists hosts' });
  });

  it('takes the view id from the provider first, then from the deepest route', async () => {
    let provided: string | undefined = 'from-provider';
    TestBed.configureTestingModule({
      providers: [
        provideClrContextApplication({ id: 'inventory', viewId: () => provided }),
        provideRouter([
          {
            path: 'hosts',
            data: { viewId: 'hosts' },
            children: [{ path: ':id', component: RoutedComponent, data: { viewId: 'host-detail' } }],
          },
        ]),
      ],
    });
    const engine = TestBed.inject(ClrContextEngineService);
    await TestBed.inject(Router).navigateByUrl('/hosts/7');

    expect(engine.getSnapshot(quiet).viewId).toBe('from-provider');
    provided = undefined;
    expect(engine.getSnapshot(quiet).viewId).toBe('host-detail');
  });

  it('does not give a child route the view id of its parent route', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideClrContextApplication({ id: 'inventory' }),
        provideRouter([
          {
            path: 'hosts',
            data: { viewId: 'hosts' },
            children: [{ path: ':id', component: RoutedComponent }],
          },
        ]),
      ],
    });
    const engine = TestBed.inject(ClrContextEngineService);
    await TestBed.inject(Router).navigateByUrl('/hosts/7');

    expect(engine.getSnapshot(quiet).viewId).toBeUndefined();
  });

  it('survives a provider that throws', () => {
    TestBed.configureTestingModule({
      providers: [
        provideClrContextApplication({
          id: 'inventory',
          viewId: () => {
            throw new Error('broken');
          },
          metadata: () => {
            throw new Error('broken');
          },
        }),
      ],
    });
    const snapshot = TestBed.inject(ClrContextEngineService).getSnapshot(quiet);

    expect(snapshot.viewId).toBeUndefined();
    expect(snapshot.metadata).toBeUndefined();
  });

  it('shares the application and view id with the global accessor', () => {
    TestBed.configureTestingModule({
      providers: [provideClrContextApplication({ id: 'inventory', version: '2.4.0', viewId: () => 'host-list' })],
    });
    TestBed.inject(ClrContextEngineService).enableGlobalAccess('testClrContext');
    const snapshot = globalAccessor()(quiet);

    expect(snapshot.application).toEqual({ id: 'inventory', version: '2.4.0' });
    expect(snapshot.viewId).toBe('host-list');
  });
});

describe('ClrContextEngineService, reading only enabled views', () => {
  let metadata: Record<string, unknown> | null;
  let engine: ClrContextEngineService;
  let registry: ClrContextRegistryService;

  beforeEach(() => {
    metadata = null;
    TestBed.configureTestingModule({
      providers: [
        provideClrContextApplication({
          id: 'inventory',
          viewId: () => 'host-list',
          metadata: () => metadata,
          views: 'enabled',
        }),
      ],
    });
    engine = TestBed.inject(ClrContextEngineService);
    registry = TestBed.inject(ClrContextRegistryService);
  });

  it('reports a view without metadata as not enabled, with nothing about the page', async () => {
    const provider = jasmine.createSpy('getClrContext').and.returnValue({ type: 'region', label: 'Hosts' });
    registry.register({ getClrContext: provider });

    for (const snapshot of [engine.getSnapshot(), await engine.getSnapshotAsync()]) {
      expect(snapshot).toEqual({
        schemaVersion: '1',
        application: { id: 'inventory' },
        viewId: 'host-list',
        enabled: false,
        title: '',
        regions: [],
        components: [],
        collectedAt: jasmine.any(String),
      });
    }
    expect(provider).not.toHaveBeenCalled();
  });

  it('reads a view once it has metadata', () => {
    metadata = { purpose: 'Lists hosts' };
    registry.register({ getClrContext: () => ({ type: 'region', label: 'Hosts' }) });

    const snapshot = engine.getSnapshot();

    expect(snapshot.enabled).toBeUndefined();
    expect(snapshot.metadata).toEqual({ purpose: 'Lists hosts' });
    expect(snapshot.title).toBe(document.title);
    expect(snapshot.regions).toEqual([{ type: 'region', label: 'Hosts' }]);
  });

  it('reads a view whose metadata is an empty object', () => {
    metadata = {};

    expect(engine.getSnapshot().enabled).toBeUndefined();
  });
});

describe('ClrContextEngineService, a view that changes while providers answer', () => {
  it('describes the new view instead of mixing answers from the old one into it', async () => {
    let view = 'hosts';
    TestBed.configureTestingModule({
      providers: [provideClrContextApplication({ id: 'inventory', viewId: () => view })],
    });
    const engine = TestBed.inject(ClrContextEngineService);
    let answer: (context: ClrComponentContext) => void = () => undefined;
    TestBed.inject(ClrContextRegistryService).register({
      getClrContext: () =>
        view === 'hosts' ? new Promise(resolve => (answer = resolve)) : { type: 'region', label: 'VMs' },
    });

    const snapshot = engine.getSnapshotAsync({ includeDomComponents: false });
    view = 'vms';
    answer({ type: 'region', label: 'Hosts' });

    expect((await snapshot).viewId).toBe('vms');
  });
});

describe('ClrContextEngineService, an unrecognised views setting', () => {
  it('reads only enabled views, with a dev-mode warning', () => {
    spyOn(console, 'warn');
    TestBed.configureTestingModule({
      providers: [
        provideClrContextApplication({
          id: 'inventory',
          views: 'enable' as unknown as ClrContextApplicationOptions['views'],
        }),
      ],
    });

    expect(TestBed.inject(ClrContextEngineService).getSnapshot().enabled).toBeFalse();
    expect(console.warn).toHaveBeenCalled();
  });
});

describe('ClrContextEngineService, asynchronous providers', () => {
  let engine: ClrContextEngineService;
  let registry: ClrContextRegistryService;
  const quiet = { includeDomComponents: false };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    engine = TestBed.inject(ClrContextEngineService);
    registry = TestBed.inject(ClrContextRegistryService);
  });

  it('reports a pending provider as loading in a synchronous snapshot', () => {
    registry.register({ getClrContext: () => new Promise<null>(() => undefined) });

    expect(engine.getSnapshot(quiet).regions).toEqual([{ type: 'clr-loading' }]);
  });

  it('merges what an asynchronous provider resolves to', async () => {
    registry.register({ getClrContext: () => ({ type: 'region', label: 'sync' }) });
    registry.register({ getClrContext: async () => ({ type: 'region', label: 'async' }) });

    const snapshot = await engine.getSnapshotAsync(quiet);

    expect(snapshot.regions).toEqual([
      { type: 'region', label: 'sync' },
      { type: 'region', label: 'async' },
    ]);
  });

  it('reports a provider that does not answer in time as unavailable', async () => {
    registry.register({ getClrContext: () => new Promise<null>(() => undefined) });

    const snapshot = await engine.getSnapshotAsync({ ...quiet, timeoutMs: 10 });

    expect(snapshot.regions).toEqual([{ type: 'clr-unavailable' }]);
  });

  it('holds what providers report to the snapshot budgets', () => {
    const rows = Array.from({ length: 5000 }, (_, index) => ({ type: 'row', label: `${index} ${'x'.repeat(2000)}` }));
    registry.register({ getClrContext: () => ({ type: 'region', label: 'Hosts', children: rows }) });

    const snapshot = engine.getSnapshot({ ...quiet, maxComponents: 20, maxItemsPerCollection: 100, maxTextLength: 50 });

    expect(snapshot.truncated).toBeTrue();
    expect(snapshot.regions[0].children?.length).toBe(19);
    expect(snapshot.regions[0].children?.[0].label?.length).toBeLessThanOrEqual(50);
    expect(JSON.stringify(snapshot).length).toBeLessThan(5000);
  });

  it('stops at a cycle in what a provider reports', () => {
    const region: Record<string, unknown> = { type: 'region', label: 'Hosts', state: { count: 1 } };
    (region['state'] as Record<string, unknown>)['parent'] = region;
    region['children'] = [{ type: 'row', label: 'esx-01', state: { owner: region } }];
    registry.register({ getClrContext: () => region as unknown as ClrComponentContext });

    expect(engine.getSnapshot(quiet).regions).toEqual([
      { type: 'region', label: 'Hosts', state: { count: 1 }, children: [{ type: 'row', label: 'esx-01' }] },
    ]);
  });

  it('asks again a provider whose answer did not arrive in time', async () => {
    const getClrContext = jasmine.createSpy('getClrContext').and.returnValue(new Promise<null>(() => undefined));
    registry.register({ getClrContext });

    await engine.getSnapshotAsync({ ...quiet, timeoutMs: 10 });
    await engine.getSnapshotAsync({ ...quiet, timeoutMs: 10 });

    expect(getClrContext).toHaveBeenCalledTimes(2);
  });

  it('asks again a provider that rejected', async () => {
    const getClrContext = jasmine.createSpy('getClrContext').and.callFake(() => Promise.reject(new Error('down')));
    registry.register({ getClrContext });

    await engine.getSnapshotAsync(quiet);
    await engine.getSnapshotAsync(quiet);

    expect(getClrContext).toHaveBeenCalledTimes(2);
  });

  it('forgets a pending answer when its provider is unregistered', () => {
    const getClrContext = jasmine.createSpy('getClrContext').and.returnValue(new Promise<null>(() => undefined));
    const provider = { getClrContext };
    registry.register(provider);
    engine.getSnapshot(quiet);

    registry.unregister(provider);
    registry.register(provider);
    engine.getSnapshot(quiet);

    expect(getClrContext).toHaveBeenCalledTimes(2);
  });

  it('reports a provider that rejects as unavailable, like one that does not answer in time', async () => {
    registry.register({ getClrContext: () => Promise.reject(new Error('offline')) });

    expect((await engine.getSnapshotAsync(quiet)).regions).toEqual([{ type: 'clr-unavailable' }]);
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

    expect(() => engine.getSnapshot(quiet)).not.toThrow();
    expect((await engine.getSnapshotAsync(quiet)).regions).toContain({ type: 'region', label: 'thenable' });
  });

  it('asks a pending provider once, however many snapshots wait for it', async () => {
    const getClrContext = jasmine
      .createSpy('getClrContext')
      .and.callFake(() => new Promise(resolve => setTimeout(() => resolve({ type: 'region', label: 'late' }), 10)));
    registry.register({ getClrContext });

    engine.getSnapshot(quiet);
    const [first, second] = await Promise.all([engine.getSnapshotAsync(quiet), engine.getSnapshotAsync(quiet)]);

    expect(getClrContext).toHaveBeenCalledTimes(1);
    expect(first.regions).toEqual([{ type: 'region', label: 'late' }]);
    expect(second.regions).toEqual(first.regions);
  });

  it('withholds the state of an answer whose element is in a redacted region by the time it arrives', async () => {
    const section = document.createElement('section');
    document.body.appendChild(section);
    let answer: (context: ClrComponentContext) => void = () => undefined;
    registry.register({ getClrContext: () => new Promise(resolve => (answer = resolve)) }, section);
    try {
      const snapshot = engine.getSnapshotAsync(quiet);
      section.setAttribute('data-clr-context-redact', '');
      answer({ type: 'region', label: 'Payment', state: { card: '4111111111111111' } });

      expect((await snapshot).regions).toEqual([{ type: 'region', label: 'Payment', state: { redacted: true } }]);
    } finally {
      section.remove();
    }
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

    expect(engine.getSnapshot(quiet).regions).toEqual([
      { type: 'region', label: 'Hosts', children: [{ type: 'button', label: 'Add' }] },
    ]);
  });

  it('treats a timeout that is not a usable delay as the longest one or the default', async () => {
    registry.register({
      getClrContext: () => new Promise(resolve => setTimeout(() => resolve({ type: 'region', label: 'late' }), 20)),
    });

    for (const timeoutMs of [Infinity, NaN, 2 ** 40]) {
      expect((await engine.getSnapshotAsync({ ...quiet, timeoutMs })).regions)
        .withContext(String(timeoutMs))
        .toEqual([{ type: 'region', label: 'late' }]);
    }
  });
});

describe('ClrContextEngineService, slotted content', () => {
  let page: HTMLElement;

  beforeEach(() => {
    page = document.createElement('main');
    page.innerHTML = '<card-host><input aria-label="Card number" value="4111111111111111" /></card-host>';
    document.body.appendChild(page);
    const root = (page.querySelector('card-host') as HTMLElement).attachShadow({ mode: 'open' });
    root.innerHTML = '<div data-clr-context-redact><slot></slot></div><button>Pay</button>';
  });

  afterEach(() => page.remove());

  it('withholds what a redacted wrapper in a shadow root shows', () => {
    const snapshot = TestBed.inject(ClrContextEngineService).getSnapshot();
    const text = JSON.stringify(snapshot.components);

    expect(text).toContain('Pay');
    expect(text).not.toContain('4111111111111111');
  });
});
