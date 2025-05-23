/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Subject } from 'rxjs';

import { ClrDatagridComparatorInterface } from '../interfaces/comparator.interface';
import { ClrDatagridFilterInterface } from '../interfaces/filter.interface';
import { FiltersProvider } from './filters';
import { Items } from './items';
import { Page } from './page';
import { Sort } from './sort';
import { StateDebouncer } from './state-debouncer.provider';

const ALL_ITEMS = [9, 3, 5, 8, 2, 6, 10, 7, 4, 1];

type User = { name: string };

export default function (): void {
  describe('Items provider', function () {
    function setSmartItems(itemsInstance: Items<number> | Items<User>) {
      itemsInstance.smartenUp();
      itemsInstance.all = ALL_ITEMS;
    }

    beforeEach(function () {
      const stateDebouncer = new StateDebouncer();
      this.pageInstance = new Page(stateDebouncer);
      this.filtersInstance = new FiltersProvider(this.pageInstance, stateDebouncer);
      this.evenFilter = new EvenFilter();
      this.filtersInstance.add(this.evenFilter);
      this.sortInstance = new Sort(stateDebouncer);
      this.comparator = new TestComparator();
      this.itemsInstance = new Items(this.filtersInstance, this.sortInstance, this.pageInstance);
    });

    afterEach(function () {
      this.itemsInstance.destroy();
    });

    it('starts uninitialized', function () {
      expect(this.itemsInstance.smart).toBe(false);
      expect(this.itemsInstance.displayed.length).toBe(0);
      expect(this.pageInstance.totalItems).toBe(0);
      expect(this.pageInstance.firstItem).toBe(0);
      expect(this.pageInstance.lastItem).toBe(-1);
    });

    it("doesn't process the items at all if not smart", function () {
      this.itemsInstance.all = ALL_ITEMS;
      this.evenFilter.toggle();
      this.sortInstance.toggle(this.comparator);
      this.pageInstance.size = 3;
      // Yes, this is toBe() and no toEqual() because we want absolutely zero processing,
      // not even copying the array.
      expect(this.itemsInstance.displayed).toBe(ALL_ITEMS);
    });

    it("doesn't process the items if no filter, sort or pagination has been set", function () {
      setSmartItems(this.itemsInstance);
      expect(this.itemsInstance.displayed).toEqual(ALL_ITEMS);
      expect(this.pageInstance.totalItems).toBe(10); // totalItems is explicitly set
    });

    it('filters according to the Filter provider', function () {
      setSmartItems(this.itemsInstance);
      this.evenFilter.toggle();
      expect(this.itemsInstance.displayed).toEqual([8, 2, 6, 10, 4]);
      this.evenFilter.toggle();
      expect(this.itemsInstance.displayed).toEqual(ALL_ITEMS);
    });

    it('sorts according to the Sort provider', function () {
      setSmartItems(this.itemsInstance);
      this.sortInstance.toggle(this.comparator);
      expect(this.itemsInstance.displayed).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      this.sortInstance.toggle(this.comparator);
      expect(this.itemsInstance.displayed).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
    });

    it('slices according to the Page provider', function () {
      setSmartItems(this.itemsInstance);
      this.pageInstance.size = 3;
      expect(this.itemsInstance.displayed).toEqual([9, 3, 5]);
      this.pageInstance.current = 2;
      expect(this.itemsInstance.displayed).toEqual([8, 2, 6]);
      this.pageInstance.current = 4;
      expect(this.itemsInstance.displayed).toEqual([1]);
    });

    it('combines filtering, sorting and pagination', function () {
      setSmartItems(this.itemsInstance);
      this.evenFilter.toggle();
      this.sortInstance.toggle(this.comparator);
      this.pageInstance.size = 3;
      expect(this.itemsInstance.displayed).toEqual([2, 4, 6]);
    });

    it('processes items immediately when they are set', function () {
      this.itemsInstance.smartenUp();
      this.evenFilter.toggle();
      this.sortInstance.toggle(this.comparator);
      this.pageInstance.size = 3;
      this.itemsInstance.all = ALL_ITEMS;
      expect(this.itemsInstance.displayed).toEqual([2, 4, 6]);
    });

    it('does not modify the original array', function () {
      const copy = ALL_ITEMS.slice();
      setSmartItems(this.itemsInstance);
      this.evenFilter.toggle();
      this.sortInstance.toggle(this.comparator);
      this.pageInstance.size = 3;
      expect(ALL_ITEMS).toEqual(copy);
    });

    it('sets the total number of items after filters in the Page provider', function () {
      setSmartItems(this.itemsInstance);
      expect(this.pageInstance.totalItems).toBe(10);
      this.evenFilter.toggle();
      expect(this.pageInstance.totalItems).toBe(5);
    });

    it('gets -1 of firstItem and lastItem if gets 0 item after filtering', function () {
      const filter = new NegativeFilter();
      this.filtersInstance.add(filter);
      setSmartItems(this.itemsInstance);
      expect(this.pageInstance.totalItems).toBe(10);
      filter.toggle();
      expect(this.pageInstance.totalItems).toBe(0);
      expect(this.pageInstance.firstItem).toBe(-1);
      expect(this.pageInstance.lastItem).toBe(-1);
    });

    it('exposes an Observable to follow items changes', function () {
      let nbChanges = 0;
      let latestDisplayed: number[];
      this.itemsInstance.change.subscribe((items: number[]) => {
        nbChanges++;
        latestDisplayed = items;
      });
      expect(latestDisplayed).toBeUndefined();
      const unprocessed = [3, 1, 2];
      this.itemsInstance.all = unprocessed;
      expect(latestDisplayed).toBe(unprocessed);
      setSmartItems(this.itemsInstance);
      expect(latestDisplayed).toEqual(ALL_ITEMS);
      this.evenFilter.toggle();
      expect(latestDisplayed).toEqual([8, 2, 6, 10, 4]);
      this.sortInstance.toggle(this.comparator);
      expect(latestDisplayed).toEqual([2, 4, 6, 8, 10]);
      this.pageInstance.size = 3;
      expect(latestDisplayed).toEqual([2, 4, 6]);
      this.itemsInstance.all = [42];
      expect(latestDisplayed).toEqual([42]);
      expect(nbChanges).toBe(6);
    });

    it('does not emit items changes until the page size is available', function () {
      let nbChanges = 0;
      this.itemsInstance.change.subscribe(() => {
        nbChanges++;
      });
      this.pageInstance.activated = true;
      expect(nbChanges).toEqual(0);
      setSmartItems(this.itemsInstance);
      expect(nbChanges).toEqual(0);
      this.pageInstance.size = 3;
      expect(nbChanges).toEqual(1);
    });

    describe('manual refresh', function () {
      beforeEach(function () {
        this.users = [{ name: 'hello' }, { name: 'world' }];
        this.itemsInstance.smartenUp();
        this.itemsInstance.all = this.users;
      });

      it('forces refiltering', function () {
        const filter = new NameFilter();
        this.filtersInstance.add(filter);
        filter.search('o');
        this.users[0].name = 'zzz';
        expect(this.itemsInstance.displayed).toEqual([{ name: 'zzz' }, { name: 'world' }]);
        this.itemsInstance.refresh();
        expect(this.itemsInstance.displayed).toEqual([{ name: 'world' }]);
      });

      it('forces resorting', function () {
        const comparator = new NameComparator();
        this.sortInstance.toggle(comparator);
        this.users[0].name = 'zzz';
        expect(this.itemsInstance.displayed).toEqual([{ name: 'zzz' }, { name: 'world' }]);
        this.itemsInstance.refresh();
        expect(this.itemsInstance.displayed).toEqual([{ name: 'world' }, { name: 'zzz' }]);
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
