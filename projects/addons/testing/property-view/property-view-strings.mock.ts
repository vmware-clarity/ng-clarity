/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { PropertyViewStrings } from '@clr/addons/property-view';

/**
 * Mock user-visible strings used in the 'appfx-property-view' library.
 */
@Injectable()
export class MockPropertyViewStrings extends PropertyViewStrings {
  toggle = 'Toggle {0} section';
  actions = 'Actions';
  categoryListItemsAreaLabel = '{0} items grouped in {1} sections.';
  categoryListItemAreaLabel = '{0} items grouped in 1 section.';
}
