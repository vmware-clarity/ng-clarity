/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { IfExpandService } from './if-expanded.service';
import { ClrLoadingState } from '../loading/loading';

export default function (): void {
  describe('Expand provider', () => {
    let testContext: any;
    beforeEach(() => {
      testContext = {};
    });

    beforeEach(() => {
      testContext.expand = new IfExpandService();
    });

    it('starts with the correct default settings', () => {
      expect(testContext.expand.expandable).toBe(0, 'not expandable');
      expect(testContext.expand.loading).toBe(false, 'already loaded');
      expect(testContext.expand.expanded).toBe(false, 'collapsed');
    });

    it('implements LoadingListener', () => {
      testContext.expand.loadingStateChange(ClrLoadingState.LOADING);
      expect(testContext.expand.loading).toBe(true);
      testContext.expand.loadingStateChange(ClrLoadingState.DEFAULT);
      expect(testContext.expand.loading).toBe(false);
    });
  });
}
