/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { APP_BASE_HREF } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withHashLocation } from '@angular/router';
import { ClrPublishedContext, publishElementContext } from '@clr/angular/utils';
import type { Mock } from 'vitest';

import { ClrContextRegistryService } from './context-registry.service';
import { ClrContextConfig, ClrContextService } from './contextual-engine.service';
import { CLR_CONTEXT_PROTOCOL } from '../iframe/context-frame-bridge';
import {
  ClrComponentContext,
  ClrContextCategory,
  ClrContextSnapshotOptions,
  ClrPageContext,
} from '../interfaces/context.interface';
import { CLR_CONTEXT_CATEGORIES, CLR_CONTEXT_DEFAULT_OPTIONS, CLR_CONTEXT_PRESETS } from '../snapshot-options';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.Eager })
class RoutedComponent {}

type Accessor = (options?: unknown) => ClrPageContext;

/** The global accessor an engine installed on `window` under `name`. */
function globalAccessor(name = 'testClrContext'): Accessor {
  return (window as unknown as Record<string, Accessor>)[name];
}

function removeGlobal(name: string): void {
  delete (window as unknown as Record<string, unknown>)[name];
}

describe('ClrContextService', () => {
  describe('without configured routes', () => {
    let engine: ClrContextService;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      engine = TestBed.inject(ClrContextService);
    });

    afterEach(() => {
      removeGlobal('testClrContext');
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

      it('withholds which toggle buttons the user pressed, a choice like a ticked box', async () => {
        form.innerHTML +=
          '<button type="button" aria-pressed="true">Pay anonymously</button>' +
          '<div role="group" aria-label="Billing"><button type="button" aria-pressed="false">Monthly</button>' +
          '<button type="button" aria-pressed="true">Annual</button></div>';
        engine.enableGlobalAccess('testClrContext');

        const json = JSON.stringify(snapshotVia());
        expect(json).toContain('Pay anonymously');
        expect(json).not.toContain('"pressed"');
        expect(JSON.stringify(await engine.snapshot())).toContain('"pressed":true');
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
      expect(() => (host['testClrContext'] = () => ({ components: [] as unknown[] }))).toThrowError(TypeError);
      expect(globalAccessor()).toBe(installed);

      engine.disableGlobalAccess();
      expect(globalAccessor()).toBeUndefined();
      engine.enableGlobalAccess('testClrContext');
      expect(globalAccessor()).toEqual(expect.any(Function));
      engine.disableGlobalAccess();
    });

    describe('frame bridge', () => {
      let frame: HTMLIFrameElement;
      let postMessage: Mock;

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
        postMessage = vi.spyOn(frame.contentWindow as Window, 'postMessage').mockImplementation(() => undefined);
      });

      afterEach(() => {
        engine.disableFrameBridge();
        frame.remove();
      });

      /** Lets the bridge finish its asynchronous snapshot and answer. */
      function answered(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve));
      }

      it('serves snapshots to embedded frames only while the frame bridge is enabled', async () => {
        // A title of its own, so the assertion below proves the bridge withholds it rather
        // than passing because the test page happens to have none.
        const title = document.title;
        document.title = 'Invoice 4711 - Acme Corp';

        engine.enableFrameBridge();
        requestFrom('frame-request-1');
        document.title = title;
        await answered();

        expect(postMessage).toHaveBeenCalledWith(
          expect.objectContaining({
            kind: 'context-response',
            requestId: 'frame-request-1',
            context: expect.objectContaining({ title: '' }),
          }),
          expect.anything()
        );

        engine.disableFrameBridge();
        requestFrom('frame-request-1');
        await answered();

        expect(postMessage).toHaveBeenCalledTimes(1);
      });

      it('serves a frame what the global accessor serves, withheld markers included', async () => {
        const form = document.createElement('div');
        form.innerHTML =
          '<label for="filled">Token</label><input id="filled" value="user-typed-secret" />' +
          '<label for="empty">Note</label><input id="empty" />' +
          '<a href="/invoices/4711?token=secret">Invoice</a><div class="search">Find</div>';
        document.body.appendChild(form);
        const unpublish = publishElementContext(form.querySelector('.search') as HTMLElement, () => ({
          type: 'search',
          state: { query: 'published-secret', resultCount: 2 },
          publicKeys: ['resultCount'],
        }));

        try {
          engine.enableFrameBridge();
          engine.enableGlobalAccess('testClrContext');
          requestFrom('frame-request-parity');
          await answered();
          const viaAccessor = globalAccessor()();
          const viaFrame = postMessage.mock.lastCall[0].context as ClrPageContext;

          const textboxes = viaFrame.components.filter(component => component.type === 'textbox');
          expect(textboxes.map(textbox => textbox.state?.['withheld'])).toEqual([true, undefined]);
          expect(JSON.stringify(viaFrame)).not.toContain('secret');
          // Collected moments apart, so only the time may differ.
          expect(JSON.stringify(viaFrame)).toContain('resultCount');
          expect({ ...viaFrame, collectedAt: '' }).toEqual({ ...viaAccessor, collectedAt: '' });
        } finally {
          unpublish();
          form.remove();
          engine.disableGlobalAccess();
        }
      });

      it('keeps the running frame bridge when a new configuration is refused', async () => {
        engine.enableFrameBridge();
        expect(() => engine.enableFrameBridge({ allowedOrigins: ['chat.example'] })).toThrowError(/not an origin/);

        requestFrom('frame-request-3');
        await answered();

        expect(postMessage).toHaveBeenCalledWith(
          expect.objectContaining({ kind: 'context-response', requestId: 'frame-request-3' }),
          expect.anything()
        );
      });

      it('stops the previous frame bridge when a new one replaces it', () => {
        engine.enableFrameBridge();
        engine.enableFrameBridge({ allowedOrigins: ['https://chat.example'] });

        requestFrom('frame-request-4');

        expect(postMessage).not.toHaveBeenCalled();
      });

      it('says once when its ceiling has an exclusion list that is not one', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

        engine.enableFrameBridge({ snapshot: { excludeSelectors: '.secret' } as unknown as ClrContextSnapshotOptions });

        expect(warn).toHaveBeenCalledExactlyOnceWith(
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

describe('ClrContextService, the global accessor as a boundary', () => {
  let engine: ClrContextService;
  let form: HTMLElement;

  function snapshotVia(options?: unknown): ClrPageContext {
    return globalAccessor()(options);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    engine = TestBed.inject(ClrContextService);
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
    engine.enableGlobalAccess('testClrContextCeiling');
    try {
      const accessor = globalAccessor('testClrContextCeiling');
      const snapshot = accessor({ excludeCategories: [], root: 'page', maxComponents: 10_000 });
      expect(types(snapshot)).toEqual(['main']);
      expect(snapshot.components[0].children?.map(node => node.type)).toEqual(['button']);
    } finally {
      engine.disableGlobalAccess();
    }
  });

  it('keeps the application exclusions when an untrusted caller sends as many of its own as a list may hold', () => {
    const engine = engineWith({ scope: { excludeCategories: ['layout'], root: 'main, nav' } });
    engine.enableGlobalAccess('testClrContextPadding', { excludeCategories: ['dialogs'] });
    try {
      const accessor = globalAccessor('testClrContextPadding');
      const junk = Array.from({ length: 60 }, (_, index) => `junk-${index}`);

      expect(types(accessor({ excludeCategories: junk }))).toEqual(['main']);
    } finally {
      engine.disableGlobalAccess();
    }
  });

  it('ignores an exclusion list or a selector an untrusted caller sends, rather than failing', () => {
    const engine = engineWith({ scope: { excludeCategories: ['layout'], root: 'main, nav' } });
    engine.enableGlobalAccess('testClrContextStringList', { excludeCategories: ['dialogs'] });
    try {
      const accessor = globalAccessor('testClrContextStringList');

      expect(types(accessor({ excludeCategories: 'text', root: 'nav' }))).toEqual(['main']);
    } finally {
      engine.disableGlobalAccess();
    }
  });

  it('does not let an untrusted caller set off a warning about the application’s options', () => {
    const engine = engineWith({ scope: { excludeCategories: ['layout'], root: 'main, nav' } });
    engine.enableGlobalAccess('testClrContextWrongKinds');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    try {
      const accessor = globalAccessor('testClrContextWrongKinds');

      expect(types(accessor({ excludeCategories: true, excludeSelectors: 1 }))).toEqual(['main']);
      expect(warn).not.toHaveBeenCalled();
    } finally {
      engine.disableGlobalAccess();
    }
  });

  it('says when the global accessor’s own ceiling has an exclusion list that is not one', () => {
    const engine = engineWith({});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    engine.enableGlobalAccess('testClrContextBadCeiling', { excludeSelectors: 'grid' } as unknown as Parameters<
      typeof engine.enableGlobalAccess
    >[1]);
    engine.disableGlobalAccess();

    expect(warn).toHaveBeenCalledExactlyOnceWith(
      'Clarity context options: excludeSelectors must be a list, so "grid" was ignored.'
    );
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

  describe('for the global accessor', () => {
    function accessorWith(config: ClrContextConfig): Accessor {
      TestBed.configureTestingModule({ providers: [provideRouter([{ path: 'hosts', component: RoutedComponent }])] });
      const engine = TestBed.inject(ClrContextService);
      engine.configure(config);
      engine.enableGlobalAccess('testClrContextRoutes');
      return globalAccessor('testClrContextRoutes');
    }

    afterEach(() => TestBed.inject(ClrContextService).disableGlobalAccess());

    it('lists the routes when the application turned them on', () => {
      expect(accessorWith({ routes: true })().availableRoutes).toEqual([{ path: 'hosts' }]);
    });

    it('does not let a caller turn on routes the application left off', () => {
      expect(accessorWith({})({ routes: true }).availableRoutes).toBeUndefined();
    });
  });
});

describe('ClrContextService, links for the global accessor under other routing setups', () => {
  let page: HTMLElement;

  function hrefs(engine: ClrContextService): unknown[] {
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

    expect(hrefs(TestBed.inject(ClrContextService))).toEqual(['/clusters/:id', undefined]);
  });

  it('reads routes from the fragment with hash routing', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'clusters/:id', component: RoutedComponent }], withHashLocation())],
    });
    page.innerHTML = '<a href="#/clusters/7?token=x">Cluster</a><a href="#/nowhere/at/all">Nowhere</a>';

    expect(hrefs(TestBed.inject(ClrContextService))).toEqual(['/clusters/:id', undefined]);
  });
});

describe('ClrContextService, what the global accessor keeps back', () => {
  let engine: ClrContextService;
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
    engine = TestBed.inject(ClrContextService);
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
    engine.enableGlobalAccess('testClrContext');

    const grid = find(accessor()().components, node => node.type === 'grid')[0];
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
    engine.enableGlobalAccess('testClrContext');

    try {
      expect(JSON.stringify(accessor()().components)).not.toContain('4111');
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
    engine.enableGlobalAccess('testClrContext');

    try {
      expect(accessor()().regions).toEqual([{ type: 'region', label: 'Cart', state: { items: 2, withheld: true } }]);
    } finally {
      unregister();
    }
  });

  it('does not let a caller turn on routes the application left off', () => {
    engine.enableGlobalAccess('testClrContext');

    expect(accessor()({ routes: true }).availableRoutes).toBeUndefined();
  });

  it('reads the scope only as the page or the modal, never as a selector', () => {
    engine.enableGlobalAccess('testClrContext');

    expect(accessor()({ root: 'main' }).components.length).toBeGreaterThan(0);
    expect(accessor()({ root: 7 }).components.length).toBeGreaterThan(0);
  });

  it('does not let a caller raise a budget past the default', () => {
    page.innerHTML = Array.from({ length: 320 }, (_, index) => `<button>Button ${index}</button>`).join('');
    engine.enableGlobalAccess('testClrContext');

    const snapshot = accessor()({ maxComponents: 5000 });

    expect(find(snapshot.components, () => true).length).toBeLessThanOrEqual(CLR_CONTEXT_DEFAULT_OPTIONS.maxComponents);
    expect(snapshot.truncated).toBe(true);
  });

  it('lists the routes of a lazy module once it has loaded', async () => {
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

  afterEach(() => removeGlobal('testClrContext'));

  it('versions every snapshot and names the host when no application is configured', async () => {
    TestBed.configureTestingModule({});
    const snapshot = await TestBed.inject(ClrContextService).snapshot(quiet);

    expect(snapshot.schemaVersion).toBe('1');
    expect(snapshot.application).toEqual({ id: document.location.hostname });
    expect(snapshot.viewId).toBeUndefined();
    expect(snapshot.metadata).toBeUndefined();
  });

  it('reports the configured application, view id and serializable metadata', async () => {
    TestBed.configureTestingModule({});
    const snapshot = await configuredService({
      application: {
        id: 'inventory',
        version: '2.4.0',
        viewId: () => 'host-list',
        metadata: () => ({ purpose: 'Lists hosts', load: () => 'not serializable' }),
      },
    }).snapshot(quiet);

    expect(snapshot.application).toEqual({ id: 'inventory', version: '2.4.0' });
    expect(snapshot.viewId).toBe('host-list');
    expect(snapshot.metadata).toEqual({ purpose: 'Lists hosts' });
  });

  it('takes the view id from the application first, then from the deepest route', async () => {
    let provided: string | undefined = 'from-provider';
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'hosts',
            data: { viewId: 'hosts' },
            children: [{ path: ':id', component: RoutedComponent, data: { viewId: 'host-detail' } }],
          },
        ]),
      ],
    });
    const engine = configuredService({ application: { id: 'inventory', viewId: () => provided } });
    await TestBed.inject(Router).navigateByUrl('/hosts/7');

    expect((await engine.snapshot(quiet)).viewId).toBe('from-provider');
    provided = undefined;
    expect((await engine.snapshot(quiet)).viewId).toBe('host-detail');
  });

  it('does not give a child route the view id of its parent route', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'hosts',
            data: { viewId: 'hosts' },
            children: [{ path: ':id', component: RoutedComponent }],
          },
        ]),
      ],
    });
    const engine = configuredService({ application: { id: 'inventory' } });
    await TestBed.inject(Router).navigateByUrl('/hosts/7');

    expect((await engine.snapshot(quiet)).viewId).toBeUndefined();
  });

  it('survives an application callback that throws', async () => {
    TestBed.configureTestingModule({});
    const snapshot = await configuredService({
      application: {
        id: 'inventory',
        viewId: () => {
          throw new Error('broken');
        },
        metadata: () => {
          throw new Error('broken');
        },
      },
    }).snapshot(quiet);

    expect(snapshot.viewId).toBeUndefined();
    expect(snapshot.metadata).toBeUndefined();
  });

  it('shares the application and view id with the global accessor', () => {
    TestBed.configureTestingModule({});
    configuredService({
      application: { id: 'inventory', version: '2.4.0', viewId: () => 'host-list' },
    }).enableGlobalAccess('testClrContext');
    const snapshot = globalAccessor()(quiet);

    expect(snapshot.application).toEqual({ id: 'inventory', version: '2.4.0' });
    expect(snapshot.viewId).toBe('host-list');
  });
});

describe('ClrContextService, reading only enabled views', () => {
  let metadata: Record<string, unknown> | null;
  let engine: ClrContextService;
  let registry: ClrContextRegistryService;

  beforeEach(() => {
    metadata = null;
    TestBed.configureTestingModule({});
    engine = configuredService({
      application: { id: 'inventory', viewId: () => 'host-list', metadata: () => metadata },
      views: 'enabled',
    });
    registry = TestBed.inject(ClrContextRegistryService);
  });

  it('reports a view without metadata as not enabled, with nothing about the page', async () => {
    const provider = vi.fn().mockReturnValue({ type: 'region', label: 'Hosts' });
    registry.register({ getClrContext: provider });
    engine.enableGlobalAccess('testClrContext');

    try {
      for (const snapshot of [globalAccessor()(), await engine.snapshot()]) {
        expect(snapshot).toEqual({
          schemaVersion: '1',
          application: { id: 'inventory' },
          viewId: 'host-list',
          enabled: false,
          title: '',
          regions: [],
          components: [],
          collectedAt: expect.any(String),
        });
      }
      expect(provider).not.toHaveBeenCalled();
    } finally {
      removeGlobal('testClrContext');
    }
  });

  it('reads a view once it has metadata', async () => {
    metadata = { purpose: 'Lists hosts' };
    registry.register({ getClrContext: () => ({ type: 'region', label: 'Hosts' }) });

    const snapshot = await engine.snapshot();

    expect(snapshot.enabled).toBe(true);
    expect(snapshot.metadata).toEqual({ purpose: 'Lists hosts' });
    expect(snapshot.title).toBe(document.title);
    expect(snapshot.regions).toEqual([{ type: 'region', label: 'Hosts' }]);
  });

  it('reads a view whose metadata is an empty object', async () => {
    metadata = {};

    expect((await engine.snapshot()).enabled).toBe(true);
  });
});

describe('ClrContextService, a view that changes while providers answer', () => {
  const quiet = { excludeCategories: Object.keys(CLR_CONTEXT_CATEGORIES) as ClrContextCategory[] };

  it('describes the new view instead of mixing answers from the old one into it', async () => {
    let view = 'hosts';
    TestBed.configureTestingModule({});
    const engine = configuredService({ application: { id: 'inventory', viewId: () => view } });
    let answer: (context: ClrComponentContext) => void = () => undefined;
    TestBed.inject(ClrContextRegistryService).register({
      getClrContext: () =>
        view === 'hosts' ? new Promise(resolve => (answer = resolve)) : { type: 'region', label: 'VMs' },
    });

    const snapshot = engine.snapshot(quiet);
    view = 'vms';
    answer({ type: 'region', label: 'Hosts' });

    expect((await snapshot).viewId).toBe('vms');
  });

  it('awaits the new view’s providers after a navigation between routes without view ids', async () => {
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

  /** The snapshot `window.clrContext()` and `watch()` take at once, reporting pending providers as loading. */
  function readNow(options: ClrContextSnapshotOptions): ClrPageContext {
    return engine['read'](options, false);
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

  it('holds what providers report to the snapshot budgets', () => {
    const rows = Array.from({ length: 5000 }, (_, index) => ({ type: 'row', label: `${index} ${'x'.repeat(2000)}` }));
    registry.register({ getClrContext: () => ({ type: 'region', label: 'Hosts', children: rows }) });

    const snapshot = readNow({ ...quiet, maxComponents: 20, maxItemsPerCollection: 100 });

    expect(snapshot.truncated).toBe(true);
    expect(snapshot.regions[0].children?.length).toBe(19);
    expect(snapshot.regions[0].children?.[0].label?.length).toBeLessThanOrEqual(100);
    expect(JSON.stringify(snapshot).length).toBeLessThan(5000);
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
      page.setAttribute('data-clr-context-redact', '');
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
    root.innerHTML = '<div data-clr-context-redact><slot></slot></div><button>Pay</button>';
  });

  afterEach(() => page.remove());

  it('withholds what a redacted wrapper in a shadow root shows', async () => {
    const snapshot = await TestBed.inject(ClrContextService).snapshot();
    const text = JSON.stringify(snapshot.components);

    expect(text).toContain('Pay');
    expect(text).not.toContain('4111111111111111');
  });
});
