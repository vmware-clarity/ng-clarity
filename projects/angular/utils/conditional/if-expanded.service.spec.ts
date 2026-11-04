/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { computed } from '@angular/core';

import { IfExpandService } from './if-expanded.service';
import { ClrLoadingState } from '../loading/loading';

export default function (): void {
  describe('Expand provider', function () {
    beforeEach(function () {
      this.expand = new IfExpandService();
    });

    it('starts with the correct default settings', function () {
      expect(this.expand.expandable).toBe(0, 'not expandable');
      expect(this.expand.loading).toBe(false, 'already loaded');
      expect(this.expand.expanded).toBe(false, 'collapsed');
    });

    it('exposes its state as reactive (signal-backed) state', function () {
      const state = computed(() => ({
        expanded: this.expand.expanded,
        loading: this.expand.loading,
        expandable: this.expand.expandable,
        hasExpandTemplate: this.expand.hasExpandTemplate,
      }));
      expect(state()).toEqual({ expanded: false, loading: false, expandable: 0, hasExpandTemplate: false });
      this.expand.expanded = true;
      this.expand.loading = true;
      this.expand.expandable++;
      this.expand.hasExpandTemplate = true;
      expect(state()).toEqual({ expanded: true, loading: true, expandable: 1, hasExpandTemplate: true });
      this.expand.toggle();
      expect(state().expanded).toBe(false);
    });

    it('emits expandChange synchronously, once per change, with the getter already updated', function () {
      const seen: boolean[] = [];
      this.expand.expandChange.subscribe((value: boolean) => {
        expect(this.expand.expanded).toBe(value);
        seen.push(value);
      });
      this.expand.expanded = true;
      expect(seen).toEqual([true]);
      this.expand.expanded = true;
      expect(seen).toEqual([true]);
      this.expand.toggle();
      expect(seen).toEqual([true, false]);
    });

    it('implements LoadingListener', function () {
      this.expand.loadingStateChange(ClrLoadingState.LOADING);
      expect(this.expand.loading).toBe(true);
      this.expand.loadingStateChange(ClrLoadingState.DEFAULT);
      expect(this.expand.loading).toBe(false);
    });
  });
}
