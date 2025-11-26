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
import EventServiceSpec from './providers/popover-events.service.spec';
import PositionServiceSpec from './providers/popover-position.service.spec';
import ToggleServiceSpec from './providers/popover-toggle.service.spec';
import ClrStopEscapePropagationDirectiveSpec from './stop-escape-propagation.directive.spec';
import { ClrAlignmentSpec, ClrPositionTransformSpec, ClrViewportValidationSpec } from './utils/position-operators.spec';

describe('ClrPopover', () => {
  describe('ClrPositionOperator functions', () => {
    ClrPositionTransformSpec();
    ClrAlignmentSpec();
    ClrViewportValidationSpec();
  });

  describe('Service', () => {
    EventServiceSpec();
    ToggleServiceSpec();
    PositionServiceSpec();
  });

  describe('Directive', () => {
    ClrPopoverAnchorSpec();
    ClrPopoverOpenCloseButtonSpec();
    ClrPopoverCloseButtonSpec();
    ClrPopoverContentSpec();
    ClrStopEscapePropagationDirectiveSpec();
  });
});
