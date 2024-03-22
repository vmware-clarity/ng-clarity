/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ClrPopoverService } from './providers/popover.service';

@Directive({
  selector: '[clrPopoverCloseButton]',
  host: {
    '[class.clr-smart-close-button]': 'true',
  },
})
export class ClrPopoverCloseButton implements OnDestroy, AfterViewInit {
  @Output('clrPopoverOnCloseChange') closeChange = new EventEmitter<void>();

  private subscriptions: Subscription[] = [];

  constructor(private elementRef: ElementRef, private popoverService: ClrPopoverService) {
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
