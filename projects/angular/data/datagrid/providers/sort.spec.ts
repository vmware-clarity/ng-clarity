/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Sort } from './sort';
import { StateDebouncer } from './state-debouncer.provider';
import { ClrDatagridComparatorInterface } from '../interfaces/comparator.interface';

describe('Datagrid', () => {
  describe('Providers', () => {
    describe('Sort provider', () => {
      let testContext: any;
      beforeEach(() => {
        testContext = {};
      });

      beforeEach(() => {
        testContext.sortInstance = new Sort(new StateDebouncer());
        testContext.comparator = new TestComparator();
      });

      it('compares according to the current comparator', () => {
        testContext.sortInstance.comparator = testContext.comparator;
        expect(testContext.sortInstance.compare(1, 10)).toBeLessThan(0);
        expect(testContext.sortInstance.compare(4, 4) === 0).toBe(true);
        expect(testContext.sortInstance.compare(42, 3)).toBeGreaterThan(0);
      });

      it('can reverse the order of the current comparator', () => {
        testContext.sortInstance.comparator = testContext.comparator;
        testContext.sortInstance.reverse = true;
        expect(testContext.sortInstance.compare(1, 10)).toBeGreaterThan(0);
        expect(testContext.sortInstance.compare(4, 4) === 0).toBe(true);
        expect(testContext.sortInstance.compare(42, 3)).toBeLessThan(0);
      });

      it('exposes a toggle method to set the comparator', () => {
        testContext.sortInstance.toggle(testContext.comparator);
        expect(testContext.sortInstance.comparator).toBe(testContext.comparator);
        testContext.sortInstance.toggle(testContext.comparator, true);
        expect(testContext.sortInstance.comparator).toBe(testContext.comparator);
      });

      it('reverses the order when toggle is called on the same comparator', () => {
        // Ascending
        testContext.sortInstance.toggle(testContext.comparator);
        expect(testContext.sortInstance.reverse).toBe(false);
        // Descending
        testContext.sortInstance.toggle(testContext.comparator);
        expect(testContext.sortInstance.reverse).toBe(true);
        // Ascending again
        testContext.sortInstance.toggle(testContext.comparator);
        expect(testContext.sortInstance.reverse).toBe(false);
      });

      it('always uses descending order if forceReverse is set', () => {
        // Force descending
        testContext.sortInstance.toggle(testContext.comparator, true);
        expect(testContext.sortInstance.reverse).toBe(true);
        // No forcing, so should toggle from previous state
        testContext.sortInstance.toggle(testContext.comparator);
        expect(testContext.sortInstance.reverse).toBe(false);
        // Toggling to descending
        testContext.sortInstance.toggle(testContext.comparator);
        expect(testContext.sortInstance.reverse).toBe(true);
        // Force descending again
        testContext.sortInstance.toggle(testContext.comparator, true);
        expect(testContext.sortInstance.reverse).toBe(true);
      });

      it('always uses ascending order when toggling a new comparator ', () => {
        testContext.sortInstance.comparator = testContext.comparator;
        expect(testContext.sortInstance.reverse).toBe(false);
        testContext.sortInstance.toggle(new TestComparator());
        expect(testContext.sortInstance.reverse).toBe(false);
        testContext.sortInstance.toggle(testContext.comparator);
        testContext.sortInstance.toggle(testContext.comparator);
        expect(testContext.sortInstance.reverse).toBe(true);
        testContext.sortInstance.toggle(new TestComparator());
        expect(testContext.sortInstance.reverse).toBe(false);
      });

      it('always uses descending order if forceReverse is set even when toggling a new comparator ', () => {
        testContext.sortInstance.comparator = testContext.comparator;
        expect(testContext.sortInstance.reverse).toBe(false);
        testContext.sortInstance.toggle(new TestComparator(), true);
        expect(testContext.sortInstance.reverse).toBe(true);
        testContext.sortInstance.toggle(testContext.comparator);
        testContext.sortInstance.toggle(testContext.comparator);
        expect(testContext.sortInstance.reverse).toBe(true);
        testContext.sortInstance.toggle(new TestComparator());
        expect(testContext.sortInstance.reverse).toBe(false);
      });

      it('exposes an Observable to follow sort changes', () => {
        let nbChanges = 0;
        let latestComparator: ClrDatagridComparatorInterface<number>;
        let latestReverse: boolean;
        testContext.sortInstance.change.subscribe((sort: Sort<number>) => {
          nbChanges++;
          latestComparator = sort.comparator;
          latestReverse = sort.reverse;
        });
        testContext.sortInstance.toggle(testContext.comparator);
        expect(latestComparator).toBe(testContext.comparator);
        expect(latestReverse).toBe(false);
        testContext.sortInstance.reverse = true;
        expect(latestComparator).toBe(testContext.comparator);
        expect(latestReverse).toBe(true);
        testContext.sortInstance.toggle(testContext.comparator);
        expect(latestComparator).toBe(testContext.comparator);
        expect(latestReverse).toBe(false);
        const secondComparator = new TestComparator();
        testContext.sortInstance.toggle(secondComparator);
        expect(latestComparator).toBe(secondComparator);
        expect(latestReverse).toBe(false);
        expect(nbChanges).toBe(4);
      });
    });
  });
});

class TestComparator implements ClrDatagridComparatorInterface<number> {
  compare(a: number, b: number): number {
    return a - b;
  }
}
