/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import DropdownItemSpecs from './dropdown-item.spec';
import DropdownMenuSpecs from './dropdown-menu.spec';
import DropdownTriggerSpecs from './dropdown-trigger.spec';
import DropdownSpecs from './dropdown.spec';
import DropdownFocusHandlerSpecs from './providers/dropdown-focus-handler.spec';

describe('Dropdown', () => {
  describe('Providers', () => {
    DropdownFocusHandlerSpecs();
  });

  describe('Components', () => {
    DropdownSpecs();
    DropdownMenuSpecs();
    DropdownItemSpecs();
    DropdownTriggerSpecs();
  });
});
