/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Subscription } from 'rxjs';

import { Page } from './page';
import { StateDebouncer } from './state-debouncer.provider';

describe('Datagrid', () => {
  describe('Providers', () => {
    describe('Page provider', () => {
      let testContext: any;
      beforeEach(() => {
        testContext = {};
      });

      let subscriptions: Subscription[] = [];

      beforeEach(() => {
        testContext.pageInstance = new Page(new StateDebouncer());
      });

      afterEach(() => {
        subscriptions.forEach(sub => sub.unsubscribe());
        subscriptions = [];
      });

      it('has page size 0 by default', () => {
        expect(testContext.pageInstance.size).toBe(0);
      });

      it('starts at page 1', () => {
        expect(testContext.pageInstance.current).toBe(1);
      });

      it('computes the last page', () => {
        testContext.pageInstance.size = 10;
        testContext.pageInstance.totalItems = 42;
        expect(testContext.pageInstance.last).toBe(5);
      });

      it('computes the indexes of the first and last displayed items', () => {
        testContext.pageInstance.size = 10;
        testContext.pageInstance.totalItems = 42;
        testContext.pageInstance.current = 3;
        expect(testContext.pageInstance.firstItem).toBe(20);
        expect(testContext.pageInstance.lastItem).toBe(29);
      });

      it('returns -1 for the firstItem and lastItem of none items', () => {
        testContext.pageInstance.size = 10;
        testContext.pageInstance.totalItems = 0;
        testContext.pageInstance.current = 1;
        expect(testContext.pageInstance.firstItem).toBe(-1);
        expect(testContext.pageInstance.lastItem).toBe(-1);
      });

      it("doesn't paginate when size is 0", () => {
        testContext.pageInstance.next();
        expect(testContext.pageInstance.current).toBe(1);
      });

      it('moves to the new last page when the number of items becomes too small', () => {
        testContext.pageInstance.size = 10;
        testContext.pageInstance.totalItems = 42;
        testContext.pageInstance.current = 4;
        expect(testContext.pageInstance.current).toBe(4);
        testContext.pageInstance.totalItems = 20;
        expect(testContext.pageInstance.current).toBe(2);
      });

      it('updates the current page when page size changes', () => {
        testContext.pageInstance.size = 20;
        testContext.pageInstance.totalItems = 42;
        testContext.pageInstance.current = 2;
        expect(testContext.pageInstance.current).toBe(2);
        testContext.pageInstance.size = 10;
        expect(testContext.pageInstance.current).toBe(3);
        testContext.pageInstance.size = 0;
        expect(testContext.pageInstance.current).toBe(1);
      });

      it("correctly uses the last item's index if the last page is not full", () => {
        testContext.pageInstance.size = 10;
        testContext.pageInstance.totalItems = 42;
        testContext.pageInstance.current = 5;
        expect(testContext.pageInstance.lastItem).toBe(41);
      });

      it('offers a method to safely move to the next page', () => {
        testContext.pageInstance.size = 10;
        testContext.pageInstance.totalItems = 15;
        expect(testContext.pageInstance.current).toBe(1);
        testContext.pageInstance.next();
        expect(testContext.pageInstance.current).toBe(2);
        testContext.pageInstance.next();
        expect(testContext.pageInstance.current).toBe(2);
      });

      it('offers a method to safely move to the previous page', () => {
        testContext.pageInstance.size = 10;
        testContext.pageInstance.totalItems = 15;
        testContext.pageInstance.current = 2;
        expect(testContext.pageInstance.current).toBe(2);
        testContext.pageInstance.previous();
        expect(testContext.pageInstance.current).toBe(1);
        testContext.pageInstance.previous();
        expect(testContext.pageInstance.current).toBe(1);
      });

      it('exposes an Observable to follow page changes', () => {
        let nbChanges = 0;
        let currentPage: number;
        subscriptions.push(
          testContext.pageInstance.change.subscribe((page: number) => {
            nbChanges++;
            currentPage = page;
          })
        );
        expect(currentPage).toBeUndefined();
        testContext.pageInstance.current = 2;
        expect(currentPage).toBe(2);
        testContext.pageInstance.current = 5;
        expect(currentPage).toBe(5);
        testContext.pageInstance.current = 1;
        expect(currentPage).toBe(1);
        expect(nbChanges).toBe(3);
      });

      it('does not emit changes when resetPageSize if set to preventEmit', () => {
        // This test is a bit convoluted perhaps, but testing all ways to emit changes
        let nbChanges = 0;
        let currentPage: number;
        testContext.pageInstance.size = 10; // Emit avoided by setting before subscribe
        subscriptions.push(
          testContext.pageInstance.change.subscribe((page: number) => {
            nbChanges++;
            currentPage = page;
          })
        );
        expect(currentPage).toBeUndefined();
        testContext.pageInstance.current = 2; // First emit
        expect(currentPage).toBe(2);
        expect(nbChanges).toBe(1);
        testContext.pageInstance.resetPageSize(true); // No emit
        expect(currentPage).toBe(2);
        expect(nbChanges).toBe(1);
        testContext.pageInstance.size = 10; // Second emit
        expect(nbChanges).toBe(2);
        testContext.pageInstance.current = 3; // Third emit
        expect(currentPage).toBe(3);
        expect(nbChanges).toBe(3);
        testContext.pageInstance.resetPageSize(); // Fourth emit
        expect(currentPage).toBe(1);
        expect(nbChanges).toBe(4);
      });
    });
  });
});
