/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, HostListener, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrPopoverService } from '../../utils/popover/providers/popover.service';
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
})
export class ClrTooltipTrigger {
  ariaDescribedBy: string;
  private subs: Subscription[] = [];
  private subscriptions = new Subscription();

  constructor(
    private popoverService: ClrPopoverService,
    tooltipIdService: TooltipIdService,
    private tooltipMouseService: TooltipMouseService,
    private zone: NgZone,
    private element: ElementRef
  ) {
    // The aria-described by comes from the id of content. It
    this.subs.push(tooltipIdService.id.subscribe(tooltipId => (this.ariaDescribedBy = tooltipId)));
    popoverService.anchorElementRef = element;
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
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
