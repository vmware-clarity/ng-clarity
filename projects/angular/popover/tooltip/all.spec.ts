/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import TooltipIdServiceSpecs from './providers/tooltip-id.service.spec';
import TooltipMouseServiceSpecs from './providers/tooltip-mouse.service.spec';
import TooltipContentSpecs from './tooltip-content.spec';
import TooltipTriggerSpecs from './tooltip-trigger.spec';
import TooltipSpecs from './tooltip.spec';

describe('Tooltip', () => {
  TooltipIdServiceSpecs();
  TooltipMouseServiceSpecs();
  TooltipContentSpecs();
  TooltipTriggerSpecs();
  TooltipSpecs();
});
