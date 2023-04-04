/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef } from '@angular/core';

import { POPOVER_HOST_ANCHOR } from '../../popover/common/popover-host-anchor.token';
import { ClrPopoverEventsService } from './providers/popover-events.service';
import { ClrPopoverPositionService } from './providers/popover-position.service';
import { ClrPopoverToggleService } from './providers/popover-toggle.service';
import { ClrStopEscapePropagationDirective } from './stop-escape-propagation.directive';

@Directive({
  standalone: true,
  providers: [
    ClrPopoverToggleService,
    ClrPopoverEventsService,
    ClrPopoverPositionService,
    { provide: POPOVER_HOST_ANCHOR, useExisting: ElementRef },
  ],
  hostDirectives: [ClrStopEscapePropagationDirective],
})
export class PopoverHostDirective {}
