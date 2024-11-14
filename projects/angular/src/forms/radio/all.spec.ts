/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import RadioContainerSpecs from './radio-container.spec';
import RadioWrapperSpecs from './radio-wrapper.spec';
import RadioSpecs from './radio.spec';

describe('Radio component', function () {
  RadioContainerSpecs();
  RadioWrapperSpecs();
  RadioSpecs();
});
