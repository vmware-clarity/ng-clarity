/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatagridPropertyDateFilter } from './datagrid-property-date-filter';

const yesterday = new Date(Date.now() - 24 * 1000 * 60 * 60);
const today = new Date();
const tomorrow = new Date(Date.now() + 24 * 1000 * 60 * 60);
const dayAfterTomorrow = new Date(Date.now() + 2 * 24 * 1000 * 60 * 60);
const threeDayFromNow = new Date(Date.now() + 3 * 24 * 1000 * 60 * 60);

export default function (): void {
  describe('DatagridPropertyDateFilter', function () {
    it('checks if a date is within the range', function () {
      this.filter = new DatagridPropertyDateFilter('a');
      expect(this.filter.accepts({ a: today }, null, tomorrow)).toBe(true, 'today < tomorrow');
      expect(this.filter.accepts({ a: today }, null, yesterday)).toBe(false, 'today < yesterday');
      expect(this.filter.accepts({ a: dayAfterTomorrow }, today, null)).toBe(true, 'dayAfterTomorrow > today');
      expect(this.filter.accepts({ a: dayAfterTomorrow }, threeDayFromNow, null)).toBe(
        false,
        'dayAfterTomorrow > threeDayFromNow'
      );
    });

    it('accepts strings when not active', function () {
      this.filter = new DatagridPropertyDateFilter('a');
      expect(this.filter.accepts({ a: 'not a date' }, null, null)).toBe(true);
    });

    it('rejects strings when active', function () {
      this.filter = new DatagridPropertyDateFilter('a');
      expect(this.filter.accepts({ a: 'not a number' }, null, today)).toBe(false);
    });

    it('always rejects undefined', function () {
      this.filter = new DatagridPropertyDateFilter('a');
      expect(this.filter.accepts({}, 'a')).toBe(false);
    });

    it('supports nested properties', function () {
      this.filter = new DatagridPropertyDateFilter('a.b');
      expect(this.filter.accepts({ a: { b: today } }, yesterday, tomorrow)).toBe(true);
    });
  });
}
