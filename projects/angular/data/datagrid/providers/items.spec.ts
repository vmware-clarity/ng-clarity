/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Subject } from 'rxjs';

import { FiltersProvider } from './filters';
import { Items } from './items';
import { Page } from './page';
import { Sort } from './sort';
import { StateDebouncer } from './state-debouncer.provider';
import { ClrDatagridComparatorInterface } from '../interfaces/comparator.interface';
import { ClrDatagridFilterInterface } from '../interfaces/filter.interface';

const ALL_ITEMS = [9, 3, 5, 8, 2, 6, 10, 7, 4, 1];

type User = { name: string };

export default function (): void {
  describe('Items provider', () => {
    let testContext: any;
    beforeEach(() => {
      testContext = {};
    });

    function setSmartItems(itemsInstance: Items<number> | Items<User>) {
      itemsInstance.smartenUp();
      itemsInstance.all = ALL_ITEMS;
    }

    beforeEach(() => {
      const stateDebouncer = new StateDebouncer();
      testContext.pageInstance = new Page(stateDebouncer);
      testContext.filtersInstance = new FiltersProvider(testContext.pageInstance, stateDebouncer);
      testContext.evenFilter = new EvenFilter();
      testContext.filtersInstance.add(testContext.evenFilter);
      testContext.sortInstance = new Sort(stateDebouncer);
      testContext.comparator = new TestComparator();
      testContext.itemsInstance = new Items(
        testContext.filtersInstance,
        testContext.sortInstance,
        testContext.pageInstance
      );
    });

    afterEach(() => {
      testContext.itemsInstance.destroy();
    });

    it('starts uninitialized', () => {
      expect(testContext.itemsInstance.smart).toBe(false);
      expect(testContext.itemsInstance.displayed.length).toBe(0);
      expect(testContext.pageInstance.totalItems).toBe(0);
      expect(testContext.pageInstance.firstItem).toBe(0);
      expect(testContext.pageInstance.lastItem).toBe(-1);
    });

    it("doesn't process the items at all if not smart", () => {
      testContext.itemsInstance.all = ALL_ITEMS;
      testContext.evenFilter.toggle();
      testContext.sortInstance.toggle(testContext.comparator);
      testContext.pageInstance.size = 3;
      // Yes, this is toBe() and no toEqual() because we want absolutely zero processing,
      // not even copying the array.
      expect(testContext.itemsInstance.displayed).toBe(ALL_ITEMS);
    });

    it("doesn't process the items if no filter, sort or pagination has been set", () => {
      setSmartItems(testContext.itemsInstance);
      expect(testContext.itemsInstance.displayed).toEqual(ALL_ITEMS);
      expect(testContext.pageInstance.totalItems).toBe(10); // totalItems is explicitly set
    });

    it('filters according to the Filter provider', () => {
      setSmartItems(testContext.itemsInstance);
      testContext.evenFilter.toggle();
      expect(testContext.itemsInstance.displayed).toEqual([8, 2, 6, 10, 4]);
      testContext.evenFilter.toggle();
      expect(testContext.itemsInstance.displayed).toEqual(ALL_ITEMS);
    });

    it('sorts according to the Sort provider', () => {
      setSmartItems(testContext.itemsInstance);
      testContext.sortInstance.toggle(testContext.comparator);
      expect(testContext.itemsInstance.displayed).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      testContext.sortInstance.toggle(testContext.comparator);
      expect(testContext.itemsInstance.displayed).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
    });

    it('slices according to the Page provider', () => {
      setSmartItems(testContext.itemsInstance);
      testContext.pageInstance.size = 3;
      expect(testContext.itemsInstance.displayed).toEqual([9, 3, 5]);
      testContext.pageInstance.current = 2;
      expect(testContext.itemsInstance.displayed).toEqual([8, 2, 6]);
      testContext.pageInstance.current = 4;
      expect(testContext.itemsInstance.displayed).toEqual([1]);
    });

    it('combines filtering, sorting and pagination', () => {
      setSmartItems(testContext.itemsInstance);
      testContext.evenFilter.toggle();
      testContext.sortInstance.toggle(testContext.comparator);
      testContext.pageInstance.size = 3;
      expect(testContext.itemsInstance.displayed).toEqual([2, 4, 6]);
    });

    it('processes items immediately when they are set', () => {
      testContext.itemsInstance.smartenUp();
      testContext.evenFilter.toggle();
      testContext.sortInstance.toggle(testContext.comparator);
      testContext.pageInstance.size = 3;
      testContext.itemsInstance.all = ALL_ITEMS;
      expect(testContext.itemsInstance.displayed).toEqual([2, 4, 6]);
    });

    it('does not modify the original array', () => {
      const copy = ALL_ITEMS.slice();
      setSmartItems(testContext.itemsInstance);
      testContext.evenFilter.toggle();
      testContext.sortInstance.toggle(testContext.comparator);
      testContext.pageInstance.size = 3;
      expect(ALL_ITEMS).toEqual(copy);
    });

    it('sets the total number of items after filters in the Page provider', () => {
      setSmartItems(testContext.itemsInstance);
      expect(testContext.pageInstance.totalItems).toBe(10);
      testContext.evenFilter.toggle();
      expect(testContext.pageInstance.totalItems).toBe(5);
    });

    it('gets -1 of firstItem and lastItem if gets 0 item after filtering', () => {
      const filter = new NegativeFilter();
      testContext.filtersInstance.add(filter);
      setSmartItems(testContext.itemsInstance);
      expect(testContext.pageInstance.totalItems).toBe(10);
      filter.toggle();
      expect(testContext.pageInstance.totalItems).toBe(0);
      expect(testContext.pageInstance.firstItem).toBe(-1);
      expect(testContext.pageInstance.lastItem).toBe(-1);
    });

    it('exposes an Observable to follow items changes', () => {
      let nbChanges = 0;
      let latestDisplayed: number[];
      testContext.itemsInstance.change.subscribe((items: number[]) => {
        nbChanges++;
        latestDisplayed = items;
      });
      expect(latestDisplayed).toBeUndefined();
      const unprocessed = [3, 1, 2];
      testContext.itemsInstance.all = unprocessed;
      expect(latestDisplayed).toBe(unprocessed);
      setSmartItems(testContext.itemsInstance);
      expect(latestDisplayed).toEqual(ALL_ITEMS);
      testContext.evenFilter.toggle();
      expect(latestDisplayed).toEqual([8, 2, 6, 10, 4]);
      testContext.sortInstance.toggle(testContext.comparator);
      expect(latestDisplayed).toEqual([2, 4, 6, 8, 10]);
      testContext.pageInstance.size = 3;
      expect(latestDisplayed).toEqual([2, 4, 6]);
      testContext.itemsInstance.all = [42];
      expect(latestDisplayed).toEqual([42]);
      expect(nbChanges).toBe(6);
    });

    it('does not emit items changes until the page size is available', () => {
      let nbChanges = 0;
      testContext.itemsInstance.change.subscribe(() => {
        nbChanges++;
      });
      testContext.pageInstance.activated = true;
      expect(nbChanges).toEqual(0);
      setSmartItems(testContext.itemsInstance);
      expect(nbChanges).toEqual(0);
      testContext.pageInstance.size = 3;
      expect(nbChanges).toEqual(1);
    });

    describe('manual refresh', () => {
      beforeEach(() => {
        testContext.users = [{ name: 'hello' }, { name: 'world' }];
        testContext.itemsInstance.smartenUp();
        testContext.itemsInstance.all = testContext.users;
      });

      it('forces refiltering', () => {
        const filter = new NameFilter();
        testContext.filtersInstance.add(filter);
        filter.search('o');
        testContext.users[0].name = 'zzz';
        expect(testContext.itemsInstance.displayed).toEqual([{ name: 'zzz' }, { name: 'world' }]);
        testContext.itemsInstance.refresh();
        expect(testContext.itemsInstance.displayed).toEqual([{ name: 'world' }]);
      });

      it('forces resorting', () => {
        const comparator = new NameComparator();
        testContext.sortInstance.toggle(comparator);
        testContext.users[0].name = 'zzz';
        expect(testContext.itemsInstance.displayed).toEqual([{ name: 'zzz' }, { name: 'world' }]);
        testContext.itemsInstance.refresh();
        expect(testContext.itemsInstance.displayed).toEqual([{ name: 'world' }, { name: 'zzz' }]);
      });

      /*
       * No need to test pagination, the only way it would change is due to data mutation
       * is if the filters themselves changed, which we already tested
       */
    });
  });
}

class EvenFilter implements ClrDatagridFilterInterface<number> {
  changes = new Subject<boolean>();

  private active = false;

  toggle() {
    this.active = !this.active;
    this.changes.next(this.active);
  }

  isActive(): boolean {
    return this.active;
  }

  accepts(n: number): boolean {
    return n % 2 === 0;
  }
}

class NegativeFilter implements ClrDatagridFilterInterface<number> {
  changes = new Subject<boolean>();

  private active = false;

  toggle() {
    this.active = !this.active;
    this.changes.next(this.active);
  }

  isActive(): boolean {
    return this.active;
  }

  accepts(n: number): boolean {
    return n < 0;
  }
}

class TestComparator implements ClrDatagridComparatorInterface<number> {
  compare(a: number, b: number): number {
    return a - b;
  }
}

class NameFilter implements ClrDatagridFilterInterface<User> {
  changes = new Subject<string>();

  private _search = '';

  search(value: string) {
    this._search = value;
    this.changes.next(value);
  }

  isActive(): boolean {
    return this._search.length > 0;
  }

  accepts(user: User): boolean {
    return user.name.includes(this._search);
  }
}

class NameComparator implements ClrDatagridComparatorInterface<User> {
  compare(a: User, b: User): number {
    return a.name < b.name ? -1 : 1;
  }
}
