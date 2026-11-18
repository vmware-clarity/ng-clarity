/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatagridPropertyStringFilter } from './datagrid-property-string-filter';

describe('Datagrid', () => {
  describe('Built-in', () => {
    describe('DatagridPropertyStringFilter', () => {
      let testContext: any;
      beforeEach(() => {
        testContext = {};
      });

      it('checks if a string contains the search text', () => {
        testContext.filter = new DatagridPropertyStringFilter('a');
        expect(testContext.filter.accepts({ a: 'abc' }, '')).toBe(true);
        expect(testContext.filter.accepts({ a: 'abc' }, 'a')).toBe(true);
        expect(testContext.filter.accepts({ a: 'abc' }, 'b')).toBe(true);
        expect(testContext.filter.accepts({ a: 'abc' }, 'c')).toBe(true);
        expect(testContext.filter.accepts({ a: 'abc' }, 'ab')).toBe(true);
        expect(testContext.filter.accepts({ a: 'abc' }, 'bc')).toBe(true);
        expect(testContext.filter.accepts({ a: 'abc' }, 'abc')).toBe(true);
        expect(testContext.filter.accepts({ a: 'abc' }, 'x')).toBe(false);
        expect(testContext.filter.accepts({ a: 'abc' }, 'ac')).toBe(false);
        expect(testContext.filter.accepts({ a: 'abc' }, 'cba')).toBe(false);
      });

      it('is case insensitive', () => {
        testContext.filter = new DatagridPropertyStringFilter('a');
        expect(testContext.filter.accepts({ a: 'ABC' }, 'a')).toBe(true);
      });

      it('works on integers', () => {
        testContext.filter = new DatagridPropertyStringFilter('a');
        expect(testContext.filter.accepts({ a: 123 }, '23')).toBe(true);
        expect(testContext.filter.accepts({ a: 123 }, '13')).toBe(false);
      });

      it('always rejects undefined', () => {
        testContext.filter = new DatagridPropertyStringFilter('a');
        expect(testContext.filter.accepts({}, 'a')).toBe(false);
      });

      it('supports nested properties', () => {
        testContext.filter = new DatagridPropertyStringFilter('a.b');
        expect(testContext.filter.accepts({ a: { b: 'abc' } }, 'a')).toBe(true);
      });
    });
  });
});
