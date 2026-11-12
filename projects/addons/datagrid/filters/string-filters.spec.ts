/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CaseInsensitiveContainsStringFilter } from './string-filters';

interface ThisTest {
  target: CaseInsensitiveContainsStringFilter;
}

describe('string-filters.spec', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  describe('WHEN provided with valid filter property name', () => {
    it('THEN it filters by it', () => {
      const item = {
        propA: 'ABC',
        propB: 'DEF',
      };

      testContext.target = new CaseInsensitiveContainsStringFilter('propA');

      // NOTE: Seems Clarity grid always feeds the search string in lower case -
      // so we use lowercase as a search string too.
      expect(testContext.target.accepts(item, 'a')).toBeTruthy();
      expect(testContext.target.accepts(item, 'd')).toBeFalsy();
    });
  });

  describe('WHEN provided with INVALID filter property name', () => {
    it('THEN noting pass the filter', () => {
      const item = {
        propA: 'ABC',
        propB: 'DEF',
      };

      testContext.target = new CaseInsensitiveContainsStringFilter('propAA');

      expect(testContext.target.accepts(item, 'a')).toBeFalsy();
    });
  });
});
