/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable } from 'rxjs';

import { ClrDatagridDateFilterInterface } from '../../interfaces/date-filter.interface';
import { ClrDatagridFilterInterface } from '../../interfaces/filter.interface';
import { DatagridDateFilterImpl } from './datagrid-date-filter-impl';
import { DatagridPropertyDateFilter } from './datagrid-property-date-filter';

const yesterday = new Date(Date.now() - 24 * 1000 * 60 * 60);
const today = new Date();
const tomorrow = new Date(Date.now() + 24 * 1000 * 60 * 60);
const dayAfterTomorrow = new Date(Date.now() + 2 * 24 * 1000 * 60 * 60);
const threeDayFromNow = new Date(Date.now() + 3 * 24 * 1000 * 60 * 60);

export default function (): void {
  describe('DatagridDateFilterImpl', function () {
    let fullFilter: DatagridDateFilterImpl<Date>;

    beforeEach(function () {
      const dateFilter = new TestFilter();
      fullFilter = new DatagridDateFilterImpl(dateFilter);
    });

    it('becomes active when either from or to are set', function () {
      expect(fullFilter.isActive()).toBe(false);
      fullFilter.to = tomorrow;
      expect(fullFilter.isActive()).toBe(true);
      fullFilter.to = null;
      expect(fullFilter.isActive()).toBe(false);
      fullFilter.from = today;
      expect(fullFilter.isActive()).toBe(true);
      fullFilter.from = null;
      expect(fullFilter.isActive()).toBe(false);
    });

    it('filters dates that are after the to date', function () {
      expect(fullFilter.accepts(new Date(Date.now() + 11_000))).toBe(true);
      fullFilter.to = tomorrow;
      expect(fullFilter.accepts(dayAfterTomorrow)).toBe(false);
      expect(fullFilter.accepts(today)).toBe(true);
      fullFilter.to = null;
      expect(fullFilter.accepts(dayAfterTomorrow)).toBe(true);
    });

    it('filters dates that are before the from date', function () {
      expect(fullFilter.accepts(yesterday)).toBe(true);
      fullFilter.from = today;
      expect(fullFilter.accepts(yesterday)).toBe(false);
      expect(fullFilter.accepts(tomorrow)).toBe(true);
      fullFilter.from = null;
      expect(fullFilter.accepts(yesterday)).toBe(true);
    });

    it('only allows values within the range when both filters are set', function () {
      fullFilter.from = today;
      fullFilter.to = dayAfterTomorrow;
      expect(fullFilter.accepts(yesterday)).toBe(false);
      expect(fullFilter.accepts(tomorrow)).toBe(true);
      expect(fullFilter.accepts(threeDayFromNow)).toBe(false);
    });

    it('exposes state', function () {
      expect(fullFilter.state).toBe(fullFilter);
    });

    it('compares filters', function () {
      let otherFilter: ClrDatagridFilterInterface<any> = fullFilter;
      expect(fullFilter.equals(otherFilter)).toBe(true);
      // Reference only comparison should be enough for the common case
      otherFilter = new DatagridDateFilterImpl(new TestFilter());
      expect(fullFilter.equals(otherFilter)).toBe(false);
    });

    describe('with DatagridPropertyDateFilter', function () {
      beforeEach(function () {
        const propFilter = new DatagridPropertyDateFilter('a.b.c');
        fullFilter = new DatagridDateFilterImpl(propFilter);
      });

      it('exposes state', function () {
        fullFilter.to = today;
        fullFilter.from = null;
        expect(fullFilter.state).toEqual({ property: 'a.b.c', to: today, from: null });
      });

      it('compares filters', function () {
        let otherFilter: ClrDatagridFilterInterface<any> = fullFilter;
        expect(fullFilter.equals(otherFilter)).toBe(true);
        // In the specific case we can compare different filter instances
        otherFilter = new DatagridDateFilterImpl(new DatagridPropertyDateFilter('a.b.c'));
        expect(fullFilter.equals(otherFilter)).toBe(true);
        // Incompatible inner function type
        otherFilter = new DatagridDateFilterImpl(new TestFilter());
        expect(fullFilter.equals(otherFilter)).toBe(false);
        // Incompatible filter object
        otherFilter = new IncompatibleFilter();
        expect(fullFilter.equals(otherFilter)).toBe(false);
      });
    });
  });
}

class TestFilter implements ClrDatagridDateFilterInterface<Date> {
  accepts(item: Date, from: Date, to: Date) {
    if (from !== null && item < from) {
      return false;
    }

    if (to !== null && item > to) {
      return false;
    }
    return true;
  }
}

class IncompatibleFilter implements ClrDatagridFilterInterface<Date> {
  // eslint-disable-next-line
  accepts(_item: Date): boolean {
    return true;
  }

  changes: Observable<any>;

  isActive(): boolean {
    return true;
  }
}
