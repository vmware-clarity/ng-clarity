/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import ClrPopoverAnchorSpec from './popover-anchor.spec';
import ClrPopoverCloseButtonSpec from './popover-close-button.spec';
import ClrPopoverContentSpec from './popover-content.spec';
import ClrPopoverOpenCloseButtonSpec from './popover-open-close-button.spec';
import { ClrAlignmentSpec, ClrPositionTransformSpec, ClrViewportValidationSpec } from './position-operators.spec';
import PopoverServiceSpec from './providers/popover.service.spec';
import ClrStopEscapePropagationDirectiveSpec from './stop-escape-propagation.directive.spec';

describe('ClrPopover', () => {
  describe('ClrPositionOperator functions', () => {
    ClrPositionTransformSpec();
    -ClrAlignmentSpec();
    ClrViewportValidationSpec();
  });

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
