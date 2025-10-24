/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrPopoverService } from './providers/popover.service';

@Directive({
  standalone: true,
})
export class ClrStopEscapePropagationDirective implements OnInit, OnDestroy {
  private subscription: Subscription;
  private lastOpenChange: boolean | null = null;

  constructor(private popoverService: ClrPopoverService) {}

  ngOnInit() {
    this.subscription = this.popoverService.openChange.subscribe(open => {
      this.lastOpenChange = open;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  @HostListener('keyup.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.lastOpenChange !== null) {
      if (this.lastOpenChange === false) {
        event.stopPropagation();
      }

      this.lastOpenChange = null;
    }
  }
}
