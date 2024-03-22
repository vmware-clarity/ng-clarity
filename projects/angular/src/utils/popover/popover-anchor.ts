/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef } from '@angular/core';

import { ClrPopoverService } from './providers/popover.service';

@Directive({
  selector: '[clrPopoverAnchor]',
  host: {
    '[class.clr-anchor]': 'true',
  },
})
export class ClrPopoverAnchor {
  constructor(popoverService: ClrPopoverService, element: ElementRef) {
    popoverService.anchorElementRef = element;
  }
}
