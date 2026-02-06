/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, Inject, PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[clrKeyFocusItem]',
  standalone: false,
})
export class ClrKeyFocusItem {
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  get nativeElement() {
    return this.elementRef.nativeElement;
  }

  focus() {
    if (isPlatformBrowser(this.platformId)) {
      this.elementRef.nativeElement.focus();
    }
  }
}
