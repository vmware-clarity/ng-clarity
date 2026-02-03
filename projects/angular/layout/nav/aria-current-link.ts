/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, OnDestroy, OnInit } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[clrAriaCurrentLink]',
  host: { '[attr.aria-current]': 'ariaCurrent' },
  standalone: false,
})
export class ClrAriaCurrentLink implements OnInit, OnDestroy {
  ariaCurrent: string | undefined;
  private subscription: Subscription;

  constructor(private rla: RouterLinkActive) {}

  ngOnInit() {
    this.subscription = this.rla.isActiveChange.subscribe(isActive => {
      this.ariaCurrent = isActive ? 'page' : undefined;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
