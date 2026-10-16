/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrLoadingState } from '@clr/angular/utils';

import { DatagridIfExpandService } from './datagrid-if-expanded.service';

export default function (): void {
  describe('Expand provider', function () {
    beforeEach(function () {
      this.expand = new DatagridIfExpandService();
    });

    it('starts with the correct default settings', function () {
      let doesReplace = null;
      this.expand.replace.subscribe(expandChange => {
        doesReplace = expandChange;
      });
      expect(this.expand.expandable).toBe(0, 'not expandable');
      expect(doesReplace).toBe(false, 'not replacing the row');
      expect(this.expand.loading).toBe(false, 'already loaded');
      expect(this.expand.expanded).toBe(false, 'collapsed');
    });

    it('notifies when cells are replaced', function () {
      let isReplaced = null;
      this.expand.replace.subscribe(replaceChange => {
        isReplaced = replaceChange;
      });
      expect(isReplaced).toBe(false);
      this.expand.setReplace(true);
      expect(isReplaced).toBe(true);
    });

    it('implements LoadingListener', function () {
      this.expand.loadingStateChange(ClrLoadingState.LOADING);
      expect(this.expand.loading).toBe(true);
      this.expand.loadingStateChange(ClrLoadingState.DEFAULT);
      expect(this.expand.loading).toBe(false);
    });

    it('expect to create expandableId property', function () {
      expect(this.expand.expandableId).toContain('clr-dg-expandable-row-');
    });
  });
}
