/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Subject } from 'rxjs';

import { FiltersProvider } from './filters';
import { Page } from './page';
import { StateDebouncer } from './state-debouncer.provider';
import { ClrDatagridFilterInterface } from '../interfaces/filter.interface';

export default function (): void {
  describe('FiltersProvider provider', () => {
    let testContext: any;
    beforeEach(() => {
      testContext = {};
    });

    beforeEach(() => {
      const stateDebouncer = new StateDebouncer();
      testContext.filtersInstance = new FiltersProvider(new Page(stateDebouncer), stateDebouncer);
      testContext.evenFilter = new EvenFilter();
      testContext.positiveFilter = new PositiveFilter();
      testContext.filtersInstance.add(testContext.evenFilter);
      testContext.filtersInstance.add(testContext.positiveFilter);
    });

    it('detects if it has active filters', () => {
      expect(testContext.filtersInstance.hasActiveFilters()).toBe(false);
      testContext.evenFilter.toggle();
      expect(testContext.filtersInstance.hasActiveFilters()).toBe(true);
      testContext.evenFilter.toggle();
      expect(testContext.filtersInstance.hasActiveFilters()).toBe(false);
    });

    it('can return a list of active filters', () => {
      expect(testContext.filtersInstance.getActiveFilters()).toEqual([]);
      testContext.evenFilter.toggle();
      expect(testContext.filtersInstance.getActiveFilters()).toEqual([testContext.evenFilter]);
      testContext.positiveFilter.toggle();
      expect(testContext.filtersInstance.getActiveFilters()).toEqual([
        testContext.evenFilter,
        testContext.positiveFilter,
      ]);
      testContext.evenFilter.toggle();
      expect(testContext.filtersInstance.getActiveFilters()).toEqual([testContext.positiveFilter]);
    });

    it('ignores inactive filters', () => {
      expect(testContext.filtersInstance.accepts(-1)).toBe(true);
      expect(testContext.filtersInstance.accepts(-2)).toBe(true);
      expect(testContext.filtersInstance.accepts(1)).toBe(true);
      expect(testContext.filtersInstance.accepts(2)).toBe(true);
    });

    it('uses all active filters', () => {
      testContext.positiveFilter.toggle();
      expect(testContext.filtersInstance.accepts(-1)).toBe(false);
      expect(testContext.filtersInstance.accepts(-2)).toBe(false);
      expect(testContext.filtersInstance.accepts(1)).toBe(true);
      expect(testContext.filtersInstance.accepts(2)).toBe(true);
      testContext.evenFilter.toggle();
      expect(testContext.filtersInstance.accepts(-1)).toBe(false);
      expect(testContext.filtersInstance.accepts(-2)).toBe(false);
      expect(testContext.filtersInstance.accepts(1)).toBe(false);
      expect(testContext.filtersInstance.accepts(2)).toBe(true);
    });

    it('exposes an Observable that proxies all filters changes', () => {
      let nbChanges = 0;
      let latestChanges: ClrDatagridFilterInterface<number>[];
      testContext.filtersInstance.change.subscribe((changes: ClrDatagridFilterInterface<number>[]) => {
        nbChanges++;
        latestChanges = changes;
      });
      expect(latestChanges).toBeUndefined();
      testContext.evenFilter.toggle();
      expect(latestChanges).toEqual([testContext.evenFilter]);
      testContext.positiveFilter.toggle();
      expect(latestChanges).toEqual([testContext.positiveFilter]);
      testContext.evenFilter.toggle();
      expect(latestChanges).toEqual([testContext.evenFilter]);
      expect(nbChanges).toBe(3);
    });

    it('un-registers an inactive filter', () => {
      const filter = new InactiveFilter();
      const registerInactiveFilter = testContext.filtersInstance.add(filter);
      let nbChanges = 0;
      testContext.filtersInstance.change.subscribe(() => nbChanges++);
      filter.toggle();
      expect(testContext.filtersInstance.getActiveFilters()).toEqual([]);
      expect(nbChanges).toBe(1);
      registerInactiveFilter.unregister();
      expect(testContext.filtersInstance.getActiveFilters()).toEqual([]);
      expect(nbChanges).toBe(1);
      filter.toggle();
      expect(nbChanges).toBe(1);
    });

    it('un-registers an active filter', () => {
      const filter = new EvenFilter();
      const registeredFilter = testContext.filtersInstance.add(filter);
      let nbChanges = 0;
      testContext.filtersInstance.change.subscribe(() => nbChanges++);
      filter.toggle();
      expect(testContext.filtersInstance.getActiveFilters()).toEqual([filter]);
      expect(nbChanges).toBe(1);
      registeredFilter.unregister();
      expect(testContext.filtersInstance.getActiveFilters()).toEqual([]);
      expect(nbChanges).toBe(2);
      filter.toggle();
      expect(nbChanges).toBe(2);
    });

    it('correctly updates hasUnregistered property', () => {
      const filter = new ActiveFilter();
      const filter2 = new ActiveFilter();
      const filter3 = new ActiveFilter();
      let nbChanges = 0;
      testContext.filtersInstance.change.subscribe(() => nbChanges++);

      testContext.filtersInstance.add(filter);
      const registeredFilterTest = testContext.filtersInstance.add(filter2);
      testContext.filtersInstance.add(filter3);
      expect(nbChanges).toBe(3);

      registeredFilterTest.unregister();
      registeredFilterTest.unregister();
      expect(nbChanges).toBe(4);

      const filters = testContext.filtersInstance.getActiveFilters();
      expect(filters.length).toBe(2);
    });
  });

  describe('FiltersProvider provider unregisters filters correctly', () => {
    let testContext: any;
    beforeEach(() => {
      testContext = {};
    });

    beforeEach(() => {
      const stateDebouncer = new StateDebouncer();
      testContext.filtersInstance = new FiltersProvider(new Page(stateDebouncer), stateDebouncer);
      testContext.registeredFilters = [];
      for (let i = 0; i < 8; i++) {
        testContext.registeredFilters.push(testContext.filtersInstance.add(new NumFilter(i)));
      }
    });

    it('should unregister the designated filters', () => {
      expect(testContext.registeredFilters.length).toBe(testContext.filtersInstance.getActiveFilters().length);

      testContext.registeredFilters[0].unregister();
      testContext.registeredFilters[2].unregister();
      testContext.registeredFilters[4].unregister();
      testContext.registeredFilters[6].unregister();

      expect(testContext.filtersInstance.getActiveFilters().length).toBe(testContext.registeredFilters.length - 4);
      expect(testContext.filtersInstance.getActiveFilters()[0]).toEqual(testContext.registeredFilters[1].filter);
      expect(testContext.filtersInstance.getActiveFilters()[1]).toEqual(testContext.registeredFilters[3].filter);
      expect(testContext.filtersInstance.getActiveFilters()[2]).toEqual(testContext.registeredFilters[5].filter);
      expect(testContext.filtersInstance.getActiveFilters()[3]).toEqual(testContext.registeredFilters[7].filter);
    });
  });
}

abstract class TestFilter implements ClrDatagridFilterInterface<number> {
  changes = new Subject<boolean>();

  private active = false;

  toggle() {
    this.active = !this.active;
    this.changes.next(this.active);
  }

  isActive(): boolean {
    return this.active;
  }

  abstract accepts(n: number): boolean;
}

class EvenFilter extends TestFilter {
  accepts(n: number): boolean {
    return n % 2 === 0;
  }
}

class PositiveFilter extends TestFilter {
  accepts(n: number): boolean {
    return n > 0;
  }
}

class InactiveFilter extends TestFilter {
  isActive(): boolean {
    return false;
  }

  accepts(n: number): boolean {
    return n > 0;
  }
}

class ActiveFilter extends TestFilter {
  isActive(): boolean {
    return true;
  }

  accepts(n: number): boolean {
    return n > 0;
  }
}

class NumFilter extends TestFilter {
  indexNumber: number;
  constructor(_indexNumber: number) {
    super();
    this.indexNumber = _indexNumber;
  }
  accepts(n: number): boolean {
    return n % 2 === 0;
  }
  isActive(): boolean {
    return true;
  }
}
