/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import AlertSpecs from './alert.spec';
import AlertsPagerSpecs from './alerts-pager.spec';
import AlertsSpecs from './alerts.spec';
import AlertIconAndTypesServiceSpecs from './providers/icon-and-types.service.spec';
import MultiAlertServiceSpecs from './providers/multi-alert.service.spec';

describe('Alert Tests', () => {
  AlertSpecs();
  AlertsSpecs();
  AlertsPagerSpecs();
  AlertIconAndTypesServiceSpecs();
  MultiAlertServiceSpecs();
});
