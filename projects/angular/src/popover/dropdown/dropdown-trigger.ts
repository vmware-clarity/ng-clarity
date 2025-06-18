/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { ClrDropdown } from './dropdown';
import { DropdownFocusHandler } from './providers/dropdown-focus-handler.service';
import { wrapHostContentInsideSpan } from './utils/content-wrapping';

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

  constructor(
    dropdown: ClrDropdown,
    private toggleService: ClrPopoverToggleService,
    private el: ElementRef<HTMLElement>,
    focusHandler: DropdownFocusHandler,
    private renderer: Renderer2
  ) {
    // if the containing dropdown has a parent, then this is not the root level one
    if (dropdown.parent) {
      this.isRootLevelToggle = false;
    }
    focusHandler.trigger = el.nativeElement;
  }

  get active(): boolean {
    return this.toggleService.open;
  }

  @HostListener('click', ['$event'])
  onDropdownTriggerClick(event: any): void {
    this.toggleService.toggleWithEvent(event);
  }

  ngAfterViewInit() {
    if (!this.isRootLevelToggle) {
      wrapHostContentInsideSpan(this.el.nativeElement, this.renderer, 'dropdown-item-content');
    }
  }
}
