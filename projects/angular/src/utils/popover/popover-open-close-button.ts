/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, EventEmitter, HostListener, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrPopoverToggleService } from './providers/popover-toggle.service';

@Directive({
  selector: '[clrPopoverOpenCloseButton]',
  host: {
    '[class.clr-smart-open-close]': 'true',
  },
  standalone: false,
})
export class ClrPopoverOpenCloseButton implements OnDestroy {
  @Output('clrPopoverOpenCloseChange') openCloseChange = new EventEmitter<boolean>();

  private subscriptions: Subscription[] = [];

  constructor(private smartOpenService: ClrPopoverToggleService) {
    this.subscriptions.push(
      smartOpenService.openChange.subscribe(change => {
        this.openCloseChange.next(change);
      })
    );
  }

  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent) {
    this.smartOpenService.toggleWithEvent(event);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
