/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ClrPopoverService } from '../../utils/popover/providers/popover.service';

@Directive({
  selector: '[clrPopoverCloseButton]',
  host: {
    '[class.clr-smart-close-button]': 'true',
  },
  standalone: false,
})
export class ClrPopoverCloseButton implements OnDestroy, AfterViewInit {
  @Output('clrPopoverOnCloseChange') closeChange = new EventEmitter<void>();

  private subscriptions: Subscription[] = [];

  constructor(
    private elementRef: ElementRef<HTMLButtonElement>,
    private popoverService: ClrPopoverService
  ) {
    this.subscriptions.push(
      popoverService.openChange.pipe(filter(value => !value)).subscribe(() => {
        this.closeChange.next();
      })
    );
  }

  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent) {
    this.popoverService.toggleWithEvent(event);
    this.popoverService.setOpenedButtonFocus();
  }

  ngAfterViewInit() {
    this.popoverService.closeButtonRef = this.elementRef;
    this.popoverService.setCloseFocus();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
