/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { computed } from '@angular/core';

import { RowActionService } from './row-action-service';

describe('RowActionService', () => {
  let service: RowActionService;

  beforeEach(() => {
    service = new RowActionService();
  });

  it('has no actionable row by default', () => {
    expect(service.hasActionableRow).toBe(false);
  });

  it('tracks registered actionable rows', () => {
    service.register();
    service.register();
    expect(service.hasActionableRow).toBe(true);
    service.unregister();
    expect(service.hasActionableRow).toBe(true);
    service.unregister();
    expect(service.hasActionableRow).toBe(false);
  });

  it('exposes hasActionableRow as reactive (signal-backed) state', () => {
    const hasActionableRow = computed(() => service.hasActionableRow);
    expect(hasActionableRow()).toBe(false);
    service.register();
    expect(hasActionableRow()).toBe(true);
    service.unregister();
    expect(hasActionableRow()).toBe(false);
  });
});
