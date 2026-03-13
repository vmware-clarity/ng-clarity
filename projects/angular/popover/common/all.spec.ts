/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import IfOpenDirectiveSpecs from './if-open.directive.spec';
import ClrPopoverCloseButtonSpec from './popover-close-button.spec';
import ClrPopoverContentSpec from './popover-content.spec';
import ClrPopoverOpenCloseButtonSpec from './popover-open-close-button.spec';
import ClrPopoverOriginSpec from './popover-origin.spec';
import PopoverServiceSpec from './providers/popover.service.spec';
import ClrStopEscapePropagationDirectiveSpec from './stop-escape-propagation.directive.spec';

describe('ClrPopover', () => {
  describe('Service', () => {
    PopoverServiceSpec();
  });

  describe('Directive', () => {
    ClrPopoverOriginSpec();
    ClrPopoverOpenCloseButtonSpec();
    ClrPopoverCloseButtonSpec();
    ClrPopoverContentSpec();
    ClrStopEscapePropagationDirectiveSpec();
  });

  describe('clrIfOpen', function () {
    IfOpenDirectiveSpecs();
  });
});
