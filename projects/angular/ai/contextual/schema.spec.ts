/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import Ajv from 'ajv/dist/2020';
import { onTestFinished } from 'vitest';

import { conformingSnapshot } from './conform';
import { ClrComponentContext, ClrPageContext } from './interfaces/context.interface';
import { ClrContextRegistryService } from './providers/context-registry.service';
import { ClrContextService } from './providers/contextual-engine.service';
import { CLR_PAGE_CONTEXT_SCHEMA } from './schema';
import { validate as generatedValidator } from './schemas/page-context.validator';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.Eager })
class RoutedComponent {}

/** A page like the demo's: a grid, a form, tabs and a modal, one part inside a shadow root. */
const DEMO_PAGE = `
  <h1>Hosts</h1>
  <div role="tablist"><button role="tab" aria-selected="true">All</button><button role="tab">Down</button></div>
  <div role="grid" aria-label="Hosts">
    <div role="row"><span role="columnheader" aria-sort="ascending">Name</span></div>
    <div role="row" aria-selected="true"><span role="gridcell">esx-01</span></div>
  </div>
  <form aria-label="Filter"><label>Name <input value="esx" /></label><select><option>Up</option></select></form>
  <div role="dialog" aria-label="Delete host"><button>Delete</button></div>
  <shadow-panel></shadow-panel>
`;

describe('CLR_PAGE_CONTEXT_SCHEMA', () => {
  // A default Ajv, as a consumer would create it: unknown formats or keywords would throw here.
  const validate = new Ajv().compile(CLR_PAGE_CONTEXT_SCHEMA);
  let host: HTMLElement;

  beforeEach(() => {
    host = document.createElement('main');
    host.innerHTML = DEMO_PAGE;
    document.body.appendChild(host);
    const panel = (host.querySelector('shadow-panel') as HTMLElement).attachShadow({ mode: 'open' });
    panel.innerHTML = '<section aria-label="Details"><button aria-pressed="true">Pin</button></section>';
  });

  afterEach(() => {
    host.remove();
  });

  function engineWith(views: 'all' | 'enabled' = 'all') {
    TestBed.configureTestingModule({ providers: [provideRouter([{ path: 'hosts', component: RoutedComponent }])] });
    TestBed.inject(ClrContextRegistryService).register({
      getClrContext: () => ({ type: 'region', label: 'Hosts', state: { count: 3 }, extra: 'dropped' }) as never,
    });
    const engine = TestBed.inject(ClrContextService);
    engine.configure({ application: { id: 'inventory' }, views });
    return engine;
  }

  function expectValid(snapshot: unknown) {
    expect(validate(snapshot), JSON.stringify(validate.errors)).toBe(true);
  }

  it('describes a page with provider regions and shadow content', async () => {
    const snapshot = await engineWith().snapshot();

    expect(JSON.stringify(snapshot.components)).toContain('Pin');
    expect(snapshot.regions.length).toBe(1);
    expect(Object.keys(snapshot.regions[0])).not.toContain('extra');
    expectValid(snapshot);
  });

  it('describes a route with repeated query parameters', async () => {
    const engine = engineWith();

    await TestBed.inject(Router).navigateByUrl('/hosts?tag=a&tag=b&page=2');
    const snapshot = await engine.snapshot();

    expect(snapshot.route?.queryParams).toEqual({ tag: ['a', 'b'], page: '2' });
    expectValid(snapshot);
  });

  it('describes the snapshot of a view that is not enabled', async () => {
    const snapshot = await engineWith('enabled').snapshot();

    expect(snapshot.enabled).toBe(false);
    expectValid(snapshot);
  });

  it('accepts top-level fields a later release adds', async () => {
    expectValid({ ...(await engineWith().snapshot()), addedLater: true });
  });

  it('rejects unknown properties below the top level, a missing enabled flag and a different schema version', async () => {
    const { enabled, ...withoutEnabled } = await engineWith().snapshot();
    const snapshot = { ...withoutEnabled, enabled };

    expect(validate({ ...snapshot, application: { ...snapshot.application, extra: true } })).toBe(false);
    expect(validate({ ...snapshot, components: [{ type: 'button', extra: true }] })).toBe(false);
    expect(validate(withoutEnabled)).toBe(false);
    expect(validate({ ...snapshot, schemaVersion: '1' })).toBe(false);
  });
});

/** Every key of `T`, so the compiler fails when the interface gains one the list below misses. */
type Keys<T> = { [K in keyof Required<T>]: true };
/** The keys of `T` that are not optional. */
type RequiredKeys<T> = { [K in keyof T]-?: object extends Pick<T, K> ? never : K }[keyof T];

describe('CLR_PAGE_CONTEXT_SCHEMA and the TypeScript types', () => {
  const page: Keys<ClrPageContext> = {
    schemaVersion: true,
    application: true,
    metadata: true,
    enabled: true,
    title: true,
    url: true,
    route: true,
    availableRoutes: true,
    regions: true,
    components: true,
    truncated: true,
    modal: true,
    collectedAt: true,
  };
  const component: Keys<ClrComponentContext> = {
    type: true,
    element: true,
    ref: true,
    label: true,
    state: true,
    children: true,
  };
  const required: Record<RequiredKeys<ClrPageContext>, true> = {
    schemaVersion: true,
    application: true,
    enabled: true,
    title: true,
    regions: true,
    components: true,
    collectedAt: true,
  };

  it('lists the same fields as ClrPageContext and ClrComponentContext', () => {
    expect(Object.keys(CLR_PAGE_CONTEXT_SCHEMA.properties).sort()).toEqual(Object.keys(page).sort());
    expect(Object.keys(CLR_PAGE_CONTEXT_SCHEMA.$defs.component.properties).sort()).toEqual(
      Object.keys(component).sort()
    );
    expect([...CLR_PAGE_CONTEXT_SCHEMA.required].sort()).toEqual(Object.keys(required).sort());
  });
});

describe('ClrContextService, sending only what matches the schema', () => {
  const validate = new Ajv().compile(CLR_PAGE_CONTEXT_SCHEMA);

  function page(overrides: Partial<ClrPageContext>): ClrPageContext {
    return {
      schemaVersion: '2',
      application: { id: 'inventory' },
      enabled: true,
      title: 'Hosts',
      regions: [],
      components: [],
      collectedAt: new Date().toISOString(),
      ...overrides,
    };
  }

  it('validates with the generated validator exactly as with Ajv itself', () => {
    const good = page({ components: [{ type: 'button', label: 'Add' }] });
    const bad = page({ components: [{ type: 'button', extra: true } as never] });

    expect(generatedValidator(good)).toBe(true);
    expect(generatedValidator(bad)).toBe(false);
    expect(validate(good)).toBe(true);
  });

  it('leaves out the node that does not match, and a broken optional field, warning in dev mode', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    onTestFinished(() => warn.mockRestore());
    const snapshot = page({
      route: { url: 42 } as never,
      components: [
        { type: 'group', label: 'Hosts', children: [{ label: 'no type' } as never, { type: 'button', label: 'Add' }] },
        { type: 7 } as never,
      ],
      regions: [{ type: 'region', label: 'Help' }],
    });

    const conformed = conformingSnapshot(snapshot);

    expect(validate(conformed)).toBe(true);
    expect(conformed.components).toEqual([
      { type: 'group', label: 'Hosts', children: [{ type: 'button', label: 'Add' }] },
    ]);
    expect(conformed.route).toBeUndefined();
    expect(conformed.regions).toEqual([{ type: 'region', label: 'Help' }]);
    expect(warn).toHaveBeenCalledTimes(3);
  });

  it('sends a valid snapshot whatever components, providers and annotations publish', async () => {
    const host = document.createElement('div');
    host.setAttribute('role', 'group');
    host.setAttribute('aria-label', 'Hostile');
    document.body.appendChild(host);
    onTestFinished(() => host.remove());
    const cycle: Record<string, unknown> = { name: 'loop' };
    cycle['self'] = cycle;
    const hostile = {
      cycle,
      big: BigInt(1),
      fn: () => 'x',
      symbol: Symbol('s'),
      long: 'x'.repeat(100_000),
      date: new Date(0),
      nested: JSON.parse('{"__proto__": {"polluted": true}, "deep": [[[[[[[[[[1]]]]]]]]]]}'),
      get throws(): never {
        throw new Error('getter');
      },
    };
    TestBed.configureTestingModule({});
    const engine = TestBed.inject(ClrContextService);
    const registry = TestBed.inject(ClrContextRegistryService);
    onTestFinished(registry.register({ getClrContext: () => ({ type: 'region', label: 'Hostile', state: hostile }) }));
    onTestFinished(registry.register({ getClrContext: () => ({ type: 42, label: ['x'], children: 'no' }) as never }));
    onTestFinished(registry.register({ getClrContext: () => Promise.reject(new Error('down')) }));
    onTestFinished(
      registry.register({
        getClrContext: () => {
          throw new Error('broken');
        },
      })
    );
    onTestFinished(engine.publish(host, () => ({ label: 7, type: null, state: hostile }) as never));

    const snapshot = await engine.snapshot();

    expect(validate(snapshot), JSON.stringify(validate.errors)).toBe(true);
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
  });
});
