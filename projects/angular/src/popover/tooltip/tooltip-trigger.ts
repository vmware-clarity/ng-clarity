/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';

import { TooltipIdService } from './providers/tooltip-id.service';
import { TooltipMouseService } from './providers/tooltip-mouse.service';
import { ClrPopoverToggleService } from '../../popover/common/providers/popover-toggle.service';

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
  ariaDescribedBy: string;
  private subs: Subscription[] = [];

  constructor(
    private toggleService: ClrPopoverToggleService,
    tooltipIdService: TooltipIdService,
    private tooltipMouseService: TooltipMouseService
  ) {
    // The aria-described by comes from the id of content. It
    this.subs.push(tooltipIdService.id.subscribe(tooltipId => (this.ariaDescribedBy = tooltipId)));
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  @HostListener('focus')
  showTooltip(): void {
    this.toggleService.open = true;
  }

  @HostListener('blur')
  hideTooltip(): void {
    this.toggleService.open = false;
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
