/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagrid } from './data/datagrid/datagrid';
import { ClrDatagridColumnToggle } from './data/datagrid/datagrid-column-toggle';
import { ClrDatagridColumnToggleButton } from './data/datagrid/datagrid-column-toggle-button';
import { ClrDatagridColumnToggleTitle } from './data/datagrid/datagrid-column-toggle-title';

describe('Deprecations', () => {
  // When we deprecate some code, we should write a test to verify it is still in the bundle
  // and keep track of when it was deprecated, and when we plan to remove it.

  describe('2.0', () => {
    it('should deprecate the column toggle title and button components', () => {
      expect(ClrDatagridColumnToggle).toBeTruthy();
      expect(ClrDatagridColumnToggleTitle).toBeTruthy();
      expect(ClrDatagridColumnToggleButton).toBeTruthy();
    });

    it('should deprecate but still support clrDgRowSelection', () => {
      const propTest = Object.getOwnPropertyDescriptor(ClrDatagrid.prototype, 'rowSelectionMode');
      expect(propTest.set).toBeDefined();
    });
  });
});
