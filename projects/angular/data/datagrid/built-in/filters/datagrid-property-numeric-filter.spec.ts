/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DatagridPropertyNumericFilter } from './datagrid-property-numeric-filter';

export default function (): void {
  describe('DatagridPropertyNumericFilter', () => {
    let testContext: any;
    beforeEach(() => {
      testContext = {};
    });

    it('checks if a number is within the range', () => {
      testContext.filter = new DatagridPropertyNumericFilter('a');
      expect(testContext.filter.accepts({ a: 1 }, null, 10)).toBe(true);
      expect(testContext.filter.accepts({ a: 1 }, null, -1)).toBe(false);
      expect(testContext.filter.accepts({ a: 9 }, 1, null)).toBe(true);
      expect(testContext.filter.accepts({ a: 9 }, 10, null)).toBe(false);
    });

    it('accepts strings when not active', () => {
      testContext.filter = new DatagridPropertyNumericFilter('a');
      expect(testContext.filter.accepts({ a: 'not a number' }, null, null)).toBe(true);
    });

    it('rejects strings when active', () => {
      testContext.filter = new DatagridPropertyNumericFilter('a');
      expect(testContext.filter.accepts({ a: 'not a number' }, null, 1)).toBe(false);
    });

    it('always rejects undefined', () => {
      testContext.filter = new DatagridPropertyNumericFilter('a');
      expect(testContext.filter.accepts({}, null, null)).toBe(false);
    });

    it('supports nested properties', () => {
      testContext.filter = new DatagridPropertyNumericFilter('a.b');
      expect(testContext.filter.accepts({ a: { b: 1 } }, 0, 10)).toBe(true);
    });
  });
}
