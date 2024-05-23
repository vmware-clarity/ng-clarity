/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, EventEmitter, HostListener, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrPopoverService } from './providers/popover.service';

@Directive({
  selector: '[clrPopoverOpenCloseButton]',
  host: {
    '[class.clr-smart-open-close]': 'true',
  },
})
export class ClrPopoverOpenCloseButton implements OnDestroy {
  @Output('clrPopoverOpenCloseChange') openCloseChange = new EventEmitter<boolean>();

  private subscriptions: Subscription[] = [];

  constructor(private elementRef: ElementRef, private popoverService: ClrPopoverService) {
    this.subscriptions.push(
      this.popoverService.openChange.subscribe(change => {
        this.openCloseChange.next(change);
      })
    );
  }

  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent) {
    this.popoverService.openButtonRef = this.elementRef;
    this.popoverService.toggleWithEvent(event);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
