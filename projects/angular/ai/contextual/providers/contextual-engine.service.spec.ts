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

import { CLR_CONTEXT_OPTIONS, provideClrContextOptions } from './context-options';
import { ClrContextRegistryService } from './context-registry.service';
import { ClrContextEngineService } from './contextual-engine.service';
import { CLR_CONTEXT_PROTOCOL } from '../iframe/context-frame-bridge';
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

    it('resolves host context with null when the page is not embedded', async () => {
      expect(await engine.requestHostContext()).toBeNull();
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

    describe('frame bridge', () => {
      let frame: HTMLIFrameElement;
      let postMessage: jasmine.Spy;

      /** A request from the frame embedded in this page, dispatched the way a browser would. */
      function requestFrom(requestId: string): void {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: { protocol: CLR_CONTEXT_PROTOCOL, kind: 'context-request', requestId },
            origin: window.location.origin,
            source: frame.contentWindow,
          })
        );
      }

      beforeEach(() => {
        frame = document.createElement('iframe');
        document.body.appendChild(frame);
        postMessage = spyOn(frame.contentWindow as Window, 'postMessage');
      });

      afterEach(() => {
        engine.disableFrameBridge();
        frame.remove();
      });

      it('serves snapshots to embedded frames only while the frame bridge is enabled', () => {
        // A title of its own, so the assertion below proves the bridge withholds it rather
        // than passing because the test page happens to have none.
        const title = document.title;
        document.title = 'Invoice 4711 - Acme Corp';

        engine.enableFrameBridge();
        requestFrom('frame-request-1');
        document.title = title;

        expect(postMessage).toHaveBeenCalledWith(
          jasmine.objectContaining({
            kind: 'context-response',
            requestId: 'frame-request-1',
            context: jasmine.objectContaining({ title: '' }),
          }),
          jasmine.anything()
        );

        engine.disableFrameBridge();
        requestFrom('frame-request-1');

        expect(postMessage).toHaveBeenCalledTimes(1);
      });

      it('keeps the running frame bridge when a new configuration is refused', () => {
        engine.enableFrameBridge();
        expect(() => engine.enableFrameBridge({ allowedOrigins: ['chat.example'] })).toThrowError(/not an origin/);

        requestFrom('frame-request-3');

        expect(postMessage).toHaveBeenCalledWith(
          jasmine.objectContaining({ kind: 'context-response', requestId: 'frame-request-3' }),
          jasmine.anything()
        );
      });

      it('stops the previous frame bridge when a new one replaces it', () => {
        engine.enableFrameBridge();
        engine.enableFrameBridge({ allowedOrigins: ['https://chat.example'] });

        requestFrom('frame-request-4');

        expect(postMessage).not.toHaveBeenCalled();
      });

      it('says once when its ceiling has an exclusion list that is not one', () => {
        const warn = spyOn(console, 'warn');

        engine.enableFrameBridge({ snapshot: { excludeSelectors: '.secret' } as unknown as ClrContextSnapshotOptions });

        expect(warn).toHaveBeenCalledOnceWith(
          'Clarity context options: excludeSelectors must be a list, so ".secret" was ignored.'
        );
      });

      it('cleans up the frame bridge and global accessor when destroyed', () => {
        engine.enableFrameBridge();
        engine.enableGlobalAccess('testClrContext');
        engine.ngOnDestroy();

        requestFrom('frame-request-2');

        expect(postMessage).not.toHaveBeenCalled();
        expect(globalAccessor()).toBeUndefined();
      });
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
      extract: () => ({ type: 'grid', label: 'Users', state: { selection: ['Ada'], rowCount: 3 } }),
    });
    engine.enableGlobalAccess('testClrContext');

    try {
      const grid = find(accessor()().components, node => node.type === 'grid')[0];
      expect(grid.state).toEqual({ rowCount: 3, withheld: true });
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
