/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import Ajv from 'ajv';

import { provideClrContextApplication } from './providers/context-options';
import { ClrContextRegistryService } from './providers/context-registry.service';
import { ClrContextEngineService } from './providers/contextual-engine.service';
import { CLR_PAGE_CONTEXT_SCHEMA } from './schema';

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
    TestBed.configureTestingModule({
      providers: [
        provideClrContextApplication({ id: 'inventory', viewId: () => 'host-list', views }),
        provideRouter([{ path: 'hosts', component: RoutedComponent }]),
      ],
    });
    TestBed.inject(ClrContextRegistryService).register({
      getClrContext: () => ({ type: 'region', label: 'Hosts', state: { count: 3 }, extra: 'dropped' }) as never,
    });
    return TestBed.inject(ClrContextEngineService);
  }

  function expectValid(snapshot: unknown) {
    expect(validate(snapshot)).withContext(JSON.stringify(validate.errors)).toBeTrue();
  }

  it('describes a page with provider regions and shadow content', () => {
    const snapshot = engineWith().getSnapshot();

    expect(JSON.stringify(snapshot.components)).toContain('Pin');
    expect(snapshot.regions.length).toBe(1);
    expect(Object.keys(snapshot.regions[0])).not.toContain('extra');
    expectValid(snapshot);
  });

  it('describes a route with repeated query parameters', async () => {
    const engine = engineWith();

    await TestBed.inject(Router).navigateByUrl('/hosts?tag=a&tag=b&page=2');
    const snapshot = engine.getSnapshot();

    expect(snapshot.route?.queryParams).toEqual({ tag: ['a', 'b'], page: '2' });
    expectValid(snapshot);
  });

  it('describes the snapshot of a view that is not enabled', () => {
    const snapshot = engineWith('enabled').getSnapshot();

    expect(snapshot.enabled).toBeFalse();
    expectValid(snapshot);
  });

  it('describes an async snapshot', async () => {
    expectValid(await engineWith().getSnapshotAsync());
  });

  it('rejects unknown properties and a different schema version', () => {
    const snapshot = engineWith().getSnapshot();

    expect(validate({ ...snapshot, extra: true })).toBeFalse();
    expect(validate({ ...snapshot, schemaVersion: '2' })).toBeFalse();
  });
});
