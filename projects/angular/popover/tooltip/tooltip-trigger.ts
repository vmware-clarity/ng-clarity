/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, HostListener } from '@angular/core';
import { ClrPopoverService } from '@clr/angular/popover/common';

import { TooltipIdService } from './providers/tooltip-id.service';
import { TooltipMouseService } from './providers/tooltip-mouse.service';

@Directive({
  selector: '[clrTooltipTrigger]',
  host: {
    tabindex: '0',
    '[class.tooltip-trigger]': 'true',
    '[attr.aria-describedby]': 'ariaDescribedBy',
    '[attr.role]': '"button"',
  },
  standalone: false,
})
export class ClrTooltipTrigger {
  constructor(
    private popoverService: ClrPopoverService,
    private tooltipIdService: TooltipIdService,
    private tooltipMouseService: TooltipMouseService,
    element: ElementRef
  ) {
    popoverService.origin = element;
  }

  /**
   * The id of the tooltip content, which describes the trigger.
   */
  get ariaDescribedBy(): string {
    return this.tooltipIdService.id();
  }

  @HostListener('focus')
  showTooltip(): void {
    this.popoverService.open = true;
  }

  @HostListener('blur')
  hideTooltip(): void {
    this.popoverService.open = false;
  }

  @HostListener('mouseenter')
  private onMouseEnter() {
    this.tooltipMouseService.onMouseEnterTrigger();
  }

  @HostListener('mouseleave')
  private onMouseLeave() {
    this.tooltipMouseService.onMouseLeaveTrigger();
  }
}
