/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrLoadingState } from '@clr/angular/utils';

import { DatagridIfExpandService } from './datagrid-if-expanded.service';

describe('Expand provider', () => {
  let testContext: any;
  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    testContext.expand = new DatagridIfExpandService();
  });

  it('starts with the correct default settings', () => {
    let doesReplace = null;
    testContext.expand.replace.subscribe(expandChange => {
      doesReplace = expandChange;
    });
    expect(testContext.expand.expandable, 'not expandable').toBe(0);
    expect(doesReplace, 'not replacing the row').toBe(false);
    expect(testContext.expand.loading, 'already loaded').toBe(false);
    expect(testContext.expand.expanded, 'collapsed').toBe(false);
  });

  it('notifies when cells are replaced', () => {
    let isReplaced = null;
    testContext.expand.replace.subscribe(replaceChange => {
      isReplaced = replaceChange;
    });
    expect(isReplaced).toBe(false);
    testContext.expand.setReplace(true);
    expect(isReplaced).toBe(true);
  });

  it('implements LoadingListener', () => {
    testContext.expand.loadingStateChange(ClrLoadingState.LOADING);
    expect(testContext.expand.loading).toBe(true);
    testContext.expand.loadingStateChange(ClrLoadingState.DEFAULT);
    expect(testContext.expand.loading).toBe(false);
  });

  it('prepares the animation before requesting to expand', () => {
    const listeners: string[] = [];
    testContext.expand.animate.subscribe(() => listeners.push('animate'));
    testContext.expand.expandChange.subscribe(() => listeners.push('expand'));
    testContext.expand.expanded = true;
    expect(listeners).toEqual(['animate', 'expand']);
  });

  it('re-triggers animation when done loading', () => {
    let animates = 0;
    testContext.expand.animate.subscribe(() => animates++);
    testContext.expand.loadingStateChange(ClrLoadingState.LOADING);
    testContext.expand.expanded = true;
    expect(animates).toBe(1);
    testContext.expand.loadingStateChange(ClrLoadingState.DEFAULT);
    expect(animates).toBe(2);
  });

  it('expect to create expandableId property', () => {
    expect(testContext.expand.expandableId).toContain('clr-dg-expandable-row-');
  });
});
