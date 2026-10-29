/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, EnvironmentProviders, Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withHashLocation } from '@angular/router';

import {
  ClrContextApplicationOptions,
  ClrContextConfig,
  provideClrContextApplication,
  provideClrContextConfig,
} from './context-options';
import { ClrContextEngineService } from './contextual-engine.service';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.Eager })
class RoutedComponent {}

const quiet = { includeDomComponents: false };

describe('ClrContextEngineService, view metadata', () => {
  let page: HTMLElement;

  function engineWith(
    application: Partial<ClrContextApplicationOptions> = {},
    ...providers: (Provider | EnvironmentProviders)[]
  ): ClrContextEngineService {
    TestBed.configureTestingModule({
      providers: [provideClrContextApplication({ id: 'inventory', ...application }), ...providers],
    });
    return TestBed.inject(ClrContextEngineService);
  }

  function respondWith(...bodies: (object | null)[]): jasmine.Spy {
    const responses = bodies.map(body =>
      body ? new Response(JSON.stringify(body)) : new Response('', { status: 404 })
    );
    return spyOn(window, 'fetch').and.returnValues(...responses.map(response => Promise.resolve(response)));
  }

  beforeEach(() => {
    page = document.createElement('main');
    page.className = 'test-page';
    document.body.appendChild(page);
  });

  afterEach(() => {
    page.remove();
    document.body.removeAttribute('data-ai-metadata');
  });

  describe('data-ai-metadata', () => {
    it('reads the view metadata from the view root and its ancestors, inner winning', () => {
      document.body.setAttribute('data-ai-metadata', '{"viewId":"page","purpose":"Page","owner":"core"}');
      page.setAttribute('data-ai-metadata', '{"viewId":"hosts","purpose":"Hosts"}');
      const engine = engineWith({ viewId: () => 'provided', metadata: () => ({ owner: 'app', team: 'infra' }) });

      const snapshot = engine.getSnapshot({ ...quiet, rootSelector: '.test-page' });

      expect(snapshot.viewId).toBe('hosts');
      expect(snapshot.metadata).toEqual({ viewId: 'hosts', purpose: 'Hosts', owner: 'core', team: 'infra' });
    });

    it('ignores metadata outside the view root', () => {
      page.setAttribute('data-ai-metadata', '{"purpose":"Hosts"}');
      const engine = engineWith();

      expect(engine.getSnapshot(quiet).metadata).toBeUndefined();
    });

    it('enables a view that has page metadata', () => {
      document.body.setAttribute('data-ai-metadata', '{"purpose":"Hosts"}');
      const engine = engineWith({ views: 'enabled' });

      expect(engine.getSnapshot(quiet).enabled).toBeUndefined();
    });

    it('leaves out metadata that is not a JSON object', () => {
      spyOn(console, 'warn');
      document.body.setAttribute('data-ai-metadata', '["not", "an", "object"]');
      const engine = engineWith();

      expect(engine.getSnapshot(quiet).metadata).toBeUndefined();
      expect(console.warn).toHaveBeenCalled();
    });

    it('leaves out metadata in an ignored, redacted or excluded region', () => {
      page.setAttribute('data-ai-metadata', '{"accountSecret":"s3cr3t"}');
      const engine = engineWith();
      for (const marker of ['data-clr-context-ignore', 'data-clr-context-redact']) {
        document.body.setAttribute(marker, '');
        try {
          expect(JSON.stringify(engine.getSnapshot(quiet)))
            .withContext(marker)
            .not.toContain('s3cr3t');
        } finally {
          document.body.removeAttribute(marker);
        }
      }
      expect(JSON.stringify(engine.getSnapshot({ ...quiet, excludeSelectors: ['.test-page'] }))).not.toContain(
        's3cr3t'
      );
    });

    it('gives each snapshot its own copy of the metadata, so a consumer cannot change the next one', () => {
      const settings: Record<string, unknown> = { allowed: true };
      settings['self'] = settings;
      const engine = engineWith({ metadata: () => ({ settings }) });

      const snapshot = engine.getSnapshot(quiet);
      (snapshot.metadata?.['settings'] as Record<string, unknown>)['allowed'] = false;

      expect(() => JSON.stringify(snapshot)).not.toThrow();
      expect(settings['allowed']).toBeTrue();
      expect((engine.getSnapshot(quiet).metadata?.['settings'] as Record<string, unknown>)['allowed']).toBeTrue();
    });
  });

  describe('data-ai-metadata-url', () => {
    beforeEach(() => {
      page.setAttribute('data-ai-metadata-url', '/assets/hosts.json');
      page.setAttribute('data-ai-metadata', '{"purpose":"Inline"}');
    });

    it('reports the URL as loading, then merges what it loaded under the inline metadata', async () => {
      const fetch = respondWith({ purpose: 'Loaded', help: 'https://docs.example.com' });
      const engine = engineWith();
      const options = { ...quiet, rootSelector: '.test-page' };

      const loading = engine.getSnapshot(options);
      const loaded = await engine.getSnapshotAsync(options);

      expect(loading.metadataState).toBe('loading');
      expect(loaded.metadataState).toBeUndefined();
      expect(loaded.metadata).toEqual({ purpose: 'Inline', help: 'https://docs.example.com' });
      expect(engine.getSnapshot(options).metadata).toEqual(loaded.metadata);
      expect(fetch).toHaveBeenCalledOnceWith(new URL('/assets/hosts.json', document.baseURI).href, {
        credentials: 'same-origin',
      });
    });

    it('reports a URL that failed to load as unavailable', async () => {
      respondWith(null);
      const engine = engineWith();

      const snapshot = await engine.getSnapshotAsync({ ...quiet, rootSelector: '.test-page' });

      expect(snapshot.metadataState).toBe('unavailable');
      expect(snapshot.metadata).toEqual({ purpose: 'Inline' });
    });

    it('reports a URL that did not answer in time as unavailable', async () => {
      spyOn(window, 'fetch').and.returnValue(new Promise<Response>(() => undefined));
      const engine = engineWith();

      const snapshot = await engine.getSnapshotAsync({ ...quiet, rootSelector: '.test-page', timeoutMs: 10 });

      expect(snapshot.metadataState).toBe('unavailable');
    });

    it('loads from another origin only when the application allows it', async () => {
      page.setAttribute('data-ai-metadata-url', 'https://help.example.com/hosts.json');
      const fetch = respondWith({ help: 'loaded' });
      const options = { ...quiet, rootSelector: '.test-page' };

      expect((await engineWith().getSnapshotAsync(options)).metadataState).toBe('unavailable');
      expect(fetch).not.toHaveBeenCalled();

      TestBed.resetTestingModule();
      const allowed = engineWith({ metadataOrigins: ['https://help.example.com'] });
      expect((await allowed.getSnapshotAsync(options)).metadata).toEqual({ help: 'loaded', purpose: 'Inline' });
    });
  });

  describe('views configuration', () => {
    const config: ClrContextConfig = {
      views: [
        { route: '/hosts/:id', viewId: 'host-detail', metadata: { purpose: 'One host' } },
        { selector: '.test-page .wizard', enabled: false },
        { route: 'settings', enabled: true },
      ],
    };

    function routedEngine(views: 'all' | 'enabled', configOrUrl: ClrContextConfig | string = config) {
      return engineWith(
        { views },
        provideClrContextConfig(configOrUrl),
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
      const snapshot = engine.getSnapshot(quiet);

      expect(snapshot.viewId).toBe('host-detail');
      expect(snapshot.metadata).toEqual({ purpose: 'One host' });
      expect(snapshot.enabled).toBeUndefined();
    });

    it('lets the page metadata win over the configuration', async () => {
      document.body.setAttribute('data-ai-metadata', '{"viewId":"host","purpose":"From the page"}');
      const engine = routedEngine('all');

      await TestBed.inject(Router).navigateByUrl('/hosts/7');

      expect(engine.getSnapshot(quiet).metadata).toEqual({ viewId: 'host', purpose: 'From the page' });
      expect(engine.getSnapshot(quiet).viewId).toBe('host');
    });

    it('enables or disables views whatever the mode', async () => {
      page.innerHTML = '<div class="wizard"></div>';
      const engine = routedEngine('all');

      expect(engine.getSnapshot(quiet).enabled).toBeFalse();

      page.innerHTML = '';
      TestBed.resetTestingModule();
      const enabledOnly = routedEngine('enabled');
      await TestBed.inject(Router).navigateByUrl('/settings');
      expect(enabledOnly.getSnapshot(quiet).enabled).toBeUndefined();
    });

    it('loads the configuration from a URL', async () => {
      respondWith(config);
      const engine = routedEngine('all', '/assets/ai-config.json');

      await TestBed.inject(Router).navigateByUrl('/hosts/7');

      expect(engine.getSnapshot(quiet).metadataState).toBe('loading');
      const loaded = await engine.getSnapshotAsync(quiet);
      expect(loaded.viewId).toBe('host-detail');
      expect(loaded.metadataState).toBeUndefined();
    });

    it('reads no view while its configuration URL loads, or after it failed to load', async () => {
      page.innerHTML = '<button>Private</button>';
      respondWith(null);
      const engine = routedEngine('all', '/assets/ai-config.json');

      const loading = engine.getSnapshot();
      expect(loading.enabled).toBeFalse();
      expect(JSON.stringify(loading)).not.toContain('Private');

      const failed = await engine.getSnapshotAsync();
      expect(failed.enabled).toBeFalse();
      expect(JSON.stringify(failed)).not.toContain('Private');
    });

    it('returns no metadata for a disabled view, only which view it is', () => {
      page.innerHTML = '<div class="wizard"></div>';
      document.body.setAttribute('data-ai-metadata', '{"viewId":"wizard","secret":"s3cr3t"}');
      const snapshot = routedEngine('all').getSnapshot(quiet);

      expect(snapshot.enabled).toBeFalse();
      expect(snapshot.viewId).toBe('wizard');
      expect(snapshot.metadata).toBeUndefined();
    });
  });
});
