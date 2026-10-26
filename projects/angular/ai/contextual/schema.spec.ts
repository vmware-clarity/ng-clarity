/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TestBed } from '@angular/core/testing';
import Ajv from 'ajv';

import { provideClrContextApplication } from './providers/context-options';
import { ClrContextRegistryService } from './providers/context-registry.service';
import { ClrContextEngineService } from './providers/contextual-engine.service';
import { CLR_PAGE_CONTEXT_SCHEMA } from './schema';

describe('CLR_PAGE_CONTEXT_SCHEMA', () => {
  const validate = new Ajv({ validateFormats: false }).compile(CLR_PAGE_CONTEXT_SCHEMA);
  let host: HTMLElement;

  beforeEach(() => {
    host = document.createElement('main');
    host.innerHTML = '<h1>Hosts</h1><button aria-pressed="true">Filter</button><input aria-label="Name" />';
    document.body.appendChild(host);
  });

  afterEach(() => {
    host.remove();
  });

  function snapshotWith(views: 'all' | 'enabled') {
    TestBed.configureTestingModule({
      providers: [provideClrContextApplication({ id: 'inventory', viewId: () => 'host-list', views })],
    });
    TestBed.inject(ClrContextRegistryService).register({
      getClrContext: () => ({ type: 'region', label: 'Hosts', state: { count: 3 } }),
    });
    return TestBed.inject(ClrContextEngineService).getSnapshot();
  }

  it('describes a full snapshot', () => {
    const snapshot = snapshotWith('all');

    expect(snapshot.components.length).toBeGreaterThan(0);
    expect(validate(snapshot)).withContext(JSON.stringify(validate.errors)).toBeTrue();
  });

  it('describes the snapshot of a view that is not enabled', () => {
    const snapshot = snapshotWith('enabled');

    expect(snapshot.enabled).toBeFalse();
    expect(validate(snapshot)).withContext(JSON.stringify(validate.errors)).toBeTrue();
  });

  it('rejects unknown properties and a different schema version', () => {
    const snapshot = snapshotWith('all');

    expect(validate({ ...snapshot, extra: true })).toBeFalse();
    expect(validate({ ...snapshot, schemaVersion: '2' })).toBeFalse();
  });
});
