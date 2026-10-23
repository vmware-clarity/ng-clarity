/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

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

  it('implements LoadingListener', () => {
    testContext.expand.loadingStateChange(ClrLoadingState.LOADING);
    expect(testContext.expand.loading).toBe(true);
    testContext.expand.loadingStateChange(ClrLoadingState.DEFAULT);
    expect(testContext.expand.loading).toBe(false);
  });
});
