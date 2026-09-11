/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { provideClrContextOptions } from './context-options';
import { ClrContextRegistryService } from './context-registry.service';
import { ClrContextualEngineService } from './contextual-engine.service';
import { ClrComponentContext, ClrPageContext } from '../interfaces/context.interface';

@Component({ template: '' })
class RoutedComponent {}

describe('ClrContextualEngineService', () => {
  describe('without configured routes', () => {
    let engine: ClrContextualEngineService;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      engine = TestBed.inject(ClrContextualEngineService);
    });

    afterEach(() => {
      delete (window as unknown as Record<string, unknown>)['testClrContext'];
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

      const globalAccessor = (window as unknown as Record<string, unknown>)['testClrContext'] as (
        options?: unknown
      ) => { title: string };
      expect(typeof globalAccessor).toBe('function');
      expect(globalAccessor().title).toBe(document.title);

      engine.disableGlobalAccess();
      expect((window as unknown as Record<string, unknown>)['testClrContext']).toBeUndefined();
    });

    describe('the global accessor', () => {
      let form: HTMLElement;

      function snapshotVia(options?: unknown) {
        const accessor = (window as unknown as Record<string, unknown>)['testClrContext'] as (options?: unknown) => {
          components: { type: string; state?: Record<string, unknown> }[];
        };
        return accessor(options);
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

    it('serves snapshots to embedded frames only while the frame bridge is enabled', () => {
      const postMessage = spyOn(window, 'postMessage');
      const request = {
        protocol: 'ui-context/v1',
        kind: 'context-request',
        requestId: 'frame-request-1',
      };

      engine.enableFrameBridge();
      window.dispatchEvent(
        new MessageEvent('message', { data: request, origin: window.location.origin, source: window })
      );

      expect(postMessage).toHaveBeenCalledWith(
        jasmine.objectContaining({
          kind: 'context-response',
          requestId: 'frame-request-1',
          context: jasmine.objectContaining({ title: document.title }),
        }),
        jasmine.anything()
      );

      engine.disableFrameBridge();
      window.dispatchEvent(
        new MessageEvent('message', { data: request, origin: window.location.origin, source: window })
      );

      expect(postMessage).toHaveBeenCalledTimes(1);
    });

    it('cleans up the frame bridge and global accessor when destroyed', () => {
      const postMessage = spyOn(window, 'postMessage');

      engine.enableFrameBridge();
      engine.enableGlobalAccess('testClrContext');
      engine.ngOnDestroy();

      window.dispatchEvent(
        new MessageEvent('message', {
          data: { protocol: 'ui-context/v1', kind: 'context-request', requestId: 'frame-request-2' },
          origin: window.location.origin,
          source: window,
        })
      );

      expect(postMessage).not.toHaveBeenCalled();
      expect((window as unknown as Record<string, unknown>)['testClrContext']).toBeUndefined();
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
      const engine = TestBed.inject(ClrContextualEngineService);

      await TestBed.inject(Router).navigateByUrl('/items/42?tab=general');
      const route = engine.getSnapshot({ includeDomComponents: false }).route;

      expect(route?.url).toBe('/items/42?tab=general');
      expect(route?.path).toBe('items/:id');
      expect(route?.params).toEqual({ id: '42' });
      expect(route?.queryParams).toEqual({ tab: 'general' });
      expect(route?.data).toEqual({ section: 'items', tags: ['inventory'], meta: { owner: 'core-team' } });
    });
  });
});

describe('ClrContextualEngineService, the global accessor as a boundary', () => {
  let engine: ClrContextualEngineService;
  let form: HTMLElement;

  function snapshotVia(options?: unknown): ClrPageContext {
    const accessor = (window as unknown as Record<string, unknown>)['testClrContext'] as (
      options?: unknown
    ) => ClrPageContext;
    return accessor(options);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    engine = TestBed.inject(ClrContextualEngineService);
    form = document.createElement('div');
    form.innerHTML = '<button>one</button><button>two</button><button>three</button>';
    document.body.appendChild(form);
  });

  afterEach(() => {
    engine.disableGlobalAccess();
    delete (window as unknown as Record<string, unknown>)['testClrContext'];
    delete (window as unknown as Record<string, unknown>)['testClrContextTaken'];
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
    expect(typeof (window as unknown as Record<string, unknown>)['testClrContext']).toBe('function');
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

describe('ClrContextualEngineService, saying when a snapshot is cut off', () => {
  let engine: ClrContextualEngineService;
  let widgets: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    engine = TestBed.inject(ClrContextualEngineService);
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

describe('ClrContextualEngineService, configured once for the application', () => {
  let widgets: HTMLElement;

  beforeEach(() => {
    widgets = document.createElement('div');
    widgets.innerHTML =
      '<nav aria-label="Main"><a href="/a">A</a></nav><main><p>Prose</p><button>Go</button></main>' +
      '<div role="dialog" aria-modal="true" aria-label="Confirm"><button>Yes</button></div>';
    document.body.appendChild(widgets);
  });

  afterEach(() => widgets.remove());

  function engineWith(...providers: unknown[]): ClrContextualEngineService {
    TestBed.configureTestingModule({ providers: providers as never[] });
    return TestBed.inject(ClrContextualEngineService);
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

  it('lets a call override the application options', () => {
    const engine = engineWith(provideClrContextOptions('interactive', { rootSelector: 'main, nav' }));
    expect(types(engine.getSnapshot({ includeText: true, excludeRoles: [] }))).toEqual(['navigation', 'main']);
  });

  it('narrows to the open modal and says so', () => {
    const engine = engineWith(provideClrContextOptions('minimal'));
    const snapshot = engine.getSnapshot();
    expect(snapshot.focus).toBe('modal');
    expect(types(snapshot)).toEqual(['dialog']);
  });
});
