/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Directive, ElementRef, NgZone } from '@angular/core';
import { delay, fromEvent, Subscription } from 'rxjs';

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
export class ClrDropdownTrigger implements AfterViewInit {
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

  ngAfterViewInit() {
    this.listenToMouseEvents();
  }

  listenToMouseEvents() {
    this.zone.runOutsideAngular(() => {
      this.subscriptions.push(
        fromEvent(this.el.nativeElement, 'click')
          .pipe(delay(0))
          .subscribe(event => {
            this.popoverService.toggleWithEvent(event);
          })
      );
    });
  }

  // @HostListener('click', ['$event'])
  // onDropdownTriggerClick(event: any): void {
  //   this.popoverService.toggleWithEvent(event);
  // }
}
