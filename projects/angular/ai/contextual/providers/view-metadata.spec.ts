/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, EnvironmentProviders, Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withHashLocation } from '@angular/router';
import type { Mock } from 'vitest';

import {
  ClrContextApplicationOptions,
  ClrContextConfig,
  ClrContextService,
  ClrContextViewConfig,
} from './contextual-engine.service';
import { ClrContextCategory, ClrContextSnapshotOptions, ClrPageContext } from '../interfaces/context.interface';
import { CLR_CONTEXT_CATEGORIES } from '../snapshot-options';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.Eager })
class RoutedComponent {}

const quiet = { excludeCategories: Object.keys(CLR_CONTEXT_CATEGORIES) as ClrContextCategory[] };

describe('ClrContextService, view metadata', () => {
  let page: HTMLElement;

  function engineWith(
    {
      application,
      ...config
    }: Omit<ClrContextConfig, 'application'> & {
      application?: Partial<ClrContextApplicationOptions>;
    } = {},
    ...providers: (Provider | EnvironmentProviders)[]
  ): ClrContextService {
    TestBed.configureTestingModule({ providers });
    const engine = TestBed.inject(ClrContextService);
    engine.configure({ ...config, application: { id: 'inventory', ...application } });
    return engine;
  }

  /** A snapshot taken at once, reporting what still loads as loading. */
  function now(engine: ClrContextService, options?: ClrContextSnapshotOptions): ClrPageContext {
    return engine['read'](options);
  }

  function respondWith(...bodies: (object | null)[]): Mock {
    const responses = bodies.map(body =>
      body ? new Response(JSON.stringify(body)) : new Response('', { status: 404 })
    );
    // Answers these in turn, then nothing, without reaching the network.
    const fetch = vi.spyOn(window, 'fetch').mockImplementation(() => undefined as unknown as Promise<Response>);
    responses.forEach(response => fetch.mockResolvedValueOnce(response));
    return fetch;
  }

  beforeEach(() => {
    page = document.createElement('main');
    page.className = 'test-page';
    document.body.appendChild(page);
  });

  afterEach(() => {
    page.remove();
    document.body.removeAttribute('data-clr-context-state');
    document.body.removeAttribute('data-clr-context');
  });

  describe('data-clr-context-state', () => {
    it('reads the view metadata from the view root and its ancestors, inner winning', () => {
      document.body.setAttribute('data-clr-context-state', '{"viewId":"page","purpose":"Page","owner":"core"}');
      page.setAttribute('data-clr-context-state', '{"viewId":"hosts","purpose":"Hosts"}');
      const engine = engineWith({
        application: { viewId: () => 'provided', metadata: () => ({ owner: 'app', team: 'infra' }) },
      });

      const snapshot = now(engine, { ...quiet, root: '.test-page' });

      expect(snapshot.viewId).toBe('hosts');
      expect(snapshot.metadata).toEqual({ viewId: 'hosts', purpose: 'Hosts', owner: 'core', team: 'infra' });
    });

    it('adds the label to the metadata', () => {
      document.body.setAttribute('data-clr-context', 'Host list');
      document.body.setAttribute('data-clr-context-state', '{"viewId":"hosts","owner":"ada","purpose":"Hosts"}');
      const engine = engineWith();

      expect(now(engine, quiet).metadata).toEqual({
        label: 'Host list',
        viewId: 'hosts',
        owner: 'ada',
        purpose: 'Hosts',
      });
    });

    it('ignores metadata outside the view root', () => {
      page.setAttribute('data-clr-context-state', '{"purpose":"Hosts"}');
      const engine = engineWith();

      expect(now(engine, quiet).metadata).toBeUndefined();
    });

    it('enables a view that has page metadata', () => {
      document.body.setAttribute('data-clr-context-state', '{"purpose":"Hosts"}');
      const engine = engineWith({ views: 'enabled' });

      expect(now(engine, quiet).enabled).toBe(true);
    });

    it('leaves out metadata that is not a JSON object', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      document.body.setAttribute('data-clr-context-state', '["not", "an", "object"]');
      const engine = engineWith();

      expect(now(engine, quiet).metadata).toBeUndefined();
      expect(console.warn).toHaveBeenCalled();
    });

    it('leaves out metadata in an ignored, redacted or excluded region', () => {
      page.setAttribute('data-clr-context-state', '{"accountSecret":"s3cr3t"}');
      const engine = engineWith();
      for (const marker of ['data-clr-context-ignore', 'data-clr-context-redact']) {
        document.body.setAttribute(marker, '');
        try {
          expect(JSON.stringify(now(engine, quiet)), marker).not.toContain('s3cr3t');
        } finally {
          document.body.removeAttribute(marker);
        }
      }
      expect(JSON.stringify(now(engine, { ...quiet, excludeSelectors: ['.test-page'] }))).not.toContain('s3cr3t');
    });

    it('gives each snapshot its own copy of the metadata, so a consumer cannot change the next one', () => {
      const settings: Record<string, unknown> = { allowed: true };
      settings['self'] = settings;
      const engine = engineWith({ application: { metadata: () => ({ settings }) } });

      const snapshot = now(engine, quiet);
      (snapshot.metadata?.['settings'] as Record<string, unknown>)['allowed'] = false;

      expect(() => JSON.stringify(snapshot)).not.toThrow();
      expect(settings['allowed']).toBe(true);
      expect((now(engine, quiet).metadata?.['settings'] as Record<string, unknown>)['allowed']).toBe(true);
    });
  });

  describe('data-clr-context-url', () => {
    beforeEach(() => {
      page.setAttribute('data-clr-context-url', '/assets/hosts.json');
      page.setAttribute('data-clr-context-state', '{"purpose":"Inline"}');
    });

    it('reports the URL as loading, then merges what it loaded under the inline metadata', async () => {
      const fetch = respondWith({ state: { purpose: 'Loaded', help: 'https://docs.example.com' } });
      const engine = engineWith();
      const options = { ...quiet, root: '.test-page' };

      const loading = now(engine, options);
      const loaded = await engine.snapshot(options);

      expect(loading.metadataState).toBe('loading');
      expect(loaded.metadataState).toBeUndefined();
      expect(loaded.metadata).toEqual({ purpose: 'Inline', help: 'https://docs.example.com' });
      expect(now(engine, options).metadata).toEqual(loaded.metadata);
      expect(fetch).toHaveBeenCalledExactlyOnceWith(new URL('/assets/hosts.json', document.baseURI).href, {
        credentials: 'same-origin',
      });
    });

    it('reports a URL that failed to load as unavailable', async () => {
      respondWith(null);
      const engine = engineWith();

      const snapshot = await engine.snapshot({ ...quiet, root: '.test-page' });

      expect(snapshot.metadataState).toBe('unavailable');
      expect(snapshot.metadata).toEqual({ purpose: 'Inline' });
    });

    it('reports a URL that did not answer in time as unavailable', async () => {
      vi.spyOn(window, 'fetch').mockReturnValue(new Promise<Response>(() => undefined));
      const engine = engineWith({ timeoutMs: 10 });

      const snapshot = await engine.snapshot({ ...quiet, root: '.test-page' });

      expect(snapshot.metadataState).toBe('unavailable');
    });

    it('loads from another origin only when the application allows it', async () => {
      page.setAttribute('data-clr-context-url', 'https://help.example.com/hosts.json');
      const fetch = respondWith({ state: { help: 'loaded' } });
      const options = { ...quiet, root: '.test-page' };

      expect((await engineWith().snapshot(options)).metadataState).toBe('unavailable');
      expect(fetch).not.toHaveBeenCalled();

      TestBed.resetTestingModule();
      const allowed = engineWith({ metadataOrigins: ['https://help.example.com'] });
      expect((await allowed.snapshot(options)).metadata).toEqual({ help: 'loaded', purpose: 'Inline' });
    });
  });

  describe('views configuration', () => {
    const config: ClrContextViewConfig[] = [
      { route: '/hosts/:id', viewId: 'host-detail', metadata: { purpose: 'One host' } },
      { selector: '.test-page .wizard', enabled: false },
      { route: 'settings', enabled: true },
    ];

    function routedEngine(views: 'all' | 'enabled', viewConfig: ClrContextViewConfig[] | string = config) {
      return engineWith(
        { views, viewConfig },
        provideRouter(
          [
            { path: 'hosts/:id', component: RoutedComponent },
            { path: 'settings', component: RoutedComponent },
          ],
          withHashLocation()
        )
      );
    }

    afterEach(async () => {
      await TestBed.inject(Router).navigateByUrl('/');
    });

    it('describes the view matching the route', async () => {
      const engine = routedEngine('enabled');

      await TestBed.inject(Router).navigateByUrl('/hosts/7');
      const snapshot = now(engine, quiet);

      expect(snapshot.viewId).toBe('host-detail');
      expect(snapshot.metadata).toEqual({ purpose: 'One host' });
      expect(snapshot.enabled).toBe(true);
    });

    it('lets the page metadata win over the configuration', async () => {
      document.body.setAttribute('data-clr-context-state', '{"viewId":"host","purpose":"From the page"}');
      const engine = routedEngine('all');

      await TestBed.inject(Router).navigateByUrl('/hosts/7');

      expect(now(engine, quiet).metadata).toEqual({ viewId: 'host', purpose: 'From the page' });
      expect(now(engine, quiet).viewId).toBe('host');
    });

    it('enables or disables views whatever the mode', async () => {
      page.innerHTML = '<div class="wizard"></div>';
      const engine = routedEngine('all');

      expect(now(engine, quiet).enabled).toBe(false);

      page.innerHTML = '';
      TestBed.resetTestingModule();
      const enabledOnly = routedEngine('enabled');
      await TestBed.inject(Router).navigateByUrl('/settings');
      expect(now(enabledOnly, quiet).enabled).toBe(true);
    });

    it('loads the configuration from a URL', async () => {
      respondWith({ views: config });
      const engine = routedEngine('all', '/assets/ai-config.json');

      await TestBed.inject(Router).navigateByUrl('/hosts/7');

      expect(now(engine, quiet).metadataState).toBe('loading');
      const loaded = await engine.snapshot(quiet);
      expect(loaded.viewId).toBe('host-detail');
      expect(loaded.metadataState).toBeUndefined();
    });

    it('reads no view while its configuration URL loads, or after it failed to load', async () => {
      page.innerHTML = '<button>Private</button>';
      respondWith(null);
      const engine = routedEngine('all', '/assets/ai-config.json');

      const loading = now(engine);
      expect(loading.enabled).toBe(false);
      expect(JSON.stringify(loading)).not.toContain('Private');

      const failed = await engine.snapshot();
      expect(failed.enabled).toBe(false);
      expect(JSON.stringify(failed)).not.toContain('Private');
    });

    it('returns no metadata for a disabled view, only which view it is', () => {
      page.innerHTML = '<div class="wizard"></div>';
      document.body.setAttribute('data-clr-context-state', '{"viewId":"wizard","secret":"s3cr3t"}');
      const snapshot = now(routedEngine('all'), quiet);

      expect(snapshot.enabled).toBe(false);
      expect(snapshot.viewId).toBe('wizard');
      expect(snapshot.metadata).toBeUndefined();
    });
  });
});
