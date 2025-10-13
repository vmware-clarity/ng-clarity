/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef } from '@angular/core';

import { ClrPopoverService } from './providers/popover.service';
import { ClrStopEscapePropagationDirective } from './stop-escape-propagation.directive';
import { POPOVER_HOST_ANCHOR } from '../../popover/common/popover-host-anchor.token';

@Directive({
  standalone: true,
  providers: [ClrPopoverService, { provide: POPOVER_HOST_ANCHOR, useExisting: ElementRef }],
  hostDirectives: [ClrStopEscapePropagationDirective],
})
export class ClrPopoverHostDirective {}
