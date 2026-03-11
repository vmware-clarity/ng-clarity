/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef } from '@angular/core';

import { ClrPopoverService } from './providers/popover.service';

@Directive({
  selector: '[clrPopoverOrigin]',
  host: {
    '[class.clr-popover-origin]': 'true',
  },
  standalone: false,
})
export class ClrPopoverOrigin {
  constructor(popoverService: ClrPopoverService, element: ElementRef<HTMLButtonElement>) {
    popoverService.origin = element;
  }
}
