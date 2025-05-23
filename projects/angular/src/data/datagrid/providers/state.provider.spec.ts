/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Subscription } from 'rxjs';

import { FiltersProvider } from './filters';
import { Page } from './page';
import { Sort } from './sort';
import { StateDebouncer } from './state-debouncer.provider';
import { StateProvider } from './state.provider';

export default function (): void {
  describe('State Provider', function () {
    let subscriptions: Subscription[] = [];
    const page = new Page(new StateDebouncer());
    let stateProviderInstance: StateProvider<any>;

    beforeEach(function () {
      stateProviderInstance = new StateProvider(
        new FiltersProvider(new Page(new StateDebouncer()), new StateDebouncer()),
        new Sort(new StateDebouncer()),
        page,
        new StateDebouncer()
      );
    });

    afterEach(function () {
      subscriptions.forEach(sub => sub.unsubscribe());
      subscriptions = [];
    });

    it('has empty state upon uninitiated constructor parameters', function () {
      expect(stateProviderInstance.state).toEqual({});
    });

    it('has proper page info in state upon page update', function () {
      page.size = 20;
      page.current = 2;

      expect(stateProviderInstance.state.page).toEqual({
        size: 20,
        current: 2,
        from: 20,
        to: 39,
      });

      page.totalItems = 50;

      expect(stateProviderInstance.state.page).toEqual({
        size: 20,
        current: 2,
        from: 20,
        to: 39,
      });

      page.totalItems = 9;

      expect(stateProviderInstance.state.page).toEqual({
        size: 20,
        current: 1,
        from: 0,
        to: 8,
      });

      page.totalItems = 0;
      expect(stateProviderInstance.state.page).toEqual({
        size: 20,
        current: 1,
        from: -1,
        to: -1,
      });
    });
  });
}
