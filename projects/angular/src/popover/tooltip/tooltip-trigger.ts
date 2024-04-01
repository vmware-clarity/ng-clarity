/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';

import { PopoverCdkService } from '../../utils/popover/providers/popover-cdk.service';
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

  constructor(
    private popoverService: ClrPopoverService,
    private tooltipIdService: TooltipIdService,
    private tooltipMouseService: TooltipMouseService,
    private cdkService: PopoverCdkService
  ) {
    // The aria-described by comes from the id of content. It
    this.subs.push(this.tooltipIdService.id.subscribe(tooltipId => (this.ariaDescribedBy = tooltipId)));
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
    this.cdkService.showOverlay();
  }

  @HostListener('mouseleave')
  private onMouseLeave() {
    this.tooltipMouseService.onMouseLeaveTrigger();
    this.cdkService.removeOverlay();
  }
}
