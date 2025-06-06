/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { ElementRef, Inject, Injectable, PLATFORM_ID, Renderer2 } from '@angular/core';

import { uniqueIdFactory } from '../../id-generator/id-generator.service';
import { FocusableItem } from './focusable-item';

@Injectable()
export class BasicFocusableItem implements FocusableItem {
  id = uniqueIdFactory();
  disabled = false;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    renderer.setAttribute(el.nativeElement, 'id', this.id);
    renderer.setAttribute(el.nativeElement, 'tabindex', '-1');
  }

  focus() {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '0');
      this.el.nativeElement.focus();
      this.el.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }
  blur() {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '-1');
      this.el.nativeElement.blur();
    }
  }

  activate() {
    if (isPlatformBrowser(this.platformId)) {
      this.el.nativeElement.click();
    }
  }
}

export const BASIC_FOCUSABLE_ITEM_PROVIDER = [
  {
    provide: FocusableItem,
    useClass: BasicFocusableItem,
  },
];
