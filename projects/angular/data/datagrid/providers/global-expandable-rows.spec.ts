/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { computed } from '@angular/core';
import { ModalStackService } from '@clr/angular/modal';

import { DetailService } from './detail.service';
import { ExpandableRowsCount } from './global-expandable-rows';

// Prevent ModalStackService from adding event handlers.
const PLATFORM_SERVER_ID = 'server';

describe('ExpandableRowsCount', () => {
  let detailService: DetailService;
  let service: ExpandableRowsCount;

  beforeEach(() => {
    detailService = new DetailService(new ModalStackService(PLATFORM_SERVER_ID));
    service = new ExpandableRowsCount(detailService);
  });

  it('has no expandable row by default', () => {
    expect(service.hasExpandableRow).toBe(false);
  });

  it('tracks registered expandable rows', () => {
    service.register();
    service.register();
    expect(service.hasExpandableRow).toBe(true);
    service.unregister();
    expect(service.hasExpandableRow).toBe(true);
    service.unregister();
    expect(service.hasExpandableRow).toBe(false);
  });

  it('reports no expandable row while the detail pane is enabled', () => {
    service.register();
    detailService.enabled = true;
    expect(service.hasExpandableRow).toBe(false);
    detailService.enabled = false;
    expect(service.hasExpandableRow).toBe(true);
  });

  it('exposes the expandable row count as reactive (signal-backed) state', () => {
    const hasExpandableRow = computed(() => service.hasExpandableRow);
    expect(hasExpandableRow()).toBe(false);
    service.register();
    expect(hasExpandableRow()).toBe(true);
    service.unregister();
    expect(hasExpandableRow()).toBe(false);
  });

  it('tracks the detail pane reactively', () => {
    const hasExpandableRow = computed(() => service.hasExpandableRow);
    service.register();
    expect(hasExpandableRow()).toBe(true);
    detailService.enabled = true;
    expect(hasExpandableRow()).toBe(false);
    detailService.enabled = false;
    expect(hasExpandableRow()).toBe(true);
  });
});
