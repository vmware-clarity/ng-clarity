/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, OnDestroy } from '@angular/core';

import { VerticalNavIconService } from './providers/vertical-nav-icon.service';

@Directive({
  selector: '[clrVerticalNavIcon]',
  host: { class: 'nav-icon' },
  standalone: false,
})
export class ClrVerticalNavIcon implements OnDestroy {
  constructor(private _verticalNavIconService: VerticalNavIconService) {
    _verticalNavIconService.registerIcon();
  }

  ngOnDestroy() {
    this._verticalNavIconService.unregisterIcon();
  }
}
