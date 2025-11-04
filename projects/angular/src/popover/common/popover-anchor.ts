/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef } from '@angular/core';

import { ClrPopoverEventsService } from './providers/popover-events.service';

@Directive({
  selector: '[clrPopoverAnchor]',
  host: {
    '[class.clr-anchor]': 'true',
  },
  standalone: false,
})
export class ClrPopoverAnchor {
  constructor(smartEventService: ClrPopoverEventsService, element: ElementRef<HTMLButtonElement>) {
    smartEventService.anchorButtonRef = element;
  }
}
