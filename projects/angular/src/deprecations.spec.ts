/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagrid } from '@clr/angular/src/data/datagrid';

describe('Deprecations', () => {
  // When we deprecate some code, we should write a test to verify it is still in the bundle
  // and keep track of when it was deprecated, and when we plan to remove it.

  describe('2.0', () => {
    it('should deprecate but still support clrDgRowSelection', () => {
      const propTest = Object.getOwnPropertyDescriptor(ClrDatagrid.prototype, 'rowSelectionMode');
      expect(propTest.set).toBeDefined();
    });
  });
});
