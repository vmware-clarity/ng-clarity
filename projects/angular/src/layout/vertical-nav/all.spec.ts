/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import VerticalNavGroupRegistrationServiceSpecs from './providers/vertical-nav-group-registration.service.spec';
import VerticalNavIconServiceSpecs from './providers/vertical-nav-icon.service.spec';
import VerticalNavServiceSpecs from './providers/vertical-nav.service.spec';
import VerticalNavGroupSpecs from './vertical-nav-group.spec';
import VerticalNavIconDirectiveSpecs from './vertical-nav-icon.spec';
import VerticalNavLinkSpecs from './vertical-nav-link.spec';
import VerticalNavSpecs from './vertical-nav.spec';

describe('Vertical Nav', function () {
  describe('Providers', function () {
    VerticalNavServiceSpecs();
    VerticalNavIconServiceSpecs();
    VerticalNavGroupRegistrationServiceSpecs();
  });

  describe('Directives', function () {
    VerticalNavIconDirectiveSpecs();
    VerticalNavLinkSpecs();
    VerticalNavGroupSpecs();
    VerticalNavSpecs();
  });
});
