/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CaseInsensitiveContainsStringFilter } from './string-filters';

interface ThisTest {
  target: CaseInsensitiveContainsStringFilter;
}

describe('string-filters.spec', function () {
  describe('WHEN provided with valid filter property name', function () {
    it('THEN it filters by it', function (this: ThisTest) {
      const item = {
        propA: 'ABC',
        propB: 'DEF',
      };

      this.target = new CaseInsensitiveContainsStringFilter('propA');

      // NOTE: Seems Clarity grid always feeds the search string in lower case -
      // so we use lowercase as a search string too.
      expect(this.target.accepts(item, 'a')).toBeTruthy();
      expect(this.target.accepts(item, 'd')).toBeFalsy();
    });
  });

  describe('WHEN provided with INVALID filter property name', function () {
    it('THEN noting pass the filter', function (this: ThisTest) {
      const item = {
        propA: 'ABC',
        propB: 'DEF',
      };

      this.target = new CaseInsensitiveContainsStringFilter('propAA');

      expect(this.target.accepts(item, 'a')).toBeFalsy();
    });
  });
});
