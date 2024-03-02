/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
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

  constructor(private elementRef: ElementRef, private popoverStateService: ClrPopoverService) {
    this.subscriptions.push(
      this.popoverStateService.openChange.subscribe(change => {
        this.openCloseChange.next(change);
      })
    );
  }

  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent) {
    this.popoverStateService.openButtonRef = this.elementRef;
    this.popoverStateService.toggleWithEvent(event);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
