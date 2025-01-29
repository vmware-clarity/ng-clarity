/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import DatalistContainerSpecs from './datalist-container.spec';
import DatalistInputSpecs from './datalist-input.spec';
import DatalistSpec from './datalist.spec';
import DatalistIdServiceSpecs from './providers/datalist-id.service.spec';

describe('ClrDatalist', function () {
  DatalistIdServiceSpecs();
  DatalistContainerSpecs();
  DatalistInputSpecs();
  DatalistSpec();
});
