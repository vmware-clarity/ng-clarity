/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import ClrPopoverAnchorSpec from './popover-anchor.spec';
import ClrPopoverCloseButtonSpec from './popover-close-button.spec';
import ClrPopoverOpenCloseButtonSpec from './popover-open-close-button.spec';
import ClrStopEscapePropagationDirectiveSpec from './stop-escape-propagation.directive.spec';
import PopoverServiceSpec from '../../utils/popover/providers/popover.service.spec';
import ClrPopoverContentSpec from '../common/popover-content.spec';

describe('ClrPopover', () => {
  describe('Service', () => {
    PopoverServiceSpec();
  });

  describe('Directive', () => {
    ClrPopoverAnchorSpec();
    ClrPopoverOpenCloseButtonSpec();
    ClrPopoverCloseButtonSpec();
    ClrPopoverContentSpec();
    ClrStopEscapePropagationDirectiveSpec();
  });
});
