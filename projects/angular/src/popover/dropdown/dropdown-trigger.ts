/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, HostListener, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrPopoverService } from '../../utils/popover/providers/popover.service';
import { ClrDropdown } from './dropdown';
import { DropdownFocusHandler } from './providers/dropdown-focus-handler.service';

@Directive({
  // We support both selectors for legacy reasons
  selector: '[clrDropdownTrigger],[clrDropdownToggle]',
  host: {
    '[class.dropdown-toggle]': 'isRootLevelToggle',
    '[class.dropdown-item]': '!isRootLevelToggle',
    '[class.expandable]': '!isRootLevelToggle',
    '[class.active]': 'active',
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'active',
  },
})
export class ClrDropdownTrigger {
  isRootLevelToggle = true;
  private subscriptions: Subscription[] = [];

  constructor(
    dropdown: ClrDropdown,
    private popoverService: ClrPopoverService,
    private el: ElementRef<HTMLElement>,
    focusHandler: DropdownFocusHandler,
    private zone: NgZone
  ) {
    // if the containing dropdown has a parent, then this is not the root level one
    if (dropdown.parent) {
      this.isRootLevelToggle = false;
    }
    focusHandler.trigger = el.nativeElement;
    this.popoverService.anchorElementRef = el;
  }

  get active(): boolean {
    return this.popoverService.open;
  }

  @HostListener('click', ['$event'])
  onDropdownTriggerClick(event: any): void {
    this.popoverService.toggleWithEvent(event);
  }
}
