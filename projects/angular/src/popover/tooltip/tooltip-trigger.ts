/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, HostListener } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { TooltipIdService } from './providers/tooltip-id.service';
import { ClrDestroyService } from '../../utils/destroy';

@Directive({
  selector: '[clrTooltipTrigger]',
  host: {
    tabindex: '0',
    '[class.tooltip-trigger]': 'true',
    '[attr.aria-describedby]': 'ariaDescribedBy',
    '[attr.role]': '"button"',
  },
  providers: [ClrDestroyService],
})
export class ClrTooltipTrigger {
  public ariaDescribedBy: string;

  constructor(
    private toggleService: ClrPopoverToggleService,
    private tooltipIdService: TooltipIdService,
    destroy$: ClrDestroyService
  ) {
    // The aria-described by comes from the id of content. It
    this.tooltipIdService.id.pipe(takeUntil(destroy$)).subscribe(tooltipId => (this.ariaDescribedBy = tooltipId));
  }

  @HostListener('mouseenter')
  @HostListener('focus')
  showTooltip(): void {
    this.toggleService.open = true;
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  hideTooltip(): void {
    this.toggleService.open = false;
  }
}
