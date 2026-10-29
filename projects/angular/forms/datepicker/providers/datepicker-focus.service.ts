/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, ElementRef, Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';

/**
 * This service focuses the day that is focusable in the calendar.
 */
@Injectable()
export class DatepickerFocusService {
  constructor(
    private injector: Injector,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  focusCell(elRef: ElementRef<HTMLElement>): void {
    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => elRef.nativeElement.querySelector<HTMLElement>('[tabindex="0"]')?.focus(), {
        injector: this.injector,
      });
    }
  }

  focusInput(element: HTMLInputElement): void {
    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => element.focus(), { injector: this.injector });
    }
  }

  elementIsFocused(element: HTMLInputElement) {
    return isPlatformBrowser(this.platformId) && document.activeElement === element;
  }
}
