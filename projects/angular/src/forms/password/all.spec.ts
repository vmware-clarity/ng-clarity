/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import PasswordContainerSpecs from './password-container.spec';
import PasswordSpecs from './password.spec';

describe('ClrPassword', function () {
  PasswordContainerSpecs();
  PasswordSpecs();
});
