/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { computed } from '@angular/core';

import { IfExpandService } from './if-expanded.service';
import { ClrLoadingState } from '../loading/loading';

describe('Expand provider', () => {
  let testContext: any;
  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    testContext.expand = new IfExpandService();
  });

  it('starts with the correct default settings', () => {
    expect(testContext.expand.expandable, 'not expandable').toBe(0);
    expect(testContext.expand.loading, 'already loaded').toBe(false);
    expect(testContext.expand.expanded, 'collapsed').toBe(false);
  });

  it('exposes its state as reactive (signal-backed) state', function () {
    const state = computed(() => ({
      expanded: testContext.expand.expanded,
      loading: testContext.expand.loading,
      expandable: testContext.expand.expandable,
      hasExpandTemplate: testContext.expand.hasExpandTemplate,
    }));
    expect(state()).toEqual({ expanded: false, loading: false, expandable: 0, hasExpandTemplate: false });
    testContext.expand.expanded = true;
    testContext.expand.loading = true;
    testContext.expand.expandable++;
    testContext.expand.hasExpandTemplate = true;
    expect(state()).toEqual({ expanded: true, loading: true, expandable: 1, hasExpandTemplate: true });
    testContext.expand.toggle();
    expect(state().expanded).toBe(false);
  });

  it('emits expandChange synchronously, once per change, with the getter already updated', function () {
    const seen: boolean[] = [];
    testContext.expand.expandChange.subscribe((value: boolean) => {
      expect(testContext.expand.expanded).toBe(value);
      seen.push(value);
    });
    testContext.expand.expanded = true;
    expect(seen).toEqual([true]);
    testContext.expand.expanded = true;
    expect(seen).toEqual([true]);
    testContext.expand.toggle();
    expect(seen).toEqual([true, false]);
  });

  it('implements LoadingListener', () => {
    testContext.expand.loadingStateChange(ClrLoadingState.LOADING);
    expect(testContext.expand.loading).toBe(true);
    testContext.expand.loadingStateChange(ClrLoadingState.DEFAULT);
    expect(testContext.expand.loading).toBe(false);
  });
});
