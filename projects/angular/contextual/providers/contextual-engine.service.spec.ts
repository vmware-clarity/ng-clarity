/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { ClrContextRegistryService } from './context-registry.service';
import { ClrContextualEngineService } from './contextual-engine.service';

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
      const snapshot = engine.getSnapshot({ includeDomComponents: false, includeActions: false });

      expect(snapshot.components).toEqual([]);
      expect(snapshot.actions).toBeUndefined();
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

    it('resolves host context with null when the page is not embedded', async () => {
      expect(await engine.requestHostContext()).toBeNull();
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
              data: { section: 'items', resolver: () => 'not serializable' },
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
      expect(route?.data).toEqual({ section: 'items' });
    });
  });
});
